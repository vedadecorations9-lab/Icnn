import { useState, useEffect, useRef, useMemo } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { isConvexConfigured } from '../convexClient';
import { INITIAL_ORDERS } from '../data/products';

function saveRejectedOrderNotice(booking) {
  if (!booking) return;
  try {
    const raw = localStorage.getItem('icon_rejected_order_notices');
    const list = raw ? JSON.parse(raw) : [];
    if (!list.some((item) => item.id === booking.id)) {
      list.push({
        id: booking.id,
        customerName: booking.customerName,
        email: booking.email,
        eventDate: booking.eventDate,
        items: booking.items,
        totalAUD: booking.totalAUD,
        rejectedAt: new Date().toISOString()
      });
      localStorage.setItem('icon_rejected_order_notices', JSON.stringify(list));
    }
  } catch {}
}

// 1. Hook for Convex Cloud Bookings Synchronization
export function useConvexBookingsStore(initialBookings = INITIAL_ORDERS, onToast) {
  const convexItems = useQuery(api.bookings?.list || 'bookings:list');
  const addMutation = useMutation(api.bookings?.add || 'bookings:add');
  const updateStatusMutation = useMutation(api.bookings?.updateStatus || 'bookings:updateStatus');
  const seedMutation = useMutation(api.bookings?.seedInitial || 'bookings:seedInitial');

  const hasSeededRef = useRef(false);
  const [optimisticRejectedIds, setOptimisticRejectedIds] = useState(() => new Set());

  // Auto-seed initial bookings into Convex on first setup only
  useEffect(() => {
    if (!convexItems || !Array.isArray(convexItems)) return;
    if (convexItems.length > 0) {
      try {
        localStorage.setItem('icon_bookings_initialized', 'true');
      } catch {}
      return;
    }

    let isInit = false;
    try {
      isInit = localStorage.getItem('icon_bookings_initialized') === 'true';
    } catch {}

    if (!isInit && !hasSeededRef.current && typeof seedMutation === 'function') {
      hasSeededRef.current = true;
      try {
        localStorage.setItem('icon_bookings_initialized', 'true');
      } catch {}
      seedMutation({ initialBookings }).catch((err) =>
        console.warn('Convex booking seeding note:', err?.message || err)
      );
    }
  }, [convexItems, initialBookings, seedMutation]);

  const bookings = useMemo(() => {
    const source = Array.isArray(convexItems) ? convexItems : initialBookings;
    return source.map((b) =>
      optimisticRejectedIds.has(b.id) || optimisticRejectedIds.has(b._id)
        ? { ...b, status: 'Rejected' }
        : b
    );
  }, [convexItems, initialBookings, optimisticRejectedIds]);

  const handleUpdateBookingStatus = async (bookingId, newStatus) => {
    try {
      await updateStatusMutation({ id: bookingId, status: newStatus });
      if (newStatus.toLowerCase() === 'delivered') {
        onToast?.(`Order #${bookingId} marked as DELIVERED successfully! Fulfillment logged.`, 'success');
      } else if (newStatus.toLowerCase() === 'dispatched') {
        onToast?.(`Order #${bookingId} marked as DISPATCHED for delivery run.`, 'gold');
      } else {
        onToast?.(`Order #${bookingId} updated to "${newStatus}"`, 'info');
      }
    } catch (e) {
      console.error(e);
      onToast?.('Failed to update booking in cloud', 'warning');
    }
  };

  const handleAddBooking = async (newBooking) => {
    try {
      const { _id, _creationTime, ...cleanBooking } = newBooking;
      await addMutation(cleanBooking);
      onToast?.(`New Order #${newBooking.id} initiated successfully!`, 'success');
    } catch (e) {
      console.error(e);
      onToast?.('Failed to create booking in cloud', 'warning');
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    if (!bookingId) return;
    const target = bookings.find((b) => b.id === bookingId || b._id === bookingId);
    if (target) saveRejectedOrderNotice(target);

    setOptimisticRejectedIds((prev) => new Set([...prev, bookingId]));
    try {
      await updateStatusMutation({ id: bookingId, status: 'Rejected' });
      onToast?.(`Order #${bookingId} deleted & customer notified of rejection by Owner`, 'gold');
    } catch (e) {
      console.error(e);
      onToast?.('Failed to delete order in cloud', 'warning');
    }
  };

  return {
    bookings,
    isRealtime: true,
    handleUpdateBookingStatus,
    handleAddBooking,
    handleDeleteBooking
  };
}

// 2. Hook for Local State + LocalStorage (Persistent without server dependency)
export function useLocalBookingsStore(initialBookings = INITIAL_ORDERS, onToast) {
  const [bookings, setBookings] = useState(() => {
    try {
      const saved = localStorage.getItem('icon_event_bookings');
      return saved ? JSON.parse(saved) : initialBookings;
    } catch {
      return initialBookings;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('icon_event_bookings', JSON.stringify(bookings));
    } catch (e) {
      console.error(e);
    }
  }, [bookings]);

  const handleUpdateBookingStatus = (bookingId, newStatus) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b))
    );

    if (newStatus.toLowerCase() === 'delivered') {
      onToast?.(`Order #${bookingId} marked as DELIVERED successfully! Fulfillment logged.`, 'success');
    } else if (newStatus.toLowerCase() === 'dispatched') {
      onToast?.(`Order #${bookingId} marked as DISPATCHED for delivery run.`, 'gold');
    } else {
      onToast?.(`Order #${bookingId} updated to "${newStatus}"`, 'info');
    }
  };

  const handleAddBooking = (newBooking) => {
    setBookings((prev) => [newBooking, ...prev]);
    onToast?.(`New Order #${newBooking.id} initiated successfully!`, 'success');
  };

  const handleDeleteBooking = (bookingId) => {
    const target = bookings.find((b) => b.id === bookingId || b._id === bookingId);
    if (target) saveRejectedOrderNotice(target);

    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId || b._id === bookingId ? { ...b, status: 'Rejected' } : b
      )
    );
    onToast?.(`Order #${bookingId} deleted & customer notified of rejection by Owner`, 'gold');
  };

  return {
    bookings,
    isRealtime: false,
    handleUpdateBookingStatus,
    handleAddBooking,
    handleDeleteBooking
  };
}

// Unified Hook: Automatically uses Convex if configured, else LocalStorage
export function useBookingsData(initialBookings = INITIAL_ORDERS, onToast) {
  const hasConvex = isConvexConfigured();
  if (hasConvex) {
    return useConvexBookingsStore(initialBookings, onToast);
  }
  return useLocalBookingsStore(initialBookings, onToast);
}

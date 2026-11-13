import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { isConvexConfigured } from '../convexClient';
import { INITIAL_ORDERS } from '../data/products';

// 1. Hook for Convex Cloud Bookings Synchronization
export function useConvexBookingsStore(initialBookings = INITIAL_ORDERS, onToast) {
  const convexItems = useQuery(api.bookings?.list || 'bookings:list');
  const addMutation = useMutation(api.bookings?.add || 'bookings:add');
  const updateStatusMutation = useMutation(api.bookings?.updateStatus || 'bookings:updateStatus');
  const seedMutation = useMutation(api.bookings?.seedInitial || 'bookings:seedInitial');

  const hasSeededRef = useRef(false);

  // Auto-seed initial bookings into Convex if empty
  useEffect(() => {
    if (
      convexItems &&
      Array.isArray(convexItems) &&
      convexItems.length === 0 &&
      !hasSeededRef.current &&
      typeof seedMutation === 'function'
    ) {
      hasSeededRef.current = true;
      seedMutation({ initialBookings })
        .then(() => {
          console.log('Convex bookings initialized');
        })
        .catch((err) => console.warn('Convex booking seeding note:', err?.message || err));
    }
  }, [convexItems, initialBookings, seedMutation]);

  const bookings = Array.isArray(convexItems) && convexItems.length > 0 ? convexItems : initialBookings;

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
      await addMutation(newBooking);
      onToast?.(`New Order #${newBooking.id} initiated successfully!`, 'success');
    } catch (e) {
      console.error(e);
      onToast?.('Failed to create booking in cloud', 'warning');
    }
  };

  return {
    bookings,
    isRealtime: true,
    handleUpdateBookingStatus,
    handleAddBooking
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

  return {
    bookings,
    isRealtime: false,
    handleUpdateBookingStatus,
    handleAddBooking
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


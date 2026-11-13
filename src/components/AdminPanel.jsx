import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Menu,
  Package,
  Plus,
  Search,
  Edit3,
  Trash2,
  Eye,
  Check,
  X,
  AlertTriangle,
  RotateCcw,
  SlidersHorizontal,
  DollarSign,
  Shield,
  Truck,
  Calendar,
  Building2,
  ChevronRight,
  ExternalLink,
  Sparkles,
  ArrowRight,
  Layers,
  BarChart3,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  Mail,
  List,
  LayoutGrid,
  LogOut,
  Bell,
  MessageSquare
} from 'lucide-react';
import { CATEGORIES, BRISBANE_STORE_INFO, INITIAL_ORDERS } from '../data/products';

// Available gallery images from public/assets/images/items/
const EQUIPMENT_IMAGE_OPTIONS = [
  { label: '6x3m White Commercial Gazebo', path: '/assets/images/items/Icon 6x3 m Gazebo Hire-2-1024x1024.webp', cat: 'gazebo' },
  { label: '6x3m Sky Blue Gazebo', path: '/assets/images/items/Blue 6x3 Gazebo for Hire - $70-1024x1024.webp', cat: 'gazebo' },
  { label: '3D Silk Floral Wall (2.4m)', path: '/assets/images/items/Icon Party Hire flower wall-1024x1024.webp', cat: 'backdrops' },
  { label: 'Pastel Pink Ripple Arch Trio', path: '/assets/images/items/Three pink arches for hire-1-1024x1024.webp', cat: 'backdrops' },
  { label: 'Sky Blue Ripple Arch Trio', path: '/assets/images/items/Three blue arches for party hire-3-1024x1024.webp', cat: 'backdrops' },
  { label: 'White Tiffany Resin Chair', path: '/assets/images/items/Icon Party Hire Chair Rental-1-1024x1819.webp', cat: 'chairs' },
  { label: 'Outdoor Folding Chair', path: '/assets/images/items/Outdoor chair hire with pearlescent header-1024x941.webp', cat: 'chairs' },
  { label: 'Silver Cocktail High-Top Table', path: '/assets/images/items/Foldable Silver Cocktail Table Hire-6-1024x1024.webp', cat: 'tables' },
  { label: '1.8m Round Banquet Table', path: '/assets/images/items/Icon Party Hire round folding table-4-1024x768.webp', cat: 'tables' },
  { label: '6ft Trestle Folding Table', path: '/assets/images/items/Icon Party Hire Folding Table Showcase-3-1024x972.webp', cat: 'tables' },
  { label: 'Vintage Edison Festoon Lights (20m)', path: '/assets/images/items/festoon-lighting.webp', cat: 'lighting' },
  { label: 'Cold Spark FX Machines (Pair)', path: '/assets/images/items/Spark machines for hire $80-1024x1024.webp', cat: 'lighting' },
  { label: 'Dancing on Clouds Low Fog FX', path: '/assets/images/items/Icon Party Hire Low Fog Ad-1024x1024.webp', cat: 'av' },
  { label: 'Spandex Stretch Chair Cover', path: '/assets/images/items/Icon Party Hire Chair Cover-2-1024x1024.webp', cat: 'linen' },
  { label: 'Commercial 40MJ Patio Heater', path: '/assets/images/items/patio-heater.webp', cat: 'heaters' },
  { label: '100L Heavy-Duty Cooler Esky', path: '/assets/images/items/commercial-esky.webp', cat: 'esky' },
  { label: 'Twin Beverage Dispensers', path: '/assets/images/items/Pink Pearl Beverage Dispensers For Hire-1024x1024.webp', cat: 'esky' },
  { label: 'Commercial Chafing Dishes Set', path: '/assets/images/items/Icon Party Hire chafing dishes-5-1024x1115.webp', cat: 'esky' },
  { label: '28L Water Boiler / Tea Urn', path: '/assets/images/items/MAXKON 28L water boiler hire-7-1024x1024.webp', cat: 'esky' },
  { label: 'Fluted White Plinth Trio', path: '/assets/images/items/Icon Party Hire white plinths-1024x907.webp', cat: 'plinth' },
  { label: 'Fluted Pink Plinth Trio', path: '/assets/images/items/Pink plinth trio in garden hire ad-1024x907.webp', cat: 'plinth' },
  { label: 'Gold Mirror Cake Stand Trio', path: '/assets/images/items/Icon Party Hire gold cake stand trio-1024x1024.webp', cat: 'plinth' },
  { label: '400W Bluetooth PA Audio & Mics', path: '/assets/images/items/party-audio-system.webp', cat: 'av' },
];

export default function AdminPanel({
  onClose,
  products = [],
  categories = [],
  bookings: propBookings,
  onUpdateBookingStatus: propUpdateBookingStatus,
  onAddBooking: propAddBooking,
  isRealtime = false,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onUpdateProductStock,
  onResetProducts,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
  onResetCategories,
  onToast
}) {
  const activeCategories = categories && categories.length > 0 ? categories : CATEGORIES;
  // Navigation Tabs: 'inventory' | 'overview' | 'bookings' | 'logistics'
  const [activeTab, setActiveTab] = useState('inventory');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'
  const mainScrollRef = useRef(null);
  const todayDateStr = useMemo(() => new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' }), []);

  const handleExitPortal = () => {
    try {
      sessionStorage.removeItem('icon_admin_passcode_auth');
      localStorage.removeItem('icon_admin_passcode_auth');
    } catch {}
    onClose?.();
  };

  // Guarantee native mouse wheel scrolling in Admin Panel: pause Lenis on mount and resume on unmount
  useEffect(() => {
    if (typeof window !== 'undefined' && window.__iconLenis) {
      window.__iconLenis.stop();
      return () => {
        window.__iconLenis?.start();
      };
    }
  }, []);

  // Prevent any wheel event from bubbling to window where external smooth-scroll libraries might intercept it
  useEffect(() => {
    const mainEl = mainScrollRef.current;
    if (!mainEl) return;
    const handleWheel = (e) => {
      e.stopPropagation();
    };
    mainEl.addEventListener('wheel', handleWheel, { passive: true });
    return () => mainEl.removeEventListener('wheel', handleWheel);
  }, []);

  // Category Management State
  const [categorySearch, setCategorySearch] = useState('');
  const [isCreateCategoryModalOpen, setIsCreateCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deletingCategoryId, setDeletingCategoryId] = useState(null);
  const [categoryDeleteWarning, setCategoryDeleteWarning] = useState(null);

  const initialCategoryFormState = {
    id: '',
    label: '',
    shortLabel: '',
    tag: 'Event Essential',
    startingPrice: 50,
    image: '/assets/images/items/Icon 6x3 m Gazebo Hire-2-1024x1024.webp',
    pills: 'Commercial Grade, Brisbane Fleet',
    description: 'Commercial event party equipment range maintained in pristine condition.'
  };
  const [categoryFormData, setCategoryFormData] = useState(initialCategoryFormState);

  // Category Open Handlers
  const handleOpenCategoryCreate = () => {
    setCategoryFormData({
      ...initialCategoryFormState,
      id: `cat-${Date.now().toString().slice(-4)}`
    });
    setIsCreateCategoryModalOpen(true);
  };

  const handleOpenCategoryEdit = (cat) => {
    setCategoryFormData({
      id: cat.id,
      label: cat.label || '',
      shortLabel: cat.shortLabel || cat.label || '',
      tag: cat.tag || 'Event Essential',
      startingPrice: cat.startingPrice || 50,
      image: cat.image || '/assets/images/items/Icon 6x3 m Gazebo Hire-2-1024x1024.webp',
      pills: Array.isArray(cat.pills) ? cat.pills.join(', ') : (cat.pills || ''),
      description: cat.description || ''
    });
    setEditingCategory(cat);
  };

  // Category Submit Handlers
  const handleSubmitCategoryCreate = (e) => {
    e.preventDefault();
    if (!categoryFormData.label.trim()) {
      onToast?.('Please enter a category name', 'warning');
      return;
    }
    const slug = categoryFormData.id.trim() || categoryFormData.label.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const pillsArr = categoryFormData.pills
      ? categoryFormData.pills.split(',').map(s => s.trim()).filter(Boolean)
      : ['Commercial Grade', 'Brisbane Fleet'];
    const count = products.filter(p => p.category === slug).length;

    const newCat = {
      id: slug,
      label: categoryFormData.label.trim(),
      shortLabel: categoryFormData.shortLabel.trim() || categoryFormData.label.trim(),
      tag: categoryFormData.tag.trim() || 'Event Essential',
      startingPrice: Number(categoryFormData.startingPrice) || 50,
      itemCount: count,
      pills: pillsArr,
      image: categoryFormData.image,
      description: categoryFormData.description.trim() || 'Commercial party hire equipment range.'
    };

    onAddCategory?.(newCat);
    setIsCreateCategoryModalOpen(false);
  };

  const handleSubmitCategoryEdit = (e) => {
    e.preventDefault();
    if (!categoryFormData.label.trim() || !editingCategory) return;
    const pillsArr = categoryFormData.pills
      ? categoryFormData.pills.split(',').map(s => s.trim()).filter(Boolean)
      : ['Commercial Grade', 'Brisbane Fleet'];
    const count = products.filter(p => p.category === editingCategory.id).length;

    const updatedCat = {
      ...editingCategory,
      label: categoryFormData.label.trim(),
      shortLabel: categoryFormData.shortLabel.trim() || categoryFormData.label.trim(),
      tag: categoryFormData.tag.trim() || 'Event Essential',
      startingPrice: Number(categoryFormData.startingPrice) || 50,
      itemCount: count,
      pills: pillsArr,
      image: categoryFormData.image,
      description: categoryFormData.description.trim()
    };

    onUpdateCategory?.(updatedCat);
    setEditingCategory(null);
  };

  // Attempt Delete Category with Safety Check
  const handleAttemptDeleteCategory = (cat) => {
    const linked = products.filter(p => p.category === cat.id);
    if (linked.length > 0) {
      setCategoryDeleteWarning({
        category: cat,
        count: linked.length,
        sampleNames: linked.slice(0, 3).map(p => p.name)
      });
    } else {
      setDeletingCategoryId(cat.id);
    }
  };

  // Filter Categories
  const filteredCategories = useMemo(() => {
    if (!categorySearch.trim()) return activeCategories;
    const q = categorySearch.toLowerCase();
    return activeCategories.filter(c =>
      (c.label && c.label.toLowerCase().includes(q)) ||
      (c.id && c.id.toLowerCase().includes(q)) ||
      (c.tag && c.tag.toLowerCase().includes(q)) ||
      (c.description && c.description.toLowerCase().includes(q))
    );
  }, [activeCategories, categorySearch]);

  // Search & Filtering State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [stockFilter, setStockFilter] = useState('all'); // 'all' | 'in_stock' | 'low_stock' | 'out_of_stock'
  const [sortBy, setSortBy] = useState('name_asc'); // 'name_asc' | 'price_desc' | 'price_asc' | 'stock_desc'

  // CRUD Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProductId, setDeletingProductId] = useState(null);
  const [inspectingProduct, setInspectProduct] = useState(null);

  // Form State for Create & Edit
  const initialFormState = {
    name: '',
    category: 'gazebo',
    priceAUD: 85,
    bondAUD: 50,
    stock: 10,
    sku: '',
    image: '/assets/images/items/Icon 6x3 m Gazebo Hire-2-1024x1024.webp',
    badge: 'Popular Hire',
    hirePeriod: '24–72 Hours Flexible Weekend Hire',
    dimensions: 'Commercial Event Spec',
    material: 'Commercial Heavy-Duty Specification',
    description: 'Commercial-grade party hire equipment maintained in pristine condition in our Brisbane warehouse.'
  };

  const [formData, setFormData] = useState(initialFormState);

  // Real Event Bookings State (Synchronized with Cloud / LocalStorage)
  const [localBookings, setLocalBookings] = useState(() => {
    try {
      const saved = localStorage.getItem('icon_event_bookings');
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const bookings = propBookings && propBookings.length >= 0 ? propBookings : localBookings;
  const [bookingFilter, setBookingFilter] = useState('all');
  const [isCreateBookingModalOpen, setIsCreateBookingModalOpen] = useState(false);

  // Booking Form State for Manual Admin Order Initiation
  const initialBookingFormState = {
    customerName: '',
    phone: '',
    email: '',
    city: 'New Farm, Brisbane QLD',
    eventDate: 'This Saturday, 2:00 PM',
    eventType: 'Birthday Celebration',
    items: '',
    totalAUD: 280,
    carrier: 'Icon Van 1 (Brisbane Delivery)',
    paymentStatus: 'Paid ($100 Bond Held)'
  };
  const [bookingFormData, setBookingFormData] = useState(initialBookingFormState);

  // Handle Booking Status Updates (Delivered, Dispatched, Confirmed, Returned)
  const handleBookingStatusChange = (bookingId, newStatus) => {
    if (propUpdateBookingStatus) {
      propUpdateBookingStatus(bookingId, newStatus);
    } else {
      setLocalBookings(prev => {
        const updated = prev.map(b => (b.id === bookingId ? { ...b, status: newStatus } : b));
        try {
          localStorage.setItem('icon_event_bookings', JSON.stringify(updated));
        } catch (e) {
          console.error(e);
        }
        return updated;
      });

      if (newStatus.toLowerCase() === 'delivered') {
        onToast?.(`Order #${bookingId} marked as DELIVERED successfully! Fulfillment logged.`, 'success');
      } else if (newStatus.toLowerCase() === 'dispatched') {
        onToast?.(`Order #${bookingId} marked as DISPATCHED for delivery run.`, 'gold');
      } else {
        onToast?.(`Order #${bookingId} updated to "${newStatus}"`, 'info');
      }
    }
  };

  // Open Manual Order Modal
  const handleOpenBookingCreate = () => {
    setBookingFormData({
      ...initialBookingFormState,
      items: products.length > 0 ? `${products[0].name} (x1)` : 'Event Equipment Hire Package'
    });
    setIsCreateBookingModalOpen(true);
  };

  // Submit Manual Order Initiation
  const handleSubmitBookingCreate = (e) => {
    e.preventDefault();
    if (!bookingFormData.customerName.trim()) {
      onToast?.('Please enter a customer name', 'warning');
      return;
    }

    const generatedId = `IPH-AU-${Math.floor(10000 + Math.random() * 90000)}`;
    const itemsArray = bookingFormData.items
      ? bookingFormData.items.split(',').map(s => s.trim()).filter(Boolean)
      : ['Party Equipment Package'];

    const newBooking = {
      id: generatedId,
      customerName: bookingFormData.customerName.trim(),
      phone: bookingFormData.phone.trim() || '+61 400 000 000',
      email: bookingFormData.email.trim() || 'customer@partyhire.com.au',
      city: bookingFormData.city.trim() || 'Brisbane QLD',
      eventDate: bookingFormData.eventDate.trim() || 'Upcoming Weekend',
      eventType: bookingFormData.eventType.trim() || 'Party Hire Event',
      items: itemsArray,
      totalAUD: Number(bookingFormData.totalAUD) || 200,
      status: 'Confirmed',
      carrier: bookingFormData.carrier,
      tracking: `IPH-DEL-${Math.floor(10000 + Math.random() * 90000)}`,
      date: 'Just now',
      paymentStatus: bookingFormData.paymentStatus || 'Paid ($100 Bond Held)'
    };

    if (propAddBooking) {
      propAddBooking(newBooking);
    } else {
      setLocalBookings(prev => {
        const updated = [newBooking, ...prev];
        try {
          localStorage.setItem('icon_event_bookings', JSON.stringify(updated));
        } catch (err) {
          console.error(err);
        }
        return updated;
      });
      onToast?.(`New Order #${generatedId} initiated successfully!`, 'success');
    }

    setIsCreateBookingModalOpen(false);
  };

  // Open Create Modal
  const handleOpenCreate = () => {
    const randomSKU = `IPH-${Math.floor(100 + Math.random() * 900)}`;
    setFormData({
      ...initialFormState,
      sku: randomSKU
    });
    setIsCreateModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (prod) => {
    setFormData({
      name: prod.name || '',
      category: prod.category || 'gazebo',
      priceAUD: prod.priceAUD || Math.round((prod.priceINR || 0) * 0.0185) || 50,
      bondAUD: prod.bondAUD || 50,
      stock: prod.stock ?? 10,
      sku: prod.sku || `IPH-${prod.id}`,
      image: prod.image || '/assets/images/items/Icon 6x3 m Gazebo Hire-2-1024x1024.webp',
      badge: prod.badge || '',
      hirePeriod: prod.hirePeriod || '24–72 Hours Flexible Weekend Hire',
      dimensions: prod.dimensions || 'Commercial Event Spec',
      material: prod.material || 'Commercial Specification',
      description: prod.description || ''
    });
    setEditingProduct(prod);
  };

  // Submit Create Equipment Form
  const handleSubmitCreate = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      onToast?.('Please enter an equipment name', 'warning');
      return;
    }

    const catObj = activeCategories.find(c => c.id === formData.category) || activeCategories[0] || CATEGORIES[0];
    const price = Number(formData.priceAUD) || 50;

    const newProduct = {
      id: `icon-${Date.now().toString().slice(-4)}`,
      name: formData.name.trim(),
      category: formData.category,
      categoryLabel: catObj.label,
      priceAUD: price,
      priceINR: Math.round(price / 0.0185),
      originalAUD: Math.round(price * 1.25),
      discount: '-20%',
      rating: 5.0,
      reviewsCount: 1,
      badge: formData.badge || 'New Arrival',
      badgeType: 'badge-gold',
      image: formData.image,
      description: formData.description,
      origin: 'Icon Warehouse Hub · Murrumba Downs QLD',
      material: formData.material,
      dimensions: formData.dimensions,
      hirePeriod: formData.hirePeriod,
      bondAUD: Number(formData.bondAUD) || 50,
      stock: parseInt(formData.stock, 10) || 5,
      sku: formData.sku || `IPH-AU-${Math.floor(100 + Math.random() * 900)}`,
      pills: [catObj.label, 'Brisbane Warehouse', 'Commercial Grade']
    };

    onAddProduct?.(newProduct);
    setIsCreateModalOpen(false);
  };

  // Submit Edit Equipment Form
  const handleSubmitEdit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !editingProduct) return;

    const catObj = activeCategories.find(c => c.id === formData.category) || activeCategories[0] || CATEGORIES[0];
    const price = Number(formData.priceAUD) || 50;

    const updatedProduct = {
      ...editingProduct,
      name: formData.name.trim(),
      category: formData.category,
      categoryLabel: catObj.label,
      priceAUD: price,
      priceINR: Math.round(price / 0.0185),
      originalAUD: Math.round(price * 1.25),
      badge: formData.badge,
      image: formData.image,
      description: formData.description,
      material: formData.material,
      dimensions: formData.dimensions,
      hirePeriod: formData.hirePeriod,
      bondAUD: Number(formData.bondAUD) || 50,
      stock: parseInt(formData.stock, 10) || 0,
      sku: formData.sku
    };

    onUpdateProduct?.(updatedProduct);
    setEditingProduct(null);
  };

  // Confirm Delete
  const handleConfirmDelete = () => {
    if (deletingProductId) {
      onDeleteProduct?.(deletingProductId);
      setDeletingProductId(null);
    }
  };

  // Filtered & Sorted Products for READ operation
  const filteredProducts = useMemo(() => {
    return products
      .filter(p => {
        // Search Filter
        const query = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !query ||
          p.name.toLowerCase().includes(query) ||
          (p.sku && p.sku.toLowerCase().includes(query)) ||
          p.category.toLowerCase().includes(query) ||
          (p.material && p.material.toLowerCase().includes(query));

        // Category Filter
        const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;

        // Stock Filter
        let matchesStock = true;
        if (stockFilter === 'in_stock') matchesStock = (p.stock || 0) > 5;
        if (stockFilter === 'low_stock') matchesStock = (p.stock || 0) > 0 && (p.stock || 0) <= 5;
        if (stockFilter === 'out_of_stock') matchesStock = (p.stock || 0) === 0;

        return matchesSearch && matchesCat && matchesStock;
      })
      .sort((a, b) => {
        const priceA = a.priceAUD || Math.round((a.priceINR || 0) * 0.0185);
        const priceB = b.priceAUD || Math.round((b.priceINR || 0) * 0.0185);

        if (sortBy === 'name_asc') return a.name.localeCompare(b.name);
        if (sortBy === 'price_desc') return priceB - priceA;
        if (sortBy === 'price_asc') return priceA - priceB;
        if (sortBy === 'stock_desc') return (b.stock || 0) - (a.stock || 0);
        return 0;
      });
  }, [products, searchQuery, selectedCategory, stockFilter, sortBy]);

  // Aggregate KPI Calculations
  const stats = useMemo(() => {
    const totalItems = products.length;
    const totalUnits = products.reduce((sum, p) => sum + (p.stock || 0), 0);
    const lowStockCount = products.filter(p => (p.stock || 0) <= 5).length;
    const totalCatalogValue = products.reduce((sum, p) => {
      const price = p.priceAUD || Math.round((p.priceINR || 0) * 0.0185);
      return sum + price * (p.stock || 0);
    }, 0);

    return { totalItems, totalUnits, lowStockCount, totalCatalogValue };
  }, [products]);

  // Real Dynamic Bookings & Revenue Calculations (Zero Fake Data)
  const bookingStats = useMemo(() => {
    const totalBookingsCount = bookings.length;
    const confirmedBookings = bookings.filter(b => (b.status || '').toLowerCase() === 'confirmed');
    const dispatchedBookings = bookings.filter(b => (b.status || '').toLowerCase() === 'dispatched');
    const deliveredBookings = bookings.filter(b => (b.status || '').toLowerCase() === 'delivered');
    const returnedBookings = bookings.filter(b => (b.status || '').toLowerCase() === 'returned');

    // Real Gross Hire Income (Sum of actual bookings in system)
    const totalIncomeAUD = bookings.reduce((sum, b) => sum + (Number(b.totalAUD) || 0), 0);

    // Real Security Bonds Held (Sum of security bonds from active, non-returned bookings)
    const totalBondsAUD = bookings
      .filter(b => (b.status || '').toLowerCase() !== 'returned')
      .reduce((sum, b) => {
        if (b.bondAUD) return sum + Number(b.bondAUD);
        const match = (b.paymentStatus || '').match(/\$(\d+)/);
        return sum + (match ? Number(match[1]) : 100);
      }, 0);

    return {
      totalBookingsCount,
      confirmedBookings,
      dispatchedBookings,
      deliveredBookings,
      returnedBookings,
      totalIncomeAUD,
      totalBondsAUD,
      confirmedCount: confirmedBookings.length,
      dispatchedCount: dispatchedBookings.length,
      deliveredCount: deliveredBookings.length,
      returnedCount: returnedBookings.length
    };
  }, [bookings]);

  const targetDeleteProduct = products.find(p => p.id === deletingProductId);

  return (
    <div className="icon-admin-portal" data-lenis-prevent="true" role="dialog" aria-modal="true" aria-label="Icon Party Hire Operations Hub">

      {/* Mobile Backdrop for Sidebar Drawer */}
      {isSidebarOpen && (
        <div className="admin-drawer-overlay show-mobile" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* =====================================================================
         1. PROFESSIONAL DARK NOCTURNAL SIDEBAR
         ===================================================================== */}
      <aside className={`admin-portal-sidebar ${isSidebarOpen ? 'drawer-open' : ''}`}>
        
        {/* Brand Header Lockup */}
        <div className="admin-sidebar-header">
          <div className="admin-brand-lockup">
            <div className="admin-brand-logo-frame">
              <img
                src="/assets/images/icon_logo.png"
                alt="Icon Party Hire Circular Logo"
                className="admin-brand-logo-img"
              />
            </div>
            <div className="admin-brand-titles">
              <h1 className="admin-brand-name">ICON PARTY HIRE</h1>
              <span className="admin-brand-sub">OPERATIONS HQ · BRISBANE</span>
            </div>
          </div>

          <button
            type="button"
            className="admin-sidebar-close show-mobile"
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Live Warehouse Badge */}
        <div className="admin-hub-status-pill">
          <span className="status-live-pulse" />
          <div className="status-text-stack">
            <span className="status-hub-title">Murrumba Downs Hub</span>
            <span className="status-hub-meta">Brisbane, QLD · Active Fleet</span>
          </div>
        </div>

        {/* Realtime Cloud / Local Indicator */}
        <div className={`admin-sync-pill ${isRealtime ? 'is-convex' : 'is-local'}`} title={isRealtime ? 'Convex Cloud Sync is active with real-time WebSocket connection' : 'Running in Local Storage. Set VITE_CONVEX_URL in Vercel to activate instant multi-device real-time sync.'}>
          <span className={`sync-status-dot ${isRealtime ? 'dot-active' : 'dot-local'}`} />
          <div className="status-text-stack">
            <span className="status-hub-title">
              {isRealtime ? 'Convex Cloud Live' : 'Local Storage Mode'}
            </span>
            <span className="status-hub-meta">
              {isRealtime ? 'Real-Time WebSocket' : 'Set VITE_CONVEX_URL'}
            </span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="admin-nav-menu" aria-label="Operations Navigation">
          <div className="admin-nav-group-label">STORE MANAGEMENT</div>
          
          <button
            type="button"
            className={`admin-nav-item ${activeTab === 'inventory' ? 'active' : ''}`}
            onClick={() => { setActiveTab('inventory'); setIsSidebarOpen(false); }}
          >
            <div className="nav-item-icon">
              <Package size={18} />
            </div>
            <span className="nav-item-text">Equipment Items</span>
            <span className="nav-item-badge">{products.length}</span>
          </button>

          <button
            type="button"
            className={`admin-nav-item ${activeTab === 'categories' ? 'active' : ''}`}
            onClick={() => { setActiveTab('categories'); setIsSidebarOpen(false); }}
          >
            <div className="nav-item-icon">
              <Layers size={18} />
            </div>
            <span className="nav-item-text">Category Cards</span>
            <span className="nav-item-badge">{activeCategories.length}</span>
          </button>

          <button
            type="button"
            className={`admin-nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => { setActiveTab('overview'); setIsSidebarOpen(false); }}
          >
            <div className="nav-item-icon">
              <BarChart3 size={18} />
            </div>
            <span className="nav-item-text">Operations Overview</span>
          </button>

          <button
            type="button"
            className={`admin-nav-item ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => { setActiveTab('bookings'); setIsSidebarOpen(false); }}
          >
            <div className="nav-item-icon">
              <Calendar size={18} />
            </div>
            <span className="nav-item-text">Weekend Bookings</span>
            <span className="nav-item-badge">{bookings.length}</span>
          </button>

          <button
            type="button"
            className={`admin-nav-item ${activeTab === 'logistics' ? 'active' : ''}`}
            onClick={() => { setActiveTab('logistics'); setIsSidebarOpen(false); }}
          >
            <div className="nav-item-icon">
              <Truck size={18} />
            </div>
            <span className="nav-item-text">Warehouse & Fleet</span>
          </button>
        </nav>

        {/* Footer Actions (Matching Niond Image Style) */}
        <div className="admin-sidebar-footer">
          <div className="niond-user-profile-card">
            <div className="niond-user-avatar-frame">
              <span className="niond-avatar-text">IP</span>
            </div>
            <div className="niond-user-text-stack">
              <span className="niond-user-name">Icon Operations</span>
              <span className="niond-user-role">Brisbane Fleet HQ</span>
            </div>
          </div>

          <button
            type="button"
            className="admin-exit-btn"
            onClick={handleExitPortal}
            title="Exit admin panel and return to live website"
          >
            <LogOut size={16} />
            <span>Return to Store</span>
          </button>

          <button
            type="button"
            className="admin-reset-catalog-btn"
            onClick={() => {
              if (window.confirm('Reset equipment inventory back to the default Brisbane catalog?')) {
                onResetProducts?.();
              }
            }}
            title="Reset any added or modified items back to default"
          >
            <RotateCcw size={13} />
            <span>Reset Catalog to Defaults</span>
          </button>
        </div>

      </aside>

      {/* =====================================================================
         2. MAIN WORKSPACE CONTENT AREA
         ===================================================================== */}
      <main className="admin-portal-main" ref={mainScrollRef} data-lenis-prevent="true">

        {/* Top Floating App Bar */}
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <button
              type="button"
              className="admin-hamburger-btn show-mobile"
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Open sidebar menu"
            >
              <Menu size={20} />
            </button>

            <div>
              <h2 className="niond-page-title">
                {activeTab === 'inventory' && 'Commercial Equipment'}
                {activeTab === 'categories' && 'Storefront Categories'}
                {activeTab === 'overview' && 'Operations Dashboard'}
                {activeTab === 'bookings' && 'Party Bookings'}
                {activeTab === 'logistics' && 'Warehouse & Fleet'}
              </h2>
              <span className="niond-page-date">{todayDateStr}</span>
            </div>
          </div>

          <div className="admin-topbar-right">
            {/* Realtime Cloud Status */}
            <div
              className={`admin-cloud-indicator-badge ${isRealtime ? 'live' : 'offline'}`}
              title={isRealtime ? 'Convex Cloud Sync is active and streaming real-time catalog updates' : 'Local storage fallback. Set VITE_CONVEX_URL in Vercel to sync across all devices.'}
            >
              <span className="badge-pulse-indicator" />
              <span className="cloud-badge-text">{isRealtime ? 'Convex Live' : 'Local Mode'}</span>
            </div>

            {/* Quick Action Circle Buttons (Matching Attached Design) */}
            <button
              type="button"
              className="niond-circle-btn hide-mobile"
              title="Operational Messages"
              onClick={() => onToast?.('Operations dispatch channel active for Brisbane', 'gold')}
            >
              <MessageSquare size={17} />
            </button>
            <button
              type="button"
              className="niond-circle-btn hide-mobile"
              title="Notifications"
              onClick={() => onToast?.('Fleet run-sheets ready for weekend delivery', 'gold')}
            >
              <Bell size={17} />
            </button>

            {/* User Profile Lockup (Matching Attached Design) */}
            <div className="niond-top-profile hide-mobile">
              <div className="niond-top-avatar">
                <span>IP</span>
              </div>
              <div className="niond-top-text">
                <span className="niond-top-name">Icon Operations</span>
                <span className="niond-top-role">Fleet Manager</span>
              </div>
            </div>

            {activeTab === 'inventory' && (
              <button
                type="button"
                className="admin-btn-primary"
                onClick={handleOpenCreate}
              >
                <Plus size={16} />
                <span className="hide-mobile">Add Equipment</span>
                <span className="show-mobile">Add</span>
              </button>
            )}

            {activeTab === 'categories' && (
              <button
                type="button"
                className="admin-btn-primary"
                onClick={handleOpenCategoryCreate}
              >
                <Plus size={16} />
                <span className="hide-mobile">Add Category</span>
                <span className="show-mobile">Add</span>
              </button>
            )}

            {activeTab === 'bookings' && (
              <button
                type="button"
                className="admin-btn-primary"
                onClick={handleOpenBookingCreate}
              >
                <Plus size={16} />
                <span className="hide-mobile">Initiate Order</span>
                <span className="show-mobile">Order</span>
              </button>
            )}

            <button
              type="button"
              className="admin-btn-close-store"
              onClick={handleExitPortal}
              title="Return to customer website"
            >
              <X size={16} />
              <span className="hide-mobile">Exit</span>
            </button>
          </div>
        </header>

        {/* Tab 1: INVENTORY CRUD HUB */}
        {activeTab === 'inventory' && (
          <div className="admin-tab-content">
            
            {/* Signature Pastel Metric Cards (Matching Attached Image) */}
            <div className="admin-kpi-strip niond-pastel-grid">
              {/* Card 1: Pastel Purple / Lavender */}
              <div className="niond-pastel-card purple">
                <div className="niond-card-pill">
                  <span className="pill-dot" />
                  <span>Total Equipment</span>
                </div>
                <div className="niond-card-val">{stats.totalItems} SKUs</div>
                <div className="niond-card-sub">Commercial Brisbane catalog</div>
              </div>

              {/* Card 2: Pastel Baby Blue */}
              <div className="niond-pastel-card blue">
                <div className="niond-card-pill">
                  <span className="pill-dot" />
                  <span>Warehouse Units</span>
                </div>
                <div className="niond-card-val">{stats.totalUnits} Units</div>
                <div className="niond-card-sub">Stock ready in Murrumba Downs</div>
              </div>

              {/* Card 3: Pastel Mint Green */}
              <div className="niond-pastel-card green">
                <div className="niond-card-pill">
                  <span className="pill-dot" />
                  <span>Fleet Health</span>
                </div>
                <div className="niond-card-val">
                  {stats.lowStockCount === 0 ? '100% Ready' : `${stats.lowStockCount} Low`}
                </div>
                <div className="niond-card-sub">
                  {stats.lowStockCount > 0 ? `${stats.lowStockCount} models need restocking` : 'All items at healthy stock levels'}
                </div>
              </div>

              {/* Card 4: Pastel Peach */}
              <div className="niond-pastel-card peach">
                <div className="niond-card-pill">
                  <span className="pill-dot" />
                  <span>Fleet Asset Value</span>
                </div>
                <div className="niond-card-val">${stats.totalCatalogValue.toLocaleString()} AUD</div>
                <div className="niond-card-sub">Total inventory valuation</div>
              </div>
            </div>

            {/* Filter & Controls Toolbar */}
            <div className="admin-toolbar-card">
              
              {/* Row 1: Search & Filter Inputs + View Switcher */}
              <div className="toolbar-top-row">
                <div className="toolbar-search-box">
                  <Search size={16} className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search equipment by title, SKU, category..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="toolbar-search-input"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      className="search-clear-btn"
                      onClick={() => setSearchQuery('')}
                      aria-label="Clear search"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                <div className="toolbar-dropdowns">
                  {/* Stock Status Filter */}
                  <select
                    value={stockFilter}
                    onChange={(e) => setStockFilter(e.target.value)}
                    className="toolbar-select"
                  >
                    <option value="all">All Stock Status</option>
                    <option value="in_stock">In Stock (&gt; 5)</option>
                    <option value="low_stock">Low Stock (1–5)</option>
                    <option value="out_of_stock">Out of Stock (0)</option>
                  </select>

                  {/* Sort By */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="toolbar-select"
                  >
                    <option value="name_asc">Title (A – Z)</option>
                    <option value="price_desc">Highest Hire Rate</option>
                    <option value="price_asc">Lowest Hire Rate</option>
                    <option value="stock_desc">Highest Stock Units</option>
                  </select>

                  {/* View Mode Switcher */}
                  <div className="admin-view-toggle hide-mobile" role="group" aria-label="View Switcher">
                    <button
                      type="button"
                      className={`view-toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
                      onClick={() => setViewMode('table')}
                      title="Compact Table View"
                    >
                      <List size={15} />
                      <span>Table</span>
                    </button>
                    <button
                      type="button"
                      className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                      onClick={() => setViewMode('grid')}
                      title="Visual Bento Grid View"
                    >
                      <LayoutGrid size={15} />
                      <span>Grid</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Row 2: Category Filter Pills */}
              <div className="toolbar-categories-pills">
                <button
                  type="button"
                  className={`cat-pill ${selectedCategory === 'all' ? 'active' : ''}`}
                  onClick={() => setSelectedCategory('all')}
                >
                  All ({products.length})
                </button>
                {activeCategories.map(cat => {
                  const count = products.filter(p => p.category === cat.id).length;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      className={`cat-pill ${selectedCategory === cat.id ? 'active' : ''}`}
                      onClick={() => setSelectedCategory(cat.id)}
                    >
                      <span>{cat.label}</span>
                      <span className="cat-count-bubble">{count}</span>
                    </button>
                  );
                })}
              </div>

            </div>

            {/* Inventory Container: Table or Bento Grid */}
            {viewMode === 'table' ? (
              <div className="admin-table-card">
                {/* Desktop / Tablet Data Table */}
                <div className="table-responsive-wrapper hide-mobile-table">
                  <table className="admin-data-table">
                    <thead>
                      <tr>
                        <th style={{ width: '40%' }}>Equipment & SKU</th>
                        <th>Category</th>
                        <th>Hire Rate (1–4 Days)</th>
                        <th>Bond</th>
                        <th>Warehouse Stock</th>
                        <th>Commercial Spec</th>
                        <th style={{ textAlign: 'right', width: '130px' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="table-empty-state">
                            <AlertTriangle size={32} className="empty-icon text-amber-500" />
                            <h4>No equipment found matching criteria</h4>
                            <p>Try adjusting your search terms, clearing category filters, or add new equipment.</p>
                            <button
                              type="button"
                              className="btn-outline-gold"
                              onClick={() => { setSearchQuery(''); setSelectedCategory('all'); setStockFilter('all'); }}
                            >
                              Reset Filters
                            </button>
                          </td>
                        </tr>
                      ) : (
                        filteredProducts.map(prod => {
                          const price = prod.priceAUD || Math.round((prod.priceINR || 0) * 0.0185);
                          const isLowStock = (prod.stock || 0) <= 5 && (prod.stock || 0) > 0;
                          const isOutOfStock = (prod.stock || 0) === 0;

                          return (
                            <tr key={prod.id} className="admin-table-row">
                              
                              {/* Equipment Identity */}
                              <td>
                                <div className="prod-cell-lockup">
                                  <div className="prod-cell-thumb-wrap">
                                    <img
                                      src={prod.image}
                                      alt={prod.name}
                                      className="prod-cell-thumb"
                                      onError={(e) => {
                                        e.currentTarget.src = '/assets/images/items/Icon 6x3 m Gazebo Hire-2-1024x1024.webp';
                                      }}
                                    />
                                  </div>
                                  <div className="prod-cell-info">
                                    <div className="prod-cell-title-row">
                                      <span className="prod-cell-title">{prod.name}</span>
                                      {prod.badge && (
                                        <span className="prod-cell-badge">{prod.badge}</span>
                                      )}
                                    </div>
                                    <div className="prod-cell-sku">
                                      SKU: <strong>{prod.sku || `IPH-${prod.id}`}</strong>
                                    </div>
                                  </div>
                                </div>
                              </td>

                              {/* Category */}
                              <td>
                                <span className="admin-cat-badge">
                                  {prod.categoryLabel || prod.category}
                                </span>
                              </td>

                              {/* Hire Rate */}
                              <td>
                                <div className="prod-cell-rate">
                                  <span className="rate-aud">${price} AUD</span>
                                  <span className="rate-period">/ 1–4 days</span>
                                </div>
                              </td>

                              {/* Bond */}
                              <td>
                                <span className="prod-cell-bond">
                                  ${prod.bondAUD || 50} AUD
                                </span>
                              </td>

                              {/* Stock Stepper */}
                              <td>
                                <div className="stock-stepper-box">
                                  <button
                                    type="button"
                                    className="stock-step-btn"
                                    onClick={() => onUpdateProductStock?.(prod.id, Math.max(0, (prod.stock || 0) - 1))}
                                    disabled={(prod.stock || 0) === 0}
                                    title="Decrease warehouse stock"
                                  >
                                    -
                                  </button>
                                  <span className={`stock-step-count ${isOutOfStock ? 'stock-empty' : isLowStock ? 'stock-warning' : ''}`}>
                                    {prod.stock || 0}
                                  </span>
                                  <button
                                    type="button"
                                    className="stock-step-btn"
                                    onClick={() => onUpdateProductStock?.(prod.id, (prod.stock || 0) + 1)}
                                    title="Increase warehouse stock"
                                  >
                                    +
                                  </button>
                                </div>
                                {isOutOfStock && <span className="stock-pill-tag empty">Out of Stock</span>}
                                {isLowStock && <span className="stock-pill-tag low">Low ({prod.stock})</span>}
                              </td>

                              {/* Spec */}
                              <td>
                                <div className="prod-cell-spec">
                                  <span>{prod.dimensions || 'Commercial Spec'}</span>
                                  <span className="spec-sub">{prod.material ? prod.material.split('&')[0] : 'Event Grade'}</span>
                                </div>
                              </td>

                              {/* Action Buttons */}
                              <td style={{ textAlign: 'right' }}>
                                <div className="action-buttons-group">
                                  <button
                                    type="button"
                                    className="action-btn view-btn"
                                    onClick={() => setInspectProduct(prod)}
                                    title="Quick View Specifications"
                                  >
                                    <Eye size={15} />
                                  </button>

                                  <button
                                    type="button"
                                    className="action-btn edit-btn"
                                    onClick={() => handleOpenEdit(prod)}
                                    title="Edit Equipment Details"
                                  >
                                    <Edit3 size={15} />
                                  </button>

                                  <button
                                    type="button"
                                    className="action-btn delete-btn"
                                    onClick={() => setDeletingProductId(prod.id)}
                                    title="Delete Equipment"
                                  >
                                    <Trash2 size={15} />
                                  </button>
                                </div>
                              </td>

                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Table Footer */}
                <div className="admin-table-footer hide-mobile-table">
                  <span>Showing <strong>{filteredProducts.length}</strong> of <strong>{products.length}</strong> Brisbane equipment items</span>
                  <span className="footer-sync-note">Live connected with customer storefront</span>
                </div>
              </div>
            ) : (
              /* Bento Grid View */
              <div className="admin-inventory-bento-grid hide-mobile-table">
                {filteredProducts.length === 0 ? (
                  <div className="table-empty-state" style={{ gridColumn: '1 / -1' }}>
                    <AlertTriangle size={32} className="empty-icon text-amber-500" />
                    <h4>No equipment found matching criteria</h4>
                    <p>Try adjusting your search terms, clearing category filters, or add new equipment.</p>
                    <button
                      type="button"
                      className="btn-outline-gold"
                      onClick={() => { setSearchQuery(''); setSelectedCategory('all'); setStockFilter('all'); }}
                    >
                      Reset Filters
                    </button>
                  </div>
                ) : (
                  filteredProducts.map(prod => {
                    const price = prod.priceAUD || Math.round((prod.priceINR || 0) * 0.0185);
                    const isLowStock = (prod.stock || 0) <= 5 && (prod.stock || 0) > 0;
                    const isOutOfStock = (prod.stock || 0) === 0;

                    return (
                      <div key={prod.id} className="bento-eq-card">
                        <div className="bento-eq-media">
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="bento-eq-img"
                            onError={(e) => {
                              e.currentTarget.src = '/assets/images/items/Icon 6x3 m Gazebo Hire-2-1024x1024.webp';
                            }}
                          />
                          <div className="bento-eq-badges">
                            <span className="admin-cat-badge">{prod.categoryLabel || prod.category}</span>
                            {prod.badge && <span className="prod-cell-badge">{prod.badge}</span>}
                          </div>
                          <div className="bento-eq-sku-chip">
                            <span>{prod.sku || `IPH-${prod.id}`}</span>
                          </div>
                        </div>

                        <div className="bento-eq-content">
                          <h4 className="bento-eq-title">{prod.name}</h4>
                          <div className="bento-eq-meta">
                            <span>{prod.dimensions || 'Commercial Spec'}</span>
                            {prod.material && <span className="meta-dot">·</span>}
                            <span>{prod.material ? prod.material.split('&')[0] : ''}</span>
                          </div>

                          <div className="bento-eq-pricing-row">
                            <div className="bento-eq-rate">
                              <span className="rate-aud">${price} AUD</span>
                              <span className="rate-period">/ 1–4 days</span>
                            </div>
                            <div className="bento-eq-bond">
                              ${prod.bondAUD || 50} Bond
                            </div>
                          </div>

                          <div className="bento-eq-stock-row">
                            <div className="bento-stock-status">
                              <span className={`stock-status-dot ${isOutOfStock ? 'dot-empty' : isLowStock ? 'dot-low' : 'dot-ok'}`} />
                              <span className="stock-status-text">
                                {isOutOfStock ? 'Out of Stock' : isLowStock ? `Low (${prod.stock})` : `In Stock (${prod.stock})`}
                              </span>
                            </div>

                            <div className="stock-stepper-box compact">
                              <button
                                type="button"
                                className="stock-step-btn"
                                onClick={() => onUpdateProductStock?.(prod.id, Math.max(0, (prod.stock || 0) - 1))}
                                disabled={(prod.stock || 0) === 0}
                                title="Decrease stock"
                              >
                                -
                              </button>
                              <span className={`stock-step-count ${isOutOfStock ? 'stock-empty' : isLowStock ? 'stock-warning' : ''}`}>
                                {prod.stock || 0}
                              </span>
                              <button
                                type="button"
                                className="stock-step-btn"
                                onClick={() => onUpdateProductStock?.(prod.id, (prod.stock || 0) + 1)}
                                title="Increase stock"
                              >
                                +
                              </button>
                            </div>
                          </div>

                          <div className="bento-eq-actions">
                            <button
                              type="button"
                              className="bento-action-btn view"
                              onClick={() => setInspectProduct(prod)}
                              title="Inspect Specifications"
                            >
                              <Eye size={14} />
                              <span>Inspect</span>
                            </button>
                            <button
                              type="button"
                              className="bento-action-btn edit"
                              onClick={() => handleOpenEdit(prod)}
                              title="Edit Equipment"
                            >
                              <Edit3 size={14} />
                              <span>Edit</span>
                            </button>
                            <button
                              type="button"
                              className="bento-action-btn delete"
                              onClick={() => setDeletingProductId(prod.id)}
                              title="Delete Equipment"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

              {/* Native Mobile Equipment Cards List */}
              <div className="admin-mobile-inventory-list show-mobile-table">
                {filteredProducts.length === 0 ? (
                  <div className="admin-mobile-empty-card">
                    <AlertTriangle size={28} className="empty-icon text-amber-500" />
                    <h4>No equipment found</h4>
                    <p>Adjust your search query or category filter.</p>
                    <button
                      type="button"
                      className="btn-outline-gold"
                      onClick={() => { setSearchQuery(''); setSelectedCategory('all'); setStockFilter('all'); }}
                    >
                      Reset Filters
                    </button>
                  </div>
                ) : (
                  filteredProducts.map(prod => {
                    const price = prod.priceAUD || Math.round((prod.priceINR || 0) * 0.0185);
                    const isLowStock = (prod.stock || 0) <= 5 && (prod.stock || 0) > 0;
                    const isOutOfStock = (prod.stock || 0) === 0;

                    return (
                      <div key={prod.id} className="admin-mobile-eq-card">
                        <div className="mobile-eq-header">
                          <div className="mobile-eq-thumb-frame">
                            <img
                              src={prod.image}
                              alt={prod.name}
                              className="mobile-eq-thumb"
                              onError={(e) => {
                                e.currentTarget.src = '/assets/images/items/Icon 6x3 m Gazebo Hire-2-1024x1024.webp';
                              }}
                            />
                          </div>
                          <div className="mobile-eq-details">
                            <div className="mobile-eq-title-row">
                              <h4 className="mobile-eq-name">{prod.name}</h4>
                              {prod.badge && <span className="prod-cell-badge">{prod.badge}</span>}
                            </div>
                            <div className="mobile-eq-meta-row">
                              <span className="admin-cat-badge">{prod.categoryLabel || prod.category}</span>
                              <span className="mobile-eq-sku">{prod.sku || `IPH-${prod.id}`}</span>
                            </div>
                          </div>
                        </div>

                        <div className="mobile-eq-body">
                          <div className="mobile-eq-pricing">
                            <div className="mobile-eq-rate">
                              <span className="rate-num">${price} AUD</span>
                              <span className="rate-unit">/ 1–4 days</span>
                            </div>
                            <div className="mobile-eq-bond">
                              ${prod.bondAUD || 50} AUD Bond
                            </div>
                          </div>

                          <div className="mobile-eq-stock-box">
                            <span className="mobile-eq-stock-label">Stock Units:</span>
                            <div className="stock-stepper-box">
                              <button
                                type="button"
                                className="stock-step-btn"
                                onClick={() => onUpdateProductStock?.(prod.id, Math.max(0, (prod.stock || 0) - 1))}
                                disabled={(prod.stock || 0) === 0}
                                aria-label="Decrease stock"
                              >
                                -
                              </button>
                              <span className={`stock-step-count ${isOutOfStock ? 'stock-empty' : isLowStock ? 'stock-warning' : ''}`}>
                                {prod.stock || 0}
                              </span>
                              <button
                                type="button"
                                className="stock-step-btn"
                                onClick={() => onUpdateProductStock?.(prod.id, (prod.stock || 0) + 1)}
                                aria-label="Increase stock"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="mobile-eq-actions">
                          <button
                            type="button"
                            className="mobile-action-btn view"
                            onClick={() => setInspectProduct(prod)}
                            title="Inspect"
                          >
                            <Eye size={15} />
                            <span>Inspect</span>
                          </button>
                          <button
                            type="button"
                            className="mobile-action-btn edit"
                            onClick={() => handleOpenEdit(prod)}
                            title="Edit Equipment"
                          >
                            <Edit3 size={15} />
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            className="mobile-action-btn delete"
                            onClick={() => setDeletingProductId(prod.id)}
                            title="Delete Equipment"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

          </div>
        )}

        {/* Tab: CATEGORY CARDS MANAGEMENT */}
        {activeTab === 'categories' && (
          <div className="admin-tab-content">
            
            {/* KPI Strip for Categories (Matching Niond Pastel Cards) */}
            <div className="admin-kpi-strip niond-pastel-grid">
              <div className="niond-pastel-card purple">
                <div className="niond-card-pill">
                  <span className="pill-dot" />
                  <span>Store Categories</span>
                </div>
                <div className="niond-card-val">{activeCategories.length} Categories</div>
                <div className="niond-card-sub">Active storefront showcase cards</div>
              </div>

              <div className="niond-pastel-card blue">
                <div className="niond-card-pill">
                  <span className="pill-dot" />
                  <span>Assigned Products</span>
                </div>
                <div className="niond-card-val">{products.length} Products</div>
                <div className="niond-card-sub">Assigned across all categories</div>
              </div>

              <div className="niond-pastel-card green">
                <div className="niond-card-pill">
                  <span className="pill-dot" />
                  <span>Entry Hire Rate</span>
                </div>
                <div className="niond-card-val">
                  ${Math.min(...activeCategories.map(c => c.startingPrice || 5))} AUD
                </div>
                <div className="niond-card-sub">Starting hire rate / 1–4 days</div>
              </div>

              <div className="niond-pastel-card peach">
                <div className="niond-card-pill">
                  <span className="pill-dot" />
                  <span>Catalog Guard</span>
                </div>
                <div className="niond-card-val">Active · Zero Orphans</div>
                <div className="niond-card-sub">Protects live inventory items</div>
              </div>
            </div>

            {/* Category Search & Filter Toolbar */}
            <div className="admin-table-container admin-cat-container">
              <div className="admin-cat-toolbar">
                <div className="admin-search-box" style={{ maxWidth: '400px' }}>
                  <Search size={16} className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search category cards..."
                    value={categorySearch}
                    onChange={(e) => setCategorySearch(e.target.value)}
                    className="admin-search-input"
                  />
                  {categorySearch && (
                    <button
                      type="button"
                      className="search-clear-btn"
                      onClick={() => setCategorySearch('')}
                      aria-label="Clear search"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                <div className="cat-toolbar-meta">
                  <span>Showing <strong>{filteredCategories.length}</strong> of <strong>{activeCategories.length}</strong> categories</span>
                  <button
                    type="button"
                    className="admin-btn-primary"
                    onClick={handleOpenCategoryCreate}
                    >
                    <Plus size={16} />
                    <span>Add New Category</span>
                  </button>
                </div>
              </div>

              {/* Categories Grid Deck */}
              <div className="admin-cat-deck">
                {filteredCategories.map((cat) => {
                  const linkedProducts = products.filter(p => p.category === cat.id);
                  const itemCount = linkedProducts.length || cat.itemCount || 0;

                  return (
                    <div key={cat.id} className="admin-cat-card">
                      <div className="admin-cat-media">
                        <img
                          src={cat.image}
                          alt={cat.label}
                          className="admin-cat-img"
                        />
                        <div className="admin-cat-badge-notch">
                          <span>{itemCount} Items</span>
                        </div>
                        {cat.tag && (
                          <div className="admin-cat-tag-pill">
                            <span>{cat.tag}</span>
                          </div>
                        )}
                      </div>

                      <div className="admin-cat-body">
                        <div className="admin-cat-header-line">
                          <h4 className="admin-cat-name">{cat.label}</h4>
                          <span className="admin-cat-price">From ${cat.startingPrice} AUD</span>
                        </div>

                        <div className="admin-cat-id-row">
                          <span className="admin-cat-slug-pill">Slug: {cat.id}</span>
                          <span className="admin-cat-linked-badge">
                            {linkedProducts.length} assigned
                          </span>
                        </div>

                        {cat.description && (
                          <p className="admin-cat-desc">{cat.description}</p>
                        )}

                        {cat.pills && Array.isArray(cat.pills) && (
                          <div className="admin-cat-pill-tags">
                            {cat.pills.slice(0, 3).map((pill, i) => (
                              <span key={i} className="admin-cat-spec-tag">{pill}</span>
                            ))}
                          </div>
                        )}

                        <div className="admin-cat-card-actions">
                          <button
                            type="button"
                            className="admin-cat-action-btn edit"
                            onClick={() => handleOpenCategoryEdit(cat)}
                          >
                            <Edit3 size={14} />
                            <span>Edit Card</span>
                          </button>

                          <button
                            type="button"
                            className="admin-cat-action-btn delete"
                            onClick={() => handleAttemptDeleteCategory(cat)}
                            title={linkedProducts.length > 0 ? `Cannot delete: ${linkedProducts.length} equipment items assigned` : 'Delete category card'}
                          >
                            <Trash2 size={14} />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* Tab 2: OPERATIONS OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="admin-tab-content">
            
            {/* Real-time Fleet Logistics & Delivery Progress Banner */}
            <div className="dispatch-hero-banner">
              <div className="dispatch-hero-copy">
                <span className="dispatch-badge">Live Fleet Logistics · Greater Brisbane</span>
                <h3 className="dispatch-title">
                  {bookingStats.dispatchedCount > 0
                    ? `${bookingStats.dispatchedCount} Delivery Run${bookingStats.dispatchedCount === 1 ? '' : 's'} Active in Transit`
                    : bookingStats.deliveredCount > 0
                    ? `${bookingStats.deliveredCount} Event Order${bookingStats.deliveredCount === 1 ? '' : 's'} Delivered Successfully`
                    : `${bookingStats.totalBookingsCount} Event Booking${bookingStats.totalBookingsCount === 1 ? '' : 's'} Staged at Dispatch Bays`}
                </h3>
                <p className="dispatch-desc">
                  {bookingStats.totalBookingsCount === 0
                    ? 'No event hires currently scheduled. Customer orders placed on the website or initiated by admin appear here in real-time.'
                    : `${bookingStats.confirmedCount} order${bookingStats.confirmedCount === 1 ? '' : 's'} confirmed & staged. ${bookingStats.dispatchedCount} active in transit with delivery drivers. ${bookingStats.deliveredCount} successfully delivered to Brisbane event venues.`}
                </p>
                <div className="dispatch-actions">
                  <button
                    type="button"
                    className="btn-white-solid"
                    onClick={() => {
                      if (bookingStats.totalBookingsCount === 0) {
                        onToast?.('No orders currently staged to generate manifests.', 'info');
                      } else {
                        onToast?.(`Generated driver run manifest for ${bookingStats.totalBookingsCount} active booking(s)`, 'gold');
                      }
                    }}
                  >
                    Print Driver Run Sheets
                  </button>
                  <button
                    type="button"
                    className="btn-glass-banner"
                    onClick={() => setActiveTab('bookings')}
                  >
                    Manage Event Bookings ({bookingStats.totalBookingsCount}) →
                  </button>
                </div>
              </div>

              <div className="dispatch-kpi-badge">
                <Truck size={36} className="text-emerald-400" />
                <span className="kpi-num">{bookingStats.deliveredCount} / {bookingStats.totalBookingsCount}</span>
                <span className="kpi-label">Completed Deliveries</span>
              </div>
            </div>

            {/* 4 Signature Niond Pastel Metric Cards (100% Real Dynamic Calculations) */}
            <div className="niond-pastel-grid">
              <div className="niond-pastel-card purple">
                <div className="niond-card-pill">
                  <span className="pill-dot"></span>
                  <span>Gross Hire Revenue</span>
                </div>
                <div className="niond-card-val">${bookingStats.totalIncomeAUD.toLocaleString()} AUD</div>
                <div className="niond-card-sub">
                  {bookingStats.totalBookingsCount} real order{bookingStats.totalBookingsCount === 1 ? '' : 's'} recorded in system
                </div>
              </div>

              <div className="niond-pastel-card blue">
                <div className="niond-card-pill">
                  <span className="pill-dot"></span>
                  <span>Security Bonds Held</span>
                </div>
                <div className="niond-card-val">${bookingStats.totalBondsAUD.toLocaleString()} AUD</div>
                <div className="niond-card-sub">
                  {bookingStats.confirmedCount + bookingStats.dispatchedCount} pending post-event return release
                </div>
              </div>

              <div className="niond-pastel-card green">
                <div className="niond-card-pill">
                  <span className="pill-dot"></span>
                  <span>Delivered Successfully</span>
                </div>
                <div className="niond-card-val">{bookingStats.deliveredCount} Delivered</div>
                <div className="niond-card-sub">
                  {bookingStats.totalBookingsCount > 0
                    ? `${Math.round((bookingStats.deliveredCount / bookingStats.totalBookingsCount) * 100)}% of scheduled orders completed`
                    : 'Awaiting venue drop-offs'}
                </div>
              </div>

              <div className="niond-pastel-card peach">
                <div className="niond-card-pill">
                  <span className="pill-dot"></span>
                  <span>Active In Transit</span>
                </div>
                <div className="niond-card-val">{bookingStats.dispatchedCount} Dispatched</div>
                <div className="niond-card-sub">
                  {bookingStats.confirmedCount} confirmed & staged at warehouse bays
                </div>
              </div>
            </div>

            {/* Recent Bookings Snapshot */}
            <div className="admin-table-card">
              <div className="table-header-bar">
                <div>
                  <h3 className="card-box-title">Recent Event Booking Activity</h3>
                  <p className="card-box-desc">Customer hires dispatched across Brisbane and Gold Coast.</p>
                </div>
                <button
                  type="button"
                  className="btn-outline-gold"
                  onClick={() => setActiveTab('bookings')}
                >
                  View All Bookings →
                </button>
              </div>

              <div className="table-responsive-wrapper hide-mobile-table">
                <table className="admin-data-table">
                  <thead>
                    <tr>
                      <th>Customer & Event</th>
                      <th>Equipment Hired</th>
                      <th>Location</th>
                      <th>Total Rate</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map(b => (
                      <tr key={b.id}>
                        <td>
                          <strong>{b.customerName}</strong>
                          <div className="text-subtle-xs">{b.eventType} · {b.eventDate}</div>
                        </td>
                        <td>{b.items.join(', ')}</td>
                        <td>{b.city}</td>
                        <td><strong>${b.totalAUD} AUD</strong></td>
                        <td>
                          <span className={`status-pill-badge status-${b.status.toLowerCase()}`}>
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Native Mobile Equipment Cards List */}
              {/* Native Mobile Recent Bookings List */}
              <div className="admin-mobile-bookings-list show-mobile-table">
                {bookings.slice(0, 4).map(b => (
                  <div key={b.id} className="admin-mobile-booking-card">
                    <div className="mobile-booking-header">
                      <span className="booking-ref-badge">{b.id}</span>
                      <span className={`status-pill-badge status-${b.status.toLowerCase()}`}>
                        {b.status}
                      </span>
                    </div>
                    <div className="mobile-booking-customer">
                      <strong className="customer-name">{b.customerName}</strong>
                      <span className="customer-phone">{b.phone}</span>
                    </div>
                    <div className="mobile-booking-event">
                      <span>{b.eventType}</span> • <span>{b.eventDate}</span> • <span>{b.city}</span>
                    </div>
                    <div className="mobile-booking-items">
                      {b.items.map((it, idx) => (
                        <span key={idx} className="booking-item-chip">• {it}</span>
                      ))}
                    </div>
                    <div className="mobile-booking-footer">
                      <div className="booking-carrier-info">
                        <span className="carrier-tag">{b.carrier}</span>
                        <span className="text-subtle-xs font-mono">{b.tracking}</span>
                      </div>
                      <div className="booking-total-box">
                        <span className="booking-amount">${b.totalAUD} AUD</span>
                        <span className="booking-pay-status">{b.paymentStatus}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Tab 3: BOOKINGS MANAGEMENT */}
        {activeTab === 'bookings' && (
          <div className="admin-tab-content">
            <div className="table-header-bar">
              <div>
                <h3 className="card-box-title">Customer Party & Event Bookings</h3>
                <p className="card-box-desc">
                  {bookingStats.totalBookingsCount} live booking{bookingStats.totalBookingsCount === 1 ? '' : 's'} · {bookingStats.confirmedCount} confirmed, {bookingStats.dispatchedCount} in transit, {bookingStats.deliveredCount} delivered.
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <div className="subpane-pills-row">
                  {['all', 'confirmed', 'dispatched', 'delivered', 'returned'].map(f => (
                    <button
                      key={f}
                      type="button"
                      className={`subpane-pill ${bookingFilter === f ? 'active' : ''}`}
                      onClick={() => setBookingFilter(f)}
                    >
                      {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  className="admin-btn-primary"
                  onClick={handleOpenBookingCreate}
                >
                  <Plus size={15} />
                  <span>Initiate Order</span>
                </button>
              </div>
            </div>

            <div className="admin-table-card">
              {/* Desktop / Tablet Bookings Table */}
              <div className="table-responsive-wrapper hide-mobile-table">
                <table className="admin-data-table">
                  <thead>
                    <tr>
                      <th>Booking Ref</th>
                      <th>Customer</th>
                      <th>Event Details</th>
                      <th>Hired Equipment</th>
                      <th>Fulfillment & Dispatch</th>
                      <th>Hire Total</th>
                      <th>Status Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.filter(b => bookingFilter === 'all' || b.status.toLowerCase() === bookingFilter.toLowerCase()).length === 0 ? (
                      <tr>
                        <td colSpan="7" style={{ textAlign: 'center', padding: '36px', color: '#64748B' }}>
                          No event bookings matching "{bookingFilter}".
                        </td>
                      </tr>
                    ) : (
                      bookings
                        .filter(b => bookingFilter === 'all' || b.status.toLowerCase() === bookingFilter.toLowerCase())
                        .map(booking => (
                          <tr key={booking.id}>
                            <td className="font-mono font-bold text-pink-600">{booking.id}</td>
                            <td>
                              <strong>{booking.customerName}</strong>
                              <div className="text-subtle-xs">{booking.phone}</div>
                            </td>
                            <td>
                              <div><strong>{booking.eventType}</strong></div>
                              <div className="text-subtle-xs">{booking.eventDate}</div>
                              <div className="text-subtle-xs">{booking.city}</div>
                            </td>
                            <td>
                              <ul className="booking-items-list">
                                {booking.items.map((it, idx) => (
                                  <li key={idx}>• {it}</li>
                                ))}
                              </ul>
                            </td>
                            <td>
                              <div className="carrier-tag">{booking.carrier}</div>
                              <div className="text-subtle-xs font-mono">{booking.tracking}</div>
                            </td>
                            <td>
                              <strong>${booking.totalAUD} AUD</strong>
                              <div className="text-subtle-xs">{booking.paymentStatus}</div>
                            </td>
                            <td>
                              <select
                                value={booking.status}
                                onChange={(e) => handleBookingStatusChange(booking.id, e.target.value)}
                                className={`status-select-pill status-${booking.status.toLowerCase()}`}
                              >
                                <option value="Confirmed">Confirmed</option>
                                <option value="Dispatched">Dispatched</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Returned">Returned</option>
                              </select>
                            </td>
                          </tr>
                        ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Native Mobile Bookings Cards */}
              <div className="admin-mobile-bookings-list show-mobile-table">
                {bookings
                  .filter(b => bookingFilter === 'all' || b.status.toLowerCase() === bookingFilter.toLowerCase())
                  .map(booking => (
                    <div key={booking.id} className="admin-mobile-booking-card">
                      <div className="mobile-booking-header">
                        <span className="booking-ref-badge">{booking.id}</span>
                        <select
                          value={booking.status}
                          onChange={(e) => handleBookingStatusChange(booking.id, e.target.value)}
                          className={`status-select-pill status-${booking.status.toLowerCase()}`}
                        >
                          <option value="Confirmed">Confirmed</option>
                          <option value="Dispatched">Dispatched</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Returned">Returned</option>
                        </select>
                      </div>

                      <div className="mobile-booking-customer">
                        <strong className="customer-name">{booking.customerName}</strong>
                        <span className="customer-phone">{booking.phone}</span>
                      </div>

                      <div className="mobile-booking-event">
                        <span>{booking.eventType}</span> • <span>{booking.eventDate}</span> • <span>{booking.city}</span>
                      </div>

                      <div className="mobile-booking-items">
                        {booking.items.map((it, idx) => (
                          <span key={idx} className="booking-item-chip">• {it}</span>
                        ))}
                      </div>

                      <div className="mobile-booking-footer">
                        <div className="booking-carrier-info">
                          <span className="carrier-tag">{booking.carrier}</span>
                          <span className="text-subtle-xs font-mono">{booking.tracking}</span>
                        </div>
                        <div className="booking-total-box">
                          <span className="booking-amount">${booking.totalAUD} AUD</span>
                          <span className="booking-pay-status">{booking.paymentStatus}</span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: WAREHOUSE & FLEET */}
        {activeTab === 'logistics' && (
          <div className="admin-tab-content">
            <div className="showroom-boxes-grid">
              
              <div className="icon-card showroom-info-card">
                <div className="card-box-header">
                  <Building2 size={24} className="text-pink-600" />
                  <h3 className="card-box-title">Murrumba Downs Logistics Hub</h3>
                </div>
                <div className="spec-list">
                  <div className="spec-row">
                    <span className="spec-label">Address</span>
                    <span className="spec-value">{BRISBANE_STORE_INFO.address}, {BRISBANE_STORE_INFO.city} {BRISBANE_STORE_INFO.state} {BRISBANE_STORE_INFO.postcode}</span>
                  </div>
                  <div className="spec-row">
                    <span className="spec-label">Customer Support</span>
                    <span className="spec-value">{BRISBANE_STORE_INFO.phone}</span>
                  </div>
                  <div className="spec-row">
                    <span className="spec-label">Email Dispatches</span>
                    <span className="spec-value">{BRISBANE_STORE_INFO.email}</span>
                  </div>
                  <div className="spec-row">
                    <span className="spec-label">Warehouse Hours</span>
                    <span className="spec-value">{BRISBANE_STORE_INFO.showroomHours}</span>
                  </div>
                  <div className="spec-row">
                    <span className="spec-label">Delivery Zones</span>
                    <span className="spec-value">{BRISBANE_STORE_INFO.deliveryRegions}</span>
                  </div>
                </div>
              </div>

              <div className="icon-card showroom-info-card">
                <div className="card-box-header">
                  <Truck size={24} className="text-pink-600" />
                  <h3 className="card-box-title">Brisbane Active Delivery Fleet</h3>
                </div>
                <div className="fleet-list">
                  {BRISBANE_STORE_INFO.dispatchFleet.map((fleet, i) => (
                    <div key={i} className="fleet-item">
                      <div className="fleet-status-dot" />
                      <div className="fleet-text">
                        <strong>{fleet}</strong>
                        <span className="fleet-route">GPS Monitored · Pre-Trip Sanitized</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

      </main>

      {/* =====================================================================
         3. CREATE & EDIT EQUIPMENT MODAL (CRUD OPERATIONS)
         ===================================================================== */}
      {(isCreateModalOpen || editingProduct) && (
        <div className="admin-modal-backdrop" onClick={() => { setIsCreateModalOpen(false); setEditingProduct(null); }}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            
            <div className="admin-modal-header">
              <div>
                <h3 className="modal-title">
                  {isCreateModalOpen ? 'Add New Hire Equipment' : `Edit: ${editingProduct?.name}`}
                </h3>
                <p className="modal-sub">
                  {isCreateModalOpen
                    ? 'Create a new equipment entry in the Brisbane party hire inventory.'
                    : 'Update pricing, bond, warehouse stock units, and commercial specifications.'}
                </p>
              </div>
              <button
                type="button"
                className="modal-close-icon-btn"
                onClick={() => { setIsCreateModalOpen(false); setEditingProduct(null); }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={isCreateModalOpen ? handleSubmitCreate : handleSubmitEdit} className="admin-modal-form">
              
              <div className="modal-form-grid">
                
                {/* Equipment Name */}
                <div className="form-group full-width">
                  <label className="form-label">Equipment Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Commercial 6x3m Pop-Up Gazebo"
                    className="form-input"
                  />
                </div>

                {/* Category Selection */}
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="form-select"
                  >
                    {activeCategories.map(c => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                </div>

                {/* SKU Code */}
                <div className="form-group">
                  <label className="form-label">SKU Reference</label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    placeholder="e.g. IPH-GZB-101"
                    className="form-input font-mono"
                  />
                </div>

                {/* Weekend Hire Rate (AUD) */}
                <div className="form-group">
                  <label className="form-label">Hire Rate 1–4 Days (AUD $) *</label>
                  <div className="input-prefix-wrap">
                    <span className="input-prefix">$</span>
                    <input
                      type="number"
                      required
                      min="1"
                      step="1"
                      value={formData.priceAUD}
                      onChange={(e) => setFormData({ ...formData, priceAUD: e.target.value })}
                      className="form-input with-prefix"
                    />
                  </div>
                </div>

                {/* Security Bond (AUD) */}
                <div className="form-group">
                  <label className="form-label">Security Bond (AUD $)</label>
                  <div className="input-prefix-wrap">
                    <span className="input-prefix">$</span>
                    <input
                      type="number"
                      min="0"
                      step="5"
                      value={formData.bondAUD}
                      onChange={(e) => setFormData({ ...formData, bondAUD: e.target.value })}
                      className="form-input with-prefix"
                    />
                  </div>
                </div>

                {/* Warehouse Stock Units */}
                <div className="form-group">
                  <label className="form-label">Warehouse Units (Stock) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="form-input"
                  />
                </div>

                {/* Badge Tag */}
                <div className="form-group">
                  <label className="form-label">Badge Tag</label>
                  <select
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    className="form-select"
                  >
                    <option value="">None</option>
                    <option value="Bestseller">Bestseller</option>
                    <option value="Popular Hire">Popular Hire</option>
                    <option value="Trending">Trending</option>
                    <option value="New Arrival">New Arrival</option>
                    <option value="Showstopper">Showstopper</option>
                  </select>
                </div>

                {/* Image Selection / Preset */}
                <div className="form-group full-width">
                  <label className="form-label">Equipment Photo (Preset Gallery or Custom URL)</label>
                  <div className="modal-image-preview-group">
                    <div className="modal-image-thumb-box">
                      <img
                        src={formData.image || '/assets/images/items/Icon 6x3 m Gazebo Hire-2-1024x1024.webp'}
                        alt="Equipment preview"
                        onError={(e) => {
                          e.currentTarget.src = '/assets/images/items/Icon 6x3 m Gazebo Hire-2-1024x1024.webp';
                        }}
                      />
                    </div>
                    <div className="modal-image-inputs">
                      <select
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        className="form-select mb-2"
                      >
                        {EQUIPMENT_IMAGE_OPTIONS.map((img, i) => (
                          <option key={i} value={img.path}>{img.label} ({img.cat})</option>
                        ))}
                      </select>
                      <input
                        type="text"
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        placeholder="Or enter custom image URL"
                        className="form-input text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Dimensions */}
                <div className="form-group">
                  <label className="form-label">Dimensions / Sizing</label>
                  <input
                    type="text"
                    value={formData.dimensions}
                    onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                    placeholder="e.g. 6m × 3m × 3.3m"
                    className="form-input"
                  />
                </div>

                {/* Commercial Material */}
                <div className="form-group">
                  <label className="form-label">Commercial Specifications</label>
                  <input
                    type="text"
                    value={formData.material}
                    onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                    placeholder="e.g. 500D Waterproof PVC & Reinforced Alloy"
                    className="form-input"
                  />
                </div>

                {/* Hire Period */}
                <div className="form-group full-width">
                  <label className="form-label">Hire Period Terms</label>
                  <input
                    type="text"
                    value={formData.hirePeriod}
                    onChange={(e) => setFormData({ ...formData, hirePeriod: e.target.value })}
                    placeholder="e.g. 1–4 Days Flexible Brisbane Event Hire"
                    className="form-input"
                  />
                </div>

                {/* Description */}
                <div className="form-group full-width">
                  <label className="form-label">Commercial Description</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Provide details on equipment features, setup requirements, and suitability for Brisbane events..."
                    className="form-textarea"
                  />
                </div>

              </div>

              {/* Form Action Buttons */}
              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="btn-outline-cancel"
                  onClick={() => { setIsCreateModalOpen(false); setEditingProduct(null); }}
                >
                  Cancel
                </button>
                <button type="submit" className="admin-btn-primary">
                  <Check size={16} />
                  <span>{isCreateModalOpen ? 'Create & Publish Equipment' : 'Save Changes'}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* =====================================================================
         4. CONFIRM DELETE SAFETY MODAL
         ===================================================================== */}
      {deletingProductId && targetDeleteProduct && (
        <div className="admin-modal-backdrop" onClick={() => setDeletingProductId(null)}>
          <div className="admin-confirm-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-icon-bubble">
              <AlertTriangle size={28} className="text-red-500" />
            </div>
            <h3 className="confirm-title">Remove Equipment from Inventory?</h3>
            <p className="confirm-desc">
              Are you sure you want to remove <strong>"{targetDeleteProduct.name}"</strong>?
              This item will immediately be removed from the Brisbane catalog and cannot be booked by customers.
            </p>
            <div className="confirm-item-preview">
              <img src={targetDeleteProduct.image} alt={targetDeleteProduct.name} className="confirm-thumb" />
              <div>
                <strong>{targetDeleteProduct.name}</strong>
                <div className="text-subtle-xs">SKU: {targetDeleteProduct.sku || targetDeleteProduct.id} · ${targetDeleteProduct.priceAUD || 50} AUD</div>
              </div>
            </div>
            <div className="confirm-actions">
              <button
                type="button"
                className="btn-outline-cancel"
                onClick={() => setDeletingProductId(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-danger-confirm"
                onClick={handleConfirmDelete}
              >
                Yes, Remove Equipment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
         5. QUICK INSPECT / PREVIEW MODAL
         ===================================================================== */}
      {inspectingProduct && (
        <div className="admin-modal-backdrop" onClick={() => setInspectProduct(null)}>
          <div className="admin-inspect-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="inspect-header">
              <span className="admin-cat-badge">{inspectingProduct.categoryLabel}</span>
              <button
                type="button"
                className="modal-close-icon-btn"
                onClick={() => setInspectProduct(null)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="inspect-body">
              <div className="inspect-media">
                <img src={inspectingProduct.image} alt={inspectingProduct.name} className="inspect-img" />
              </div>

              <div className="inspect-details">
                <h3 className="inspect-name">{inspectingProduct.name}</h3>
                <div className="inspect-sku">SKU: {inspectingProduct.sku || inspectingProduct.id}</div>
                
                <div className="inspect-price-box">
                  <div className="inspect-rate">
                    ${inspectingProduct.priceAUD || 50} <span className="inspect-rate-sub">AUD / 1–4 days</span>
                  </div>
                  <div className="inspect-bond">
                    Security Bond: <strong>${inspectingProduct.bondAUD || 50} AUD</strong>
                  </div>
                </div>

                <div className="inspect-specs-grid">
                  <div>
                    <span className="spec-label">Warehouse Stock</span>
                    <strong className="text-dark">{inspectingProduct.stock || 0} Units</strong>
                  </div>
                  <div>
                    <span className="spec-label">Hire Period</span>
                    <strong className="text-dark">{inspectingProduct.hirePeriod || 'Weekend Hire'}</strong>
                  </div>
                  <div>
                    <span className="spec-label">Dimensions</span>
                    <strong className="text-dark">{inspectingProduct.dimensions || 'Commercial Spec'}</strong>
                  </div>
                  <div>
                    <span className="spec-label">Material</span>
                    <strong className="text-dark">{inspectingProduct.material || 'Heavy-Duty Alloy'}</strong>
                  </div>
                </div>

                <p className="inspect-desc">{inspectingProduct.description}</p>

                <div className="inspect-actions">
                  <button
                    type="button"
                    className="admin-btn-primary"
                    onClick={() => {
                      const p = inspectingProduct;
                      setInspectProduct(null);
                      handleOpenEdit(p);
                    }}
                  >
                    <Edit3 size={15} />
                    <span>Edit This Equipment</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
         6. CATEGORY SAFETY DELETE WARNING MODAL
         ===================================================================== */}
      {categoryDeleteWarning && (
        <div className="admin-modal-backdrop" onClick={() => setCategoryDeleteWarning(null)}>
          <div className="admin-confirm-modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <div className="confirm-icon-bubble" style={{ background: '#FEF3C7', color: '#D97706' }}>
              <AlertTriangle size={32} />
            </div>
            <h3 className="confirm-title">
              Cannot Delete Category "{categoryDeleteWarning.category.label}"
            </h3>
            <p className="confirm-desc" style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
              There are currently <strong>{categoryDeleteWarning.count}</strong> equipment items assigned to this category in your catalog (including <em>{categoryDeleteWarning.sampleNames.join(', ')}</em>).
            </p>
            <div style={{ padding: '12px 16px', background: '#FFFBEB', borderRadius: '12px', border: '1px solid #FDE68A', marginBottom: '20px', fontSize: '0.8125rem', color: '#92400E', lineHeight: '1.5', textAlign: 'left' }}>
              💡 <strong>Safety Recommendation:</strong> To maintain catalog integrity and prevent orphaned products, please reassign or delete these items in the <strong>Equipment Items</strong> section before deleting this category.
            </div>
            <div className="confirm-actions modal-action-stack" style={{ justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                className="btn-outline-cancel"
                onClick={() => setCategoryDeleteWarning(null)}
              >
                Close
              </button>
              <button
                type="button"
                className="admin-btn-primary"
                onClick={() => {
                  setSelectedCategory(categoryDeleteWarning.category.id);
                  setActiveTab('inventory');
                  setCategoryDeleteWarning(null);
                }}
              >
                <Package size={15} />
                <span>View Equipment in this Category ({categoryDeleteWarning.count})</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
         7. CATEGORY DELETE CONFIRMATION MODAL (0 Linked Items)
         ===================================================================== */}
      {deletingCategoryId && (
        <div className="admin-modal-backdrop" onClick={() => setDeletingCategoryId(null)}>
          <div className="admin-confirm-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-icon-bubble">
              <Trash2 size={28} className="text-red-500" />
            </div>
            <h3 className="confirm-title">Delete Category Card?</h3>
            <p className="confirm-desc">
              Are you sure you want to permanently delete the <strong>"{activeCategories.find(c => c.id === deletingCategoryId)?.label || deletingCategoryId}"</strong> category card from your storefront?
            </p>
            <div className="confirm-actions">
              <button
                type="button"
                className="btn-outline-cancel"
                onClick={() => setDeletingCategoryId(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-danger-confirm"
                onClick={() => {
                  onDeleteCategory?.(deletingCategoryId);
                  setDeletingCategoryId(null);
                }}
              >
                Yes, Delete Category
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
         8. CATEGORY CREATE / EDIT MODAL
         ===================================================================== */}
      {(isCreateCategoryModalOpen || editingCategory) && (
        <div
          className="admin-modal-backdrop"
          onClick={() => {
            setIsCreateCategoryModalOpen(false);
            setEditingCategory(null);
          }}
        >
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
            <div className="admin-modal-header">
              <div>
                <h3 className="modal-title">
                  {editingCategory ? `Edit Category: ${editingCategory.label}` : 'Add New Event Category'}
                </h3>
                <span className="modal-sub">
                  {editingCategory ? 'Update storefront card visuals and pricing' : 'Create a new hire category card for your Brisbane storefront'}
                </span>
              </div>
              <button
                type="button"
                className="modal-close-icon-btn"
                onClick={() => {
                  setIsCreateCategoryModalOpen(false);
                  setEditingCategory(null);
                }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={editingCategory ? handleSubmitCategoryEdit : handleSubmitCategoryCreate} className="admin-modal-form">
              <div className="modal-form-grid">
                
                {/* Category Name */}
                <div className="form-group full-width">
                  <label className="form-label">Category Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Dance Floors & Staging, Photo Booths"
                    value={categoryFormData.label}
                    onChange={(e) => {
                      const val = e.target.value;
                      const autoSlug = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
                      setCategoryFormData(prev => ({
                        ...prev,
                        label: val,
                        id: editingCategory ? prev.id : (autoSlug || prev.id),
                        shortLabel: editingCategory ? prev.shortLabel : val
                      }));
                    }}
                    required
                  />
                </div>

                {/* Slug / Key */}
                <div className="form-group">
                  <label className="form-label">Category Key / Slug *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. dance-floors"
                    value={categoryFormData.id}
                    onChange={(e) => setCategoryFormData({ ...categoryFormData, id: e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, '') })}
                    disabled={Boolean(editingCategory)}
                    required
                  />
                  <span className="form-help-hint">Unique identifier used for filtering items</span>
                </div>

                {/* Short Label */}
                <div className="form-group">
                  <label className="form-label">Short Label (Tabs & Badges)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Staging"
                    value={categoryFormData.shortLabel}
                    onChange={(e) => setCategoryFormData({ ...categoryFormData, shortLabel: e.target.value })}
                  />
                  <span className="form-help-hint">Used in compact mobile tabs</span>
                </div>

                {/* Starting Price */}
                <div className="form-group">
                  <label className="form-label">Starting Price ($ AUD) *</label>
                  <input
                    type="number"
                    min="1"
                    className="form-input"
                    placeholder="e.g. 80"
                    value={categoryFormData.startingPrice}
                    onChange={(e) => setCategoryFormData({ ...categoryFormData, startingPrice: e.target.value })}
                    required
                  />
                  <span className="form-help-hint">Shown as "From $X AUD" on category badges</span>
                </div>

                {/* Highlight Tag / Badge */}
                <div className="form-group">
                  <label className="form-label">Editorial Badge / Tag</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Event Essential, Luxury Decor, Weatherproof"
                    value={categoryFormData.tag}
                    onChange={(e) => setCategoryFormData({ ...categoryFormData, tag: e.target.value })}
                  />
                </div>

                {/* Cover Image Selector */}
                <div className="form-group full-width">
                  <label className="form-label">Category Cover Image *</label>
                  <div className="modal-image-preview-group">
                    <div className="modal-image-thumb-box">
                      <img
                        src={categoryFormData.image || '/assets/images/items/Icon 6x3 m Gazebo Hire-2-1024x1024.webp'}
                        alt="Category preview"
                        onError={(e) => {
                          e.currentTarget.src = '/assets/images/items/Icon 6x3 m Gazebo Hire-2-1024x1024.webp';
                        }}
                      />
                    </div>
                    <div className="modal-image-inputs">
                      <select
                        value={categoryFormData.image}
                        onChange={(e) => setCategoryFormData({ ...categoryFormData, image: e.target.value })}
                        className="form-select mb-2"
                      >
                        {EQUIPMENT_IMAGE_OPTIONS.map((img, i) => (
                          <option key={i} value={img.path}>{img.label}</option>
                        ))}
                      </select>
                      <input
                        type="text"
                        className="form-input text-xs font-mono"
                        placeholder="Or enter custom image path (/assets/images/...)"
                        value={categoryFormData.image}
                        onChange={(e) => setCategoryFormData({ ...categoryFormData, image: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* Specification Pills */}
                <div className="form-group full-width">
                  <label className="form-label">Feature Pills (Comma-separated)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Modular 1x1m, Oak & White, Non-Slip Surface"
                    value={categoryFormData.pills}
                    onChange={(e) => setCategoryFormData({ ...categoryFormData, pills: e.target.value })}
                  />
                  <span className="form-help-hint">Displayed as mini pills on desktop cards (max 3 shown)</span>
                </div>

                {/* Description */}
                <div className="form-group full-width">
                  <label className="form-label">Short Description</label>
                  <textarea
                    rows={2}
                    className="form-textarea"
                    placeholder="Brief overview of what equipment is included in this category..."
                    value={categoryFormData.description}
                    onChange={(e) => setCategoryFormData({ ...categoryFormData, description: e.target.value })}
                  />
                </div>

              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="btn-outline-cancel"
                  onClick={() => {
                    setIsCreateCategoryModalOpen(false);
                    setEditingCategory(null);
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="admin-btn-primary">
                  <Check size={16} />
                  <span>{editingCategory ? 'Save Changes' : 'Create Category Card'}</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
      {/* =====================================================================
         9. INITIATE NEW ORDER / BOOKING MODAL
         ===================================================================== */}
      {isCreateBookingModalOpen && (
        <div
          className="admin-modal-backdrop"
          onClick={() => setIsCreateBookingModalOpen(false)}
        >
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
            <div className="admin-modal-header">
              <div>
                <h3 className="modal-title">Initiate New Event Booking</h3>
                <span className="modal-sub">
                  Record an offline party hire, phone booking, or customer order directly into Brisbane logistics.
                </span>
              </div>
              <button
                type="button"
                className="modal-close-icon-btn"
                onClick={() => setIsCreateBookingModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitBookingCreate} className="admin-modal-form">
              <div className="modal-form-grid">
                
                {/* Customer Name */}
                <div className="form-group">
                  <label className="form-label">Customer Name *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="e.g. Liam Hemsworth"
                    value={bookingFormData.customerName}
                    onChange={(e) => setBookingFormData({ ...bookingFormData, customerName: e.target.value })}
                  />
                </div>

                {/* Customer Phone */}
                <div className="form-group">
                  <label className="form-label">Phone Contact *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="e.g. +61 412 345 678"
                    value={bookingFormData.phone}
                    onChange={(e) => setBookingFormData({ ...bookingFormData, phone: e.target.value })}
                  />
                </div>

                {/* Event Date & Time */}
                <div className="form-group">
                  <label className="form-label">Event Date & Time</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. This Saturday, 2:00 PM"
                    value={bookingFormData.eventDate}
                    onChange={(e) => setBookingFormData({ ...bookingFormData, eventDate: e.target.value })}
                  />
                </div>

                {/* Event Type */}
                <div className="form-group">
                  <label className="form-label">Event Type</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. 21st Birthday, Wedding, Corporate"
                    value={bookingFormData.eventType}
                    onChange={(e) => setBookingFormData({ ...bookingFormData, eventType: e.target.value })}
                  />
                </div>

                {/* Delivery Location / Suburb */}
                <div className="form-group full-width">
                  <label className="form-label">Venue / Delivery Address</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. 45 River Terrace, Kangaroo Point QLD 4169"
                    value={bookingFormData.city}
                    onChange={(e) => setBookingFormData({ ...bookingFormData, city: e.target.value })}
                  />
                </div>

                {/* Hired Equipment Items */}
                <div className="form-group full-width">
                  <label className="form-label">Hired Equipment Items (Comma-separated)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. 6x3m White Commercial Gazebo (x1), White Tiffany Resin Chairs (x40)"
                    value={bookingFormData.items}
                    onChange={(e) => setBookingFormData({ ...bookingFormData, items: e.target.value })}
                  />
                </div>

                {/* Total Hire Rate ($ AUD) */}
                <div className="form-group">
                  <label className="form-label">Total Hire Rate ($ AUD) *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    className="form-input"
                    value={bookingFormData.totalAUD}
                    onChange={(e) => setBookingFormData({ ...bookingFormData, totalAUD: e.target.value })}
                  />
                </div>

                {/* Fulfillment Carrier */}
                <div className="form-group">
                  <label className="form-label">Fulfillment Carrier / Dispatch</label>
                  <select
                    className="form-select"
                    value={bookingFormData.carrier}
                    onChange={(e) => setBookingFormData({ ...bookingFormData, carrier: e.target.value })}
                  >
                    <option value="Icon Van 1 (Brisbane Delivery)">Icon Van 1 (Brisbane Delivery)</option>
                    <option value="Icon Van 2 (Express Courier)">Icon Van 2 (Express Courier)</option>
                    <option value="Icon Truck 3 (Setup & Delivery)">Icon Truck 3 (Setup & Delivery)</option>
                    <option value="Customer Pickup (Murrumba Downs Warehouse)">Customer Pickup (Murrumba Downs)</option>
                  </select>
                </div>

              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="btn-outline-cancel"
                  onClick={() => setIsCreateBookingModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="admin-btn-primary">
                  <Check size={16} />
                  <span>Initiate & Confirm Order</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}
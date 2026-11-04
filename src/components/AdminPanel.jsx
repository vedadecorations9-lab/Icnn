import React, { useState, useMemo } from 'react';
import {
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
  Mail
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
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onUpdateProductStock,
  onResetProducts,
  onToast
}) {
  // Navigation Tabs: 'inventory' | 'overview' | 'bookings' | 'logistics'
  const [activeTab, setActiveTab] = useState('inventory');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

  // Real Event Bookings State
  const [bookings, setBookings] = useState(INITIAL_ORDERS);
  const [bookingFilter, setBookingFilter] = useState('all');

  // Handle Booking Status
  const handleBookingStatusChange = (bookingId, newStatus) => {
    setBookings(prev =>
      prev.map(b => (b.id === bookingId ? { ...b, status: newStatus } : b))
    );
    onToast?.(`Booking ${bookingId} updated to "${newStatus}"`, 'gold');
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

    const catObj = CATEGORIES.find(c => c.id === formData.category) || CATEGORIES[0];
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

    const catObj = CATEGORIES.find(c => c.id === formData.category) || CATEGORIES[0];
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

  const targetDeleteProduct = products.find(p => p.id === deletingProductId);

  return (
    <div className="icon-admin-portal" role="dialog" aria-modal="true" aria-label="Icon Party Hire Operations Hub">

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
                src="/assets/images/logo.webp"
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
            <span className="nav-item-text">Equipment Inventory</span>
            <span className="nav-item-badge">{products.length}</span>
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

        {/* Footer Actions */}
        <div className="admin-sidebar-footer">
          <button
            type="button"
            className="admin-exit-btn"
            onClick={onClose}
            title="Exit admin panel and return to live website"
          >
            <span>← Return to Storefront</span>
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
      <main className="admin-portal-main">

        {/* Top Floating App Bar */}
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <button
              type="button"
              className="admin-hamburger-btn show-mobile"
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Open sidebar menu"
            >
              <div className="hamburger-line" />
              <div className="hamburger-line" />
              <div className="hamburger-line" />
            </button>

            <div>
              <div className="admin-breadcrumbs">
                <span>Icon Party Hire</span>
                <ChevronRight size={13} />
                <span className="crumb-active">
                  {activeTab === 'inventory' && 'Equipment Inventory (CRUD Hub)'}
                  {activeTab === 'overview' && 'Operations Dashboard'}
                  {activeTab === 'bookings' && 'Weekend Party Bookings'}
                  {activeTab === 'logistics' && 'Brisbane Warehouse Hub'}
                </span>
              </div>
              <h2 className="admin-page-title">
                {activeTab === 'inventory' && 'Commercial Equipment Inventory'}
                {activeTab === 'overview' && 'Event Fleet & Revenue Overview'}
                {activeTab === 'bookings' && 'Customer Bookings & Dispatches'}
                {activeTab === 'logistics' && 'Warehouse & Fleet Logistics'}
              </h2>
            </div>
          </div>

          <div className="admin-topbar-right">
            {activeTab === 'inventory' && (
              <button
                type="button"
                className="admin-btn-primary"
                onClick={handleOpenCreate}
              >
                <Plus size={16} />
                <span>Add Equipment</span>
              </button>
            )}

            <button
              type="button"
              className="admin-btn-close-store"
              onClick={onClose}
              title="Return to customer website"
            >
              <X size={16} />
              <span className="hide-mobile">Exit Admin</span>
            </button>
          </div>
        </header>

        {/* Tab 1: INVENTORY CRUD HUB */}
        {activeTab === 'inventory' && (
          <div className="admin-tab-content">
            
            {/* Quick Metrics Bar */}
            <div className="admin-kpi-strip">
              <div className="kpi-mini-card">
                <span className="kpi-label">TOTAL EQUIPMENT MODELS</span>
                <span className="kpi-val">{stats.totalItems} SKUs</span>
              </div>
              <div className="kpi-mini-card">
                <span className="kpi-label">TOTAL WAREHOUSE UNITS</span>
                <span className="kpi-val">{stats.totalUnits} Units</span>
              </div>
              <div className="kpi-mini-card">
                <span className="kpi-label">LOW STOCK ALERTS</span>
                <span className={`kpi-val ${stats.lowStockCount > 0 ? 'text-amber-500' : ''}`}>
                  {stats.lowStockCount} Items
                </span>
              </div>
              <div className="kpi-mini-card">
                <span className="kpi-label">TOTAL FLEET INVENTORY VALUE</span>
                <span className="kpi-val text-pink-600">${stats.totalCatalogValue.toLocaleString()} AUD</span>
              </div>
            </div>

            {/* Filter & Controls Toolbar */}
            <div className="admin-toolbar-card">
              
              {/* Row 1: Search & Filter Inputs */}
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
                {CATEGORIES.map(cat => {
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

            {/* Inventory Data Table */}
            <div className="admin-table-card">
              <div className="table-responsive-wrapper">
                <table className="admin-data-table">
                  <thead>
                    <tr>
                      <th style={{ width: '40%' }}>Equipment & SKU</th>
                      <th>Category</th>
                      <th>Weekend Rate</th>
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
                                <span className="rate-period">/ weekend</span>
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
              <div className="admin-table-footer">
                <span>Showing <strong>{filteredProducts.length}</strong> of <strong>{products.length}</strong> Brisbane equipment items</span>
                <span className="footer-sync-note">Live connected with customer storefront</span>
              </div>
            </div>

          </div>
        )}

        {/* Tab 2: OPERATIONS OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="admin-tab-content">
            
            {/* Courier Banner */}
            <div className="dispatch-hero-banner">
              <div className="dispatch-hero-copy">
                <span className="dispatch-badge">TODAY'S FLEET RUNS · GREATER BRISBANE</span>
                <h3 className="dispatch-title">Icon Mercedes Sprinter & Tail-Lift Truck Fleet</h3>
                <p className="dispatch-desc">
                  18 event packages staged in Murrumba Downs dispatch bays. Express setup crews active in New Farm, Paddington, Hamilton, and Gold Coast.
                </p>
                <div className="dispatch-actions">
                  <button
                    type="button"
                    className="btn-white-solid"
                    onClick={() => onToast?.('Printed 18 delivery manifests and run-sheets', 'gold')}
                  >
                    Print Driver Run Sheets
                  </button>
                  <button
                    type="button"
                    className="btn-glass-banner"
                    onClick={() => setActiveTab('bookings')}
                  >
                    Review All Bookings →
                  </button>
                </div>
              </div>

              <div className="dispatch-kpi-badge">
                <Truck size={36} className="text-emerald-400" />
                <span className="kpi-num">18 / 18</span>
                <span className="kpi-label">Setups On Schedule</span>
              </div>
            </div>

            {/* Metric Cards Row */}
            <div className="overview-cards-row">
              <div className="overview-metric-card">
                <div className="metric-card-top">
                  <div>
                    <span className="metric-title">Weekend Hire Revenue</span>
                    <span className="metric-sub">38 confirmed party hires</span>
                  </div>
                  <div className="metric-icon-bubble gold">
                    <DollarSign size={20} />
                  </div>
                </div>
                <div className="metric-val">$8,420 AUD</div>
                <div className="metric-trend positive">↑ +21.4% vs previous weekend</div>
              </div>

              <div className="overview-metric-card">
                <div className="metric-card-top">
                  <div>
                    <span className="metric-title">Security Bonds Held</span>
                    <span className="metric-sub">Held via Stripe AU</span>
                  </div>
                  <div className="metric-icon-bubble blue">
                    <Shield size={20} />
                  </div>
                </div>
                <div className="metric-val">$4,250 AUD</div>
                <div className="metric-trend neutral">100% automated post-return release</div>
              </div>

              <div className="overview-metric-card">
                <div className="metric-card-top">
                  <div>
                    <span className="metric-title">Equipment Fleet Capacity</span>
                    <span className="metric-sub">Gazebos, Silk Walls & Plinths</span>
                  </div>
                  <div className="metric-icon-bubble pink">
                    <Package size={20} />
                  </div>
                </div>
                <div className="metric-val">94% Booked</div>
                <div className="metric-trend warning">Near peak Saturday capacity</div>
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

              <div className="table-responsive-wrapper">
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
            </div>

          </div>
        )}

        {/* Tab 3: BOOKINGS MANAGEMENT */}
        {activeTab === 'bookings' && (
          <div className="admin-tab-content">
            <div className="table-header-bar">
              <div>
                <h3 className="card-box-title">Customer Party & Event Bookings</h3>
                <p className="card-box-desc">Review party hires, update fulfillment dispatch status, and manage security bonds.</p>
              </div>
              <div className="subpane-pills-row">
                {['all', 'confirmed', 'dispatched', 'delivered'].map(f => (
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
            </div>

            <div className="admin-table-card">
              <div className="table-responsive-wrapper">
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
                    {bookings
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
                      ))}
                  </tbody>
                </table>
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
                    {CATEGORIES.map(c => (
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
                  <label className="form-label">Weekend Rate (AUD $) *</label>
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
                    placeholder="e.g. 24–72 Hours Flexible Weekend Hire"
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
                    ${inspectingProduct.priceAUD || 50} <span className="inspect-rate-sub">AUD / weekend</span>
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

    </div>
  );
}

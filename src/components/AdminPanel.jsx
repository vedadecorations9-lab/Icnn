import React, { useState } from 'react';
import { BRISBANE_STORE_INFO, INITIAL_ORDERS } from '../data/products';

export default function AdminPanel({
  onClose,
  products,
  onAddProduct,
  onUpdateProductStock,
  onToast
}) {
  // Navigation Tabs with dedicated Sidebar
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'orders' | 'inventory' | 'showroom' | 'analytics'
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [orderFilter, setOrderFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('This Month');
  const [activeCategoryStat, setActiveCategoryStat] = useState({ name: 'Brass Urlis & Basins', amount: '$28,400 AUD' });
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  // Add Product Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('urli');
  const [newProdPrice, setNewProdPrice] = useState(95);
  const [newProdStock, setNewProdStock] = useState(15);
  const [newProdDesc, setNewProdDesc] = useState('');

  // Handle Order Status Change
  const handleStatusChange = (orderId, newStatus) => {
    setOrders(prev =>
      prev.map(o => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    onToast?.(`Order ${orderId} updated to "${newStatus}"`, 'success');
  };

  // Handle Add Product Submit
  const handleCreateProduct = (e) => {
    e.preventDefault();
    if (!newProdName.trim()) return;

    const newProduct = {
      id: `icon-${Date.now().toString().slice(-4)}`,
      name: newProdName,
      category: newProdCategory,
      categoryLabel: newProdCategory.toUpperCase(),
      priceAUD: newProdPrice,
      priceINR: Math.round(newProdPrice / 0.0185),
      originalAUD: Math.round(newProdPrice * 1.25),
      discount: '-20%',
      rating: 5.0,
      reviewsCount: 1,
      badge: 'New Hire Arrival',
      badgeType: 'badge-gold',
      image: '/assets/images/items/Icon 6x3 m Gazebo Hire-2-1024x1024.webp',
      description: newProdDesc || 'Commercial grade party hire equipment maintained in Brisbane warehouse.',
      origin: 'Icon Logistics Hub · Murrumba Downs QLD',
      material: 'Commercial Heavy-Duty Specification',
      dimensions: 'Standard Event Spec',
      hirePeriod: 'Weekend Event Hire (Fri–Mon)',
      bondAUD: 50,
      stock: parseInt(newProdStock, 10) || 10,
      sku: `IPH-AU-${Math.floor(100 + Math.random() * 900)}`
    };

    onAddProduct(newProduct);
    setIsAddModalOpen(false);
    setNewProdName('');
    setNewProdDesc('');
    onToast?.(`Added "${newProdName}" to Brisbane catalog`, 'success');
  };

  const filteredOrders = orders.filter(o => {
    if (orderFilter === 'all') return true;
    return o.status.toLowerCase() === orderFilter.toLowerCase();
  });

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.sku && p.sku.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // ICON Party Hire Real Bookings & Activity
  const STORE_TRANSACTIONS = [
    {
      id: 'tx-01',
      date: 'Today, 10:15 AM',
      customer: 'Sarah Jenkins',
      item: 'Commercial 6x3m Gazebo + Pink Ripple Arches',
      payment: 'Stripe AU',
      category: 'Marquees & Gazebos',
      catColor: '#D81B60',
      amount: '$190.00 AUD',
      status: 'Delivered',
      location: 'New Farm, Brisbane QLD',
      carrier: 'Icon Delivery Van 1 (IPH-DEL-88912)'
    },
    {
      id: 'tx-02',
      date: 'Today, 09:30 AM',
      customer: 'Marcus & Jessica Vance',
      item: 'Luxe 3D Silk Flower Wall + Low Fog Machine',
      payment: 'Afterpay AU',
      category: 'Backdrops & Arches',
      catColor: '#E03E8A',
      amount: '$330.00 AUD',
      status: 'Dispatched',
      location: 'Paddington, Brisbane QLD',
      carrier: 'Icon Setup Crew A (IPH-DEL-77401)'
    },
    {
      id: 'tx-03',
      date: 'Yesterday, 04:12 PM',
      customer: 'Liam O\'Connor',
      item: 'Foldable Silver Cocktail High-Top Tables (x6)',
      payment: 'Apple Pay',
      category: 'Tables & Furniture',
      catColor: '#F59E0B',
      amount: '$108.00 AUD',
      status: 'Processing',
      location: 'Broadbeach, Gold Coast QLD',
      carrier: 'Self-Pickup Murrumba Downs Hub'
    },
    {
      id: 'tx-04',
      date: 'Yesterday, 01:25 PM',
      customer: 'Chloe Sutherland',
      item: 'White Tiffany Event Chairs (x24) + Cushions',
      payment: 'Visa Debit',
      category: 'Chairs & Linens',
      catColor: '#D48B70',
      amount: '$132.00 AUD',
      status: 'Delivered',
      location: 'Hamilton, Brisbane QLD',
      carrier: 'Icon Delivery Van 2 (Gold Coast)'
    },
    {
      id: 'tx-05',
      date: '25 Oct, 11:05 AM',
      customer: 'David & Ananya Miller',
      item: 'Fluted White Plinths (Trio) + Cold Spark Pair',
      payment: 'Mastercard',
      category: 'Special Effects & FX',
      catColor: '#F59E0B',
      amount: '$175.00 AUD',
      status: 'Processing',
      location: 'Southport, Gold Coast QLD',
      carrier: 'Icon Tail-Lift Truck'
    },
    {
      id: 'tx-06',
      date: '24 Oct, 03:40 PM',
      customer: 'Aarav Patel',
      item: 'Chafing Dishes Twin Set + 28L Hot Water Urn',
      payment: 'Zip Pay AU',
      category: 'Catering Equipment',
      catColor: '#06B6D4',
      amount: '$65.00 AUD',
      status: 'Dispatched',
      location: 'Murrumba Downs, Brisbane QLD',
      carrier: 'Click & Collect (Showroom Pickup)'
    },
    {
      id: 'tx-07',
      date: '24 Oct, 01:10 PM',
      customer: 'Sunita Rao',
      item: 'Pink Pearl Beverage Dispensers + Gold Cake Trio',
      payment: 'Stripe AU',
      category: 'Plinths & Catering',
      catColor: '#F97316',
      amount: '$63.00 AUD',
      status: 'Delivered',
      location: 'Indooroopilly, Brisbane QLD',
      carrier: 'Icon Delivery Van 1 (IPH-DEL-87612)'
    }
  ];

  const TAB_TITLES = {
    overview: 'Event Hire Operations & Fleet Performance',
    orders: 'Event Bookings & Brisbane Fleet Delivery',
    inventory: 'Equipment Inventory, Bonds & Warehouse SKUs',
    showroom: 'Brisbane Warehouse Hub & Consultation Studio',
    analytics: 'Equipment Category Utilization & Revenue Analytics'
  };

  return (
    <div className="icon-admin-screen" role="dialog" aria-modal="true" aria-label="Icon Party Hire Operations Admin">

      {/* Mobile Backdrop for Sidebar */}
      {isSidebarOpen && (
        <div className="sidebar-backdrop show-mobile" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* =====================================================================
         1. DEDICATED LEFT SIDEBAR (Linear / Shopify Admin Standard)
         ===================================================================== */}
      <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`} aria-label="Admin Navigation Sidebar">

        {/* Sidebar Brand Header */}
        <div className="sidebar-brand-box">
          <div className="sidebar-brand-lockup" onClick={() => setActiveTab('overview')}>
            <img src="/assets/images/icon_logo.png" alt="Icon Party Hire" className="sidebar-brand-avatar" />
            <div className="sidebar-brand-info">
              <span className="sidebar-brand-title">ICON PARTY HIRE</span>
              <span className="sidebar-brand-tag">OPERATIONS HQ</span>
            </div>
          </div>
          <button
            className="sidebar-close-btn show-mobile"
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            ✕
          </button>
        </div>

        {/* Showroom Location Pill */}
        <div className="sidebar-showroom-pill">
          <span className="studio-live-dot"></span>
          <div className="studio-pill-text">
            <span className="studio-name">Murrumba Downs Hub</span>
            <span className="studio-state">Brisbane, QLD · Active</span>
          </div>
        </div>

        {/* Navigation Menu Groups */}
        <nav className="sidebar-nav-groups" aria-label="Admin Sections">

          <div className="nav-group-section">
            <span className="nav-group-title">STORE OPERATIONS</span>
            <ul className="nav-group-list">
              <li>
                <button
                  className={`sidebar-nav-link ${activeTab === 'overview' ? 'active' : ''}`}
                  onClick={() => { setActiveTab('overview'); setIsSidebarOpen(false); }}
                >
                  <span className="sidebar-link-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="7" height="7"></rect>
                      <rect x="14" y="3" width="7" height="7"></rect>
                      <rect x="14" y="14" width="7" height="7"></rect>
                      <rect x="3" y="14" width="7" height="7"></rect>
                    </svg>
                  </span>
                  <span className="sidebar-link-text">Store Overview</span>
                  <span className="sidebar-micro-pill">Live</span>
                </button>
              </li>
              <li>
                <button
                  className={`sidebar-nav-link ${activeTab === 'orders' ? 'active' : ''}`}
                  onClick={() => { setActiveTab('orders'); setIsSidebarOpen(false); }}
                >
                  <span className="sidebar-link-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                      <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                      <line x1="12" y1="22.08" x2="12" y2="12"></line>
                    </svg>
                  </span>
                  <span className="sidebar-link-text">Orders & Dispatches</span>
                  <span className="sidebar-micro-badge">18 New</span>
                </button>
              </li>
              <li>
                <button
                  className={`sidebar-nav-link ${activeTab === 'inventory' ? 'active' : ''}`}
                  onClick={() => { setActiveTab('inventory'); setIsSidebarOpen(false); }}
                >
                  <span className="sidebar-link-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line>
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                      <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                      <line x1="12" y1="22.08" x2="12" y2="12"></line>
                    </svg>
                  </span>
                  <span className="sidebar-link-text">Inventory & SKUs</span>
                  <span className="sidebar-micro-pill">{products.length}</span>
                </button>
              </li>
            </ul>
          </div>

          <div className="nav-group-section">
            <span className="nav-group-title">STUDIO & CHANNELS</span>
            <ul className="nav-group-list">
              <li>
                <button
                  className={`sidebar-nav-link ${activeTab === 'showroom' ? 'active' : ''}`}
                  onClick={() => { setActiveTab('showroom'); setIsSidebarOpen(false); }}
                >
                  <span className="sidebar-link-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 21h18"></path>
                      <path d="M3 10h18"></path>
                      <path d="M5 6l7-3 7 3"></path>
                      <path d="M4 10v11"></path>
                      <path d="M20 10v11"></path>
                      <path d="M8 14v4"></path>
                      <path d="M12 14v4"></path>
                      <path d="M16 14v4"></path>
                    </svg>
                  </span>
                  <span className="sidebar-link-text">Brisbane Showroom</span>
                  <span className="sidebar-micro-pill">POS</span>
                </button>
              </li>
              <li>
                <button
                  className={`sidebar-nav-link ${activeTab === 'analytics' ? 'active' : ''}`}
                  onClick={() => { setActiveTab('analytics'); setIsSidebarOpen(false); }}
                >
                  <span className="sidebar-link-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path>
                      <path d="M22 12A10 10 0 0 0 12 2v10z"></path>
                    </svg>
                  </span>
                  <span className="sidebar-link-text">Category Analytics</span>
                </button>
              </li>
            </ul>
          </div>

          <div className="nav-group-section">
            <span className="nav-group-title">QUICK ACTIONS</span>
            <ul className="nav-group-list">
              <li>
                <button
                  className="sidebar-nav-link action-quick-btn"
                  onClick={() => setIsAddModalOpen(true)}
                >
                  <span className="sidebar-link-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="16"></line>
                      <line x1="8" y1="12" x2="16" y2="12"></line>
                    </svg>
                  </span>
                  <span className="sidebar-link-text">+ Add Masterpiece</span>
                </button>
              </li>
              <li>
                <button
                  className="sidebar-nav-link action-quick-btn"
                  onClick={() => onToast?.('Printed 18 AusPost shipping manifests', 'success')}
                >
                  <span className="sidebar-link-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 6 2 18 2 18 9"></polyline>
                      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                      <rect x="6" y="14" width="12" height="8"></rect>
                    </svg>
                  </span>
                  <span className="sidebar-link-text">Print Manifest</span>
                </button>
              </li>
            </ul>
          </div>

        </nav>

        {/* Sidebar Footer User & Store Exit */}
        <div className="sidebar-footer-box">
          <div className="sidebar-user-card">
            <div className="sidebar-user-avatar">AS</div>
            <div className="sidebar-user-info">
              <span className="user-name">Aarav Sharma</span>
              <span className="user-role">Studio Director · Brisbane</span>
            </div>
          </div>

          <button
            className="sidebar-exit-storefront-btn"
            onClick={onClose}
            title="Return to Public Storefront"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            <span>Exit to Storefront</span>
          </button>
        </div>

      </aside>

      {/* =====================================================================
         2. MAIN VIEWPORT (Spacious, Left-Aligned Executive Dashboard)
         ===================================================================== */}
      <main className="admin-main-viewport">

        {/* Top Header Bar */}
        <header className="admin-viewport-header">
          <div className="viewport-header-left">
            {/* Mobile Sidebar Toggle Button */}
            <button
              className="sidebar-toggle-btn show-mobile"
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Open navigation sidebar"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>

            <div className="header-breadcrumbs">
              <span className="crumb-root">Icon Operations HQ</span>
              <span className="crumb-sep">/</span>
              <h1 className="crumb-current">{TAB_TITLES[activeTab]}</h1>
            </div>
          </div>

          <div className="viewport-header-right">

            {/* Quick Live Status */}
            <div className="header-live-badge hide-mobile">
              <span className="status-dot-pulse"></span>
              <span>Murrumba Downs Hub Active · Weekend Fleet Live</span>
            </div>

            {/* Notification Bell */}
            <button
              className="admin-header-icon-btn"
              title="Hire Alerts"
              onClick={() => onToast?.('All 16 event setups loaded onto Icon fleet vans', 'info')}
              aria-label="Notifications"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
              <span className="header-badge-dot"></span>
            </button>

            {/* + Add Masterpiece Button */}
            <button className="btn-emerald-pill" onClick={() => setIsAddModalOpen(true)}>
              + Add Equipment SKU
            </button>

            {/* Exit to Public Store */}
            <button className="btn-subtle-pill hide-mobile" onClick={onClose}>
              Public Storefront ↗
            </button>
          </div>
        </header>

        {/* Viewport Content Container */}
        <div className="admin-viewport-scroll">

          {/* ===================================================================
             TAB 1: STORE OVERVIEW (Full Width Executive Layout)
             =================================================================== */}
          {activeTab === 'overview' && (
            <div className="admin-tab-pane">

              {/* ROW 1: TWO ASYMMETRIC HERO CARDS */}
              <div className="icon-hero-grid">

                {/* Left Card: Gross Store Revenue & Orders */}
                <div className="icon-card icon-hero-treasury-card">
                  <div className="card-top-subrow">
                    <span className="card-meta-tag">ICON PARTY HIRE · BRISBANE WAREHOUSE & FLEET LOGISTICS</span>
                    <span className="card-meta-tag">OCTOBER 2026 OVERVIEW</span>
                  </div>

                  <div className="treasury-main-row">
                    <div className="treasury-title-wrap">
                      <h2 className="treasury-account-heading">Monthly Gross Equipment Hire</h2>
                      <div className="treasury-num-row">
                        <span className="treasury-acc-number">284 Weekend Events Serviced · $171.50 Average Booking Value</span>
                      </div>
                    </div>

                    <div className="treasury-balance-display">
                      <span className="treasury-amount">$48,780.00 AUD</span>
                      <span className="treasury-growth-tag">+24.6% MoM</span>
                    </div>
                  </div>

                  <div className="treasury-actions-row">
                    <button className="btn-emerald-pill" onClick={() => setIsAddModalOpen(true)}>
                      + Add Equipment SKU
                    </button>
                    <button className="btn-subtle-pill" onClick={() => onToast?.('Exporting October event bookings CSV...', 'info')}>
                      Export Bookings CSV
                    </button>
                    <button className="btn-subtle-pill" onClick={() => onToast?.('Generating Icon Van Fleet run sheet...', 'info')}>
                      Daily Fleet Run Sheet
                    </button>
                  </div>
                </div>

                {/* Right Card: Icon Van Fleet Dispatch */}
                <div className="icon-card icon-hero-courier-card">
                  <div className="courier-dots-row">
                    <span className="courier-dot active"></span>
                    <span className="courier-dot"></span>
                  </div>

                  <div className="courier-content-flex">
                    <div className="courier-text-wrap">
                      <div className="courier-tag-badge">TODAY'S EVENT DISPATCH & SETUP</div>
                      <h3 className="courier-title">Icon Van Fleet Runs: 8:00 AM & 1:00 PM</h3>
                      <p className="courier-desc">
                        16 event setups staged in Murrumba Downs dispatch bays. 3 vans routed across Greater Brisbane & Gold Coast.
                      </p>
                      <button
                        className="btn-white-pill"
                        onClick={() => onToast?.('Printed 16 Delivery Run Sheets & Equipment Checklists', 'success')}
                      >
                        Print Run Sheets & Manifests
                      </button>
                    </div>

                    {/* Clean Vector Logistics Badge */}
                    <div className="courier-vector-badge">
                      <div className="logistics-status-circle">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="1" y="3" width="15" height="13"></rect>
                          <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                          <circle cx="5.5" cy="18.5" r="2.5"></circle>
                          <circle cx="18.5" cy="18.5" r="2.5"></circle>
                        </svg>
                        <span className="logistics-metric">18 / 18</span>
                        <span className="logistics-subtext">Orders Staged</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* ROW 2: 4 EQUAL STORE METRIC CARDS */}
              <div className="icon-stats-row">

                {/* Stat 1: Weekend Hire Revenue */}
                <div className="icon-card icon-stat-card">
                  <div className="stat-card-header">
                    <div>
                      <div className="stat-card-title">Weekend Hire Revenue</div>
                      <div className="stat-card-meta">38 active party bookings</div>
                    </div>
                    <div className="stat-icon-pill icon-gold">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="1" x2="12" y2="23"></line>
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                      </svg>
                    </div>
                  </div>
                  <div className="stat-card-footer">
                    <div className="stat-big-num">$8,420.00 AUD</div>
                    <div className="stat-trend positive">↑ +21.4% vs last weekend</div>
                  </div>
                </div>

                {/* Stat 2: Active Van Dispatches */}
                <div className="icon-card icon-stat-card">
                  <div className="stat-card-header">
                    <div>
                      <div className="stat-card-title">Van Fleet Dispatches</div>
                      <div className="stat-card-meta">Brisbane, Gold Coast & Bay</div>
                    </div>
                    <div className="stat-icon-pill icon-emerald">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                        <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                        <line x1="12" y1="22.08" x2="12" y2="12"></line>
                      </svg>
                    </div>
                  </div>
                  <div className="stat-card-footer">
                    <div className="stat-big-num">16 Setups</div>
                    <div className="stat-trend positive">100% on-schedule dispatch</div>
                  </div>
                </div>

                {/* Stat 3: Equipment Availability Alert */}
                <div className="icon-card icon-stat-card">
                  <div className="stat-card-header">
                    <div>
                      <div className="stat-card-title">Equipment Capacity Alert</div>
                      <div className="stat-card-meta">6x3 Gazebos & Flower Walls</div>
                    </div>
                    <div className="stat-icon-pill icon-rose">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                        <line x1="12" y1="9" x2="12" y2="13"></line>
                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                      </svg>
                    </div>
                  </div>
                  <div className="stat-card-footer">
                    <div className="stat-big-num">94% Booked</div>
                    <div className="stat-trend warning">Near peak weekend cap</div>
                  </div>
                </div>

                {/* Stat 4: Refundable Security Bonds */}
                <div className="icon-card icon-stat-card">
                  <div className="stat-card-header">
                    <div>
                      <div className="stat-card-title">Refundable Bonds Held</div>
                      <div className="stat-card-meta">Held securely via Stripe AU</div>
                    </div>
                    <div className="stat-icon-pill icon-blue">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0284C7" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 21h18"></path>
                        <path d="M3 10h18"></path>
                        <path d="M5 6l7-3 7 3"></path>
                        <path d="M4 10v11"></path>
                        <path d="M20 10v11"></path>
                        <path d="M8 14v4"></path>
                        <path d="M12 14v4"></path>
                        <path d="M16 14v4"></path>
                      </svg>
                    </div>
                  </div>
                  <div className="stat-card-footer">
                    <div className="stat-big-num">$4,250.00 AUD</div>
                    <div className="stat-trend neutral">14 Studio pickups today</div>
                  </div>
                </div>

              </div>

              {/* ROW 3: LATEST ORDERS & CATEGORY DONUT CHART */}
              <div className="icon-analytics-grid">

                {/* Left Card: Latest Customer Orders */}
                <div className="icon-card icon-card-orders-table">
                  <div className="section-head-bar">
                    <div>
                      <h3 className="section-head-title">Recent Customer Orders & Dispatches</h3>
                      <p className="section-head-desc">Live purchases across Brisbane Metro, Queensland, and Interstate Express.</p>
                    </div>
                    <button
                      className="circle-nav-arrow-btn"
                      onClick={() => setActiveTab('orders')}
                      title="View all customer orders"
                    >
                      →
                    </button>
                  </div>

                  {/* Explicit Column Headers */}
                  <div className="order-table-header-row">
                    <span className="col-hdr hdr-date">DATE</span>
                    <span className="col-hdr hdr-customer">CUSTOMER & CURATED PIECE</span>
                    <span className="col-hdr hdr-payment">PAYMENT</span>
                    <span className="col-hdr hdr-category">CATEGORY</span>
                    <span className="col-hdr hdr-amount">AMOUNT</span>
                    <span className="col-hdr hdr-status">STATUS</span>
                    <span className="col-hdr hdr-action"></span>
                  </div>

                  <div className="orders-clean-list">
                    {STORE_TRANSACTIONS.map(tx => (
                      <div key={tx.id} className="order-row-item-wrap">
                        <div
                          className="order-row-item"
                          onClick={() => setExpandedOrderId(expandedOrderId === tx.id ? null : tx.id)}
                        >
                          <span className="order-date-col">{tx.date.split(',')[0]}</span>

                          <div className="order-cust-col">
                            <span className="order-cust-name">{tx.customer}</span>
                            <span className="order-cust-item">{tx.item}</span>
                          </div>

                          <span className="order-pay-col">{tx.payment}</span>

                          <div className="order-cat-col">
                            <span className="order-cat-dot" style={{ backgroundColor: tx.catColor }}></span>
                            <span className="order-cat-name">{tx.category}</span>
                          </div>

                          <span className="order-amount-col">{tx.amount}</span>

                          <span className={`order-status-badge status-${tx.status.toLowerCase()}`}>
                            {tx.status}
                          </span>

                          <button className="order-expand-toggle" aria-label="Toggle details">
                            {expandedOrderId === tx.id ? '▴' : '▾'}
                          </button>
                        </div>

                        {expandedOrderId === tx.id && (
                          <div className="order-expanded-details">
                            <div className="exp-line">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                              <span><strong>Delivery Address:</strong> {tx.location}</span>
                            </div>
                            <div className="exp-line">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
                              <span><strong>Shipping Carrier:</strong> {tx.carrier}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="orders-footer-row">
                    <button className="see-more-link-btn" onClick={() => setActiveTab('orders')}>
                      View All Customer Orders & Invoices →
                    </button>
                  </div>
                </div>

                {/* Right Card: Category Breakdown (Strictly Bounded Donut Chart) */}
                <div className="icon-card icon-card-donut-breakdown">
                  <div className="section-head-bar">
                    <div>
                      <h3 className="section-head-title">Sales by Decor Craftsmanship</h3>
                      <p className="section-head-desc">Revenue distribution by artisanal craftsmanship.</p>
                    </div>
                    <button
                      className="circle-nav-arrow-btn"
                      onClick={() => setActiveTab('analytics')}
                      title="Detailed sales analytics"
                    >
                      →
                    </button>
                  </div>

                  {/* 3 Period Metrics */}
                  <div className="period-metrics-grid">
                    <div className="period-col">
                      <span className="period-label">daily</span>
                      <span className="period-amount">$2,750.40 AUD</span>
                    </div>
                    <div className="period-col">
                      <span className="period-label">weekly</span>
                      <span className="period-amount">$14,200.65 AUD</span>
                    </div>
                    <div className="period-col">
                      <span className="period-label">monthly</span>
                      <span className="period-amount">$82,000.00 AUD</span>
                    </div>
                  </div>

                  {/* Time Range Filter */}
                  <div className="period-select-row">
                    <select
                      value={timeFilter}
                      onChange={(e) => setTimeFilter(e.target.value)}
                      className="period-dropdown-select"
                    >
                      <option value="This Month">This Month (October)</option>
                      <option value="Last 30 days">Last 30 days</option>
                      <option value="Q3 2026">Q3 Festive Season</option>
                    </select>
                  </div>

                  {/* Donut Chart & Legend Stack */}
                  <div className="donut-and-legend-row">
                    <div className="donut-ring-wrap">
                      <svg viewBox="0 0 200 200" className="donut-svg-graphic">
                        <circle cx="100" cy="100" r="70" fill="transparent" stroke="#F1F5F9" strokeWidth="20" />
                        {/* Segment 1: Brass Urlis (Coral) */}
                        <circle
                          cx="100" cy="100" r="70"
                          fill="transparent"
                          stroke="#FF6B6B"
                          strokeWidth="20"
                          strokeDasharray="145 307"
                          strokeDashoffset="0"
                          className="donut-segment-interactive"
                          onClick={() => setActiveCategoryStat({ name: 'Brass Urlis & Basins', amount: '$28,400 AUD' })}
                        />
                        {/* Segment 2: Ambient Lamps (Amber) */}
                        <circle
                          cx="100" cy="100" r="70"
                          fill="transparent"
                          stroke="#F59E0B"
                          strokeWidth="20"
                          strokeDasharray="95 357"
                          strokeDashoffset="-145"
                          className="donut-segment-interactive"
                          onClick={() => setActiveCategoryStat({ name: 'Ambient Jali Lamps', amount: '$18,200 AUD' })}
                        />
                        {/* Segment 3: Sacred Pooja Decor (Pink) */}
                        <circle
                          cx="100" cy="100" r="70"
                          fill="transparent"
                          stroke="#EC4899"
                          strokeWidth="20"
                          strokeDasharray="80 372"
                          strokeDashoffset="-240"
                          className="donut-segment-interactive"
                          onClick={() => setActiveCategoryStat({ name: 'Sacred Pooja Decor', amount: '$14,800 AUD' })}
                        />
                        {/* Segment 4: Pichwai Art (Emerald) */}
                        <circle
                          cx="100" cy="100" r="70"
                          fill="transparent"
                          stroke="#10B981"
                          strokeWidth="20"
                          strokeDasharray="60 392"
                          strokeDashoffset="-320"
                          className="donut-segment-interactive"
                          onClick={() => setActiveCategoryStat({ name: 'Pichwai Lotus Plates', amount: '$11,500 AUD' })}
                        />
                        {/* Segment 5: Marble Decor (Cyan) */}
                        <circle
                          cx="100" cy="100" r="70"
                          fill="transparent"
                          stroke="#06B6D4"
                          strokeWidth="20"
                          strokeDasharray="40 412"
                          strokeDashoffset="-380"
                          className="donut-segment-interactive"
                          onClick={() => setActiveCategoryStat({ name: 'Makrana Marble Bowls', amount: '$6,600 AUD' })}
                        />
                        {/* Segment 6: Scented Wax & Bells (Purple) */}
                        <circle
                          cx="100" cy="100" r="70"
                          fill="transparent"
                          stroke="#8B5CF6"
                          strokeWidth="20"
                          strokeDasharray="30 422"
                          strokeDashoffset="-420"
                          className="donut-segment-interactive"
                          onClick={() => setActiveCategoryStat({ name: 'Scented Wax & Bells', amount: '$2,500 AUD' })}
                        />
                      </svg>

                      {/* Donut Center Text Strictly Contained */}
                      <div className="donut-center-info">
                        <span className="donut-center-tag">{activeCategoryStat.name}</span>
                        <span className="donut-center-sum">{activeCategoryStat.amount}</span>
                      </div>
                    </div>

                    {/* Legend List */}
                    <div className="category-legend-list">
                      {[
                        { label: 'Brass Urlis & Basins', color: '#FF6B6B', amt: '$28,400 AUD', pct: '38%' },
                        { label: 'Ambient Jali Lamps', color: '#F59E0B', amt: '$18,200 AUD', pct: '24%' },
                        { label: 'Sacred Pooja Decor', color: '#EC4899', amt: '$14,800 AUD', pct: '20%' },
                        { label: 'Pichwai Wall Art', color: '#10B981', amt: '$11,500 AUD', pct: '15%' },
                        { label: 'Makrana Marble Decor', color: '#06B6D4', amt: '$6,600 AUD', pct: '9%' },
                        { label: 'Scented Wax & Bells', color: '#8B5CF6', amt: '$2,500 AUD', pct: '3%' },
                      ].map(cat => (
                        <div
                          key={cat.label}
                          className={`legend-item-line ${activeCategoryStat.name === cat.label ? 'active' : ''}`}
                          onClick={() => setActiveCategoryStat({ name: cat.label, amount: cat.amt })}
                        >
                          <span className="legend-item-dot" style={{ backgroundColor: cat.color }}></span>
                          <span className="legend-item-title">{cat.label}</span>
                          <span className="legend-item-pct">{cat.pct}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* ===================================================================
             TAB 2: ORDERS & FULFILLMENT (Full-Width Table)
             =================================================================== */}
          {activeTab === 'orders' && (
            <div className="admin-tab-pane">
              <div className="subpane-header-row">
                <div>
                  <h2 className="subpane-title">Customer Orders & Australian Fulfillment</h2>
                  <p className="subpane-desc">Manage dispatch workflows, print shipping labels, and track AusPost / StarTrack carrier statuses.</p>
                </div>

                {/* Filter Pills */}
                <div className="subpane-pills-row">
                  {['all', 'processing', 'dispatched', 'delivered'].map(f => (
                    <button
                      key={f}
                      className={`subpane-pill ${orderFilter === f ? 'active' : ''}`}
                      onClick={() => setOrderFilter(f)}
                    >
                      {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="icon-card icon-full-table-card">
                <table className="icon-modern-table">
                  <thead>
                    <tr>
                      <th>Order Reference</th>
                      <th>Customer Name</th>
                      <th>Destination Location</th>
                      <th>Curated Pieces</th>
                      <th>Carrier / Tracking</th>
                      <th>Total AUD</th>
                      <th>Fulfillment Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map(order => (
                      <tr key={order.id}>
                        <td className="font-mono-bold">{order.id}</td>
                        <td>
                          <strong className="text-dark">{order.customerName}</strong>
                          <div className="text-subtle-xs">{order.phone}</div>
                        </td>
                        <td>{order.city}</td>
                        <td>{order.items.join(', ')}</td>
                        <td>
                          <span className="carrier-badge">{order.carrier}</span>
                          <div className="text-subtle-xs font-mono">{order.tracking}</div>
                        </td>
                        <td><strong className="text-dark">A${order.totalAUD}</strong></td>
                        <td>
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            className={`status-select-pill status-${order.status.toLowerCase()}`}
                          >
                            <option value="Processing">Processing</option>
                            <option value="Dispatched">Dispatched</option>
                            <option value="Delivered">Delivered</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ===================================================================
             TAB 3: INVENTORY & SKUs (Stock Management & Add Product)
             =================================================================== */}
          {activeTab === 'inventory' && (
            <div className="admin-tab-pane">
              <div className="subpane-header-row">
                <div>
                  <h2 className="subpane-title">Inventory Catalog & Warehouse Stock</h2>
                  <p className="subpane-desc">Monitor stock quantities, reorder points, and create new handcrafted pieces in Brisbane.</p>
                </div>

                <div className="subpane-actions-row">
                  <input
                    type="text"
                    placeholder="Search products by title or SKU..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-field-pill"
                  />
                  <button className="btn-emerald-pill" onClick={() => setIsAddModalOpen(true)}>
                    + Add New Masterpiece
                  </button>
                </div>
              </div>

              <div className="icon-card icon-full-table-card">
                <table className="icon-modern-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>SKU Code</th>
                      <th>Category</th>
                      <th>Retail Price</th>
                      <th>Stock Units</th>
                      <th>Adjust Units</th>
                      <th>Artisan Origin</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map(p => (
                      <tr key={p.id}>
                        <td>
                          <div className="product-table-cell">
                            <img src={p.image} alt={p.name} className="product-table-thumb" />
                            <div>
                              <strong className="text-dark">{p.name}</strong>
                              <div className="text-subtle-xs">{p.material}</div>
                            </div>
                          </div>
                        </td>
                        <td className="font-mono-bold">{p.sku || `VD-${p.id}`}</td>
                        <td>
                          <span className="table-cat-badge">{p.categoryLabel}</span>
                        </td>
                        <td><strong className="text-dark">A${Math.round(p.priceINR * 0.0185)}</strong></td>
                        <td>
                          <span className={`stock-level-pill ${p.stock <= 5 ? 'stock-low' : 'stock-ok'}`}>
                            {p.stock} units
                          </span>
                        </td>
                        <td>
                          <div className="stock-counter-buttons">
                            <button
                              type="button"
                              className="stock-btn"
                              onClick={() => onUpdateProductStock?.(p.id, Math.max(0, p.stock - 1))}
                              title="Decrease stock"
                            >
                              -
                            </button>
                            <span className="stock-count-display">{p.stock}</span>
                            <button
                              type="button"
                              className="stock-btn"
                              onClick={() => onUpdateProductStock?.(p.id, p.stock + 1)}
                              title="Increase stock"
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="text-subtle-xs">{p.origin}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ===================================================================
             TAB 4: BRISBANE WAREHOUSE & FLEET LOGISTICS
             =================================================================== */}
          {activeTab === 'showroom' && (
            <div className="admin-tab-pane">
              <div className="subpane-header-row">
                <div>
                  <h2 className="subpane-title">Brisbane Warehouse Hub & Consultation Studio</h2>
                  <p className="subpane-desc">Client event consultations, warehouse self-pickups, and daily delivery fleet schedules.</p>
                </div>
              </div>

              <div className="showroom-boxes-grid">
                <div className="icon-card showroom-info-card">
                  <h3 className="card-box-title">Murrumba Downs Hub</h3>
                  <div className="spec-row">
                    <span className="label">Studio Location</span>
                    <span className="val">{BRISBANE_STORE_INFO.address}, Murrumba Downs QLD 4503</span>
                  </div>
                  <div className="spec-row">
                    <span className="label">Distribution Hub</span>
                    <span className="val">{BRISBANE_STORE_INFO.warehouseHub}</span>
                  </div>
                  <div className="spec-row">
                    <span className="label">Visiting Hours</span>
                    <span className="val">{BRISBANE_STORE_INFO.showroomHours}</span>
                  </div>
                  <div className="spec-row">
                    <span className="label">Dispatch Hotline</span>
                    <span className="val">{BRISBANE_STORE_INFO.phone}</span>
                  </div>
                  <div className="spec-row">
                    <span className="label">ABN Registration</span>
                    <span className="val">{BRISBANE_STORE_INFO.abn} (Registered in QLD)</span>
                  </div>
                </div>

                <div className="icon-card showroom-info-card">
                  <h3 className="card-box-title">Event Fleet Logistics & Van Dispatches</h3>
                  <div className="spec-row">
                    <span className="label">Morning Van Run</span>
                    <span className="val">Every business day & weekend at 8:00 AM AEST</span>
                  </div>
                  <div className="spec-row">
                    <span className="label">Afternoon Run</span>
                    <span className="val">Same-day afternoon delivery by 1:00 PM</span>
                  </div>
                  <div className="spec-row">
                    <span className="label">Delivery Coverage</span>
                    <span className="val">Greater Brisbane, Gold Coast & Sunshine Coast</span>
                  </div>
                  <div className="spec-row">
                    <span className="label">Public Liability</span>
                    <span className="val">100% insured for park & venue party setups</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===================================================================
             TAB 5: CATEGORY ANALYTICS
             =================================================================== */}
          {activeTab === 'analytics' && (
            <div className="admin-tab-pane">
              <div className="subpane-header-row">
                <div>
                  <h2 className="subpane-title">Category Revenue & Hire Volume Trends</h2>
                  <p className="subpane-desc">Breakdown of gross hires across Gazebos, Backdrops, Tables, Chairs, Plinths, Catering & Special FX.</p>
                </div>
              </div>

              <div className="showroom-boxes-grid">
                <div className="icon-card showroom-info-card">
                  <span className="card-meta-tag">TOTAL HIRE VOLUME (LAST 90 DAYS)</span>
                  <div className="treasury-amount" style={{ margin: '10px 0 16px 0' }}>$118,450.00 AUD</div>
                  <div className="stat-trend positive">↑ +22.4% booking growth vs previous quarter</div>
                </div>

                <div className="icon-card showroom-info-card">
                  <span className="card-meta-tag">TOP PERFORMING EQUIPMENT</span>
                  <div className="treasury-amount" style={{ margin: '10px 0 16px 0' }}>6x3m Commercial Pop-Up Gazebos</div>
                  <div className="stat-trend positive">Accounting for 34% of total Queensland weekend hire bookings</div>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* =====================================================================
         ADD PRODUCT MODAL
         ===================================================================== */}
      {isAddModalOpen && (
        <div className="admin-modal-overlay" onClick={() => setIsAddModalOpen(false)}>
          <div className="admin-modal-window" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-line">
              <h3 className="modal-title-text">Add Masterpiece to Brisbane Catalog</h3>
              <button className="modal-close-btn" onClick={() => setIsAddModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleCreateProduct}>
              <div className="form-field-group">
                <label>Product Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Moradabad Peacock Handled Urli"
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  className="modal-text-input"
                />
              </div>

              <div className="form-two-cols">
                <div className="form-field-group">
                  <label>Category</label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value)}
                    className="modal-text-input"
                  >
                    <option value="urli">Brass Urli</option>
                    <option value="lamps">Ambient Lamps</option>
                    <option value="pooja">Pooja Mandir</option>
                    <option value="wallart">Pichwai Art</option>
                    <option value="marble">Marble Decor</option>
                    <option value="toran">Festive Toran</option>
                    <option value="wax">Scented Wax</option>
                    <option value="bells">Bells & Chimes</option>
                  </select>
                </div>

                <div className="form-field-group">
                  <label>Price (AUD $)</label>
                  <input
                    type="number"
                    min="10"
                    step="1"
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(Number(e.target.value))}
                    className="modal-text-input"
                  />
                </div>
              </div>

              <div className="form-field-group">
                <label>Initial Units in Brisbane Warehouse</label>
                <input
                  type="number"
                  min="1"
                  value={newProdStock}
                  onChange={(e) => setNewProdStock(Number(e.target.value))}
                  className="modal-text-input"
                />
              </div>

              <div className="form-field-group">
                <label>Artisan Story & Material Dimensions</label>
                <textarea
                  rows="3"
                  placeholder="Hand-hammered brass, floral engravings, Moradabad origin..."
                  value={newProdDesc}
                  onChange={(e) => setNewProdDesc(e.target.value)}
                  className="modal-text-input"
                ></textarea>
              </div>

              <div className="modal-actions-bar">
                <button
                  type="button"
                  className="btn-subtle-pill"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-emerald-pill">
                  Save Piece to Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

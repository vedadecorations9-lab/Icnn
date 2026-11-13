import React from 'react';

export default function SubNav({ onOpenCategories, onFilterCategory, onOpenTrackOrder }) {
  return (
    <nav className="sub-nav" aria-label="Secondary navigation">
      <div className="container sub-nav-row">
        
        {/* "All Categories" Dark Pill Button */}
        <button className="all-cat-btn" onClick={onOpenCategories}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          <span>All Categories</span>
        </button>

        {/* Nav Links */}
        <ul className="nav-links">
          <li><a href="#home" className="nav-link active">Home</a></li>
          <li>
            <a
              href="#top-picks-section"
              className="nav-link"
              onClick={() => onFilterCategory('all')}
            >
              Shop
            </a>
          </li>
          <li>
            <a
              href="#top-picks-section"
              className="nav-link badge-link"
              onClick={() => onFilterCategory('urli')}
            >
              Festive Deals <span className="tag-badge">SALE</span>
            </a>
          </li>
          <li>
            <a
              href="#top-picks-section"
              className="nav-link"
              onClick={() => onFilterCategory('lamps')}
            >
              New Arrivals
            </a>
          </li>
          <li><a href="#artisan-heritage" className="nav-link">Artisan Stories</a></li>
          <li><a href="#lookbook-section" className="nav-link">Inspiration</a></li>
        </ul>

      </div>
    </nav>
  );
}

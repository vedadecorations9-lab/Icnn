import React from 'react';

const CATEGORIES = [
  { 
    key: 'all', 
    label: 'All Items', 
    image: '/assets/images/icon_logo.png',
    alt: 'Browse All Icon Party Hire Equipment',
    isEmblem: true
  },
  { 
    key: 'marquees', 
    label: 'Gazebos', 
    image: '/assets/images/items/Icon 6x3 m Gazebo Hire-2-1024x1024.webp',
    alt: 'Commercial 6x3m Pop-Up Event Gazebos'
  },
  { 
    key: 'backdrops', 
    label: 'Backdrops', 
    image: '/assets/images/items/Icon Party Hire flower wall-1024x1024.webp',
    alt: '3D Silk Flower Walls and Ripple Arches'
  },
  { 
    key: 'tables', 
    label: 'Tables', 
    image: '/assets/images/items/Foldable Silver Cocktail Table Hire-6-1024x1024.webp',
    alt: 'Silver Cocktail Tables and Round Banquet Tables'
  },
  { 
    key: 'chairs', 
    label: 'Chairs', 
    image: '/assets/images/items/Icon Party Hire Chair Rental-1-1024x1819.webp',
    alt: 'White Tiffany Event Chairs and Fitted Spandex Covers'
  },
  { 
    key: 'plinths', 
    label: 'Plinths', 
    image: '/assets/images/items/Icon Party Hire white plinths-1024x907.webp',
    alt: 'Fluted Cylinder Cake Plinths and Gold Stands'
  },
  { 
    key: 'catering', 
    label: 'Catering', 
    image: '/assets/images/items/Icon Party Hire chafing dishes-5-1024x1115.webp',
    alt: 'Stainless Steel Chafing Warmers and 28L Water Urn'
  },
  { 
    key: 'effects', 
    label: 'Special FX', 
    image: '/assets/images/items/Spark machines for hire $80-1024x1024.webp',
    alt: 'Indoor Cold Spark Machines and Low Fog Cloud Effects'
  }
];

export default function CategoryBar({ activeCategory, onSelectCategory }) {
  return (
    <section className="categories-bar-section" aria-label="Event Hire Categories">
      <div className="container">
        <div className="category-row">
          {CATEGORIES.map(cat => (
            <button
              key={cat.key}
              type="button"
              className={`cat-circle-card ${activeCategory === cat.key ? 'active' : ''}`}
              onClick={() => onSelectCategory(cat.key)}
              aria-label={`Filter by ${cat.label}`}
            >
              <div className="cat-icon-frame">
                <img
                  src={cat.image}
                  alt={cat.alt}
                  className={`cat-thumb-img ${cat.isEmblem ? 'cat-emblem-img' : ''}`}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = '/assets/images/icon_logo.png';
                  }}
                />
              </div>
              <span className="cat-title">{cat.label}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

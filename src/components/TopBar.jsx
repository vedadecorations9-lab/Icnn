import React from 'react';

export default function TopBar() {
  return (
    <aside className="top-bar" aria-label="Icon Party Hire Brisbane Announcements">
      <div className="top-bar-inner">
        <div className="top-bar-left hide-mobile">
          <span className="top-bar-dot"></span>
          <span>Murrumba Downs, Brisbane 4503 · Ph: 0439 592 472</span>
        </div>
        <div className="top-bar-center">
          <span>Weekend party hire and dispatch across Greater Brisbane, Gold Coast, and Sunshine Coast</span>
        </div>
        <div className="top-bar-right hide-mobile">
          <span>Call: 0439 592 472 · Commercial Gazebos, Backdrops & FX</span>
        </div>
      </div>
    </aside>
  );
}

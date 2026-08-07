import React from 'react';
import { Bell } from 'lucide-react';
import { INITIAL_NOTIFICATIONS } from '../lib/supabase';

export default function NotificationsList({ currentRole, setActiveTab }) {
  const notifications = INITIAL_NOTIFICATIONS;

  return (
    <div className="content-card mb-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h3 className="card-title-header mb-0">Thông báo mới</h3>
        <span 
          className="card-link cursor-pointer"
          onClick={() => setActiveTab && setActiveTab('notifications')}
        >
          Xem tất cả
        </span>
      </div>

      {notifications.length === 0 ? (
        <div className="p-3 bg-light rounded-3 text-center border">
          <div className="p-2 bg-white d-inline-block rounded-circle shadow-sm mb-2 text-warning">
            <Bell size={22} />
          </div>
          <div className="fw-semibold text-dark" style={{ fontSize: '12.5px' }}>Không có thông báo mới</div>
          <div className="text-secondary" style={{ fontSize: '11px' }}>Thông báo tức thời từ Đoàn xã sẽ hiển thị tại đây</div>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {notifications.map((n) => (
            <div key={n.id} className="p-2 rounded-3 bg-light border">
              <div className="fw-bold text-dark">{n.title}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

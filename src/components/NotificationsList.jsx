import React from 'react';
import { Bell } from 'lucide-react';

export default function NotificationsList({ notifications = [], currentRole, setActiveTab }) {
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
            <div key={n.id} className="p-3 rounded-3 bg-light border d-flex align-items-start gap-2">
              <div className="p-2 rounded-2 bg-warning-subtle text-warning mt-1">
                <Bell size={16} />
              </div>
              <div>
                <div className="fw-bold text-dark" style={{ fontSize: '13px' }}>{n.title}</div>
                {n.content && <div className="text-secondary" style={{ fontSize: '11.5px' }}>{n.content}</div>}
                {n.time_ago && <div className="text-muted" style={{ fontSize: '10.5px' }}>{n.time_ago}</div>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

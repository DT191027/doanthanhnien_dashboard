import React from 'react';
import { Bell } from 'lucide-react';
import { sortNotificationsByPriority } from '../lib/supabase';
import { ReceiptConfirmationBox } from './SecondaryViews';

export default function NotificationsList({ notifications = [], currentRole, setActiveTab, onConfirmReceipt }) {
  const sortedNotifications = sortNotificationsByPriority(notifications);

  const isDoanXa = currentRole?.role === 'admin' || currentRole?.role === 'doan_xa' || currentRole?.full_name?.includes('Đoàn xã');

  const getBadgeStyle = (priority) => {
    const p = String(priority || '').toLowerCase();
    if (p.includes('khẩn') || p.includes('cao')) {
      return { bg: 'bg-danger-subtle text-danger border-danger-subtle', label: '🔥 Khẩn cấp' };
    }
    if (p.includes('trung bình')) {
      return { bg: 'bg-warning-subtle text-warning-emphasis border-warning-subtle', label: '⚡ Trung bình' };
    }
    return { bg: 'bg-secondary-subtle text-secondary border-secondary-subtle', label: 'Bình thường' };
  };

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

      {sortedNotifications.length === 0 ? (
        <div className="p-3 bg-light rounded-3 text-center border">
          <div className="p-2 bg-white d-inline-block rounded-circle shadow-sm mb-2 text-warning">
            <Bell size={22} />
          </div>
          <div className="fw-semibold text-dark" style={{ fontSize: '12.5px' }}>Không có thông báo mới</div>
          <div className="text-secondary" style={{ fontSize: '11px' }}>Thông báo tức thời từ Đoàn xã sẽ hiển thị tại đây</div>
        </div>
      ) : (
        <div className="d-flex flex-column gap-2.5">
          {sortedNotifications.map((n) => {
            const badge = getBadgeStyle(n.priority);
            return (
              <div key={n.id} className="p-3 rounded-3 bg-light border d-flex align-items-start gap-2.5 hover-shadow transition">
                <div className="p-2 rounded-2 bg-warning-subtle text-warning mt-0.5 flex-shrink-0">
                  <Bell size={16} />
                </div>
                <div className="flex-grow-1">
                  <div className="d-flex align-items-center justify-content-between mb-1 gap-2">
                    <div className="fw-bold text-dark" style={{ fontSize: '13px' }}>{n.title}</div>
                    <span className={`badge ${badge.bg} border px-2 py-0.5 flex-shrink-0`} style={{ fontSize: '10px' }}>
                      {badge.label}
                    </span>
                  </div>
                  {n.content && <div className="text-secondary mb-1" style={{ fontSize: '11.5px' }}>{n.content}</div>}
                  <div className="d-flex align-items-center justify-content-between text-muted mt-2 pt-1 border-top" style={{ fontSize: '10.5px' }}>
                    <span>📌 {n.target_scope || '30 Chi đoàn Ấp'}</span>
                    <div className="d-flex align-items-center gap-2">
                      <span>{n.time_ago || 'Vừa xong'}</span>
                      <ReceiptConfirmationBox 
                        type="notification" 
                        item={n} 
                        currentRole={currentRole} 
                        isDoanXa={isDoanXa} 
                        onConfirmReceipt={onConfirmReceipt} 
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

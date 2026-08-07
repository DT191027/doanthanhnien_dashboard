import React from 'react';
import { Clock, MapPin, Calendar, Plus } from 'lucide-react';

export default function UpcomingActivities({ activities = [], setActiveTab, onOpenCreateActivity }) {
  return (
    <div className="content-card mb-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h3 className="card-title-header mb-0">Hoạt động sắp diễn ra</h3>
        <span 
          className="card-link cursor-pointer"
          onClick={() => setActiveTab && setActiveTab('activities')}
        >
          Xem lịch đầy đủ
        </span>
      </div>

      {activities.length === 0 ? (
        <div className="p-4 bg-light rounded-3 text-center border">
          <div className="p-3 bg-white d-inline-block rounded-circle shadow-sm mb-2 text-primary">
            <Calendar size={28} />
          </div>
          <div className="fw-bold text-dark mb-1" style={{ fontSize: '13.5px' }}>Chưa có hoạt động nào</div>
          <div className="text-secondary mb-3" style={{ fontSize: '12px' }}>
            Hệ thống sẵn sàng ghi nhận hoạt động mới từ Đoàn xã Xuân Thới Sơn
          </div>
          {onOpenCreateActivity && (
            <button 
              className="btn btn-sm btn-primary fw-semibold px-3 py-1.5"
              style={{ backgroundColor: '#0066FF' }}
              onClick={onOpenCreateActivity}
            >
              <Plus size={14} className="me-1" />
              Tạo hoạt động đầu tiên
            </button>
          )}
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {activities.map((act) => (
            <div 
              key={act.id}
              className="p-2 rounded-3 bg-light border d-flex align-items-center justify-content-between cursor-pointer hover-bg-white transition"
            >
              <div className="d-flex align-items-center gap-3">
                <div className="activity-date-badge">
                  <div className="activity-date-num">{act.day}</div>
                  <div className="activity-date-month">{act.month}</div>
                </div>
                <div>
                  <div className="fw-bold text-primary mb-1" style={{ fontSize: '13.5px' }}>
                    {act.title}
                  </div>
                  <div className="d-flex align-items-center gap-3 text-secondary" style={{ fontSize: '11.5px' }}>
                    <span className="d-flex align-items-center gap-1"><Clock size={13} /> {act.time}</span>
                    <span className="d-flex align-items-center gap-1"><MapPin size={13} /> {act.location}</span>
                  </div>
                </div>
              </div>
              <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2 py-1" style={{ fontSize: '11px', fontWeight: 600 }}>
                {act.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import React from 'react';
import { Calendar, FileText, Send, Users, Minus } from 'lucide-react';

export default function StatsCards() {
  return (
    <div className="row g-3 mb-4">
      {/* Stat Card 1 */}
      <div className="col-12 col-sm-6 col-xl-3">
        <div className="content-card mb-0 h-100">
          <div className="d-flex align-items-center justify-content-between mb-2">
            <span className="text-secondary" style={{ fontSize: '13px', fontWeight: 500 }}>
              Hoạt động tháng này
            </span>
            <div className="p-2 rounded-3 bg-primary-subtle text-primary">
              <Calendar size={18} />
            </div>
          </div>
          <div className="fw-extrabold text-dark mb-2" style={{ fontSize: '24px' }}>
            0
          </div>
          <div className="d-flex align-items-center gap-1 text-secondary mb-3" style={{ fontSize: '11.5px', fontWeight: 600 }}>
            <Minus size={14} />
            <span>Chưa có dữ liệu</span>
          </div>
          {/* Straight Flat Line */}
          <svg viewBox="0 0 100 24" className="w-100" style={{ height: '32px' }}>
            <path 
              d="M 0 12 L 100 12" 
              fill="none" 
              stroke="#0066FF" 
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      {/* Stat Card 2 */}
      <div className="col-12 col-sm-6 col-xl-3">
        <div className="content-card mb-0 h-100">
          <div className="d-flex align-items-center justify-content-between mb-2">
            <span className="text-secondary" style={{ fontSize: '13px', fontWeight: 500 }}>
              Văn bản đến
            </span>
            <div className="p-2 rounded-3 bg-success-subtle text-success">
              <FileText size={18} />
            </div>
          </div>
          <div className="fw-extrabold text-dark mb-2" style={{ fontSize: '24px' }}>
            0
          </div>
          <div className="d-flex align-items-center gap-1 text-secondary mb-3" style={{ fontSize: '11.5px', fontWeight: 600 }}>
            <Minus size={14} />
            <span>Chưa có dữ liệu</span>
          </div>
          {/* Straight Flat Line */}
          <svg viewBox="0 0 100 24" className="w-100" style={{ height: '32px' }}>
            <path 
              d="M 0 12 L 100 12" 
              fill="none" 
              stroke="#10B981" 
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      {/* Stat Card 3 */}
      <div className="col-12 col-sm-6 col-xl-3">
        <div className="content-card mb-0 h-100">
          <div className="d-flex align-items-center justify-content-between mb-2">
            <span className="text-secondary" style={{ fontSize: '13px', fontWeight: 500 }}>
              Văn bản đi
            </span>
            <div className="p-2 rounded-3" style={{ backgroundColor: '#F3E8FF', color: '#8B5CF6' }}>
              <Send size={18} />
            </div>
          </div>
          <div className="fw-extrabold text-dark mb-2" style={{ fontSize: '24px' }}>
            0
          </div>
          <div className="d-flex align-items-center gap-1 text-secondary mb-3" style={{ fontSize: '11.5px', fontWeight: 600 }}>
            <Minus size={14} />
            <span>Chưa có dữ liệu</span>
          </div>
          {/* Straight Flat Line */}
          <svg viewBox="0 0 100 24" className="w-100" style={{ height: '32px' }}>
            <path 
              d="M 0 12 L 100 12" 
              fill="none" 
              stroke="#8B5CF6" 
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      {/* Stat Card 4 */}
      <div className="col-12 col-sm-6 col-xl-3">
        <div className="content-card mb-0 h-100">
          <div className="d-flex align-items-center justify-content-between mb-2">
            <span className="text-secondary" style={{ fontSize: '13px', fontWeight: 500 }}>
              Chi đoàn trực thuộc
            </span>
            <div className="p-2 rounded-3" style={{ backgroundColor: '#FFF4E5', color: '#F59E0B' }}>
              <Users size={18} />
            </div>
          </div>
          <div className="fw-extrabold text-dark mb-2" style={{ fontSize: '24px' }}>
            30
          </div>
          <div className="d-flex align-items-center gap-1 text-secondary mb-3" style={{ fontSize: '11.5px', fontWeight: 600 }}>
            <Minus size={14} />
            <span>30 Chi đoàn Ấp trực thuộc</span>
          </div>
          {/* Straight Flat Line */}
          <svg viewBox="0 0 100 24" className="w-100" style={{ height: '32px' }}>
            <path 
              d="M 0 12 L 100 12" 
              fill="none" 
              stroke="#F59E0B" 
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

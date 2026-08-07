import React from 'react';
import { Calendar, FileText, FileCheck, Plus, Send, AlertCircle } from 'lucide-react';
import { getLiveVietnameseDate } from '../lib/supabase';

export default function HeroBanner({ 
  currentRole, 
  onOpenCreateActivity, 
  onOpenIssueDocument,
  activitiesCount = 0,
  docsCount = 0
}) {
  const isDoanXa = currentRole.role === 'doan_xa';
  const liveDateText = getLiveVietnameseDate();

  return (
    <div className="hero-card mb-4 position-relative">
      {/* Background Graphic Overlay */}
      <img 
        src="/background.png" 
        alt="Background Youth Banner" 
        className="hero-bg-img d-none d-md-block"
        onError={(e) => { e.target.style.display = 'none'; }}
      />

      <div className="hero-overlay position-relative">
        <div className="d-flex align-items-start gap-3 mb-3">
          <img 
            src="/logo.png" 
            alt="Emblem Logo" 
            style={{ width: '56px', height: '56px', objectFit: 'contain' }}
          />
          <div>
            <h2 className="fw-bold mb-1 text-dark" style={{ fontSize: '22px' }}>
              Xin chào, {isDoanXa ? 'Đoàn xã Xuân Thới Sơn' : currentRole.full_name}! 👋
            </h2>
            <div className="text-secondary fw-semibold" style={{ fontSize: '13px' }}>
              {liveDateText}
            </div>
          </div>
        </div>

        {/* Stats Pills Row */}
        <div className="d-flex flex-wrap align-items-center gap-3 my-4">
          {isDoanXa ? (
            <>
              {/* Doan Xa Stat Pill 1 */}
              <div className="stat-pill">
                <div className="stat-pill-icon bg-primary-subtle text-primary">
                  <Calendar size={18} />
                </div>
                <div>
                  <div className="fw-extrabold text-dark" style={{ fontSize: '18px', lineHeight: 1 }}>{activitiesCount}</div>
                  <div className="text-muted" style={{ fontSize: '11px' }}>Hoạt động sắp diễn ra</div>
                </div>
              </div>

              {/* Doan Xa Stat Pill 2 */}
              <div className="stat-pill">
                <div className="stat-pill-icon bg-success-subtle text-success">
                  <FileText size={18} />
                </div>
                <div>
                  <div className="fw-extrabold text-dark" style={{ fontSize: '18px', lineHeight: 1 }}>{docsCount}</div>
                  <div className="text-muted" style={{ fontSize: '11px' }}>Văn bản cần xử lý</div>
                </div>
              </div>

              {/* Doan Xa Stat Pill 3 */}
              <div className="stat-pill">
                <div className="stat-pill-icon" style={{ backgroundColor: '#F3E8FF', color: '#8B5CF6' }}>
                  <FileCheck size={18} />
                </div>
                <div>
                  <div className="fw-extrabold text-dark" style={{ fontSize: '18px', lineHeight: 1 }}>0</div>
                  <div className="text-muted" style={{ fontSize: '11px' }}>Văn bản chờ phê duyệt</div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Chi Doan Stat Pill 1 */}
              <div className="stat-pill">
                <div className="stat-pill-icon bg-primary-subtle text-primary">
                  <Calendar size={18} />
                </div>
                <div>
                  <div className="fw-extrabold text-dark" style={{ fontSize: '18px', lineHeight: 1 }}>{activitiesCount}</div>
                  <div className="text-muted" style={{ fontSize: '11px' }}>Hoạt động sắp diễn ra</div>
                </div>
              </div>

              {/* Chi Doan Stat Pill 2 */}
              <div className="stat-pill">
                <div className="stat-pill-icon bg-success-subtle text-success">
                  <FileText size={18} />
                </div>
                <div>
                  <div className="fw-extrabold text-dark" style={{ fontSize: '18px', lineHeight: 1 }}>{docsCount}</div>
                  <div className="text-muted" style={{ fontSize: '11px' }}>Văn bản mới từ Đoàn xã</div>
                </div>
              </div>

              {/* Chi Doan Stat Pill 3 */}
              <div className="stat-pill">
                <div className="stat-pill-icon" style={{ backgroundColor: '#F3E8FF', color: '#8B5CF6' }}>
                  <FileCheck size={18} />
                </div>
                <div>
                  <div className="fw-extrabold text-dark" style={{ fontSize: '18px', lineHeight: 1 }}>0</div>
                  <div className="text-muted" style={{ fontSize: '11px' }}>Văn bản cần nộp</div>
                </div>
              </div>

              {/* Chi Doan Stat Pill 4 */}
              <div className="stat-pill">
                <div className="stat-pill-icon" style={{ backgroundColor: '#FFF4E5', color: '#F59E0B' }}>
                  <AlertCircle size={18} />
                </div>
                <div>
                  <div className="fw-extrabold text-dark" style={{ fontSize: '18px', lineHeight: 1 }}>0</div>
                  <div className="text-muted" style={{ fontSize: '11px' }}>Công việc chưa hoàn thành</div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Action Buttons for Doan Xa */}
        {isDoanXa && (
          <div className="d-flex align-items-center gap-3 pt-2">
            <button 
              className="btn btn-primary d-flex align-items-center gap-2 px-3 py-2 fw-semibold rounded-3"
              style={{ backgroundColor: '#0066FF', border: 'none' }}
              onClick={onOpenCreateActivity}
            >
              <Plus size={18} />
              <span>Tạo hoạt động</span>
            </button>

            <button 
              className="btn btn-outline-primary d-flex align-items-center gap-2 px-3 py-2 fw-semibold rounded-3 bg-white"
              style={{ borderColor: '#0066FF', color: '#0066FF' }}
              onClick={onOpenIssueDocument}
            >
              <Send size={16} />
              <span>Ban hành văn bản</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

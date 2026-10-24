import QrAttendanceManager from './QrAttendanceManager';
import React, { useState, useEffect } from 'react';
import {
  QrCode,
  Users,
  Calendar,
  Clock,
  MapPin,
  Plus,
  FileText,
  Download,
  CheckCircle2,
  XCircle,
  X,
  Circle,
  Send,
  Bell,
  Search,
  Filter,
  BarChart2,
  Folder,
  Settings,
  ShieldCheck,
  Database,
  UserCheck,
  MessageSquare,
  Building,
  FileSpreadsheet,
  CheckSquare,
  HardDrive,
  Cloud,
  AlertTriangle,
  Trash2,
  Edit3,
  Eye,
  MoreVertical,
  Upload,
  FileCheck
} from 'lucide-react';
import {
  generateUuid,
  normalizeBranchName,
  getUniqueConfirmedBranches,
  isActivityExpired,
  syncSaveActivity,
  syncSaveTask,
  getActivityGpsAuditLogs,
  syncDeleteActivity,
  syncDeleteTask,
  INITIAL_ACTIVITIES,
  INITIAL_TASKS,
  ALL_BRANCHES,
  COMPETITION_CLUSTERS,
  isSupabaseConfigured,
  OFFICIAL_ADDRESS,
  sortNotificationsByPriority,
  sortActivitiesByPriority,
  getPriorityBadgeStyle,
  getBranchClusterName,
  calculateBranchRating,
  formatDateDDMMYYYY,
  deduplicateActivities,
  isItemTargetedToUser,
  getActivityTimeStatus,
  recordDocView,
  removeDocView,
  setDocViews,
  getDocViewsMap,
  recordDocCategory,
  getDocCategoriesMap
} from '../lib/supabase';
import { getStorageQuotaMetrics, DOAN_XA_GMAIL, uploadPdfWithFailover } from '../lib/storageStrategy';
import TaskCountdown, { formatDeadlineDisplay } from './TaskCountdown';

// Component xác nhận tiếp nhận thông báo / hoạt động cho Chi đoàn & Quản trị viên
export function ReceiptConfirmationBox({ 
  type, 
  item, 
  currentRole, 
  isDoanXa, 
  onConfirmReceipt, 
  onCompleteTask,
  inModal = false, 
  attendanceRecords = {} 
}) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState('confirmed'); // 'confirmed' | 'completed' | 'absent'

  const activityAttendance = (attendanceRecords && item?.id && attendanceRecords[item.id]) ? attendanceRecords[item.id] : {};
  const confirmedBy = Array.isArray(item?.confirmedBy) ? item.confirmedBy : [];
  const absentBy = Array.isArray(item?.absentBy) ? item.absentBy : [];
  const completedBy = Array.isArray(item?.completedBy) ? item.completedBy : [];
  const branchName = currentRole?.full_name || currentRole?.branch_name || 'Chi đoàn Ấp';

  const participatingBranches = [];
  const absentBranches = [];
  const completedBranches = [];

  // 1. Process attendanceRecords map
  if (typeof activityAttendance === 'object' && activityAttendance !== null) {
    Object.entries(activityAttendance).forEach(([branch, record]) => {
      const cleanBranch = normalizeBranchName(branch);
      if (typeof record === 'boolean') {
        if (record && !participatingBranches.some(p => normalizeBranchName(p.branch) === cleanBranch)) {
          const matchConf = confirmedBy.find(c => normalizeBranchName(c) === cleanBranch);
          participatingBranches.push({ branch: cleanBranch, time: (typeof matchConf === 'object' ? matchConf?.time : null) || 'Đã xác nhận' });
        }
      } else if (typeof record === 'object' && record !== null) {
        if (record.attended && !participatingBranches.some(p => normalizeBranchName(p.branch) === cleanBranch)) {
          participatingBranches.push({ branch: cleanBranch, time: record.time || 'Đã xác nhận' });
        } else if (!record.attended && !absentBranches.some(p => normalizeBranchName(p.branch) === cleanBranch)) {
          absentBranches.push({ branch: cleanBranch, reason: record.reason || 'Báo vắng', time: record.time || 'Vừa xong' });
        }
      }
    });
  }

  // 2. Add from confirmedBy list if not present
  confirmedBy.forEach(c => {
    if (!c) return;
    const cleanBranch = normalizeBranchName(c);
    const bTime = typeof c === 'object' ? (c.time || 'Đã xác nhận') : 'Đã xác nhận';
    if (cleanBranch && !participatingBranches.some(p => normalizeBranchName(p.branch) === cleanBranch)) {
      participatingBranches.push({ branch: cleanBranch, time: bTime });
    }
  });

  // 3. Add from completedBy list for tasks
  completedBy.forEach(c => {
    if (!c) return;
    const bName = typeof c === 'string' ? c : (c.branch || c.name || '');
    const bTime = typeof c === 'object' ? (c.time || item?.completed_time || 'Đã làm xong') : (item?.completed_time || 'Đã làm xong');
    if (bName && !completedBranches.some(p => p.branch === bName)) {
      completedBranches.push({ branch: bName, time: bTime });
    }
  });
  if (completedBranches.length === 0 && item?.status === 'completed' && item?.completed_time) {
    completedBranches.push({ branch: item.assigned_to || 'Chi đoàn', time: item.completed_time });
  }

  // 4. Add from absentBy list if not present
  absentBy.forEach(a => {
    if (!a) return;
    const bName = typeof a === 'string' ? a : (a.branch || a.name || '');
    const bReason = typeof a === 'object' ? (a.reason || 'Báo vắng') : 'Báo vắng';
    const bTime = typeof a === 'object' ? (a.time || 'Vừa xong') : 'Vừa xong';
    if (bName && !absentBranches.some(p => p.branch === bName)) {
      absentBranches.push({ branch: bName, reason: bReason, time: bTime });
    }
  });

  const cleanUserBranch = String(branchName).replace(/^Bí thư\s*/i, '').replace(/^Chi đoàn\s*/i, '').trim();

  const hasConfirmed = participatingBranches.some(c => {
    const cleanC = String(c.branch || '').replace(/^Chi đoàn\s*/i, '').trim();
    return c.branch === branchName || (cleanUserBranch && cleanC && cleanC === cleanUserBranch);
  });
  const myConfirmation = participatingBranches.find(c => {
    const cleanC = String(c.branch || '').replace(/^Chi đoàn\s*/i, '').trim();
    return c.branch === branchName || (cleanUserBranch && cleanC && cleanC === cleanUserBranch);
  });

  const myCompletion = completedBranches.find(c => {
    const cleanC = String(c.branch || '').replace(/^Chi đoàn\s*/i, '').trim();
    return c.branch === branchName || (cleanUserBranch && cleanC && cleanC === cleanUserBranch);
  });
  const hasCompleted = Boolean(myCompletion) || (item?.status === 'completed' && Boolean(item?.completed_time));
  const completionTime = myCompletion?.time || item?.completed_time || '';

  const hasAbsent = absentBranches.some(a => {
    const cleanA = String(a.branch || '').replace(/^Chi đoàn\s*/i, '').trim();
    return a.branch === branchName || (cleanUserBranch && cleanA && cleanA === cleanUserBranch);
  });
  const myAbsent = absentBranches.find(a => {
    const cleanA = String(a.branch || '').replace(/^Chi đoàn\s*/i, '').trim();
    return a.branch === branchName || (cleanUserBranch && cleanA && cleanA === cleanUserBranch);
  });

  // --------------------------------------------------------------------------
  // A. CHI ĐOÀN VIEW
  // --------------------------------------------------------------------------
  if (!isDoanXa) {
    if (type === 'task') {
      return (
        <div className="d-flex align-items-center gap-1.5 flex-wrap">
          {/* NÚT 1: TIẾP NHẬN - CHỈ HIỂN THỊ KHI CHƯA TIẾP NHẬN, XÁC NHẬN XONG LƯU 1 LẦN */}
          {hasConfirmed ? (
            <div 
              className="d-inline-flex align-items-center gap-1 px-2.5 py-1 bg-success-subtle text-success border border-success-subtle rounded-3 shadow-xs" 
              style={{ fontSize: '11px', fontWeight: 600 }}
              title="Chi đoàn đã tiếp nhận công việc này"
            >
              <CheckCircle2 size={13} />
              <span>✓ Đã tiếp nhận ({myConfirmation?.time || 'Vừa xong'})</span>
            </div>
          ) : (
            <button 
              type="button"
              className="btn btn-sm btn-primary fw-semibold d-inline-flex align-items-center gap-1.5 px-3 py-1.5 rounded-3 shadow-xs hover-scale"
              style={{ fontSize: '11.5px', transition: 'all 0.2s ease', backgroundColor: '#0066FF', borderColor: '#0066FF' }}
              onClick={(e) => {
                e.stopPropagation();
                onConfirmReceipt && onConfirmReceipt('task', item);
              }}
              title="Bấm để xác nhận tiếp nhận công việc do Admin ban hành (chỉ xác nhận 1 lần)"
            >
              <CheckCircle2 size={14} />
              <span>Xác nhận tiếp nhận</span>
            </button>
          )}

          {/* NÚT 2: ĐÃ LÀM XONG - CHỈ HIỂN THỊ KHI ĐÃ TIẾP NHẬN. BẤM XONG LƯU THỜI GIAN GỬI VỀ ADMIN */}
          {hasConfirmed && (
            hasCompleted ? (
              <div 
                className="d-inline-flex align-items-center gap-1.5 px-2.5 py-1 rounded-3 shadow-xs text-white" 
                style={{ fontSize: '11px', fontWeight: 650, backgroundColor: '#16A34A', border: '1px solid #15803d' }}
                title="Chi đoàn đã hoàn thành công việc và gửi dữ liệu về Ban Thường vụ Đoàn xã"
              >
                <CheckCircle2 size={13} />
                <span>🎉 Đã làm xong ({completionTime || 'Đã hoàn thành'})</span>
              </div>
            ) : (
              <button 
                type="button"
                className="btn btn-sm fw-bold d-inline-flex align-items-center gap-1.5 px-3 py-1 rounded-3 shadow-xs text-white transition-all hover-scale"
                style={{ fontSize: '11.5px', backgroundColor: '#16A34A', borderColor: '#16A34A', cursor: 'pointer' }}
                onClick={(e) => {
                  e.stopPropagation();
                  onCompleteTask && onCompleteTask(item);
                }}
                title="Bấm để xác nhận chi đoàn đã làm xong công việc và gửi ngày giờ về Ban Thường vụ Đoàn xã"
              >
                <CheckCircle2 size={14} />
                <span>Đã làm xong</span>
              </button>
            )
          )}
        </div>
      );
    }

    // Default for notifications / activities
    if (hasConfirmed) {
      return (
        <div className="d-inline-flex align-items-center gap-1.5 px-2.5 py-1 bg-success-subtle text-success border border-success-subtle rounded-3 shadow-xs" style={{ fontSize: '11.5px', fontWeight: 600 }}>
          <CheckCircle2 size={14} />
          <span>✓ Đã tiếp nhận ({myConfirmation?.time || 'Vừa xong'})</span>
        </div>
      );
    }
    if (hasAbsent) {
      return (
        <div className="d-inline-flex align-items-center gap-1.5 px-2.5 py-1 bg-danger-subtle text-danger border border-danger-subtle rounded-3 shadow-xs" style={{ fontSize: '11.5px', fontWeight: 600 }}>
          <XCircle size={14} />
          <span>✕ Đã báo vắng ({myAbsent?.time || 'Vừa xong'})</span>
        </div>
      );
    }
    return (
      <button 
        type="button"
        className="btn btn-sm btn-primary fw-semibold d-inline-flex align-items-center gap-1.5 px-3 py-1.5 rounded-3 shadow-xs hover-scale"
        style={{ fontSize: '12px', transition: 'all 0.2s ease', backgroundColor: '#0066FF', borderColor: '#0066FF' }}
        onClick={(e) => {
          e.stopPropagation();
          onConfirmReceipt && onConfirmReceipt(type || 'notification', item);
        }}
      >
        <CheckCircle2 size={15} />
        <span>Xác nhận tiếp nhận</span>
      </button>
    );
  }

  // --------------------------------------------------------------------------
  // B. ADMIN VIEW (DOAN XA) - DỮ LIỆU ĐƯỢC GỬI VỀ ADMIN NẮM ĐƯỢC
  // --------------------------------------------------------------------------
  return (
    <div className="position-relative d-inline-flex align-items-center gap-1.5 flex-wrap">
      {/* Button 1: Confirmed count */}
      <button 
        type="button"
        className="btn btn-sm btn-outline-primary fw-bold d-inline-flex align-items-center gap-1 px-2.5 py-1 rounded-3"
        style={{ fontSize: '11px' }}
        onClick={(e) => {
          e.stopPropagation();
          setActiveTab('confirmed');
          setShowDropdown(!showDropdown);
        }}
        title="Xem danh sách Chi đoàn đã tiếp nhận"
      >
        <CheckCircle2 size={12} />
        <span>{participatingBranches.length} tiếp nhận</span>
      </button>

      {/* Button 2 (Tasks): Completed count */}
      {type === 'task' && (
        <button 
          type="button"
          className="btn btn-sm btn-success fw-bold d-inline-flex align-items-center gap-1 px-2.5 py-1 rounded-3 text-white"
          style={{ fontSize: '11px', backgroundColor: '#16A34A', borderColor: '#16A34A' }}
          onClick={(e) => {
            e.stopPropagation();
            setActiveTab('completed');
            setShowDropdown(!showDropdown);
          }}
          title="Xem danh sách Chi đoàn đã làm xong công việc kèm ngày giờ"
        >
          <CheckCircle2 size={12} />
          <span>{completedBranches.length} đã làm xong</span>
        </button>
      )}

      {/* Button 3: Absent count */}
      {absentBranches.length > 0 && (
        <button 
          type="button"
          className="btn btn-sm btn-outline-danger fw-bold d-inline-flex align-items-center gap-1 px-2.5 py-1 rounded-3"
          style={{ fontSize: '11px' }}
          onClick={(e) => {
            e.stopPropagation();
            setActiveTab('absent');
            setShowDropdown(!showDropdown);
          }}
          title="Xem danh sách Chi đoàn báo vắng kèm lý do"
        >
          <XCircle size={12} />
          <span>{absentBranches.length} báo vắng</span>
        </button>
      )}

      {/* Dropdown panel showing details for Admin */}
      {showDropdown && (
        <div 
          className="position-absolute end-0 top-100 mt-2 bg-white rounded-3 shadow-lg border p-3 z-3 text-start"
          style={{ width: '330px', zIndex: 1050 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="d-flex align-items-center justify-content-between pb-2 mb-2 border-bottom">
            <div className="d-flex gap-1.5 flex-wrap">
              <button 
                type="button"
                className={`btn btn-xs fw-bold ${activeTab === 'confirmed' ? 'btn-primary text-white' : 'btn-light border text-secondary'}`}
                style={{ fontSize: '11px', padding: '2px 8px' }}
                onClick={() => setActiveTab('confirmed')}
              >
                ✓ Tiếp nhận ({participatingBranches.length})
              </button>

              {type === 'task' && (
                <button 
                  type="button"
                  className={`btn btn-xs fw-bold ${activeTab === 'completed' ? 'btn-success text-white' : 'btn-light border text-secondary'}`}
                  style={{ fontSize: '11px', padding: '2px 8px', backgroundColor: activeTab === 'completed' ? '#16A34A' : '' }}
                  onClick={() => setActiveTab('completed')}
                >
                  🎉 Đã làm xong ({completedBranches.length})
                </button>
              )}

              {absentBranches.length > 0 && (
                <button 
                  type="button"
                  className={`btn btn-xs fw-bold ${activeTab === 'absent' ? 'btn-danger text-white' : 'btn-light border text-secondary'}`}
                  style={{ fontSize: '11px', padding: '2px 8px' }}
                  onClick={() => setActiveTab('absent')}
                >
                  ✕ Báo vắng ({absentBranches.length})
                </button>
              )}
            </div>
            <button type="button" className="btn-close btn-close-xs" onClick={() => setShowDropdown(false)}></button>
          </div>

          {/* TAB 1: TIẾP NHẬN */}
          {activeTab === 'confirmed' && (
            participatingBranches.length === 0 ? (
              <div className="text-muted text-center py-2" style={{ fontSize: '12px' }}>Chưa có Chi đoàn nào tiếp nhận</div>
            ) : (
              <div className="d-flex flex-column gap-1.5" style={{ maxHeight: '220px', overflowY: 'auto' }}>
                {participatingBranches.map((c, i) => (
                  <div key={i} className="d-flex align-items-center justify-content-between p-1.5 bg-light rounded border-start border-primary border-3">
                    <span className="fw-semibold text-dark" style={{ fontSize: '12px' }}>✓ {c.branch}</span>
                    <span className="text-muted" style={{ fontSize: '10.5px' }}>{c.time}</span>
                  </div>
                ))}
              </div>
            )
          )}

          {/* TAB 2: ĐÃ LÀM XONG */}
          {activeTab === 'completed' && (
            completedBranches.length === 0 ? (
              <div className="text-muted text-center py-2" style={{ fontSize: '12px' }}>Chưa có Chi đoàn nào báo làm xong</div>
            ) : (
              <div className="d-flex flex-column gap-2" style={{ maxHeight: '220px', overflowY: 'auto' }}>
                {completedBranches.map((c, i) => (
                  <div key={i} className="p-2 bg-success-subtle rounded border border-success-subtle">
                    <div className="d-flex align-items-center justify-content-between mb-1">
                      <span className="fw-bold text-success d-flex align-items-center gap-1" style={{ fontSize: '12px' }}>
                        <CheckCircle2 size={14} className="text-success flex-shrink-0" />
                        <span>{c.branch}</span>
                      </span>
                    </div>
                    <div className="d-flex align-items-center gap-1 text-muted" style={{ fontSize: '11px' }}>
                      <Clock size={12} className="text-success flex-shrink-0" />
                      <span>Đã làm xong: <strong>{c.time}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}

          {/* TAB 3: BÁO VẮNG */}
          {activeTab === 'absent' && (
            absentBranches.length === 0 ? (
              <div className="text-muted text-center py-2" style={{ fontSize: '12px' }}>Chưa có Chi đoàn nào báo vắng</div>
            ) : (
              <div className="d-flex flex-column gap-2" style={{ maxHeight: '220px', overflowY: 'auto' }}>
                {absentBranches.map((a, i) => (
                  <div key={i} className="p-2 bg-danger-subtle rounded border border-danger-subtle">
                    <div className="d-flex align-items-center justify-content-between mb-1">
                      <span className="fw-bold text-danger d-flex align-items-center gap-1" style={{ fontSize: '12px' }}>
                        <XCircle size={14} className="text-danger flex-shrink-0" />
                        <span>{a.branch}</span>
                      </span>
                      <span className="text-muted" style={{ fontSize: '10.5px', fontWeight: 500 }}>
                        {a.time || 'Vừa xong'}
                      </span>
                    </div>
                    <div className="p-1.5 bg-white rounded border border-danger-subtle text-danger-emphasis" style={{ fontSize: '11.5px' }}>
                      <strong>💬 Lý do vắng mặt:</strong> {a.reason || 'Báo vắng'}
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}


// 1. Full Activities Management View
export function ActivitiesView({ activities = [], onOpenCreateActivity, isDoanXa, onToggleStatus, onDeleteActivity, onOpenActivityDetail, onConfirmReceipt, currentUser, attendanceRecords = {} }) {
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [deleteConfirmTarget, setDeleteConfirmTarget] = useState(null);

  const safeActivities = Array.isArray(activities) ? activities : [];
  const cleanActivities = deduplicateActivities(safeActivities);
  const sortedActivities = sortActivitiesByPriority(cleanActivities);

  const filtered = sortedActivities.filter(a => {
    if (!a) return false;
    const timeStatus = getActivityTimeStatus(a);
    let matchFilter = true;
    if (filter === 'ONGOING') matchFilter = timeStatus.code === 'ONGOING';
    else if (filter === 'UPCOMING') matchFilter = timeStatus.code === 'UPCOMING' || timeStatus.code === 'FUTURE_DATE';
    else if (filter === 'FINISHED') matchFilter = timeStatus.code === 'FINISHED' || a.status === 'Đã hoàn thành';

    const titleStr = String(a.title || '').toLowerCase();
    const locStr = String(a.location || '').toLowerCase();
    const kw = String(search || '').toLowerCase();

    const matchSearch = !kw || titleStr.includes(kw) || locStr.includes(kw);
    return matchFilter && matchSearch;
  });

  return (
    <div className="content-card">
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-4 gap-3 border-bottom pb-3">
        <div>
          <h3 className="card-title-header mb-1 d-flex align-items-center gap-2">
            <Calendar className="text-primary" size={24} />
            Quản lý Lịch hoạt động & Phong trào
          </h3>
          <div className="text-secondary" style={{ fontSize: '13px' }}>
            Theo dõi và điều hành tất cả lịch hoạt động thanh niên xã Xuân Thới Sơn và 56 Chi đoàn
          </div>
        </div>

        {isDoanXa && (
          <button 
            className="btn btn-primary d-flex align-items-center gap-2 px-3 py-2 fw-semibold rounded-3 shadow-sm"
            style={{ backgroundColor: '#0066FF', border: 'none' }}
            onClick={onOpenCreateActivity}
          >
            <Plus size={18} />
            <span>Tạo hoạt động mới</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3 mb-4">
        <div className="d-flex align-items-center gap-2 flex-wrap">
          <button 
            className={`btn btn-sm ${filter === 'ALL' ? 'btn-primary' : 'btn-light border'} fw-semibold px-3`}
            onClick={() => setFilter('ALL')}
          >
            Tất cả ({activities.length})
          </button>
          <button 
            className={`btn btn-sm ${filter === 'ONGOING' ? 'btn-primary' : 'btn-light border'} fw-semibold px-3`}
            onClick={() => setFilter('ONGOING')}
          >
            ⚡ Đang diễn ra ({activities.filter(a => getActivityTimeStatus(a).code === 'ONGOING').length})
          </button>
          <button 
            className={`btn btn-sm ${filter === 'UPCOMING' ? 'btn-primary' : 'btn-light border'} fw-semibold px-3`}
            onClick={() => setFilter('UPCOMING')}
          >
            ⏳ Sắp diễn ra ({activities.filter(a => ['UPCOMING', 'FUTURE_DATE'].includes(getActivityTimeStatus(a).code)).length})
          </button>
          <button 
            className={`btn btn-sm ${filter === 'FINISHED' ? 'btn-primary' : 'btn-light border'} fw-semibold px-3`}
            onClick={() => setFilter('FINISHED')}
          >
            ✓ Đã kết thúc ({activities.filter(a => getActivityTimeStatus(a).code === 'FINISHED' || a.status === 'Đã hoàn thành').length})
          </button>
        </div>

        <div className="input-group" style={{ maxWidth: '300px' }}>
          <span className="input-group-text bg-light border-end-0"><Search size={15} className="text-secondary" /></span>
          <input 
            type="text" 
            className="form-control bg-light border-start-0 ps-0" 
            placeholder="Tìm tên hoạt động..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ fontSize: '13px' }}
          />
        </div>
      </div>

      {/* Activities Grid / Empty State */}
      {filtered.length === 0 ? (
        <div className="p-5 bg-light rounded-3 text-center border my-3">
          <div className="p-3 bg-white d-inline-block rounded-circle shadow-sm mb-3 text-primary">
            <Calendar size={32} />
          </div>
          <h5 className="fw-bold text-dark mb-1">Chưa có hoạt động nào trong danh sách</h5>
          <p className="text-secondary mb-3" style={{ fontSize: '13px' }}>
            Bấm nút "Tạo hoạt động mới" ở trên để phát động chương trình thanh niên cho Đoàn xã và các Ấp.
          </p>
          {isDoanXa && (
            <button className="btn btn-primary px-4 fw-semibold" style={{ backgroundColor: '#0066FF' }} onClick={onOpenCreateActivity}>
              + Tạo hoạt động đầu tiên
            </button>
          )}
        </div>
      ) : (
        <div className="row g-3">
          {filtered.map((act) => {
            const priorityBadge = getPriorityBadgeStyle(act.priority);
            const timeStatus = getActivityTimeStatus(act);
            return (
              <div key={act.id} className="col-12 col-md-6 col-xl-4">
                <div className="p-3.5 rounded-3 bg-light border h-100 d-flex flex-column justify-content-between hover-shadow transition">
                  <div>
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <div className="activity-date-badge">
                        <div className="activity-date-num">{act.day}</div>
                        <div className="activity-date-month">{act.month}</div>
                      </div>
                      <div className="d-flex align-items-center gap-1 flex-wrap justify-content-end">
                        <span className={`badge ${priorityBadge.bg} border px-2 py-1`} style={{ fontSize: '11px', fontWeight: 600 }}>
                          {priorityBadge.label}
                        </span>
                        <span className={`badge ${timeStatus.badgeClass} border px-2 py-1`} style={{ fontSize: '11px', fontWeight: 600 }}>
                          {timeStatus.statusText}
                        </span>
                      </div>
                    </div>
                  <h5 className="fw-bold text-dark mb-2" style={{ fontSize: '15px', lineHeight: '1.3' }}>
                    {act.title}
                  </h5>

                  {act.hasSubTasks && act.subTasks && act.subTasks.length > 0 && (
                    <div className="mb-2">
                      <span className="badge bg-info-subtle text-info-emphasis border border-info-subtle px-2 py-1" style={{ fontSize: '10.5px' }}>
                        👥 Có phân chia lực lượng ({act.subTasks.length} khu vực)
                      </span>
                    </div>
                  )}

                  <div className="text-secondary d-flex flex-column gap-1 mb-3" style={{ fontSize: '12px' }}>
                    <span className="d-flex align-items-center gap-1.5"><Clock size={14} className="text-primary" /> {act.time}</span>
                    <span className="d-flex align-items-center gap-1.5"><MapPin size={14} className="text-danger" /> {act.location}</span>
                    {act.description && (
                      <span className="text-muted mt-1" style={{ fontSize: '11.5px' }}>{act.description}</span>
                    )}
                  </div>
                </div>

                <div className="pt-2.5 border-top d-flex align-items-center justify-content-between gap-2 flex-wrap">
                  <button 
                    className="btn btn-sm btn-outline-primary fw-semibold px-2.5 py-1"
                    style={{ fontSize: '11px', borderRadius: '6px' }}
                    onClick={() => onOpenActivityDetail && onOpenActivityDetail(act)}
                  >
                    Chi tiết →
                  </button>

                  <div className="d-flex align-items-center gap-1.5 ms-auto flex-wrap">
                    <ReceiptConfirmationBox 
                      type="activity" 
                      item={act} 
                      currentRole={currentUser} 
                      isDoanXa={isDoanXa} 
                      onConfirmReceipt={onConfirmReceipt} 
                      attendanceRecords={attendanceRecords}
                    />

                    {isDoanXa && (
                      <>
                        <button 
                          className={`btn btn-sm ${act.status === 'Đã hoàn thành' ? 'btn-outline-warning' : 'btn-success'} fw-semibold d-flex align-items-center gap-1 py-1 px-2.5`}
                          style={{ fontSize: '11.5px', borderRadius: '6px' }}
                          title={act.status === 'Đã hoàn thành' ? 'Đánh dấu chưa hoàn thành' : 'Đánh dấu đã hoàn thành'}
                          onClick={() => onToggleStatus && onToggleStatus(act.id, act.status === 'Đã hoàn thành' ? 'Sắp diễn ra' : 'Đã hoàn thành')}
                        >
                          <CheckCircle2 size={13} />
                          <span>{act.status === 'Đã hoàn thành' ? 'Hoàn tác' : 'Hoàn thành'}</span>
                        </button>
                        
                        <button 
                          className="btn btn-sm btn-outline-danger fw-semibold d-flex align-items-center gap-1 py-1 px-2.5"
                          style={{ fontSize: '11.5px', borderRadius: '6px' }}
                          title="Xóa hoạt động"
                          onClick={() => setDeleteConfirmTarget(act)}
                        >
                          <Trash2 size={13} />
                          <span>Xóa</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        </div>
      )}

      {/* Modal Thông Báo Xác Nhận Xóa Hoạt Động (Không Delay, Đồng bộ ngay lập tức) */}
      {deleteConfirmTarget && (
        <div 
          className="modal d-block bg-dark bg-opacity-50" 
          style={{ zIndex: 1080 }}
          onClick={() => setDeleteConfirmTarget(null)}
        >
          <div 
            className="modal-dialog modal-dialog-centered shadow-lg" 
            style={{ maxWidth: '420px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content border-0 rounded-4 text-center p-4">
              <div className="d-flex justify-content-center mb-3">
                <div className="p-3 bg-danger-subtle text-danger rounded-circle d-inline-flex align-items-center justify-content-center">
                  <AlertTriangle size={36} />
                </div>
              </div>

              <h5 className="fw-bold text-danger mb-2" style={{ fontSize: '18px' }}>
                bạn xác nhận xóa hoạt động này!!!
              </h5>

              <p className="text-secondary mb-4" style={{ fontSize: '13px', lineHeight: '1.5' }}>
                Hoạt động <strong className="text-dark">"{deleteConfirmTarget.title}"</strong> sẽ được xóa ngay lập tức và đồng bộ tự động trên toàn hệ thống.
              </p>

              <div className="d-flex align-items-center justify-content-center gap-2.5">
                <button 
                  type="button" 
                  className="btn btn-light border text-secondary fw-semibold px-4 py-2 rounded-3 flex-fill"
                  style={{ fontSize: '13.5px' }}
                  onClick={() => setDeleteConfirmTarget(null)}
                >
                  quay lại
                </button>
                <button 
                  type="button" 
                  className="btn btn-danger fw-bold px-4 py-2 rounded-3 flex-fill shadow-sm"
                  style={{ fontSize: '13.5px' }}
                  onClick={() => {
                    const idToDelete = deleteConfirmTarget.id;
                    const titleToDelete = deleteConfirmTarget.title;
                    setDeleteConfirmTarget(null);
                    if (onDeleteActivity) {
                      onDeleteActivity(idToDelete, titleToDelete);
                    }
                  }}
                >
                  xác nhận
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// 2. Full Documents Management View
export function DocumentsView({ 
  documents = [], 
  submissions = [], 
  tasks = [],
  tabType = 'incoming_docs', 
  onOpenIssueDocument, 
  onDeleteDocument, 
  onDeleteSubmission,
  onSaveDocument,
  onSaveSubmission,
  onSaveTask,
  triggerToast,
  isDoanXa,
  currentUser
}) {
  const [search, setSearch] = useState('');
  const [previewDoc, setPreviewDoc] = useState(null);
  const [editingDoc, setEditingDoc] = useState(null);
  const [viewHistoryDoc, setViewHistoryDoc] = useState(null);
  const [historyTab, setHistoryTab] = useState('ALL'); // 'ALL' | 'VIEWED' | 'NOT_VIEWED'
  const [historySearch, setHistorySearch] = useState('');
  const [simulateBranch, setSimulateBranch] = useState(ALL_BRANCHES[0]?.name || 'Chi đoàn Ấp Bùi Môn');

  // State for submitting documents for required TODO tasks
  const [submittingTask, setSubmittingTask] = useState(null);
  const [taskDocFile, setTaskDocFile] = useState(null);
  const [isUploadingTaskDoc, setIsUploadingTaskDoc] = useState(false);
  const [taskDocUploadStatus, setTaskDocUploadStatus] = useState(null);
  const [taskDocFormData, setTaskDocFormData] = useState({ file_name: '', file_url: '', notes: '' });

  // Xóa tệp nộp do đưa sai file
  const handleDeleteWrongFile = async (item) => {
    if (item.item_type === 'submission' || item.submission_id || item.is_submitted) {
      const subId = item.submission_id || item.id;
      if (onDeleteSubmission) {
        await onDeleteSubmission(subId, item.display_title || item.title);
      }
    }
    const updatedItem = {
      ...item,
      file_url: '',
      file_name: '',
      is_submitted: false,
      status: 'Chưa nộp',
      receipt_status: 'Chờ nộp'
    };
    if (onSaveSubmission && item.item_type === 'submission') {
      await onSaveSubmission(updatedItem);
    } else if (onSaveDocument) {
      await onSaveDocument(updatedItem);
    }
    triggerToast && triggerToast(`Đã xóa file nộp "${item.file_name || item.display_title}" do đưa sai file thành công! Bạn có thể chọn nộp lại file mới.`);
  };

  // Process incoming items combining submissions and incoming documents
  const processIncomingItems = () => {
    const viewsMap = getDocViewsMap ? getDocViewsMap() : {};
    const docsIncoming = (documents || []).filter(d => d.type === 'incoming').map(d => ({
      ...d,
      item_type: 'document',
      doc_number: d.doc_number || `VB-${String(d.id).slice(-6)}`,
      source_branch: d.sender || d.branch_name || 'Chi đoàn Ấp',
      display_title: d.title || 'Văn bản tiếp nhận',
      display_summary: d.summary || d.content || d.description || 'Văn bản đã được đơn vị gửi trực tuyến.',
      display_date: formatDateDDMMYYYY(d.date || d.issue_date || 'Hôm nay'),
      display_time: d.time || d.created_at_time || '08:00',
      read_status: d.read_status || (d.status === 'read' || d.status === 'Đã đọc' ? 'read' : 'unread'),
      receipt_status: d.receipt_status || (d.status === 'Đã tiếp nhận' ? 'Đã tiếp nhận' : 'Chờ tiếp nhận'),
      file_name: d.file_name || d.pdf_url || 'Van_Ban.pdf',
      file_url: d.file_url || d.pdf_url || '#',
      viewed_by: (Array.isArray(d.viewed_by) && d.viewed_by.length > 0)
        ? d.viewed_by
        : (viewsMap[d.id] || viewsMap[d.title] || [])
    }));

    const subsIncoming = (submissions || []).map(s => ({
      ...s,
      item_type: 'submission',
      doc_number: s.doc_number || `BC-${String(s.id).slice(-6)}`,
      source_branch: s.branch_name || s.sender || 'Chi đoàn Ấp',
      display_title: s.doc_title || s.title || `Báo cáo / Văn bản từ ${s.branch_name || 'Chi đoàn Ấp'}`,
      display_summary: s.notes || s.content || s.summary || 'Văn bản báo cáo nộp từ Chi đoàn trực thuộc.',
      display_date: s.submitted_at ? formatDateDDMMYYYY(s.submitted_at.split(' ')[0]) : formatDateDDMMYYYY(s.sub_date || 'Hôm nay'),
      display_time: s.submitted_at && s.submitted_at.includes(' ') ? s.submitted_at.split(' ')[1] : (s.time || 'Vừa xong'),
      read_status: s.read_status || (s.status === 'Đã tiếp nhận' || s.receipt_status === 'Đã tiếp nhận' ? 'read' : 'unread'),
      receipt_status: s.receipt_status || (s.status === 'Đã tiếp nhận' ? 'Đã tiếp nhận' : 'Chờ tiếp nhận'),
      file_name: s.file_name || 'Bao_Cao_Chi_Doan.pdf',
      file_url: s.file_url || '#',
      viewed_by: (Array.isArray(s.viewed_by) && s.viewed_by.length > 0)
        ? s.viewed_by
        : (viewsMap[s.id] || viewsMap[s.title] || [])
    }));

    return [...subsIncoming, ...docsIncoming];
  };

  const processOutgoingItems = () => {
    const viewsMap = getDocViewsMap ? getDocViewsMap() : {};
    const categoriesMap = getDocCategoriesMap ? getDocCategoriesMap() : {};
    const categoryMap = {
      decision_docs: 'Văn bản quyết định',
      act_docs: 'Ban hành hoạt động',
      implementation_docs: 'Văn bản triển khai',
      meeting_docs: 'Văn bản cuộc họp'
    };

    return (documents || []).filter(d => d.type === 'outgoing' || !d.type).map(d => {
      const docKey = d.id || d.title;
      const savedCat = categoriesMap[docKey] || categoriesMap[d.title] || (d.id ? categoriesMap[d.id] : null);

      const catKey = savedCat?.category || d.category || (
        d.category_label === 'Văn bản quyết định' ? 'decision_docs' :
        d.category_label === 'Ban hành hoạt động' || d.category_label === 'Văn bản thuộc ban hành hoạt động' ? 'act_docs' :
        d.category_label === 'Văn bản triển khai' ? 'implementation_docs' :
        d.category_label === 'Văn bản cuộc họp' ? 'meeting_docs' : 'decision_docs'
      );
      const catLabel = savedCat?.category_label || d.category_label || categoryMap[catKey] || 'Văn bản quyết định';

      return {
        ...d,
        item_type: 'document',
        doc_number: d.doc_number || `KH-${String(d.id).slice(-6)}`,
        source_branch: d.sender || 'Đoàn xã Xuân Thới Sơn',
        display_title: d.title || 'Văn bản ban hành',
        display_summary: d.summary || d.description || 'Kế hoạch / Văn bản ban hành tới 30 Chi đoàn Ấp',
        display_date: formatDateDDMMYYYY(d.date || d.issue_date || 'Hôm nay'),
        display_time: d.time || '',
        category: catKey,
        category_label: catLabel,
        file_name: d.file_name || 'Van_Ban_Ban_Hanh.pdf',
        file_url: d.file_url || '#',
        viewed_by: (Array.isArray(d.viewed_by) && d.viewed_by.length > 0)
          ? d.viewed_by
          : (viewsMap[d.id] || viewsMap[d.title] || [])
      };
    });
  };

  // Process required document tasks assigned by admin (TODO tasks)
  const processRequiredDocsItems = () => {
    const viewsMap = getDocViewsMap ? getDocViewsMap() : {};
    
    // Map existing submissions by task_id, doc_title, or title
    const subMap = {};
    (submissions || []).forEach(s => {
      if (s.task_id) subMap[s.task_id] = s;
      if (s.doc_title) subMap[s.doc_title] = s;
      if (s.title) subMap[s.title] = s;
    });

    const targetTasks = (tasks || []).filter(t => {
      if (!t) return false;
      if (!isDoanXa) {
        return isItemTargetedToUser(t.assigned_to || 'ALL', currentUser);
      }
      return true;
    });

    return targetTasks.map(t => {
      const matchedSub = subMap[t.id] || subMap[t.title] || null;
      const isSubmitted = !!(t.submitted_file || t.submitted_at || matchedSub);

      const fileUrl = t.submitted_file || (matchedSub ? matchedSub.file_url : null) || t.file_url || null;
      const fileName = t.submitted_file_name || (matchedSub ? matchedSub.file_name : null) || t.file_name || null;
      const rawSubmittedAt = t.submitted_at || (matchedSub ? matchedSub.submitted_at : null) || null;
      const submittedAt = rawSubmittedAt 
        ? String(rawSubmittedAt).replace(/ngày\s*Chưa chọn ngày/gi, `ngày ${formatDateDDMMYYYY(new Date())}`).replace(/Chưa chọn ngày/gi, formatDateDDMMYYYY(new Date()))
        : null;
      const submittedBy = t.submitted_by || (matchedSub ? matchedSub.branch_name : null) || t.assigned_to;

      return {
        ...t,
        rawTask: t,
        item_type: 'required_task',
        doc_number: t.doc_number || `TD-${String(t.id).slice(-6)}`,
        source_branch: t.assigned_to || 'Tất cả 56 Chi đoàn',
        display_title: t.title || 'Công việc TODO cần nộp văn bản',
        display_summary: t.description || t.content || `Nhiệm vụ do Quản trị viên giao. Hạn nộp: ${formatDateDDMMYYYY(t.dueDate || t.due_date || 'Hôm nay')}`,
        display_date: formatDateDDMMYYYY(t.dueDate || t.due_date || 'Hôm nay'),
        display_time: t.time || '',
        is_submitted: isSubmitted,
        file_url: fileUrl,
        file_name: fileName,
        submitted_at: submittedAt,
        submitted_by: submittedBy,
        matched_sub: matchedSub,
        viewed_by: (Array.isArray(t.viewed_by) && t.viewed_by.length > 0)
          ? t.viewed_by
          : (viewsMap[t.id] || viewsMap[t.title] || [])
      };
    });
  };

  const rawList = tabType === 'incoming_docs' 
    ? processIncomingItems() 
    : tabType === 'required_docs'
    ? processRequiredDocsItems()
    : processOutgoingItems();

  // Handle uploading and submitting document for TODO task
  const handleSubmitTaskDoc = async (e) => {
    e.preventDefault();
    if (!submittingTask) return;

    const branchName = currentUser?.full_name || currentUser?.branch_name || 'Chi đoàn Ấp';
    const now = new Date();
    const dateStr = formatDateDDMMYYYY(now);
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const submittedAtFormatted = `${timeStr} ngày ${dateStr}`;

    const fileName = taskDocFile ? taskDocFile.name : (taskDocFormData.file_name || 'Bao_Cao_Cong_Viec.pdf');
    const fileUrl = taskDocUploadStatus?.file_url || taskDocFormData.file_url || `https://drive.google.com/drive/search?q=${encodeURIComponent(submittingTask.display_title)}`;

    const submissionPayload = {
      id: `sub_${Date.now()}`,
      task_id: submittingTask.id,
      doc_title: submittingTask.display_title,
      title: `Báo cáo: ${submittingTask.display_title}`,
      branch_name: branchName,
      sender: branchName,
      submitted_at: submittedAtFormatted,
      sub_date: dateStr,
      time: timeStr,
      file_name: fileName,
      file_url: fileUrl,
      notes: taskDocFormData.notes || `Nộp báo cáo công việc: ${submittingTask.display_title}`,
      status: 'Chờ tiếp nhận',
      receipt_status: 'Chờ tiếp nhận',
      read_status: 'unread',
      item_type: 'submission'
    };

    if (onSaveSubmission) {
      await onSaveSubmission(submissionPayload);
    }

    const updatedTaskPayload = {
      ...submittingTask.rawTask,
      id: submittingTask.id,
      title: submittingTask.display_title,
      status: 'completed',
      has_submission: true,
      submitted_file: fileUrl,
      submitted_file_name: fileName,
      submitted_at: submittedAtFormatted,
      submitted_by: branchName,
      submitted_notes: taskDocFormData.notes || ''
    };

    if (onSaveTask) {
      await onSaveTask(updatedTaskPayload);
    }

    triggerToast && triggerToast(`Đã nộp văn bản cho công việc "${submittingTask.display_title}" thành công! Dữ liệu đã gửi về cho Quản trị viên.`);

    setSubmittingTask(null);
    setTaskDocFile(null);
    setTaskDocUploadStatus(null);
    setTaskDocFormData({ file_name: '', file_url: '', notes: '' });
  };
  
  // Deduplicate list by title and ID to ensure items appear exactly ONCE
  const deduplicatedList = (() => {
    const seen = new Set();
    return rawList.filter(item => {
      if (!item) return false;
      const key = (item.display_title && item.display_title.trim()) 
        ? item.display_title.trim() 
        : String(item.id);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  })();

  const filtered = deduplicatedList.filter(item => {
    const kw = search.toLowerCase().trim();
    if (!kw) return true;
    const titleMatch = (item.display_title || '').toLowerCase().includes(kw);
    const numMatch = (item.doc_number || '').toLowerCase().includes(kw);
    const branchMatch = (item.source_branch || '').toLowerCase().includes(kw);
    const summaryMatch = (item.display_summary || '').toLowerCase().includes(kw);
    return titleMatch || numMatch || branchMatch || summaryMatch;
  });

  const handleToggleReadStatus = (item, e) => {
    if (e) e.stopPropagation();
    const newRead = item.read_status === 'read' ? 'unread' : 'read';
    const updatedPayload = {
      ...item,
      read_status: newRead,
      status: newRead === 'read' ? 'read' : 'unread'
    };
    if (item.item_type === 'submission') {
      onSaveSubmission && onSaveSubmission(updatedPayload);
    } else {
      onSaveDocument && onSaveDocument(updatedPayload);
    }
    triggerToast && triggerToast(`Đã chuyển trạng thái đọc sang: ${newRead === 'read' ? 'Đã đọc' : 'Chưa đọc'}`);
  };

  const handleConfirmReceipt = (item, e) => {
    if (e) e.stopPropagation();
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const dateStr = formatDateDDMMYYYY(now);
    const timeStr = `${hours}:${minutes} ngày ${dateStr}`;

    const updatedPayload = {
      ...item,
      receipt_status: 'Đã tiếp nhận',
      status: 'Đã tiếp nhận',
      admin_received: true,
      admin_receipt_time: timeStr,
      read_status: 'read'
    };
    if (item.item_type === 'submission' || item.submission_id) {
      onSaveSubmission && onSaveSubmission(updatedPayload);
    } else {
      onSaveDocument && onSaveDocument(updatedPayload);
    }

    if (item.task_id || item.rawTask) {
      const rawT = item.rawTask || {};
      const updatedTask = {
        ...rawT,
        id: item.task_id || item.id,
        receipt_status: 'Đã tiếp nhận',
        admin_received: true,
        admin_receipt_time: timeStr
      };
      onSaveTask && onSaveTask(updatedTask);
    }

    if (previewDoc && previewDoc.id === item.id) {
      setPreviewDoc(updatedPayload);
    }
    triggerToast && triggerToast(`Quản trị viên đã tiếp nhận văn bản "${item.display_title}" từ ${item.source_branch} lúc ${timeStr}!`);
  };

  // Record Chi doan viewing document and transmit data back to administrator
  const handleRecordDocView = (item, branchName, force = false) => {
    if (!item || !branchName) return;

    // Check if branch already recorded view/receipt to prevent duplicate calls or overwriting timestamps
    const existingViews = item.viewed_by || [];
    const alreadyRecorded = existingViews.some(v => 
      v.branch_name === branchName || 
      v.branch_name?.includes(branchName) || 
      branchName.includes(v.branch_name)
    );

    if (alreadyRecorded && !force) {
      triggerToast && triggerToast(`Chi đoàn ${branchName} đã xác nhận tiếp nhận văn bản này trước đó.`);
      return;
    }

    const updatedViews = recordDocView(item.id || item.title, branchName);
    const updatedDoc = {
      ...item,
      viewed_by: updatedViews,
      read_status: 'read',
      status: 'Đã đọc'
    };

    if (item.item_type === 'submission') {
      onSaveSubmission && onSaveSubmission(updatedDoc);
    } else {
      onSaveDocument && onSaveDocument(updatedDoc);
    }

    if (previewDoc && (previewDoc.id === item.id || previewDoc.title === item.title)) {
      setPreviewDoc(updatedDoc);
    }
    if (viewHistoryDoc && (viewHistoryDoc.id === item.id || viewHistoryDoc.title === item.title)) {
      setViewHistoryDoc(updatedDoc);
    }

    const latestView = updatedViews.find(v => v.branch_name === branchName) || updatedViews[updatedViews.length - 1];
    triggerToast && triggerToast(`✓ Đã xác nhận tiếp nhận văn bản cho ${branchName} lúc ${latestView?.viewed_at || ''}!`);
  };

  // Remove view record for a Chi đoàn
  const handleRemoveDocView = (item, branchName) => {
    if (!item || !branchName) return;

    const matchedBranch = ALL_BRANCHES.find(b => 
      b.name === branchName || 
      b.name.includes(branchName) || 
      branchName.includes(b.name)
    );
    const canonicalName = matchedBranch ? matchedBranch.name : branchName;

    const remainingViews = (item.viewed_by || []).filter(v => 
      v && 
      v.branch_name !== canonicalName && 
      v.branch_name !== branchName && 
      !v.branch_name?.includes(canonicalName) && 
      !canonicalName.includes(v.branch_name)
    );

    removeDocView(item.id || item.title, branchName);

    const updatedDoc = {
      ...item,
      viewed_by: remainingViews
    };

    if (item.item_type === 'submission') {
      onSaveSubmission && onSaveSubmission(updatedDoc);
    } else {
      onSaveDocument && onSaveDocument(updatedDoc);
    }

    if (previewDoc && (previewDoc.id === item.id || previewDoc.title === item.title)) {
      setPreviewDoc(updatedDoc);
    }
    if (viewHistoryDoc && (viewHistoryDoc.id === item.id || viewHistoryDoc.title === item.title)) {
      setViewHistoryDoc(updatedDoc);
    }

    triggerToast && triggerToast(`🗑️ Đã xóa lượt xem của Chi đoàn ${canonicalName}!`);
  };

  // Clean up duplicate view records for a document
  const handleCleanupDuplicateBranchViews = (item) => {
    if (!item) return;
    const currentViews = item.viewed_by || [];
    const seen = new Set();
    const cleanViews = [];

    currentViews.forEach(v => {
      if (!v || !v.branch_name) return;
      const matched = ALL_BRANCHES.find(b => 
        b.name === v.branch_name || 
        b.name.includes(v.branch_name) || 
        v.branch_name.includes(b.name)
      );
      const cName = matched ? matched.name : v.branch_name;
      if (!seen.has(cName)) {
        seen.add(cName);
        cleanViews.push({
          ...v,
          branch_name: cName
        });
      }
    });

    setDocViews(item.id || item.title, cleanViews);

    const updatedDoc = {
      ...item,
      viewed_by: cleanViews
    };

    if (item.item_type === 'submission') {
      onSaveSubmission && onSaveSubmission(updatedDoc);
    } else {
      onSaveDocument && onSaveDocument(updatedDoc);
    }

    if (viewHistoryDoc && (viewHistoryDoc.id === item.id || viewHistoryDoc.title === item.title)) {
      setViewHistoryDoc(updatedDoc);
    }
    if (previewDoc && (previewDoc.id === item.id || previewDoc.title === item.title)) {
      setPreviewDoc(updatedDoc);
    }

    triggerToast && triggerToast(`🧹 Đã dọn dẹp các lượt xem trùng lặp! (Còn lại ${cleanViews.length} lượt xem hợp lệ)`);
  };

  // Open Preview Modal cleanly without auto-confirming or auto-saving duplicate records
  const handleOpenPreview = (item) => {
    let readItem = {
      ...item,
      read_status: 'read'
    };

    if (isDoanXa && item.read_status !== 'read') {
      if (item.item_type === 'submission') {
        onSaveSubmission && onSaveSubmission(readItem);
      } else {
        onSaveDocument && onSaveDocument(readItem);
      }
    }
    setPreviewDoc(readItem);
  };

  // Open Edit Document Modal (Tiêu đề, Ngày đăng, Số hiệu, Mục đích văn bản)
  const handleOpenEdit = (item) => {
    let dateStr = item.display_date || item.date || item.issue_date || '';
    if (dateStr.includes('/')) {
      const parts = dateStr.split('/');
      if (parts.length === 3) {
        dateStr = `${parts[2]}-${String(parts[1]).padStart(2, '0')}-${String(parts[0]).padStart(2, '0')}`;
      }
    } else if (!dateStr || dateStr === 'Hôm nay') {
      dateStr = new Date().toISOString().split('T')[0];
    }

    const categoryMap = {
      'Văn bản quyết định': 'decision_docs',
      'Ban hành hoạt động': 'act_docs',
      'Văn bản thuộc ban hành hoạt động': 'act_docs',
      'Văn bản triển khai': 'implementation_docs',
      'Văn bản cuộc họp': 'meeting_docs'
    };

    const initialCat = item.category || categoryMap[item.category_label] || 'decision_docs';
    const categoryLabels = {
      decision_docs: 'Văn bản quyết định',
      act_docs: 'Ban hành hoạt động',
      implementation_docs: 'Văn bản triển khai',
      meeting_docs: 'Văn bản cuộc họp'
    };

    setEditingDoc({
      id: item.id,
      title: item.display_title || item.title || '',
      date: dateStr,
      doc_number: item.doc_number || '',
      category: initialCat,
      category_label: item.category_label || categoryLabels[initialCat] || 'Văn bản quyết định',
      rawItem: item
    });
  };

  // Save Edit Document Changes
  const handleSaveEditDoc = (e) => {
    e.preventDefault();
    if (!editingDoc) return;

    const categoryLabels = {
      decision_docs: 'Văn bản quyết định',
      act_docs: 'Ban hành hoạt động',
      implementation_docs: 'Văn bản triển khai',
      meeting_docs: 'Văn bản cuộc họp'
    };

    const chosenCat = editingDoc.category || 'decision_docs';
    const chosenLabel = categoryLabels[chosenCat] || 'Văn bản quyết định';

    const updatedItem = {
      ...editingDoc.rawItem,
      id: editingDoc.id,
      title: editingDoc.title.trim(),
      display_title: editingDoc.title.trim(),
      date: editingDoc.date,
      issue_date: editingDoc.date,
      display_date: editingDoc.date,
      doc_number: editingDoc.doc_number.trim(),
      category: chosenCat,
      category_label: chosenLabel
    };

    if (editingDoc.rawItem.item_type === 'submission') {
      onSaveSubmission && onSaveSubmission(updatedItem);
    } else {
      onSaveDocument && onSaveDocument(updatedItem);
    }

    setEditingDoc(null);
    triggerToast && triggerToast(`Đã cập nhật tiêu đề, ngày đăng và mục đích văn bản "${updatedItem.title}" thành công!`);
  };

  const titleMap = {
    incoming_docs: 'Quản lý Văn bản đến (Tiếp nhận báo cáo & văn bản từ 56 Chi đoàn)',
    outgoing_docs: 'Quản lý Văn bản đi (Ban hành hoạt động & lưu trữ văn bản)',
    doan_xa_docs: 'Văn bản từ Đoàn xã',
    required_docs: 'Văn bản cần nộp (Công việc TODO do Quản trị viên giao)'
  };

  return (
    <div className="content-card">
      {/* Header section */}
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-4 gap-3 border-bottom pb-3">
        <div>
          <h3 className="card-title-header mb-1 d-flex align-items-center gap-2">
            <FileText className="text-primary" size={24} />
            {titleMap[tabType] || 'Quản lý Văn bản'}
          </h3>
          <div className="text-secondary" style={{ fontSize: '13px' }}>
            {tabType === 'incoming_docs' 
              ? 'Tiếp nhận, kiểm tra, xác nhận và tải tệp văn bản/báo cáo từ 56 Chi đoàn' 
              : tabType === 'required_docs'
              ? 'Nộp văn bản và tệp báo cáo cho các công việc TODO do Quản trị viên giao'
              : 'Ban hành, phân loại và lưu trữ tự động văn bản triển khai hoạt động'}
          </div>
        </div>

        {isDoanXa && (
          <button 
            className="btn btn-primary d-flex align-items-center gap-2 px-3 py-2 fw-semibold rounded-3 shadow-sm"
            style={{ backgroundColor: '#0066FF', border: 'none' }}
            onClick={onOpenIssueDocument}
          >
            <Send size={16} />
            <span>+ Ban hành văn bản mới</span>
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="d-flex align-items-center justify-content-between mb-3 gap-3">
        <div className="fw-bold text-dark" style={{ fontSize: '14px' }}>
          Danh sách văn bản {tabType === 'incoming_docs' ? 'đến' : tabType === 'required_docs' ? 'cần nộp' : 'đi'} ({filtered.length})
        </div>

        <div className="input-group" style={{ maxWidth: '340px' }}>
          <span className="input-group-text bg-light border-end-0"><Search size={15} className="text-secondary" /></span>
          <input 
            type="text" 
            className="form-control bg-light border-start-0 ps-0" 
            placeholder="Tìm theo nguồn, số hiệu, tiêu đề..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ fontSize: '13px' }}
          />
        </div>
      </div>

      {/* Table / Empty State */}
      {filtered.length === 0 ? (
        <div className="p-5 bg-light rounded-3 text-center border my-3">
          <div className="p-3 bg-white d-inline-block rounded-circle shadow-sm mb-3 text-primary">
            <FileText size={32} />
          </div>
          <h5 className="fw-bold text-dark mb-1">
            {tabType === 'required_docs' ? 'Chưa có công việc TODO nào cần nộp văn bản' : 'Chưa có văn bản nào trong mục này'}
          </h5>
          <p className="text-secondary mb-3" style={{ fontSize: '13px' }}>
            {tabType === 'incoming_docs' 
              ? 'Tất cả văn bản/báo cáo do 56 Chi đoàn nộp sẽ tự động hiển thị tại đây.'
              : tabType === 'required_docs'
              ? 'Mục này chỉ hiển thị khi Quản trị viên giao công việc TODO cho Chi đoàn. Khi đó, Chi đoàn sẽ tải tệp lên và gửi về cho Quản trị viên tại đây.'
              : 'Tất cả văn bản ban hành từ Quản lý hoạt động sẽ tự động đưa lên đây và Lưu trữ văn bản.'}
          </p>
          {isDoanXa && (
            <button className="btn btn-primary px-4 fw-semibold" style={{ backgroundColor: '#0066FF' }} onClick={onOpenIssueDocument}>
              + Ban hành văn bản mới
            </button>
          )}
        </div>
      ) : (
        <div className="table-responsive">
          <table className="custom-table align-middle">
            <thead>
              <tr>
                <th>Số / Ký hiệu</th>
                <th>{tabType === 'incoming_docs' ? 'Nguồn phát hành (Chi đoàn)' : tabType === 'required_docs' ? 'Chi đoàn thực hiện' : 'Đơn vị nhận'}</th>
                <th>{tabType === 'required_docs' ? 'Tiêu đề & Nội dung công việc TODO' : 'Tiêu đề & Trích yếu văn bản'}</th>
                <th>{tabType === 'incoming_docs' ? 'Ngày giờ nộp / Tải tệp lên' : tabType === 'required_docs' ? 'Hạn nộp / Ngày giao' : 'Ngày ban hành'}</th>
                {tabType === 'incoming_docs' && <th>Trạng thái đọc</th>}
                <th style={{ minWidth: '160px' }}>Trạng thái</th>
                <th>Tệp đính kèm</th>
                <th style={{ minWidth: '160px' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id} className={tabType === 'incoming_docs' && item.read_status === 'unread' ? 'bg-warning-subtle bg-opacity-10' : ''}>
                  <td className="fw-bold text-primary">{item.doc_number || '---'}</td>
                  
                  {/* Nguồn gửi / Đơn vị nhận (Tô đậm nguồn) */}
                  <td>
                    <div className="fw-bold text-dark d-flex align-items-center gap-1.5" style={{ fontSize: '13px' }}>
                      <Building size={15} className="text-primary flex-shrink-0" />
                      <strong>{item.source_branch || (tabType === 'incoming_docs' ? 'Chi đoàn Ấp' : 'Toàn xã')}</strong>
                    </div>
                  </td>

                  {/* Tiêu đề & Nội dung văn bản (Tô đậm tiêu đề) */}
                  <td>
                    <div className="fw-extrabold text-dark" style={{ fontSize: '13.5px' }}>
                      {item.display_title}
                    </div>
                    {item.display_summary && (
                      <div className="text-secondary mt-0.5 line-clamp-2" style={{ fontSize: '12px' }}>
                        {item.display_summary}
                      </div>
                    )}
                    {tabType === 'required_docs' ? (
                      <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle px-2 py-0.5 mt-1" style={{ fontSize: '10.5px' }}>
                        📌 Công việc TODO
                      </span>
                    ) : item.category_label && (
                      <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2 py-0.5 mt-1" style={{ fontSize: '10.5px' }}>
                        📌 {item.category_label}
                      </span>
                    )}
                  </td>

                  {/* Ngày giờ tải tệp lên / Nộp văn bản / Ngày ban hành */}
                  <td className="text-secondary" style={{ fontSize: '12.5px' }}>
                    <div className="fw-semibold text-dark">
                      📅 {formatDateDDMMYYYY(item.display_date)}
                    </div>
                    {item.display_time && (
                      <div className="text-muted" style={{ fontSize: '11.5px' }}>
                        ⏰ {item.display_time}
                      </div>
                    )}
                  </td>

                  {/* Trạng thái đọc (Clickable Toggle) - Cho Incoming Docs */}
                  {tabType === 'incoming_docs' && (
                    <td>
                      <button 
                        className={`badge ${item.read_status === 'read' ? 'bg-success-subtle text-success border-success-subtle' : 'bg-danger-subtle text-danger border-danger-subtle'} border px-2.5 py-1.5 rounded-2 fw-semibold cursor-pointer border-0 shadow-xs hover-scale`}
                        style={{ fontSize: '11.5px' }}
                        title="Bấm để thay đổi trạng thái đọc"
                        onClick={(e) => handleToggleReadStatus(item, e)}
                      >
                        {item.read_status === 'read' ? '🟢 Đã đọc' : '🔴 Chưa đọc'}
                      </button>
                    </td>
                  )}

                  {/* Trạng thái: Hiển thị dựa trên Chi đoàn nào đã xem & ngày giờ xem */}
                  <td>
                    {tabType === 'incoming_docs' ? (
                      item.receipt_status === 'Đã tiếp nhận' ? (
                        <span className="badge bg-success-subtle text-success border border-success-subtle px-2.5 py-1 fw-bold">
                          ✓ Đã tiếp nhận
                        </span>
                      ) : (
                        <button 
                          className="btn btn-sm btn-outline-primary fw-bold px-2.5 py-1 rounded-2 shadow-xs"
                          style={{ fontSize: '11.5px' }}
                          onClick={(e) => handleConfirmReceipt(item, e)}
                        >
                          Xác nhận tiếp nhận
                        </button>
                      )
                    ) : tabType === 'required_docs' ? (
                      item.is_submitted ? (
                        <div>
                          {item.receipt_status === 'Đã tiếp nhận' || item.status === 'Đã tiếp nhận' || item.admin_received ? (
                            <div>
                              <span className="badge bg-success text-white border border-success px-2.5 py-1.5 fw-bold shadow-xs" style={{ fontSize: '11.5px' }}>
                                ✓ Quản trị viên đã tiếp nhận
                              </span>
                              <div className="text-success fw-bold mt-0.5" style={{ fontSize: '10.5px' }}>
                                lúc {item.admin_receipt_time || item.submitted_at || item.display_date}
                              </div>
                            </div>
                          ) : (
                            <div>
                              <span className="badge bg-success-subtle text-success border border-success-subtle px-2.5 py-1.5 fw-bold" style={{ fontSize: '11.5px' }}>
                                🟢 Đã nộp văn bản
                              </span>
                              {item.submitted_at && (
                                <div className="text-muted mt-0.5" style={{ fontSize: '10.5px' }}>
                                  lúc {item.submitted_at}
                                </div>
                              )}
                              {isDoanXa && (
                                <button 
                                  className="btn btn-sm btn-outline-success fw-bold px-2 py-0.5 mt-1 rounded-2 shadow-xs"
                                  style={{ fontSize: '10.5px' }}
                                  onClick={(e) => handleConfirmReceipt(item, e)}
                                >
                                  ✓ Tiếp nhận báo cáo này
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div>
                          <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle px-2.5 py-1.5 fw-bold" style={{ fontSize: '11.5px' }}>
                            🟡 Chưa nộp văn bản
                          </span>
                          <div className="text-muted mt-0.5" style={{ fontSize: '10.5px' }}>
                            Hạn: {item.display_date}
                          </div>
                        </div>
                      )
                    ) : (
                      /* Outgoing Docs - Hiển thị chi đoàn nào đã xem, truyền dữ liệu về quản trị viên */
                      <div>
                        {isDoanXa ? (
                          (() => {
                            const viewedMap = new Map();
                            (item.viewed_by || []).forEach(v => {
                              if (v && v.branch_name) {
                                const matchedBranch = ALL_BRANCHES.find(b => 
                                  b.name === v.branch_name || 
                                  b.name.includes(v.branch_name) || 
                                  v.branch_name.includes(b.name)
                                );
                                if (matchedBranch) {
                                  viewedMap.set(matchedBranch.name, v);
                                }
                              }
                            });
                            const count = viewedMap.size;
                            const total = ALL_BRANCHES.length; // 56
                            if (count === 0) {
                              return (
                                <button
                                  type="button"
                                  className="btn btn-sm btn-light border border-secondary-subtle text-secondary px-2.5 py-1.5 rounded-pill d-inline-flex align-items-center gap-1.5 fw-semibold hover-scale"
                                  style={{ fontSize: '11px', cursor: 'pointer', background: '#f8fafc' }}
                                  onClick={() => setViewHistoryDoc(item)}
                                  title="Bấm để xem danh sách 56 Chi đoàn / Đơn vị và thời gian xem"
                                >
                                  <Eye size={12} className="text-secondary" />
                                  <span>Chưa có Chi đoàn xem</span>
                                  <span className="badge bg-secondary-subtle text-secondary rounded-pill" style={{ fontSize: '9.5px' }}>0/{total}</span>
                                </button>
                              );
                            }
                            const lastView = Array.from(viewedMap.values()).pop();
                            return (
                              <div>
                                <button
                                  type="button"
                                  className="btn btn-sm btn-success-subtle text-success border border-success-subtle px-2.5 py-1.5 rounded-pill d-inline-flex align-items-center gap-1.5 fw-bold hover-scale"
                                  style={{ fontSize: '11px', cursor: 'pointer', background: '#ecfdf5' }}
                                  onClick={() => setViewHistoryDoc(item)}
                                  title="Bấm để xem chi tiết chi đoàn nào đã xem, ngày giờ xem"
                                >
                                  <Eye size={12} className="text-success" />
                                  <span>{count}/{total} Chi đoàn đã xem</span>
                                </button>
                                {lastView && (
                                  <div className="mt-1" style={{ fontSize: '11px' }}>
                                    <div className="fw-bold text-dark text-truncate" style={{ maxWidth: '170px' }}>
                                      <span className="text-success me-1">●</span>{lastView.branch_name}
                                    </div>
                                    <div className="text-muted" style={{ fontSize: '10px' }}>
                                      lúc {lastView.viewed_at}
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })()
                        ) : (
                          /* Chi đoàn User View: Check if current branch has viewed */
                          (() => {
                            const myBranch = currentUser?.full_name || currentUser?.branch_name || 'Chi đoàn Ấp';
                            const myView = (item.viewed_by || []).find(v => 
                              v.branch_name === myBranch || 
                              v.branch_name?.includes(myBranch) || 
                              myBranch.includes(v.branch_name)
                            );
                            if (myView) {
                              return (
                                <div>
                                  <span className="badge bg-success-subtle text-success border border-success-subtle px-2.5 py-1 fw-bold" style={{ fontSize: '11px' }}>
                                    ✓ Đã xác nhận
                                  </span>
                                  <div className="text-muted mt-0.5" style={{ fontSize: '10px' }}>
                                    lúc {myView.viewed_at}
                                  </div>
                                </div>
                              );
                            }
                            return (
                              <div>
                                <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle px-2.5 py-1 fw-bold" style={{ fontSize: '11px' }}>
                                  🔴 Chưa xác nhận
                                </span>
                                <div className="text-muted mt-0.5" style={{ fontSize: '10px' }}>
                                  (Xem trước để xác nhận)
                                </div>
                              </div>
                            );
                          })()
                        )}
                      </div>
                    )}
                  </td>

                  {/* Tệp đính kèm / Tải PDF */}
                  <td>
                    {item.file_url || item.file_name ? (
                      <a 
                        href={item.file_url && item.file_url !== '#' ? item.file_url : `/${item.file_name}`} 
                        download={item.file_name || 'Van_Ban.pdf'}
                        target="_blank" 
                        rel="noreferrer" 
                        className="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-1 fw-semibold px-2.5 py-1 rounded-2"
                        style={{ fontSize: '11.5px' }}
                      >
                        <Download size={13} />
                        <span>{tabType === 'required_docs' ? 'Tải PDF nộp' : 'Tải PDF'}</span>
                      </a>
                    ) : (
                      <span className="text-muted" style={{ fontSize: '11px' }}>Chưa nộp tệp</span>
                    )}
                  </td>

                  {/* Thao tác */}
                  <td>
                    <div className="d-inline-flex align-items-center gap-1.5">
                      {/* Xem trước văn bản: Có mặt cho cả Quản trị viên và Chi đoàn */}
                      <button 
                        className="btn btn-sm btn-outline-info d-inline-flex align-items-center gap-1 px-2.5 py-1 rounded-2 fw-semibold"
                        style={{ fontSize: '11.5px' }}
                        title="Xem chi tiết & trích yếu văn bản"
                        onClick={() => handleOpenPreview(item)}
                      >
                        <FileText size={13} />
                        <span>Xem trước</span>
                      </button>

                      {/* Nộp văn bản cho công việc TODO (Chi đoàn) */}
                      {tabType === 'required_docs' && !isDoanXa && (
                        <button 
                          className="btn btn-sm btn-primary d-inline-flex align-items-center gap-1 px-3 py-1 rounded-2 fw-semibold shadow-xs hover-scale"
                          style={{ fontSize: '11.5px', backgroundColor: '#0066FF', border: 'none' }}
                          onClick={() => setSubmittingTask(item)}
                        >
                          <Upload size={13} />
                          <span>{item.is_submitted ? 'Nộp lại file' : 'Nộp văn bản'}</span>
                        </button>
                      )}

                      {/* Nút chỉnh sửa tiêu đề, ngày đăng văn bản: Quản trị viên và Chi đoàn */}
                      {tabType !== 'required_docs' && (
                        <button 
                          className="btn btn-sm btn-outline-warning d-inline-flex align-items-center gap-1 py-1 px-2.5 rounded-2 fw-semibold text-warning-emphasis"
                          style={{ fontSize: '11.5px' }}
                          title="Chỉnh sửa lại ngày đăng, tiêu đề văn bản"
                          onClick={() => handleOpenEdit(item)}
                        >
                          <Edit3 size={13} />
                          <span>Sửa</span>
                        </button>
                      )}

                      {/* Nút Xóa file nộp khi chọn sai file */}
                      {(item.is_submitted || (item.file_url && item.file_url !== '#')) && (
                        <button 
                          className="btn btn-sm btn-outline-danger d-inline-flex align-items-center gap-1 py-1 px-2.5 rounded-2 fw-semibold"
                          style={{ fontSize: '11.5px' }}
                          title="Xóa tệp đính kèm do nộp sai file"
                          onClick={() => {
                            if (window.confirm(`Bạn có chắc chắn muốn xóa file nộp "${item.file_name || item.display_title}" do đưa sai file không?`)) {
                              handleDeleteWrongFile(item);
                            }
                          }}
                        >
                          <Trash2 size={13} />
                          <span>Xóa file</span>
                        </button>
                      )}

                      {/* Thu hồi văn bản đi từ Đoàn xã */}
                      {isDoanXa && tabType === 'outgoing_docs' && (
                        <button 
                          className="btn btn-sm btn-outline-danger d-inline-flex align-items-center gap-1 py-1 px-2.5 rounded-2 fw-semibold"
                          style={{ fontSize: '11.5px' }}
                          title="Thu hồi văn bản tức thì"
                          onClick={() => {
                            if (window.confirm(`Bạn có chắc chắn muốn THU HỒI văn bản "${item.display_title}" không? Văn bản sẽ được xóa đồng bộ trên toàn bộ 56 Chi đoàn / Đơn vị.`)) {
                              onDeleteDocument && onDeleteDocument(item.id, item.display_title);
                            }
                          }}
                        >
                          <Trash2 size={13} />
                          <span>Thu hồi</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 1. Modal Chỉnh Sửa Ngày Đăng, Tiêu Đề Văn Bản */}
      {editingDoc && (
        <div className="modal d-block bg-dark bg-opacity-50" style={{ zIndex: 1085 }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 rounded-4 shadow-lg">
              <div className="modal-header border-bottom pb-3">
                <h5 className="modal-title fw-bold text-dark d-flex align-items-center gap-2" style={{ fontSize: '16.5px' }}>
                  <Edit3 className="text-warning" size={20} />
                  <span>Chỉnh Sửa Văn Bản (Ngày đăng, Tiêu đề)</span>
                </h5>
                <button type="button" className="btn-close" onClick={() => setEditingDoc(null)}></button>
              </div>
              <form onSubmit={handleSaveEditDoc}>
                <div className="modal-body p-4">
                  <div className="row g-3 mb-3">
                    <div className="col-md-4">
                      <label className="form-label fw-semibold" style={{ fontSize: '13px' }}>
                        Số / Ký hiệu văn bản <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        value={editingDoc.doc_number}
                        onChange={(e) => setEditingDoc({ ...editingDoc, doc_number: e.target.value })}
                        placeholder="Số hiệu..."
                      />
                    </div>
                    <div className="col-md-8">
                      <label className="form-label fw-semibold text-primary d-flex align-items-center gap-1.5" style={{ fontSize: '13px' }}>
                        <Calendar size={15} />
                        <span>Ngày đăng / Ngày ban hành <span className="text-danger">*</span></span>
                      </label>
                      <input
                        type="date"
                        className="form-control fw-bold border-primary-subtle"
                        required
                        value={editingDoc.date}
                        onChange={(e) => setEditingDoc({ ...editingDoc, date: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Chỉnh sửa Tiêu đề */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold text-primary d-flex align-items-center gap-1.5" style={{ fontSize: '13px' }}>
                      <FileText size={15} />
                      <span>Tên / Tiêu đề & Trích yếu văn bản <span className="text-danger">*</span></span>
                    </label>
                    <textarea
                      className="form-control fw-bold text-dark border-primary-subtle"
                      rows={3}
                      required
                      value={editingDoc.title}
                      onChange={(e) => setEditingDoc({ ...editingDoc, title: e.target.value })}
                      placeholder="Nhập tiêu đề văn bản..."
                      style={{ fontSize: '14px', lineHeight: '1.5' }}
                    />
                  </div>

                  {/* Mục đích của văn bản - Nút chức năng chọn theo thứ tự yêu cầu */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold text-primary d-flex align-items-center justify-content-between mb-2" style={{ fontSize: '13px' }}>
                      <span className="d-flex align-items-center gap-1.5">
                        <FileText size={15} />
                        <span>Mục đích của văn bản <span className="text-danger">*</span></span>
                      </span>
                      <span className="badge bg-primary-subtle text-primary fw-bold" style={{ fontSize: '11px' }}>
                        {editingDoc.category === 'decision_docs' && '⚖️ Văn bản quyết định'}
                        {editingDoc.category === 'act_docs' && '📌 Ban hành hoạt động'}
                        {editingDoc.category === 'implementation_docs' && '📢 Văn bản triển khai'}
                        {editingDoc.category === 'meeting_docs' && '🤝 Văn bản cuộc họp'}
                      </span>
                    </label>
                    
                    <div className="row g-2">
                      {[
                        { key: 'decision_docs', label: 'Văn bản quyết định', icon: '⚖️' },
                        { key: 'act_docs', label: 'Ban hành hoạt động', icon: '📌' },
                        { key: 'implementation_docs', label: 'Văn bản triển khai', icon: '📢' },
                        { key: 'meeting_docs', label: 'Văn bản cuộc họp', icon: '🤝' }
                      ].map((cat, idx) => {
                        const isSelected = editingDoc.category === cat.key;
                        return (
                          <div className="col-6 col-md-3" key={cat.key}>
                            <button
                              type="button"
                              className={`btn w-100 p-2.5 rounded-3 text-start border d-flex flex-column justify-content-between transition-all ${
                                isSelected 
                                  ? 'btn-primary shadow-sm border-primary text-white' 
                                  : 'btn-light bg-white border-secondary-subtle text-dark hover-shadow'
                              }`}
                              onClick={() => setEditingDoc({ ...editingDoc, category: cat.key })}
                              style={{ minHeight: '56px', cursor: 'pointer' }}
                            >
                              <div className="d-flex align-items-center justify-content-between w-100 mb-1">
                                <span style={{ fontSize: '14px' }}>{cat.icon}</span>
                                <span className={`badge ${isSelected ? 'bg-white text-primary' : 'bg-light text-secondary'} rounded-pill`} style={{ fontSize: '9.5px' }}>
                                  #{idx + 1}
                                </span>
                              </div>
                              <div className="fw-bold text-truncate w-100" style={{ fontSize: '12px' }}>{cat.label}</div>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="modal-footer border-top pt-3">
                  <button 
                    type="button" 
                    className="btn btn-light border text-secondary px-4 py-2 rounded-3 fw-semibold"
                    onClick={() => setEditingDoc(null)}
                  >
                    Hủy
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary px-4 py-2 rounded-3 fw-bold shadow-sm"
                    style={{ backgroundColor: '#0066FF' }}
                  >
                    Lưu Thay Đổi
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* 2. Modal Hiển Thị Chi Tiết Chi Đoàn Nào Đã Xem Văn Bản (Ngày, Giờ) */}
      {viewHistoryDoc && (
        <div className="modal d-block bg-dark bg-opacity-50" style={{ zIndex: 1085 }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 rounded-4 shadow-lg p-4">
              <div className="d-flex align-items-center justify-content-between pb-3 border-bottom mb-3">
                <div>
                  <h5 className="modal-title fw-bold text-dark d-flex align-items-center gap-2 mb-1" style={{ fontSize: '16.5px' }}>
                    <Eye className="text-primary" size={22} />
                    <span>Chi Tiết Tiếp Nhận & Theo Dõi Chi Đoàn Đã Xem</span>
                  </h5>
                  <div className="text-secondary" style={{ fontSize: '12.5px' }}>
                    Văn bản: <strong className="text-dark">{viewHistoryDoc.display_title}</strong> (Số: {viewHistoryDoc.doc_number || '---'})
                  </div>
                </div>
                <button type="button" className="btn-close" onClick={() => setViewHistoryDoc(null)}></button>
              </div>

              {/* Thống kê tỷ lệ tiếp nhận */}
              {(() => {
                const viewedMap = new Map();
                (viewHistoryDoc.viewed_by || []).forEach(v => {
                  if (v && v.branch_name) {
                    const matchedBranch = ALL_BRANCHES.find(b => 
                      b.name === v.branch_name || 
                      b.name.includes(v.branch_name) || 
                      v.branch_name.includes(b.name)
                    );
                    if (matchedBranch) {
                      viewedMap.set(matchedBranch.name, v);
                    }
                  }
                });
                const totalBranches = ALL_BRANCHES.length;
                const viewedCount = viewedMap.size;
                const percentage = Math.round((viewedCount / totalBranches) * 100);

                const filteredBranchList = ALL_BRANCHES.filter(branch => {
                  const isViewed = viewedMap.has(branch.name);
                  if (historyTab === 'VIEWED' && !isViewed) return false;
                  if (historyTab === 'NOT_VIEWED' && isViewed) return false;
                  if (historySearch && !branch.name.toLowerCase().includes(historySearch.toLowerCase())) return false;
                  return true;
                });

                return (
                  <div>
                    {/* Summary Header Card */}
                    <div className="p-3 bg-light rounded-3 border mb-3">
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <span className="fw-bold text-dark" style={{ fontSize: '13.5px' }}>
                          Tình hình tiếp nhận của 56 Chi đoàn / Đơn vị:
                        </span>
                        <span className="badge bg-success text-white fw-bold px-2.5 py-1">
                          {viewedCount}/{totalBranches} Chi đoàn đã xem ({percentage}%)
                        </span>
                      </div>
                      <div className="progress" style={{ height: '8px' }}>
                        <div 
                          className="progress-bar bg-success" 
                          role="progressbar" 
                          style={{ width: `${percentage}%` }} 
                          aria-valuenow={percentage} 
                          aria-valuemin="0" 
                          aria-valuemax="100"
                        />
                      </div>
                    </div>

                    {/* Filter Tabs & Search & Cleanup */}
                    <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-2 mb-3">
                      <div className="btn-group btn-group-sm" role="group">
                        <button
                          type="button"
                          className={`btn ${historyTab === 'ALL' ? 'btn-primary fw-bold' : 'btn-outline-secondary'}`}
                          onClick={() => setHistoryTab('ALL')}
                        >
                          Tất cả ({totalBranches})
                        </button>
                        <button
                          type="button"
                          className={`btn ${historyTab === 'VIEWED' ? 'btn-success fw-bold' : 'btn-outline-success'}`}
                          onClick={() => setHistoryTab('VIEWED')}
                        >
                          ✓ Đã xem ({viewedCount})
                        </button>
                        <button
                          type="button"
                          className={`btn ${historyTab === 'NOT_VIEWED' ? 'btn-danger fw-bold' : 'btn-outline-danger'}`}
                          onClick={() => setHistoryTab('NOT_VIEWED')}
                        >
                          ⏳ Chưa xem ({totalBranches - viewedCount})
                        </button>
                      </div>

                      <div className="d-flex align-items-center gap-2">
                        {isDoanXa && (
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-warning d-flex align-items-center gap-1 text-nowrap fw-semibold"
                            style={{ fontSize: '11.5px' }}
                            title="Tự động lọc & dọn dẹp các bản ghi xem trùng lặp"
                            onClick={() => handleCleanupDuplicateBranchViews(viewHistoryDoc)}
                          >
                            🧹 Dọn dẹp trùng lặp
                          </button>
                        )}
                        <div className="input-group input-group-sm" style={{ maxWidth: '220px' }}>
                          <span className="input-group-text bg-white border-end-0"><Search size={13} className="text-muted" /></span>
                          <input
                            type="text"
                            className="form-control border-start-0 ps-0"
                            placeholder="Tìm tên Chi đoàn..."
                            value={historySearch}
                            onChange={(e) => setHistorySearch(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Branch List Table */}
                    <div className="table-responsive border rounded-3 mb-3" style={{ maxHeight: '320px' }}>
                      <table className="table table-hover align-middle mb-0" style={{ fontSize: '12.5px' }}>
                        <thead className="table-light sticky-top">
                          <tr>
                            <th style={{ width: '45px' }}>STT</th>
                            <th>Đơn vị (Chi đoàn Ấp)</th>
                            <th>Cụm thi đua</th>
                            <th style={{ width: '220px' }}>Trạng thái & Thời gian xem</th>
                            {isDoanXa && <th className="text-center" style={{ width: '150px' }}>Quản lý & Thao tác</th>}
                          </tr>
                        </thead>
                        <tbody>
                          {filteredBranchList.map((b, index) => {
                            const viewRecord = viewedMap.get(b.name);
                            return (
                              <tr key={b.id || b.name}>
                                <td className="text-muted text-center">{index + 1}</td>
                                <td>
                                  <div className="fw-bold text-dark d-flex align-items-center gap-1.5">
                                    <Building size={14} className="text-primary" />
                                    <span>{b.name}</span>
                                  </div>
                                </td>
                                <td>
                                  <span className="badge bg-light text-secondary border" style={{ fontSize: '10.5px' }}>
                                    {b.cluster_id || 'Cụm'}
                                  </span>
                                </td>
                                <td>
                                  {viewRecord ? (
                                    <span className="badge bg-success text-white px-2.5 py-1 rounded-pill d-inline-flex align-items-center gap-1 fw-bold shadow-xs">
                                      <CheckCircle2 size={12} />
                                      <span>Đã xem lúc {viewRecord.viewed_at}</span>
                                    </span>
                                  ) : (
                                    <span className="badge bg-secondary-subtle text-secondary px-2.5 py-1 rounded-pill fw-semibold">
                                      ⏳ Chưa xem
                                    </span>
                                  )}
                                </td>
                                {isDoanXa && (
                                  <td className="text-center">
                                    {viewRecord ? (
                                      <button
                                        type="button"
                                        className="btn btn-outline-danger btn-sm px-2 py-0.5 rounded-2 d-inline-flex align-items-center gap-1 fw-semibold"
                                        style={{ fontSize: '11px' }}
                                        title="Xóa lượt xem của Chi đoàn này"
                                        onClick={() => handleRemoveDocView(viewHistoryDoc, b.name)}
                                      >
                                        <Trash2 size={11} />
                                        <span>Xóa lượt xem</span>
                                      </button>
                                    ) : (
                                      <button
                                        type="button"
                                        className="btn btn-outline-success btn-sm px-2 py-0.5 rounded-2 d-inline-flex align-items-center gap-1 fw-semibold"
                                        style={{ fontSize: '11px' }}
                                        title="Đánh dấu Chi đoàn này đã xem"
                                        onClick={() => handleRecordDocView(viewHistoryDoc, b.name, true)}
                                      >
                                        <Plus size={11} />
                                        <span>Ghi nhận xem</span>
                                      </button>
                                    )}
                                  </td>
                                )}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {/* Quản trị viên mô phỏng hoặc ghi nhận nhanh khi kiểm tra */}
                    {isDoanXa && (
                      <div className="p-2.5 bg-light rounded-3 border d-flex align-items-center justify-content-between flex-wrap gap-2">
                        <div className="d-flex align-items-center gap-1.5 text-secondary" style={{ fontSize: '12px' }}>
                          <ShieldCheck size={16} className="text-primary" />
                          <span>Mô phỏng Chi đoàn bấm xem (Thử nghiệm truyền dữ liệu ngược về Quản trị viên):</span>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                          <select
                            className="form-select form-select-sm"
                            style={{ width: '180px', fontSize: '12px' }}
                            value={simulateBranch}
                            onChange={(e) => setSimulateBranch(e.target.value)}
                          >
                            {ALL_BRANCHES.map(b => (
                              <option key={b.name} value={b.name}>{b.name}</option>
                            ))}
                          </select>
                          <button
                            type="button"
                            className="btn btn-sm btn-primary fw-semibold px-2.5 py-1 text-nowrap"
                            style={{ fontSize: '11.5px', backgroundColor: '#0066FF' }}
                            onClick={() => handleRecordDocView(viewHistoryDoc, simulateBranch)}
                          >
                            + Ghi nhận xem
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}

              <div className="d-flex justify-content-end pt-3 border-top mt-3">
                <button 
                  type="button" 
                  className="btn btn-secondary px-4 py-1.5 rounded-3 fw-semibold"
                  onClick={() => setViewHistoryDoc(null)}
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Preview Modal for Incoming / Outgoing Documents */}
      {previewDoc && (
        <div 
          className="modal d-block bg-dark bg-opacity-50" 
          style={{ zIndex: 1080 }}
          onClick={() => setPreviewDoc(null)}
        >
          <div 
            className="modal-dialog modal-dialog-centered modal-lg shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content border-0 rounded-4 p-4">
              <div className="d-flex align-items-center justify-content-between pb-3 border-bottom mb-3">
                <h5 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2" style={{ fontSize: '16.5px' }}>
                  <FileText className="text-primary" size={22} />
                  <span>Trích yếu & Xem trước Văn bản</span>
                </h5>
                <button type="button" className="btn-close" onClick={() => setPreviewDoc(null)}></button>
              </div>

              {/* Nguồn gửi & Trạng thái xem */}
              <div className="p-3 bg-primary-subtle bg-opacity-30 border border-primary-subtle rounded-3 mb-3 d-flex align-items-center justify-content-between flex-wrap gap-2">
                <div>
                  <div className="text-secondary" style={{ fontSize: '12px' }}>Đơn vị / Nguồn phát hành:</div>
                  <div className="fw-extrabold text-primary fs-6 d-flex align-items-center gap-1.5">
                    <Building size={18} />
                    <span>{previewDoc.source_branch || 'Chi đoàn Ấp'}</span>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-2">
                  {isDoanXa ? (
                    <button
                      type="button"
                      className="badge bg-success-subtle text-success border border-success px-2.5 py-1.5 rounded-2 d-inline-flex align-items-center gap-1 fw-bold cursor-pointer"
                      onClick={() => {
                        setViewHistoryDoc(previewDoc);
                      }}
                      title="Bấm để xem danh sách chi đoàn đã xem"
                    >
                      <Eye size={13} />
                      <span>
                        {(() => {
                          const viewedMap = new Map();
                          (previewDoc.viewed_by || []).forEach(v => {
                            if (v && v.branch_name) {
                              const matchedBranch = ALL_BRANCHES.find(b => 
                                b.name === v.branch_name || 
                                b.name.includes(v.branch_name) || 
                                v.branch_name.includes(b.name)
                              );
                              if (matchedBranch) {
                                viewedMap.set(matchedBranch.name, v);
                              }
                            }
                          });
                          return viewedMap.size;
                        })()}/56 Chi đoàn / Đơn vị đã xem
                      </span>
                    </button>
                  ) : (
                    <span className="badge bg-success text-white px-2.5 py-1 rounded-2 fw-bold">
                      ✓ Bạn đã xem văn bản
                    </span>
                  )}
                  <span className={`badge ${previewDoc.receipt_status === 'Đã tiếp nhận' ? 'bg-success text-white' : 'bg-warning text-dark'} px-2.5 py-1 rounded-2`}>
                    {previewDoc.receipt_status === 'Đã tiếp nhận' ? '✓ Đã tiếp nhận' : '⏳ Chờ tiếp nhận'}
                  </span>
                </div>
              </div>

              {/* Chi tiết nội dung văn bản */}
              <div className="p-3 bg-light rounded-3 border mb-3">
                <div className="d-flex align-items-center justify-content-between mb-1">
                  <div className="text-muted fw-semibold" style={{ fontSize: '12px' }}>
                    Số hiệu: <strong className="text-primary">{previewDoc.doc_number || '---'}</strong>
                  </div>
                  {previewDoc.category_label && (
                    <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2 py-0.5" style={{ fontSize: '11px' }}>
                      📌 {previewDoc.category_label}
                    </span>
                  )}
                </div>

                <h5 className="fw-bold text-dark mb-2" style={{ fontSize: '17px' }}>
                  {previewDoc.display_title}
                </h5>

                <div className="text-secondary mb-3 d-flex align-items-center gap-3" style={{ fontSize: '12.5px' }}>
                  <span>📅 Ngày ban hành / tải lên: <strong>{previewDoc.display_date}</strong></span>
                  {previewDoc.display_time && <span>⏰ Giờ tải: <strong>{previewDoc.display_time}</strong></span>}
                </div>

                <div className="p-3 bg-white rounded-3 border text-dark" style={{ fontSize: '13.5px', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
                  <div className="fw-bold text-secondary mb-1" style={{ fontSize: '12px' }}>📋 Nội dung / Trích yếu:</div>
                  {previewDoc.display_summary || 'Nội dung chi tiết được lưu trữ cùng tệp đính kèm.'}
                </div>
              </div>

              {/* Xem trực tiếp nội dung tệp (Embedded PDF / Document Viewer) */}
              {previewDoc.file_url && previewDoc.file_url !== '#' && (
                <div className="mb-3">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <div className="fw-bold text-dark d-flex align-items-center gap-1.5" style={{ fontSize: '13px' }}>
                      <FileText className="text-primary" size={16} />
                      <span>Xem trực tiếp nội dung tệp ({previewDoc.file_name || 'Van_Ban.pdf'}):</span>
                    </div>
                    <a 
                      href={previewDoc.file_url} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="btn btn-sm btn-outline-secondary py-1 px-2.5 fw-semibold d-inline-flex align-items-center gap-1"
                      style={{ fontSize: '11.5px' }}
                    >
                      <span>↗️ Mở cửa sổ toàn màn hình</span>
                    </a>
                  </div>

                  <div className="border rounded-3 overflow-hidden bg-dark shadow-xs position-relative" style={{ height: '420px' }}>
                    <iframe
                      src={previewDoc.file_url.startsWith('http') 
                        ? previewDoc.file_url 
                        : `https://docs.google.com/viewer?url=${encodeURIComponent(window.location.origin + '/' + previewDoc.file_name)}&embedded=true`}
                      title="Xem trực tiếp nội dung văn bản"
                      className="w-100 h-100 border-0 bg-white"
                    />
                  </div>
                </div>
              )}

              {/* Tệp đính kèm & Tải PDF */}
              <div className="p-3 bg-white border rounded-3 d-flex align-items-center justify-content-between mb-4">
                <div className="d-flex align-items-center gap-2.5">
                  <div className="p-2.5 bg-danger-subtle text-danger rounded-3">
                    <FileText size={24} />
                  </div>
                  <div>
                    <div className="fw-bold text-dark" style={{ fontSize: '13.5px' }}>
                      {previewDoc.file_name || 'Van_Ban_Dinh_Kem.pdf'}
                    </div>
                    <div className="text-muted" style={{ fontSize: '11.5px' }}>Tệp PDF / Văn bản chính thức</div>
                  </div>
                </div>

                {previewDoc.file_url || previewDoc.file_name ? (
                  <a 
                    href={previewDoc.file_url && previewDoc.file_url !== '#' ? previewDoc.file_url : `/${previewDoc.file_name}`} 
                    download={previewDoc.file_name || 'Van_Ban.pdf'}
                    target="_blank" 
                    rel="noreferrer" 
                    className="btn btn-primary d-inline-flex align-items-center gap-1.5 fw-bold px-3 py-2 rounded-3 shadow-xs"
                    style={{ backgroundColor: '#0066FF' }}
                  >
                    <Download size={16} />
                    <span>Tải PDF về máy</span>
                  </a>
                ) : (
                  <span className="text-muted" style={{ fontSize: '12px' }}>Không có tệp</span>
                )}
              </div>

              {/* Footer Modal Actions */}
              <div className="d-flex align-items-center justify-content-between pt-2 border-top">
                <button 
                  type="button" 
                  className="btn btn-light border text-secondary fw-semibold px-4 py-2 rounded-3"
                  onClick={() => setPreviewDoc(null)}
                >
                  Đóng
                </button>

                <div className="d-flex align-items-center gap-2">
                  {isDoanXa ? (
                    <>
                      <button
                        type="button"
                        className="btn btn-outline-warning fw-semibold px-3 py-2 rounded-3 d-inline-flex align-items-center gap-1.5"
                        onClick={() => {
                          const itemToEdit = previewDoc;
                          setPreviewDoc(null);
                          handleOpenEdit(itemToEdit);
                        }}
                      >
                        <Edit3 size={15} />
                        <span>Sửa văn bản này</span>
                      </button>

                      {previewDoc.receipt_status !== 'Đã tiếp nhận' && (
                        <button 
                          type="button" 
                          className="btn btn-success fw-bold px-4 py-2 rounded-3 shadow-sm d-inline-flex align-items-center gap-1.5"
                          style={{ backgroundColor: '#16A34A', borderColor: '#16A34A' }}
                          onClick={(e) => handleConfirmReceipt(previewDoc, e)}
                        >
                          <CheckCircle2 size={16} />
                          <span>Xác nhận tiếp nhận văn bản này</span>
                        </button>
                      )}
                    </>
                  ) : (
                    /* Chi đoàn User View: Check if current branch has confirmed receipt */
                    (() => {
                      const myBranch = currentUser?.full_name || currentUser?.branch_name || 'Chi đoàn Ấp';
                      const myViewRecord = (previewDoc.viewed_by || []).find(v => 
                        v.branch_name === myBranch || 
                        v.branch_name?.includes(myBranch) || 
                        myBranch.includes(v.branch_name)
                      );
                      const hasConfirmed = !!myViewRecord;

                      if (hasConfirmed) {
                        return (
                          <button 
                            type="button" 
                            disabled
                            className="btn btn-light border text-success fw-bold px-4 py-2 rounded-3 d-inline-flex align-items-center gap-1.5 shadow-none"
                            style={{ backgroundColor: '#f0fdf4', borderColor: '#bbf7d0', cursor: 'not-allowed', pointerEvents: 'none' }}
                          >
                            <CheckCircle2 size={16} className="text-success" />
                            <span>✓ Đã xác nhận tiếp nhận lúc {myViewRecord.viewed_at}</span>
                          </button>
                        );
                      }

                      return (
                        <button 
                          type="button" 
                          className="btn btn-success fw-bold px-4 py-2 rounded-3 shadow-sm d-inline-flex align-items-center gap-1.5 hover-scale"
                          style={{ backgroundColor: '#16A34A', borderColor: '#16A34A' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRecordDocView(previewDoc, myBranch);
                          }}
                        >
                          <CheckCircle2 size={16} />
                          <span>Xác nhận tiếp nhận văn bản này</span>
                        </button>
                      );
                    })()
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Nộp Văn Bản Cho Công Việc TODO (Chi đoàn) */}
      {submittingTask && (
        <div className="modal d-block bg-dark bg-opacity-50" style={{ zIndex: 1085 }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 rounded-4 shadow-lg">
              <div className="modal-header border-bottom pb-3">
                <h5 className="modal-title fw-bold text-dark d-flex align-items-center gap-2" style={{ fontSize: '16.5px' }}>
                  <Upload className="text-primary" size={22} />
                  <span>Nộp Văn Bản / Báo Cáo Cho Công Việc TODO</span>
                </h5>
                <button type="button" className="btn-close" onClick={() => setSubmittingTask(null)}></button>
              </div>
              <form onSubmit={handleSubmitTaskDoc}>
                <div className="modal-body p-4">
                  <div className="alert bg-primary-subtle border border-primary-subtle rounded-3 p-3 mb-3">
                    <div className="fw-bold text-primary mb-1" style={{ fontSize: '14px' }}>
                      📋 Nhiệm vụ TODO: {submittingTask.display_title}
                    </div>
                    <div className="text-secondary" style={{ fontSize: '12.5px' }}>
                      {submittingTask.display_summary}
                    </div>
                    <div className="mt-2 text-dark fw-semibold" style={{ fontSize: '12px' }}>
                      📅 Hạn nộp: <span className="text-danger">{submittingTask.display_date}</span>
                      <span className="ms-3 text-muted">📌 Đơn vị thực hiện: {submittingTask.source_branch}</span>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold" style={{ fontSize: '13px' }}>
                      Đơn vị nộp báo cáo <span className="text-danger">*</span>
                    </label>
                    <input 
                      type="text" 
                      className="form-control bg-light fw-bold text-dark" 
                      value={currentUser?.full_name || currentUser?.branch_name || 'Chi đoàn Ấp'} 
                      readOnly 
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold text-primary d-flex align-items-center gap-1.5" style={{ fontSize: '13px' }}>
                      <Upload size={15} />
                      <span>Tải tệp văn bản/báo cáo lên (PDF, DOCX, XLSX, Ảnh...) <span className="text-danger">*</span></span>
                    </label>
                    <input 
                      type="file" 
                      className="form-control" 
                      accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.xlsx" 
                      required={!submittingTask.is_submitted}
                      onChange={async (e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setTaskDocFile(file);
                          setIsUploadingTaskDoc(true);
                          const res = await uploadPdfWithFailover(file);
                          setIsUploadingTaskDoc(false);
                          setTaskDocUploadStatus(res);
                          setTaskDocFormData(prev => ({
                            ...prev,
                            file_name: file.name,
                            file_url: res.file_url
                          }));
                        }
                      }}
                    />
                    {isUploadingTaskDoc && (
                      <div className="text-primary mt-1 fw-semibold" style={{ fontSize: '12px' }}>
                        ⏳ Đang tải tệp lên hệ thống...
                      </div>
                    )}
                    {(taskDocFile || taskDocFormData.file_name) && (
                      <div className="d-flex align-items-center justify-content-between p-2 bg-success-subtle rounded-2 border mt-2">
                        <div className="d-flex align-items-center gap-2">
                          <FileText size={16} className="text-success" />
                          <span className="text-success fw-bold" style={{ fontSize: '12px' }}>
                            ✓ Tệp đã chọn: {taskDocFile?.name || taskDocFormData.file_name}
                          </span>
                        </div>
                        <button 
                          type="button" 
                          className="btn btn-sm btn-outline-danger py-0.5 px-2 rounded-2 fw-semibold d-inline-flex align-items-center gap-1"
                          style={{ fontSize: '11px' }}
                          title="Xóa tệp vừa chọn nếu bị sai"
                          onClick={() => {
                            setTaskDocFile(null);
                            setTaskDocUploadStatus(null);
                            setTaskDocFormData(prev => ({ ...prev, file_name: '', file_url: '' }));
                          }}
                        >
                          <Trash2 size={12} />
                          <span>Xóa file chọn sai</span>
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold" style={{ fontSize: '13px' }}>
                      Ghi chú / Nội dung nộp kèm (Tùy chọn)
                    </label>
                    <textarea 
                      className="form-control" 
                      rows="3" 
                      placeholder="Nhập ghi chú thêm cho Quản trị viên..."
                      value={taskDocFormData.notes}
                      onChange={(e) => setTaskDocFormData({ ...taskDocFormData, notes: e.target.value })}
                      style={{ fontSize: '13px' }}
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer border-top pt-3">
                  <button type="button" className="btn btn-light border text-secondary px-4 py-2 rounded-3 fw-semibold" onClick={() => setSubmittingTask(null)}>
                    Hủy
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary px-4 py-2 rounded-3 fw-bold shadow-sm d-inline-flex align-items-center gap-2"
                    style={{ backgroundColor: '#0066FF', border: 'none' }}
                    disabled={isUploadingTaskDoc}
                  >
                    <Send size={16} />
                    <span>Gửi văn bản cho Quản trị viên</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// 3. Full Submissions History Management View
export function SubmissionsView({ submissions = [], onOpenSubmitDoc, onDeleteSubmission, onOpenPreview }) {
  const [search, setSearch] = useState('');

  const filtered = submissions.filter(s => 
    s.title.toLowerCase().includes(search.toLowerCase()) || 
    (s.branch_name && s.branch_name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="content-card">
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-4 gap-3 border-bottom pb-3">
        <div>
          <h3 className="card-title-header mb-1 d-flex align-items-center gap-2">
            <FileSpreadsheet className="text-primary" size={24} />
            Lịch sử Nộp Báo cáo & Văn bản
          </h3>
          <div className="text-secondary" style={{ fontSize: '13px' }}>
            Theo dõi tình hình nộp báo cáo định kỳ của 56 Chi đoàn trực thuộc Đoàn xã
          </div>
        </div>

        {onOpenSubmitDoc && (
          <button 
            className="btn btn-success d-flex align-items-center gap-2 px-3 py-2 fw-semibold rounded-3 shadow-sm"
            onClick={onOpenSubmitDoc}
          >
            <Send size={16} />
            <span>Nộp báo cáo mới</span>
          </button>
        )}
      </div>

      <div className="d-flex align-items-center justify-content-between mb-3 gap-3">
        <div className="fw-semibold text-dark" style={{ fontSize: '14px' }}>
          Tổng số báo cáo đã nộp ({filtered.length})
        </div>

        <div className="input-group" style={{ maxWidth: '320px' }}>
          <span className="input-group-text bg-light border-end-0"><Search size={15} className="text-secondary" /></span>
          <input 
            type="text" 
            className="form-control bg-light border-start-0 ps-0" 
            placeholder="Tìm tên báo cáo, tên ấp..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ fontSize: '13px' }}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="p-5 bg-light rounded-3 text-center border my-3">
          <div className="p-3 bg-white d-inline-block rounded-circle shadow-sm mb-3 text-success">
            <FileSpreadsheet size={32} />
          </div>
          <h5 className="fw-bold text-dark mb-1">Chưa có lịch sử nộp báo cáo</h5>
          <p className="text-secondary mb-3" style={{ fontSize: '13px' }}>
            Các tệp báo cáo PDF được Chi đoàn Ấp nộp lên Đoàn xã sẽ tự động lưu vết tại đây.
          </p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="custom-table align-middle">
            <thead>
              <tr>
                <th>Tên báo cáo / Văn bản</th>
                <th>Đơn vị nộp</th>
                <th>Thời gian nộp</th>
                <th>Trạng thái</th>
                <th>Tệp báo cáo</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id}>
                  <td className="fw-bold text-dark">{s.title}</td>
                  <td className="fw-semibold text-primary">{s.branch_name || 'Chi đoàn Ấp'}</td>
                  <td className="text-secondary">{s.sub_date || 'Hôm nay'}</td>
                  <td>
                    {s.receipt_status === 'Đã tiếp nhận' || s.status === 'Đã tiếp nhận' || s.admin_received ? (
                      <div>
                        <span className="badge bg-success text-white border border-success px-2.5 py-1 fw-bold shadow-xs" style={{ fontSize: '11px' }}>
                          ✓ Quản trị viên đã tiếp nhận
                        </span>
                        <div className="text-success fw-bold mt-0.5" style={{ fontSize: '10.5px' }}>
                          lúc {s.admin_receipt_time || s.submitted_at || s.sub_date}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <span className="badge bg-success-subtle text-success border border-success-subtle px-2.5 py-1 fw-bold" style={{ fontSize: '11px' }}>
                          🟢 Đã nộp - Chờ tiếp nhận
                        </span>
                        <div className="text-muted mt-0.5" style={{ fontSize: '10.5px' }}>
                          lúc {s.submitted_at || s.sub_date || 'Vừa xong'}
                        </div>
                      </div>
                    )}
                  </td>
                  <td>
                    {s.file_url || s.file_name ? (
                      <a 
                        href={s.file_url || `/${s.file_name}`} 
                        download={s.file_name || 'Bao_Cao.pdf'}
                        target="_blank" 
                        rel="noreferrer" 
                        className="btn btn-sm btn-outline-success d-inline-flex align-items-center gap-1"
                      >
                        <Download size={13} /> {s.file_name || 'Tải tệp'}
                      </a>
                    ) : (
                      <span className="text-muted" style={{ fontSize: '11px' }}>Không có tệp</span>
                    )}
                  </td>
                  <td>
                    <div className="d-inline-flex align-items-center gap-1.5">
                      {onOpenPreview && (
                        <button 
                          className="btn btn-sm btn-outline-info d-inline-flex align-items-center gap-1 px-2.5 py-1 rounded-2 fw-semibold"
                          style={{ fontSize: '11.5px' }}
                          title="Xem trước báo cáo"
                          onClick={() => onOpenPreview(s)}
                        >
                          <Eye size={12} />
                          <span>Xem trước</span>
                        </button>
                      )}
                      {onDeleteSubmission && (
                        <button 
                          className="btn btn-sm btn-outline-danger d-inline-flex align-items-center gap-1 px-2 py-1 rounded-2 fw-semibold"
                          style={{ fontSize: '11.5px' }}
                          title="Xóa tệp báo cáo do chọn sai file"
                          onClick={() => {
                            if (window.confirm(`Bạn có chắc chắn muốn xóa file nộp "${s.file_name || s.title}" do đưa sai file không?`)) {
                              onDeleteSubmission(s.id, s.title);
                            }
                          }}
                        >
                          <Trash2 size={12} />
                          <span>Xóa file</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// 4. Full Notifications Management View
export function NotificationsView({ notifications = [], onOpenSendMessage, onEditNotification, onDeleteNotification, isDoanXa, onConfirmReceipt, currentUser }) {
  const [filterPriority, setFilterPriority] = useState('ALL');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const sorted = sortNotificationsByPriority(notifications);

  const filtered = sorted.filter(n => {
    const p = String(n.priority || '').toLowerCase();
    let matchesPriority = true;
    if (filterPriority === 'urgent') matchesPriority = p.includes('khẩn') || p.includes('cao');
    else if (filterPriority === 'medium') matchesPriority = p.includes('trung bình');
    else if (filterPriority === 'normal') matchesPriority = !p.includes('khẩn') && !p.includes('trung');

    const matchesSearch = n.title.toLowerCase().includes(search.toLowerCase()) || 
                          (n.content && n.content.toLowerCase().includes(search.toLowerCase()));
    return matchesPriority && matchesSearch;
  });

  const countUrgent = notifications.filter(n => (n.priority || '').toLowerCase().includes('khẩn')).length;
  const countMedium = notifications.filter(n => (n.priority || '').toLowerCase().includes('trung')).length;
  const countNormal = notifications.filter(n => !(n.priority || '').toLowerCase().includes('khẩn') && !(n.priority || '').toLowerCase().includes('trung')).length;

  return (
    <div className="content-card bg-light bg-opacity-25 border-0 p-4">
      {/* Top Header Card matching Screenshot 1 */}
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-4 gap-3 bg-white p-4 rounded-4 shadow-sm border">
        <div className="d-flex align-items-center gap-3">
          <div className="p-3 bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '56px', height: '56px' }}>
            <Bell size={28} />
          </div>
          <div>
            <h3 className="fw-bold text-dark mb-1" style={{ fontSize: '20px' }}>
              Quản lý Thông báo & Tin tức Điều hành
            </h3>
            <div className="text-secondary" style={{ fontSize: '13px' }}>
              Hệ thống tự động sắp xếp ưu tiên theo mức độ quan trọng
            </div>
            
            {/* Legend strip: 🔥 Khẩn cấp ➔ ⚡ Trung bình ➔ 🟢 Bình thường */}
            <div className="d-inline-flex align-items-center gap-2.5 px-3 py-1.5 bg-white border rounded-pill shadow-xs mt-2" style={{ fontSize: '12.5px', fontWeight: 600 }}>
              <span style={{ color: '#DC2626' }}>🔥 Khẩn cấp</span>
              <span className="text-muted">➔</span>
              <span style={{ color: '#D97706' }}>⚡ Trung bình</span>
              <span className="text-muted">➔</span>
              <span style={{ color: '#16A34A' }}>🟢 Bình thường</span>
            </div>
          </div>
        </div>

        {isDoanXa && (
          <button 
            className="btn btn-primary d-flex align-items-center gap-2 px-4 py-2.5 fw-semibold rounded-3 shadow-sm flex-shrink-0"
            style={{ backgroundColor: '#0066FF', border: 'none', fontSize: '14px' }}
            onClick={() => onOpenSendMessage && onOpenSendMessage()}
          >
            <Send size={18} />
            <span>Gửi thông báo / Tin nhắn</span>
          </button>
        )}
      </div>

      {/* Control / Filter Bar matching Screenshot 1 */}
      <div className="d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-3 mb-4 bg-white p-3 rounded-4 border shadow-sm">
        {/* Priority Filter Pills */}
        <div className="d-flex align-items-center gap-2 flex-wrap">
          <button 
            className={`btn ${filterPriority === 'ALL' ? 'btn-primary shadow-sm' : 'btn-light border'} rounded-pill px-3 py-1.5 fw-semibold`}
            style={{ fontSize: '13px', backgroundColor: filterPriority === 'ALL' ? '#0066FF' : undefined }}
            onClick={() => setFilterPriority('ALL')}
          >
            Tất cả <span className={`badge ${filterPriority === 'ALL' ? 'bg-white text-primary' : 'bg-secondary-subtle text-dark'} rounded-pill ms-1`}>{notifications.length}</span>
          </button>
          <button 
            className={`btn ${filterPriority === 'urgent' ? 'btn-primary shadow-sm' : 'btn-light border'} rounded-pill px-3 py-1.5 fw-semibold`}
            style={{ fontSize: '13px', backgroundColor: filterPriority === 'urgent' ? '#0066FF' : undefined }}
            onClick={() => setFilterPriority('urgent')}
          >
            🔥 Khẩn cấp <span className={`badge ${filterPriority === 'urgent' ? 'bg-white text-primary' : 'bg-secondary-subtle text-dark'} rounded-pill ms-1`}>{countUrgent}</span>
          </button>
          <button 
            className={`btn ${filterPriority === 'medium' ? 'btn-primary shadow-sm' : 'btn-light border'} rounded-pill px-3 py-1.5 fw-semibold`}
            style={{ fontSize: '13px', backgroundColor: filterPriority === 'medium' ? '#0066FF' : undefined }}
            onClick={() => setFilterPriority('medium')}
          >
            ⚡ Trung bình <span className={`badge ${filterPriority === 'medium' ? 'bg-white text-primary' : 'bg-secondary-subtle text-dark'} rounded-pill ms-1`}>{countMedium}</span>
          </button>
          <button 
            className={`btn ${filterPriority === 'normal' ? 'btn-primary shadow-sm' : 'btn-light border'} rounded-pill px-3 py-1.5 fw-semibold`}
            style={{ fontSize: '13px', backgroundColor: filterPriority === 'normal' ? '#0066FF' : undefined }}
            onClick={() => setFilterPriority('normal')}
          >
            🟢 Bình thường <span className={`badge ${filterPriority === 'normal' ? 'bg-white text-primary' : 'bg-secondary-subtle text-dark'} rounded-pill ms-1`}>{countNormal}</span>
          </button>
        </div>

        {/* Search & Sort Controls */}
        <div className="d-flex align-items-center gap-2 ms-auto">
          <div className="input-group" style={{ maxWidth: '240px' }}>
            <input 
              type="text" 
              className="form-control bg-light border-end-0 ps-3" 
              placeholder="Tìm kiếm thông báo..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ fontSize: '13px' }}
            />
            <span className="input-group-text bg-light border-start-0 text-secondary"><Search size={16} /></span>
          </div>

          <select 
            className="form-select bg-light border text-dark fw-semibold" 
            style={{ fontSize: '13px', width: 'auto' }}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Mới nhất</option>
            <option value="priority">Ưu tiên cao nhất</option>
          </select>

          <button className="btn btn-light border p-2 rounded-3 text-secondary" title="Bộ lọc nâng cao">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* Notifications List Items matching Screenshot 1 */}
      {filtered.length === 0 ? (
        <div className="p-5 bg-white rounded-4 text-center border shadow-sm my-3">
          <div className="p-3 bg-light d-inline-block rounded-circle mb-3 text-warning">
            <Bell size={32} />
          </div>
          <h5 className="fw-bold text-dark mb-1">Chưa có thông báo nào trong hệ thống</h5>
          <p className="text-secondary mb-3" style={{ fontSize: '13px' }}>
            Bấm nút "Gửi thông báo / Tin nhắn" ở trên để gửi tin tức điều hành tới Đoàn xã và 56 Chi đoàn / Đơn vị trực thuộc.
          </p>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {filtered.map((n) => {
            const badge = getPriorityBadgeStyle(n.priority);
            
            // Extract activity or notification details
            const timeVal = n.activity_details?.time || n.time || '08:00 - 11:30';
            const dateVal = formatDateDDMMYYYY(n.activity_details || n.date);
            const locationVal = n.activity_details?.location || n.location || '';
            const notesVal = n.activity_details?.notes || n.notes || (
              n.target_scope 
                ? (n.target_scope.includes('30') || n.target_scope.includes('Dân cư') 
                    ? 'Đề nghị 56 Chi đoàn triển khai tham gia đầy đủ và đúng thời gian quy định.' 
                    : `Đề nghị ${n.target_scope} triển khai thực hiện đầy đủ và đúng thời gian quy định.`)
                : 'Đề nghị các đơn vị triển khai thực hiện đầy đủ và đúng thời gian quy định.'
            );

            return (
              <div 
                key={n.id} 
                className="p-4 rounded-4 bg-white border shadow-sm position-relative hover-shadow transition"
                style={{ borderLeft: `5px solid ${badge.borderColor || '#22C55E'}` }}
              >
                {/* Header row */}
                <div className="d-flex align-items-start justify-content-between mb-3">
                  <div className="d-flex align-items-center gap-3">
                    <div 
                      className="p-3 rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                      style={{ backgroundColor: badge.bg.includes('danger') ? '#FEE2E2' : badge.bg.includes('warning') ? '#FEF3C7' : '#DCFCE7', color: badge.color }}
                    >
                      <Bell size={22} />
                    </div>
                    <div>
                      <h5 className="fw-bold text-dark mb-1" style={{ fontSize: '16px' }}>
                        {n.title}
                      </h5>
                      <div className="text-secondary" style={{ fontSize: '13.5px' }}>
                        {n.content}
                      </div>
                    </div>
                  </div>

                  <div className="d-flex align-items-center gap-2 flex-shrink-0">
                    <span 
                      className={`badge ${badge.bg} border px-3 py-1.5 rounded-pill`} 
                      style={{ fontSize: '12px', fontWeight: 600 }}
                    >
                      {badge.label}
                    </span>
                    <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-1.5 rounded-pill" style={{ fontSize: '12px', fontWeight: 600 }}>
                      {n.time_ago || 'Vừa xong'}
                    </span>
                    <div className="dropdown">
                      <button className="btn btn-link text-secondary p-1 border-0" type="button" data-bs-toggle="dropdown">
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Grid details (Thời gian, Ngày tháng, Địa điểm) */}
                <div className="row g-3 my-2 px-2 py-2.5 bg-light rounded-3 border-0" style={{ fontSize: '13px' }}>
                  <div className="col-12 col-md-4 d-flex align-items-center gap-2">
                    <Clock size={16} className="text-primary flex-shrink-0" />
                    <span className="fw-semibold text-dark">Thời gian:</span>
                    <span className="text-secondary">{timeVal}</span>
                  </div>
                  <div className="col-12 col-md-4 d-flex align-items-center gap-2">
                    <Calendar size={16} className="text-primary flex-shrink-0" />
                    <span className="fw-semibold text-dark">Ngày tháng:</span>
                    <span className="text-secondary">{dateVal}</span>
                  </div>
                  <div className="col-12 col-md-4 d-flex align-items-center gap-2">
                    <MapPin size={16} className="text-danger flex-shrink-0" />
                    <span className="fw-semibold text-dark">Địa điểm:</span>
                    <span className="text-secondary">{locationVal}</span>
                  </div>
                </div>

                <div className="text-secondary mt-2 mb-3" style={{ fontSize: '13px' }}>
                  {notesVal}
                </div>

                {/* Footer scope & Action buttons matching Screenshot 1 */}
                <div className="p-2.5 px-3 rounded-3 bg-primary-subtle bg-opacity-25 d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-2 border border-primary-subtle">
                  <div className="d-flex align-items-center gap-2 text-primary fw-bold" style={{ fontSize: '13px' }}>
                    <Send size={15} />
                    <span>Gửi đến: {n.target_scope || 'Tất cả 56 Chi đoàn / Đơn vị'}</span>
                  </div>

                  <div className="d-flex align-items-center gap-2 ms-auto flex-wrap">
                    <ReceiptConfirmationBox 
                      type="notification" 
                      item={n} 
                      currentRole={currentUser} 
                      isDoanXa={isDoanXa} 
                      onConfirmReceipt={onConfirmReceipt} 
                    />

                    {isDoanXa && (
                      <>
                        <button 
                          className="btn btn-sm btn-white bg-white border border-primary text-primary fw-semibold px-3 py-1.5 rounded-3 d-inline-flex align-items-center gap-1.5 shadow-xs"
                          style={{ fontSize: '12.5px' }}
                          onClick={() => onEditNotification && onEditNotification(n)}
                        >
                          <Edit3 size={14} />
                          <span>Chỉnh sửa</span>
                        </button>

                        <button 
                          className="btn btn-sm btn-white bg-white border border-danger text-danger fw-semibold px-3 py-1.5 rounded-3 d-inline-flex align-items-center gap-1.5 shadow-xs"
                          style={{ fontSize: '12.5px' }}
                          onClick={() => {
                            if (window.confirm(`Bạn có chắc chắn muốn xóa thông báo "${n.title}" không?`)) {
                              onDeleteNotification && onDeleteNotification(n.id, n.title);
                            }
                          }}
                        >
                          <Trash2 size={14} />
                          <span>Xóa</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Footer Bar matching Screenshot 1 */}
      <div className="d-flex flex-column flex-sm-row align-items-center justify-content-between gap-3 mt-4 pt-3 border-top text-secondary" style={{ fontSize: '13px' }}>
        <div>
          Hiển thị 1 - {filtered.length} trong {notifications.length} thông báo
        </div>
        <div className="d-flex align-items-center gap-1">
          <button className="btn btn-sm btn-light border px-2.5 py-1 text-muted" disabled style={{ borderRadius: '6px' }}>«</button>
          <button className="btn btn-sm btn-primary px-3 py-1 fw-bold" style={{ backgroundColor: '#0066FF', borderRadius: '6px' }}>1</button>
          <button className="btn btn-sm btn-light border px-2.5 py-1 text-muted" disabled style={{ borderRadius: '6px' }}>»</button>
        </div>
        <div className="d-flex align-items-center gap-2">
          <span>Hiển thị</span>
          <select className="form-select form-select-sm border text-dark fw-semibold" style={{ width: 'auto' }}>
            <option>10</option>
            <option>20</option>
            <option>50</option>
          </select>
          <span>trên trang</span>
        </div>
      </div>
    </div>
  );
}

// 5. Full Tasks & Todo Management View (Fully Synced with Supabase Realtime)
export function TasksView({ 
  tasks = [], 
  onOpenCreateTask, 
  onToggleTask, 
  onDeleteTask, 
  isDoanXa, 
  currentUser, 
  onConfirmReceipt,
  onCompleteTask 
}) {
  return (
    <div className="content-card">
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-4 gap-3 border-bottom pb-3">
        <div>
          <h3 className="card-title-header d-flex align-items-center gap-2 mb-1">
            <CheckSquare className="text-primary" size={24} />
            <span>Quản lý Công việc & Nhiệm vụ (Todo List)</span>
          </h3>
          <p className="text-secondary mb-0" style={{ fontSize: '13px' }}>
            Phân công, giao nhiệm vụ và kiểm soát tiến độ thực hiện công tác Đoàn
          </p>
        </div>

        {isDoanXa && (
          <button 
            type="button"
            className="btn btn-primary d-inline-flex align-items-center gap-2 px-3.5 py-2 rounded-3 fw-semibold shadow-sm hover-scale"
            style={{ backgroundColor: '#0066FF', borderColor: '#0066FF' }}
            onClick={onOpenCreateTask}
          >
            <Plus size={18} />
            <span>Giao nhiệm vụ / Thêm công việc</span>
          </button>
        )}
      </div>

      {/* Task List Columns */}
      <div className="row g-3">
        {/* Column 1: Chờ thực hiện */}
        <div className="col-12 col-md-4">
          <div className="p-3 bg-light rounded-3 border h-100">
            <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
              <span className="fw-bold text-dark" style={{ fontSize: '13.5px' }}>⏳ Cần làm ({tasks.filter(t => t.status === 'todo').length})</span>
              <span className="badge bg-secondary-subtle text-secondary">To Do</span>
            </div>
            <div className="d-flex flex-column gap-2">
              {tasks.filter(t => t.status === 'todo').map(t => (
                <div key={t.id} className="p-2.5 bg-white rounded-2 border shadow-sm position-relative">
                  <div className="d-flex align-items-start gap-2">
                    <button className="btn btn-link p-0 text-secondary" onClick={() => onToggleTask && onToggleTask(t.id, 'completed')}>
                      <Circle size={18} />
                    </button>
                    <div className="flex-grow-1">
                      <div className="fw-bold text-dark pe-3" style={{ fontSize: '12.5px' }}>{t.title}</div>
                      <div className="text-muted d-flex flex-wrap align-items-center gap-1.5 mt-1" style={{ fontSize: '10.5px' }}>
                        <span>Hạn: {formatDeadlineDisplay(t.dueDate || t.due_date || 'Hôm nay')}</span>
                        <TaskCountdown dueDate={t.dueDate || t.due_date} status={t.status} compact={true} />
                        {t.assigned_to && (
                          <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-1.5 py-0.5">📌 {t.assigned_to}</span>
                        )}
                      </div>
                    </div>
                    {isDoanXa && (
                      <button 
                        className="btn btn-link text-danger p-0 ms-1 flex-shrink-0"
                        title="Thu hồi / Xóa nhiệm vụ"
                        onClick={() => {
                          if (window.confirm(`Bạn có chắc chắn muốn xóa nhiệm vụ "${t.title}" không?`)) {
                            onDeleteTask && onDeleteTask(t.id, t.title);
                          }
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                  <div className="mt-2 pt-1 border-top d-flex justify-content-end">
                    <ReceiptConfirmationBox 
                      type="task" 
                      item={t} 
                      currentRole={currentUser} 
                      isDoanXa={isDoanXa} 
                      onConfirmReceipt={onConfirmReceipt} 
                      onCompleteTask={onCompleteTask}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Column 2: Đang thực hiện */}
        <div className="col-12 col-md-4">
          <div className="p-3 bg-light rounded-3 border h-100">
            <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
              <span className="fw-bold text-primary" style={{ fontSize: '13.5px' }}>🔄 Đang tiến hành ({tasks.filter(t => t.status === 'inProgress' || t.status === 'in_progress').length})</span>
              <span className="badge bg-primary-subtle text-primary">In Progress</span>
            </div>
            <div className="d-flex flex-column gap-2">
              {tasks.filter(t => t.status === 'inProgress' || t.status === 'in_progress').map(t => (
                <div key={t.id} className="p-2.5 bg-white rounded-2 border shadow-sm position-relative">
                  <div className="d-flex align-items-start gap-2">
                    <button className="btn btn-link p-0 text-primary" onClick={() => onToggleTask && onToggleTask(t.id, 'completed')}>
                      <Circle size={18} />
                    </button>
                    <div className="flex-grow-1">
                      <div className="fw-bold text-dark pe-3" style={{ fontSize: '12.5px' }}>{t.title}</div>
                      <div className="text-muted d-flex flex-wrap align-items-center gap-1.5 mt-1" style={{ fontSize: '10.5px' }}>
                        <span>Hạn: {formatDeadlineDisplay(t.dueDate || t.due_date || 'Hôm nay')}</span>
                        <TaskCountdown dueDate={t.dueDate || t.due_date} status={t.status} compact={true} />
                        <span className="badge bg-warning-subtle text-warning border border-warning-subtle px-1.5 py-0.5">Ưu tiên: {t.priority}</span>
                        {t.assigned_to && (
                          <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-1.5 py-0.5">📌 {t.assigned_to}</span>
                        )}
                      </div>
                    </div>
                    {isDoanXa && (
                      <button 
                        className="btn btn-link text-danger p-0 ms-1 flex-shrink-0"
                        title="Thu hồi / Xóa nhiệm vụ"
                        onClick={() => {
                          if (window.confirm(`Bạn có chắc chắn muốn xóa nhiệm vụ "${t.title}" không?`)) {
                            onDeleteTask && onDeleteTask(t.id, t.title);
                          }
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                  <div className="mt-2 pt-1 border-top d-flex justify-content-end">
                    <ReceiptConfirmationBox 
                      type="task" 
                      item={t} 
                      currentRole={currentUser} 
                      isDoanXa={isDoanXa} 
                      onConfirmReceipt={onConfirmReceipt} 
                      onCompleteTask={onCompleteTask}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Column 3: Đã hoàn thành */}
        <div className="col-12 col-md-4">
          <div className="p-3 bg-light rounded-3 border h-100">
            <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
              <span className="fw-bold text-success" style={{ fontSize: '13.5px' }}>✅ Đã hoàn thành ({tasks.filter(t => t.status === 'completed').length})</span>
              <span className="badge bg-success-subtle text-success">Done</span>
            </div>
            <div className="d-flex flex-column gap-2">
              {tasks.filter(t => t.status === 'completed').map(t => (
                <div key={t.id} className="p-2.5 bg-white rounded-2 border shadow-sm position-relative">
                  <div className="d-flex align-items-start gap-2">
                    <button className="btn btn-link p-0 text-success" onClick={() => onToggleTask && onToggleTask(t.id, 'todo')}>
                      <CheckCircle2 size={18} />
                    </button>
                    <div className="flex-grow-1 text-decoration-line-through text-muted">
                      <div className="fw-semibold text-muted pe-3" style={{ fontSize: '12.5px' }}>{t.title}</div>
                      <div className="text-success d-flex flex-wrap align-items-center gap-1.5 mt-1" style={{ fontSize: '10.5px' }}>
                        <TaskCountdown dueDate={t.dueDate || t.due_date} status="completed" compact={true} />
                        {t.assigned_to && (
                          <span className="badge bg-success-subtle text-success border border-success-subtle px-1.5 py-0.5">📌 {t.assigned_to}</span>
                        )}
                      </div>
                    </div>
                    {isDoanXa && (
                      <button 
                        className="btn btn-link text-danger p-0 ms-1 flex-shrink-0 text-decoration-none"
                        title="Thu hồi / Xóa nhiệm vụ"
                        onClick={() => {
                          if (window.confirm(`Bạn có chắc chắn muốn xóa nhiệm vụ "${t.title}" không?`)) {
                            onDeleteTask && onDeleteTask(t.id, t.title);
                          }
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>

                  {/* Hiển thị chi đoàn nào đã hoàn thành kèm ngày giờ cho Admin & mọi người nắm được */}
                  {t.completedBy && t.completedBy.length > 0 && (
                    <div className="mt-2 pt-1 border-top d-flex flex-wrap gap-1">
                      {t.completedBy.map((c, idx) => (
                        <span 
                          key={idx} 
                          className="badge bg-success-subtle text-success border border-success-subtle px-2 py-0.5 rounded-pill d-inline-flex align-items-center gap-1" 
                          style={{ fontSize: '10.5px', fontWeight: 650 }}
                        >
                          <span>🎉</span>
                          <span>{typeof c === 'object' ? `${c.branch}: ${c.time}` : c}</span>
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-2 pt-1 border-top d-flex justify-content-end">
                    <ReceiptConfirmationBox 
                      type="task" 
                      item={t} 
                      currentRole={currentUser} 
                      isDoanXa={isDoanXa} 
                      onConfirmReceipt={onConfirmReceipt} 
                      onCompleteTask={onCompleteTask}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


// 6. Full Reports & Analytics View (Featuring Attendance & Rating Evaluation System)
export function ReportsView({ 
  activitiesCount = 0, 
  docsCount = 0, 
  submissionsCount = 0,
  activities = [],
  attendanceRecords = {},
  setActiveTab,
  onOpenAttendanceModal,
  onRespondAttendance,
  isDoanXa
}) {
  const [selectedCluster, setSelectedCluster] = useState('ALL');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedBranchDetail, setSelectedBranchDetail] = useState(null);

  // Lọc danh sách hoạt động thực tế (loại bỏ dữ liệu test ảo cũ)
  const safeActivities = (Array.isArray(activities) ? activities : [])
    .filter(a => a && !String(a.id || '').startsWith('act-seed-') && (!a.title || !a.title.includes('Hội nghị Học tập & Quán triệt')));

  const hasActivities = safeActivities.length > 0;

  // Tính toán kết quả thi đua & tỷ lệ % tham gia của từng Chi đoàn dựa trên quét mã QR hoặc nhập mã Code
  const branchStats = (ALL_BRANCHES || []).map(branch => {
    if (!branch) return null;
    const branchName = branch.name || '';
    const cleanBranch = branchName.replace(/^Chi đoàn\s*/i, '').trim();
    const clusterName = getBranchClusterName(branchName);

    let attendedCount = 0;
    let absentCount = 0;
    let unrespondedCount = 0;
    let totalAssigned = 0;

    const assignedActivities = safeActivities.filter(act => 
      act && isItemTargetedToUser(act.assigned_to, { role: 'chi_doan', branch_name: branchName })
    );

    totalAssigned = assignedActivities.length;

    const activityDetailsList = assignedActivities.map(act => {
      if (!act) return null;
      const actAttendance = (attendanceRecords && act.id) 
        ? (attendanceRecords[act.id] || attendanceRecords[String(act.id)] || {}) 
        : {};

      // 1. Kiểm tra trong attendanceRecords
      let branchRec = actAttendance[branchName];
      if (!branchRec) {
        for (const [k, v] of Object.entries(actAttendance)) {
          if (k === branchName || k.replace(/^Chi đoàn\s*/i, '').trim() === cleanBranch || k.includes(cleanBranch)) {
            branchRec = v;
            break;
          }
        }
      }

      // 2. Kiểm tra trong Nhật ký GPS Audit Logs (lưu vết khi quét camera QR hoặc nhập mã code XTS-XXXXXX)
      const gpsLogs = typeof getActivityGpsAuditLogs === 'function' ? getActivityGpsAuditLogs(act.id) : [];
      const matchGps = gpsLogs.find(l => 
        l && (l.branch_name === branchName || l.branch_name?.replace(/^Chi đoàn\s*/i, '').trim() === cleanBranch || l.branch_name?.includes(cleanBranch))
      );

      // 3. Kiểm tra trong confirmedBy & absentBy của hoạt động
      const confirmedList = Array.isArray(act.confirmedBy) ? act.confirmedBy : [];
      const absentList = Array.isArray(act.absentBy) ? act.absentBy : [];

      const matchConf = confirmedList.find(c => {
        const bName = typeof c === 'string' ? c : c?.branch;
        return bName && (bName === branchName || bName.replace(/^Chi đoàn\s*/i, '').trim() === cleanBranch || bName.includes(cleanBranch));
      });

      const matchAbs = absentList.find(a => {
        const bName = typeof a === 'string' ? a : a?.branch;
        return bName && (bName === branchName || bName.replace(/^Chi đoàn\s*/i, '').trim() === cleanBranch || bName.includes(cleanBranch));
      });

      let status = 'UNRESPONDED'; // 'ATTENDED' | 'ABSENT' | 'UNRESPONDED'
      let time = '';
      let reason = '';
      let checkinMethod = '';
      let gpsCoords = null;
      let photoProof = null;

      if (matchGps) {
        status = 'ATTENDED';
        time = matchGps.time_str || 'Đã xác nhận';
        checkinMethod = matchGps.verified_by === 'CAMERA_QR' ? '📷 Quét mã QR Camera' : '⌨️ Nhập mã xác thực (XTS-XXXXXX)';
        if (matchGps.latitude && matchGps.longitude) {
          gpsCoords = `${matchGps.latitude.toFixed(5)}, ${matchGps.longitude.toFixed(5)}`;
        }
        photoProof = matchGps.photo_url || null;
      } else if (branchRec !== undefined) {
        if (typeof branchRec === 'boolean') {
          if (branchRec) {
            status = 'ATTENDED';
            time = matchConf?.time || 'Đã xác nhận';
            checkinMethod = 'Xác thực điểm danh';
          } else {
            status = 'ABSENT';
            reason = 'Báo vắng';
          }
        } else if (typeof branchRec === 'object' && branchRec !== null) {
          if (branchRec.attended) {
            status = 'ATTENDED';
            time = branchRec.time || 'Đã xác nhận';
            checkinMethod = branchRec.method === 'CAMERA_QR' ? '📷 Quét mã QR Camera' : branchRec.method === 'MANUAL_CODE' ? '⌨️ Nhập mã xác thực' : 'Xác thực điểm danh';
            if (branchRec.latitude && branchRec.longitude) {
              gpsCoords = `${branchRec.latitude.toFixed(5)}, ${branchRec.longitude.toFixed(5)}`;
            }
            photoProof = branchRec.photo_url || null;
          } else {
            status = 'ABSENT';
            time = branchRec.time || 'Vừa xong';
            reason = branchRec.reason || 'Báo vắng';
          }
        }
      } else if (matchConf) {
        status = 'ATTENDED';
        time = matchConf.time || 'Đã xác nhận';
        checkinMethod = 'Xác thực điểm danh';
      } else if (matchAbs) {
        status = 'ABSENT';
        time = matchAbs.time || 'Vừa xong';
        reason = matchAbs.reason || 'Báo vắng';
      }

      if (status === 'ATTENDED') attendedCount += 1;
      else if (status === 'ABSENT') absentCount += 1;
      else unrespondedCount += 1;

      return {
        id: act.id,
        title: act.title || 'Hoạt động',
        day: act.day || '01',
        month: act.month || '01',
        year: act.year || 2026,
        timeStr: act.time || '08:00 - 11:30',
        location: act.location || 'Trụ sở UBND Xã',
        status,
        time,
        reason,
        checkinMethod,
        gpsCoords,
        photoProof
      };
    }).filter(Boolean);

    // Tính tỷ lệ %: Nếu chưa có hoạt động nào được ban hành thì tỷ lệ là null (chưa phát sinh)
    const percentage = totalAssigned > 0 ? Math.min(100, Math.round((attendedCount / totalAssigned) * 100)) : null;
    const rating = calculateBranchRating(percentage, totalAssigned);

    return {
      ...branch,
      id: branch.id || branchName,
      name: branchName,
      secretary_name: branch.secretary_name || 'Bí thư Chi đoàn',
      clusterName,
      attendedCount,
      absentCount,
      unrespondedCount,
      totalAssigned,
      activityDetailsList,
      percentage,
      rating
    };
  }).filter(Boolean);

  const filteredBranchStats = branchStats.filter(b => {
    if (!b) return false;
    const matchesCluster = selectedCluster === 'ALL' || b.clusterName === selectedCluster;
    const nameStr = String(b.name || '').toLowerCase();
    const secStr = String(b.secretary_name || '').toLowerCase();
    const kw = String(searchKeyword || '').toLowerCase();
    const matchesSearch = nameStr.includes(kw) || secStr.includes(kw);
    return matchesCluster && matchesSearch;
  });

  const activeBranchDetail = selectedBranchDetail ? branchStats.find(b => b && b.name === selectedBranchDetail.name) : null;

  // Thống kê 4 nhóm thi đua: Chỉ tính khi đã có hoạt động được ban hành
  const countExcellent = hasActivities ? branchStats.filter(b => b && b.totalAssigned > 0 && b.percentage !== null && b.percentage >= 90).length : 0;
  const countGood = hasActivities ? branchStats.filter(b => b && b.totalAssigned > 0 && b.percentage !== null && b.percentage >= 80 && b.percentage < 90).length : 0;
  const countFair = hasActivities ? branchStats.filter(b => b && b.totalAssigned > 0 && b.percentage !== null && b.percentage >= 50 && b.percentage < 80).length : 0;
  const countFailed = hasActivities ? branchStats.filter(b => b && b.totalAssigned > 0 && b.percentage !== null && b.percentage < 50).length : 0;

  return (
    <div className="reports-view">
      {/* Top Header Card */}
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
        <div>
          <h4 className="fw-bold text-dark d-flex align-items-center gap-2 mb-1" style={{ fontSize: '20px' }}>
            <BarChart2 className="text-primary" size={24} />
            Báo cáo Thống kê & Đánh giá Thi đua 56 Chi đoàn / Đơn vị
          </h4>
          <div className="text-secondary" style={{ fontSize: '13px' }}>
            Hệ thống tự động tính toán tỷ lệ % tham gia hoạt động dựa trên số hoạt động do Quản trị viên ban hành và kết quả điểm danh qua mã QR / Code.
          </div>
        </div>

        {isDoanXa && (
          <div className="d-flex align-items-center gap-2 flex-wrap">
            <button 
              type="button"
              className="btn btn-primary d-flex align-items-center gap-2 px-3 py-2 fw-semibold rounded-3 shadow-sm hover-scale"
              style={{ backgroundColor: '#0066FF', border: 'none', fontSize: '13px' }}
              onClick={() => {
                if (setActiveTab) setActiveTab('attendance');
                else onOpenAttendanceModal && onOpenAttendanceModal('qr');
              }}
              title="Mở giao diện Quản lý Điểm danh để tạo mã QR và mã Code XTS-XXXXXX"
            >
              <QrCode size={18} />
              <span>📱 Tạo Mã Điểm Danh QR & Code (XTS-XXXXXX)</span>
            </button>

            <button 
              type="button"
              className="btn btn-success d-flex align-items-center gap-2 px-3 py-2 fw-semibold rounded-3 shadow-sm hover-scale"
              style={{ backgroundColor: '#16A34A', border: 'none', fontSize: '13px' }}
              onClick={() => {
                if (setActiveTab) setActiveTab('attendance');
                else onOpenAttendanceModal && onOpenAttendanceModal('manual');
              }}
              title="Đến màn hình điểm danh & đánh giá hoạt động"
            >
              <CheckCircle2 size={18} />
              <span>⚡ Điểm danh & Đánh giá Hoạt động</span>
            </button>
          </div>
        )}
      </div>

      {/* Thông báo nếu chưa có hoạt động nào được ban hành */}
      {!hasActivities && (
        <div className="alert alert-info py-3 px-3.5 rounded-4 d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4 border-info shadow-xs">
          <div className="d-flex align-items-center gap-2.5">
            <Info size={22} className="text-primary flex-shrink-0" />
            <div style={{ fontSize: '13px' }}>
              <strong>Hiện chưa có hoạt động nào được ban hành điểm danh.</strong> Tỷ lệ % tham gia và kết quả xếp loại thi đua của 56 Chi đoàn sẽ được tự động tính toán tức thì ngay khi Quản trị viên ban hành hoạt động và các Chi đoàn tiến hành quét mã QR hoặc nhập mã xác thực (XTS-XXXXXX).
            </div>
          </div>
          {isDoanXa && (
            <button 
              type="button"
              className="btn btn-sm btn-primary px-3 py-1.5 rounded-3 fw-bold shadow-xs hover-scale"
              onClick={() => setActiveTab && setActiveTab('attendance')}
            >
              ➕ Tạo hoạt động & Điểm danh ngay
            </button>
          )}
        </div>
      )}

      {/* 4 Overview Metric Cards (Phản ánh số liệu thi đua chính xác) */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="p-3 bg-success-subtle border border-success-subtle rounded-3 h-100 shadow-xs">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-success fw-bold" style={{ fontSize: '13px' }}>
                🌟 Xuất sắc (90-100%)
              </span>
              <span className="badge bg-success text-white px-2 py-0.5" style={{ fontSize: '11px' }}>
                90 - 100%
              </span>
            </div>
            <div className="d-flex align-items-baseline gap-2 mb-1">
              <h3 className="fw-extrabold text-success mb-0">{countExcellent}</h3>
              <span className="text-secondary fw-semibold" style={{ fontSize: '13px' }}>Chi đoàn</span>
            </div>
            <div className="text-muted" style={{ fontSize: '11.5px' }}>
              {hasActivities ? 'Hoàn thành xuất sắc nhiệm vụ' : 'Chưa phát sinh hoạt động'}
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="p-3 bg-primary-subtle border border-primary-subtle rounded-3 h-100 shadow-xs">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-primary fw-bold" style={{ fontSize: '13px' }}>
                💙 Tốt (80 - dưới 90%)
              </span>
              <span className="badge bg-primary text-white px-2 py-0.5" style={{ fontSize: '11px' }}>
                80 - 89%
              </span>
            </div>
            <div className="d-flex align-items-baseline gap-2 mb-1">
              <h3 className="fw-extrabold text-primary mb-0">{countGood}</h3>
              <span className="text-secondary fw-semibold" style={{ fontSize: '13px' }}>Chi đoàn</span>
            </div>
            <div className="text-muted" style={{ fontSize: '11.5px' }}>
              {hasActivities ? 'Hoàn thành tốt nhiệm vụ' : 'Chưa phát sinh hoạt động'}
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="p-3 bg-warning-subtle border border-warning-subtle rounded-3 h-100 shadow-xs">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-warning-emphasis fw-bold" style={{ fontSize: '13px' }}>
                🟡 Hoàn thành (50 - dưới 80%)
              </span>
              <span className="badge bg-warning text-dark px-2 py-0.5" style={{ fontSize: '11px' }}>
                50 - 79%
              </span>
            </div>
            <div className="d-flex align-items-baseline gap-2 mb-1">
              <h3 className="fw-extrabold text-warning-emphasis mb-0">{countFair}</h3>
              <span className="text-secondary fw-semibold" style={{ fontSize: '13px' }}>Chi đoàn</span>
            </div>
            <div className="text-muted" style={{ fontSize: '11.5px' }}>
              {hasActivities ? 'Hoàn thành nhiệm vụ' : 'Chưa phát sinh hoạt động'}
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="p-3 bg-danger-subtle border border-danger-subtle rounded-3 h-100 shadow-xs">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-danger fw-bold" style={{ fontSize: '13px' }}>
                🔴 Chưa hoàn thành (&lt;50%)
              </span>
              <span className="badge bg-danger text-white px-2 py-0.5" style={{ fontSize: '11px' }}>
                &lt; 50%
              </span>
            </div>
            <div className="d-flex align-items-baseline gap-2 mb-1">
              <h3 className="fw-extrabold text-danger mb-0">{countFailed}</h3>
              <span className="text-secondary fw-semibold" style={{ fontSize: '13px' }}>Chi đoàn</span>
            </div>
            <div className="text-muted" style={{ fontSize: '11.5px' }}>
              {hasActivities ? 'Không hoàn thành nhiệm vụ' : 'Chưa phát sinh hoạt động'}
            </div>
          </div>
        </div>
      </div>

      {/* Ranking Standards Info Banner */}
      <div className="card border-0 shadow-xs rounded-4 p-3 mb-4 bg-light">
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-2">
          <div className="fw-bold text-dark d-flex align-items-center gap-2" style={{ fontSize: '13.5px' }}>
            <span>📌</span>
            <span>Tiêu chí Đánh giá & Xếp loại Thi đua theo Tỷ lệ % Tham gia Hoạt động:</span>
          </div>
          <span className="badge bg-white text-secondary border px-2.5 py-1" style={{ fontSize: '11px' }}>
            Tổng số: 56 Chi đoàn / Đơn vị
          </span>
        </div>
        <div className="d-flex align-items-center gap-2 flex-wrap" style={{ fontSize: '12px' }}>
          <span className="badge bg-success-subtle text-success border border-success-subtle px-2.5 py-1 rounded-pill">
            🌟 90 - 100%: Hoàn thành xuất sắc nhiệm vụ
          </span>
          <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2.5 py-1 rounded-pill">
            💙 80 - dưới 90%: Hoàn thành tốt nhiệm vụ
          </span>
          <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle px-2.5 py-1 rounded-pill">
            🟡 50 - dưới 80%: Hoàn thành nhiệm vụ
          </span>
          <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-2.5 py-1 rounded-pill">
            🔴 Dưới 50%: Không hoàn thành nhiệm vụ
          </span>
        </div>
      </div>

      {/* Controls: Cluster Filter & Search Input */}
      <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
        <div className="d-flex align-items-center gap-2 flex-wrap">
          <label className="text-secondary fw-semibold mb-0 d-flex align-items-center gap-1.5" style={{ fontSize: '13px' }}>
            <Filter size={15} />
            Lọc theo Cụm thi đua:
          </label>
          <select 
            className="form-select form-select-sm fw-semibold"
            value={selectedCluster}
            onChange={(e) => setSelectedCluster(e.target.value)}
            style={{ width: '220px', fontSize: '12.5px' }}
          >
            <option value="ALL">🏆 Tất cả 6 Cụm thi đua (56 Chi đoàn)</option>
            {COMPETITION_CLUSTERS.map(cluster => (
              <option key={cluster.id} value={cluster.name}>
                {cluster.name}
              </option>
            ))}
          </select>
        </div>

        <div className="search-box" style={{ maxWidth: '320px', width: '100%' }}>
          <Search size={16} />
          <input 
            type="text" 
            placeholder="Tìm tên Chi đoàn / Đơn vị..." 
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            style={{ fontSize: '12.5px' }}
          />
        </div>
      </div>

      {/* Main Ranking Table */}
      <div className="table-responsive rounded-4 border bg-white shadow-xs">
        <table className="custom-table align-middle">
          <thead>
            <tr>
              <th style={{ width: '45px' }} className="text-center">STT</th>
              <th>Chi đoàn / Đơn vị</th>
              <th>Cụm thi đua</th>
              <th>Bí thư Chi đoàn</th>
              <th>Hoạt động tham gia</th>
              <th style={{ width: '180px' }}>Tỷ lệ % tham gia</th>
              <th>Kết quả Xếp loại</th>
              <th className="text-end">Chi tiết Hoạt động</th>
            </tr>
          </thead>
          <tbody>
            {filteredBranchStats.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-4 text-muted" style={{ fontSize: '13px' }}>
                  Không tìm thấy Chi đoàn nào phù hợp với bộ lọc hoặc từ khóa tìm kiếm.
                </td>
              </tr>
            ) : (
              filteredBranchStats.map((item, index) => (
                <tr 
                  key={item.id || index} 
                  className="cursor-pointer hover-bg-light transition"
                  onClick={() => setSelectedBranchDetail(item)}
                >
                  <td className="fw-bold text-muted text-center" style={{ fontSize: '12px' }}>{index + 1}</td>
                  <td>
                    <div className="fw-bold text-primary" style={{ fontSize: '13.5px' }}>{item.name}</div>
                    <div className="text-muted" style={{ fontSize: '11px' }}>{item.code || 'Đơn vị trực thuộc'}</div>
                  </td>
                  <td>
                    <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2 py-1" style={{ fontSize: '11px' }}>
                      🏆 {item.clusterName}
                    </span>
                  </td>
                  <td className="text-dark" style={{ fontSize: '12.5px' }}>
                    {item.secretary_name}
                  </td>
                  <td>
                    <div className="d-flex flex-column gap-0.5">
                      <span className="fw-bold text-dark" style={{ fontSize: '13px' }}>
                        {item.totalAssigned > 0 ? `${item.attendedCount} / ${item.totalAssigned} HĐ` : '0 / 0 HĐ'}
                      </span>
                      <div className="d-flex align-items-center gap-1.5 flex-wrap" style={{ fontSize: '11px' }}>
                        {item.totalAssigned === 0 ? (
                          <span className="text-muted">Chưa có HĐ</span>
                        ) : (
                          <>
                            <span className="text-success fw-semibold">✓ {item.attendedCount} có mặt</span>
                            {item.absentCount > 0 && (
                              <span className="text-danger fw-semibold">• ✕ {item.absentCount} vắng</span>
                            )}
                            {item.unrespondedCount > 0 && (
                              <span className="text-muted">• ⏳ {item.unrespondedCount} chưa điểm danh</span>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>
                    {item.percentage === null ? (
                      <span className="text-muted fw-semibold" style={{ fontSize: '12px' }}>— Chưa phát sinh</span>
                    ) : (
                      <div className="d-flex align-items-center gap-2">
                        <div className="progress flex-grow-1" style={{ height: '8px', borderRadius: '4px' }}>
                          <div 
                            className="progress-bar transition" 
                            role="progressbar" 
                            style={{ 
                              width: `${item.percentage}%`,
                              backgroundColor: item.rating?.color || '#0066FF'
                            }}
                          ></div>
                        </div>
                        <span className="fw-bold" style={{ fontSize: '12px', color: item.rating?.color || '#0066FF', minWidth: '38px' }}>
                          {item.percentage}%
                        </span>
                      </div>
                    )}
                  </td>
                  <td>
                    <span className={`badge ${item.rating?.badgeClass || 'bg-light text-dark'} border px-2.5 py-1.5 rounded-2 d-inline-flex align-items-center gap-1.5`} style={{ fontSize: '11.5px', fontWeight: 600 }}>
                      <span>{item.rating?.icon || '📊'}</span>
                      <span>{item.rating?.label || 'Hoàn thành'}</span>
                    </span>
                  </td>
                  <td className="text-end">
                    <button 
                      type="button"
                      className="btn btn-sm btn-outline-primary fw-semibold d-inline-flex align-items-center gap-1 px-2.5 py-1 rounded-3 hover-scale"
                      style={{ fontSize: '11.5px' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedBranchDetail(item);
                      }}
                      title="Xem chi tiết từng hoạt động tham gia, hình thức quét QR / nhập code, thời gian và tọa độ GPS"
                    >
                      <FileText size={13} />
                      <span>Xem chi tiết</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Chi Tiết Thống Kê Điểm Danh & Hoạt Động Của Chi Đoàn */}
      {activeBranchDetail && (
        <div 
          className="modal d-block bg-dark bg-opacity-50" 
          style={{ zIndex: 1070 }}
          onClick={() => setSelectedBranchDetail(null)}
        >
          <div 
            className="modal-dialog modal-dialog-centered modal-lg shadow-lg" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content border-0 rounded-4">
              <div className="modal-header border-bottom pb-3">
                <div>
                  <h5 className="modal-title fw-bold text-dark d-flex align-items-center gap-2" style={{ fontSize: '16px' }}>
                    <BarChart2 className="text-primary" size={22} />
                    Báo cáo Chi tiết Hoạt động - {activeBranchDetail.name}
                  </h5>
                  <div className="text-secondary mt-0.5" style={{ fontSize: '12px' }}>
                    Bí thư: <strong>{activeBranchDetail.secretary_name}</strong> • 🏆 <strong>{activeBranchDetail.clusterName}</strong>
                  </div>
                </div>
                <button type="button" className="btn-close" onClick={() => setSelectedBranchDetail(null)}></button>
              </div>

              <div className="modal-body p-4">
                {/* Metric Summary Cards */}
                <div className="row g-2 mb-4">
                  <div className="col-6 col-md-3">
                    <div className="p-2.5 bg-primary-subtle bg-opacity-30 border border-primary-subtle rounded-3 text-center">
                      <div className="text-muted" style={{ fontSize: '11px', fontWeight: 600 }}>TỔNG SỐ HĐ BAN HÀNH</div>
                      <div className="fw-extrabold text-primary" style={{ fontSize: '20px' }}>{activeBranchDetail.totalAssigned} HĐ</div>
                    </div>
                  </div>
                  <div className="col-6 col-md-3">
                    <div className="p-2.5 bg-success-subtle bg-opacity-30 border border-success-subtle rounded-3 text-center">
                      <div className="text-muted" style={{ fontSize: '11px', fontWeight: 600 }}>ĐÃ ĐIỂM DANH CÓ MẶT</div>
                      <div className="fw-extrabold text-success" style={{ fontSize: '20px' }}>{activeBranchDetail.attendedCount} HĐ</div>
                    </div>
                  </div>
                  <div className="col-6 col-md-3">
                    <div className="p-2.5 bg-danger-subtle bg-opacity-30 border border-danger-subtle rounded-3 text-center">
                      <div className="text-muted" style={{ fontSize: '11px', fontWeight: 600 }}>BÁO VẮNG MẶT</div>
                      <div className="fw-extrabold text-danger" style={{ fontSize: '20px' }}>{activeBranchDetail.absentCount} HĐ</div>
                    </div>
                  </div>
                  <div className="col-6 col-md-3">
                    <div className="p-2.5 bg-light border rounded-3 text-center">
                      <div className="text-muted" style={{ fontSize: '11px', fontWeight: 600 }}>TỶ LỆ % THAM GIA</div>
                      <div className="fw-extrabold" style={{ fontSize: '20px', color: activeBranchDetail.rating?.color || '#0066FF' }}>
                        {activeBranchDetail.percentage !== null ? `${activeBranchDetail.percentage}%` : '—'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rating Badge */}
                <div className="d-flex align-items-center justify-content-between p-3 bg-light rounded-3 border mb-3 flex-wrap gap-2">
                  <span className="fw-bold text-dark" style={{ fontSize: '13px' }}>
                    📊 Kết quả Đánh giá Thi đua:
                  </span>
                  <span className={`badge ${activeBranchDetail.rating?.badgeClass} border px-3 py-1.5 rounded-2 d-inline-flex align-items-center gap-1.5`} style={{ fontSize: '12.5px', fontWeight: 700 }}>
                    <span>{activeBranchDetail.rating?.icon}</span>
                    <span>{activeBranchDetail.rating?.label}</span>
                  </span>
                </div>

                {/* Detailed Activities List */}
                <h6 className="fw-bold text-dark mb-2.5 d-flex align-items-center justify-content-between" style={{ fontSize: '13.5px' }}>
                  <span>📋 Danh sách từng Hoạt động & Lịch sử Điểm danh:</span>
                  <span className="badge bg-secondary text-white" style={{ fontSize: '11px' }}>
                    {activeBranchDetail.activityDetailsList.length} Hoạt động
                  </span>
                </h6>

                {activeBranchDetail.activityDetailsList.length === 0 ? (
                  <div className="p-4 bg-light border rounded-3 text-center text-muted" style={{ fontSize: '12.5px' }}>
                    Chưa có hoạt động nào được ban hành cho Chi đoàn này.
                  </div>
                ) : (
                  <div className="d-flex flex-column gap-2.5" style={{ maxHeight: '340px', overflowY: 'auto' }}>
                    {activeBranchDetail.activityDetailsList.map((act) => (
                      <div 
                        key={act.id} 
                        className={`p-3 rounded-3 border ${
                          act.status === 'ATTENDED' 
                            ? 'bg-success-subtle bg-opacity-15 border-success-subtle' 
                            : act.status === 'ABSENT' 
                              ? 'bg-danger-subtle bg-opacity-15 border-danger-subtle' 
                              : 'bg-light border'
                        }`}
                      >
                        <div className="d-flex align-items-start justify-content-between gap-2 flex-wrap mb-1.5">
                          <div>
                            <div className="fw-bold text-dark" style={{ fontSize: '14px' }}>📌 {act.title}</div>
                            <div className="text-secondary d-flex align-items-center gap-3 mt-1 flex-wrap" style={{ fontSize: '11.5px' }}>
                              <span>⏰ {act.timeStr} ({act.day}/{act.month}/{act.year})</span>
                              <span>📍 {act.location}</span>
                            </div>
                          </div>

                          <div className="d-flex flex-column align-items-end gap-1">
                            {act.status === 'ATTENDED' ? (
                              <>
                                <span className="badge bg-success text-white d-inline-flex align-items-center gap-1 px-2.5 py-1" style={{ fontSize: '11.5px' }}>
                                  <CheckCircle2 size={13} />
                                  <span>Đã có mặt ({act.time})</span>
                                </span>
                                {act.checkinMethod && (
                                  <span className="badge bg-light text-dark border px-2 py-0.5" style={{ fontSize: '10.5px' }}>
                                    {act.checkinMethod}
                                  </span>
                                )}
                              </>
                            ) : act.status === 'ABSENT' ? (
                              <span className="badge bg-danger text-white d-inline-flex align-items-center gap-1 px-2.5 py-1" style={{ fontSize: '11.5px' }}>
                                <XCircle size={13} />
                                <span>Báo vắng ({act.time})</span>
                              </span>
                            ) : (
                              <span className="badge bg-secondary text-white d-inline-flex align-items-center gap-1 px-2.5 py-1" style={{ fontSize: '11.5px' }}>
                                <Clock size={13} />
                                <span>Chưa điểm danh</span>
                              </span>
                            )}
                          </div>
                        </div>

                        {/* GPS and Checkin details if available */}
                        {act.gpsCoords && (
                          <div className="mt-1.5 pt-1.5 border-top d-flex align-items-center gap-2 text-muted" style={{ fontSize: '11.5px' }}>
                            <span>📍 Tọa độ GPS xác thực: <strong className="text-primary font-monospace">{act.gpsCoords}</strong></span>
                            <span className="badge bg-success-subtle text-success border border-success-subtle py-0 px-1.5">✓ Hợp lệ</span>
                          </div>
                        )}

                        {/* Reason Box if ABSENT */}
                        {act.status === 'ABSENT' && (
                          <div className="mt-2 p-2 bg-white rounded border border-danger-subtle text-danger-emphasis" style={{ fontSize: '12px' }}>
                            <strong>💬 Lý do vắng mặt:</strong> {act.reason || 'Không ghi rõ lý do'}
                          </div>
                        )}

                        {/* Admin Action Toggle */}
                        {isDoanXa && onRespondAttendance && (
                          <div className="mt-2 pt-2 border-top d-flex align-items-center justify-content-end gap-2">
                            <span className="text-muted small">Cập nhật nhanh:</span>
                            {act.status !== 'ATTENDED' && (
                              <button
                                type="button"
                                className="btn btn-xs btn-outline-success px-2 py-0.5 rounded-2"
                                style={{ fontSize: '11px' }}
                                onClick={() => onRespondAttendance(act.id, activeBranchDetail.name, true, '', act.title)}
                              >
                                ✓ Đánh dấu có mặt
                              </button>
                            )}
                            {act.status !== 'ABSENT' && (
                              <button
                                type="button"
                                className="btn btn-xs btn-outline-danger px-2 py-0.5 rounded-2"
                                style={{ fontSize: '11px' }}
                                onClick={() => {
                                  const reason = prompt('Nhập lý do vắng mặt của Chi đoàn:', 'Bận công tác đột xuất');
                                  if (reason !== null) {
                                    onRespondAttendance(act.id, activeBranchDetail.name, false, reason, act.title);
                                  }
                                }}
                              >
                                ✕ Đánh dấu vắng
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="modal-footer border-top py-2 px-3">
                <button type="button" className="btn btn-sm btn-secondary" onClick={() => setSelectedBranchDetail(null)}>
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


export function StorageArchiveView({ documents = [], submissions = [], onDeleteDocument, onDeleteSubmission, isDoanXa }) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [deleteConfirmTarget, setDeleteConfirmTarget] = useState(null);

  // Categorization helper function
  const getDocCategory = (doc) => {
    if (doc.category) return doc.category;
    if (doc.category_label) {
      if (doc.category_label.includes('quyết định')) return 'decision_docs';
      if (doc.category_label.includes('hoạt động')) return 'act_docs';
      if (doc.category_label.includes('triển khai')) return 'implementation_docs';
      if (doc.category_label.includes('cuộc họp')) return 'meeting_docs';
    }
    const text = `${doc.title || ''} ${doc.doc_number || ''}`.toLowerCase();
    if (text.includes('qđ') || text.includes('quyết định')) {
      return 'decision_docs';
    }
    if (text.includes('họp') || text.includes('biên bản') || text.includes('triệu tập') || text.includes('bb')) {
      return 'meeting_docs';
    }
    if (text.includes('kh') || text.includes('kế hoạch') || text.includes('hoạt động') || text.includes('ra quân') || text.includes('phát động') || text.includes('chương trình')) {
      return 'act_docs';
    }
    return 'implementation_docs';
  };

  const categoryLabels = {
    act_docs: 'Văn bản thuộc ban hành hoạt động',
    meeting_docs: 'Văn bản cuộc họp',
    implementation_docs: 'Văn bản triển khai',
    decision_docs: 'Văn bản quyết định',
    submissions: 'Báo cáo Chi đoàn nộp'
  };

  const categoryBadges = {
    act_docs: { bg: 'bg-primary-subtle text-primary border-primary-subtle', icon: '📌' },
    meeting_docs: { bg: 'bg-info-subtle text-info-emphasis border-info-subtle', icon: '🤝' },
    implementation_docs: { bg: 'bg-warning-subtle text-warning-emphasis border-warning-subtle', icon: '📢' },
    decision_docs: { bg: 'bg-danger-subtle text-danger border-danger-subtle', icon: '⚖️' },
    submissions: { bg: 'bg-success-subtle text-success border-success-subtle', icon: '📑' }
  };

  const allFiles = [
    ...documents.filter(d => d && (d.file_name || d.file_url)).map(d => {
      const catKey = getDocCategory(d);
      return { 
        id: d.id, 
        type: 'document',
        name: d.file_name || 'Van_Ban.pdf', 
        url: d.file_url || d.pdf_url || `/${d.file_name}`,
        title: d.title || 'Văn bản ban hành', 
        content: d.summary || d.content || d.description || '',
        doc_number: d.doc_number,
        categoryKey: catKey,
        categoryLabel: categoryLabels[catKey] || 'Văn bản triển khai', 
        date: d.date || d.issue_date || 'Hôm nay',
        time: d.time || d.created_at_time || '',
        source: d.sender || d.branch_name || 'Văn bản Đoàn xã',
        isBranchDoc: false
      };
    }),
    ...submissions.filter(s => s && (s.file_name || s.file_url)).map(s => ({ 
      id: s.id, 
      type: 'submission',
      name: s.file_name || 'Bao_Cao.pdf', 
      url: s.file_url || `/${s.file_name}`,
      title: s.doc_title || s.title || `Báo cáo ${s.branch_name || 'Chi đoàn Ấp'}`, 
      content: s.notes || s.content || s.summary || s.description || 'Báo cáo/văn bản đã được Chi đoàn gửi trực tuyến.',
      doc_number: s.doc_number || null,
      categoryKey: 'submissions',
      categoryLabel: categoryLabels['submissions'], 
      date: s.submitted_at || s.sub_date || s.submission_date || 'Hôm nay',
      time: s.sub_time || s.time || '',
      source: s.branch_name || s.sender || 'Chi đoàn Ấp',
      isBranchDoc: true
    }))
  ];

  const filteredFiles = allFiles.filter(f => {
    const matchCategory = selectedCategory === 'ALL' || f.categoryKey === selectedCategory;
    const matchSearch = !search || f.title.toLowerCase().includes(search.toLowerCase()) || 
                        f.name.toLowerCase().includes(search.toLowerCase()) ||
                        (f.doc_number && f.doc_number.toLowerCase().includes(search.toLowerCase())) ||
                        (f.source && f.source.toLowerCase().includes(search.toLowerCase()));
    return matchCategory && matchSearch;
  });

  const countAct = allFiles.filter(f => f.categoryKey === 'act_docs').length;
  const countMeeting = allFiles.filter(f => f.categoryKey === 'meeting_docs').length;
  const countImpl = allFiles.filter(f => f.categoryKey === 'implementation_docs').length;
  const countDecision = allFiles.filter(f => f.categoryKey === 'decision_docs').length;
  const countSubmissions = allFiles.filter(f => f.categoryKey === 'submissions').length;

  return (
    <div className="content-card">
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-4 gap-3 border-bottom pb-3">
        <div>
          <h3 className="card-title-header mb-1 d-flex align-items-center gap-2">
            <Folder className="text-primary" size={24} />
            Kho Lưu trữ Văn bản Số (Phân loại tự động)
          </h3>
          <div className="text-secondary" style={{ fontSize: '13px' }}>
            Lưu trữ và tra cứu tập trung theo từng hạng mục văn bản ban hành, cuộc họp, triển khai và quyết định
          </div>
        </div>

        <div className="input-group" style={{ maxWidth: '320px' }}>
          <span className="input-group-text bg-light border-end-0"><Search size={15} className="text-secondary" /></span>
          <input 
            type="text" 
            className="form-control bg-light border-start-0 ps-0" 
            placeholder="Tìm kiếm tệp hồ sơ, trích yếu..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ fontSize: '13px' }}
          />
        </div>
      </div>

      {/* Category Tabs according to User Requirements */}
      <div className="d-flex align-items-center gap-2 flex-wrap mb-4">
        <button 
          type="button"
          className={`btn btn-sm ${selectedCategory === 'ALL' ? 'btn-primary' : 'btn-light border'} fw-semibold px-3 py-1.5 rounded-3`}
          onClick={() => setSelectedCategory('ALL')}
          style={{ fontSize: '12.5px' }}
        >
          📂 Tất cả ({allFiles.length})
        </button>

        <button 
          type="button"
          className={`btn btn-sm ${selectedCategory === 'decision_docs' ? 'btn-primary' : 'btn-light border'} fw-semibold px-3 py-1.5 rounded-3`}
          onClick={() => setSelectedCategory('decision_docs')}
          style={{ fontSize: '12.5px' }}
        >
          ⚖️ Văn bản quyết định ({countDecision})
        </button>

        <button 
          type="button"
          className={`btn btn-sm ${selectedCategory === 'act_docs' ? 'btn-primary' : 'btn-light border'} fw-semibold px-3 py-1.5 rounded-3`}
          onClick={() => setSelectedCategory('act_docs')}
          style={{ fontSize: '12.5px' }}
        >
          📌 Ban hành hoạt động ({countAct})
        </button>

        <button 
          type="button"
          className={`btn btn-sm ${selectedCategory === 'implementation_docs' ? 'btn-primary' : 'btn-light border'} fw-semibold px-3 py-1.5 rounded-3`}
          onClick={() => setSelectedCategory('implementation_docs')}
          style={{ fontSize: '12.5px' }}
        >
          📢 Văn bản triển khai ({countImpl})
        </button>

        <button 
          type="button"
          className={`btn btn-sm ${selectedCategory === 'meeting_docs' ? 'btn-primary' : 'btn-light border'} fw-semibold px-3 py-1.5 rounded-3`}
          onClick={() => setSelectedCategory('meeting_docs')}
          style={{ fontSize: '12.5px' }}
        >
          🤝 Văn bản cuộc họp ({countMeeting})
        </button>

        <button 
          type="button"
          className={`btn btn-sm ${selectedCategory === 'submissions' ? 'btn-primary' : 'btn-light border'} fw-semibold px-3 py-1.5 rounded-3`}
          onClick={() => setSelectedCategory('submissions')}
          style={{ fontSize: '12.5px' }}
        >
          📑 Báo cáo Chi đoàn ({countSubmissions})
        </button>
      </div>

      {filteredFiles.length === 0 ? (
        <div className="p-5 bg-light rounded-3 text-center border my-3">
          <div className="p-3 bg-white d-inline-block rounded-circle shadow-sm mb-3 text-primary">
            <Folder size={32} />
          </div>
          <h5 className="fw-bold text-dark mb-1">Chưa có văn bản nào trong mục này</h5>
          <p className="text-secondary mb-0" style={{ fontSize: '13px' }}>
            Tất cả các tệp đính kèm văn bản và báo cáo thuộc danh mục lựa chọn sẽ tự động hiển thị tại đây.
          </p>
        </div>
      ) : (
        <div className="row g-3">
          {filteredFiles.map(file => {
            const badgeMeta = categoryBadges[file.categoryKey] || { bg: 'bg-light text-dark', icon: '📄' };
            return (
              <div key={file.id} className="col-12 col-md-6 col-lg-4">
                <div className="p-3.5 bg-light rounded-3 border d-flex flex-column justify-content-between h-100 hover-shadow transition">
                  <div>
                    {/* Header Badge & Upload Date/Time */}
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <span className={`badge ${badgeMeta.bg} border px-2 py-1 rounded-2`} style={{ fontSize: '11px', fontWeight: 600 }}>
                        {badgeMeta.icon} {file.categoryLabel}
                      </span>
                      <span className="text-secondary fw-semibold" style={{ fontSize: '11.5px' }} title="Ngày giờ tải tệp lên">
                        ⏰ {file.date} {file.time ? `• ${file.time}` : ''}
                      </span>
                    </div>

                    {/* Bolded Document Title */}
                    <div className="fw-extrabold text-dark mb-1.5" style={{ fontSize: '14.5px', lineHeight: '1.35' }}>
                      {file.title}
                    </div>

                    {file.doc_number && (
                      <div className="text-primary fw-semibold mb-2" style={{ fontSize: '11.5px' }}>
                        Số hiệu: {file.doc_number}
                      </div>
                    )}

                    {/* Display Content/Notes for Submissions and Documents */}
                    {file.content && (
                      <div className="p-2 my-2 bg-white rounded border border-light-subtle text-secondary" style={{ fontSize: '12px', lineHeight: '1.4' }}>
                        <strong>📝 Nội dung:</strong> {file.content}
                      </div>
                    )}
                  </div>

                  {/* Footer: Source (Bolded) & Download / Delete buttons */}
                  <div className="pt-2.5 mt-2 border-top d-flex align-items-center justify-content-between gap-2 flex-wrap">
                    <div className="text-secondary" style={{ fontSize: '12px' }}>
                      Nguồn: <strong className="fw-extrabold text-dark me-1">{file.source}</strong>
                    </div>

                    <div className="d-flex align-items-center gap-1.5">
                      <a 
                        href={file.url} 
                        download={file.name}
                        target="_blank" 
                        rel="noreferrer" 
                        className="btn btn-sm btn-outline-primary fw-semibold d-inline-flex align-items-center gap-1 px-2.5 py-1"
                        style={{ fontSize: '11.5px', borderRadius: '6px' }}
                      >
                        <Download size={13} /> Tải tệp
                      </a>

                      <button 
                        type="button"
                        className="btn btn-sm btn-outline-danger fw-semibold d-inline-flex align-items-center gap-1 px-2 py-1"
                        style={{ fontSize: '11.5px', borderRadius: '6px' }}
                        title="Xóa tệp khỏi lưu trữ"
                        onClick={() => setDeleteConfirmTarget(file)}
                      >
                        <Trash2 size={13} />
                        <span>Xóa</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Xác Nhận Xóa Tệp Văn Bản / Báo Cáo */}
      {deleteConfirmTarget && (
        <div 
          className="modal d-block bg-dark bg-opacity-50" 
          style={{ zIndex: 1080 }}
          onClick={() => setDeleteConfirmTarget(null)}
        >
          <div 
            className="modal-dialog modal-dialog-centered shadow-lg" 
            style={{ maxWidth: '420px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content border-0 rounded-4 text-center p-4">
              <div className="d-flex justify-content-center mb-3">
                <div className="p-3 bg-danger-subtle text-danger rounded-circle d-inline-flex align-items-center justify-content-center">
                  <AlertTriangle size={36} />
                </div>
              </div>

              <h5 className="fw-bold text-danger mb-2" style={{ fontSize: '18px' }}>
                Xác nhận xóa tệp khỏi kho lưu trữ?
              </h5>

              <p className="text-secondary mb-4" style={{ fontSize: '13px', lineHeight: '1.5' }}>
                Tệp <strong className="text-dark">"{deleteConfirmTarget.title}"</strong> (Nguồn: <strong>{deleteConfirmTarget.source}</strong>) sẽ được xóa hoàn toàn khỏi hệ thống lưu trữ.
              </p>

              <div className="d-flex align-items-center justify-content-center gap-2.5">
                <button 
                  type="button" 
                  className="btn btn-light border text-secondary fw-semibold px-4 py-2 rounded-3 flex-fill"
                  style={{ fontSize: '13.5px' }}
                  onClick={() => setDeleteConfirmTarget(null)}
                >
                  Quay lại
                </button>
                <button 
                  type="button" 
                  className="btn btn-danger fw-bold px-4 py-2 rounded-3 flex-fill shadow-sm"
                  style={{ fontSize: '13.5px' }}
                  onClick={() => {
                    const file = deleteConfirmTarget;
                    setDeleteConfirmTarget(null);
                    if (file.type === 'document') {
                      onDeleteDocument && onDeleteDocument(file.id, file.title);
                    } else if (file.type === 'submission') {
                      onDeleteSubmission && onDeleteSubmission(file.id, file.title);
                    }
                  }}
                >
                  Xác nhận xóa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// 8. Full Settings & Hybrid Storage System View
export function SettingsView({ currentRole }) {
  const roleObj = currentRole || { full_name: 'Ban Thường vụ Đoàn xã Xuân Thới Sơn', email: 'doanxa@xuanthoison.gov.vn', role: 'doan_xa' };
  const [metrics, setMetrics] = useState({
    usedMb: '0.50',
    totalQuotaMb: 1024,
    percentage: 1,
    isNearLimit: false,
    activeProvider: 'supabase'
  });

  useEffect(() => {
    async function loadMetrics() {
      const data = await getStorageQuotaMetrics();
      setMetrics(data);
    }
    loadMetrics();
  }, []);

  return (
    <div className="content-card">
      <div className="d-flex align-items-center justify-content-between mb-4 border-bottom pb-3">
        <div>
          <h3 className="card-title-header mb-1 d-flex align-items-center gap-2">
            <Settings className="text-primary" size={24} />
            Cài đặt & Cấu hình Lưu trữ Hybrid
          </h3>
          <div className="text-secondary" style={{ fontSize: '13px' }}>
            Quản lý tài khoản, giám sát dung lượng Supabase Storage & Tự động chuyển vùng Google Drive Backup ({DOAN_XA_GMAIL})
          </div>
        </div>
      </div>

      {/* Auto Switch Storage Quota Monitor Card */}
      <div className="p-4 bg-light rounded-3 border mb-4">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div className="d-flex align-items-center gap-2">
            <HardDrive className="text-primary" size={22} />
            <h5 className="fw-bold text-dark mb-0" style={{ fontSize: '15px' }}>
              Giám sát Dung lượng Storage PDF & Tự động Chuyển vùng Google Drive
            </h5>
          </div>
          <span className={`badge px-3 py-1.5 rounded-pill fw-bold ${metrics.isNearLimit ? 'bg-warning text-dark' : 'bg-success text-white'}`}>
            {metrics.isNearLimit ? '🟡 Google Drive Backup Mode (Đã chuyển vùng)' : '🟢 Supabase Cloud Mode (Đang hoạt động)'}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="mb-2">
          <div className="d-flex justify-content-between text-secondary mb-1" style={{ fontSize: '12px' }}>
            <span>Đã sử dụng: <strong>{metrics.usedMb} MB / {metrics.totalQuotaMb} MB (Supabase Free)</strong></span>
            <span>Hạn ngạch cảnh báo: <strong>80% (800 MB)</strong></span>
          </div>
          <div className="progress" style={{ height: '10px', borderRadius: '6px' }}>
            <div 
              className={`progress-bar ${metrics.percentage > 80 ? 'bg-danger' : metrics.percentage > 60 ? 'bg-warning' : 'bg-primary'}`} 
              style={{ width: `${Math.max(2, metrics.percentage)}%` }}
            ></div>
          </div>
        </div>

        <div className="mt-3 p-3 bg-white rounded-2 border d-flex align-items-start gap-3">
          {metrics.isNearLimit ? (
            <AlertTriangle className="text-warning mt-1" size={20} />
          ) : (
            <Cloud className="text-primary mt-1" size={20} />
          )}
          <div style={{ fontSize: '12.5px' }}>
            <div className="fw-bold text-dark">Quy trình Backup tự động:</div>
            <div className="text-secondary">
              Tệp PDF khi upload sẽ ưu tiên lưu trên <strong>Supabase Storage</strong>. Khi dung lượng đạt từ <strong>80% (800 MB)</strong> trở lên hoặc khi Supabase báo đầy, hệ thống sẽ <strong>tự động chuyển hướng ghi tệp trực tiếp sang Google Drive của Đoàn xã</strong> (`{DOAN_XA_GMAIL}`) — đảm bảo không bao giờ bị gián đoạn hay mất tệp!
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Left Column: Account Profile Info */}
        <div className="col-12 col-md-6">
          <div className="p-3 bg-light rounded-3 border h-100">
            <h5 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
              <UserCheck size={18} className="text-primary" />
              Thông tin Tài khoản Đăng nhập
            </h5>

            <div className="mb-2">
              <label className="text-muted" style={{ fontSize: '11px' }}>Đơn vị / Tên hiển thị</label>
              <div className="fw-bold text-dark" style={{ fontSize: '14px' }}>{roleObj.full_name || 'Ban Thường vụ Đoàn xã'}</div>
            </div>

            <div className="mb-2">
              <label className="text-muted" style={{ fontSize: '11px' }}>Email đăng nhập</label>
              <div className="fw-bold text-dark" style={{ fontSize: '14px' }}>{roleObj.email || 'doanxa@xuanthoison.gov.vn'}</div>
            </div>

            <div className="mb-2">
              <label className="text-muted" style={{ fontSize: '11px' }}>Chức vụ & Phân quyền</label>
              <div>
                <span className="badge bg-primary-subtle text-primary border border-primary-subtle fw-bold px-2 py-1">
                  {roleObj.role === 'doan_xa' || roleObj.role === 'admin' ? 'Quản trị viên Đoàn xã' : 'Bí thư Chi đoàn Ấp'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Google Drive & Supabase Infrastructure */}
        <div className="col-12 col-md-6">
          <div className="p-3 bg-light rounded-3 border h-100">
            <h5 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
              <Database size={18} className="text-primary" />
              Hạ tầng Lưu trữ Đa tầng (Hybrid Storage)
            </h5>

            <div className="d-flex align-items-center justify-content-between mb-3 p-2.5 bg-white rounded-2 border">
              <div>
                <div className="fw-bold text-dark" style={{ fontSize: '13px' }}>Supabase PostgreSQL Database</div>
                <div className="text-muted" style={{ fontSize: '11px' }}>Singapore (ap-southeast-1) — Realtime Metadata Sync</div>
              </div>
              <span className="badge bg-success text-white">● Active</span>
            </div>

            <div className="d-flex align-items-center justify-content-between p-2.5 bg-white rounded-2 border">
              <div>
                <div className="fw-bold text-dark" style={{ fontSize: '13px' }}>Google Drive Mail Đoàn xã Backup</div>
                <div className="text-muted" style={{ fontSize: '11px' }}>{DOAN_XA_GMAIL} (Dung lượng cao)</div>
              </div>
              <span className="badge bg-primary text-white">Auto-Switch Ready</span>
            </div>

            <div className="mt-3 p-2.5 bg-white rounded-2 border" style={{ fontSize: '11.5px' }}>
              <strong>Địa chỉ Trụ sở Chính thức:</strong>
              <div className="text-secondary mt-1">{OFFICIAL_ADDRESS}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


// ============================================================================

// ============================================================================
// COMPONENT TẠO NHANH HOẠT ĐỘNG TRỰC TIẾP (CHUẨN CHUYÊN NGHIỆP, DỄ DÙNG)
// ============================================================================
const QUICK_TEMPLATES = [
  { 
    title: 'Hội nghị Ban Chấp hành Đoàn xã mở rộng', 
    icon: '🏛️', 
    priority: 'Quan trọng', 
    location: 'Hội trường UBND Xã Xuân Thới Sơn',
    notes: 'Trang phục áo Thanh niên Việt Nam, có mặt trước 15 phút để ổn định tổ chức.' 
  },
  { 
    title: 'Ngày Chủ nhật Xanh - Ra quân dọn dẹp vệ sinh môi trường', 
    icon: '🌿', 
    priority: 'Bình thường', 
    location: 'Tuyến đường Thanh niên tự quản Xã Xuân Thới Sơn',
    notes: 'Đoàn viên mang theo dụng cụ vệ sinh, găng tay bảo hộ và mặc áo Thanh niên.' 
  },
  { 
    title: 'Sinh hoạt Chi đoàn Chủ điểm tháng', 
    icon: '📚', 
    priority: 'Bình thường', 
    location: 'Nhà Văn hóa Xã Xuân Thới Sơn',
    notes: 'Cử đầy đủ Bí thư, Phó Bí thư Chi đoàn tham gia và chuẩn bị nội dung thảo luận.' 
  },
  { 
    title: 'Đại hội Chi đoàn nhiệm kỳ mới', 
    icon: '🏆', 
    priority: 'Quan trọng', 
    location: 'Hội trường UBND Xã Xuân Thới Sơn',
    notes: 'Trang phục chỉnh tề, chuẩn bị văn kiện và báo cáo tổng kết nhiệm kỳ.' 
  },
  { 
    title: 'Lễ Kết nạp Đoàn viên mới', 
    icon: '🌟', 
    priority: 'Bình thường', 
    location: 'Hội trường UBND Xã Xuân Thới Sơn',
    notes: 'Các Chi đoàn dẫn đoàn viên mới tham gia đầy đủ, trang phục chỉnh tề.' 
  },
  { 
    title: 'Tập huấn Kỹ năng Cán bộ Đoàn & Chuyển đổi số', 
    icon: '💻', 
    priority: 'Bình thường', 
    location: 'Phòng họp trực tuyến UBND Xã',
    notes: 'Đoàn viên mang theo điện thoại thông minh hoặc máy tính bảng để thực hành.' 
  }
];

const QUICK_VENUE_LIST = [
  'Hội trường UBND Xã Xuân Thới Sơn',
  'Nhà Văn hóa Xã Xuân Thới Sơn',
  'Văn phòng Đoàn Thanh niên Xã',
  'Tuyến đường Thanh niên tự quản',
  'Trường Tiểu học Xuân Thới Sơn',
  'Trạm Y tế Xã Xuân Thới Sơn'
];

// GIAO DIỆN ĐIỂM DANH XÁC THỰC VỊ TRÍ CHO CHI ĐOÀN (CHUẨN SCREENSHOT USER)
// ============================================================================
export function BranchAttendanceWorkspaceView({
  activities = [],
  tasks = [],
  currentRole,
  attendanceRecords = {},
  onRespondAttendance,
  onConfirmReceipt,
  isDoanXa,
  onAddActivity,
  onUpdateActivity,
  onUpdateTask,
  onDeleteActivity,
  onDeleteTask,
  onToggleTask,
  onCompleteTask,
  onOpenCreateActivity,
  onAddTask
}) {
  // Lọc sạch 100% dữ liệu ảo mẫu
  const safeActivities = (Array.isArray(activities) ? activities : [])
    .filter(a => a && !String(a.id || '').startsWith('act-seed-') && (!a.title || !a.title.includes('Hội nghị Học tập & Quán triệt')));
  
  const safeTasks = (Array.isArray(tasks) ? tasks : [])
    .filter(t => t && !String(t.id || '').startsWith('task-seed-') && (!t.title || !t.title.includes('Rà soát và cập nhật')));

  // Selected activity for Chi đoàn check-in
  const [branchSelectedActId, setBranchSelectedActId] = useState('');

  useEffect(() => {
    if (!branchSelectedActId && safeActivities.length > 0) {
      const activeOne = safeActivities.find(a => a.status !== 'Đã kết thúc') || safeActivities[0];
      setBranchSelectedActId(activeOne.id);
    }
  }, [safeActivities, branchSelectedActId]);

  // ==========================================================================
  // PHÂN QUYỀN: CHI ĐOÀN TRỰC THUỘC (!isDoanXa)
  // Chỉ hiển thị ô quét mã QR và ô nhập mã xác thực để điểm danh theo yêu cầu!
  // KHÔNG hiển thị form tạo hoạt động, không hiển thị các tab phức tạp.
  // ==========================================================================
  if (!isDoanXa) {
    const userBranchName = currentRole?.branch_name || currentRole?.full_name || '';
    const branchActivities = safeActivities.filter(a => 
      a && isItemTargetedToUser(a.assigned_to || 'ALL', currentRole)
    );

    // Nếu Ban Thường vụ Đoàn xã chưa ban hành hoạt động nào cho Chi đoàn này
    if (branchActivities.length === 0) {
      return (
        <div className="container-fluid px-0">
          <div className="card border-0 shadow-sm rounded-4 mb-3 p-3.5 bg-white">
            <div className="d-flex align-items-center gap-2.5">
              <div className="p-2.5 bg-success-subtle text-success rounded-3">
                <QrCode size={22} />
              </div>
              <div>
                <h5 className="fw-bold text-dark mb-0.5" style={{ fontSize: '16.5px' }}>
                  Điểm Danh Hoạt Động & Sự Kiện
                </h5>
                <div className="text-secondary" style={{ fontSize: '12.5px' }}>
                  Đơn vị: <strong className="text-dark">{userBranchName || 'Chi đoàn trực thuộc'}</strong> • Quét mã QR hoặc nhập mã để xác nhận có mặt
                </div>
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white">
            <div className="p-3.5 bg-success-subtle text-success rounded-circle d-inline-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '64px', height: '64px' }}>
              <Calendar size={32} />
            </div>
            <h5 className="fw-bold text-dark mb-1">Hiện Chưa Có Hoạt Động Cần Điểm Danh</h5>
            <p className="text-secondary mb-0 mx-auto" style={{ maxWidth: '520px', fontSize: '13px', lineHeight: 1.6 }}>
              Ban Thường vụ Đoàn xã chưa ban hành hoạt động cần điểm danh cho đơn vị <strong>{userBranchName}</strong>. Khi có hoạt động mới diễn ra, giao diện điểm danh quét mã QR và nhập mã Code xác thực sẽ tự động xuất hiện tại đây.
            </p>
          </div>
        </div>
      );
    }

    const currentBranchAct = branchActivities.find(a => String(a.id) === String(branchSelectedActId)) 
      || branchActivities[0];

    return (
      <div className="container-fluid px-0">
        {/* Header thông tin điểm danh chi đoàn */}
        <div className="card border-0 shadow-sm rounded-4 mb-3 p-3.5 bg-white">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
            <div className="d-flex align-items-center gap-2.5">
              <div className="p-2.5 bg-success-subtle text-success rounded-3">
                <QrCode size={22} />
              </div>
              <div>
                <h5 className="fw-bold text-dark mb-0.5" style={{ fontSize: '16.5px' }}>
                  Điểm Danh Hoạt Động & Sự Kiện
                </h5>
                <div className="text-secondary" style={{ fontSize: '12.5px' }}>
                  Đơn vị: <strong className="text-dark">{userBranchName || 'Chi đoàn trực thuộc'}</strong> • Quét mã QR hoặc nhập mã để xác nhận có mặt
                </div>
              </div>
            </div>

            {branchActivities.length > 1 && (
              <div className="d-flex align-items-center gap-2">
                <label className="text-muted small mb-0 fw-semibold">Chọn hoạt động:</label>
                <select 
                  className="form-select form-select-sm fw-semibold"
                  value={branchSelectedActId}
                  onChange={(e) => setBranchSelectedActId(e.target.value)}
                  style={{ fontSize: '12.5px', maxWidth: '320px' }}
                >
                  {branchActivities.map(act => (
                    <option key={act.id} value={act.id}>
                      📌 {act.title}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {currentBranchAct?.title && (
            <div className="mt-2.5 pt-2.5 border-top d-flex align-items-center gap-3 flex-wrap" style={{ fontSize: '12.5px' }}>
              <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2.5 py-1 rounded-pill fw-bold">
                📌 {currentBranchAct.title}
              </span>
              {currentBranchAct.time && (
                <span className="text-muted">🕒 <strong>Thời gian:</strong> {currentBranchAct.time}</span>
              )}
              {currentBranchAct.date && (
                <span className="text-muted">📅 <strong>Ngày:</strong> {currentBranchAct.date}</span>
              )}
              {currentBranchAct.location && (
                <span className="text-muted">📍 <strong>Địa điểm:</strong> {currentBranchAct.location}</span>
              )}
            </div>
          )}
        </div>

        {/* Ô quét mã QR & Nhập mã xác thực điểm danh */}
        <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
          <QrAttendanceManager 
            activity={currentBranchAct}
            currentRole={currentRole}
            isDoanXa={false}
            onAttendanceSuccess={(actId, branchName, log) => {
              const stdBranch = normalizeBranchName(branchName);
              onRespondAttendance && onRespondAttendance(actId, stdBranch, true, {
                time: log?.time_str || 'Đã xác nhận có mặt',
                method: log?.verified_by || 'CAMERA_QR',
                latitude: log?.latitude,
                longitude: log?.longitude,
                photo_url: log?.photo_url || null
              });
            }}
          />
        </div>
      </div>
    );
  }

  // ==========================================================================
  // PHÂN QUYỀN: TÀI KHOẢN ADMIN (ĐOÀN XÃ - isDoanXa)
  // Đầy đủ chức năng quản trị: 4 Tabs, Chỉnh sửa, Xóa, Tạo hoạt động, Quản lý GPS
  // ==========================================================================

  // Selected item state: format "act:id" or "task:id"
  const [selectedItemId, setSelectedItemId] = useState('');
  const [activeTab, setActiveTab] = useState('info'); // Default to 'info' for Admin

  // Quick Inline Creation State for Admin
  const [showQuickCreate, setShowQuickCreate] = useState(false);
  const [quickTitle, setQuickTitle] = useState('');

  // Date helper functions
  const getTodayIsoStr = () => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const getTomorrowIsoStr = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const [quickDateIso, setQuickDateIso] = useState(getTodayIsoStr());
  const [quickDatePreset, setQuickDatePreset] = useState('today'); // 'today' | 'tomorrow' | 'custom'

  // Time preset & values
  const [quickTimePreset, setQuickTimePreset] = useState('morning'); // 'morning' | 'afternoon' | 'evening' | 'custom'
  const [quickStartTime, setQuickStartTime] = useState('08:00');
  const [quickEndTime, setQuickEndTime] = useState('11:30');

  // Location, Priority, Scope, Notes
  const [quickLocation, setQuickLocation] = useState('Hội trường UBND Xã Xuân Thới Sơn');
  const [quickPriority, setQuickPriority] = useState('Bình thường'); // 'Bình thường' | 'Quan trọng' | 'Khẩn cấp'
  const [quickAssignedTo, setQuickAssignedTo] = useState('Tất cả 56 Chi đoàn');
  const [quickNotes, setQuickNotes] = useState('');

  const [isSubmittingQuick, setIsSubmittingQuick] = useState(false);
  const [quickErrorMsg, setQuickErrorMsg] = useState('');
  const [quickSuccessMsg, setQuickSuccessMsg] = useState('');

  // Tab "Chi Đoàn" filter & search states
  const [branchSearch, setBranchSearch] = useState('');
  const [branchFilter, setBranchFilter] = useState('ALL'); // 'ALL' | 'dan_cu' | 'truong_hoc' | 'khac'

  // Edit states for "Mục thông tin dựa vào Quản lý hoạt động & Công việc Todo"
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    time: '',
    date: '',
    location: '',
    description: '',
    assigned_to: '',
    priority: 'Bình thường'
  });
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Edit states for "Mục phân công thực hiện do đồng chí nào đảm nhiệm"
  const [isEditingTasks, setIsEditingTasks] = useState(false);
  const [tasksList, setTasksList] = useState([]);
  const [taskSuccessMsg, setTaskSuccessMsg] = useState('');

  // Determine initial selected item when items exist
  useEffect(() => {
    if (!selectedItemId) {
      if (safeActivities.length > 0) {
        setSelectedItemId(`act:${safeActivities[0].id}`);
      } else if (safeTasks.length > 0) {
        setSelectedItemId(`task:${safeTasks[0].id}`);
      }
    } else {
      const isTask = selectedItemId.startsWith('task:');
      const rawId = selectedItemId.replace(/^(act:|task:)/, '');
      if (isTask && !safeTasks.some(t => String(t.id) === String(rawId))) {
        setSelectedItemId(safeActivities.length > 0 ? `act:${safeActivities[0].id}` : (safeTasks.length > 0 ? `task:${safeTasks[0].id}` : ''));
      } else if (!isTask && !safeActivities.some(a => String(a.id) === String(rawId))) {
        setSelectedItemId(safeActivities.length > 0 ? `act:${safeActivities[0].id}` : (safeTasks.length > 0 ? `task:${safeTasks[0].id}` : ''));
      }
    }
  }, [safeActivities, safeTasks, selectedItemId]);

  // Handle Quick Create Activity (Chuẩn dữ liệu, không lỗi, UX hiện đại)
  const handleQuickCreateSubmit = async (e) => {
    if (e) e.preventDefault();
    setQuickErrorMsg('');
    setQuickSuccessMsg('');

    if (!quickTitle.trim()) {
      setQuickErrorMsg('Vui lòng nhập tên hoạt động hoặc chọn một gợi ý nhanh bên dưới!');
      return;
    }

    try {
      setIsSubmittingQuick(true);

      const parts = (quickDateIso || getTodayIsoStr()).split('-');
      const yearVal = parseInt(parts[0], 10) || new Date().getFullYear();
      const monthVal = parts[1] || String(new Date().getMonth() + 1).padStart(2, '0');
      const dayVal = parts[2] || String(new Date().getDate()).padStart(2, '0');
      const formattedDate = `${dayVal}/${monthVal}/${yearVal}`;
      const formattedTime = `${quickStartTime} - ${quickEndTime}`;

      const newId = generateUuid ? generateUuid() : `act-${Date.now()}`;
      const newAct = {
        id: newId,
        title: quickTitle.trim(),
        priority: quickPriority || 'Bình thường',
        day: dayVal,
        month: monthVal,
        year: yearVal,
        dateIso: quickDateIso,
        date: formattedDate,
        time: formattedTime,
        startTime: quickStartTime,
        endTime: quickEndTime,
        location: quickLocation.trim() || 'Hội trường UBND Xã Xuân Thới Sơn',
        description: `Hoạt động phát động điểm danh của Đoàn xã Xuân Thới Sơn dành cho ${quickAssignedTo}.`,
        notes: quickNotes.trim() || 'Đề nghị các Chi đoàn cử lực lượng tham gia đúng giờ, mặc đồng phục áo Thanh niên Việt Nam và quét mã QR xác nhận có mặt.',
        assigned_to: quickAssignedTo,
        status: 'Đang diễn ra',
        confirmedBy: [],
        absentBy: [],
        completedBy: [],
        hasSubTasks: false,
        subTasks: [],
        organizer: 'Đoàn xã Xuân Thới Sơn',
        created_at: new Date().toISOString()
      };

      let finalAct = newAct;
      if (onAddActivity) {
        const res = await onAddActivity(newAct);
        if (res && res.id) finalAct = res;
      } else if (onUpdateActivity) {
        await onUpdateActivity(newAct);
      } else {
        await syncSaveActivity(newAct);
      }

      setQuickTitle('');
      setQuickNotes('');
      setShowQuickCreate(false);
      setSelectedItemId(`act:${finalAct.id || newId}`);
      setActiveTab('attendance'); // Tự động mở tab Điểm danh để quét QR ngay lập tức
      setQuickSuccessMsg(`Đã tạo thành công hoạt động "${newAct.title}"! Đang mở bảng điểm danh...`);
      setTimeout(() => setQuickSuccessMsg(''), 5000);
    } catch (err) {
      console.error('Lỗi khi tạo hoạt động trực tiếp:', err);
      setQuickErrorMsg('Có lỗi xảy ra: ' + (err.message || 'Không thể tạo hoạt động. Vui lòng thử lại.'));
    } finally {
      setIsSubmittingQuick(false);
    }
  };

  const handleSelectTemplate = (tpl) => {
    setQuickTitle(tpl.title);
    if (tpl.priority) setQuickPriority(tpl.priority);
    if (tpl.location) setQuickLocation(tpl.location);
    if (tpl.notes) setQuickNotes(tpl.notes);
    setQuickErrorMsg('');
  };


  // Render Form Tạo Hoạt Động Trực Tiếp (Hiện đại, Sạch sẽ, Chuyên nghiệp)
  const renderActivityCreateForm = (isInlineExpanded = false) => {
    return (
      <div 
        className={`card border-0 shadow-sm rounded-4 overflow-hidden bg-white ${
          isInlineExpanded ? 'mt-3 mb-3 border border-primary-subtle' : 'mx-auto mb-4'
        }`} 
        style={isInlineExpanded ? {} : { maxWidth: '780px' }}
      >
        {/* Header banner */}
        <div className="p-3.5 px-4 bg-light border-bottom d-flex align-items-center justify-content-between flex-wrap gap-2">
          <div className="d-flex align-items-center gap-2.5">
            <div className="p-2 bg-primary-subtle text-primary rounded-3 d-flex align-items-center justify-content-center" style={{ width: '38px', height: '38px' }}>
              <Calendar size={20} />
            </div>
            <div>
              <div className="d-flex align-items-center gap-2">
                <h6 className="fw-bold text-dark mb-0" style={{ fontSize: '15px' }}>
                  Khởi Tạo Hoạt Động & Phát Động Điểm Danh
                </h6>
                <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill" style={{ fontSize: '10.5px' }}>
                  Tạo trực tiếp
                </span>
              </div>
              <div className="text-secondary" style={{ fontSize: '12px' }}>
                Điền nhanh thông tin hoặc chọn mẫu có sẵn để tạo mã QR điểm danh tức thì
              </div>
            </div>
          </div>

          {isInlineExpanded && (
            <button
              type="button"
              className="btn-close"
              onClick={() => setShowQuickCreate(false)}
              title="Đóng bảng tạo nhanh"
            ></button>
          )}
        </div>

        <div className="p-4">
          {/* Error / Success alert */}
          {quickErrorMsg && (
            <div className="alert alert-danger py-2 px-3 rounded-3 d-flex align-items-center gap-2 mb-3 shadow-xs" style={{ fontSize: '12.5px' }}>
              <AlertTriangle size={16} className="text-danger flex-shrink-0" />
              <span>{quickErrorMsg}</span>
            </div>
          )}

          {quickSuccessMsg && (
            <div className="alert alert-success py-2 px-3 rounded-3 d-flex align-items-center gap-2 mb-3 shadow-xs" style={{ fontSize: '12.5px' }}>
              <CheckCircle2 size={16} className="text-success flex-shrink-0" />
              <span>{quickSuccessMsg}</span>
            </div>
          )}

          <form onSubmit={handleQuickCreateSubmit} className="d-flex flex-column gap-3">
            {/* MỤC 1: TÊN HOẠT ĐỘNG & GỢI Ý MẪU MỘT CHẠM */}
            <div>
              <div className="d-flex align-items-center justify-content-between mb-1.5 flex-wrap gap-1">
                <label className="form-label fw-bold text-dark mb-0 d-flex align-items-center gap-1" style={{ fontSize: '13px' }}>
                  <span>Tên hoạt động / cuộc họp / phong trào</span>
                  <span className="text-danger">*</span>
                </label>
                <span className="text-muted" style={{ fontSize: '11.5px' }}>
                  (Nhập tên hoặc nhấn gợi ý mẫu bên dưới)
                </span>
              </div>
              <input
                type="text"
                className="form-control form-control-lg fw-semibold"
                style={{ fontSize: '14.5px', borderRadius: '10px' }}
                placeholder="Ví dụ: Hội nghị Ban Chấp hành Đoàn xã mở rộng..."
                value={quickTitle}
                onChange={(e) => {
                  setQuickTitle(e.target.value);
                  if (quickErrorMsg) setQuickErrorMsg('');
                }}
                autoFocus={!isInlineExpanded}
              />

              {/* Mẫu gợi ý nhanh 1 chạm */}
              <div className="mt-2.5">
                <div className="d-flex align-items-center gap-1.5 text-muted mb-1.5" style={{ fontSize: '11.5px' }}>
                  <span className="fw-bold text-primary">⚡ Mẫu gợi ý nhanh (1-chạm điền ngay):</span>
                </div>
                <div className="d-flex flex-wrap gap-1.5">
                  {QUICK_TEMPLATES.map((tpl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className="btn btn-sm btn-light border rounded-pill px-2.5 py-1 text-dark d-inline-flex align-items-center gap-1 hover-shadow-xs transition-all"
                      style={{ 
                        fontSize: '11.5px', 
                        backgroundColor: quickTitle === tpl.title ? '#e0f2fe' : '#f8fafc', 
                        borderColor: quickTitle === tpl.title ? '#0284c7' : '#e2e8f0' 
                      }}
                      onClick={() => handleSelectTemplate(tpl)}
                      title="Nhấn để tự động điền mẫu này"
                    >
                      <span>{tpl.icon}</span>
                      <span className="fw-medium">{tpl.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* MỤC 2: THỜI GIAN & NGÀY THÁNG */}
            <div className="p-3 bg-light rounded-3 border">
              <div className="row g-3">
                {/* CỘT NGÀY THÁNG */}
                <div className="col-12 col-md-6">
                  <div className="d-flex align-items-center justify-content-between mb-1">
                    <label className="form-label fw-bold text-dark mb-0 d-flex align-items-center gap-1" style={{ fontSize: '12.5px' }}>
                      <Calendar size={14} className="text-primary" />
                      <span>Ngày tổ chức:</span>
                    </label>
                    <span className="text-primary fw-semibold" style={{ fontSize: '11.5px' }}>
                      {(() => {
                        const [y, m, d] = (quickDateIso || getTodayIsoStr()).split('-');
                        return `${d}/${m}/${y}`;
                      })()}
                    </span>
                  </div>

                  {/* Pills chọn ngày */}
                  <div className="d-flex gap-1 mb-2">
                    <button
                      type="button"
                      className={`btn btn-sm flex-grow-1 py-1 px-2 rounded-2 fw-semibold ${quickDatePreset === 'today' ? 'btn-primary text-white shadow-xs' : 'btn-white border text-dark'}`}
                      style={{ fontSize: '11.5px' }}
                      onClick={() => {
                        setQuickDatePreset('today');
                        setQuickDateIso(getTodayIsoStr());
                      }}
                    >
                      Hôm nay
                    </button>
                    <button
                      type="button"
                      className={`btn btn-sm flex-grow-1 py-1 px-2 rounded-2 fw-semibold ${quickDatePreset === 'tomorrow' ? 'btn-primary text-white shadow-xs' : 'btn-white border text-dark'}`}
                      style={{ fontSize: '11.5px' }}
                      onClick={() => {
                        setQuickDatePreset('tomorrow');
                        setQuickDateIso(getTomorrowIsoStr());
                      }}
                    >
                      Ngày mai
                    </button>
                    <button
                      type="button"
                      className={`btn btn-sm flex-grow-1 py-1 px-2 rounded-2 fw-semibold ${quickDatePreset === 'custom' ? 'btn-primary text-white shadow-xs' : 'btn-white border text-dark'}`}
                      style={{ fontSize: '11.5px' }}
                      onClick={() => setQuickDatePreset('custom')}
                    >
                      Ngày khác
                    </button>
                  </div>

                  <input
                    type="date"
                    className="form-control form-control-sm bg-white"
                    style={{ fontSize: '12.5px' }}
                    value={quickDateIso}
                    onChange={(e) => {
                      setQuickDateIso(e.target.value);
                      setQuickDatePreset('custom');
                    }}
                  />
                </div>

                {/* CỘT KHUNG GIỜ */}
                <div className="col-12 col-md-6">
                  <div className="d-flex align-items-center justify-content-between mb-1">
                    <label className="form-label fw-bold text-dark mb-0 d-flex align-items-center gap-1" style={{ fontSize: '12.5px' }}>
                      <Clock size={14} className="text-primary" />
                      <span>Khung giờ:</span>
                    </label>
                    <span className="text-primary fw-semibold" style={{ fontSize: '11.5px' }}>
                      {quickStartTime} - {quickEndTime}
                    </span>
                  </div>

                  {/* Pills chọn buổi */}
                  <div className="d-flex gap-1 mb-2">
                    <button
                      type="button"
                      className={`btn btn-sm flex-grow-1 py-1 px-1.5 rounded-2 fw-semibold ${quickTimePreset === 'morning' ? 'btn-primary text-white shadow-xs' : 'btn-white border text-dark'}`}
                      style={{ fontSize: '11.5px' }}
                      onClick={() => {
                        setQuickTimePreset('morning');
                        setQuickStartTime('08:00');
                        setQuickEndTime('11:30');
                      }}
                    >
                      Sáng (8h-11h30)
                    </button>
                    <button
                      type="button"
                      className={`btn btn-sm flex-grow-1 py-1 px-1.5 rounded-2 fw-semibold ${quickTimePreset === 'afternoon' ? 'btn-primary text-white shadow-xs' : 'btn-white border text-dark'}`}
                      style={{ fontSize: '11.5px' }}
                      onClick={() => {
                        setQuickTimePreset('afternoon');
                        setQuickStartTime('13:30');
                        setQuickEndTime('17:00');
                      }}
                    >
                      Chiều (13h30-17h)
                    </button>
                    <button
                      type="button"
                      className={`btn btn-sm flex-grow-1 py-1 px-1.5 rounded-2 fw-semibold ${quickTimePreset === 'evening' ? 'btn-primary text-white shadow-xs' : 'btn-white border text-dark'}`}
                      style={{ fontSize: '11.5px' }}
                      onClick={() => {
                        setQuickTimePreset('evening');
                        setQuickStartTime('18:30');
                        setQuickEndTime('21:00');
                      }}
                    >
                      Tối (18h30-21h)
                    </button>
                    <button
                      type="button"
                      className={`btn btn-sm py-1 px-2 rounded-2 fw-semibold ${quickTimePreset === 'custom' ? 'btn-primary text-white shadow-xs' : 'btn-white border text-dark'}`}
                      style={{ fontSize: '11.5px' }}
                      onClick={() => setQuickTimePreset('custom')}
                    >
                      Tuỳ chỉnh
                    </button>
                  </div>

                  {/* Custom Time inputs */}
                  <div className="d-flex align-items-center gap-1.5">
                    <input
                      type="time"
                      className="form-control form-control-sm bg-white"
                      style={{ fontSize: '12.5px' }}
                      value={quickStartTime}
                      onChange={(e) => {
                        setQuickStartTime(e.target.value);
                        setQuickTimePreset('custom');
                      }}
                    />
                    <span className="text-muted fw-bold">-</span>
                    <input
                      type="time"
                      className="form-control form-control-sm bg-white"
                      style={{ fontSize: '12.5px' }}
                      value={quickEndTime}
                      onChange={(e) => {
                        setQuickEndTime(e.target.value);
                        setQuickTimePreset('custom');
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* MỤC 3: ĐỊA ĐIỂM & ĐỐI TƯỢNG TRIỆU TẬP */}
            <div className="row g-3">
              <div className="col-12 col-md-7">
                <label className="form-label fw-bold text-dark mb-1 d-flex align-items-center gap-1" style={{ fontSize: '12.5px' }}>
                  <MapPin size={14} className="text-danger" />
                  <span>Địa điểm tổ chức:</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  style={{ fontSize: '13px' }}
                  placeholder="Ví dụ: Hội trường UBND Xã Xuân Thới Sơn"
                  value={quickLocation}
                  onChange={(e) => setQuickLocation(e.target.value)}
                />
                <div className="d-flex flex-wrap gap-1 mt-1.5">
                  {QUICK_VENUE_LIST.slice(0, 4).map((loc, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className="btn btn-sm btn-link text-decoration-none p-0 text-secondary hover-text-primary"
                      style={{ fontSize: '11px' }}
                      onClick={() => setQuickLocation(loc)}
                    >
                      📍 {loc} •
                    </button>
                  ))}
                </div>
              </div>

              <div className="col-12 col-md-5">
                <label className="form-label fw-bold text-dark mb-1 d-flex align-items-center gap-1" style={{ fontSize: '12.5px' }}>
                  <Users size={14} className="text-primary" />
                  <span>Phạm vi triệu tập:</span>
                </label>
                <select
                  className="form-select fw-semibold"
                  style={{ fontSize: '13px' }}
                  value={quickAssignedTo}
                  onChange={(e) => setQuickAssignedTo(e.target.value)}
                >
                  <option value="Tất cả 56 Chi đoàn">Tất cả 56 Chi đoàn (Toàn xã)</option>
                  <option value="30 Chi đoàn Ấp">30 Chi đoàn Ấp (Khu dân cư)</option>
                  <option value="Khối Trường học">Khối Chi đoàn Trường học (16 Chi đoàn)</option>
                  <option value="Khối Cơ quan - Lực lượng vũ trang">Khối Cơ quan - LLVT (10 Chi đoàn)</option>
                </select>
              </div>
            </div>

            {/* MỤC 4: ĐỘ ƯU TIÊN & GHI CHÚ */}
            <div className="row g-3">
              <div className="col-12 col-md-5">
                <label className="form-label fw-bold text-dark mb-1" style={{ fontSize: '12.5px' }}>
                  Mức độ ưu tiên:
                </label>
                <div className="d-flex gap-1.5">
                  {[
                    { id: 'Bình thường', label: 'Bình thường', color: 'primary' },
                    { id: 'Quan trọng', label: 'Quan trọng', color: 'warning' },
                    { id: 'Khẩn cấp', label: 'Khẩn cấp', color: 'danger' }
                  ].map(p => {
                    const isSelected = quickPriority === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        className={`btn btn-sm flex-grow-1 py-1 px-2 rounded-2 fw-semibold border ${
                          isSelected ? `btn-${p.color} text-white shadow-xs` : 'btn-light text-dark'
                        }`}
                        style={{ fontSize: '11.5px' }}
                        onClick={() => setQuickPriority(p.id)}
                      >
                        {p.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="col-12 col-md-7">
                <label className="form-label fw-bold text-dark mb-1" style={{ fontSize: '12.5px' }}>
                  Ghi chú / Nhắc nhở trang phục:
                </label>
                <input
                  type="text"
                  className="form-control"
                  style={{ fontSize: '13px' }}
                  placeholder="VD: Trang phục áo Thanh niên Việt Nam, có mặt trước 15 phút..."
                  value={quickNotes}
                  onChange={(e) => setQuickNotes(e.target.value)}
                />
              </div>
            </div>

            {/* MỤC 5: ACTION BUTTONS */}
            <div className="pt-3 border-top d-flex align-items-center justify-content-between flex-wrap gap-2">
              <div>
                {onOpenCreateActivity && (
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary px-3 py-2 rounded-3 fw-semibold d-inline-flex align-items-center gap-1.5 shadow-xs"
                    style={{ fontSize: '12.5px' }}
                    onClick={onOpenCreateActivity}
                  >
                    <FileText size={14} />
                    <span>Mở form đầy đủ (Đính kèm PDF)</span>
                  </button>
                )}
              </div>

              <div className="d-flex align-items-center gap-2">
                {isInlineExpanded && (
                  <button
                    type="button"
                    className="btn btn-sm btn-light border px-3 py-2 rounded-3 fw-semibold text-secondary"
                    style={{ fontSize: '12.5px' }}
                    onClick={() => setShowQuickCreate(false)}
                  >
                    Đóng
                  </button>
                )}

                <button
                  type="submit"
                  disabled={isSubmittingQuick}
                  className="btn btn-primary d-inline-flex align-items-center gap-2 px-4 py-2 rounded-3 fw-bold shadow hover-scale"
                  style={{
                    fontSize: '13.5px',
                    backgroundColor: '#0066FF',
                    borderColor: '#0066FF'
                  }}
                >
                  {isSubmittingQuick ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      <span>Đang khởi tạo...</span>
                    </>
                  ) : (
                    <>
                      <Plus size={17} />
                      <span>Tạo hoạt động & Bắt đầu điểm danh</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  };


  // Parse whether selected item is an Activity or a Todo Task
  const isSelectedTask = selectedItemId.startsWith('task:');
  const rawId = selectedItemId.replace(/^(act:|task:)/, '');

  const currentActivity = !isSelectedTask 
    ? (safeActivities.find(a => String(a.id) === String(rawId)) || safeActivities[0] || null)
    : null;

  const currentTask = isSelectedTask 
    ? (safeTasks.find(t => String(t.id) === String(rawId)) || safeTasks[0] || null)
    : null;

  const currentItem = currentActivity || currentTask || null;

  const timeStatus = typeof getActivityTimeStatus === 'function' && currentActivity
    ? getActivityTimeStatus(currentActivity) 
    : { 
        statusText: currentTask ? (currentTask.status === 'completed' ? 'Đã hoàn thành' : currentTask.status === 'inProgress' ? 'Đang thực hiện' : 'Cần làm') : 'Đang diễn ra', 
        code: currentTask?.status === 'completed' ? 'FINISHED' : 'ONGOING' 
      };

  // Sync tasksList for Tab "Phân Công" when current item changes
  useEffect(() => {
    if (currentActivity?.subTasks && Array.isArray(currentActivity.subTasks)) {
      setTasksList(currentActivity.subTasks);
    } else {
      setTasksList([]);
    }
    setIsEditingTasks(false);
  }, [selectedItemId, currentActivity]);

  // Open edit for item info
  const handleOpenEdit = () => {
    if (!currentItem) return;
    const itemDate = currentItem.date || currentItem.dueDate || (
      currentItem.day && currentItem.month && currentItem.year 
        ? `${currentItem.day}/${currentItem.month}/${currentItem.year}` 
        : 'Hôm nay'
    );
    setEditForm({
      title: currentItem.title || '',
      time: currentItem.time || '08:00 - 11:30',
      date: itemDate,
      location: currentItem.location || 'Hội trường UBND xã Xuân Thới Sơn',
      description: currentItem.description || '',
      assigned_to: currentItem.assigned_to || 'Tất cả 56 Chi đoàn',
      priority: currentItem.priority || 'Bình thường'
    });
    setIsEditingInfo(true);
    setSaveSuccessMsg('');
  };

  // Delete item handler
  const handleDeleteItem = async () => {
    if (!currentItem) return;
    const itemType = isSelectedTask ? 'công việc Todo' : 'hoạt động';
    const itemTitle = currentItem?.title || '';
    if (!window.confirm(`Bạn có chắc chắn muốn xóa ${itemType} "${itemTitle}" khỏi hệ thống không?`)) {
      return;
    }

    if (isSelectedTask) {
      if (onDeleteTask) {
        await onDeleteTask(currentTask.id, currentTask.title);
      } else {
        await syncDeleteTask(currentTask.id);
      }
    } else {
      if (onDeleteActivity) {
        await onDeleteActivity(currentActivity.id, currentActivity.title);
      } else {
        await syncDeleteActivity(currentActivity.id, currentActivity.title);
      }
    }

    setIsEditingInfo(false);
    setSelectedItemId('');
  };

  // Save changes to item
  const handleSaveEdit = async () => {
    if (!editForm.title.trim()) {
      alert('Vui lòng nhập tên công việc / hoạt động!');
      return;
    }

    let day = currentItem.day || '23';
    let month = currentItem.month || '10';
    let year = currentItem.year || 2026;

    if (editForm.date) {
      const match = editForm.date.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
      if (match) {
        day = match[1].padStart(2, '0');
        month = match[2].padStart(2, '0');
        year = parseInt(match[3], 10);
      }
    }

    if (!isSelectedTask) {
      const updatedAct = {
        ...currentActivity,
        title: editForm.title.trim(),
        time: editForm.time.trim(),
        date: editForm.date.trim(),
        day,
        month,
        year,
        location: editForm.location.trim(),
        description: editForm.description.trim(),
        assigned_to: editForm.assigned_to.trim(),
        priority: editForm.priority
      };

      if (onUpdateActivity) {
        await onUpdateActivity(updatedAct);
      } else {
        await syncSaveActivity(updatedAct);
      }
      setSaveSuccessMsg(`Đã cập nhật hoạt động "${updatedAct.title}" thành công!`);
    } else {
      const updatedTask = {
        ...currentTask,
        title: editForm.title.trim(),
        description: editForm.description.trim(),
        dueDate: editForm.date.trim(),
        due_date: editForm.date.trim(),
        assigned_to: editForm.assigned_to.trim(),
        priority: editForm.priority
      };

      if (onUpdateTask) {
        await onUpdateTask(updatedTask);
      } else {
        await syncSaveTask(updatedTask);
      }
      setSaveSuccessMsg(`Đã cập nhật công việc "${updatedTask.title}" thành công!`);
    }

    setIsEditingInfo(false);
    setTimeout(() => setSaveSuccessMsg(''), 5000);
  };

  // Handlers for Assignments (Tab Phân công)
  const handleAddTaskRow = () => {
    const newTask = {
      id: `task-${Date.now()}`,
      task: '',
      branch: 'Chi đoàn trực thuộc',
      officer: 'Đ/c Phụ trách',
      deadline: currentItem?.time || 'Trước 08:00',
      status: 'Chờ thực hiện',
      notes: ''
    };
    setTasksList([...tasksList, newTask]);
    setIsEditingTasks(true);
  };

  const handleUpdateTaskField = (index, field, value) => {
    const updated = [...tasksList];
    updated[index] = { ...updated[index], [field]: value };
    setTasksList(updated);
  };

  const handleDeleteTaskRow = (index) => {
    const updated = tasksList.filter((_, i) => i !== index);
    setTasksList(updated);
  };

  const handleSaveTasks = async () => {
    if (!isSelectedTask && currentActivity) {
      const updatedAct = {
        ...currentActivity,
        subTasks: tasksList,
        hasSubTasks: tasksList.length > 0
      };

      if (onUpdateActivity) {
        await onUpdateActivity(updatedAct);
      } else {
        await syncSaveActivity(updatedAct);
      }
    }
    setIsEditingTasks(false);
    setTaskSuccessMsg('Đã cập nhật danh sách phân công nhiệm vụ thành công!');
    setTimeout(() => setTaskSuccessMsg(''), 5000);
  };

  // Filter 56 Branches for Tab "Chi Đoàn"
  const filteredBranches = ALL_BRANCHES.filter(b => {
    const matchSearch = !branchSearch || b.name.toLowerCase().includes(branchSearch.toLowerCase()) || (b.secretary_name && b.secretary_name.toLowerCase().includes(branchSearch.toLowerCase()));
    if (!matchSearch) return false;

    if (branchFilter === 'dan_cu') {
      return b.id && b.id.startsWith('ap-');
    }
    if (branchFilter === 'truong_hoc') {
      return b.id && b.id.includes('school');
    }
    if (branchFilter === 'khac') {
      return !b.id.startsWith('ap-') && !b.id.includes('school');
    }
    return true;
  });

  // Admin Empty State (Khi chưa có hoạt động nào)
  const hasItems = safeActivities.length > 0 || safeTasks.length > 0;

  if (!hasItems) {
    return (
      <div className="container-fluid px-0">
        <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white text-center mb-4">
          <div className="mx-auto mb-3 p-3 bg-primary-subtle text-primary rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width: '70px', height: '70px' }}>
            <Calendar size={36} />
          </div>

          <h4 className="fw-bold text-dark mb-2" style={{ fontSize: '20px' }}>
            Quản Lý Hoạt Động & Điểm Danh
          </h4>
          <p className="text-secondary mb-4 mx-auto" style={{ maxWidth: '540px', fontSize: '14px', lineHeight: 1.6 }}>
            Hệ thống đang ở trạng thái sạch. Đồng chí có thể tạo hoạt động trực tiếp bên dưới hoặc chọn mẫu nhanh một chạm để phát động đến các Chi đoàn và bắt đầu tạo mã QR điểm danh:
          </p>

          {renderActivityCreateForm(false)}
        </div>
      </div>
    );
  }

  // Admin Workspace View (Khi đã có hoạt động)
  return (
    <div className="container-fluid px-0">
      {/* Top Bar: Selector chọn hoạt động hoặc công việc Todo */}
      <div className="card border-0 shadow-sm rounded-4 mb-3 p-3 bg-white">
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
          <div className="d-flex align-items-center gap-2 flex-grow-1" style={{ minWidth: '280px' }}>
            <label className="fw-bold text-dark mb-0 flex-shrink-0 d-flex align-items-center gap-1.5" style={{ fontSize: '13.5px' }}>
              <Calendar size={18} className="text-primary" />
              <span>Nội Dung Theo Dõi & Điểm Danh:</span>
            </label>
            <select
              className="form-select form-select-sm fw-semibold"
              value={selectedItemId}
              onChange={(e) => {
                setSelectedItemId(e.target.value);
                setIsEditingInfo(false);
                setIsEditingTasks(false);
              }}
              style={{ fontSize: '13px', maxWidth: '520px' }}
            >
              {/* NHÓM 1: TỪ QUẢN LÝ HOẠT ĐỘNG */}
              {safeActivities.length > 0 && (
                <optgroup label="📌 HOẠT ĐỘNG (Từ Quản lý hoạt động)">
                  {safeActivities.map(act => (
                    <option key={act.id} value={`act:${act.id}`}>
                      📌 {act.title} ({act.date || act.dueDate || (act.day && act.month ? `${act.day}/${act.month}` : 'Hoạt động')})
                    </option>
                  ))}
                </optgroup>
              )}

              {/* NHÓM 2: TỪ CÔNG VIỆC TODO */}
              {safeTasks.length > 0 && (
                <optgroup label="📋 CÔNG VIỆC & NHIỆM VỤ (Từ Todo List)">
                  {safeTasks.map(task => (
                    <option key={task.id} value={`task:${task.id}`}>
                      📋 {task.title} ({task.dueDate || task.due_date ? `Hạn: ${task.dueDate || task.due_date}` : 'Công việc Todo'})
                    </option>
                  ))}
                </optgroup>
              )}
            </select>
          </div>

          <div className="d-flex align-items-center gap-2">
            <button
              type="button"
              className={`btn btn-sm d-inline-flex align-items-center gap-1 px-3 py-1.5 rounded-3 fw-bold shadow-xs transition-all ${
                showQuickCreate ? 'btn-primary text-white' : 'btn-outline-primary'
              }`}
              style={{ fontSize: '12.5px' }}
              onClick={() => setShowQuickCreate(!showQuickCreate)}
              title="Mở form tạo nhanh hoạt động mới trực tiếp"
            >
              <Plus size={14} />
              <span>{showQuickCreate ? '✕ Đóng tạo nhanh' : '+ Tạo nhanh hoạt động'}</span>
            </button>

            {onOpenCreateActivity && (
              <button
                type="button"
                className="btn btn-sm btn-light border d-inline-flex align-items-center gap-1 px-2.5 py-1.5 rounded-3 fw-semibold text-secondary"
                style={{ fontSize: '12px' }}
                onClick={onOpenCreateActivity}
                title="Mở form tạo chi tiết có đính kèm file PDF văn bản"
              >
                <FileText size={13} />
                <span>Mẫu chi tiết / PDF</span>
              </button>
            )}

            {currentItem && (
              <span className={`badge px-2.5 py-1 rounded-pill ${
                timeStatus.code === 'FINISHED' ? 'bg-secondary-subtle text-secondary' : 'bg-success-subtle text-success border border-success-subtle'
              }`} style={{ fontSize: '12px' }}>
                {timeStatus.statusText}
              </span>
            )}
          </div>
        </div>

        {/* Inline Quick Create Bar if toggled */}
        {showQuickCreate && renderActivityCreateForm(true)}
      </div>

      {/* Main Container Card with 4 Tabs: Thông Tin | Điểm Danh | Chi Đoàn | Phân Công */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
        {/* Navigation Tabs Header */}
        <div className="border-bottom bg-white px-3 pt-2">
          <div className="d-flex align-items-center gap-1 overflow-x-auto">
            {[
              { id: 'info', label: 'Thông Tin', icon: 'ℹ️' },
              { id: 'attendance', label: 'Điểm Danh', icon: '📷', isMain: true },
              { id: 'members', label: 'Chi Đoàn', icon: '👥' },
              { id: 'tasks', label: 'Phân Công', icon: '📋' }
            ].map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  className={`btn btn-link text-decoration-none px-4 py-2.5 border-0 position-relative d-inline-flex align-items-center gap-1.5 fw-bold transition-all ${
                    isActive ? 'text-success' : 'text-secondary hover-text-dark'
                  }`}
                  style={{
                    fontSize: '13.5px',
                    borderBottom: isActive ? '3px solid #0c3b2e' : '3px solid transparent',
                    borderRadius: 0,
                    color: isActive ? '#0c3b2e' : '#64748b'
                  }}
                  onClick={() => {
                    setActiveTab(tab.id);
                    if (tab.id !== 'info') setIsEditingInfo(false);
                    if (tab.id !== 'tasks') setIsEditingTasks(false);
                  }}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Body */}
        <div className="p-4">
          {/* TAB 1: ĐIỂM DANH (XÁC THỰC GPS & MÃ QR) */}
          {activeTab === 'attendance' && currentItem && (
            <QrAttendanceManager 
              activity={currentActivity || { id: currentTask?.id, title: currentTask?.title, ...currentItem }}
              currentRole={currentRole}
              isDoanXa={true}
              onAttendanceSuccess={(actId, branch, log) => {
                onRespondAttendance && onRespondAttendance(actId, branch, true, '', currentItem?.title);
                onConfirmReceipt && onConfirmReceipt('activity', currentItem);
              }}
            />
          )}

          {/* TAB 2: THÔNG TIN (DỰA VÀO PHẦN QUẢN LÝ HOẠT ĐỘNG VÀ CÔNG VIỆC TODO) */}
          {activeTab === 'info' && currentItem && (
            <div>
              {saveSuccessMsg && (
                <div className="alert alert-success py-2 px-3 rounded-3 d-flex align-items-center gap-2 mb-3 shadow-xs" style={{ fontSize: '13px' }}>
                  <CheckCircle2 size={16} className="text-success flex-shrink-0" />
                  <span>{saveSuccessMsg}</span>
                </div>
              )}

              {isEditingInfo ? (
                /* FORM CHỈNH SỬA THÔNG TIN - CÓ NÚT XÓA Ở TRONG NÚT CHỈNH SỬA */
                <div className="card border border-primary-subtle shadow-sm rounded-4 p-4 bg-white mb-4">
                  <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom flex-wrap gap-2">
                    <div className="d-flex align-items-center gap-2">
                      <div className="p-2 bg-primary-subtle rounded-3 text-primary">
                        <Edit3 size={18} />
                      </div>
                      <div>
                        <h6 className="fw-bold text-dark mb-0" style={{ fontSize: '15px' }}>
                          Chỉnh sửa thông tin {isSelectedTask ? 'Công việc Todo' : 'Hoạt động'}
                        </h6>
                        <div className="text-muted" style={{ fontSize: '11.5px' }}>
                          Cập nhật dữ liệu hoặc xóa khỏi hệ thống
                        </div>
                      </div>
                    </div>

                    <div className="d-flex align-items-center gap-2">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger d-inline-flex align-items-center gap-1.5 px-3 py-1 rounded-3 fw-bold hover-scale"
                        style={{ fontSize: '12px' }}
                        onClick={handleDeleteItem}
                        title={`Xóa hoàn toàn ${isSelectedTask ? 'công việc' : 'hoạt động'} này khỏi hệ thống`}
                      >
                        <Trash2 size={14} />
                        <span>Xóa {isSelectedTask ? 'công việc' : 'hoạt động'}</span>
                      </button>

                      <button 
                        type="button" 
                        className="btn-close" 
                        onClick={() => setIsEditingInfo(false)}
                        title="Đóng chỉnh sửa"
                      ></button>
                    </div>
                  </div>

                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label fw-bold text-dark mb-1" style={{ fontSize: '12.5px' }}>
                        Tên {isSelectedTask ? 'công việc' : 'hoạt động'} <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control fw-semibold"
                        style={{ fontSize: '13.5px' }}
                        value={editForm.title}
                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                        placeholder="Nhập tên..."
                      />
                    </div>

                    {!isSelectedTask && (
                      <div className="col-12 col-md-6">
                        <label className="form-label fw-bold text-dark mb-1 d-flex align-items-center gap-1" style={{ fontSize: '12.5px' }}>
                          <Clock size={14} className="text-primary" />
                          <span>Thời gian</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          style={{ fontSize: '13px' }}
                          value={editForm.time}
                          onChange={(e) => setEditForm({ ...editForm, time: e.target.value })}
                          placeholder="Ví dụ: 08:00 - 11:30"
                        />
                      </div>
                    )}

                    <div className="col-12 col-md-6">
                      <label className="form-label fw-bold text-dark mb-1 d-flex align-items-center gap-1" style={{ fontSize: '12.5px' }}>
                        <Calendar size={14} className="text-primary" />
                        <span>{isSelectedTask ? 'Hạn hoàn thành (Deadline)' : 'Ngày tháng tổ chức'}</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        style={{ fontSize: '13px' }}
                        value={editForm.date}
                        onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                        placeholder="Ví dụ: 23/10/2026 hoặc Hôm nay"
                      />
                    </div>

                    {!isSelectedTask && (
                      <div className="col-12 col-md-6">
                        <label className="form-label fw-bold text-dark mb-1 d-flex align-items-center gap-1" style={{ fontSize: '12.5px' }}>
                          <MapPin size={14} className="text-danger" />
                          <span>Địa điểm tổ chức</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          style={{ fontSize: '13px' }}
                          value={editForm.location}
                          onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                          placeholder="Ví dụ: Hội trường UBND xã Xuân Thới Sơn"
                        />
                      </div>
                    )}

                    <div className="col-12 col-md-6">
                      <label className="form-label fw-bold text-dark mb-1 d-flex align-items-center gap-1" style={{ fontSize: '12.5px' }}>
                        <Building size={14} className="text-primary" />
                        <span>Đơn vị phụ trách / Triệu tập</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        style={{ fontSize: '13px' }}
                        value={editForm.assigned_to}
                        onChange={(e) => setEditForm({ ...editForm, assigned_to: e.target.value })}
                        placeholder="Ví dụ: Tất cả 56 Chi đoàn"
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-bold text-dark mb-1" style={{ fontSize: '12.5px' }}>
                        Mô tả / Kế hoạch chi tiết
                      </label>
                      <textarea
                        className="form-control"
                        rows={3}
                        style={{ fontSize: '13px' }}
                        value={editForm.description}
                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                        placeholder="Nhập mô tả nội dung..."
                      />
                    </div>
                  </div>

                  <div className="d-flex align-items-center justify-content-between mt-4 pt-3 border-top flex-wrap gap-2">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger d-inline-flex align-items-center gap-1.5 px-3 py-1.5 rounded-3 fw-semibold"
                      style={{ fontSize: '12.5px' }}
                      onClick={handleDeleteItem}
                    >
                      <Trash2 size={15} />
                      <span>Xóa bỏ mục này</span>
                    </button>

                    <div className="d-flex align-items-center gap-2">
                      <button
                        type="button"
                        className="btn btn-sm btn-light border px-3 py-1.5 rounded-3 fw-semibold text-secondary"
                        style={{ fontSize: '12.5px' }}
                        onClick={() => setIsEditingInfo(false)}
                      >
                        ✕ Hủy bỏ
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-primary px-3.5 py-1.5 rounded-3 fw-bold text-white shadow-xs d-inline-flex align-items-center gap-1.5 hover-scale"
                        style={{ fontSize: '12.5px', backgroundColor: '#0066FF', borderColor: '#0066FF' }}
                        onClick={handleSaveEdit}
                      >
                        <CheckCircle2 size={15} />
                        <span>Lưu thay đổi</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* GIAO DIỆN HIỂN THỊ THÔNG TIN CHI TIẾT TỪ HOẠT ĐỘNG & TODO */
                <div>
                  {/* Top Header Card */}
                  <div className="p-4 bg-light rounded-4 border mb-3 position-relative">
                    <div className="d-flex align-items-start justify-content-between gap-3 mb-2 flex-wrap">
                      <div>
                        <div className="d-flex align-items-center gap-2 mb-1.5 flex-wrap">
                          <span className={`badge px-2.5 py-1 rounded-pill fw-bold ${
                            isSelectedTask ? 'bg-purple-subtle text-purple border border-purple-subtle' : 'bg-primary-subtle text-primary border border-primary-subtle'
                          }`} style={{ fontSize: '11px', backgroundColor: isSelectedTask ? '#f3e8ff' : '#eff6ff', color: isSelectedTask ? '#7e22ce' : '#0066FF' }}>
                            {isSelectedTask ? '📋 Nguồn: Công việc (Todo)' : '📌 Nguồn: Quản lý hoạt động'}
                          </span>

                          <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-2.5 py-1 rounded-pill fw-bold" style={{ fontSize: '11px' }}>
                            Ưu tiên: {currentItem.priority || 'Bình thường'}
                          </span>

                          <span className="badge bg-success-subtle text-success border border-success-subtle px-2.5 py-1 rounded-pill fw-bold" style={{ fontSize: '11px' }}>
                            {isSelectedTask 
                              ? (currentTask.status === 'completed' ? '✅ Đã hoàn thành' : currentTask.status === 'inProgress' ? '🔄 Đang tiến hành' : '⏳ Cần làm')
                              : (timeStatus?.statusText || currentActivity?.status || 'Đang diễn ra')}
                          </span>
                        </div>

                        <h5 className="fw-bold text-dark mb-0 pe-2" style={{ fontSize: '16.5px', lineHeight: 1.4 }}>
                          {currentItem.title}
                        </h5>
                      </div>

                      <div className="d-flex align-items-center gap-2 flex-shrink-0">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary fw-semibold d-inline-flex align-items-center gap-1.5 px-3 py-1.5 rounded-3 shadow-xs hover-scale"
                          style={{ fontSize: '12.5px', backgroundColor: '#eff6ff' }}
                          onClick={handleOpenEdit}
                          title="Chỉnh sửa thông tin trực tiếp đồng bộ với Quản lý hoạt động & Công việc Todo"
                        >
                          <Edit3 size={14} className="text-primary" />
                          <span>Chỉnh sửa</span>
                        </button>

                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger fw-semibold d-inline-flex align-items-center gap-1 px-2.5 py-1.5 rounded-3 shadow-xs hover-scale"
                          style={{ fontSize: '12.5px' }}
                          onClick={handleDeleteItem}
                          title={`Xóa ${isSelectedTask ? 'công việc' : 'hoạt động'} này`}
                        >
                          <Trash2 size={14} />
                          <span>Xóa</span>
                        </button>
                      </div>
                    </div>

                    <div className="text-secondary mt-2" style={{ fontSize: '13px', lineHeight: 1.6 }}>
                      {currentItem.description || 'Hoạt động trọng tâm do Ban Thường vụ Đoàn TNCS Hồ Chí Minh Xã Xuân Thới Sơn phát động và theo dõi tiến độ thực hiện.'}
                    </div>
                  </div>

                  {/* Grid 4 Box Thông Tin Chi Tiết */}
                  <div className="row g-3 mb-4">
                    <div className="col-12 col-md-6 col-lg-3">
                      <div className="p-3 bg-white rounded-3 border h-100 shadow-xs">
                        <div className="text-muted mb-1 d-flex align-items-center gap-1" style={{ fontSize: '11.5px' }}>
                          <Clock size={13} className="text-primary" />
                          <span>Thời gian & Ngày:</span>
                        </div>
                        <div className="fw-semibold text-dark" style={{ fontSize: '13px' }}>
                          {isSelectedTask 
                            ? `Hạn: ${currentTask.dueDate || currentTask.due_date || 'Hôm nay'}`
                            : `${currentActivity?.time || '08:00 - 11:30'} ngày ${currentActivity?.date || 'Hôm nay'}`}
                        </div>
                      </div>
                    </div>

                    <div className="col-12 col-md-6 col-lg-3">
                      <div className="p-3 bg-white rounded-3 border h-100 shadow-xs">
                        <div className="text-muted mb-1 d-flex align-items-center gap-1" style={{ fontSize: '11.5px' }}>
                          <MapPin size={13} className="text-danger" />
                          <span>Địa điểm thực hiện:</span>
                        </div>
                        <div className="fw-semibold text-dark text-truncate" style={{ fontSize: '13px' }} title={currentItem.location || 'Hội trường UBND xã Xuân Thới Sơn'}>
                          {currentItem.location || 'Hội trường UBND xã Xuân Thới Sơn'}
                        </div>
                      </div>
                    </div>

                    <div className="col-12 col-md-6 col-lg-3">
                      <div className="p-3 bg-white rounded-3 border h-100 shadow-xs">
                        <div className="text-muted mb-1 d-flex align-items-center gap-1" style={{ fontSize: '11.5px' }}>
                          <Building size={13} className="text-primary" />
                          <span>Đơn vị phụ trách:</span>
                        </div>
                        <div className="fw-semibold text-dark text-truncate" style={{ fontSize: '13px' }} title={currentItem.assigned_to || 'Tất cả 56 Chi đoàn'}>
                          {currentItem.assigned_to || 'Tất cả 56 Chi đoàn'}
                        </div>
                      </div>
                    </div>

                    <div className="col-12 col-md-6 col-lg-3">
                      <div className="p-3 bg-white rounded-3 border h-100 shadow-xs">
                        <div className="text-muted mb-1 d-flex align-items-center gap-1" style={{ fontSize: '11.5px' }}>
                          <CheckCircle2 size={13} className="text-success" />
                          <span>Tình trạng tiếp nhận:</span>
                        </div>
                        <div className="fw-semibold text-success" style={{ fontSize: '13px' }}>
                          {(() => {
                            const confList = getUniqueConfirmedBranches(currentItem.confirmedBy);
                            const compList = getUniqueConfirmedBranches(currentItem.completedBy);
                            if (compList.length > 0) {
                              return `${compList.length} Chi đoàn đã làm xong`;
                            }
                            if (confList.length > 0) {
                              return `${confList.length} Chi đoàn đã tiếp nhận`;
                            }
                            return 'Chưa có Chi đoàn tiếp nhận';
                          })()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* KHỐI LIÊN KẾT NHIỆM VỤ TỪ PHẦN CÔNG VIỆC (TODO LIST) */}
                  <div className="card border rounded-4 p-3.5 bg-white shadow-xs">
                    <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom flex-wrap gap-2">
                      <div className="d-flex align-items-center gap-2">
                        <div className="p-2 bg-success-subtle text-success rounded-3">
                          <CheckSquare size={18} />
                        </div>
                        <div>
                          <h6 className="fw-bold text-dark mb-0" style={{ fontSize: '14.5px' }}>
                            Danh mục Công việc & Nhiệm vụ Todo liên kết
                          </h6>
                          <div className="text-muted" style={{ fontSize: '11.5px' }}>
                            Dữ liệu đồng bộ trực tiếp từ phân hệ Quản lý công việc (Todo List)
                          </div>
                        </div>
                      </div>

                      <span className="badge bg-light text-secondary border px-2.5 py-1 rounded-pill" style={{ fontSize: '11.5px' }}>
                        {safeTasks.filter(t => t.status === 'completed').length}/{safeTasks.length} việc hoàn thành
                      </span>
                    </div>

                    {safeTasks.length === 0 ? (
                      <div className="p-3 text-center text-muted" style={{ fontSize: '12.5px' }}>
                        Chưa có nhiệm vụ Todo nào được tạo.
                      </div>
                    ) : (
                      <div className="d-flex flex-column gap-2">
                        {safeTasks.map((t, idx) => {
                          const isDone = t.status === 'completed';
                          const isInProgress = t.status === 'inProgress' || t.status === 'in_progress';

                          return (
                            <div 
                              key={t.id || idx} 
                              className="p-2.5 px-3 bg-light rounded-3 border d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-2 transition hover-shadow"
                            >
                              <div className="d-flex align-items-start gap-2 flex-grow-1">
                                <span className="badge bg-white text-dark border px-2 py-0.5 rounded-pill mt-0.5" style={{ fontSize: '10px' }}>
                                  #{idx + 1}
                                </span>
                                <div>
                                  <div className={`fw-semibold ${isDone ? 'text-decoration-line-through text-muted' : 'text-dark'}`} style={{ fontSize: '13px' }}>
                                    {t.title}
                                  </div>
                                  <div className="text-muted d-flex flex-wrap align-items-center gap-2 mt-0.5" style={{ fontSize: '11px' }}>
                                    <span>📅 Hạn: {t.dueDate || t.due_date || 'Hôm nay'}</span>
                                    <span>📌 {t.assigned_to || 'Chi đoàn'}</span>
                                    {t.completed_time && <span className="text-success fw-bold">🎉 Xong lúc: {t.completed_time}</span>}
                                  </div>
                                </div>
                              </div>

                              <div className="d-flex align-items-center gap-2 flex-shrink-0">
                                {isDone ? (
                                  <span className="badge bg-success-subtle text-success border border-success-subtle px-2.5 py-1 rounded-pill fw-bold" style={{ fontSize: '11px' }}>
                                    ✅ Hoàn thành
                                  </span>
                                ) : isInProgress ? (
                                  <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2.5 py-1 rounded-pill fw-bold" style={{ fontSize: '11px' }}>
                                    🔄 Đang làm
                                  </span>
                                ) : (
                                  <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle px-2.5 py-1 rounded-pill fw-bold" style={{ fontSize: '11px' }}>
                                    ⏳ Cần làm
                                  </span>
                                )}

                                <button
                                  type="button"
                                  className="btn btn-xs btn-outline-secondary px-2 py-0.5 rounded-2"
                                  style={{ fontSize: '11px' }}
                                  onClick={() => setSelectedItemId(`task:${t.id}`)}
                                  title="Xem chi tiết nhiệm vụ này"
                                >
                                  Chi tiết →
                                </button>

                                <button
                                  type="button"
                                  className="btn btn-xs btn-outline-danger p-1 rounded-2 border-0"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (window.confirm(`Bạn có chắc chắn muốn xóa công việc "${t.title}" không?`)) {
                                      if (onDeleteTask) onDeleteTask(t.id, t.title);
                                      else syncDeleteTask(t.id);
                                    }
                                  }}
                                  title="Xóa công việc này khỏi Todo"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: CHI ĐOÀN */}
          {activeTab === 'members' && (
            <div>
              <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-3 pb-3 border-bottom">
                <div>
                  <h6 className="fw-bold text-dark mb-1 d-flex align-items-center gap-2" style={{ fontSize: '15px' }}>
                    <Users size={18} className="text-primary" />
                    <span>Danh sách 56 Chi đoàn / Đơn vị trực thuộc</span>
                  </h6>
                  <div className="text-muted" style={{ fontSize: '12px' }}>
                    Theo dõi tình hình tiếp nhận và điểm danh tham gia hoạt động của các đơn vị
                  </div>
                </div>

                <div className="d-flex align-items-center gap-2 flex-wrap">
                  <div className="input-group input-group-sm" style={{ width: '240px' }}>
                    <span className="input-group-text bg-light border-end-0">
                      <Search size={14} className="text-muted" />
                    </span>
                    <input 
                      type="text" 
                      className="form-control border-start-0" 
                      placeholder="Tìm tên Chi đoàn..."
                      value={branchSearch}
                      onChange={(e) => setBranchSearch(e.target.value)}
                      style={{ fontSize: '12px' }}
                    />
                  </div>

                  <div className="btn-group btn-group-sm">
                    <button 
                      type="button" 
                      className={`btn ${branchFilter === 'ALL' ? 'btn-primary' : 'btn-outline-secondary'}`}
                      onClick={() => setBranchFilter('ALL')}
                      style={{ fontSize: '11.5px' }}
                    >
                      Tất cả (56)
                    </button>
                    <button 
                      type="button" 
                      className={`btn ${branchFilter === 'dan_cu' ? 'btn-primary' : 'btn-outline-secondary'}`}
                      onClick={() => setBranchFilter('dan_cu')}
                      style={{ fontSize: '11.5px' }}
                    >
                      Khối Dân cư (30)
                    </button>
                    <button 
                      type="button" 
                      className={`btn ${branchFilter === 'truong_hoc' ? 'btn-primary' : 'btn-outline-secondary'}`}
                      onClick={() => setBranchFilter('truong_hoc')}
                      style={{ fontSize: '11.5px' }}
                    >
                      Khối Trường học
                    </button>
                  </div>
                </div>
              </div>

              {/* Attendance Statistics Badges */}
              {(() => {
                const actRec = (attendanceRecords && currentItem?.id && attendanceRecords[currentItem.id]) || {};
                const confirmedList = Array.isArray(currentItem?.confirmedBy) ? currentItem.confirmedBy : [];
                const attendedCount = ALL_BRANCHES.filter(b => {
                  return Boolean(
                    actRec[b.name] || 
                    confirmedList.some(c => (typeof c === 'string' ? c : c.branch) === b.name)
                  );
                }).length;
                const absentCount = ALL_BRANCHES.length - attendedCount;

                return (
                  <div className="row g-2 mb-3">
                    <div className="col-12 col-sm-4">
                      <div className="p-2.5 bg-light rounded-3 border d-flex align-items-center justify-content-between">
                        <span className="text-secondary fw-semibold" style={{ fontSize: '12px' }}>Tổng số Chi đoàn:</span>
                        <span className="badge bg-primary px-2.5 py-1 rounded-pill fw-bold" style={{ fontSize: '12px' }}>56 Đơn vị</span>
                      </div>
                    </div>
                    <div className="col-12 col-sm-4">
                      <div className="p-2.5 bg-success-subtle rounded-3 border border-success-subtle d-flex align-items-center justify-content-between">
                        <span className="text-success fw-bold" style={{ fontSize: '12px' }}>✓ Đã có mặt / Tiếp nhận:</span>
                        <span className="badge bg-success px-2.5 py-1 rounded-pill fw-bold" style={{ fontSize: '12px' }}>{attendedCount} Chi đoàn</span>
                      </div>
                    </div>
                    <div className="col-12 col-sm-4">
                      <div className="p-2.5 bg-warning-subtle rounded-3 border border-warning-subtle d-flex align-items-center justify-content-between">
                        <span className="text-warning-emphasis fw-bold" style={{ fontSize: '12px' }}>⏳ Chưa điểm danh:</span>
                        <span className="badge bg-warning text-dark px-2.5 py-1 rounded-pill fw-bold" style={{ fontSize: '12px' }}>{absentCount} Chi đoàn</span>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Branches Table */}
              <div className="table-responsive rounded-3 border">
                <table className="table table-hover align-middle mb-0" style={{ fontSize: '12.5px' }}>
                  <thead className="table-light">
                    <tr>
                      <th style={{ width: '50px' }} className="text-center">STT</th>
                      <th>Tên Chi Đoàn / Đơn Vị</th>
                      <th>Cụm Thi Đua / Phân Loại</th>
                      <th>Bí Thư / Phụ Trách</th>
                      <th className="text-center" style={{ width: '180px' }}>Trạng Thái Điểm Danh</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBranches.map((b, idx) => {
                      const actRec = (attendanceRecords && currentItem?.id && attendanceRecords[currentItem.id]) || {};
                      const confirmedList = Array.isArray(currentItem?.confirmedBy) ? currentItem.confirmedBy : [];
                      const record = actRec[b.name];
                      const conf = confirmedList.find(c => (typeof c === 'string' ? c : c.branch) === b.name);
                      const isPresent = Boolean(record || conf);
                      const checkinTime = (typeof record === 'object' ? record?.time : null) || (typeof conf === 'object' ? conf?.time : null) || 'Đã xác nhận';

                      return (
                        <tr key={b.id || idx}>
                          <td className="text-center text-muted fw-semibold">{idx + 1}</td>
                          <td>
                            <div className="fw-bold text-dark">{b.name}</div>
                            {b.email && <div className="text-muted" style={{ fontSize: '11px' }}>{b.email}</div>}
                          </td>
                          <td>
                            <span className="badge bg-light text-secondary border px-2 py-1" style={{ fontSize: '11px' }}>
                              {b.cluster_name || (b.id.startsWith('ap-') ? 'Khối Dân Cư' : 'Khối Đơn Vị')}
                            </span>
                          </td>
                          <td className="text-secondary fw-semibold">
                            {b.secretary_name || 'Đ/c Bí thư Chi đoàn'}
                          </td>
                          <td className="text-center">
                            {isPresent ? (
                              <span className="badge bg-success-subtle text-success border border-success-subtle px-2.5 py-1.5 rounded-pill d-inline-flex align-items-center gap-1" style={{ fontSize: '11px', fontWeight: 650 }}>
                                <CheckCircle2 size={13} />
                                <span>Có mặt ({checkinTime})</span>
                              </span>
                            ) : (
                              <span className="badge bg-secondary-subtle text-muted border px-2.5 py-1.5 rounded-pill d-inline-flex align-items-center gap-1" style={{ fontSize: '11px', fontWeight: 500 }}>
                                <Clock size={12} />
                                <span>Chưa điểm danh</span>
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: PHÂN CÔNG */}
          {activeTab === 'tasks' && currentItem && (
            <div>
              {taskSuccessMsg && (
                <div className="alert alert-success py-2 px-3 rounded-3 d-flex align-items-center gap-2 mb-3 shadow-xs" style={{ fontSize: '13px' }}>
                  <CheckCircle2 size={16} className="text-success flex-shrink-0" />
                  <span>{taskSuccessMsg}</span>
                </div>
              )}

              {/* PHẦN 1: NỘI DUNG TRONG VĂN BẢN / KẾ HOẠCH TRIỂN KHAI */}
              <div className="card border-0 shadow-xs rounded-4 bg-light p-3.5 mb-4 border">
                <div className="d-flex align-items-start justify-content-between gap-3 mb-2">
                  <div className="d-flex align-items-center gap-2">
                    <div className="p-2 bg-primary text-white rounded-3">
                      <FileText size={18} />
                    </div>
                    <div>
                      <h6 className="fw-bold text-dark mb-0" style={{ fontSize: '15px' }}>
                        Nội dung chỉ đạo trong văn bản / Kế hoạch triển khai
                      </h6>
                      <div className="text-muted" style={{ fontSize: '11.5px' }}>
                        Căn cứ kế hoạch chỉ đạo của Ban Thường vụ Đoàn TNCS Hồ Chí Minh Xã Xuân Thới Sơn
                      </div>
                    </div>
                  </div>

                  <div className="d-flex align-items-center gap-1.5">
                    <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-2.5 py-1 rounded-pill" style={{ fontSize: '11.5px', fontWeight: 600 }}>
                      📌 {currentItem.priority || 'Khẩn cấp'}
                    </span>
                    <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2.5 py-1 rounded-pill" style={{ fontSize: '11.5px', fontWeight: 600 }}>
                      {currentItem.status || 'Đang triển khai'}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-3 border my-2">
                  <div className="fw-bold text-dark mb-1" style={{ fontSize: '14px' }}>
                    {currentItem.title}
                  </div>
                  <div className="text-secondary" style={{ fontSize: '13px', lineHeight: 1.6 }}>
                    {currentItem.description || 'Ban Thường vụ Đoàn xã yêu cầu các Chi đoàn trực thuộc khẩn trương phân công lực lượng đoàn viên, cử đồng chí cán bộ phụ trách đảm nhận các nhiệm vụ trọng tâm để đảm bảo chương trình diễn ra nghiêm túc, đạt hiệu quả cao.'}
                  </div>
                </div>

                <div className="row g-2 pt-1 text-secondary" style={{ fontSize: '12.5px' }}>
                  <div className="col-12 col-md-4 d-flex align-items-center gap-1.5">
                    <Clock size={14} className="text-primary flex-shrink-0" />
                    <span><strong>Thời gian:</strong> {currentItem.time || '08:00 - 11:30'}</span>
                  </div>
                  <div className="col-12 col-md-4 d-flex align-items-center gap-1.5">
                    <Calendar size={14} className="text-primary flex-shrink-0" />
                    <span><strong>Ngày tháng:</strong> {currentItem.date || currentItem.dueDate || 'Hôm nay'}</span>
                  </div>
                  <div className="col-12 col-md-4 d-flex align-items-center gap-1.5">
                    <MapPin size={14} className="text-danger flex-shrink-0" />
                    <span><strong>Địa điểm:</strong> {currentItem.location || 'Hội trường UBND xã Xuân Thới Sơn'}</span>
                  </div>
                </div>
              </div>

              {/* PHẦN 2: MỤC PHÂN CÔNG THỰC HIỆN DO ĐỒNG CHÍ NÀO ĐẢM NHIỆM */}
              <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
                <div>
                  <h6 className="fw-bold text-dark mb-1 d-flex align-items-center gap-2" style={{ fontSize: '15px' }}>
                    <CheckSquare size={18} className="text-success" />
                    <span>Phân công thực hiện do đồng chí nào đảm nhiệm ({tasksList.length})</span>
                  </h6>
                  <div className="text-muted" style={{ fontSize: '12px' }}>
                    Giao nhiệm vụ chi tiết đến từng Chi đoàn và cá nhân đồng chí phụ trách thực hiện
                  </div>
                </div>

                <div className="d-flex align-items-center gap-2">
                  {!isEditingTasks ? (
                    <>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-success d-inline-flex align-items-center gap-1.5 fw-semibold px-3 py-1.5 rounded-3 shadow-xs hover-scale"
                        style={{ fontSize: '12.5px' }}
                        onClick={handleAddTaskRow}
                      >
                        <Plus size={15} />
                        <span>Thêm nhiệm vụ</span>
                      </button>

                      <button
                        type="button"
                        className="btn btn-sm btn-primary d-inline-flex align-items-center gap-1.5 fw-bold px-3 py-1.5 rounded-3 shadow-xs hover-scale text-white"
                        style={{ fontSize: '12.5px', backgroundColor: '#0066FF', borderColor: '#0066FF' }}
                        onClick={() => setIsEditingTasks(true)}
                        title="Chỉnh sửa phân công nhiệm vụ và đồng chí đảm nhiệm"
                      >
                        <Edit3 size={14} />
                        <span>Chỉnh sửa phân công</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary px-3 py-1.5 rounded-3 fw-semibold"
                        style={{ fontSize: '12.5px' }}
                        onClick={() => {
                          setIsEditingTasks(false);
                          if (currentActivity?.subTasks) setTasksList(currentActivity.subTasks);
                        }}
                      >
                        ✕ Hủy bỏ
                      </button>

                      <button
                        type="button"
                        className="btn btn-sm btn-outline-success px-3 py-1.5 rounded-3 fw-semibold d-inline-center align-items-center gap-1"
                        style={{ fontSize: '12.5px' }}
                        onClick={handleAddTaskRow}
                      >
                        <Plus size={14} />
                        <span>Thêm dòng</span>
                      </button>

                      <button
                        type="button"
                        className="btn btn-sm btn-success px-3.5 py-1.5 rounded-3 fw-bold text-white shadow-xs d-inline-flex align-items-center gap-1.5 hover-scale"
                        style={{ fontSize: '12.5px', backgroundColor: '#16A34A', borderColor: '#16A34A' }}
                        onClick={handleSaveTasks}
                      >
                        <CheckCircle2 size={15} />
                        <span>Lưu phân công</span>
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* NỘI DUNG BẢNG PHÂN CÔNG */}
              {isEditingTasks ? (
                <div className="card border border-primary-subtle shadow-sm rounded-4 p-3 bg-white">
                  <div className="text-primary fw-bold mb-3 d-flex align-items-center gap-1.5" style={{ fontSize: '13px' }}>
                    <Edit3 size={15} />
                    <span>Cập nhật phân công nhiệm vụ và phân bổ đồng chí đảm nhiệm:</span>
                  </div>

                  <div className="d-flex flex-column gap-3">
                    {tasksList.map((t, idx) => (
                      <div key={t.id || idx} className="p-3 rounded-3 bg-light border position-relative">
                        <div className="d-flex align-items-center justify-content-between mb-2">
                          <span className="badge bg-primary px-2.5 py-1 rounded-pill fw-bold" style={{ fontSize: '11px' }}>
                            Nhiệm vụ #{idx + 1}
                          </span>

                          <button
                            type="button"
                            className="btn btn-link text-danger p-0 border-0"
                            onClick={() => handleDeleteTaskRow(idx)}
                            title="Xóa nhiệm vụ này"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>

                        <div className="row g-2">
                          <div className="col-12 col-md-6">
                            <label className="form-label fw-bold text-dark mb-1" style={{ fontSize: '11.5px' }}>
                              Nội dung công việc / Nhiệm vụ <span className="text-danger">*</span>
                            </label>
                            <input
                              type="text"
                              className="form-control form-control-sm fw-semibold"
                              value={t.task || ''}
                              onChange={(e) => handleUpdateTaskField(idx, 'task', e.target.value)}
                              placeholder="Ví dụ: Phụ trách đón tiếp, điểm danh QR & GPS..."
                            />
                          </div>

                          <div className="col-12 col-md-6">
                            <label className="form-label fw-bold text-dark mb-1" style={{ fontSize: '11.5px' }}>
                              Đơn vị / Chi đoàn phụ trách
                            </label>
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              value={t.branch || ''}
                              onChange={(e) => handleUpdateTaskField(idx, 'branch', e.target.value)}
                              placeholder="Ví dụ: Chi đoàn Ấp Bùi Môn..."
                            />
                          </div>

                          <div className="col-12 col-md-4">
                            <label className="form-label fw-bold text-primary mb-1 d-flex align-items-center gap-1" style={{ fontSize: '11.5px' }}>
                              <UserCheck size={13} />
                              <span>Đồng chí đảm nhiệm</span> <span className="text-danger">*</span>
                            </label>
                            <input
                              type="text"
                              className="form-control form-control-sm fw-bold border-primary"
                              value={t.officer || ''}
                              onChange={(e) => handleUpdateTaskField(idx, 'officer', e.target.value)}
                              placeholder="Ví dụ: Đ/c Nguyễn Văn An - Bí thư..."
                            />
                          </div>

                          <div className="col-12 col-md-4">
                            <label className="form-label fw-bold text-dark mb-1" style={{ fontSize: '11.5px' }}>
                              Thời hạn hoàn thành
                            </label>
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              value={t.deadline || ''}
                              onChange={(e) => handleUpdateTaskField(idx, 'deadline', e.target.value)}
                              placeholder="Ví dụ: Trước 08:00 ngày 23/10..."
                            />
                          </div>

                          <div className="col-12 col-md-4">
                            <label className="form-label fw-bold text-dark mb-1" style={{ fontSize: '11.5px' }}>
                              Tiến độ thực hiện
                            </label>
                            <select
                              className="form-select form-select-sm fw-semibold"
                              value={t.status || 'Chờ thực hiện'}
                              onChange={(e) => handleUpdateTaskField(idx, 'status', e.target.value)}
                            >
                              <option value="Chờ thực hiện">⏳ Chờ thực hiện</option>
                              <option value="Đang tiến hành">🔄 Đang tiến hành</option>
                              <option value="Đã hoàn thành">✅ Đã hoàn thành</option>
                            </select>
                          </div>

                          <div className="col-12">
                            <label className="form-label fw-bold text-dark mb-1" style={{ fontSize: '11.5px' }}>
                              Ghi chú / Yêu cầu chi tiết
                            </label>
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              value={t.notes || ''}
                              onChange={(e) => handleUpdateTaskField(idx, 'notes', e.target.value)}
                              placeholder="Ghi chú phân công cụ thể..."
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="d-flex align-items-center justify-content-between mt-3 pt-3 border-top">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-1.5 fw-semibold"
                      style={{ fontSize: '12px' }}
                      onClick={handleAddTaskRow}
                    >
                      <Plus size={14} />
                      <span>Thêm mục phân công mới</span>
                    </button>

                    <div className="d-flex align-items-center gap-2">
                      <button
                        type="button"
                        className="btn btn-sm btn-light border px-3 py-1.5 rounded-3 fw-semibold text-secondary"
                        style={{ fontSize: '12px' }}
                        onClick={() => setIsEditingTasks(false)}
                      >
                        ✕ Hủy bỏ
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-success px-3.5 py-1.5 rounded-3 fw-bold text-white shadow-xs d-inline-flex align-items-center gap-1.5"
                        style={{ fontSize: '12px', backgroundColor: '#16A34A', borderColor: '#16A34A' }}
                        onClick={handleSaveTasks}
                      >
                        <CheckCircle2 size={14} />
                        <span>Lưu danh sách phân công</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* CHẾ ĐỘ HIỂN THỊ DANH SÁCH BẢNG PHÂN CÔNG */
                tasksList.length === 0 ? (
                  <div className="p-4 bg-light rounded-4 text-center border">
                    <CheckSquare size={36} className="text-muted mb-2 opacity-50" />
                    <div className="fw-bold text-dark mb-1" style={{ fontSize: '14px' }}>
                      Chưa có danh sách phân công nhiệm vụ
                    </div>
                    <div className="text-muted mb-3" style={{ fontSize: '12px' }}>
                      Bấm vào nút bên dưới để thêm các nội dung phân công và đồng chí đảm nhiệm thực hiện.
                    </div>
                    <button
                      type="button"
                      className="btn btn-sm btn-primary d-inline-flex align-items-center gap-1.5 px-3 py-1.5 rounded-3 fw-bold shadow-xs"
                      onClick={handleAddTaskRow}
                    >
                      <Plus size={15} />
                      <span>Thêm phân công nhiệm vụ</span>
                    </button>
                  </div>
                ) : (
                  <div className="table-responsive rounded-3 border">
                    <table className="table table-hover align-middle mb-0" style={{ fontSize: '12.5px' }}>
                      <thead className="table-light">
                        <tr>
                          <th style={{ width: '45px' }} className="text-center">#</th>
                          <th style={{ minWidth: '220px' }}>Nội Dung Nhiệm Vụ</th>
                          <th style={{ minWidth: '160px' }}>Đơn Vị Phụ Trách</th>
                          <th style={{ minWidth: '190px' }} className="text-primary">
                            <span className="d-flex align-items-center gap-1">
                              <UserCheck size={14} />
                              <span>Đồng Chí Đảm Nhiệm</span>
                            </span>
                          </th>
                          <th style={{ minWidth: '140px' }}>Thời Hạn</th>
                          <th style={{ width: '130px' }} className="text-center">Tiến Độ</th>
                          <th style={{ minWidth: '180px' }}>Ghi Chú</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tasksList.map((t, idx) => {
                          const isDone = t.status === 'Đã hoàn thành';
                          const isInProgress = t.status === 'Đang tiến hành';

                          return (
                            <tr key={t.id || idx}>
                              <td className="text-center text-muted fw-bold">{idx + 1}</td>
                              <td>
                                <div className="fw-bold text-dark">{t.task || 'Nhiệm vụ'}</div>
                              </td>
                              <td>
                                <span className="badge bg-light text-dark border px-2 py-1" style={{ fontSize: '11px', fontWeight: 600 }}>
                                  📌 {t.branch || 'Chi đoàn'}
                                </span>
                              </td>
                              <td>
                                <div className="d-inline-flex align-items-center gap-1.5 px-2.5 py-1 bg-primary-subtle text-primary border border-primary-subtle rounded-3 shadow-xs">
                                  <UserCheck size={13} className="text-primary flex-shrink-0" />
                                  <span className="fw-bold" style={{ fontSize: '12px' }}>
                                    {t.officer || 'Đ/c Phụ trách'}
                                  </span>
                                </div>
                              </td>
                              <td className="text-muted" style={{ fontSize: '11.5px' }}>
                                {t.deadline || 'Trong ngày'}
                              </td>
                              <td className="text-center">
                                {isDone ? (
                                  <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1 rounded-pill fw-bold" style={{ fontSize: '11px' }}>
                                    ✅ Đã xong
                                  </span>
                                ) : isInProgress ? (
                                  <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2.5 py-1 rounded-pill fw-bold" style={{ fontSize: '11px' }}>
                                    🔄 Đang làm
                                  </span>
                                ) : (
                                  <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle px-2.5 py-1 rounded-pill fw-bold" style={{ fontSize: '11px' }}>
                                    ⏳ Chờ làm
                                  </span>
                                )}
                              </td>
                              <td className="text-secondary" style={{ fontSize: '11.5px' }}>
                                {t.notes || '—'}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

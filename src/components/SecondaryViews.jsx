import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Plus, 
  FileText, 
  Download, 
  CheckCircle2, 
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
  MoreVertical
} from 'lucide-react';
import { INITIAL_BRANCHES, COMPETITION_CLUSTERS, isSupabaseConfigured, OFFICIAL_ADDRESS, sortNotificationsByPriority, sortActivitiesByPriority, getPriorityBadgeStyle, getBranchClusterName, calculateBranchRating } from '../lib/supabase';
import { getStorageQuotaMetrics, DOAN_XA_GMAIL } from '../lib/storageStrategy';

// Component xác nhận tiếp nhận thông báo / hoạt động cho Chi đoàn & Quản trị viên
export function ReceiptConfirmationBox({ type, item, currentRole, isDoanXa, onConfirmReceipt }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const confirmedBy = item?.confirmedBy || [];
  const branchName = currentRole?.full_name || 'Chi đoàn Ấp';
  const hasConfirmed = confirmedBy.some(c => c.branch === branchName);
  const myConfirmation = confirmedBy.find(c => c.branch === branchName);

  if (!isDoanXa) {
    if (hasConfirmed) {
      return (
        <div className="d-inline-flex align-items-center gap-1.5 px-3 py-1.5 bg-success-subtle text-success border border-success-subtle rounded-3" style={{ fontSize: '12px', fontWeight: 600 }}>
          <CheckCircle2 size={15} />
          <span>✓ Đã tiếp nhận ({myConfirmation?.time || 'Vừa xong'})</span>
        </div>
      );
    }
    return (
      <button 
        type="button"
        className="btn btn-success btn-sm fw-semibold d-inline-flex align-items-center gap-1.5 px-3 py-1.5 rounded-3 shadow-sm"
        style={{ backgroundColor: '#16A34A', border: 'none', fontSize: '12px' }}
        onClick={(e) => {
          e.stopPropagation();
          onConfirmReceipt && onConfirmReceipt(type, item);
        }}
      >
        <CheckCircle2 size={15} />
        <span>Xác nhận đã nhận & tiếp nhận nhiệm vụ</span>
      </button>
    );
  }

  return (
    <div className="position-relative d-inline-block">
      <button 
        type="button"
        className="btn btn-sm btn-outline-success fw-semibold d-inline-flex align-items-center gap-1.5 px-2.5 py-1 rounded-3"
        style={{ fontSize: '11.5px' }}
        onClick={(e) => {
          e.stopPropagation();
          setShowDropdown(!showDropdown);
        }}
      >
        <CheckCircle2 size={14} />
        <span>Đã có {confirmedBy.length}/30 Chi đoàn tiếp nhận</span>
      </button>

      {showDropdown && (
        <div 
          className="position-absolute end-0 mt-1 bg-white border shadow-lg rounded-3 p-3 text-dark" 
          style={{ zIndex: 1050, width: '280px', maxHeight: '240px', overflowY: 'auto' }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="d-flex align-items-center justify-content-between mb-2 border-bottom pb-1">
            <span className="fw-bold text-success" style={{ fontSize: '12.5px' }}>
              Danh sách tiếp nhận ({confirmedBy.length})
            </span>
            <button type="button" className="btn-close btn-sm" onClick={() => setShowDropdown(false)}></button>
          </div>
          {confirmedBy.length === 0 ? (
            <div className="text-muted text-center py-2" style={{ fontSize: '12px' }}>
              Chưa có chi đoàn nào xác nhận
            </div>
          ) : (
            <div className="d-flex flex-column gap-1.5">
              {confirmedBy.map((c, idx) => (
                <div key={idx} className="d-flex align-items-center justify-content-between p-1.5 bg-light rounded" style={{ fontSize: '12px' }}>
                  <span className="fw-semibold text-dark">✓ {c.branch}</span>
                  <span className="text-muted" style={{ fontSize: '10.5px' }}>{c.time}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// 1. Full Activities Management View
export function ActivitiesView({ activities = [], onOpenCreateActivity, isDoanXa, onToggleStatus, onDeleteActivity, onOpenActivityDetail, onConfirmReceipt, currentUser }) {
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  const sortedActivities = sortActivitiesByPriority(activities);

  const filtered = sortedActivities.filter(a => {
    const matchFilter = filter === 'ALL' || a.status === filter;
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase()) || 
                        (a.location && a.location.toLowerCase().includes(search.toLowerCase()));
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
            Theo dõi và điều hành tất cả lịch hoạt động thanh niên xã Xuân Thới Sơn và 30 Chi đoàn Ấp
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
        <div className="d-flex align-items-center gap-2">
          <button 
            className={`btn btn-sm ${filter === 'ALL' ? 'btn-primary' : 'btn-light border'} fw-semibold px-3`}
            onClick={() => setFilter('ALL')}
          >
            Tất cả ({activities.length})
          </button>
          <button 
            className={`btn btn-sm ${filter === 'Sắp diễn ra' ? 'btn-primary' : 'btn-light border'} fw-semibold px-3`}
            onClick={() => setFilter('Sắp diễn ra')}
          >
            Sắp diễn ra ({activities.filter(a => a.status === 'Sắp diễn ra').length})
          </button>
          <button 
            className={`btn btn-sm ${filter === 'Đã hoàn thành' ? 'btn-primary' : 'btn-light border'} fw-semibold px-3`}
            onClick={() => setFilter('Đã hoàn thành')}
          >
            Đã hoàn thành ({activities.filter(a => a.status === 'Đã hoàn thành').length})
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
            return (
              <div key={act.id} className="col-12 col-md-6 col-xl-4">
                <div className="p-3.5 rounded-3 bg-light border h-100 d-flex flex-column justify-content-between hover-shadow transition">
                  <div>
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <div className="activity-date-badge">
                        <div className="activity-date-num">{act.day}</div>
                        <div className="activity-date-month">{act.month}</div>
                      </div>
                      <div className="d-flex align-items-center gap-1">
                        <span className={`badge ${priorityBadge.bg} border px-2 py-1`} style={{ fontSize: '11px', fontWeight: 600 }}>
                          {priorityBadge.label}
                        </span>
                        <span className={`badge ${act.status === 'Đã hoàn thành' ? 'bg-success-subtle text-success border-success-subtle' : 'bg-primary-subtle text-primary border-primary-subtle'} border px-2 py-1`} style={{ fontSize: '11px', fontWeight: 600 }}>
                          {act.status}
                        </span>
                      </div>
                    </div>
                  <h5 className="fw-bold text-dark mb-2" style={{ fontSize: '15px', lineHeight: '1.3' }}>
                    {act.title}
                  </h5>
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
                          title="Xóa hoạt động khi sai thông tin"
                          onClick={() => {
                            if (window.confirm(`Bạn có chắc chắn muốn xóa hoạt động "${act.title}" không?`)) {
                              onDeleteActivity && onDeleteActivity(act.id);
                            }
                          }}
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
    </div>
  );
}

// 2. Full Documents Management View
export function DocumentsView({ documents = [], tabType = 'incoming_docs', onOpenIssueDocument, onDeleteDocument, isDoanXa }) {
  const [search, setSearch] = useState('');

  const filtered = documents.filter(d => {
    const matchType = tabType === 'incoming_docs' ? d.type === 'incoming' : 
                      tabType === 'outgoing_docs' ? (d.type === 'outgoing' || !d.type) : true;
    const matchSearch = d.title.toLowerCase().includes(search.toLowerCase()) || 
                        (d.doc_number && d.doc_number.toLowerCase().includes(search.toLowerCase()));
    return matchType && matchSearch;
  });

  const titleMap = {
    incoming_docs: 'Quản lý Văn bản đến (Báo cáo tiếp nhận)',
    outgoing_docs: 'Quản lý Văn bản đi (Văn bản ban hành)',
    doan_xa_docs: 'Văn bản từ Đoàn xã',
    required_docs: 'Văn bản cần nộp'
  };

  return (
    <div className="content-card">
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-4 gap-3 border-bottom pb-3">
        <div>
          <h3 className="card-title-header mb-1 d-flex align-items-center gap-2">
            <FileText className="text-primary" size={24} />
            {titleMap[tabType] || 'Quản lý Văn bản'}
          </h3>
          <div className="text-secondary" style={{ fontSize: '13px' }}>
            Hệ thống tiếp nhận, phát hành và lưu trữ văn bản số hóa 100% Realtime
          </div>
        </div>

        {isDoanXa && (
          <button 
            className="btn btn-primary d-flex align-items-center gap-2 px-3 py-2 fw-semibold rounded-3 shadow-sm"
            style={{ backgroundColor: '#0066FF', border: 'none' }}
            onClick={onOpenIssueDocument}
          >
            <Send size={16} />
            <span>Ban hành văn bản mới</span>
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="d-flex align-items-center justify-content-between mb-3 gap-3">
        <div className="fw-semibold text-dark" style={{ fontSize: '14px' }}>
          Danh sách văn bản ({filtered.length})
        </div>

        <div className="input-group" style={{ maxWidth: '320px' }}>
          <span className="input-group-text bg-light border-end-0"><Search size={15} className="text-secondary" /></span>
          <input 
            type="text" 
            className="form-control bg-light border-start-0 ps-0" 
            placeholder="Tìm kiếm số hiệu, trích yếu..." 
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
          <h5 className="fw-bold text-dark mb-1">Chưa có văn bản nào trong mục này</h5>
          <p className="text-secondary mb-3" style={{ fontSize: '13px' }}>
            Tất cả văn bản được ban hành hoặc tiếp nhận sẽ hiển thị tự động tại đây.
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
                <th>Tên / Trích yếu văn bản</th>
                <th>Đơn vị gửi / nhận</th>
                <th>Ngày phát hành</th>
                <th>Trạng thái</th>
                <th>Tệp đính kèm</th>
                {isDoanXa && <th>Thao tác</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.map((doc) => (
                <tr key={doc.id}>
                  <td className="fw-bold text-primary">{doc.doc_number || '---'}</td>
                  <td>
                    <div className="fw-bold text-dark">{doc.title}</div>
                    {doc.summary && <div className="text-muted" style={{ fontSize: '11.5px' }}>{doc.summary}</div>}
                  </td>
                  <td className="text-secondary">{doc.sender || doc.recipient_scope || 'Toàn xã'}</td>
                  <td className="text-secondary">{doc.date || doc.issue_date || 'Hôm nay'}</td>
                  <td>
                    <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1">
                      {doc.status || 'Đã ban hành'}
                    </span>
                  </td>
                  <td>
                    {doc.file_url || doc.file_name ? (
                      <a 
                        href={doc.file_url || `/${doc.file_name}`} 
                        download={doc.file_name || 'Van_Ban.pdf'}
                        target="_blank" 
                        rel="noreferrer" 
                        className="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-1"
                      >
                        <Download size={13} /> Tải PDF
                      </a>
                    ) : (
                      <span className="text-muted" style={{ fontSize: '11px' }}>Không có tệp</span>
                    )}
                  </td>
                  {isDoanXa && (
                    <td>
                      <button 
                        className="btn btn-sm btn-outline-danger d-inline-flex align-items-center gap-1 py-1 px-2"
                        style={{ fontSize: '11.5px', borderRadius: '6px' }}
                        title="Thu hồi văn bản tức thì"
                        onClick={() => {
                          if (window.confirm(`Bạn có chắc chắn muốn THU HỒI văn bản "${doc.title}" không? Văn bản sẽ được xóa đồng bộ trên toàn bộ 30 Chi đoàn.`)) {
                            onDeleteDocument && onDeleteDocument(doc.id);
                          }
                        }}
                      >
                        <Trash2 size={13} />
                        <span>Thu hồi</span>
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// 3. Full Submissions History Management View
export function SubmissionsView({ submissions = [], onOpenSubmitDoc }) {
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
            Theo dõi tình hình nộp báo cáo định kỳ của 30 Chi đoàn Ấp trực thuộc Đoàn xã
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
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id}>
                  <td className="fw-bold text-dark">{s.title}</td>
                  <td className="fw-semibold text-primary">{s.branch_name || 'Chi đoàn Ấp'}</td>
                  <td className="text-secondary">{s.sub_date || 'Hôm nay'}</td>
                  <td>
                    <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1">
                      ● {s.status || 'Đã nộp'}
                    </span>
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
            Bấm nút "Gửi thông báo / Tin nhắn" ở trên để gửi tin tức điều hành tới Đoàn xã và 30 Chi đoàn Ấp.
          </p>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {filtered.map((n) => {
            const badge = getPriorityBadgeStyle(n.priority);
            
            // Extract activity or notification details
            const timeVal = n.activity_details?.time || n.time || '08:00 - 11:30';
            const dateVal = n.activity_details?.date || (n.activity_details?.day ? `${n.activity_details.day} ${n.activity_details.month}` : false) || n.date || 'Chưa chọn ngày';
            const locationVal = n.activity_details?.location || n.location || '';
            const notesVal = n.activity_details?.notes || n.notes || 'Đề nghị 30 Chi đoàn Ấp triển khai tham gia đầy đủ và đúng thời gian quy định.';

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
                    <span>Gửi đến: {n.target_scope || 'Tất cả 30 Chi đoàn Ấp'}</span>
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
                              onDeleteNotification && onDeleteNotification(n.id);
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
export function TasksView({ tasks = [], onOpenCreateTask, onToggleTask, onDeleteTask, isDoanXa }) {
  return (
    <div className="content-card">
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-4 gap-3 border-bottom pb-3">
        <div>
          <h3 className="card-title-header mb-1 d-flex align-items-center gap-2">
            <CheckSquare className="text-primary" size={24} />
            Quản lý Công việc & Nhiệm vụ (Todo List)
          </h3>
          <div className="text-secondary" style={{ fontSize: '13px' }}>
            Phân công, giao nhiệm vụ và kiểm soát tiến độ thực hiện công tác Đoàn
          </div>
        </div>

        <button 
          className="btn btn-primary d-flex align-items-center gap-2 px-3 py-2 fw-semibold rounded-3 shadow-sm"
          style={{ backgroundColor: '#0066FF', border: 'none' }}
          onClick={onOpenCreateTask}
        >
          <Plus size={18} />
          <span>Giao nhiệm vụ / Thêm công việc</span>
        </button>
      </div>

      {/* Task List Table */}
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
                <div key={t.id} className="p-2.5 bg-white rounded-2 border shadow-sm d-flex align-items-start gap-2 position-relative">
                  <button className="btn btn-link p-0 text-secondary" onClick={() => onToggleTask && onToggleTask(t.id, 'completed')}>
                    <Circle size={18} />
                  </button>
                  <div className="flex-grow-1">
                    <div className="fw-bold text-dark pe-3" style={{ fontSize: '12.5px' }}>{t.title}</div>
                    <div className="text-muted d-flex flex-wrap align-items-center gap-1.5" style={{ fontSize: '10.5px' }}>
                      <span>Hạn: {t.dueDate || t.due_date || 'Hôm nay'}</span>
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
                          onDeleteTask && onDeleteTask(t.id);
                        }
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
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
                <div key={t.id} className="p-2.5 bg-white rounded-2 border shadow-sm d-flex align-items-start gap-2 position-relative">
                  <button className="btn btn-link p-0 text-primary" onClick={() => onToggleTask && onToggleTask(t.id, 'completed')}>
                    <Circle size={18} />
                  </button>
                  <div className="flex-grow-1">
                    <div className="fw-bold text-dark pe-3" style={{ fontSize: '12.5px' }}>{t.title}</div>
                    <div className="text-muted d-flex flex-wrap align-items-center gap-1.5" style={{ fontSize: '10.5px' }}>
                      <span>Ưu tiên: {t.priority}</span>
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
                          onDeleteTask && onDeleteTask(t.id);
                        }
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
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
                <div key={t.id} className="p-2.5 bg-white rounded-2 border shadow-sm d-flex align-items-start gap-2 position-relative">
                  <button className="btn btn-link p-0 text-success" onClick={() => onToggleTask && onToggleTask(t.id, 'todo')}>
                    <CheckCircle2 size={18} />
                  </button>
                  <div className="flex-grow-1 text-decoration-line-through text-muted">
                    <div className="fw-semibold text-muted pe-3" style={{ fontSize: '12.5px' }}>{t.title}</div>
                    <div className="text-success d-flex flex-wrap align-items-center gap-1.5" style={{ fontSize: '10.5px' }}>
                      <span>Đã hoàn tất</span>
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
                          onDeleteTask && onDeleteTask(t.id);
                        }
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
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
  onOpenAttendanceModal,
  isDoanXa
}) {
  const [selectedCluster, setSelectedCluster] = useState('ALL');
  const [searchKeyword, setSearchKeyword] = useState('');

  // Calculate participation & evaluation rating per Hamlet branch
  const branchStats = INITIAL_BRANCHES.map(branch => {
    const clusterName = getBranchClusterName(branch.name);

    let attendedCount = 0;
    let totalAssigned = 0;

    if (activities.length > 0) {
      activities.forEach(act => {
        totalAssigned += 1;
        const record = attendanceRecords[act.id];
        if (record) {
          if (record[branch.name] === true) attendedCount += 1;
        } else {
          attendedCount += 1; // Default attended
        }
      });
    } else {
      totalAssigned = 10;
      // Default initial mock distribution for initial presentation
      const lastDigit = parseInt(branch.id.replace('ap-', '')) || 1;
      if (lastDigit % 5 === 0) attendedCount = 7; // 70%
      else if (lastDigit % 7 === 0) attendedCount = 4; // 40%
      else if (lastDigit % 3 === 0) attendedCount = 8; // 85%
      else attendedCount = 10; // 100%
    }

    const percentage = totalAssigned > 0 ? Math.min(100, Math.round((attendedCount / totalAssigned) * 100)) : 100;
    const rating = calculateBranchRating(percentage);

    return {
      ...branch,
      clusterName,
      attendedCount,
      totalAssigned,
      percentage,
      rating
    };
  });

  const filteredBranchStats = branchStats.filter(b => {
    const matchesCluster = selectedCluster === 'ALL' || b.clusterName === selectedCluster;
    const matchesSearch = b.name.toLowerCase().includes(searchKeyword.toLowerCase()) || b.secretary_name.toLowerCase().includes(searchKeyword.toLowerCase());
    return matchesCluster && matchesSearch;
  });

  const countExcellent = branchStats.filter(b => b.percentage >= 90).length;
  const countGood = branchStats.filter(b => b.percentage >= 80 && b.percentage < 90).length;
  const countFair = branchStats.filter(b => b.percentage >= 50 && b.percentage < 80).length;
  const countFailed = branchStats.filter(b => b.percentage < 50).length;

  return (
    <div className="content-card">
      {/* Header section */}
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-4 gap-3 border-bottom pb-3">
        <div>
          <h3 className="card-title-header mb-1 d-flex align-items-center gap-2">
            <BarChart2 className="text-primary" size={24} />
            Báo cáo Thống kê & Đánh giá Thi đua 30 Chi đoàn Ấp
          </h3>
          <div className="text-secondary" style={{ fontSize: '13px' }}>
            Hệ thống tính toán tỷ lệ % tham gia hoạt động, kiểm tra điểm danh và xếp loại nhiệm vụ khách quan.
          </div>
        </div>

        {isDoanXa && (
          <button 
            className="btn btn-success d-flex align-items-center gap-2 px-3 py-2 fw-semibold rounded-3 shadow-sm"
            style={{ backgroundColor: '#16A34A', border: 'none' }}
            onClick={onOpenAttendanceModal}
          >
            <CheckCircle2 size={18} />
            <span>⚡ Điểm danh & Đánh giá Hoạt động</span>
          </button>
        )}
      </div>

      {/* Overview Metric Cards */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="p-3 bg-success-subtle border border-success-subtle rounded-3 h-100">
            <div className="d-flex align-items-center justify-content-between text-success mb-1">
              <span className="fw-bold" style={{ fontSize: '12.5px' }}>🌟 Xuất sắc (90-100%)</span>
              <span className="badge bg-success text-white">90 - 100%</span>
            </div>
            <div className="fw-extrabold text-success" style={{ fontSize: '28px', lineHeight: 1.1 }}>
              {countExcellent} <span className="fs-6 fw-normal text-muted">Chi đoàn</span>
            </div>
            <div className="text-success mt-1 fw-semibold" style={{ fontSize: '11px' }}>Hoàn thành xuất sắc nhiệm vụ</div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="p-3 bg-primary-subtle border border-primary-subtle rounded-3 h-100">
            <div className="d-flex align-items-center justify-content-between text-primary mb-1">
              <span className="fw-bold" style={{ fontSize: '12.5px' }}>💙 Tốt (80 - dưới 90%)</span>
              <span className="badge bg-primary text-white">80 - 89%</span>
            </div>
            <div className="fw-extrabold text-primary" style={{ fontSize: '28px', lineHeight: 1.1 }}>
              {countGood} <span className="fs-6 fw-normal text-muted">Chi đoàn</span>
            </div>
            <div className="text-primary mt-1 fw-semibold" style={{ fontSize: '11px' }}>Hoàn thành tốt nhiệm vụ</div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="p-3 bg-warning-subtle border border-warning-subtle rounded-3 h-100">
            <div className="d-flex align-items-center justify-content-between text-warning-emphasis mb-1">
              <span className="fw-bold" style={{ fontSize: '12.5px' }}>🟡 Hoàn thành (50 - dưới 80%)</span>
              <span className="badge bg-warning text-dark">50 - 79%</span>
            </div>
            <div className="fw-extrabold text-warning-emphasis" style={{ fontSize: '28px', lineHeight: 1.1 }}>
              {countFair} <span className="fs-6 fw-normal text-muted">Chi đoàn</span>
            </div>
            <div className="text-warning-emphasis mt-1 fw-semibold" style={{ fontSize: '11px' }}>Hoàn thành nhiệm vụ</div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="p-3 bg-danger-subtle border border-danger-subtle rounded-3 h-100">
            <div className="d-flex align-items-center justify-content-between text-danger mb-1">
              <span className="fw-bold" style={{ fontSize: '12.5px' }}>🔴 Chưa hoàn thành (&lt;50%)</span>
              <span className="badge bg-danger text-white">&lt; 50%</span>
            </div>
            <div className="fw-extrabold text-danger" style={{ fontSize: '28px', lineHeight: 1.1 }}>
              {countFailed} <span className="fs-6 fw-normal text-muted">Chi đoàn</span>
            </div>
            <div className="text-danger mt-1 fw-semibold" style={{ fontSize: '11px' }}>Không hoàn thành nhiệm vụ</div>
          </div>
        </div>
      </div>

      {/* Criteria Legend Card */}
      <div className="p-3 bg-light rounded-3 border mb-4">
        <div className="fw-bold text-dark mb-2" style={{ fontSize: '13.5px' }}>📌 Tiêu chí Đánh giá & Xếp loại Thi đua theo Tỷ lệ % Tham gia Hoạt động:</div>
        <div className="row g-2 text-dark" style={{ fontSize: '12px' }}>
          <div className="col-12 col-md-6 col-lg-3">
            <div className="p-2 bg-white rounded-2 border d-flex align-items-center gap-2">
              <span className="badge bg-success text-white">90 - 100%</span>
              <span className="fw-bold text-success">🌟 Hoàn thành xuất sắc nhiệm vụ</span>
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-3">
            <div className="p-2 bg-white rounded-2 border d-flex align-items-center gap-2">
              <span className="badge bg-primary text-white">80 - dưới 90%</span>
              <span className="fw-bold text-primary">💙 Hoàn thành tốt nhiệm vụ</span>
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-3">
            <div className="p-2 bg-white rounded-2 border d-flex align-items-center gap-2">
              <span className="badge bg-warning text-dark">50 - dưới 80%</span>
              <span className="fw-bold text-warning-emphasis">🟡 Hoàn thành nhiệm vụ</span>
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-3">
            <div className="p-2 bg-white rounded-2 border d-flex align-items-center gap-2">
              <span className="badge bg-danger text-white">dưới 50%</span>
              <span className="fw-bold text-danger">🔴 Không hoàn thành nhiệm vụ</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-3">
        <div className="d-flex align-items-center gap-2">
          <Filter size={18} className="text-secondary" />
          <span className="fw-semibold text-dark" style={{ fontSize: '13px' }}>Lọc theo Cụm thi đua:</span>
          <select 
            className="form-select form-select-sm"
            style={{ width: '240px' }}
            value={selectedCluster}
            onChange={(e) => setSelectedCluster(e.target.value)}
          >
            <option value="ALL">🏆 Tất cả 6 Cụm thi đua</option>
            {COMPETITION_CLUSTERS.map(c => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="search-input-group" style={{ maxWidth: '280px' }}>
          <Search size={15} className="text-secondary me-2" />
          <input 
            type="text" 
            placeholder="Tìm tên Chi đoàn Ấp..." 
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
        </div>
      </div>

      {/* Ratings Table for 30 Hamlets */}
      <div className="table-responsive">
        <table className="custom-table align-middle">
          <thead>
            <tr>
              <th style={{ width: '40px' }}>STT</th>
              <th>Chi đoàn Ấp</th>
              <th>Cụm thi đua</th>
              <th>Bí thư Chi đoàn</th>
              <th>Hoạt động tham gia</th>
              <th style={{ width: '180px' }}>Tỷ lệ % tham gia</th>
              <th>Kết quả Xếp loại</th>
              {isDoanXa && <th className="text-end">Thao tác</th>}
            </tr>
          </thead>
          <tbody>
            {filteredBranchStats.map((item, index) => (
              <tr key={item.id}>
                <td className="fw-bold text-muted" style={{ fontSize: '12px' }}>{index + 1}</td>
                <td>
                  <div className="fw-bold text-dark" style={{ fontSize: '13.5px' }}>{item.name}</div>
                  <div className="text-muted" style={{ fontSize: '11px' }}>{item.code}</div>
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
                  <span className="fw-bold text-dark" style={{ fontSize: '13px' }}>
                    {item.attendedCount} / {item.totalAssigned}
                  </span>
                  <span className="text-muted ms-1" style={{ fontSize: '11px' }}>HĐ</span>
                </td>
                <td>
                  <div className="d-flex align-items-center gap-2">
                    <div className="progress flex-grow-1" style={{ height: '8px', borderRadius: '4px' }}>
                      <div 
                        className="progress-bar transition" 
                        role="progressbar" 
                        style={{ 
                          width: `${item.percentage}%`,
                          backgroundColor: item.rating.color 
                        }}
                      ></div>
                    </div>
                    <span className="fw-bold" style={{ fontSize: '12px', color: item.rating.color, minWidth: '38px' }}>
                      {item.percentage}%
                    </span>
                  </div>
                </td>
                <td>
                  <span className={`badge ${item.rating.badgeClass} border px-2.5 py-1.5 rounded-2 d-inline-flex align-items-center gap-1.5`} style={{ fontSize: '11.5px', fontWeight: 600 }}>
                    <span>{item.rating.icon}</span>
                    <span>{item.rating.label}</span>
                  </span>
                </td>
                {isDoanXa && (
                  <td className="text-end">
                    <button 
                      className="btn btn-sm btn-outline-success fw-semibold d-inline-flex align-items-center gap-1 px-2.5 py-1"
                      style={{ fontSize: '11px', borderRadius: '6px' }}
                      onClick={onOpenAttendanceModal}
                      title="Điểm danh cho Chi đoàn này"
                    >
                      <CheckCircle2 size={13} />
                      <span>Điểm danh</span>
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// 7. Full Storage Archive View
export function StorageArchiveView({ documents = [], submissions = [] }) {
  const [search, setSearch] = useState('');

  const allFiles = [
    ...documents.filter(d => d.file_name || d.file_url).map(d => ({ 
      id: d.id, 
      name: d.file_name || 'Van_Ban.pdf', 
      url: d.file_url || d.pdf_url || `/${d.file_name}`,
      title: d.title, 
      category: 'Văn bản ban hành', 
      date: d.date || 'Hôm nay' 
    })),
    ...submissions.filter(s => s.file_name || s.file_url).map(s => ({ 
      id: s.id, 
      name: s.file_name || 'Bao_Cao.pdf', 
      url: s.file_url || `/${s.file_name}`,
      title: s.title, 
      category: 'Báo cáo Chi đoàn', 
      date: s.sub_date || 'Hôm nay' 
    }))
  ].filter(f => f.title.toLowerCase().includes(search.toLowerCase()) || f.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="content-card">
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-4 gap-3 border-bottom pb-3">
        <div>
          <h3 className="card-title-header mb-1 d-flex align-items-center gap-2">
            <Folder className="text-primary" size={24} />
            Kho Lưu trữ Văn bản Số
          </h3>
          <div className="text-secondary" style={{ fontSize: '13px' }}>
            Lưu trữ và tra cứu tập trung toàn bộ hệ thống hồ sơ, công văn, báo cáo tệp PDF
          </div>
        </div>

        <div className="input-group" style={{ maxWidth: '320px' }}>
          <span className="input-group-text bg-light border-end-0"><Search size={15} className="text-secondary" /></span>
          <input 
            type="text" 
            className="form-control bg-light border-start-0 ps-0" 
            placeholder="Tìm kiếm tệp hồ sơ..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ fontSize: '13px' }}
          />
        </div>
      </div>

      {allFiles.length === 0 ? (
        <div className="p-5 bg-light rounded-3 text-center border my-3">
          <div className="p-3 bg-white d-inline-block rounded-circle shadow-sm mb-3 text-primary">
            <Folder size={32} />
          </div>
          <h5 className="fw-bold text-dark mb-1">Kho lưu trữ số sẵn sàng</h5>
          <p className="text-secondary mb-0" style={{ fontSize: '13px' }}>
            Tất cả các tệp đính kèm văn bản và báo cáo khi phát hành hoặc nộp sẽ tự động được lưu trữ tại đây.
          </p>
        </div>
      ) : (
        <div className="row g-3">
          {allFiles.map(file => (
            <div key={file.id} className="col-12 col-md-6 col-lg-4">
              <div className="p-3 bg-light rounded-3 border d-flex align-items-center justify-content-between hover-shadow transition">
                <div className="d-flex align-items-center gap-2">
                  <div className="p-2 rounded-2 bg-primary-subtle text-primary">
                    <FileText size={20} />
                  </div>
                  <div>
                    <div className="fw-bold text-dark" style={{ fontSize: '13px' }}>{file.title}</div>
                    <div className="text-muted" style={{ fontSize: '11px' }}>{file.category} • {file.date}</div>
                  </div>
                </div>
                <a 
                  href={file.url} 
                  download={file.name}
                  target="_blank" 
                  rel="noreferrer" 
                  className="btn btn-sm btn-outline-primary"
                >
                  <Download size={14} />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// 8. Full Settings & Hybrid Storage System View
export function SettingsView({ currentRole }) {
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
              <div className="fw-bold text-dark" style={{ fontSize: '14px' }}>{currentRole.full_name}</div>
            </div>

            <div className="mb-2">
              <label className="text-muted" style={{ fontSize: '11px' }}>Email đăng nhập</label>
              <div className="fw-bold text-dark" style={{ fontSize: '14px' }}>{currentRole.email}</div>
            </div>

            <div className="mb-2">
              <label className="text-muted" style={{ fontSize: '11px' }}>Chức vụ & Phân quyền</label>
              <div>
                <span className="badge bg-primary-subtle text-primary border border-primary-subtle fw-bold px-2 py-1">
                  {currentRole.role === 'doan_xa' ? 'Quản trị viên Đoàn xã' : 'Bí thư Chi đoàn Ấp'}
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

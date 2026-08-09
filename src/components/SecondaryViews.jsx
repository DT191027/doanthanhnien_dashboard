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
  AlertTriangle
} from 'lucide-react';
import { INITIAL_BRANCHES, isSupabaseConfigured } from '../lib/supabase';
import { getStorageQuotaMetrics, DOAN_XA_GMAIL } from '../lib/storageStrategy';

// 1. Full Activities Management View
export function ActivitiesView({ activities = [], onOpenCreateActivity, isDoanXa }) {
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  const filtered = activities.filter(a => {
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
          {filtered.map((act) => (
            <div key={act.id} className="col-12 col-md-6 col-xl-4">
              <div className="p-3 rounded-3 bg-light border h-100 d-flex flex-column justify-content-between hover-shadow transition">
                <div>
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <div className="activity-date-badge">
                      <div className="activity-date-num">{act.day}</div>
                      <div className="activity-date-month">{act.month}</div>
                    </div>
                    <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2 py-1" style={{ fontSize: '11px', fontWeight: 600 }}>
                      {act.status}
                    </span>
                  </div>
                  <h5 className="fw-bold text-dark mb-2" style={{ fontSize: '15px', lineHeight: '1.3' }}>
                    {act.title}
                  </h5>
                  <div className="text-secondary d-flex flex-column gap-1 mb-3" style={{ fontSize: '12px' }}>
                    <span className="d-flex align-items-center gap-1.5"><Clock size={14} className="text-primary" /> {act.time}</span>
                    <span className="d-flex align-items-center gap-1.5"><MapPin size={14} className="text-danger" /> {act.location}</span>
                  </div>
                </div>

                <div className="pt-2 border-top d-flex align-items-center justify-content-between text-muted" style={{ fontSize: '11px' }}>
                  <span>🏛️ Ban Thường vụ Đoàn xã</span>
                  <span className="fw-semibold text-primary">Chi tiết →</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// 2. Full Documents Management View
export function DocumentsView({ documents = [], tabType = 'incoming_docs', onOpenIssueDocument, isDoanXa }) {
  const [search, setSearch] = useState('');

  const filtered = documents.filter(d => 
    d.title.toLowerCase().includes(search.toLowerCase()) || 
    (d.doc_number && d.doc_number.toLowerCase().includes(search.toLowerCase()))
  );

  const titleMap = {
    incoming_docs: 'Quản lý Văn bản đến',
    outgoing_docs: 'Quản lý Văn bản đi',
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
                    {doc.file_name ? (
                      <a href={`/${doc.file_name}`} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-1">
                        <Download size={13} /> Tải PDF
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
                    {s.file_name ? (
                      <a href={`/${s.file_name}`} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-success d-inline-flex align-items-center gap-1">
                        <Download size={13} /> {s.file_name}
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
export function NotificationsView({ notifications = [], onOpenSendMessage, isDoanXa }) {
  return (
    <div className="content-card">
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-4 gap-3 border-bottom pb-3">
        <div>
          <h3 className="card-title-header mb-1 d-flex align-items-center gap-2">
            <Bell className="text-warning" size={24} />
            Quản lý Thông báo & Tin tức Điều hành
          </h3>
          <div className="text-secondary" style={{ fontSize: '13px' }}>
            Danh sách thông báo khẩn, chỉ đạo điều hành tức thời toàn hệ thống
          </div>
        </div>

        <button 
          className="btn btn-primary d-flex align-items-center gap-2 px-3 py-2 fw-semibold rounded-3 shadow-sm"
          style={{ backgroundColor: '#0066FF', border: 'none' }}
          onClick={onOpenSendMessage}
        >
          <MessageSquare size={16} />
          <span>Gửi thông báo / Tin nhắn</span>
        </button>
      </div>

      {notifications.length === 0 ? (
        <div className="p-5 bg-light rounded-3 text-center border my-3">
          <div className="p-3 bg-white d-inline-block rounded-circle shadow-sm mb-3 text-warning">
            <Bell size={32} />
          </div>
          <h5 className="fw-bold text-dark mb-1">Chưa có thông báo nào trong hệ thống</h5>
          <p className="text-secondary mb-3" style={{ fontSize: '13px' }}>
            Bấm nút "Gửi thông báo / Tin nhắn" ở trên để gửi tin tức điều hành tới Đoàn xã và 30 Chi đoàn Ấp.
          </p>
          <button className="btn btn-primary px-4 fw-semibold" style={{ backgroundColor: '#0066FF' }} onClick={onOpenSendMessage}>
            + Gửi thông báo đầu tiên
          </button>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {notifications.map((n) => (
            <div key={n.id} className="p-3 rounded-3 bg-light border d-flex align-items-start gap-3 hover-shadow transition">
              <div className="p-2.5 rounded-3 bg-warning-subtle text-warning mt-1">
                <Bell size={20} />
              </div>
              <div className="flex-grow-1">
                <div className="d-flex align-items-center justify-content-between mb-1">
                  <h6 className="fw-bold text-dark mb-0" style={{ fontSize: '14.5px' }}>{n.title}</h6>
                  <span className="text-muted" style={{ fontSize: '11px' }}>{n.time_ago || 'Vừa xong'}</span>
                </div>
                {n.content && <p className="text-secondary mb-0" style={{ fontSize: '12.5px' }}>{n.content}</p>}
                <div className="mt-2 text-primary fw-semibold" style={{ fontSize: '11px' }}>
                  📌 Gửi từ: Đoàn xã Xuân Thới Sơn đến {n.target_scope || '30 Chi đoàn Ấp'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// 5. Full Tasks & Todo Management View
export function TasksView({ isDoanXa }) {
  const [tasks, setTasks] = useState([
    { id: 't1', title: 'Tổng hợp báo cáo tháng 5 của 30 Chi đoàn Ấp', status: 'inProgress', priority: 'Cao', dueDate: '15/06/2026' },
    { id: 't2', title: 'Chuẩn bị nội dung cuộc họp Ban chấp hành Đoàn xã', status: 'todo', priority: 'Trung bình', dueDate: '18/06/2026' },
    { id: 't3', title: 'Rà soát danh sách đoàn viên ưu tú 30 Ấp', status: 'completed', priority: 'Bình thường', dueDate: '10/06/2026' }
  ]);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    setTasks([
      {
        id: `t-${Date.now()}`,
        title: newTaskTitle.trim(),
        status: 'todo',
        priority: 'Bình thường',
        dueDate: 'Hôm nay'
      },
      ...tasks
    ]);
    setNewTaskTitle('');
  };

  const handleToggleTask = (id) => {
    setTasks(tasks.map(t => {
      if (t.id === id) {
        const nextStatus = t.status === 'completed' ? 'todo' : 'completed';
        return { ...t, status: nextStatus };
      }
      return t;
    }));
  };

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

        {/* Add Task Quick Form */}
        <form onSubmit={handleAddTask} className="d-flex gap-2" style={{ maxWidth: '420px', width: '100%' }}>
          <input 
            type="text" 
            className="form-control" 
            placeholder="Nhập tên nhiệm vụ mới..." 
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            style={{ fontSize: '13px' }}
          />
          <button type="submit" className="btn btn-primary text-nowrap px-3 fw-semibold" style={{ backgroundColor: '#0066FF' }}>
            + Thêm
          </button>
        </form>
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
                <div key={t.id} className="p-2.5 bg-white rounded-2 border shadow-sm d-flex align-items-start gap-2">
                  <button className="btn btn-link p-0 text-secondary" onClick={() => handleToggleTask(t.id)}>
                    <Circle size={18} />
                  </button>
                  <div className="flex-grow-1">
                    <div className="fw-bold text-dark" style={{ fontSize: '12.5px' }}>{t.title}</div>
                    <div className="text-muted" style={{ fontSize: '10.5px' }}>Hạn: {t.dueDate}</div>
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
              <span className="fw-bold text-primary" style={{ fontSize: '13.5px' }}>🔄 Đang tiến hành ({tasks.filter(t => t.status === 'inProgress').length})</span>
              <span className="badge bg-primary-subtle text-primary">In Progress</span>
            </div>
            <div className="d-flex flex-column gap-2">
              {tasks.filter(t => t.status === 'inProgress').map(t => (
                <div key={t.id} className="p-2.5 bg-white rounded-2 border shadow-sm d-flex align-items-start gap-2">
                  <button className="btn btn-link p-0 text-primary" onClick={() => handleToggleTask(t.id)}>
                    <Circle size={18} />
                  </button>
                  <div className="flex-grow-1">
                    <div className="fw-bold text-dark" style={{ fontSize: '12.5px' }}>{t.title}</div>
                    <div className="text-muted" style={{ fontSize: '10.5px' }}>Ưu tiên: {t.priority}</div>
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
                <div key={t.id} className="p-2.5 bg-white rounded-2 border shadow-sm d-flex align-items-start gap-2 text-decoration-line-through text-muted">
                  <button className="btn btn-link p-0 text-success" onClick={() => handleToggleTask(t.id)}>
                    <CheckCircle2 size={18} />
                  </button>
                  <div className="flex-grow-1">
                    <div className="fw-semibold text-muted" style={{ fontSize: '12.5px' }}>{t.title}</div>
                    <div className="text-success" style={{ fontSize: '10.5px' }}>Đã hoàn tất</div>
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

// 6. Full Reports & Analytics View
export function ReportsView({ activitiesCount = 0, docsCount = 0, submissionsCount = 0 }) {
  return (
    <div className="content-card">
      <div className="d-flex align-items-center justify-content-between mb-4 border-bottom pb-3">
        <div>
          <h3 className="card-title-header mb-1 d-flex align-items-center gap-2">
            <BarChart2 className="text-primary" size={24} />
            Báo cáo Thống kê Công tác Đoàn
          </h3>
          <div className="text-secondary" style={{ fontSize: '13px' }}>
            Tổng hợp dữ liệu điều hành và chỉ số nộp báo cáo của Đoàn xã & 30 Chi đoàn Ấp
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-3">
          <div className="p-3 bg-light rounded-3 border text-center">
            <div className="text-secondary fw-semibold" style={{ fontSize: '12px' }}>Chi đoàn Ấp trực thuộc</div>
            <div className="fw-extrabold text-primary my-1" style={{ fontSize: '26px' }}>30</div>
            <div className="text-success" style={{ fontSize: '11px' }}>100% Đang hoạt động</div>
          </div>
        </div>
        <div className="col-12 col-md-3">
          <div className="p-3 bg-light rounded-3 border text-center">
            <div className="text-secondary fw-semibold" style={{ fontSize: '12px' }}>Hoạt động đã phát động</div>
            <div className="fw-extrabold text-dark my-1" style={{ fontSize: '26px' }}>{activitiesCount}</div>
            <div className="text-muted" style={{ fontSize: '11px' }}>Cập nhật Realtime</div>
          </div>
        </div>
        <div className="col-12 col-md-3">
          <div className="p-3 bg-light rounded-3 border text-center">
            <div className="text-secondary fw-semibold" style={{ fontSize: '12px' }}>Văn bản đã ban hành</div>
            <div className="fw-extrabold text-dark my-1" style={{ fontSize: '26px' }}>{docsCount}</div>
            <div className="text-muted" style={{ fontSize: '11px' }}>Cập nhật Realtime</div>
          </div>
        </div>
        <div className="col-12 col-md-3">
          <div className="p-3 bg-light rounded-3 border text-center">
            <div className="text-secondary fw-semibold" style={{ fontSize: '12px' }}>Báo cáo đã tiếp nhận</div>
            <div className="fw-extrabold text-success my-1" style={{ fontSize: '26px' }}>{submissionsCount}</div>
            <div className="text-muted" style={{ fontSize: '11px' }}>Cập nhật Realtime</div>
          </div>
        </div>
      </div>

      {/* Progress Breakdown of 30 Hamlets */}
      <h5 className="fw-bold text-dark mb-3">Tình hình nộp báo cáo 30 Chi đoàn Ấp</h5>
      <div className="row g-2">
        {INITIAL_BRANCHES.slice(0, 12).map(b => (
          <div key={b.id} className="col-12 col-md-6 col-lg-4">
            <div className="p-2.5 bg-light rounded-2 border d-flex align-items-center justify-content-between">
              <div>
                <div className="fw-bold text-dark" style={{ fontSize: '12.5px' }}>{b.name}</div>
                <div className="text-muted" style={{ fontSize: '10.5px' }}>Bí thư: {b.secretary_name}</div>
              </div>
              <span className="badge bg-success-subtle text-success">Đã hoàn thành</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 7. Full Storage Archive View
export function StorageArchiveView({ documents = [], submissions = [] }) {
  const [search, setSearch] = useState('');

  const allFiles = [
    ...documents.filter(d => d.file_name).map(d => ({ id: d.id, name: d.file_name, title: d.title, category: 'Văn bản ban hành', date: d.date || 'Hôm nay' })),
    ...submissions.filter(s => s.file_name).map(s => ({ id: s.id, name: s.file_name, title: s.title, category: 'Báo cáo Chi đoàn', date: s.sub_date || 'Hôm nay' }))
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
                <a href={`/${file.name}`} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-primary">
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
          </div>
        </div>
      </div>
    </div>
  );
}

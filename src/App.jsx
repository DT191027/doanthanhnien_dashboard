import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import QuickActions from './components/QuickActions';
import StatsCards from './components/StatsCards';
import TodoList from './components/TodoList';
import UpcomingActivities from './components/UpcomingActivities';
import CalendarWidget from './components/CalendarWidget';
import PendingDocs from './components/PendingDocs';
import DocHistoryTable from './components/DocHistoryTable';
import BranchTasks from './components/BranchTasks';
import NotificationsList from './components/NotificationsList';
import ChiDoanDocsList from './components/ChiDoanDocsList';
import Login from './components/Login';
import { 
  CreateActivityModal, 
  IssueDocumentModal, 
  SubmitDocumentModal, 
  SendMessageModal,
  SupportModal,
  CreateTaskModal,
  ActivityAttendanceModal
} from './components/Modals';
import { 
  ActivitiesView, 
  DocumentsView, 
  SubmissionsView, 
  NotificationsView, 
  TasksView, 
  ReportsView, 
  StorageArchiveView, 
  SettingsView 
} from './components/SecondaryViews';
import { 
  INITIAL_BRANCHES, 
  supabase, 
  isSupabaseConfigured,
  syncFetchActivities,
  syncSaveActivity,
  syncToggleActivityStatus,
  syncDeleteActivity,
  syncFetchDocuments,
  syncSaveDocument,
  syncFetchSubmissions,
  syncSaveSubmission,
  syncFetchNotifications,
  syncSaveNotification,
  syncUpdateNotification,
  syncDeleteNotification,
  syncFetchTasks,
  syncSaveTask,
  syncToggleTaskStatus,
  syncFetchAttendance,
  syncSaveAttendance,
  COMPETITION_CLUSTERS
} from './lib/supabase';
import { Search, CheckCircle } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = sessionStorage.getItem('xts_current_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Dynamic Realtime & Persistent State Lists
  const [activitiesList, setActivitiesList] = useState([]);
  const [documentsList, setDocumentsList] = useState([]);
  const [submissionsList, setSubmissionsList] = useState([]);
  const [notificationsList, setNotificationsList] = useState([]);
  const [tasksList, setTasksList] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState({});

  // Modals state
  const [showCreateActivityModal, setShowCreateActivityModal] = useState(false);
  const [showIssueDocModal, setShowIssueDocModal] = useState(false);
  const [showSubmitDocModal, setShowSubmitDocModal] = useState(false);
  const [showSendMessageModal, setShowSendMessageModal] = useState(false);
  const [editingNotification, setEditingNotification] = useState(null);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    try {
      sessionStorage.setItem('xts_current_user', JSON.stringify(user));
    } catch (e) {}
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab('dashboard');
    try {
      sessionStorage.removeItem('xts_current_user');
    } catch (e) {}
  };

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 4000);
  };

  const loadAllData = async () => {
    const [acts, docs, subs, notis, tsks, atts] = await Promise.all([
      syncFetchActivities(),
      syncFetchDocuments(),
      syncFetchSubmissions(),
      syncFetchNotifications(),
      syncFetchTasks(),
      syncFetchAttendance()
    ]);
    setActivitiesList(acts);
    setDocumentsList(docs);
    setSubmissionsList(subs);
    setNotificationsList(notis);
    setTasksList(tsks);
    setAttendanceRecords(atts || {});
  };

  useEffect(() => {
    loadAllData();

    if (supabase) {
      const channel = supabase
        .channel('public-db-changes')
        .on('postgres_changes', { event: '*', schema: 'public' }, () => {
          loadAllData();
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, []);

  if (!currentUser) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  const isDoanXa = currentUser.role === 'doan_xa';

  const incomingDocsCount = submissionsList.length + documentsList.filter(d => d.type === 'incoming').length;
  const outgoingDocsCount = documentsList.filter(d => d.type === 'outgoing' || !d.type).length;

  const handleAddActivity = async (newAct) => {
    const activityItem = {
      id: `act-${Date.now()}`,
      day: newAct.day || '25',
      month: newAct.month || 'THÁNG 5',
      title: newAct.title,
      time: newAct.time || '08:00 - 11:30',
      location: newAct.location || 'Trụ sở Đảng ủy xã Xuân Thới Sơn: 2/2 Nguyễn Thị Nuôi, Ấp 54, Xã Xuân Thới Sơn, TP Hồ Chí Minh, Việt Nam',
      description: newAct.description || '',
      status: 'Sắp diễn ra',
      dateIso: new Date().toISOString().split('T')[0]
    };
    const updated = await syncSaveActivity(activityItem);
    setActivitiesList(updated);

    // Tự động phát thông báo tới tất cả 30 Chi đoàn Ấp
    const autoNoti = {
      id: `noti-${Date.now()}`,
      title: `📢 Hoạt động mới: ${newAct.title}`,
      content: `Ban Thường vụ Đoàn xã Xuân Thới Sơn phát động hoạt động "${newAct.title}" vào ${activityItem.time} ngày ${activityItem.day} ${activityItem.month} tại ${activityItem.location}. Đề nghị 30 Chi đoàn Ấp triển khai tham gia.`,
      target_scope: 'Tất cả 30 Chi đoàn Ấp',
      time_ago: 'Vừa xong'
    };
    const updatedNotis = await syncSaveNotification(autoNoti);
    setNotificationsList(updatedNotis);

    triggerToast(`Đã tạo hoạt động "${newAct.title}" và tự động phát thông báo tới 30 Chi đoàn Ấp!`);
  };

  const handleToggleActivityStatus = async (activityId, newStatus) => {
    const updated = await syncToggleActivityStatus(activityId, newStatus);
    setActivitiesList(updated);
    triggerToast(newStatus === 'Đã hoàn thành' ? 'Đã đánh dấu hoàn thành hoạt động!' : 'Đã chuyển hoạt động về sắp diễn ra!');
  };

  const handleDeleteActivity = async (activityId) => {
    const updated = await syncDeleteActivity(activityId);
    setActivitiesList(updated);
    triggerToast('Đã xóa hoạt động thành công!');
  };

  const handleIssueDocument = async (newDoc) => {
    const createdDoc = {
      id: `doc-${Date.now()}`,
      doc_number: newDoc.doc_number,
      title: newDoc.title,
      summary: `Ban hành ngày ${new Date().toLocaleDateString('vi-VN')}`,
      sender: 'Đoàn xã Xuân Thới Sơn',
      recipient_scope: newDoc.recipient_scope,
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      status: 'Chưa đọc',
      type: 'outgoing',
      date: new Date().toLocaleDateString('vi-VN'),
      dateText: 'Hôm nay',
      file_name: newDoc.file_name || '',
      file_url: newDoc.file_url || '',
      storage_provider: newDoc.storage_provider || 'supabase'
    };
    const updated = await syncSaveDocument(createdDoc);
    setDocumentsList(updated);
    triggerToast(`Đã ban hành văn bản số ${newDoc.doc_number} tới các Chi đoàn!`);
  };

  const handleSubmitDocument = async (newSub) => {
    const createdSub = {
      id: `sub-${Date.now()}`,
      title: newSub.title,
      branch_name: currentUser.full_name || 'Chi đoàn Ấp',
      due_date: new Date().toLocaleDateString('vi-VN'),
      sub_date: `${new Date().toLocaleDateString('vi-VN')} ${new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`,
      status: 'Đã nộp',
      file_name: newSub.file_name || '',
      file_url: newSub.file_url || '',
      storage_provider: newSub.storage_provider || 'supabase'
    };
    const updated = await syncSaveSubmission(createdSub);
    setSubmissionsList(updated);
    triggerToast(`Đã nộp thành công báo cáo: "${newSub.title}"!`);
  };

  const handleSaveNotification = async (notiData) => {
    if (editingNotification) {
      const updatedNoti = {
        ...editingNotification,
        title: notiData.title,
        content: notiData.content,
        target_scope: notiData.target_scope,
        priority: notiData.priority
      };
      const updated = await syncUpdateNotification(updatedNoti);
      setNotificationsList(updated);
      setEditingNotification(null);
      triggerToast(`Đã cập nhật thông báo "${notiData.title}" thành công!`);
    } else {
      const createdNoti = {
        id: notiData.id || `noti-${Date.now()}`,
        title: notiData.title,
        content: notiData.content,
        target_scope: notiData.target_scope || 'Tất cả 30 Chi đoàn Ấp',
        priority: notiData.priority || 'Bình thường',
        time_ago: 'Vừa xong',
        createdAt: Date.now()
      };
      const updated = await syncSaveNotification(createdNoti);
      setNotificationsList(updated);
      setActiveTab('notifications');
      triggerToast(`Đã phát thông báo chỉ đạo: "${notiData.title}"!`);
    }
  };

  const handleEditNotification = (noti) => {
    setEditingNotification(noti);
    setShowSendMessageModal(true);
  };

  const handleDeleteNotification = async (notiId) => {
    const updated = await syncDeleteNotification(notiId);
    setNotificationsList(updated);
    triggerToast('Đã xóa thông báo khỏi hệ thống!');
  };

  const handleAddTask = async (newTask) => {
    const taskItem = {
      id: `task-${Date.now()}`,
      title: newTask.title,
      status: 'todo',
      priority: newTask.priority || 'Bình thường',
      dueDate: newTask.dueDate || 'Hôm nay',
      assigned_to: newTask.assigned_to || 'Đoàn xã Xuân Thới Sơn'
    };
    const updated = await syncSaveTask(taskItem);
    setTasksList(updated);

    // Gửi thông báo tự động khi giao nhiệm vụ cho 30 Chi đoàn hoặc Các Cụm thi đua
    if (newTask.assigned_to === 'Tất cả 30 Chi đoàn Ấp' || newTask.assigned_to.includes('30 Chi đoàn')) {
      const autoNoti = {
        id: `noti-${Date.now()}`,
        title: `📋 Nhiệm vụ mới: ${newTask.title}`,
        content: `Ban Thường vụ Đoàn xã Xuân Thới Sơn vừa giao nhiệm vụ "${newTask.title}" (Hạn hoàn thành: ${taskItem.dueDate}) tới Tất cả 30 Chi đoàn Ấp. Đề nghị các Chi đoàn khẩn trương thực hiện.`,
        target_scope: 'Tất cả 30 Chi đoàn Ấp',
        time_ago: 'Vừa xong'
      };
      const updatedNotis = await syncSaveNotification(autoNoti);
      setNotificationsList(updatedNotis);
      triggerToast(`Đã giao nhiệm vụ "${newTask.title}" và phát thông báo tới toàn bộ 30 Chi đoàn Ấp!`);
    } else if (newTask.assigned_to && newTask.assigned_to.startsWith('Cụm thi đua')) {
      const cluster = COMPETITION_CLUSTERS.find(c => c.name === newTask.assigned_to);
      const branchInfo = cluster ? ` (${cluster.branches.map(b => b.replace('Chi đoàn Ấp ', '')).join(', ')})` : '';
      const autoNoti = {
        id: `noti-${Date.now()}`,
        title: `📋 Nhiệm vụ mới - ${newTask.assigned_to}: ${newTask.title}`,
        content: `Ban Thường vụ Đoàn xã Xuân Thới Sơn giao nhiệm vụ "${newTask.title}" (Hạn hoàn thành: ${taskItem.dueDate}) cho ${newTask.assigned_to}${branchInfo}. Đề nghị các đơn vị trong cụm phối hợp triển khai.`,
        target_scope: newTask.assigned_to,
        time_ago: 'Vừa xong'
      };
      const updatedNotis = await syncSaveNotification(autoNoti);
      setNotificationsList(updatedNotis);
      triggerToast(`Đã giao nhiệm vụ "${newTask.title}" cho ${newTask.assigned_to} và phát thông báo!`);
    } else if (newTask.assigned_to && newTask.assigned_to !== 'Đoàn xã Xuân Thới Sơn') {
      const autoNoti = {
        id: `noti-${Date.now()}`,
        title: `📋 Nhiệm vụ mới: ${newTask.title}`,
        content: `Ban Thường vụ Đoàn xã Xuân Thới Sơn giao nhiệm vụ "${newTask.title}" (Hạn hoàn thành: ${taskItem.dueDate}) cho ${newTask.assigned_to}.`,
        target_scope: newTask.assigned_to,
        time_ago: 'Vừa xong'
      };
      const updatedNotis = await syncSaveNotification(autoNoti);
      setNotificationsList(updatedNotis);
      triggerToast(`Đã giao nhiệm vụ "${newTask.title}" cho ${newTask.assigned_to}!`);
    } else {
      triggerToast(`Đã thêm công việc mới: "${newTask.title}"!`);
    }
  };

  const handleToggleTask = async (taskId, newStatus) => {
    const updated = await syncToggleTaskStatus(taskId, newStatus);
    setTasksList(updated);
  };

  const handleSaveAttendance = async (activityId, recordData) => {
    const updated = await syncSaveAttendance(activityId, recordData);
    setAttendanceRecords(updated);
    triggerToast('Đã lưu kết quả điểm danh & đánh giá tham gia hoạt động!');
  };

  return (
    <div className="d-flex min-vh-100 bg-main position-relative">
      {toastMessage && (
        <div 
          className="position-fixed top-0 start-50 translate-middle-x mt-3 bg-success text-white px-4 py-2.5 rounded-3 shadow-lg d-flex align-items-center gap-2 fw-semibold"
          style={{ zIndex: 9999, fontSize: '13.5px' }}
        >
          <CheckCircle size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Mobile Sidebar Overlay Backdrop */}
      <div 
        className={`sidebar-backdrop ${mobileMenuOpen ? 'show' : ''}`}
        onClick={() => setMobileMenuOpen(false)}
      ></div>

      {/* 1. Left Sidebar (Sticky on Desktop, Slide-out Drawer on Mobile) */}
      <Sidebar 
        currentRole={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSupportModal={() => setShowSupportModal(true)}
        mobileMenuOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Workspace Area */}
      <div className="flex-grow-1 d-flex flex-column" style={{ minWidth: 0 }}>
        {/* 2. Top Navbar */}
        <Navbar 
          currentRole={currentUser}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onOpenNotifications={() => setActiveTab('notifications')}
          onOpenMessages={() => {
            setEditingNotification(null);
            setShowSendMessageModal(true);
          }}
          onLogout={handleLogout}
          unreadNotiCount={notificationsList.length}
          unreadMsgCount={notificationsList.length > 0 ? 1 : 0}
          mobileMenuOpen={mobileMenuOpen}
          onToggleMobileMenu={() => setMobileMenuOpen(prev => !prev)}
        />

        {/* Workspace Body */}
        <div className="p-3 p-lg-4 flex-grow-1">
          {searchQuery.trim() !== '' ? (
            <div className="content-card">
              <h3 className="card-title-header mb-3 d-flex align-items-center gap-2">
                <Search size={20} className="text-primary" />
                Kết quả tìm kiếm cho: "{searchQuery}"
              </h3>
              <div className="p-3 bg-light rounded-3">
                <div className="fw-semibold text-primary mb-2">Dữ liệu hệ thống:</div>
                {activitiesList.length === 0 && documentsList.length === 0 ? (
                  <div className="text-secondary" style={{ fontSize: '13px' }}>Không tìm thấy văn bản hay hoạt động khớp với từ khóa.</div>
                ) : (
                  <ul className="mb-0 text-dark" style={{ fontSize: '13px' }}>
                    {activitiesList.map(a => <li key={a.id} className="mb-1">{a.title}</li>)}
                    {documentsList.map(d => <li key={d.id} className="mb-1">{d.title}</li>)}
                  </ul>
                )}
              </div>
            </div>
          ) : activeTab === 'dashboard' ? (
            /* DASHBOARD VIEW */
            <div className="container-fluid p-0">
              {/* Top Hero Banner */}
              <HeroBanner 
                currentRole={currentUser}
                onOpenCreateActivity={() => setShowCreateActivityModal(true)}
                onOpenIssueDocument={() => setShowIssueDocModal(true)}
                activitiesCount={activitiesList.length}
                docsCount={documentsList.length}
              />

              {/* Main Grid: Center Column (8 cols) & Right Column (4 cols) */}
              <div className="row g-4">
                {/* CENTER COLUMN */}
                <div className="col-12 col-xl-8">
                  {/* Quick Actions Grid */}
                  <QuickActions 
                    currentRole={currentUser}
                    onOpenCreateActivity={() => setShowCreateActivityModal(true)}
                    onOpenIssueDocument={() => setShowIssueDocModal(true)}
                    onOpenSendNotification={() => setShowSendMessageModal(true)}
                    onOpenSubmitDoc={() => setShowSubmitDocModal(true)}
                    setActiveTab={setActiveTab}
                  />

                  {/* Middle Monthly Stats Cards (ONLY FOR ĐOÀN XÃ) */}
                  {isDoanXa && (
                    <StatsCards 
                      activitiesCount={activitiesList.length}
                      incomingDocsCount={incomingDocsCount}
                      outgoingDocsCount={outgoingDocsCount}
                    />
                  )}

                  {/* Two Sub-Columns Split */}
                  {isDoanXa ? (
                    <div className="row g-4">
                      <div className="col-12 col-md-6">
                        <TodoList 
                          tasks={tasksList} 
                          setActiveTab={setActiveTab} 
                          onOpenCreateTask={() => setShowCreateTaskModal(true)}
                        />
                      </div>
                      <div className="col-12 col-md-6">
                        <UpcomingActivities 
                          activities={activitiesList}
                          setActiveTab={setActiveTab} 
                          onOpenCreateActivity={() => setShowCreateActivityModal(true)}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="row g-4">
                      <div className="col-12 col-md-6">
                        <UpcomingActivities 
                          activities={activitiesList}
                          setActiveTab={setActiveTab} 
                        />
                      </div>
                      <div className="col-12 col-md-6">
                        <ChiDoanDocsList 
                          documents={documentsList}
                          setActiveTab={setActiveTab} 
                        />
                      </div>
                    </div>
                  )}

                  {/* Bottom Row for Chi Đoàn Ấp: Submission History Table */}
                  {!isDoanXa && (
                    <DocHistoryTable 
                      submissions={submissionsList}
                      setActiveTab={setActiveTab} 
                    />
                  )}
                </div>

                {/* RIGHT COLUMN */}
                <div className="col-12 col-xl-4">
                  <CalendarWidget />

                  <PendingDocs 
                    currentRole={currentUser}
                    documents={documentsList}
                    submissions={submissionsList}
                    setActiveTab={setActiveTab}
                  />

                  {!isDoanXa && (
                    <BranchTasks tasks={tasksList} currentRole={currentUser} setActiveTab={setActiveTab} />
                  )}

                  <NotificationsList 
                    notifications={notificationsList}
                    currentRole={currentUser}
                    setActiveTab={setActiveTab}
                  />
                </div>
              </div>
            </div>
          ) : activeTab === 'activities' ? (
            /* ACTIVITIES MANAGEMENT VIEW */
            <ActivitiesView 
              activities={activitiesList}
              onOpenCreateActivity={() => setShowCreateActivityModal(true)}
              isDoanXa={isDoanXa}
              onToggleStatus={handleToggleActivityStatus}
              onDeleteActivity={handleDeleteActivity}
            />
          ) : activeTab === 'incoming_docs' || activeTab === 'outgoing_docs' || activeTab === 'doan_xa_docs' || activeTab === 'required_docs' ? (
            /* DOCUMENTS MANAGEMENT VIEW */
            <DocumentsView 
              documents={documentsList}
              tabType={activeTab}
              onOpenIssueDocument={() => setShowIssueDocModal(true)}
              isDoanXa={isDoanXa}
            />
          ) : activeTab === 'submission_history' ? (
            /* SUBMISSIONS HISTORY VIEW */
            <SubmissionsView 
              submissions={submissionsList}
              onOpenSubmitDoc={() => setShowSubmitDocModal(true)}
            />
          ) : activeTab === 'notifications' ? (
            /* NOTIFICATIONS VIEW */
            <NotificationsView 
              notifications={notificationsList}
              onOpenSendMessage={() => {
                setEditingNotification(null);
                setShowSendMessageModal(true);
              }}
              onEditNotification={handleEditNotification}
              onDeleteNotification={handleDeleteNotification}
              isDoanXa={isDoanXa}
            />
          ) : activeTab === 'todo' || activeTab === 'branch_tasks' ? (
            /* TASKS MANAGEMENT VIEW */
            <TasksView 
              tasks={tasksList} 
              onOpenCreateTask={() => setShowCreateTaskModal(true)} 
              onToggleTask={handleToggleTask} 
              isDoanXa={isDoanXa} 
            />
          ) : activeTab === 'reports' ? (
            /* REPORTS & ANALYTICS VIEW */
            <ReportsView 
              activitiesCount={activitiesList.length}
              docsCount={documentsList.length}
              submissionsCount={submissionsList.length}
              activities={activitiesList}
              attendanceRecords={attendanceRecords}
              onOpenAttendanceModal={() => setShowAttendanceModal(true)}
              isDoanXa={isDoanXa}
            />
          ) : activeTab === 'storage' ? (
            /* STORAGE ARCHIVE VIEW */
            <StorageArchiveView 
              documents={documentsList}
              submissions={submissionsList}
            />
          ) : activeTab === 'settings' ? (
            /* SETTINGS VIEW */
            <SettingsView currentRole={currentUser} />
          ) : activeTab === 'branches' ? (
            /* 30 CHI ĐOÀN ẤP MANAGEMENT VIEW */
            <div className="content-card">
              <div className="d-flex align-items-center justify-content-between mb-4">
                <div>
                  <h3 className="card-title-header mb-1">Danh sách 30 Chi đoàn Ấp trực thuộc</h3>
                  <div className="text-secondary" style={{ fontSize: '13px' }}>
                    Quản lý thông tin bí thư và đoàn viên 30 Ấp thuộc Đoàn xã Xuân Thới Sơn
                  </div>
                </div>
                <button className="btn btn-primary fw-semibold" style={{ backgroundColor: '#0066FF' }}>
                  + Thêm Chi đoàn mới
                </button>
              </div>

              <div className="row g-3">
                {INITIAL_BRANCHES.map((b) => (
                  <div key={b.id} className="col-12 col-md-6 col-lg-4">
                    <div className="p-3 rounded-3 bg-light border h-100 hover-shadow transition">
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <span className="badge bg-primary-subtle text-primary fw-bold">{b.code}</span>
                        <span className="text-secondary" style={{ fontSize: '11px' }}>0 Đoàn viên</span>
                      </div>
                      <h5 className="fw-bold text-dark mb-1" style={{ fontSize: '15px' }}>{b.name}</h5>
                      <div className="text-muted" style={{ fontSize: '12.5px' }}>👤 {b.secretary_name}</div>
                      <div className="text-muted" style={{ fontSize: '11px' }}>✉️ {b.email}</div>
                      <div className="mt-3 pt-2 border-top d-flex justify-content-between align-items-center">
                        <span className="text-success fw-bold" style={{ fontSize: '11px' }}>● Đang hoạt động</span>
                        <span className="badge bg-light text-secondary border">Đã bảo mật</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* FALLBACK DEFAULT VIEW */
            <div className="content-card p-5 text-center">
              <h5 className="fw-bold text-dark">Giao diện điều hành hệ thống</h5>
              <p className="text-secondary" style={{ fontSize: '13px' }}>Chức năng đã sẵn sàng vận hành.</p>
              <button className="btn btn-primary" onClick={() => setActiveTab('dashboard')}>Về Dashboard</button>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Modals */}
      <CreateActivityModal 
        show={showCreateActivityModal}
        onClose={() => setShowCreateActivityModal(false)}
        onSave={handleAddActivity}
      />

      <IssueDocumentModal 
        show={showIssueDocModal}
        onClose={() => setShowIssueDocModal(false)}
        onSave={handleIssueDocument}
      />

      <SubmitDocumentModal 
        show={showSubmitDocModal}
        onClose={() => setShowSubmitDocModal(false)}
        onSave={handleSubmitDocument}
        currentRole={currentUser}
      />

      <SendMessageModal 
        show={showSendMessageModal}
        onClose={() => {
          setShowSendMessageModal(false);
          setEditingNotification(null);
        }}
        onSave={handleSaveNotification}
        currentRole={currentUser}
        editData={editingNotification}
      />

      <SupportModal 
        show={showSupportModal}
        onClose={() => setShowSupportModal(false)}
      />

      <CreateTaskModal 
        show={showCreateTaskModal}
        onClose={() => setShowCreateTaskModal(false)}
        onSave={handleAddTask}
      />

      <ActivityAttendanceModal 
        show={showAttendanceModal}
        onClose={() => setShowAttendanceModal(false)}
        activities={activitiesList}
        attendanceRecords={attendanceRecords}
        onSaveAttendance={handleSaveAttendance}
      />
    </div>
  );
}

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
  SupportModal 
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
  syncFetchDocuments,
  syncSaveDocument,
  syncFetchSubmissions,
  syncSaveSubmission,
  syncFetchNotifications,
  syncSaveNotification
} from './lib/supabase';
import { Search, CheckCircle } from 'lucide-react';

export default function App() {
  // Session Persistence via sessionStorage:
  // - Persists on F5 Page Reload within same tab
  // - Automatically Wiped when Browser Tab is Closed (protects against unauthorized access)
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

  // Dynamic Realtime & Persistent State Lists
  const [activitiesList, setActivitiesList] = useState([]);
  const [documentsList, setDocumentsList] = useState([]);
  const [submissionsList, setSubmissionsList] = useState([]);
  const [notificationsList, setNotificationsList] = useState([]);

  // Modals state
  const [showCreateActivityModal, setShowCreateActivityModal] = useState(false);
  const [showIssueDocModal, setShowIssueDocModal] = useState(false);
  const [showSubmitDocModal, setShowSubmitDocModal] = useState(false);
  const [showSendMessageModal, setShowSendMessageModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);

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

  // Toast notification helper
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 4000);
  };

  // Initial Load & Supabase Realtime Sync
  const loadAllData = async () => {
    const [acts, docs, subs, notis] = await Promise.all([
      syncFetchActivities(),
      syncFetchDocuments(),
      syncFetchSubmissions(),
      syncFetchNotifications()
    ]);
    setActivitiesList(acts);
    setDocumentsList(docs);
    setSubmissionsList(subs);
    setNotificationsList(notis);
  };

  useEffect(() => {
    loadAllData();

    // Supabase Realtime Channel Subscription
    if (isSupabaseConfigured && supabase) {
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

  // Unauthenticated -> Login Screen
  if (!currentUser) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  const isDoanXa = currentUser.role === 'doan_xa';

  // Handlers for dynamic actions with Persistent Sync & Visual Toast Feedback
  const handleAddActivity = async (newAct) => {
    const activityItem = {
      id: `act-${Date.now()}`,
      day: newAct.day || '25',
      month: newAct.month || 'THÁNG 5',
      title: newAct.title,
      time: newAct.time || '08:00 - 11:30',
      location: newAct.location || 'Hội trường UBND xã Xuân Thới Sơn',
      status: 'Sắp diễn ra',
      dateIso: new Date().toISOString().split('T')[0]
    };
    const updated = await syncSaveActivity(activityItem);
    setActivitiesList(updated);
    triggerToast(`Đã tạo thành công hoạt động: "${newAct.title}"!`);
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
      file_name: newDoc.file_name || ''
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
      file_name: newSub.file_name || ''
    };
    const updated = await syncSaveSubmission(createdSub);
    setSubmissionsList(updated);
    triggerToast(`Đã nộp thành công báo cáo: "${newSub.title}"!`);
  };

  const handleSendNotification = async (newNoti) => {
    const createdNoti = {
      id: `noti-${Date.now()}`,
      title: newNoti.title,
      content: newNoti.content,
      target_scope: newNoti.target_scope || 'Tất cả 30 Chi đoàn Ấp',
      time_ago: 'Vừa xong'
    };
    const updated = await syncSaveNotification(createdNoti);
    setNotificationsList(updated);
    setActiveTab('notifications');
    triggerToast(`Đã phát thông báo chỉ đạo: "${newNoti.title}"!`);
  };

  return (
    <div className="d-flex min-vh-100 bg-main position-relative">
      {/* Toast Feedback Alert Banner */}
      {toastMessage && (
        <div 
          className="position-fixed top-0 start-50 translate-middle-x mt-3 bg-success text-white px-4 py-2.5 rounded-3 shadow-lg d-flex align-items-center gap-2 fw-semibold"
          style={{ zIndex: 9999, fontSize: '13.5px' }}
        >
          <CheckCircle size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Left Sidebar */}
      <Sidebar 
        currentRole={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSupportModal={() => setShowSupportModal(true)}
      />

      {/* Main Content Workspace Area */}
      <div className="flex-grow-1 d-flex flex-column" style={{ minWidth: 0 }}>
        {/* 2. Top Navbar */}
        <Navbar 
          currentRole={currentUser}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onOpenNotifications={() => setActiveTab('notifications')}
          onOpenMessages={() => setShowSendMessageModal(true)}
          onLogout={handleLogout}
          unreadNotiCount={notificationsList.length}
          unreadMsgCount={notificationsList.length > 0 ? 1 : 0}
        />

        {/* Workspace Body */}
        <div className="p-3 p-lg-4 flex-grow-1">
          {/* Global Search Results View */}
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
                      docsCount={documentsList.length}
                    />
                  )}

                  {/* Two Sub-Columns Split */}
                  {isDoanXa ? (
                    <div className="row g-4">
                      <div className="col-12 col-md-6">
                        <TodoList setActiveTab={setActiveTab} />
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
                    setActiveTab={setActiveTab}
                  />

                  {!isDoanXa && (
                    <BranchTasks setActiveTab={setActiveTab} />
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
              onOpenSendMessage={() => setShowSendMessageModal(true)}
              isDoanXa={isDoanXa}
            />
          ) : activeTab === 'todo' || activeTab === 'branch_tasks' ? (
            /* TASKS MANAGEMENT VIEW */
            <TasksView isDoanXa={isDoanXa} />
          ) : activeTab === 'reports' ? (
            /* REPORTS & ANALYTICS VIEW */
            <ReportsView 
              activitiesCount={activitiesList.length}
              docsCount={documentsList.length}
              submissionsCount={submissionsList.length}
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
        onClose={() => setShowSendMessageModal(false)}
        onSave={handleSendNotification}
        currentRole={currentUser}
      />

      <SupportModal 
        show={showSupportModal}
        onClose={() => setShowSupportModal(false)}
      />
    </div>
  );
}

import React, { useState } from 'react';
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
  SupportModal 
} from './components/Modals';
import { INITIAL_BRANCHES } from './lib/supabase';
import { FileText, Search, Folder, Calendar, BarChart2, Bell, Settings, FileSpreadsheet, CheckSquare } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null); 
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  // Dynamic Realtime State Lists
  const [activitiesList, setActivitiesList] = useState([]);
  const [documentsList, setDocumentsList] = useState([]);
  const [submissionsList, setSubmissionsList] = useState([]);
  const [notificationsList, setNotificationsList] = useState([]);

  // Modals state
  const [showCreateActivityModal, setShowCreateActivityModal] = useState(false);
  const [showIssueDocModal, setShowIssueDocModal] = useState(false);
  const [showSubmitDocModal, setShowSubmitDocModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);

  // Unauthenticated -> Login Screen
  if (!currentUser) {
    return <Login onLoginSuccess={(user) => setCurrentUser(user)} />;
  }

  const isDoanXa = currentUser.role === 'doan_xa';

  // Handlers for dynamic actions
  const handleAddActivity = (newAct) => {
    setActivitiesList([
      {
        id: `act-${Date.now()}`,
        day: newAct.day || '25',
        month: newAct.month || 'THÁNG 5',
        title: newAct.title,
        time: newAct.time || '08:00 - 11:30',
        location: newAct.location || 'Hội trường UBND xã Xuân Thới Sơn',
        status: 'Sắp diễn ra',
        dateIso: '2026-05-25'
      },
      ...activitiesList
    ]);
  };

  const handleIssueDocument = (newDoc) => {
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
      isNew: true,
      file_name: newDoc.file_name || 'Mau_Cong_Van_92_DX.pdf'
    };
    setDocumentsList([createdDoc, ...documentsList]);
  };

  const handleSubmitDocument = (newSub) => {
    const createdSub = {
      id: `sub-${Date.now()}`,
      title: newSub.title,
      due_date: new Date().toLocaleDateString('vi-VN'),
      sub_date: `${new Date().toLocaleDateString('vi-VN')} ${new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`,
      status: 'Đã nộp',
      file_name: newSub.file_name || 'Bao_Cao_T5_ApBuiMon.pdf'
    };
    setSubmissionsList([createdSub, ...submissionsList]);
  };

  // Views Mapping
  const viewConfig = {
    incoming_docs: { title: 'Quản lý Văn bản đến', icon: FileText, description: 'Tiếp nhận, xử lý và lưu trữ các công văn, kế hoạch gửi tới Đoàn xã Xuân Thới Sơn.' },
    outgoing_docs: { title: 'Quản lý Văn bản đi', icon: FileText, description: 'Ban hành, phân phối các công văn, thông báo tới 30 Chi đoàn Ấp trực thuộc.' },
    doan_xa_docs: { title: 'Văn bản từ Đoàn xã', icon: FileText, description: 'Danh sách văn bản chỉ đạo, kế hoạch do Đoàn xã Xuân Thới Sơn ban hành.' },
    required_docs: { title: 'Văn bản cần nộp', icon: FileText, description: 'Theo dõi và thực hiện nộp các báo cáo, kế hoạch theo đúng thời hạn quy định.' },
    todo: { title: 'Quản lý Công việc (Todo List)', icon: CheckSquare, description: 'Theo dõi tiến độ thực hiện nhiệm vụ và công việc được giao.' },
    branch_tasks: { title: 'Công việc của Chi đoàn', icon: CheckSquare, description: 'Quản lý danh mục nhiệm vụ và công việc nội bộ của Chi đoàn Ấp.' },
    activities: { title: 'Quản lý Lịch hoạt động', icon: Calendar, description: 'Theo dõi lịch tổ chức các phong trào, chương trình thanh niên cấp xã và ấp.' },
    reports: { title: 'Báo cáo Thống kê', icon: BarChart2, description: 'Tổng hợp số liệu hoạt động, văn bản và công tác đoàn toàn xã.' },
    storage: { title: 'Kho Lưu trữ Văn bản', icon: Folder, description: 'Lưu trữ tập trung toàn bộ hệ thống tài liệu, hồ sơ và văn bản số.' },
    settings: { title: 'Cài đặt Hệ thống', icon: Settings, description: 'Quản lý thông tin cấu hình và phân quyền người dùng.' },
    notifications: { title: 'Quản lý Thông báo', icon: Bell, description: 'Danh sách thông báo chỉ đạo và tin tức điều hành.' },
    submission_history: { title: 'Lịch sử Nộp Văn bản', icon: FileSpreadsheet, description: 'Quản lý và tra cứu tệp báo cáo đã nộp lên Đoàn xã.' }
  };

  const currentViewMeta = viewConfig[activeTab] || {
    title: 'Quản lý danh mục',
    icon: FileText,
    description: 'Nền tảng quản lý tập trung và phân quyền dữ liệu mượt mà.'
  };

  const MetaIcon = currentViewMeta.icon;

  return (
    <div className="d-flex min-vh-100 bg-main">
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
          onLogout={() => {
            setCurrentUser(null);
            setActiveTab('dashboard');
          }}
          unreadNotiCount={notificationsList.length}
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
                    onOpenSendNotification={() => alert('Đã khởi tạo hệ thống gửi thông báo!')}
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
            /* SECONDARY VIEWS */
            <div className="content-card">
              <div className="d-flex align-items-center justify-content-between mb-4 border-bottom pb-3">
                <div>
                  <h3 className="card-title-header mb-1 d-flex align-items-center gap-2">
                    <MetaIcon size={22} className="text-primary" />
                    {currentViewMeta.title}
                  </h3>
                  <div className="text-secondary" style={{ fontSize: '13px' }}>
                    {currentViewMeta.description}
                  </div>
                </div>
                <button className="btn btn-outline-primary btn-sm fw-semibold" onClick={() => setActiveTab('dashboard')}>
                  Quay lại Dashboard
                </button>
              </div>

              <div className="p-5 bg-light rounded-3 text-center border">
                <div className="p-3 bg-white d-inline-block rounded-circle shadow-sm mb-3 text-primary">
                  <MetaIcon size={32} />
                </div>
                <h5 className="fw-bold text-dark">{currentViewMeta.title}</h5>
                <p className="text-secondary" style={{ fontSize: '13px', maxWidth: '480px', margin: '0 auto' }}>
                  Danh mục này đã được khởi tạo hoàn chỉnh và sẵn sàng ghi nhận dữ liệu trong quá trình điều hành thực tế.
                </p>
                <button className="btn btn-primary mt-3 px-4 fw-semibold" style={{ backgroundColor: '#0066FF' }} onClick={() => setActiveTab('dashboard')}>
                  Trở về trang chính
                </button>
              </div>
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

      <SupportModal 
        show={showSupportModal}
        onClose={() => setShowSupportModal(false)}
      />
    </div>
  );
}

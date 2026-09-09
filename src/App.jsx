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
  ActivityAttendanceModal,
  ActivityDetailModal
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
import BranchMembersView from './components/BranchMembersView';
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
  syncDeleteDocument,
  syncFetchSubmissions,
  syncSaveSubmission,
  syncFetchNotifications,
  syncSaveNotification,
  syncUpdateNotification,
  syncDeleteNotification,
  syncFetchTasks,
  syncSaveTask,
  syncToggleTaskStatus,
  syncDeleteTask,
  syncFetchAttendance,
  syncSaveAttendance,
  syncFetchMembers,
  syncSaveMember,
  syncDeleteMember,
  COMPETITION_CLUSTERS,
  isItemTargetedToUser,
  deduplicateActivities
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
  const [membersList, setMembersList] = useState([]);

  // Modals state
  const [showCreateActivityModal, setShowCreateActivityModal] = useState(false);
  const [showIssueDocModal, setShowIssueDocModal] = useState(false);
  const [showSubmitDocModal, setShowSubmitDocModal] = useState(false);
  const [showSendMessageModal, setShowSendMessageModal] = useState(false);
  const [editingNotification, setEditingNotification] = useState(null);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [selectedActivityDetail, setSelectedActivityDetail] = useState(null);
  const [showActivityDetailModal, setShowActivityDetailModal] = useState(false);

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
    const [acts, docs, subs, notis, tsks, atts, mbrs] = await Promise.all([
      syncFetchActivities(),
      syncFetchDocuments(),
      syncFetchSubmissions(),
      syncFetchNotifications(),
      syncFetchTasks(),
      syncFetchAttendance(),
      syncFetchMembers()
    ]);
    setActivitiesList(deduplicateActivities(acts));
    setDocumentsList(docs);
    setSubmissionsList(subs);
    setNotificationsList(notis);
    setTasksList(tsks);
    setAttendanceRecords(atts || {});
    setMembersList(mbrs || []);
    setSelectedActivityDetail(prev => {
      if (!prev) return null;
      const updated = acts.find(a => a.id === prev.id);
      return updated || prev;
    });
  };

  const handleSaveMember = async (memberData) => {
    const updated = await syncSaveMember(memberData);
    setMembersList(updated);
    triggerToast(memberData.id ? 'Đã cập nhật thông tin đoàn viên!' : 'Đã thêm mới đoàn viên!');
  };

  const handleDeleteMember = async (memberId) => {
    const updated = await syncDeleteMember(memberId);
    setMembersList(updated);
    triggerToast('Đã xóa hồ sơ đoàn viên!');
  };

  useEffect(() => {
    loadAllData();

    const handleSync = () => {
      loadAllData();
    };

    let syncChannel = null;
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      syncChannel = new BroadcastChannel('xts_youth_sync_channel');
      syncChannel.onmessage = () => {
        loadAllData();
      };
    }

    window.addEventListener('storage', handleSync);
    window.addEventListener('doanthanhnien_sync', handleSync);

    let supabaseChannel = null;
    if (supabase) {
      supabaseChannel = supabase
        .channel('public-db-changes')
        .on('postgres_changes', { event: '*', schema: 'public' }, () => {
          loadAllData();
        })
        .subscribe();
    }

    return () => {
      if (syncChannel) syncChannel.close();
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('doanthanhnien_sync', handleSync);
      if (supabaseChannel && supabase) supabase.removeChannel(supabaseChannel);
    };
  }, []);

  if (!currentUser) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  const isDoanXa = currentUser.role === 'doan_xa';

  // Filtered unit-scoped data lists for Chi đoàn user (Đoàn xã sees all items)
  const userActivities = isDoanXa ? activitiesList : activitiesList.filter(a => isItemTargetedToUser(a.assigned_to || 'ALL', currentUser));
  const userDocuments = isDoanXa ? documentsList : documentsList.filter(d => isItemTargetedToUser(d.recipient_scope || 'ALL', currentUser));
  const userNotifications = isDoanXa ? notificationsList : notificationsList.filter(n => isItemTargetedToUser(n.target_scope || 'ALL', currentUser));
  const userTasks = isDoanXa ? tasksList : tasksList.filter(t => isItemTargetedToUser(t.assigned_to || 'ALL', currentUser));

  const incomingDocsCount = submissionsList.length + userDocuments.filter(d => d.type === 'incoming').length;
  const outgoingDocsCount = userDocuments.filter(d => d.type === 'outgoing' || !d.type).length;

  const handleAddActivity = async (newAct) => {
    const assignedText = Array.isArray(newAct.assigned_to) 
      ? (newAct.assigned_to.length === 0 || newAct.assigned_to.includes('Tất cả 30 Chi đoàn Ấp') ? 'Tất cả 30 Chi đoàn Ấp' : newAct.assigned_to.join(', '))
      : (newAct.assigned_to || 'Tất cả 30 Chi đoàn Ấp');

    const dayVal = String(newAct.day || new Date().getDate()).padStart(2, '0');
    const monthVal = String(newAct.month || (new Date().getMonth() + 1)).padStart(2, '0');
    const yearVal = newAct.year || new Date().getFullYear();
    const fixedDateIso = newAct.dateIso || `${yearVal}-${monthVal}-${dayVal}`;

    const activityItem = {
      id: `act-${Date.now()}`,
      day: dayVal,
      month: monthVal,
      year: yearVal,
      title: newAct.title,
      priority: newAct.priority || 'Bình thường',
      time: newAct.time || '08:00 - 11:30',
      location: newAct.location || 'Trụ sở Đảng ủy xã Xuân Thới Sơn',
      description: newAct.description || '',
      notes: newAct.notes || '',
      assigned_to: assignedText,
      hasSubTasks: Boolean(newAct.hasSubTasks),
      subTasks: newAct.subTasks || [],
      file_name: newAct.file_name || '',
      file_url: newAct.file_url || '',
      status: 'Sắp diễn ra',
      dateIso: fixedDateIso,
      postedAt: `${new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} ${dayVal}/${monthVal}/${yearVal}`
    };
    const updated = await syncSaveActivity(activityItem);
    setActivitiesList(updated);

    // Tự động phát thông báo tới đúng đơn vị được giao
    const targetText = assignedText;
    const autoNoti = {
      id: `noti-${Date.now()}`,
      title: `Hoạt động mới: ${newAct.title}`,
      content: `Ban Thường vụ Đoàn xã Xuân Thới Sơn phát động hoạt động "${newAct.title}"`,
      target_scope: targetText,
      priority: newAct.priority || 'Bình thường',
      activity_details: {
        time: activityItem.time,
        day: activityItem.day,
        month: activityItem.month,
        location: activityItem.location,
        notes: newAct.notes || 'Đề nghị 30 Chi đoàn Ấp triển khai tham gia đầy đủ và đúng thời gian quy định.'
      },
      time_ago: 'Vừa xong'
    };
    const updatedNotis = await syncSaveNotification(autoNoti);
    setNotificationsList(updatedNotis);

    triggerToast(`Đã tạo hoạt động "${newAct.title}" và gửi tới ${targetText}!`);
  };

  const handleToggleActivityStatus = async (activityId, newStatus) => {
    const updated = await syncToggleActivityStatus(activityId, newStatus);
    setActivitiesList(updated);
    triggerToast(newStatus === 'Đã hoàn thành' ? 'Đã đánh dấu hoàn thành hoạt động!' : 'Đã chuyển hoạt động về sắp diễn ra!');
  };

  const handleDeleteActivity = async (activityId, activityTitle = '') => {
    setActivitiesList(prev => prev.filter(a => String(a.id) !== String(activityId) && (!activityTitle || a.title !== activityTitle)));
    triggerToast('Đã thu hồi & xóa hoạt động thành công!');

    const updated = await syncDeleteActivity(activityId, activityTitle);
    const cleanUpdated = deduplicateActivities(updated);
    const filtered = cleanUpdated.filter(a => String(a.id) !== String(activityId) && (!activityTitle || a.title !== activityTitle));
    setActivitiesList(filtered);
  };

  const handleIssueDocument = async (newDoc) => {
    const targetText = newDoc.recipient_scope || 'ALL';
    const createdDoc = {
      id: `doc-${Date.now()}`,
      doc_number: newDoc.doc_number,
      title: newDoc.title,
      summary: `Ban hành ngày ${new Date().toLocaleDateString('vi-VN')}`,
      sender: 'Đoàn xã Xuân Thới Sơn',
      recipient_scope: targetText,
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

    // Phát thông báo tự động khi ban hành văn bản
    const autoNoti = {
      id: `noti-${Date.now()}`,
      title: `📄 Ban hành Văn bản số ${newDoc.doc_number}`,
      content: `Ban Thường vụ Đoàn xã Xuân Thới Sơn vừa ban hành văn bản số ${newDoc.doc_number}: "${newDoc.title}". Đề nghị các đơn vị kiểm tra và thực hiện.`,
      target_scope: targetText === 'ALL' ? 'Tất cả 30 Chi đoàn Ấp' : targetText,
      priority: 'Trung bình',
      time_ago: 'Vừa xong'
    };
    const updatedNotis = await syncSaveNotification(autoNoti);
    setNotificationsList(updatedNotis);

    triggerToast(`Đã ban hành văn bản số ${newDoc.doc_number} tới đúng các đơn vị được phân công!`);
  };

  const handleDeleteDocument = async (docId) => {
    const updated = await syncDeleteDocument(docId);
    setDocumentsList(updated);
    triggerToast('Đã thu hồi & xóa văn bản tức thì trên toàn bộ 30 Chi đoàn!');
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
        ...notiData,
        activity_details: {
          ...(editingNotification.activity_details || {}),
          ...(notiData.activity_details || {}),
          time: notiData.time || notiData.activity_details?.time || editingNotification.activity_details?.time || '08:00 - 11:30',
          date: notiData.date || notiData.activity_details?.date || editingNotification.activity_details?.date || '',
          location: notiData.location || notiData.activity_details?.location || editingNotification.activity_details?.location || ''
        }
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
        time: notiData.time || '08:00 - 11:30',
        date: notiData.date || '',
        location: notiData.location || '',
        activity_details: notiData.activity_details || {
          time: notiData.time || '08:00 - 11:30',
          date: notiData.date || '',
          location: notiData.location || '',
          notes: 'Đề nghị 30 Chi đoàn Ấp triển khai tham gia đầy đủ và đúng thời gian quy định.'
        },
        time_ago: 'Vừa xong',
        createdAt: Date.now()
      };
      const updated = await syncSaveNotification(createdNoti);
      setNotificationsList(updated);
      setActiveTab('notifications');
      triggerToast(`Đã phát thông báo chỉ đạo: "${notiData.title}"!`);
    }
  };

  const handleConfirmReceipt = async (type, item) => {
    const branchName = currentUser?.full_name || 'Chi đoàn Ấp';
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const timeStr = `${hours}:${minutes} ${day}/${month}/${year}`;

    const existingConfirmed = item.confirmedBy || [];
    if (existingConfirmed.some(c => c.branch === branchName)) {
      triggerToast('Đơn vị đã xác nhận tiếp nhận & tham gia hoạt động trước đó!');
      return;
    }

    const updatedConfirmedBy = [...existingConfirmed, { branch: branchName, time: timeStr }];

    if (type === 'notification') {
      const updatedNoti = {
        ...item,
        confirmedBy: updatedConfirmedBy
      };
      const updatedList = await syncUpdateNotification(updatedNoti);
      setNotificationsList(updatedList);
    } else if (type === 'activity') {
      const updatedAct = {
        ...item,
        confirmedBy: updatedConfirmedBy
      };
      const updatedList = await syncSaveActivity(updatedAct);
      setActivitiesList(updatedList);
      setSelectedActivityDetail(prev => (prev && prev.id === item.id ? updatedAct : prev));
    }

    try {
      if (typeof window !== 'undefined' && window.confetti) {
        window.confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
      }
    } catch(e) {}

    triggerToast(`Đã xác nhận tiếp nhận thông báo & đăng ký tham gia hoạt động!`);
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

  const handleDeleteTask = async (taskId) => {
    const updated = await syncDeleteTask(taskId);
    setTasksList(updated);
    triggerToast('Đã thu hồi & xóa nhiệm vụ khỏi hệ thống!');
  };

  const handleSaveAttendance = async (activityId, recordData) => {
    const updated = await syncSaveAttendance(activityId, recordData);
    setAttendanceRecords(updated);
    triggerToast('Đã lưu kết quả điểm danh & đánh giá tham gia hoạt động!');
  };

  const handleRespondAttendance = async (activityId, branchName, attended, reason, activityTitle = '') => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const timeStr = `${hours}:${minutes} ${day}/${month}/${year}`;

    const currentActivityRec = attendanceRecords[activityId] || {};
    const updatedRec = {
      ...currentActivityRec,
      [branchName]: attended ? { attended: true, time: timeStr } : { attended: false, reason, time: timeStr }
    };
    const updated = await syncSaveAttendance(activityId, updatedRec);
    setAttendanceRecords(updated);

    // Update targetAct on activitiesList so confirmedBy and absentBy are immediately in sync
    const targetAct = activitiesList.find(a => a.id === activityId);
    if (targetAct) {
      const existingConfirmed = targetAct.confirmedBy || [];
      const existingAbsent = targetAct.absentBy || [];

      let updatedConfirmedBy = existingConfirmed;
      let updatedAbsentBy = existingAbsent;

      if (attended) {
        // Remove from absentBy if present, add to confirmedBy if not present
        updatedAbsentBy = existingAbsent.filter(c => c.branch !== branchName);
        if (!existingConfirmed.some(c => c.branch === branchName)) {
          updatedConfirmedBy = [...existingConfirmed, { branch: branchName, time: timeStr }];
        }
      } else {
        // Remove from confirmedBy if present, add/update in absentBy
        updatedConfirmedBy = existingConfirmed.filter(c => c.branch !== branchName);
        const filteredAbsent = existingAbsent.filter(c => c.branch !== branchName);
        updatedAbsentBy = [...filteredAbsent, { branch: branchName, reason, time: timeStr }];
      }

      const updatedAct = { 
        ...targetAct, 
        confirmedBy: updatedConfirmedBy,
        absentBy: updatedAbsentBy
      };
      const updatedActs = await syncSaveActivity(updatedAct);
      setActivitiesList(deduplicateActivities(updatedActs));
    }

    notifySyncEvent('RESPOND_ATTENDANCE', { activityId, branchName, attended, reason, timeStr });

    if (attended) {
      triggerToast(`Đã xác nhận THAM GIA hoạt động thành công!`);
    } else {
      triggerToast(`Đã ghi nhận báo VẮNG MẶT thành công!`);
    }
  };

  const handleOpenActivityDetail = (activity) => {
    setSelectedActivityDetail(activity);
    setShowActivityDetailModal(true);
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
          unreadNotiCount={userNotifications.length}
          unreadMsgCount={userNotifications.length > 0 ? 1 : 0}
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
                {userActivities.length === 0 && userDocuments.length === 0 ? (
                  <div className="text-secondary" style={{ fontSize: '13px' }}>Không tìm thấy văn bản hay hoạt động khớp với từ khóa.</div>
                ) : (
                  <ul className="mb-0 text-dark" style={{ fontSize: '13px' }}>
                    {userActivities.map(a => <li key={a.id} className="mb-1">{a.title}</li>)}
                    {userDocuments.map(d => <li key={d.id} className="mb-1">{d.title}</li>)}
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
                activitiesCount={userActivities.length}
                docsCount={userDocuments.length}
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
                      activitiesCount={userActivities.length}
                      incomingDocsCount={incomingDocsCount}
                      outgoingDocsCount={outgoingDocsCount}
                    />
                  )}

                  {/* Two Sub-Columns Split */}
                  {isDoanXa ? (
                    <div className="row g-4">
                      <div className="col-12 col-md-6">
                        <TodoList 
                          tasks={userTasks} 
                          setActiveTab={setActiveTab} 
                          onOpenCreateTask={() => setShowCreateTaskModal(true)}
                        />
                      </div>
                      <div className="col-12 col-md-6">
                        <UpcomingActivities 
                          activities={userActivities}
                          setActiveTab={setActiveTab} 
                          onOpenCreateActivity={() => setShowCreateActivityModal(true)}
                          onOpenActivityDetail={handleOpenActivityDetail}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="row g-4">
                      <div className="col-12 col-md-6">
                        <UpcomingActivities 
                          activities={userActivities}
                          setActiveTab={setActiveTab} 
                          onOpenActivityDetail={handleOpenActivityDetail}
                        />
                      </div>
                      <div className="col-12 col-md-6">
                        <ChiDoanDocsList 
                          documents={userDocuments}
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
                    documents={userDocuments}
                    submissions={submissionsList}
                    setActiveTab={setActiveTab}
                  />

                  {!isDoanXa && (
                    <BranchTasks tasks={userTasks} currentRole={currentUser} setActiveTab={setActiveTab} />
                  )}

                  <NotificationsList 
                    notifications={userNotifications}
                    currentRole={currentUser}
                    setActiveTab={setActiveTab}
                    onConfirmReceipt={handleConfirmReceipt}
                  />
                </div>
              </div>
            </div>
          ) : activeTab === 'activities' ? (
            /* ACTIVITIES MANAGEMENT VIEW */
            <ActivitiesView 
              activities={userActivities}
              onOpenCreateActivity={() => setShowCreateActivityModal(true)}
              isDoanXa={isDoanXa}
              onToggleStatus={handleToggleActivityStatus}
              onDeleteActivity={handleDeleteActivity}
              onOpenActivityDetail={handleOpenActivityDetail}
              onConfirmReceipt={handleConfirmReceipt}
              currentUser={currentUser}
              attendanceRecords={attendanceRecords}
            />
          ) : activeTab === 'incoming_docs' || activeTab === 'outgoing_docs' || activeTab === 'doan_xa_docs' || activeTab === 'required_docs' ? (
            /* DOCUMENTS MANAGEMENT VIEW */
            <DocumentsView 
              documents={userDocuments}
              tabType={activeTab}
              onOpenIssueDocument={() => setShowIssueDocModal(true)}
              onDeleteDocument={handleDeleteDocument}
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
              notifications={userNotifications}
              onOpenSendMessage={() => {
                setEditingNotification(null);
                setShowSendMessageModal(true);
              }}
              onEditNotification={handleEditNotification}
              onDeleteNotification={handleDeleteNotification}
              isDoanXa={isDoanXa}
              onConfirmReceipt={handleConfirmReceipt}
              currentUser={currentUser}
            />
          ) : activeTab === 'todo' || activeTab === 'branch_tasks' ? (
            /* TASKS MANAGEMENT VIEW */
            <TasksView 
              tasks={userTasks} 
              onOpenCreateTask={() => setShowCreateTaskModal(true)} 
              onToggleTask={handleToggleTask} 
              onDeleteTask={handleDeleteTask}
              isDoanXa={isDoanXa} 
            />
          ) : activeTab === 'reports' ? (
            /* REPORTS & ANALYTICS VIEW */
            <ReportsView 
              activitiesCount={activitiesList.length}
              docsCount={userDocuments.length}
              submissionsCount={submissionsList.length}
              activities={activitiesList}
              attendanceRecords={attendanceRecords}
              onOpenAttendanceModal={() => setShowAttendanceModal(true)}
              onRespondAttendance={handleRespondAttendance}
              isDoanXa={isDoanXa}
            />
          ) : activeTab === 'storage' ? (
            /* STORAGE ARCHIVE VIEW */
            <StorageArchiveView 
              documents={userDocuments}
              submissions={submissionsList}
            />
          ) : activeTab === 'settings' ? (
            /* SETTINGS VIEW */
            <SettingsView currentRole={currentUser} />
          ) : activeTab === 'branches' ? (
            /* 30 CHI ĐOÀN ẤP & ĐOÀN VIÊN MANAGEMENT VIEW */
            <BranchMembersView 
              members={membersList}
              currentRole={currentUser}
              onSaveMember={handleSaveMember}
              onDeleteMember={handleDeleteMember}
            />
          ) : activeTab === 'contact' ? (
            /* CONTACT VIEW FOR CHI DOAN */
            <div className="content-card">
              <h3 className="card-title-header mb-3 d-flex align-items-center gap-2">
                <span className="text-primary" style={{ fontSize: '20px' }}>📞</span>
                Thông tin Liên hệ Ban Thường vụ Đoàn xã Xuân Thới Sơn
              </h3>
              <div className="p-4 bg-light rounded-3 border mb-4">
                <div className="fw-bold text-primary mb-2" style={{ fontSize: '15px' }}>🏛️ Trụ sở làm việc:</div>
                <div className="text-dark mb-3" style={{ fontSize: '13px' }}>
                  {OFFICIAL_ADDRESS}
                </div>
                <div className="row g-3">
                  <div className="col-12 col-md-4">
                    <div className="p-3 bg-white rounded-3 border">
                      <div className="fw-bold text-dark" style={{ fontSize: '13.5px' }}>👤 Bí thư Đoàn xã</div>
                      <div className="text-primary fw-semibold mt-1" style={{ fontSize: '13px' }}>Đồng chí Nguyễn Văn A</div>
                      <div className="text-secondary mt-1" style={{ fontSize: '12px' }}>📱 Hotline: 090x.xxx.xxx</div>
                      <div className="text-secondary" style={{ fontSize: '12px' }}>✉️ doanxa@xuanthoison.gov.vn</div>
                    </div>
                  </div>
                  <div className="col-12 col-md-4">
                    <div className="p-3 bg-white rounded-3 border">
                      <div className="fw-bold text-dark" style={{ fontSize: '13.5px' }}>👤 Phó Bí thư Đoàn xã</div>
                      <div className="text-primary fw-semibold mt-1" style={{ fontSize: '13px' }}>Đồng chí Trần Thị B</div>
                      <div className="text-secondary mt-1" style={{ fontSize: '12px' }}>📱 Hotline: 091x.xxx.xxx</div>
                      <div className="text-secondary" style={{ fontSize: '12px' }}>✉️ phobithu@xuanthoison.gov.vn</div>
                    </div>
                  </div>
                  <div className="col-12 col-md-4">
                    <div className="p-3 bg-white rounded-3 border">
                      <div className="fw-bold text-dark" style={{ fontSize: '13.5px' }}>🎧 Bộ phận Hỗ trợ Kỹ thuật</div>
                      <div className="text-primary fw-semibold mt-1" style={{ fontSize: '13px' }}>Văn phòng Đoàn xã</div>
                      <div className="text-secondary mt-1" style={{ fontSize: '12px' }}>📱 Tổng đài: (028) 38xx.xxxx</div>
                      <div className="text-secondary" style={{ fontSize: '12px' }}>⏰ Giờ làm việc: 07:30 - 17:00</div>
                    </div>
                  </div>
                </div>
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
        activities={userActivities}
        attendanceRecords={attendanceRecords}
        onSaveAttendance={handleSaveAttendance}
      />

      <ActivityDetailModal 
        show={showActivityDetailModal}
        onClose={() => setShowActivityDetailModal(false)}
        activity={selectedActivityDetail}
        currentRole={currentUser}
        attendanceRecords={attendanceRecords}
        onRespondAttendance={handleRespondAttendance}
        onConfirmReceipt={handleConfirmReceipt}
      />
    </div>
  );
}

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
import { formatDeadlineDisplay } from './components/TaskCountdown';
import ChiDoanDocsList from './components/ChiDoanDocsList';
import Login from './components/Login';
import GpsPermissionModal from './components/GpsPermissionModal';
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
  SettingsView,
  BranchAttendanceWorkspaceView
} from './components/SecondaryViews';
import BranchMembersView from './components/BranchMembersView';
import { 
  INITIAL_BRANCHES,
  SCHOOL_BRANCHES,
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
  syncDeleteSubmission,
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
  OFFICIAL_ADDRESS,
  notifySyncEvent,
  isItemTargetedToUser,
  deduplicateActivities,
  generateUuid,
  isValidUuid,
  playNotificationSound
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
  const [attendanceModalTab, setAttendanceModalTab] = useState('qr');
  const [selectedActivityDetail, setSelectedActivityDetail] = useState(null);
  const [showActivityDetailModal, setShowActivityDetailModal] = useState(false);
  const [showGpsModal, setShowGpsModal] = useState(false);
  const [targetAttendanceActivityId, setTargetAttendanceActivityId] = useState('');
  const [gpsStatus, setGpsStatus] = useState(() => {
    try {
      return localStorage.getItem('xts_gps_status') || 'default';
    } catch (e) {
      return 'default';
    }
  });

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    try {
      sessionStorage.setItem('xts_current_user', JSON.stringify(user));
    } catch (e) {}
    // Khi vừa đăng nhập bằng tài khoản, mật khẩu: hiển thị popup cài đặt cấp quyền điểm danh GPS
    loadAllData(); // Trigger immediate sync on login
    setShowGpsModal(true);
    triggerToast(`Đăng nhập thành công với vai trò ${user.full_name}! Vui lòng kích hoạt điểm danh GPS.`);
  };

  const handleGpsGranted = (coords) => {
    setGpsStatus('granted');
    triggerToast('Đã cấp quyền GPS & kích hoạt thành công phương thức điểm danh xác thực vị trí!');
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
    try {
      const results = await Promise.allSettled([
        syncFetchActivities(),
        syncFetchDocuments(),
        syncFetchSubmissions(),
        syncFetchNotifications(),
        syncFetchTasks(),
        syncFetchAttendance(),
        syncFetchMembers()
      ]);

      const acts = results[0].status === 'fulfilled' ? results[0].value : [];
      const docs = results[1].status === 'fulfilled' ? results[1].value : [];
      const subs = results[2].status === 'fulfilled' ? results[2].value : [];
      const notis = results[3].status === 'fulfilled' ? results[3].value : [];
      const tsks = results[4].status === 'fulfilled' ? results[4].value : [];
      const atts = results[5].status === 'fulfilled' ? results[5].value : {};
      const mbrs = results[6].status === 'fulfilled' ? results[6].value : [];

      // Xóa sạch 100% dữ liệu hoạt động ảo & công việc ảo theo yêu cầu
      const cleanedActs = (acts || []).filter(a => {
        if (!a) return false;
        const strId = String(a.id || '');
        if (strId.startsWith('act-seed-')) return false;
        if (a.title && a.title.includes('Hội nghị Học tập & Quán triệt')) return false;
        return true;
      }).map(a => ({
        ...a,
        confirmedBy: getUniqueConfirmedBranches(a.confirmedBy),
        absentBy: getUniqueConfirmedBranches(a.absentBy)
      }));
      setActivitiesList(deduplicateActivities(cleanedActs));

      const cleanedDocs = (docs || []).filter(d => {
        if (!d) return false;
        const strId = String(d.id || '');
        if (strId.startsWith('doc-seed-') || (d.file_url && d.file_url.includes('w3.org/WAI')) || (d.summary && d.summary.includes('30 Chi đoàn Ấp'))) return false;
        return true;
      });
      setDocumentsList(cleanedDocs);

      const cleanedSubs = (subs || []).filter(s => {
        if (!s) return false;
        const strId = String(s.id || '');
        if (strId.startsWith('sub-seed-') || (s.file_url && s.file_url.includes('w3.org/WAI'))) return false;
        return true;
      });
      setSubmissionsList(cleanedSubs);

      const cleanedNotis = (notis || []).filter(n => {
        if (!n) return false;
        const strId = String(n.id || '');
        if (strId.startsWith('noti-seed-') || (n.title && n.title.includes('30 Chi đoàn Ấp'))) return false;
        return true;
      });
      setNotificationsList(cleanedNotis);

      const cleanedTasks = (tsks || []).filter(t => {
        if (!t) return false;
        const strId = String(t.id || '');
        if (strId.startsWith('task-seed-')) return false;
        if (t.title && t.title.includes('Rà soát và cập nhật')) return false;
        return true;
      });
      setTasksList(cleanedTasks);

      // Đồng bộ 100% dữ liệu điểm danh từ Supabase (confirmedBy & absentBy) vào attendanceRecords
      const mergedAttendance = { ...(atts || {}) };
      if (Array.isArray(cleanedActs)) {
        cleanedActs.forEach(act => {
          if (!act || !act.id) return;
          const actId = String(act.id);
          if (!mergedAttendance[actId]) {
            mergedAttendance[actId] = {};
          }
          if (Array.isArray(act.confirmedBy)) {
            act.confirmedBy.forEach(c => {
              const bName = typeof c === 'string' ? c : c?.branch;
              if (bName) {
                const stdBranch = normalizeBranchName(bName);
                const rec = {
                  attended: true,
                  time: (typeof c === 'object' && c?.time) ? c.time : 'Đã xác nhận',
                  method: (typeof c === 'object' && c?.method) ? c.method : 'Xác thực điểm danh',
                  latitude: typeof c === 'object' ? c?.latitude : undefined,
                  longitude: typeof c === 'object' ? c?.longitude : undefined,
                  photo_url: typeof c === 'object' ? c?.photo_url : undefined
                };
                mergedAttendance[actId][stdBranch] = rec;
                mergedAttendance[actId][bName] = rec;
              }
            });
          }
          if (Array.isArray(act.absentBy)) {
            act.absentBy.forEach(a => {
              const bName = typeof a === 'string' ? a : a?.branch;
              if (bName) {
                const stdBranch = normalizeBranchName(bName);
                if (!mergedAttendance[actId][stdBranch]?.attended) {
                  const rec = {
                    attended: false,
                    reason: (typeof a === 'object' && a?.reason) ? a.reason : 'Báo vắng',
                    time: (typeof a === 'object' && a?.time) ? a.time : 'Đã báo vắng'
                  };
                  mergedAttendance[actId][stdBranch] = rec;
                  mergedAttendance[actId][bName] = rec;
                }
              }
            });
          }
        });
      }
      setAttendanceRecords(mergedAttendance);
      setPersistedData('attendance_records', mergedAttendance);

      // Làm sạch toàn bộ dữ liệu đoàn viên ảo trong tài khoản Admin và Chi đoàn
      const DUMMY_MEMBER_NAMES = [
        'Nguyễn Văn An', 'Trần Thị Bích', 'Lê Hoài Nam', 'Phạm Minh Tâm', 
        'Ngô Thanh Hương', 'Vũ Quốc Khánh', 'Hoàng Bích Ngọc', 'Đặng Tuấn Anh', 
        'Nguyễn Thị Thu Hà', 'Bùi Đức Trọng', 'Trịnh Mai Anh', 'Đỗ Hữu Phước', 
        'Lương Mỹ Duyên', 'Cao Văn Khiêm', 'Phan Bảo Ngọc'
      ];
      const cleanMembers = (mbrs || []).filter(item =>
        item &&
        !item.id?.match(/^dv-\d+$/) &&
        !DUMMY_MEMBER_NAMES.includes(item.full_name)
      );
      setMembersList(cleanMembers);
      setPersistedData('members', cleanMembers);
      setSelectedActivityDetail(prev => {
        if (!prev) return null;
        const updated = acts.find(a => a.id === prev.id);
        return updated || prev;
      });
    } catch (err) {
      console.warn('loadAllData background sync warning:', err);
    }
  };

  const handleSaveDocumentItem = async (docItem) => {
    const updated = await syncSaveDocument(docItem);
    setDocumentsList(updated);
  };

  const handleSaveSubmissionItem = async (subItem) => {
    const updated = await syncSaveSubmission(subItem);
    setSubmissionsList(updated);
  };

  const handleSaveMember = async (memberData) => {
    const updated = await syncSaveMember(memberData);
    setMembersList(updated);
    triggerToast(memberData.id ? 'Đã cập nhật thông tin đoàn viên!' : 'Đã thêm mới đoàn viên!');
  };

  const handleDeleteMember = async (memberId, memberName) => {
    const updated = await syncDeleteMember(memberId, memberName);
    setMembersList(updated);
    triggerToast('Đã xóa vĩnh viễn hồ sơ đoàn viên!');
  };

  useEffect(() => {
    loadAllData();

    const handleSync = () => {
      loadAllData();
    };

    // 1. Same-device multi-tab BroadcastChannel
    let syncChannel = null;
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      syncChannel = new BroadcastChannel('xts_youth_sync_channel');
      syncChannel.onmessage = () => {
        loadAllData();
      };
    }

    window.addEventListener('storage', handleSync);
    window.addEventListener('doanthanhnien_sync', handleSync);
    window.addEventListener('focus', handleSync);
    window.addEventListener('online', handleSync);
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        handleSync();
      }
    };
    window.addEventListener('visibilitychange', handleVisibility);

    // 2. High-Frequency 3-Second Heartbeat Poll (Fail-safe backup for zero delay)
    const pollInterval = setInterval(() => {
      loadAllData();
    }, 3000);

    // 3. Global Supabase Realtime Broadcast Channel (< 100ms Cross-Device Sync)
    let globalRealtimeSub = null;
    if (supabase) {
      globalRealtimeSub = supabase
        .channel('xts-realtime-global', { config: { broadcast: { ack: false } } })
        .on('broadcast', { event: 'XTS_SYNC_EVENT' }, (msg) => {
          const { type, payload } = msg.payload || {};
          console.log('⚡ Siêu cấp Realtime nhận sự kiện:', type, payload);

          if (type === 'SAVE_ACTIVITY' && payload) {
            setActivitiesList(prev => {
              const exists = prev.some(a => String(a.id) === String(payload.id));
              const updated = exists ? prev.map(a => String(a.id) === String(payload.id) ? { ...a, ...payload } : a) : [payload, ...prev];
              return deduplicateActivities(updated);
            });
            if (currentUser && isItemTargetedToUser(payload.assigned_to || 'ALL', currentUser)) {
              triggerToast(`⚡ Ban Thường vụ Đoàn xã vừa ban hành hoạt động mới: "${payload.title}"!`);
              playNotificationSound();
            }
          } else if (type === 'DELETE_ACTIVITY' && payload) {
            const { activityId } = payload;
            if (activityId) {
              setActivitiesList(prev => prev.filter(a => String(a.id) !== String(activityId)));
            }
          } else if (type === 'SAVE_NOTIFICATION' && payload) {
            setNotificationsList(prev => {
              const exists = prev.some(n => String(n.id) === String(payload.id));
              return exists ? prev.map(n => String(n.id) === String(payload.id) ? { ...n, ...payload } : n) : [payload, ...prev];
            });
            if (currentUser && isItemTargetedToUser(payload.target_scope || 'ALL', currentUser)) {
              triggerToast(`🔔 Thông báo mới từ Đoàn xã: "${payload.title}"!`);
              playNotificationSound();
            }
          } else if (type === 'DELETE_NOTIFICATION' && payload) {
            const { notificationId } = payload;
            if (notificationId) {
              setNotificationsList(prev => prev.filter(n => String(n.id) !== String(notificationId)));
            }
          } else if (type === 'SAVE_DOCUMENT' && payload) {
            setDocumentsList(prev => {
              const exists = prev.some(d => String(d.id) === String(payload.id));
              return exists ? prev.map(d => String(d.id) === String(payload.id) ? { ...d, ...payload } : d) : [payload, ...prev];
            });
          } else if (type === 'DELETE_DOCUMENT' && payload) {
            const { docId } = payload;
            if (docId) {
              setDocumentsList(prev => prev.filter(d => String(d.id) !== String(docId)));
            }
          } else if (type === 'RESPOND_ATTENDANCE' && payload) {
            triggerToast(`📍 ${payload.branchName || 'Đơn vị'} vừa xác nhận điểm danh hoạt động!`);
            playNotificationSound();
          }

          // Background auto-refresh for full DB consistency
          loadAllData();
        })
        .subscribe((status) => {
          console.log('⚡ High-tech Realtime Global Channel status:', status);
        });
    }

    return () => {
      if (pollInterval) clearInterval(pollInterval);
      if (syncChannel) syncChannel.close();
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('doanthanhnien_sync', handleSync);
      window.removeEventListener('focus', handleSync);
      window.removeEventListener('online', handleSync);
      window.removeEventListener('visibilitychange', handleVisibility);
      if (globalRealtimeSub && supabase) supabase.removeChannel(globalRealtimeSub);
    };
  }, [currentUser]);

  if (!currentUser) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  const isDoanXa = currentUser.role === 'doan_xa';
  const userBranchName = currentUser.branch_name || currentUser.full_name || '';

  // Filtered unit-scoped data lists for Chi đoàn user (Đoàn xã sees all items)
  const userActivities = isDoanXa ? activitiesList : activitiesList.filter(a => isItemTargetedToUser(a.assigned_to || 'ALL', currentUser));
  const userDocuments = isDoanXa ? documentsList : documentsList.filter(d => isItemTargetedToUser(d.recipient_scope || 'ALL', currentUser));
  const userNotifications = isDoanXa ? notificationsList : notificationsList.filter(n => isItemTargetedToUser(n.target_scope || 'ALL', currentUser));
  const userTasks = isDoanXa ? tasksList : tasksList.filter(t => isItemTargetedToUser(t.assigned_to || 'ALL', currentUser));
  const userSubmissions = isDoanXa ? submissionsList : submissionsList.filter(s => s && (s.branch_name === userBranchName || s.sender === userBranchName || s.sender === currentUser.full_name));

  const incomingDocsCount = submissionsList.length + userDocuments.filter(d => d.type === 'incoming').length;
  const outgoingDocsCount = userDocuments.filter(d => d.type === 'outgoing' || !d.type).length;

  
  
  const handleUpdateTask = async (updatedTask) => {
    const updatedList = await syncSaveTask(updatedTask);
    setTasksList(updatedList);
    triggerToast(`Đã cập nhật công việc "${updatedTask.title}" thành công!`);
  };

  const handleUpdateActivity = async (updatedActivity) => {
    const updatedList = await syncSaveActivity(updatedActivity);
    setActivitiesList(updatedList);
    triggerToast(`Đã cập nhật thông tin hoạt động "${updatedActivity.title}" thành công!`);
  };

  const handleAddActivity = async (newAct) => {
    const assignedText = Array.isArray(newAct.assigned_to) 
      ? (newAct.assigned_to.length === 0 || newAct.assigned_to.includes('Tất cả 56 Chi đoàn') ? 'Tất cả 56 Chi đoàn' : newAct.assigned_to.join(', '))
      : (newAct.assigned_to || 'Tất cả 56 Chi đoàn');

    const dayVal = String(newAct.day || new Date().getDate()).padStart(2, '0');
    const monthVal = String(newAct.month || (new Date().getMonth() + 1)).padStart(2, '0');
    const yearVal = newAct.year || new Date().getFullYear();
    const fixedDateIso = newAct.dateIso || `${yearVal}-${monthVal}-${dayVal}`;

    const finalActId = (newAct.id && isValidUuid(newAct.id)) ? newAct.id : generateUuid();
    const activityItem = {
      id: finalActId,
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
      status: newAct.status || 'Đang diễn ra',
      confirmedBy: newAct.confirmedBy || [],
      absentBy: newAct.absentBy || [],
      completedBy: newAct.completedBy || [],
      dateIso: fixedDateIso,
      postedAt: `${new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} ${dayVal}/${monthVal}/${yearVal}`
    };
    const updated = await syncSaveActivity(activityItem);
    setActivitiesList(updated);

    // Tự động ban hành văn bản đi và đưa vào Lưu trữ văn bản dựa vào mục đích của văn bản
    const categoryMap = {
      act_docs: 'Văn bản thuộc ban hành hoạt động',
      meeting_docs: 'Văn bản cuộc họp',
      implementation_docs: 'Văn bản triển khai',
      decision_docs: 'Văn bản quyết định'
    };
    const categoryKey = newAct.doc_category || 'act_docs';
    const categoryLabel = categoryMap[categoryKey] || 'Văn bản thuộc ban hành hoạt động';

    const autoDoc = {
      id: `doc-${Date.now()}`,
      doc_number: `${Math.floor(Math.random() * 40) + 10}-KH/ĐX-XTS`,
      title: `Kế hoạch ban hành: ${newAct.title}`,
      summary: `Ban hành ngày ${dayVal}/${monthVal}/${yearVal} - ${categoryLabel} cho hoạt động "${newAct.title}". Địa điểm: ${newAct.location || OFFICIAL_ADDRESS}. Thời gian: ${activityItem.time}`,
      sender: 'Đoàn xã Xuân Thới Sơn',
      recipient_scope: assignedText,
      status: 'unread',
      type: 'outgoing',
      category: categoryKey,
      category_label: categoryLabel,
      date: `${dayVal}/${monthVal}/${yearVal}`,
      time: `${new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`,
      file_name: newAct.file_name || `Van_Ban_Ban_Hanh_${newAct.title.replace(/\s+/g, '_')}.pdf`,
      file_url: newAct.file_url || '#',
      storage_provider: 'supabase'
    };
    const updatedDocs = await syncSaveDocument(autoDoc);
    setDocumentsList(updatedDocs);

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
        notes: newAct.notes || 'Đề nghị 56 Chi đoàn triển khai tham gia đầy đủ và đúng thời gian quy định.'
      },
      time_ago: 'Vừa xong'
    };
    const updatedNotis = await syncSaveNotification(autoNoti);
    setNotificationsList(updatedNotis);

    setTargetAttendanceActivityId(activityItem.id);
    setActiveTab('attendance');
    triggerToast(`Đã ban hành hoạt động "${newAct.title}" & tự động mở bảng điểm danh QR!`);
    return activityItem;
  };

  const handleToggleActivityStatus = async (activityId, newStatus) => {
    const updated = await syncToggleActivityStatus(activityId, newStatus);
    setActivitiesList(updated);
    triggerToast(newStatus === 'Đã hoàn thành' ? 'Đã đánh dấu hoàn thành hoạt động!' : 'Đã chuyển hoạt động về sắp diễn ra!');
  };

  const handleDeleteActivity = async (activityId, activityTitle = '') => {
    if (!activityId) return;
    const strId = String(activityId).trim();
    setActivitiesList(prev => prev.filter(a => a && String(a.id) !== strId));
    triggerToast('Đã thu hồi & xóa hoạt động thành công!');

    try {
      const updated = await syncDeleteActivity(strId);
      if (Array.isArray(updated)) {
        const cleanUpdated = deduplicateActivities(updated).filter(a => a && String(a.id) !== strId);
        setActivitiesList(prev => {
          if (cleanUpdated.length === 0 && prev.length > 0) {
            return prev.filter(a => a && String(a.id) !== strId);
          }
          return cleanUpdated;
        });
      }
    } catch (e) {
      console.error('Lỗi khi xóa hoạt động:', e);
    }
  };

  const handleIssueDocument = async (newDoc) => {
    let targetText = newDoc.recipient_scope || 'Khối Dân cư (30 Chi đoàn Ấp)';
    if (targetText === 'ALL') {
      targetText = 'Tất cả 56 Chi đoàn / Đơn vị';
    }

    const createdDoc = {
      id: `doc-${Date.now()}`,
      doc_number: newDoc.doc_number,
      title: newDoc.title,
      summary: `Ban hành ngày ${new Date().toLocaleDateString('vi-VN')} - Gửi đến: ${targetText}`,
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

    // Xác định ghi chú chỉ đạo rõ ràng theo đúng khối được chọn
    let dynamicNotes = `Đề nghị ${targetText} triển khai thực hiện đầy đủ và đúng thời gian quy định.`;
    if (targetText.includes('Khối Dân cư') || targetText.includes('30 Ấp') || targetText.includes('30 Chi đoàn')) {
      dynamicNotes = 'Đề nghị 56 Chi đoàn triển khai tham gia đầy đủ và đúng thời gian quy định.';
    } else if (targetText.includes('Khối Trường học') || targetText.includes('Trường học') || targetText.includes('Cấp 3') || targetText.includes('Mầm non')) {
      dynamicNotes = 'Đề nghị các trường Cấp 3, Cấp 2, Tiểu học, Mầm non và Đoàn trường triển khai thực hiện đầy đủ và đúng tiến độ.';
    } else if (targetText.includes('Khối Ngoài nhà nước') || targetText.includes('Công ty') || targetText.includes('Doanh nghiệp')) {
      dynamicNotes = 'Đề nghị các Chi đoàn Doanh nghiệp, Công ty và Cơ sở ngoài nhà nước triển khai thực hiện.';
    } else if (targetText.includes('Khối Lực lượng vũ trang') || targetText.includes('Cơ quan')) {
      dynamicNotes = 'Đề nghị Chi đoàn Công an, Quân sự, Trạm Y tế và Chi đoàn UBND xã triển khai thực hiện.';
    } else if (targetText.includes('56 Chi đoàn') || targetText === 'ALL') {
      dynamicNotes = 'Đề nghị toàn bộ 56 Chi đoàn / Đơn vị trực thuộc Đoàn xã triển khai thực hiện đầy đủ và đúng thời gian quy định.';
    }

    // Phát thông báo tự động khi ban hành văn bản mang đúng đối tượng gửi đến
    const autoNoti = {
      id: `noti-${Date.now()}`,
      title: `📄 Ban hành Văn bản số ${newDoc.doc_number}`,
      content: `Ban Thường vụ Đoàn xã Xuân Thới Sơn vừa ban hành văn bản số ${newDoc.doc_number}: "${newDoc.title}". Đề nghị các đơn vị kiểm tra và thực hiện.`,
      target_scope: targetText,
      activity_details: {
        notes: dynamicNotes
      },
      priority: 'Trung bình',
      time_ago: 'Vừa xong'
    };
    const updatedNotis = await syncSaveNotification(autoNoti);
    setNotificationsList(updatedNotis);

    triggerToast(`Đã ban hành văn bản số ${newDoc.doc_number} tới ${targetText}!`);
  };

  const handleDeleteDocument = async (docId, docTitle = '') => {
    if (!docId) return;
    const strId = String(docId).trim();
    setDocumentsList(prev => prev.filter(d => d && String(d.id) !== strId));
    triggerToast('Đã thu hồi & xóa văn bản tức thì trên toàn bộ 56 Chi đoàn!');

    try {
      const updated = await syncDeleteDocument(strId);
      if (Array.isArray(updated)) {
        const filtered = updated.filter(d => d && String(d.id) !== strId);
        setDocumentsList(prev => {
          if (filtered.length === 0 && prev.length > 0) {
            return prev.filter(d => d && String(d.id) !== strId);
          }
          return filtered;
        });
      }
    } catch (e) {
      console.error('Lỗi khi xóa văn bản:', e);
    }
  };

  const handleDeleteSubmission = async (subId, subTitle = '') => {
    if (!subId) return;
    setSubmissionsList(prev => prev.filter(s => String(s.id) !== String(subId)));
    triggerToast('Đã xóa tệp báo cáo / văn bản khỏi kho lưu trữ thành công!');

    const updated = await syncDeleteSubmission(subId);
    const filtered = (updated || []).filter(s => String(s.id) !== String(subId));
    setSubmissionsList(filtered);
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
        target_scope: notiData.target_scope || 'Tất cả 56 Chi đoàn',
        priority: notiData.priority || 'Bình thường',
        time: notiData.time || '08:00 - 11:30',
        date: notiData.date || '',
        location: notiData.location || '',
        activity_details: notiData.activity_details || {
          time: notiData.time || '08:00 - 11:30',
          date: notiData.date || '',
          location: notiData.location || '',
          notes: 'Đề nghị 56 Chi đoàn triển khai tham gia đầy đủ và đúng thời gian quy định.'
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
    const rawBranch = currentUser?.branch_name || currentUser?.full_name || 'Chi đoàn';
    const branchName = normalizeBranchName(rawBranch);
    const existingConfirmed = getUniqueConfirmedBranches(item.confirmedBy || []);
    if (existingConfirmed.some(c => normalizeBranchName(c.branch) === branchName)) {
      triggerToast('Đơn vị đã xác nhận tiếp nhận trước đó!');
      return;
    }
    const updatedConfirmedBy = [...existingConfirmed.filter(c => normalizeBranchName(c.branch) !== branchName), { branch: branchName, time: timeStr }];

    if (type === 'notification') {
      const updatedNoti = {
        ...item,
        confirmedBy: updatedConfirmedBy
      };
      const updatedList = await syncUpdateNotification(updatedNoti);
      setNotificationsList(updatedList);

      // Link to task if title matches
      const cleanNotiTitle = (item.title || '').replace(/^📋 Nhiệm vụ mới:\s*/i, '').replace(/^📋 Nhiệm vụ mới - [^:]+:\s*/i, '').trim();
      const matchedTask = tasksList.find(t => t.title && (t.title.includes(cleanNotiTitle) || cleanNotiTitle.includes(t.title)));
      if (matchedTask) {
        const tConfirmed = matchedTask.confirmedBy || [];
        if (!tConfirmed.some(c => c.branch === branchName)) {
          const updatedTask = { ...matchedTask, confirmedBy: [...tConfirmed, { branch: branchName, time: timeStr }] };
          const updatedTasks = await syncSaveTask(updatedTask);
          setTasksList(updatedTasks);
        }
      }
    } else if (type === 'task') {
      const updatedTask = {
        ...item,
        confirmedBy: updatedConfirmedBy
      };
      const updatedTasks = await syncSaveTask(updatedTask);
      setTasksList(updatedTasks);

      // Link to notification if title matches
      const cleanTaskTitle = (item.title || '').trim();
      const matchedNoti = notificationsList.find(n => n.title && n.title.includes(cleanTaskTitle));
      if (matchedNoti) {
        const nConfirmed = matchedNoti.confirmedBy || [];
        if (!nConfirmed.some(c => c.branch === branchName)) {
          const updatedNoti = { ...matchedNoti, confirmedBy: [...nConfirmed, { branch: branchName, time: timeStr }] };
          const updatedNotis = await syncUpdateNotification(updatedNoti);
          setNotificationsList(updatedNotis);
        }
      }
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

    triggerToast(`Đã xác nhận tiếp nhận lúc ${timeStr}! Dữ liệu đã gửi về Quản trị viên.`);
  };

  const handleEditNotification = (noti) => {
    setEditingNotification(noti);
    setShowSendMessageModal(true);
  };

  const handleDeleteNotification = async (notiId, notiTitle = '') => {
    if (!notiId) return;
    setNotificationsList(prev => prev.filter(n => String(n.id) !== String(notiId)));
    triggerToast('Đã xóa thông báo khỏi hệ thống!');

    const updated = await syncDeleteNotification(notiId);
    const filtered = (updated || []).filter(n => String(n.id) !== String(notiId));
    setNotificationsList(filtered);
  };

  const handleAddTask = async (newTask) => {
    const assignedStr = Array.isArray(newTask.assigned_to)
      ? (newTask.assigned_to.length === 1 ? newTask.assigned_to[0] : (newTask.assigned_to.includes('Tất cả 56 Chi đoàn') ? 'Tất cả 56 Chi đoàn' : newTask.assigned_to.join(', ')))
      : (newTask.assigned_to || 'Đoàn xã Xuân Thới Sơn');

    const taskItem = {
      id: `task-${Date.now()}`,
      title: newTask.title,
      status: 'todo',
      priority: newTask.priority || 'Cao',
      dueDate: newTask.dueDate || 'Hôm nay',
      assigned_to: assignedStr
    };
    const updated = await syncSaveTask(taskItem);
    setTasksList(updated);

    // Gửi thông báo tự động khi giao nhiệm vụ cho 56 Chi đoàn hoặc Các Cụm thi đua
    const formattedDeadline = formatDeadlineDisplay(taskItem.dueDate);

    if (newTask.assigned_to === 'Tất cả 56 Chi đoàn' || newTask.assigned_to.includes('30 Chi đoàn')) {
      const autoNoti = {
        id: `noti-${Date.now()}`,
        title: `📋 Nhiệm vụ mới: ${newTask.title}`,
        content: `Ban Thường vụ Đoàn xã Xuân Thới Sơn vừa giao nhiệm vụ "${newTask.title}" (Hạn hoàn thành: ${formattedDeadline}) tới Tất cả 56 Chi đoàn. Đề nghị các Chi đoàn khẩn trương thực hiện.`,
        target_scope: 'Tất cả 56 Chi đoàn',
        time_ago: 'Vừa xong'
      };
      const updatedNotis = await syncSaveNotification(autoNoti);
      setNotificationsList(updatedNotis);
      triggerToast(`Đã giao nhiệm vụ "${newTask.title}" và phát thông báo tới toàn bộ 56 Chi đoàn!`);
    } else if (newTask.assigned_to && newTask.assigned_to.startsWith('Cụm thi đua')) {
      const cluster = COMPETITION_CLUSTERS.find(c => c.name === newTask.assigned_to);
      const branchInfo = cluster ? ` (${cluster.branches.map(b => b.replace('Chi đoàn Ấp ', '')).join(', ')})` : '';
      const autoNoti = {
        id: `noti-${Date.now()}`,
        title: `📋 Nhiệm vụ mới - ${newTask.assigned_to}: ${newTask.title}`,
        content: `Ban Thường vụ Đoàn xã Xuân Thới Sơn giao nhiệm vụ "${newTask.title}" (Hạn hoàn thành: ${formattedDeadline}) cho ${newTask.assigned_to}${branchInfo}. Đề nghị các đơn vị trong cụm phối hợp triển khai.`,
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
        content: `Ban Thường vụ Đoàn xã Xuân Thới Sơn giao nhiệm vụ "${newTask.title}" (Hạn hoàn thành: ${formattedDeadline}) cho ${newTask.assigned_to}.`,
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

  
  const handleCompleteTask = async (taskItem) => {
    const branchName = currentUser?.full_name || currentUser?.branch_name || 'Chi đoàn';
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const timeStr = `${hours}:${minutes} ${day}/${month}/${year}`;

    const existingCompleted = Array.isArray(taskItem.completedBy) ? taskItem.completedBy : [];
    if (existingCompleted.some(c => c.branch === branchName)) {
      triggerToast('Chi đoàn đã báo làm xong công việc này trước đó!');
      return;
    }

    const updatedCompletedBy = [...existingCompleted, { branch: branchName, time: timeStr }];

    // Also ensure confirmedBy includes this branch
    const existingConfirmed = Array.isArray(taskItem.confirmedBy) ? taskItem.confirmedBy : [];
    const updatedConfirmedBy = existingConfirmed.some(c => c.branch === branchName)
      ? existingConfirmed
      : [...existingConfirmed, { branch: branchName, time: timeStr }];

    const updatedTask = {
      ...taskItem,
      status: 'completed',
      completed_time: timeStr,
      completedBy: updatedCompletedBy,
      confirmedBy: updatedConfirmedBy
    };

    const updatedTasks = await syncSaveTask(updatedTask);
    setTasksList(updatedTasks);

    if (typeof confetti === 'function') {
      confetti({ particleCount: 85, spread: 75, origin: { y: 0.6 } });
    }
    triggerToast(`Chi đoàn đã hoàn thành công việc "${taskItem.title}" lúc ${timeStr}! Dữ liệu đã gửi về Admin.`);
  };

  const handleToggleTask = async (taskId, newStatus) => {
    const updated = await syncToggleTaskStatus(taskId, newStatus);
    setTasksList(updated);
  };

  const handleDeleteTask = async (taskId, taskTitle = '') => {
    if (!taskId) return;
    const strId = String(taskId).trim();
    setTasksList(prev => prev.filter(t => t && String(t.id) !== strId));
    triggerToast('Đã thu hồi & xóa công việc khỏi hệ thống thành công!');

    try {
      const updated = await syncDeleteTask(strId);
      if (Array.isArray(updated)) {
        const filtered = updated.filter(t => t && String(t.id) !== strId);
        setTasksList(prev => {
          if (filtered.length === 0 && prev.length > 0) {
            return prev.filter(t => t && String(t.id) !== strId);
          }
          return filtered;
        });
      }
    } catch (e) {
      console.error('Lỗi khi xóa nhiệm vụ:', e);
    }
  };

  const handleSaveAttendance = async (activityId, recordData) => {
    const updated = await syncSaveAttendance(activityId, recordData);
    setAttendanceRecords(updated);
    triggerToast('Đã lưu kết quả điểm danh & đánh giá tham gia hoạt động!');
  };

  const handleRefreshAllData = async () => {
    try {
      triggerToast('Đang đồng bộ dữ liệu mới nhất từ máy chủ...');
      await loadAllData();
      triggerToast('Đã hoàn tất đồng bộ dữ liệu Báo cáo Thống kê & Điểm danh!');
    } catch (err) {
      console.warn('Lỗi khi làm mới dữ liệu:', err);
      triggerToast('Có lỗi khi đồng bộ dữ liệu, vui lòng thử lại.');
    }
  };

  const handleRespondAttendance = async (activityId, rawBranchName, attended, reason, activityTitle = '') => {
    const branchName = normalizeBranchName(rawBranchName);
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const fallbackTime = `${hours}:${minutes} ${day}/${month}/${year}`;

    const detailObj = (typeof reason === 'object' && reason !== null) ? reason : {};
    const timeStr = detailObj.time || fallbackTime;

    const currentActivityRec = attendanceRecords[activityId] || {};
    const recordValue = attended ? { 
      attended: true, 
      time: timeStr,
      method: detailObj.method || 'Xác thực điểm danh',
      latitude: detailObj.latitude,
      longitude: detailObj.longitude,
      photo_url: detailObj.photo_url || null
    } : { 
      attended: false, 
      reason: typeof reason === 'string' ? reason : (detailObj.reason || 'Báo vắng'), 
      time: timeStr 
    };

    const updatedRec = {
      ...currentActivityRec,
      [branchName]: recordValue,
      [rawBranchName]: recordValue
    };
    const updated = await syncSaveAttendance(activityId, updatedRec);
    setAttendanceRecords(updated);

    // Update targetAct on activitiesList so confirmedBy and absentBy are immediately saved to Supabase
    const targetAct = activitiesList.find(a => String(a.id) === String(activityId));
    if (targetAct) {
      const existingConfirmed = Array.isArray(targetAct.confirmedBy) ? targetAct.confirmedBy : [];
      const existingAbsent = Array.isArray(targetAct.absentBy) ? targetAct.absentBy : [];

      let updatedConfirmedBy = existingConfirmed;
      let updatedAbsentBy = existingAbsent;

      if (attended) {
        // Remove from absentBy if present, add to confirmedBy if not present
        updatedAbsentBy = existingAbsent.filter(c => {
          const b = typeof c === 'string' ? c : c?.branch;
          return normalizeBranchName(b) !== branchName;
        });
        const existingIdx = existingConfirmed.findIndex(c => {
          const b = typeof c === 'string' ? c : c?.branch;
          return normalizeBranchName(b) === branchName;
        });
        const confirmedEntry = {
          branch: branchName,
          time: timeStr,
          method: detailObj.method || 'CAMERA_QR',
          latitude: detailObj.latitude,
          longitude: detailObj.longitude,
          photo_url: detailObj.photo_url || null
        };
        if (existingIdx >= 0) {
          updatedConfirmedBy = [...existingConfirmed];
          updatedConfirmedBy[existingIdx] = confirmedEntry;
        } else {
          updatedConfirmedBy = [...existingConfirmed, confirmedEntry];
        }
      } else {
        // Remove from confirmedBy if present, add/update in absentBy
        updatedConfirmedBy = existingConfirmed.filter(c => {
          const b = typeof c === 'string' ? c : c?.branch;
          return normalizeBranchName(b) !== branchName;
        });
        const absentReason = typeof reason === 'string' ? reason : (detailObj.reason || 'Báo vắng');
        const existingAbsIdx = existingAbsent.findIndex(a => {
          const b = typeof a === 'string' ? a : a?.branch;
          return normalizeBranchName(b) === branchName;
        });
        const absentEntry = { branch: branchName, reason: absentReason, time: timeStr };
        if (existingAbsIdx >= 0) {
          updatedAbsentBy = [...existingAbsent];
          updatedAbsentBy[existingAbsIdx] = absentEntry;
        } else {
          updatedAbsentBy = [...existingAbsent, absentEntry];
        }
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
      triggerToast(`Đã xác nhận THAM GIA hoạt động thành công cho ${branchName}!`);
    } else {
      triggerToast(`Đã ghi nhận báo VẮNG MẶT thành công cho ${branchName}!`);
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
          onOpenGpsModal={() => setShowGpsModal(true)}
          gpsStatus={gpsStatus}
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
                {(() => {
                  const q = searchQuery.trim().toLowerCase();
                  const matchedActs = userActivities.filter(a => (a.title || '').toLowerCase().includes(q) || (a.description || '').toLowerCase().includes(q));
                  const matchedDocs = userDocuments.filter(d => (d.title || '').toLowerCase().includes(q) || (d.doc_number || '').toLowerCase().includes(q));
                  if (matchedActs.length === 0 && matchedDocs.length === 0) {
                    return <div className="text-secondary" style={{ fontSize: '13px' }}>Không tìm thấy văn bản hay hoạt động khớp với từ khóa.</div>;
                  }
                  return (
                    <ul className="mb-0 text-dark" style={{ fontSize: '13px' }}>
                      {matchedActs.map(a => <li key={a.id} className="mb-1"><strong>[Hoạt động]</strong> {a.title} ({a.day}/{a.month}/{a.year})</li>)}
                      {matchedDocs.map(d => <li key={d.id} className="mb-1"><strong>[Văn bản]</strong> {d.title} (Số: {d.doc_number || 'N/A'})</li>)}
                    </ul>
                  );
                })()}
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
                      hamletBranchesCount={INITIAL_BRANCHES.length}
                      schoolBranchesCount={SCHOOL_BRANCHES.length}
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
                      submissions={userSubmissions}
                      setActiveTab={setActiveTab} 
                      onDeleteSubmission={handleDeleteSubmission}
                    />
                  )}
                </div>

                {/* RIGHT COLUMN */}
                <div className="col-12 col-xl-4">
                  <CalendarWidget />

                  <PendingDocs 
                    currentRole={currentUser}
                    documents={userDocuments}
                    submissions={userSubmissions}
                    setActiveTab={setActiveTab}
                  />

                  {!isDoanXa && (
                    <BranchTasks 
                      tasks={userTasks} 
                      currentRole={currentUser} 
                      setActiveTab={setActiveTab} 
                      onDeleteTask={handleDeleteTask}
                      onConfirmReceipt={handleConfirmReceipt}
                      onCompleteTask={handleCompleteTask}
                    />
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
              onOpenQrAttendance={(act) => {
                setTargetAttendanceActivityId(act.id);
                setActiveTab('attendance');
              }}
              onNavigateToNotifications={() => setActiveTab('notifications')}
              onNavigateToDocuments={() => setActiveTab('outgoing_docs')}
            />
          ) : activeTab === 'incoming_docs' || activeTab === 'outgoing_docs' || activeTab === 'doan_xa_docs' || activeTab === 'required_docs' ? (
            /* DOCUMENTS MANAGEMENT VIEW */
            <DocumentsView 
              documents={userDocuments}
              submissions={submissionsList}
              tasks={userTasks}
              tabType={activeTab}
              onOpenIssueDocument={() => setShowIssueDocModal(true)}
              onDeleteDocument={handleDeleteDocument}
              onDeleteSubmission={handleDeleteSubmission}
              onSaveDocument={handleSaveDocumentItem}
              onSaveSubmission={handleSaveSubmissionItem}
              onSaveTask={async (taskItem) => {
                const updatedTasks = await syncSaveTask(taskItem);
                setTasksList(updatedTasks);
              }}
              triggerToast={triggerToast}
              isDoanXa={isDoanXa}
              currentUser={currentUser}
            />
          ) : activeTab === 'submission_history' ? (
            /* SUBMISSIONS HISTORY VIEW */
            <SubmissionsView 
              submissions={userSubmissions}
              onOpenSubmitDoc={() => setShowSubmitDocModal(true)}
              onDeleteSubmission={handleDeleteSubmission}
            />
          ) : activeTab === 'attendance' ? (
            /* DEDICATED ATTENDANCE VIEW (CHI ĐOÀN & ADMIN) */
            <BranchAttendanceWorkspaceView 
              onAddActivity={handleAddActivity}
              activities={activitiesList}
              tasks={tasksList}
              currentRole={currentUser}
              attendanceRecords={attendanceRecords}
              onRespondAttendance={handleRespondAttendance}
              onConfirmReceipt={handleConfirmReceipt}
              isDoanXa={isDoanXa}
              targetActivityId={targetAttendanceActivityId}
              onUpdateActivity={handleUpdateActivity}
              onUpdateTask={handleUpdateTask}
              onDeleteActivity={handleDeleteActivity}
              onDeleteTask={handleDeleteTask}
              onToggleTask={handleToggleTask}
              onCompleteTask={handleCompleteTask}
              onOpenCreateActivity={() => setShowCreateActivityModal(true)}
              onAddTask={handleAddTask}
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
              currentUser={currentUser}
              onConfirmReceipt={handleConfirmReceipt}
              onCompleteTask={handleCompleteTask}
            />
          ) : activeTab === 'reports' ? (
            /* REPORTS & ANALYTICS VIEW */
            <ReportsView 
              setActiveTab={setActiveTab}
              activitiesCount={activitiesList.length}
              docsCount={userDocuments.length}
              submissionsCount={submissionsList.length}
              activities={activitiesList}
              attendanceRecords={attendanceRecords}
              onOpenAttendanceModal={(mode = 'qr') => {
                setAttendanceModalTab(mode);
                setShowAttendanceModal(true);
              }}
              onRespondAttendance={handleRespondAttendance}
              isDoanXa={isDoanXa}
              currentUser={currentUser}
              onRefreshData={handleRefreshAllData}
            />
          ) : activeTab === 'storage' ? (
            /* STORAGE ARCHIVE VIEW */
            <StorageArchiveView 
              documents={userDocuments}
              submissions={submissionsList}
              onDeleteDocument={handleDeleteDocument}
              onDeleteSubmission={handleDeleteSubmission}
              isDoanXa={isDoanXa}
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

      <GpsPermissionModal
        show={showGpsModal}
        onClose={() => setShowGpsModal(false)}
        onPermissionGranted={handleGpsGranted}
        currentUser={currentUser}
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

import React from 'react';
import { 
  CalendarPlus, 
  Send, 
  Megaphone, 
  Users, 
  Calendar, 
  BarChart2,
  FileText,
  Upload,
  CheckSquare,
  PhoneCall,
  Settings
} from 'lucide-react';

export default function QuickActions({ 
  currentRole, 
  onOpenCreateActivity,
  onOpenIssueDocument,
  onOpenSendNotification,
  onOpenSubmitDoc,
  setActiveTab
}) {
  const isDoanXa = currentRole.role === 'doan_xa';

  const actionsDoanXa = [
    { 
      id: 'add-act', 
      title: 'Thêm hoạt động', 
      icon: CalendarPlus, 
      color: '#0066FF', 
      bgColor: '#EBF3FF',
      onClick: onOpenCreateActivity
    },
    { 
      id: 'issue-doc', 
      title: 'Ban hành văn bản', 
      icon: Send, 
      color: '#8B5CF6', 
      bgColor: '#F3E8FF',
      onClick: onOpenIssueDocument
    },
    { 
      id: 'send-noti', 
      title: 'Gửi thông báo', 
      icon: Megaphone, 
      color: '#0284C7', 
      bgColor: '#E0F2FE',
      onClick: onOpenSendNotification
    },
    { 
      id: 'manage-acc', 
      title: 'Quản lý tài khoản', 
      icon: Users, 
      color: '#D97706', 
      bgColor: '#FEF3C7',
      onClick: () => setActiveTab('branches')
    },
    { 
      id: 'calendar-work', 
      title: 'Lịch công tác', 
      icon: Calendar, 
      color: '#2563EB', 
      bgColor: '#EFF6FF',
      onClick: () => setActiveTab('activities')
    },
    { 
      id: 'reports', 
      title: 'Báo cáo thống kê', 
      icon: BarChart2, 
      color: '#7C3AED', 
      bgColor: '#F5F3FF',
      onClick: () => setActiveTab('reports')
    }
  ];

  const actionsChiDoan = [
    { 
      id: 'view-cal', 
      title: 'Xem lịch hoạt động', 
      icon: Calendar, 
      color: '#0066FF', 
      bgColor: '#EBF3FF',
      onClick: () => setActiveTab('activities')
    },
    { 
      id: 'dx-docs', 
      title: 'Văn bản từ Đoàn xã', 
      icon: FileText, 
      color: '#8B5CF6', 
      bgColor: '#F3E8FF',
      onClick: () => setActiveTab('doan_xa_docs')
    },
    { 
      id: 'req-docs', 
      title: 'Văn bản cần nộp', 
      icon: Send, 
      color: '#0284C7', 
      bgColor: '#E0F2FE',
      onClick: () => setActiveTab('required_docs')
    },
    { 
      id: 'submit-doc', 
      title: 'Nộp văn bản', 
      icon: Upload, 
      color: '#2563EB', 
      bgColor: '#EFF6FF',
      onClick: onOpenSubmitDoc
    },
    { 
      id: 'branch-tasks', 
      title: 'Công việc chi đoàn', 
      icon: CheckSquare, 
      color: '#059669', 
      bgColor: '#D1FAE5',
      onClick: () => setActiveTab('branch_tasks')
    },
    { 
      id: 'contact-dx', 
      title: 'Liên hệ Đoàn xã', 
      icon: PhoneCall, 
      color: '#D97706', 
      bgColor: '#FEF3C7',
      onClick: () => setActiveTab('contact')
    }
  ];

  const actions = isDoanXa ? actionsDoanXa : actionsChiDoan;

  return (
    <div className="content-card mb-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h3 className="card-title-header mb-0">Thao tác nhanh</h3>
        <span className="text-secondary cursor-pointer hover-text-primary" style={{ fontSize: '12px' }}>
          Tùy chỉnh ⚙
        </span>
      </div>

      <div className="row g-3">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <div key={act.id} className="col-6 col-md-4 col-lg-2">
              <div className="quick-action-card" onClick={act.onClick}>
                <div 
                  className="quick-action-icon"
                  style={{ backgroundColor: act.bgColor, color: act.color }}
                >
                  <Icon size={20} />
                </div>
                <div className="fw-semibold text-dark" style={{ fontSize: '12.5px' }}>
                  {act.title}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

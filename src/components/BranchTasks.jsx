import React from 'react';
import { CheckSquare, Trash2 } from 'lucide-react';
import { COMPETITION_CLUSTERS } from '../lib/supabase';
import { ReceiptConfirmationBox } from './SecondaryViews';
import TaskCountdown, { formatDeadlineDisplay } from './TaskCountdown';

export default function BranchTasks({ tasks = [], currentRole, setActiveTab, onDeleteTask, onConfirmReceipt }) {
  const branchName = currentRole?.full_name || currentRole?.branch_name || currentRole?.title || '';
  const isDoanXa = currentRole?.role === 'doan_xa' || currentRole?.role === 'admin';

  // Filter tasks relevant to this Chi đoàn:
  // 1. Assigned to "Tất cả 30 Chi đoàn Ấp"
  // 2. Assigned directly to this branchName
  // 3. Assigned to a Cụm thi đua that contains this branchName
  const myTasks = tasks.filter(t => {
    if (!t.assigned_to) return false;
    const assignedStr = Array.isArray(t.assigned_to) ? t.assigned_to.join(', ') : String(t.assigned_to);

    if (assignedStr === 'Tất cả 30 Chi đoàn Ấp' || assignedStr.includes('30 Chi đoàn') || assignedStr === 'ALL') return true;
    if (assignedStr.includes(branchName) || (branchName && branchName.includes(assignedStr))) return true;

    const matchedClusters = COMPETITION_CLUSTERS.filter(c => assignedStr.includes(c.name) || assignedStr.includes(c.id));
    for (const cluster of matchedClusters) {
      if (cluster.branches.some(b => b.includes(branchName) || (branchName && branchName.includes(b)))) {
        return true;
      }
    }
    return false;
  });

  return (
    <div className="content-card mb-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h3 className="card-title-header mb-0">Công việc của chi đoàn ({myTasks.length})</h3>
        <span 
          className="card-link cursor-pointer"
          onClick={() => setActiveTab && setActiveTab('todo')}
        >
          Xem tất cả
        </span>
      </div>

      {myTasks.length === 0 ? (
        <div className="p-3 bg-light rounded-3 text-center border">
          <div className="p-2 bg-white d-inline-block rounded-circle shadow-sm mb-2 text-success">
            <CheckSquare size={22} />
          </div>
          <div className="fw-semibold text-dark" style={{ fontSize: '12.5px' }}>Chưa có công việc được giao</div>
          <div className="text-secondary" style={{ fontSize: '11px' }}>Sẵn sàng theo dõi công việc chi đoàn</div>
        </div>
      ) : (
        <div className="d-flex flex-column gap-2" style={{ maxHeight: '280px', overflowY: 'auto' }}>
          {myTasks.map((task) => (
            <div key={task.id} className="p-2.5 px-3 rounded-3 bg-light border hover-shadow transition">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <div>
                  <div className="fw-semibold text-dark" style={{ fontSize: '12.5px' }}>{task.title}</div>
                  <div className="text-muted d-flex flex-wrap align-items-center gap-1.5 mt-1" style={{ fontSize: '10.5px' }}>
                    <span>Hạn: {formatDeadlineDisplay(task.dueDate || task.due_date || 'Hôm nay')}</span>
                    <TaskCountdown dueDate={task.dueDate || task.due_date} status={task.status} compact={true} />
                    <span className="text-primary fw-semibold">📌 {task.assigned_to}</span>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <span className={`badge ${task.status === 'completed' ? 'bg-success' : 'bg-primary'}`} style={{ fontSize: '10px' }}>
                    {task.status === 'completed' ? 'Hoàn thành' : 'Đang làm'}
                  </span>
                  {onDeleteTask && (
                    <button 
                      className="btn btn-link text-danger p-0 ms-1"
                      title="Xóa công việc"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(`Bạn có chắc chắn muốn xóa công việc "${task.title}" không?`)) {
                          onDeleteTask(task.id, task.title);
                        }
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
              <div className="pt-1.5 border-top d-flex justify-content-end">
                <ReceiptConfirmationBox 
                  type="task" 
                  item={task} 
                  currentRole={currentRole} 
                  isDoanXa={isDoanXa} 
                  onConfirmReceipt={onConfirmReceipt} 
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

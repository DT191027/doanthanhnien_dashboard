import React, { useState } from 'react';
import { CheckSquare } from 'lucide-react';

export default function TodoList({ tasks = [], setActiveTab }) {
  const [activeSubTab, setActiveSubTab] = useState('todo'); // 'todo', 'inProgress', 'completed'

  const todoTasks = tasks.filter(t => t.status === 'todo');
  const inProgressTasks = tasks.filter(t => t.status === 'inProgress' || t.status === 'in_progress');
  const completedTasks = tasks.filter(t => t.status === 'completed');

  const currentList = activeSubTab === 'todo' ? todoTasks :
                      activeSubTab === 'inProgress' ? inProgressTasks : completedTasks;

  return (
    <div className="content-card mb-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h3 className="card-title-header mb-0">Công việc (Todo List)</h3>
        <span 
          className="card-link cursor-pointer"
          onClick={() => setActiveTab && setActiveTab('todo')}
        >
          Xem tất cả
        </span>
      </div>

      {/* Tabs Row */}
      <div className="row g-2 mb-3">
        <div className="col-4">
          <button 
            className={`btn w-100 py-2 rounded-3 text-start fw-bold ${activeSubTab === 'todo' ? 'btn-primary text-white' : 'bg-light text-dark'}`}
            style={{ fontSize: '12px', backgroundColor: activeSubTab === 'todo' ? '#0066FF' : '#F8FAFC' }}
            onClick={() => setActiveSubTab('todo')}
          >
            To do ({todoTasks.length})
          </button>
        </div>
        <div className="col-4">
          <button 
            className={`btn w-100 py-2 rounded-3 text-start fw-bold ${activeSubTab === 'inProgress' ? 'btn-primary text-white' : 'bg-light text-dark'}`}
            style={{ fontSize: '12px', backgroundColor: activeSubTab === 'inProgress' ? '#0066FF' : '#F8FAFC' }}
            onClick={() => setActiveSubTab('inProgress')}
          >
            Đang thực hiện ({inProgressTasks.length})
          </button>
        </div>
        <div className="col-4">
          <button 
            className={`btn w-100 py-2 rounded-3 text-start fw-bold ${activeSubTab === 'completed' ? 'btn-primary text-white' : 'bg-light text-dark'}`}
            style={{ fontSize: '12px', backgroundColor: activeSubTab === 'completed' ? '#0066FF' : '#F8FAFC' }}
            onClick={() => setActiveSubTab('completed')}
          >
            Hoàn thành ({completedTasks.length})
          </button>
        </div>
      </div>

      {currentList.length === 0 ? (
        <div className="p-4 bg-light rounded-3 text-center border">
          <div className="p-2 bg-white d-inline-block rounded-circle shadow-sm mb-2 text-secondary">
            <CheckSquare size={24} />
          </div>
          <div className="fw-semibold text-dark" style={{ fontSize: '13px' }}>Chưa có công việc nào trong danh sách</div>
          <div className="text-secondary" style={{ fontSize: '11.5px' }}>Sẵn sàng quản lý công việc và giao phó nhiệm vụ</div>
        </div>
      ) : (
        <div className="d-flex flex-column gap-2" style={{ maxHeight: '320px', overflowY: 'auto' }}>
          {currentList.map((task) => (
            <div 
              key={task.id} 
              className="p-3 rounded-3 bg-light border d-flex align-items-center justify-content-between hover-shadow transition"
            >
              <div>
                <div className="fw-semibold text-dark mb-1" style={{ fontSize: '13px' }}>
                  {task.title}
                </div>
                <div className="d-flex align-items-center gap-2" style={{ fontSize: '11px' }}>
                  <span className="text-muted">Hạn: {task.dueDate || task.due_date || 'Hôm nay'}</span>
                </div>
              </div>
              <span className={`badge ${task.status === 'completed' ? 'bg-success' : 'bg-primary'}`}>
                {task.status === 'completed' ? 'Done' : 'In Progress'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

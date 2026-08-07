import React, { useState } from 'react';
import { MoreVertical, CheckSquare, Plus } from 'lucide-react';
import { INITIAL_TASKS_DOAN_XA } from '../lib/supabase';

export default function TodoList({ setActiveTab }) {
  const [tasks, setTasks] = useState(INITIAL_TASKS_DOAN_XA);
  const [activeTab, setActiveSubTab] = useState('todo'); // 'todo', 'inProgress', 'completed'

  const currentList = tasks[activeTab] || [];

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
            className={`btn w-100 py-2 rounded-3 text-start fw-bold ${activeTab === 'todo' ? 'btn-primary' : 'bg-light text-dark'}`}
            style={{ fontSize: '12px', backgroundColor: activeTab === 'todo' ? '#0066FF' : '#F8FAFC' }}
            onClick={() => setActiveSubTab('todo')}
          >
            To do ({tasks.todo?.length || 0})
          </button>
        </div>
        <div className="col-4">
          <button 
            className={`btn w-100 py-2 rounded-3 text-start fw-bold ${activeTab === 'inProgress' ? 'btn-primary' : 'bg-light text-dark'}`}
            style={{ fontSize: '12px', backgroundColor: activeTab === 'inProgress' ? '#0066FF' : '#F8FAFC' }}
            onClick={() => setActiveSubTab('inProgress')}
          >
            Đang thực hiện ({tasks.inProgress?.length || 0})
          </button>
        </div>
        <div className="col-4">
          <button 
            className={`btn w-100 py-2 rounded-3 text-start fw-bold ${activeTab === 'completed' ? 'btn-primary' : 'bg-light text-dark'}`}
            style={{ fontSize: '12px', backgroundColor: activeTab === 'completed' ? '#0066FF' : '#F8FAFC' }}
            onClick={() => setActiveSubTab('completed')}
          >
            Hoàn thành ({tasks.completed?.length || 0})
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
                  <span className="text-muted">{task.date}</span>
                </div>
              </div>
              <button className="btn btn-sm btn-link text-secondary p-0">
                <MoreVertical size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

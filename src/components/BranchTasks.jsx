import React, { useState } from 'react';
import { CheckSquare, Square, Check } from 'lucide-react';
import { INITIAL_TASKS_CHI_DOAN } from '../lib/supabase';

export default function BranchTasks({ setActiveTab }) {
  const [tasks, setTasks] = useState(INITIAL_TASKS_CHI_DOAN);

  return (
    <div className="content-card mb-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h3 className="card-title-header mb-0">Công việc của chi đoàn</h3>
        <span 
          className="card-link cursor-pointer"
          onClick={() => setActiveTab && setActiveTab('branch_tasks')}
        >
          Xem tất cả
        </span>
      </div>

      {tasks.length === 0 ? (
        <div className="p-3 bg-light rounded-3 text-center border">
          <div className="p-2 bg-white d-inline-block rounded-circle shadow-sm mb-2 text-success">
            <CheckSquare size={22} />
          </div>
          <div className="fw-semibold text-dark" style={{ fontSize: '12.5px' }}>Chưa có công việc được giao</div>
          <div className="text-secondary" style={{ fontSize: '11px' }}>Sẵn sàng theo dõi công việc chi đoàn</div>
        </div>
      ) : (
        <div className="d-flex flex-column gap-2">
          {tasks.map((task) => (
            <div key={task.id} className="p-2 px-3 rounded-3 border d-flex align-items-center justify-content-between">
              <div className="fw-semibold text-dark" style={{ fontSize: '12.5px' }}>{task.title}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

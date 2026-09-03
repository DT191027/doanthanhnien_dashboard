import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function CalendarWidget({ activities = [] }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed (0 = Tháng 1, 8 = Tháng 9)

  const monthNames = [
    'Tháng 01', 'Tháng 02', 'Tháng 03', 'Tháng 04', 'Tháng 05', 'Tháng 06',
    'Tháng 07', 'Tháng 08', 'Tháng 09', 'Tháng 10', 'Tháng 11', 'Tháng 12'
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Total days in current target month
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();

  // Get starting weekday of 1st day of month
  // getDay(): 0 = Sun, 1 = Mon, 2 = Tue, 3 = Wed, 4 = Thu, 5 = Fri, 6 = Sat
  // We align T2 (Monday) = 0, T3 (Tuesday) = 1, ..., CN (Sunday) = 6
  let startDay = new Date(year, month, 1).getDay();
  startDay = startDay === 0 ? 6 : startDay - 1;

  const today = new Date();
  const isCurrentMonthReal = today.getMonth() === month && today.getFullYear() === year;
  const realTodayDay = today.getDate();

  const daysArray = Array.from({ length: totalDaysInMonth }, (_, i) => i + 1);
  const leadingSpaces = Array.from({ length: startDay }, (_, i) => i);

  return (
    <div className="content-card mb-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h3 className="card-title-header mb-0">Lịch công tác</h3>
        <div className="d-flex align-items-center gap-1">
          <button 
            className="btn btn-sm btn-light p-1.5 rounded-circle d-flex align-items-center justify-content-center" 
            onClick={handlePrevMonth}
            title="Tháng trước"
          >
            <ChevronLeft size={16} />
          </button>
          <span 
            className="fw-bold text-dark px-1 cursor-pointer" 
            onClick={handleToday} 
            title="Về tháng hiện tại" 
            style={{ fontSize: '13px' }}
          >
            {monthNames[month]}/{year}
          </span>
          <button 
            className="btn btn-sm btn-light p-1.5 rounded-circle d-flex align-items-center justify-content-center" 
            onClick={handleNextMonth}
            title="Tháng sau"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Weekdays header (Strict 7 columns: T2 -> CN) */}
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(7, 1fr)', 
          textAlign: 'center', 
          marginBottom: '8px', 
          color: '#64748B', 
          fontWeight: '700', 
          fontSize: '11.5px' 
        }}
      >
        <div>T2</div>
        <div>T3</div>
        <div>T4</div>
        <div>T5</div>
        <div>T6</div>
        <div>T7</div>
        <div>CN</div>
      </div>

      {/* Calendar Days Grid (Strict 7 columns layout) */}
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(7, 1fr)', 
          textAlign: 'center', 
          rowGap: '6px' 
        }}
      >
        {/* Leading empty spaces offset */}
        {leadingSpaces.map((s) => (
          <div key={`space-${s}`} className="d-flex justify-content-center align-items-center">
            <div className="calendar-day-cell text-muted opacity-25">•</div>
          </div>
        ))}

        {/* Days of month */}
        {daysArray.map((d) => {
          const isTodayActive = isCurrentMonthReal && realTodayDay === d;
          return (
            <div key={`day-${d}`} className="d-flex justify-content-center align-items-center">
              <div className={`calendar-day-cell ${isTodayActive ? 'active' : ''}`}>
                <span>{d}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

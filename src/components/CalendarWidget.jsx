import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function CalendarWidget() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed

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

  // Get total days in month
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
  // Get starting weekday (0 = Sun, 1 = Mon, ..., 6 = Sat)
  let startDay = new Date(year, month, 1).getDay();
  // Convert Sunday=0 to 7 so Monday is index 0
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
          <button className="btn btn-sm btn-light p-1 rounded-circle me-1" onClick={handlePrevMonth}>
            <ChevronLeft size={16} />
          </button>
          <span className="fw-bold text-dark" style={{ fontSize: '13px' }}>
            {monthNames[month]}/{year}
          </span>
          <button className="btn btn-sm btn-light p-1 rounded-circle ms-1" onClick={handleNextMonth}>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Weekdays header */}
      <div className="row text-center mb-2 g-0 text-muted fw-bold" style={{ fontSize: '11px' }}>
        <div className="col">T2</div>
        <div className="col">T3</div>
        <div className="col">T4</div>
        <div className="col">T5</div>
        <div className="col">T6</div>
        <div className="col">T7</div>
        <div className="col">CN</div>
      </div>

      {/* Calendar Grid */}
      <div className="row text-center g-0" style={{ rowGap: '6px' }}>
        {/* Leading empty spaces */}
        {leadingSpaces.map((s) => (
          <div key={`space-${s}`} className="col">
            <div className="calendar-day-cell text-muted opacity-25">•</div>
          </div>
        ))}

        {/* Days of current month */}
        {daysArray.map((d) => {
          const isTodayActive = isCurrentMonthReal && realTodayDay === d;
          return (
            <div key={`day-${d}`} className="col">
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

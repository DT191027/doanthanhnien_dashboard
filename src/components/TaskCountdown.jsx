import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

/**
 * Robust parser for various date formats:
 * - ISO string: "2026-09-15T18:00:00" or "2026-09-15T18:00"
 * - YYYY-MM-DD format: "2026-09-15" (defaults to 23:59:59)
 * - DD/MM/YYYY HH:mm or DD/MM/YYYY format: "15/09/2026 18:00" or "15/09/2026"
 * - Keyword: "Hôm nay" (defaults to end of today)
 */
export function parseDeadline(deadlineStr) {
  if (!deadlineStr) return null;
  if (deadlineStr === 'Hôm nay') {
    const d = new Date();
    d.setHours(23, 59, 59, 999);
    return d;
  }

  const str = String(deadlineStr).trim();

  // Handle DD/MM/YYYY format (e.g., "11/09/2026 - 21:21", "11/09/2026 21:21", "11/09/2026 09:21 CH")
  if (str.includes('/')) {
    const cleaned = str.replace(/\s*-\s*/g, ' ');
    const parts = cleaned.split(/\s+/);
    const datePart = parts[0];
    let timePart = parts[1] || '23:59:59';
    const ampm = parts[2] ? parts[2].toUpperCase() : '';

    const dateBits = datePart.split('/').map(Number);
    if (dateBits.length === 3) {
      const [day, month, year] = dateBits;
      const timeBits = timePart.split(':').map(Number);
      let hours = timeBits[0] !== undefined ? timeBits[0] : 23;
      let minutes = timeBits[1] !== undefined ? timeBits[1] : 59;
      let seconds = timeBits[2] !== undefined ? timeBits[2] : 0;

      if (ampm === 'CH' || ampm === 'PM') {
        if (hours < 12) hours += 12;
      } else if (ampm === 'SA' || ampm === 'AM') {
        if (hours === 12) hours = 0;
      }

      if (day && month && year) {
        return new Date(year, month - 1, day, hours, minutes, seconds);
      }
    }
  }

  // Handle YYYY-MM-DD or ISO string
  if (str.includes('-')) {
    if (str.length === 10) {
      const [y, m, d] = str.split('-').map(Number);
      if (y && m && d) {
        return new Date(y, m - 1, d, 23, 59, 59, 999);
      }
    }
  }

  const parsed = new Date(str);
  if (!isNaN(parsed.getTime())) {
    return parsed;
  }

  return null;
}

export function formatDeadlineDisplay(deadlineStr) {
  const target = parseDeadline(deadlineStr);
  if (!target) return deadlineStr || 'Chưa đặt';
  
  const d = String(target.getDate()).padStart(2, '0');
  const m = String(target.getMonth() + 1).padStart(2, '0');
  const y = target.getFullYear();
  const h = String(target.getHours()).padStart(2, '0');
  const min = String(target.getMinutes()).padStart(2, '0');

  if (h === '23' && min === '59') {
    return `${d}/${m}/${y}`;
  }
  return `${d}/${m}/${y} - ${h}:${min}`;
}

export function getDeadlineCountdown(deadlineStr, status) {
  if (status === 'completed' || status === 'Done') {
    return {
      type: 'completed',
      text: 'Đã hoàn thành',
      badgeClass: 'bg-success text-white',
      isOverdue: false
    };
  }

  const target = parseDeadline(deadlineStr);
  if (!target) {
    return {
      type: 'normal',
      text: 'Hạn: ' + (deadlineStr || 'Hôm nay'),
      badgeClass: 'bg-light text-secondary border',
      isOverdue: false
    };
  }

  const now = new Date();
  const diffMs = target.getTime() - now.getTime();

  if (diffMs <= 0) {
    const absMs = Math.abs(diffMs);
    const days = Math.floor(absMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((absMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((absMs % (1000 * 60 * 60)) / (1000 * 60));

    let overdueText = '';
    if (days > 0) overdueText = `Quá hạn ${days}d ${hours}h`;
    else if (hours > 0) overdueText = `Quá hạn ${hours}h ${mins}p`;
    else overdueText = `Quá hạn ${mins} phút`;

    return {
      type: 'overdue',
      text: `🔴 ${overdueText}`,
      badgeClass: 'bg-danger text-white fw-bold shadow-sm',
      isOverdue: true,
      diffMs
    };
  }

  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const secs = Math.floor((diffMs % (1000 * 60)) / 1000);

  let countdownText = '';
  if (days > 0) {
    countdownText = `Còn ${days} ngày ${hours}h`;
  } else if (hours > 0) {
    countdownText = `Còn ${hours}h ${mins}p`;
  } else {
    countdownText = `Còn ${mins}p ${secs}s`;
  }

  let badgeClass = 'bg-primary-subtle text-primary border border-primary-subtle';
  let type = 'normal';

  if (diffMs < 3 * 3600 * 1000) {
    badgeClass = 'bg-danger text-white fw-bold shadow-sm';
    type = 'urgent';
    countdownText = `🔥 ${countdownText}`;
  } else if (diffMs < 24 * 3600 * 1000) {
    badgeClass = 'bg-warning text-dark fw-bold border border-warning-subtle';
    type = 'warning';
    countdownText = `⚡ ${countdownText}`;
  } else {
    countdownText = `⏳ ${countdownText}`;
  }

  return {
    type,
    text: countdownText,
    badgeClass,
    isOverdue: false,
    days,
    hours,
    mins,
    secs,
    diffMs
  };
}

export default function TaskCountdown({ dueDate, status, compact = false }) {
  const [countdown, setCountdown] = useState(() => getDeadlineCountdown(dueDate, status));

  useEffect(() => {
    setCountdown(getDeadlineCountdown(dueDate, status));

    if (status === 'completed' || status === 'Done') return;

    const interval = setInterval(() => {
      setCountdown(getDeadlineCountdown(dueDate, status));
    }, 1000);

    return () => clearInterval(interval);
  }, [dueDate, status]);

  const formattedDate = formatDeadlineDisplay(dueDate);

  return (
    <span 
      className={`badge ${countdown.badgeClass} d-inline-flex align-items-center gap-1 px-2 py-1 rounded-2`}
      style={{ fontSize: compact ? '10px' : '11px', transition: 'all 0.3s ease' }}
      title={`Hạn nộp: ${formattedDate}`}
    >
      <Clock size={compact ? 11 : 12} />
      <span>{countdown.text}</span>
    </span>
  );
}

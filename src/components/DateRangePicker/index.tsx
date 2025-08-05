import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Button } from 'antd';
import './index.css';

interface DateRangePickerProps {
  value?: [Date | null, Date | null];
  onChange?: (dates: [Date | null, Date | null], isoStrings: [string | null, string | null]) => void;
  placeholder?: [string, string];
  format?: string;
  disabled?: boolean;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  value,
  onChange,
  placeholder = ['开始日期', '结束日期'],
  format = 'YYYY/MM/DD',
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState<[Date | null, Date | null]>(value || [null, null]);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [selectingStart, setSelectingStart] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭弹窗
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // 格式化日期
  const formatDate = (date: Date | null): string => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return format.replace('YYYY', String(year)).replace('MM', month).replace('DD', day);
  };

  // 获取月份的所有日期
  const getMonthDates = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const dates = [];
    for (let i = 0; i < 42; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      dates.push(currentDate);
    }
    return dates;
  };

  // 检查日期是否在选中范围内
  const isInRange = (date: Date): boolean => {
    const [start, end] = selectedDates;
    if (!start || !end) return false;
    return date >= start && date <= end;
  };

  // 检查日期是否在悬停范围内
  const isInHoverRange = (date: Date): boolean => {
    if (!hoverDate || !selectedDates[0] || selectedDates[1]) return false;
    const start = selectedDates[0];
    const end = hoverDate;
    const minDate = start < end ? start : end;
    const maxDate = start < end ? end : start;
    return date >= minDate && date <= maxDate;
  };

  // 处理日期点击
  const handleDateClick = (date: Date) => {
    if (disabled) return;
    
    if (selectingStart || !selectedDates[0]) {
      setSelectedDates([date, null]);
      setSelectingStart(false);
    } else {
      const [start] = selectedDates;
      const newDates: [Date, Date] = start! <= date ? [start!, date] : [date, start!];
      setSelectedDates(newDates);
      setSelectingStart(true);
      // 转换为ISO字符串格式
      const isoStrings: [string, string] = [newDates[0].toISOString(), newDates[1].toISOString()];
      onChange?.(newDates, isoStrings);
      setIsOpen(false);
    }
  };

  // 处理月份切换
  const handleMonthChange = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
  };

  // 获取下个月
  const getNextMonth = () => {
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    return nextMonth;
  };

  // 渲染日历
  const renderCalendar = (month: Date, isSecond = false) => {
    const dates = getMonthDates(month);
    const monthYear = `${month.getFullYear()}年 ${month.getMonth() + 1}月`;
    
    return (
      <div className="calendar">
        <div className="calendar-header">
          {!isSecond && (
            <Button 
              type="text" 
              size="small" 
              onClick={() => handleMonthChange('prev')}
            >
              ‹‹
            </Button>
          )}
          <span className="month-year">{monthYear}</span>
          {isSecond && (
            <Button 
              type="text" 
              size="small" 
              onClick={() => handleMonthChange('next')}
            >
              ››
            </Button>
          )}
        </div>
        
        <div className="weekdays">
          {['一', '二', '三', '四', '五', '六', '日'].map(day => (
            <div key={day} className="weekday">{day}</div>
          ))}
        </div>
        
        <div className="dates">
          {dates.map((date, index) => {
            const isCurrentMonth = date.getMonth() === month.getMonth();
            const isSelected = selectedDates.some(d => d && d.toDateString() === date.toDateString());
            const isStart = selectedDates[0] && selectedDates[0].toDateString() === date.toDateString();
            const isEnd = selectedDates[1] && selectedDates[1].toDateString() === date.toDateString();
            const inRange = isInRange(date);
            const inHoverRange = isInHoverRange(date);
            const isToday = new Date().toDateString() === date.toDateString();
            
            return (
              <div
                key={index}
                className={`date ${
                  !isCurrentMonth ? 'other-month' : ''
                } ${
                  isSelected ? 'selected' : ''
                } ${
                  isStart ? 'range-start' : ''
                } ${
                  isEnd ? 'range-end' : ''
                } ${
                  inRange ? 'in-range' : ''
                } ${
                  inHoverRange ? 'hover-range' : ''
                } ${
                  isToday ? 'today' : ''
                }`}
                onClick={() => handleDateClick(date)}
                onMouseEnter={() => setHoverDate(date)}
                onMouseLeave={() => setHoverDate(null)}
              >
                {date.getDate()}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="date-range-picker" ref={containerRef}>
      <div 
        className={`picker-input ${isOpen ? 'open' : ''} ${disabled ? 'disabled' : ''}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <input 
          type="text" 
          value={formatDate(selectedDates[0])}
          placeholder={placeholder[0]}
          readOnly
          disabled={disabled}
        />
        <span className="separator">-</span>
        <input 
          type="text" 
          value={formatDate(selectedDates[1])}
          placeholder={placeholder[1]}
          readOnly
          disabled={disabled}
        />
        <span className="calendar-icon">📅</span>
      </div>
      
      {isOpen && (
        <div className="picker-dropdown">
          <div className="calendars">
            {renderCalendar(currentMonth)}
            {renderCalendar(getNextMonth(), true)}
          </div>
          
          <div className="picker-footer">
            <Button 
              size="small" 
              onClick={() => {
                setSelectedDates([null, null]);
                onChange?.([null, null], [null, null]);
              }}
            >
              清除
            </Button>
            <Button 
              type="primary" 
              size="small"
              onClick={() => {
                const isoStrings: [string | null, string | null] = [
                  selectedDates[0]?.toISOString() || null,
                  selectedDates[1]?.toISOString() || null
                ];
                onChange?.(selectedDates, isoStrings);
                setIsOpen(false);
              }}
            >
              确定
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;

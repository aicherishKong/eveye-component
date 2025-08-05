import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Button } from 'antd';
import { LeftOutlined, RightOutlined, DoubleLeftOutlined, DoubleRightOutlined } from '@ant-design/icons';
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

  // 同步外部 value 变化
  useEffect(() => {
    if (value) {
      setSelectedDates(value);
    }
  }, [value]);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [selectingStart, setSelectingStart] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭弹窗和键盘事件处理
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // 验证日期是否有效
  const isValidDate = (date: any): date is Date => {
    return date instanceof Date && !isNaN(date.getTime());
  };

  // 格式化日期
  const formatDate = (date: Date | null): string => {
    if (!date || !isValidDate(date)) return '';
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
  const handleDateClick = useCallback((date: Date) => {
    if (disabled || !isValidDate(date)) return;
    
    if (selectingStart || !selectedDates[0]) {
      setSelectedDates([date, null]);
      setSelectingStart(false);
      setHoverDate(null);
    } else {
      const [start] = selectedDates;
      if (!start || !isValidDate(start)) {
        setSelectedDates([date, null]);
        setSelectingStart(false);
        return;
      }
      
      const newDates: [Date, Date] = start <= date ? [start, date] : [date, start];
      setSelectedDates(newDates);
      setSelectingStart(true);
      setHoverDate(null);
      
      // 转换为ISO字符串格式
      const isoStrings: [string, string] = [newDates[0].toISOString(), newDates[1].toISOString()];
      onChange?.(newDates, isoStrings);
      setIsOpen(false);
    }
  }, [disabled, selectingStart, selectedDates, onChange]);

  // 处理月份切换
  const handleMonthChange = useCallback((direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
  }, [currentMonth]);

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
            <>
              <Button 
                type="text" 
                size="small" 
                icon={<DoubleLeftOutlined />}
                onClick={() => {
                  const newMonth = new Date(currentMonth);
                  newMonth.setFullYear(newMonth.getFullYear() - 1);
                  setCurrentMonth(newMonth);
                }}
                aria-label="上一年"
                title="上一年"
              />
              <Button 
                type="text" 
                size="small" 
                icon={<LeftOutlined />}
                onClick={() => handleMonthChange('prev')}
                aria-label="上一月"
                title="上一月"
              />
            </>
          )}
          <span className="month-year">{monthYear}</span>
          {isSecond && (
            <>
              <Button 
                type="text" 
                size="small" 
                icon={<RightOutlined />}
                onClick={() => handleMonthChange('next')}
                aria-label="下一月"
                title="下一月"
              />
              <Button 
                type="text" 
                size="small" 
                icon={<DoubleRightOutlined />}
                onClick={() => {
                  const newMonth = new Date(currentMonth);
                  newMonth.setFullYear(newMonth.getFullYear() + 1);
                  setCurrentMonth(newMonth);
                }}
                aria-label="下一年"
                title="下一年"
              />
            </>
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
                role="button"
                tabIndex={isCurrentMonth ? 0 : -1}
                aria-label={`${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日${isToday ? ' 今天' : ''}${isSelected ? ' 已选择' : ''}${inRange ? ' 在范围内' : ''}`}
                aria-selected={isSelected}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleDateClick(date);
                  }
                }}
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
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label="选择日期范围"
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
      >
        <input 
          type="text" 
          value={formatDate(selectedDates[0])}
          placeholder={placeholder[0]}
          readOnly
          disabled={disabled}
          aria-label={placeholder[0]}
          tabIndex={-1}
        />
        <span className="separator" aria-hidden="true">-</span>
        <input 
          type="text" 
          value={formatDate(selectedDates[1])}
          placeholder={placeholder[1]}
          readOnly
          disabled={disabled}
          aria-label={placeholder[1]}
          tabIndex={-1}
        />
        <span className="calendar-icon" aria-hidden="true">📅</span>
      </div>
      
      {isOpen && (
        <div 
          className="picker-dropdown"
          role="dialog"
          aria-label="日期范围选择器"
          aria-modal="true"
        >
          <div className="calendars" role="application" aria-label="日历">
            {renderCalendar(currentMonth)}
            {renderCalendar(getNextMonth(), true)}
          </div>
          
          <div className="picker-footer">
            <Button 
              size="small" 
              onClick={() => {
                setSelectedDates([null, null]);
                setSelectingStart(true);
                setHoverDate(null);
                onChange?.([null, null], [null, null]);
              }}
              aria-label="清除选择的日期"
            >
              清除
            </Button>
            <Button 
              type="primary" 
              size="small"
              disabled={!selectedDates[0] || !selectedDates[1]}
              onClick={() => {
                if (selectedDates[0] && selectedDates[1] && isValidDate(selectedDates[0]) && isValidDate(selectedDates[1])) {
                  const isoStrings: [string, string] = [
                    selectedDates[0].toISOString(),
                    selectedDates[1].toISOString()
                  ];
                  onChange?.(selectedDates as [Date, Date], isoStrings);
                }
                setIsOpen(false);
              }}
              aria-label="确认选择的日期范围"
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

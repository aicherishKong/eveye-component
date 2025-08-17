import React from 'react';
import './index.css';

export interface ChartOption {
  id: string;
  label: string;
  visible: boolean;
}

export interface ChartSelectorProps {
  options: ChartOption[];
  onChange: (id: string, visible: boolean) => void;
}

const ChartSelector: React.FC<ChartSelectorProps> = ({ options, onChange }) => {
  return (
    <div className="chart-selector">
      {options.map((option) => (
        <div key={option.id} className="chart-option">
          <label className="chart-option-label">
            <input
              type="checkbox"
              checked={option.visible}
              onChange={(e) => onChange(option.id, e.target.checked)}
              className="chart-checkbox"
            />
            <span className="chart-label-text">{option.label}</span>
            <span className="chart-experiments">3 experiments</span>
            {option.visible && (
              <svg className="check-icon" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 12l2 2 4-4"
                  stroke="#10b981"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </label>
        </div>
      ))}
    </div>
  );
};

export default ChartSelector;
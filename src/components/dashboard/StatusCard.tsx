import React, { ReactNode } from 'react';

interface StatusCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  color: string;
  textColor: string;
}

const StatusCard: React.FC<StatusCardProps> = ({ title, value, icon, color, textColor }) => {
  return (
    <div className={`${color} rounded-lg shadow-sm p-6 transition-all duration-150`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className={`text-2xl font-semibold ${textColor} mt-2`}>{value}</p>
        </div>
        <div>{icon}</div>
      </div>
    </div>
  );
};

export default StatusCard;
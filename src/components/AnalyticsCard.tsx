import { LucideIcon } from "lucide-react";

interface AnalyticsCardProps {
  title: string;
  value: string | number;
  growth?: string;
  icon: LucideIcon;
  className?: string;
}

export function AnalyticsCard({
  title,
  value,
  growth,
  icon: Icon,
  className = "",
}: AnalyticsCardProps) {
  return (
    <div
      className={`p-5 rounded-xl border border-white/20 bg-white/10 backdrop-blur-md shadow-sm hover:shadow-lg transition-transform transform hover:scale-105 ${className}`}>
      <div className='flex justify-between items-center pb-2'>
        <h3 className='text-sm font-medium text-gray-700 dark:text-white/90'>
          {title}
        </h3>
        <Icon className='h-5 w-5 text-gray-600 dark:text-white/70' />
      </div>
      <div className='text-2xl font-bold text-gray-900 dark:text-white mt-1'>
        {value}
      </div>
      {growth && (
        <p className='text-xs text-gray-500 dark:text-gray-300 mt-1'>
          {growth}
        </p>
      )}
    </div>
  );
}

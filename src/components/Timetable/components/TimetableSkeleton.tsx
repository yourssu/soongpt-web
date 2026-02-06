import { range } from 'es-toolkit';
import { HTMLAttributes } from 'react';

import { timetableBaseDays } from '@/components/Timetable/hooks/useTimetableDayRange';
import { SLOT_HEIGHT } from '@/components/Timetable/type';
import {
  getGridTemplateCols,
  getGridTemplateRows,
} from '@/components/Timetable/utils/getTimetableGridStyle';
import { cn } from '@/utils/dom';

interface TimetableSkeletonProps extends HTMLAttributes<HTMLDivElement> {
  isSelected?: boolean;
}

export const TimetableSkeleton = ({
  className,
  isSelected = false,
  ...props
}: TimetableSkeletonProps) => {
  const times = range(9, 16 + 1); // 9시부터 16시까지

  const borderClass = className
    ?.split(' ')
    .filter((cls) => cls.startsWith('border') || cls.startsWith('!border'))
    .join(' ');

  return (
    <div className={cn('animate-pulse', className)} {...props}>
      <div
        className={cn(
          'mx-auto w-full max-w-[var(--timetable-max-width)] overflow-hidden rounded-[12px] border',
          isSelected ? 'border-brandPrimary' : 'border-neutralPlaceholder',
          borderClass,
        )}
      >
        {/* Header */}
        <div
          className={cn(
            'flex items-center justify-between px-[12px] py-[10px]',
            isSelected
              ? 'bg-brandPrimary text-white'
              : 'border-neutralPlaceholder border-b bg-white',
          )}
        >
          <div
            className={cn('h-[12px] w-[92px] rounded', isSelected ? 'bg-white/40' : 'bg-gray-200')}
          />
          <div
            className={cn(
              'h-[28px] w-[56px] rounded-[8px]',
              isSelected ? 'bg-white/40' : 'bg-gray-200',
            )}
          />
        </div>

        {/* Timetable Grid */}
        <div
          className="divide-neutralPlaceholder grid bg-white"
          style={{
            gridTemplateColumns: getGridTemplateCols(timetableBaseDays.length),
            gridTemplateRows: getGridTemplateRows(times.length),
          }}
        >
          {/* Days Header */}
          <div
            className="border-neutralPlaceholder col-span-full grid border-b-1 bg-white"
            style={{ gridTemplateColumns: getGridTemplateCols(timetableBaseDays.length) }}
          >
            <div className="border-neutralPlaceholder border-1 bg-white" />
            {timetableBaseDays.map((day) => (
              <div
                className="border-neutralPlaceholder flex items-center justify-center border-r-1 px-[2px] py-[8px] text-[12px] leading-[12px] font-medium tracking-[-0.24px] last:border-r-0"
                key={day}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Time Slots */}
          {times.map((time) => (
            <div
              className="border-neutralPlaceholder col-span-full grid border-b-1 last:border-b-0"
              key={time}
              style={{ gridTemplateColumns: getGridTemplateCols(timetableBaseDays.length) }}
            >
              <div className="border-neutralPlaceholder flex items-center justify-center border-r-1 bg-white px-[2px] py-[8px] text-[12px] leading-[12px] font-medium tracking-[-0.24px]">
                {time}
              </div>
              {timetableBaseDays.map((day) => (
                <div
                  className="border-neutralPlaceholder relative border-r-1 bg-white last:border-r-0"
                  key={`${time}-${day}`}
                >
                  {/* Random Skeleton Blocks */}
                  {Math.random() > 0.8 && (
                    <div
                      className="absolute w-full bg-gray-200"
                      style={{
                        height: `${Math.floor(Math.random() * 2 + 1) * SLOT_HEIGHT * 12}px`,
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

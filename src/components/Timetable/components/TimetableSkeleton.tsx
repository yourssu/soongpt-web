import { range } from 'es-toolkit';
import { HTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

import { timetableBaseDays } from '@/components/Timetable/hooks/useTimetableDayRange';
import { SLOT_HEIGHT } from '@/components/Timetable/type';
import {
  getGridTemplateCols,
  getGridTemplateRows,
} from '@/components/Timetable/utils/getTimetableGridStyle';

const DefaultSkeltonHeader = () => {
  return (
    <div className="flex items-center justify-between bg-gray-200 px-5 py-2.5">
      <div className="h-6 w-40 rounded bg-gray-300" />
      <div className="h-6 w-16 rounded bg-gray-300" />
    </div>
  );
};

export const TimetableSkeleton = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => {
  const times = range(9, 16 + 1); // 9시부터 16시까지

  const borderClass = className
    ?.split(' ')
    .filter((cls) => cls.startsWith('border') || cls.startsWith('!border'))
    .join(' ');

  return (
    <div className={`transform-gpu animate-pulse ${twMerge(className)}`} {...props}>
      <div
        className={`border-neutralPlaceholder overflow-hidden rounded-xl border-2 ${twMerge(borderClass)}`}
      >
        {/* Header */}
        <DefaultSkeltonHeader />

        {/* Timetable Grid */}
        <div
          className="divide-neutralPlaceholder grid"
          style={{
            gridTemplateColumns: getGridTemplateCols(timetableBaseDays.length),
            gridTemplateRows: getGridTemplateRows(times.length),
          }}
        >
          {/* Days Header */}
          <div className="border-neutralPlaceholder col-span-full grid grid-cols-subgrid border-b-1">
            <div className="border-neutralPlaceholder border-r-1" />
            {timetableBaseDays.map((day) => (
              <div
                className="border-neutralPlaceholder flex items-center justify-center border-r-1 text-xs font-light last:border-r-0"
                key={day}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Time Slots */}
          {times.map((time) => (
            <div
              className="border-neutralPlaceholder col-span-full grid grid-cols-subgrid border-b-1 last:border-b-0"
              key={time}
            >
              <div className="border-neutralPlaceholder flex justify-end border-r-1 p-0.5 text-xs font-light">
                {time}
              </div>
              {timetableBaseDays.map((day) => (
                <div
                  className="border-neutralPlaceholder relative border-r-1 last:border-r-0"
                  key={`${time}-${day}`}
                >
                  {/* Random Skeleton Blocks */}
                  {Math.random() > 0.8 && (
                    <div
                      className="absolute w-full rounded-lg bg-gray-200"
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

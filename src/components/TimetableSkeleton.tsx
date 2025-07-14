import { ElementType, HTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

import { getGridTemplateCols, getGridTemplateRows, SLOT_HEIGHT } from './Timetable';

interface TimetableSkeletonHeaderProps extends HTMLAttributes<HTMLDivElement> {
  as?: ElementType;
}

const DefaultSkeltonHeader = () => {
  return (
    <div className="flex items-center justify-between bg-gray-200 px-5 py-2.5">
      <div className="h-6 w-40 rounded bg-gray-300" />
      <div className="h-6 w-16 rounded bg-gray-300" />
    </div>
  );
};

const SharingSkeletonHeader = () => {
  return (
    <div className={`relative h-6 bg-white`}>
      <div
        className={`absolute top-0 left-1/2 flex h-6 w-32 -translate-x-1/2 items-center rounded-b-xl bg-gray-300`}
      />
    </div>
  );
};

const TimetableSkeletonHeader = ({
  as: Header = DefaultSkeltonHeader,
  ...props
}: TimetableSkeletonHeaderProps) => {
  return <Header {...props} />;
};

export const TemplateSkeleton = () => {
  return (
    <div className="w-full px-5">
      <div className="w-full overflow-hidden rounded-xl bg-gray-200 px-6 py-16">
        <div className="rounded-xl bg-gray-300 px-3 py-2">
          <TimetableSkeleton className="!border-0 bg-white">
            <TimetableSkeleton.Header as={SharingSkeletonHeader} />
          </TimetableSkeleton>

          {/* Student Info Skeleton */}
          <div className="mt-1.5 pl-2">
            <div className="h-4 w-16 rounded bg-gray-200" />
            <div className="mt-1 h-3 w-24 rounded bg-gray-200" />
          </div>

          {/* Credits Skeleton */}
          <div className="mt-1.5 flex items-center justify-between px-2">
            <div className="h-4 w-20 rounded-xl bg-gray-200" />
            <div className="h-4 w-20 rounded-xl bg-gray-200" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const TimetableSkeleton = ({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => {
  const days = ['월', '화', '수', '목', '금'];
  const times = Array.from({ length: 8 }, (_, i) => i + 9); // 9시부터 16시까지

  const borderClass = className
    ?.split(' ')
    .filter((cls) => cls.startsWith('border') || cls.startsWith('!border'))
    .join(' ');

  return (
    <div className={`transform-gpu animate-pulse ${twMerge(className)}`} {...props}>
      <div
        className={`border-placeholder overflow-hidden rounded-xl border-2 ${twMerge(borderClass)}`}
      >
        {/* Header */}
        {children}

        {/* Timetable Grid */}
        <div
          className="divide-placeholder grid"
          style={{
            gridTemplateColumns: getGridTemplateCols(days.length),
            gridTemplateRows: getGridTemplateRows(times.length),
          }}
        >
          {/* Days Header */}
          <div className="border-placeholder col-span-full grid grid-cols-subgrid border-b-1">
            <div className="border-placeholder border-r-1" />
            {days.map((day) => (
              <div
                className="border-placeholder flex items-center justify-center border-r-1 text-xs font-light last:border-r-0"
                key={day}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Time Slots */}
          {times.map((time) => (
            <div
              className="border-placeholder col-span-full grid grid-cols-subgrid border-b-1 last:border-b-0"
              key={time}
            >
              <div className="border-placeholder flex justify-end border-r-1 p-0.5 text-xs font-light">
                {time}
              </div>
              {days.map((day) => (
                <div
                  className="border-placeholder relative border-r-1 last:border-r-0"
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

TimetableSkeleton.Header = TimetableSkeletonHeader;

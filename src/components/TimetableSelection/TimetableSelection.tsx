import TimetableSelectionView from './TimetableSelectionView.tsx';
import Timetable from '../Timetable.tsx';
import { useRef, useState } from 'react';
import { useFlow } from '../../stackflow.ts';
import { Mixpanel } from '../../utils/mixpanel.ts';
import { useTimetables } from '../../hooks/useTimetables.ts';

const TimetableSelection = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const timetables = useTimetables();

  const { push } = useFlow();

  const timetableRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleTimetableClick = (index: number) => {
    setSelectedIndex(index);
    timetableRefs.current[index]?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  };

  const handleNextClick = () => {
    const selectedTimetable = timetables[selectedIndex];
    const unSelectedTimetable = timetables.filter(
      (timetable) => timetable.timetableId !== selectedTimetable.timetableId,
    );

    // Mixpanel 이벤트 추적
    Mixpanel.trackTimetableSelectionClick(selectedTimetable, unSelectedTimetable);

    push('TimetableSharingActivity', {
      timetableId: selectedTimetable.timetableId,
    });
  };

  return (
    <TimetableSelectionView
      title={'사용자님을 위한\n시간표를 가져왔어요!'}
      buttonText={'이 시간표가 좋아요'}
      buttonDisabled={false}
      handleNextClick={handleNextClick}
      element={
        <>
          {timetables.map((timetable, index) => (
            <div
              key={timetable.timetableId}
              className="pt-4 first:pt-0"
              data-index={index}
              ref={(element) => {
                {
                  /* div 요소가 마운트 될 때 실행*/
                }
                timetableRefs.current[index] = element;
              }}
              onClick={() => handleTimetableClick(index)}
            >
              <Timetable
                timetable={timetable}
                className={`${
                  index === selectedIndex ? 'border-primary' : 'border-placeholder'
                } transition-colors duration-300`}
              >
                <Timetable.Header
                  className={`${
                    index === selectedIndex
                      ? 'bg-primary text-white'
                      : 'border-placeholder border-b-1'
                  } transition-colors duration-300`}
                />
              </Timetable>
            </div>
          ))}
        </>
      }
    />
  );
};

export default TimetableSelection;

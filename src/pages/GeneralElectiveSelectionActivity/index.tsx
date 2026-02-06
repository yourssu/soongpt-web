import { useFlow } from '@stackflow/react/future';
import { useMemo, useState } from 'react';

import { ActivityLayout } from '@/components/ActivityLayout';
import { ProgressAppBar } from '@/components/AppBar/ProgressAppBar';
import { BottomSheet, BottomSheetState } from '@/components/BottomSheet';
import { SelectableChip } from '@/components/Chip/SelectableChip';
import { CourseList } from '@/components/CourseItem/CourseList';
import { useSelectedTimetableContext } from '@/components/Providers/SelectedTimetableProvider/hook';
import { useAssertedStudentInfoContext } from '@/components/Providers/StudentInfoProvider/hook';
import { Timetable } from '@/components/Timetable';
import { GeneralElectiveProgressText } from '@/pages/GeneralElectiveSelectionActivity/components/GeneralElectiveProgressText';
import { useSuspenseGetGeneralElectiveCourses } from '@/pages/GeneralElectiveSelectionActivity/hooks/useSuspenseGetGeneralElectiveCourses';
import { useSuspenseGetGeneralElectiveProgress } from '@/pages/GeneralElectiveSelectionActivity/hooks/useSuspenseGetGeneralElectiveProgress';
import { CourseType } from '@/schemas/courseSchema';
import { FLOW_PROGRESS } from '@/stackflow/progress';
import {
  GENERAL_ELECTIVE_FIELDS_AFTER_23,
  GENERAL_ELECTIVE_FIELDS_BEFORE_22,
} from '@/types/general';
import { isSameCourseCode } from '@/utils/course';
import { mergeTimetableCourses, toTimetableCourse } from '@/utils/timetableSelection';

const getCourseField = (course: CourseType) => course.field ?? '';

const getScheduleText = (scheduleRoom: string) => {
  if (!scheduleRoom) {
    return '';
  }

  const first = scheduleRoom.split('\n')[0];
  const match = first.match(/(월|화|수|목|금|토)\s*(\d{1,2}:\d{2})-(\d{1,2}:\d{2})/);

  if (match) {
    return `${match[1]} ${match[2]} ~ ${match[3]}`;
  }

  return first.replace('-', ' ~ ');
};

export const GeneralElectiveSelectionActivity = () => {
  const { push } = useFlow();
  const { schoolId } = useAssertedStudentInfoContext();
  const isAfter23 = schoolId >= 23;
  const { selectedTimetable, selectedGeneralElectives, setSelectedGeneralElectives } =
    useSelectedTimetableContext();

  const courses = useSuspenseGetGeneralElectiveCourses();
  const progress = useSuspenseGetGeneralElectiveProgress();

  const chipValues = isAfter23
    ? GENERAL_ELECTIVE_FIELDS_AFTER_23
    : GENERAL_ELECTIVE_FIELDS_BEFORE_22;

  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [sheetState, setSheetState] = useState<BottomSheetState>('peek');

  const filteredCourses = useMemo(() => {
    if (selectedFields.length === 0) {
      return courses;
    }

    return courses.filter((course) => selectedFields.includes(getCourseField(course)));
  }, [courses, selectedFields]);

  const handleChipClick = (value: string, selected: boolean) => {
    if (selected) {
      setSelectedFields((prev) => [...prev, value]);
    } else {
      setSelectedFields((prev) => prev.filter((item) => item !== value));
    }
  };

  const handleCourseSelect = (course: CourseType) => {
    setSelectedGeneralElectives((prev) => {
      const exists = prev.some((item) => isSameCourseCode(item.code, course.code));
      if (exists) {
        return prev.filter((item) => !isSameCourseCode(item.code, course.code));
      }
      return [...prev, toTimetableCourse(course)];
    });
  };

  const previewTimetableData = useMemo(() => {
    if (!selectedTimetable) {
      return null;
    }
    return mergeTimetableCourses(selectedTimetable, selectedGeneralElectives);
  }, [selectedGeneralElectives, selectedTimetable]);

  const isSheetOpen = sheetState === 'open';

  return (
    <ActivityLayout>
      <ActivityLayout.ScrollArea
        className="bg-[#f9f9f9]"
        onScroll={(event) => {
          const target = event.currentTarget;
          if (target.scrollTop > 24 && !isSheetOpen) {
            setSheetState('open');
          }
        }}
      >
        <ActivityLayout.Header>
          <ProgressAppBar progress={FLOW_PROGRESS.general_elective_selection} />
          <div className="mt-6 flex w-full flex-col gap-4">
            <h2 className="text-[28px]/[normal] font-semibold">
              26-1에 이수할
              <br />
              교양선택 과목을 담아주세요!
            </h2>
            <GeneralElectiveProgressText progress={progress} />
          </div>
        </ActivityLayout.Header>

        <ActivityLayout.Body className="gap-6 pt-6 pb-[140px]">
          <div className="flex w-full justify-center">
            <div className="w-[303px]">
              {previewTimetableData ? (
                <Timetable
                  tagPointOverride={21}
                  tagTitleOverride="시간표 이름"
                  timetable={previewTimetableData}
                />
              ) : null}
            </div>
          </div>
        </ActivityLayout.Body>
      </ActivityLayout.ScrollArea>

      <BottomSheet
        className="max-h-[60dvh] bg-[#f9f9f9]"
        onStateChange={setSheetState}
        state={sheetState}
      >
        <BottomSheet.Header className="gap-2">
          <div className="flex items-center gap-2">
            <span className="bg-brandPrimary inline-block size-3 rounded-full" />
            <span className="text-xl font-semibold">교양선택 과목</span>
          </div>
        </BottomSheet.Header>

        <BottomSheet.Body>
          <div className="flex flex-wrap justify-center gap-1.5">
            {chipValues.map((value) => {
              const selected = selectedFields.includes(value);
              return (
                <SelectableChip
                  className={
                    selected
                      ? 'border-brandPrimary text-brandPrimary border bg-white px-[14px] py-[10px] text-[12px]'
                      : 'border-neutralPlaceholder text-neutralPlaceholder border bg-white px-[14px] py-[10px] text-[12px]'
                  }
                  key={value}
                  onSelectChange={(nextSelected) => handleChipClick(value, nextSelected)}
                  selected={selected}
                >
                  {value}
                </SelectableChip>
              );
            })}
          </div>

          <CourseList
            courses={filteredCourses}
            isSelected={(course) =>
              selectedGeneralElectives.some((item) => isSameCourseCode(item.code, course.code))
            }
            itemClassName="rounded-[20px] border-2 bg-white px-4 py-4"
            listClassName="gap-3"
            onToggle={handleCourseSelect}
            renderDescription={(course) => (
              <span className="text-black">{getScheduleText(course.scheduleRoom)}</span>
            )}
            renderExtraBadge={(course) => {
              const fieldBadge = course.subCategory ?? course.field ?? '';
              if (!fieldBadge) {
                return null;
              }
              return (
                <div className="text-neutral flex h-6 items-center rounded-lg bg-[#eaeaea] px-2 text-[12px]/[18px]">
                  {fieldBadge}
                </div>
              );
            }}
          />
        </BottomSheet.Body>

        <BottomSheet.Footer className="pt-4">
          <button
            className="bg-brandPrimary w-full rounded-2xl py-3.5 font-semibold text-white"
            onClick={() =>
              push('chapel_selection', { timetableId: selectedTimetable?.timetableId })
            }
            type="button"
          >
            채플 담으러 가기
          </button>
        </BottomSheet.Footer>
      </BottomSheet>
    </ActivityLayout>
  );
};

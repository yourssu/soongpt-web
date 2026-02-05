import { motion } from 'motion/react';
import { useContext, useMemo, useState } from 'react';

import { Mixpanel } from '@/bootstrap/mixpanel';
import { SelectableChip } from '@/components/Chip/SelectableChip';
import { RemovableCourseListItem } from '@/components/CourseItem/RemovableCourseItem';
import { useFilteredCoursesByCategory } from '@/hooks/course/useFilteredCoursesByCategory';
import { useReceive } from '@/hooks/stackflow/compat-await-push-hooks';
import { useAlertDialog } from '@/hooks/useAlertDialog';
import { CourseSelectionLayout } from '@/pages/CourseSelectionActivity/components/CourseSelectionLayout';
import { BaseStepProps } from '@/pages/CourseSelectionActivity/components/CourseSelectionSteps/type';
import { SelectedCoursesContext } from '@/pages/CourseSelectionActivity/context';
import { CourseType } from '@/schemas/courseSchema';
import { isSameCourse } from '@/utils/course';

type SelectionTabType = '교양' | '기타' | '전공';
type CourseSelectionResultStepProps = BaseStepProps;

export const CourseSelectionResultStep = ({ onNextClick }: CourseSelectionResultStepProps) => {
  const { pushAndReceive } = useReceive();
  const openRemoveAlertDialog = useAlertDialog();
  const [selectionTab, setSelectionTab] = useState<SelectionTabType>('교양');
  const { selectedCourses, selectedCredit, setSelectedCourses } =
    useContext(SelectedCoursesContext);
  const filteredCoursesByCategory = useFilteredCoursesByCategory(selectedCourses);
  const filteredCoursesBySelectionTab = useMemo(() => {
    if (selectionTab === '교양') {
      return [...filteredCoursesByCategory.GENERAL_REQUIRED];
    }
    return [
      ...filteredCoursesByCategory.RETAKE,
      ...filteredCoursesByCategory.MAJOR_PREREQUISITE,
      ...filteredCoursesByCategory.MAJOR_REQUIRED,
      ...filteredCoursesByCategory.MAJOR_ELECTIVE,
      ...filteredCoursesByCategory.DOUBLE_MAJOR,
      ...filteredCoursesByCategory.MINOR,
      ...filteredCoursesByCategory.TEACHING_CERTIFICATE,
      ...filteredCoursesByCategory.OTHER,
    ];
  }, [filteredCoursesByCategory, selectionTab]);

  const onSearchButtonClick = async () => {
    Mixpanel.trackCourseSearchClick();

    const result = await pushAndReceive('course_search', {
      selectedCourseCodes: selectedCourses.map((course) => course.code),
      totalSelectedPoints: selectedCredit,
    });

    if (result.success) {
      const { course, actionType } = result.data;
      if (actionType === '추가') {
        const newCourse = { ...course, selectedBySearch: true };
        setSelectedCourses((prev) => [...prev, newCourse]);
        Mixpanel.trackSearchCourseAddConfirmClick(course.name);
      } else {
        setSelectedCourses((prev) => prev.filter((c) => !isSameCourse(c, course)));
      }
    }
  };

  const onRemoveCourse = async (course: CourseType) => {
    const accepted = await openRemoveAlertDialog({
      title: '선택한 과목을 삭제할까요?',
      closeButton: false,
      closeableWithOutside: true,
      content: (
        <ul>
          <li>
            <span className="px-2">•</span>
            <span>{course.name}</span>
          </li>
        </ul>
      ),
      primaryButtonText: '네',
      secondaryButtonText: '아니요',
    });

    if (accepted) {
      Mixpanel.trackCourseDeleteConfirmClick(course.name);
      setSelectedCourses((prev) => prev.filter((c) => !isSameCourse(c, course)));
    }
  };

  return (
    <CourseSelectionLayout>
      <CourseSelectionLayout.Header
        description={
          '* 선택된 과목들로 시간표 추천이 이루어질 예정이에요.\n필수로 수강하고 싶은 과목이 있으면 지금 추가해주세요!'
        }
        progress={100}
        title={'지금까지 선택한\n교양/전공 과목들이에요.'}
      />

      <CourseSelectionLayout.Body>
        <div className="flex items-center gap-1">
          <SelectableChip
            onSelectChange={() => setSelectionTab('교양')}
            selected={selectionTab === '교양'}
          >
            교양
          </SelectableChip>
          <SelectableChip
            onSelectChange={() => setSelectionTab('전공')}
            selected={selectionTab === '전공'}
          >
            전공
          </SelectableChip>
        </div>

        <motion.div
          animate={{ y: 0, opacity: 1 }}
          className="flex-[1_1_0]"
          initial={{ y: 20, opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <div className="flex size-full flex-col gap-3.5">
            {filteredCoursesBySelectionTab.length ? (
              filteredCoursesBySelectionTab.map((course) => (
                <RemovableCourseListItem
                  course={course}
                  key={course.code}
                  onClickRemove={() => {
                    Mixpanel.trackCourseDeleteClick(course.name);
                    onRemoveCourse(course);
                  }}
                />
              ))
            ) : (
              <div className="bg-bg-layerDefault flex size-full items-center justify-center rounded-xl">
                <span className="text-neutralHint text-2xl font-semibold">
                  선택된 과목이 없어요
                </span>
              </div>
            )}
          </div>
        </motion.div>
      </CourseSelectionLayout.Body>

      <CourseSelectionLayout.Footer
        primaryButtonProps={{ children: '시간표 만들기', onClick: onNextClick }}
        secondaryButtonProps={{
          children: '과목 추가',
          onClick: onSearchButtonClick,
        }}
        selectedCredit={selectedCredit}
      />
    </CourseSelectionLayout>
  );
};

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
      return [
        ...filteredCoursesByCategory.GENERAL_REQUIRED,
        ...filteredCoursesByCategory.GENERAL_ELECTIVE,
      ];
    }
    return [
      ...filteredCoursesByCategory.MAJOR_REQUIRED,
      ...filteredCoursesByCategory.MAJOR_ELECTIVE,
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
          '시간표는 이 과목들을 기준으로 추천돼요.\n복수/부전공 등 필요한 과목을 모두 추가해주세요!'
        }
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
        primaryButtonProps={{ children: '다 선택했어요', onClick: onNextClick }}
        secondaryButtonProps={{
          children: '과목 추가 할래요',
          onClick: onSearchButtonClick,
        }}
        selectedCredit={selectedCredit}
      />
    </CourseSelectionLayout>
  );
};

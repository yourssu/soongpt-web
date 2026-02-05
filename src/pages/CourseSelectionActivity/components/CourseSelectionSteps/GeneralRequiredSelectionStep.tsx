import { motion } from 'motion/react';
import { useContext, useState } from 'react';

import { SelectableCourseItem } from '@/components/CourseItem/SelectableCourseItem';
import { useCombinedCourses } from '@/hooks/course/useCombinedCourses';
import { useGroupedCoursesByField } from '@/hooks/course/useGroupedCoursesByField';
import { ArrayState, useGetArrayState } from '@/hooks/useGetArrayState';
import { CourseSelectionLayout } from '@/pages/CourseSelectionActivity/components/CourseSelectionLayout';
import {
  BaseStepProps,
  StepContentType,
} from '@/pages/CourseSelectionActivity/components/CourseSelectionSteps/type';
import { SelectedCoursesContext } from '@/pages/CourseSelectionActivity/context';
import { useSuspenseGetCourses } from '@/pages/CourseSelectionActivity/hooks/useSuspenseGetCourses';
import { CourseType } from '@/schemas/courseSchema';
import { isSameCourse } from '@/utils/course';

type GeneralRequiredSelectionStepProps = BaseStepProps;

const GeneralRequiredCourseFieldGroup = ({
  courses,
  title,
}: {
  courses: CourseType[];
  title: string;
}) => {
  const { setSelectedCourses } = useContext(SelectedCoursesContext);
  const [selectedGroupCourse, setSelectedGroupCourse] = useState<CourseType | null>(null);

  const nameWithoutFieldCourses = courses.map((course) => ({
    ...course,
    name: course.name.replace(/\[.*?\]/g, ''),
  }));

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="text-base font-semibold">[{title}]</div>
      {nameWithoutFieldCourses.map((course) => {
        const isSelected = !!selectedGroupCourse && isSameCourse(selectedGroupCourse, course);
        const hasAnySelectedInGroup = selectedGroupCourse !== null;

        const handleClickCourseItem = () => {
          const unSelectCourse = (course: CourseType) => {
            setSelectedCourses((prev) => prev.filter((c) => !isSameCourse(c, course)));
            setSelectedGroupCourse(null);
          };

          const selectCourse = (course: CourseType) => {
            setSelectedCourses((prev) => [...prev, course]);
            setSelectedGroupCourse(course);
          };

          if (isSelected) {
            unSelectCourse(course);
            return;
          }

          if (hasAnySelectedInGroup) {
            unSelectCourse(selectedGroupCourse);
            selectCourse(course);
            return;
          }

          selectCourse(course);
        };

        return (
          <SelectableCourseItem
            course={course}
            isSelected={isSelected}
            key={course.code}
            onClickCourseItem={handleClickCourseItem}
          />
        );
      })}
    </div>
  );
};

// Todo: 컴포넌트 분리 리팩토링
const GeneralRequiredCoursesList = ({ courses }: { courses: CourseType[] }) => {
  const groupedCourses = useGroupedCoursesByField(useCombinedCourses(courses));
  const fieldTitles = Object.keys(groupedCourses);

  return (
    <motion.div
      animate={{ y: 0, opacity: 1 }}
      initial={{ y: 20, opacity: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div className="flex flex-1 flex-col gap-4">
        {fieldTitles.map((fieldTitle) => {
          const courses = groupedCourses[fieldTitle];
          return (
            <GeneralRequiredCourseFieldGroup
              courses={courses}
              key={fieldTitle}
              title={fieldTitle}
            />
          );
        })}
      </div>
    </motion.div>
  );
};

export const GeneralRequiredSelectionStep = ({
  onNextClick,
}: GeneralRequiredSelectionStepProps) => {
  const courses = useSuspenseGetCourses('GENERAL_REQUIRED');
  const courseState = useGetArrayState(courses);
  const { selectedCredit } = useContext(SelectedCoursesContext);

  const { description, image, primaryButtonText, title } = contentMap[courseState];

  return (
    <CourseSelectionLayout>
      <CourseSelectionLayout.Header description={description} progress={89} title={title} />

      {image ? (
        <CourseSelectionLayout.ImageBody image={image} />
      ) : (
        <CourseSelectionLayout.Body>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1.5">
              <span className="bg-brandPrimary inline-block size-2.5 rounded-full" />
              <span className="text-[20px] font-semibold">교양필수 과목</span>
            </div>
            {/* TODO: CORE 학점 정보를 API에서 가져와서 아래 숫자를 동적으로 표시 */}
            <div className="flex flex-col gap-0.5 text-sm font-light">
              <div>
                {'* CORE 창의력 '}
                <span className="font-semibold">0학점 중 0학점</span>
                {' 이수했어요.'}
              </div>
              <div>
                {'* CORE 품격 '}
                <span className="font-semibold">0학점 중 0학점</span>
                {' 이수했어요.'}
              </div>
              <div>
                {'* CORE 디지털테크놀로지 '}
                <span className="font-semibold">0학점 중 0학점</span>
                {' 이수했어요.'}
              </div>
            </div>
          </div>

          <GeneralRequiredCoursesList courses={courses} />
        </CourseSelectionLayout.Body>
      )}

      <CourseSelectionLayout.Footer
        primaryButtonProps={{ children: primaryButtonText, onClick: onNextClick }}
        selectedCredit={selectedCredit}
      />
    </CourseSelectionLayout>
  );
};

const contentMap: Record<ArrayState, StepContentType> = {
  FILLED: {
    title: '이번 학기에 이수할\n교양필수 과목을 담아주세요!',
    primaryButtonText: '담은 과목 확인하러 가기',
  },
  EMPTY: {
    title: '이번 학기에 이수할\n교양필수 과목이 없어요.',
    image: '/images/like.webp',
    primaryButtonText: '담은 과목 확인하러 가기',
  },
};

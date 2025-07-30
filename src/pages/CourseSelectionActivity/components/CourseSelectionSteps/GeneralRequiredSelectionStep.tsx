import { motion } from 'motion/react';
import { useContext, useState } from 'react';

import { SelectableCourseItem } from '@/components/CourseItem/SelectableCourseItem';
import { useCombinedCourses } from '@/hooks/useCombinedCourses';
import { ArrayState, useGetArrayState } from '@/hooks/useGetArrayState';
import { CourseSelectionLayout } from '@/pages/CourseSelectionActivity/components/CourseSelectionLayout';
import {
  BaseStepProps,
  StepContentType,
} from '@/pages/CourseSelectionActivity/components/CourseSelectionSteps/type';
import { SelectedCoursesContext } from '@/pages/CourseSelectionActivity/context';
import { useGroupCoursesByField } from '@/pages/CourseSelectionActivity/hooks/useGroupCoursesByField';
import { useSuspenseGetCourses } from '@/pages/CourseSelectionActivity/hooks/useSuspenseGetCourses';
import { Course } from '@/schemas/courseSchema';

type GeneralRequiredSelectionStepProps = BaseStepProps;

const GeneralRequiredCourseFieldGroup = ({
  courses,
  title,
}: {
  courses: Course[];
  title: string;
}) => {
  const { setSelectedCourses } = useContext(SelectedCoursesContext);
  const [selectedCode, setSelectedCode] = useState<null | number>(null);

  const nameWithoutFieldCourses = courses.map((course) => ({
    ...course,
    name: course.name.replace(/\[.*?\]/g, ''),
  }));

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="text-sm">[{title}]</div>
      {nameWithoutFieldCourses.map((course) => {
        const isSelected = selectedCode === course.code;

        const handleClickCourseItem = () => {
          if (isSelected) {
            setSelectedCourses((prev) => prev.filter((c) => c.code !== course.code));
            setSelectedCode(null);
          } else {
            setSelectedCourses((prev) => [...prev, course]);
            setSelectedCode(course.code);
          }
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
const GeneralRequiredCoursesList = ({ courses }: { courses: Course[] }) => {
  const groupedCourses = useGroupCoursesByField(useCombinedCourses(courses));
  const fieldTitles = Object.keys(groupedCourses);

  return (
    <motion.div
      animate={{ y: 0, opacity: 1 }}
      initial={{ y: 20, opacity: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div className="flex flex-1 flex-col gap-5">
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
      <CourseSelectionLayout.Header description={description} title={title} />

      {image ? (
        <CourseSelectionLayout.ImageBody image={image} />
      ) : (
        <CourseSelectionLayout.Body>
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
    title: '이번 학기에 이수해야 하는\n교양필수과목이에요.',
    description: '잘못되었다면 이수할 과목만 선택해주세요!',
    primaryButtonText: '확인했어요',
  },
  EMPTY: {
    title: '이번 학기에 이수해야 하는\n교양필수과목이 없어요.',
    image: '/images/like.webp',
    primaryButtonText: '확인했어요',
  },
};

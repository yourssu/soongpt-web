import { Suspense, useContext, useMemo, useState } from 'react';
import { SwitchCase, useInputState } from 'react-simplikit';

import { SelectableChip } from '@/components/Chip/SelectableChip';
import { IcMonoSearch } from '@/components/Icons/IcMonoSearch';
import { useAssertedStudentInfoContext } from '@/components/Providers/StudentInfoProvider/hook';
import { useCombinedCourses } from '@/hooks/course/useCombinedCourses';
import { useDelayedValue } from '@/hooks/useDelayedValue';
import { ArrayState, useGetArrayState } from '@/hooks/useGetArrayState';
import { CourseSelectionLayout } from '@/pages/CourseSelectionActivity/components/CourseSelectionLayout';
import { CourseSelectionList } from '@/pages/CourseSelectionActivity/components/CourseSelectionList';
import { CourseBySelectedGradesEmpty } from '@/pages/CourseSelectionActivity/components/CourseSelectionSteps/CourseBySelectedGradesEmpty';
import {
  BaseStepProps,
  StepContentType,
} from '@/pages/CourseSelectionActivity/components/CourseSelectionSteps/type';
import GradeChip from '@/pages/CourseSelectionActivity/components/GradeChip';
import { SelectedCoursesContext } from '@/pages/CourseSelectionActivity/context';
import { useSuspenseGetCourses } from '@/pages/CourseSelectionActivity/hooks/useSuspenseGetCourses';
import { useSuspenseGetMajorElectives } from '@/pages/CourseSelectionActivity/hooks/useSuspenseGetMajorElectives';
import { useSuspenseGetOtherMajorElectives } from '@/pages/CourseSelectionActivity/hooks/useSuspenseGetOtherMajorElectives';
import { SelectedCourseType } from '@/pages/CourseSelectionActivity/type';
import { CourseType } from '@/schemas/courseSchema';
import { StudentGrade } from '@/types/student';

type MajorElectiveSelectionStepProps = BaseStepProps;

const MajorElectiveContent = ({ selectedGrades }: { selectedGrades: StudentGrade[] }) => {
  const { grade } = useAssertedStudentInfoContext();
  const [searchKeyword, setSearchKeyword] = useInputState('');
  const delayedSearchKeyword = useDelayedValue(searchKeyword);

  const filteredMajorElectivesByGrade = useSuspenseGetMajorElectives(selectedGrades);
  const combinedCourses = useCombinedCourses(filteredMajorElectivesByGrade);
  const searchedCombinedCourses = useMemo(() => {
    if (delayedSearchKeyword === '') {
      return combinedCourses;
    }
    const preprocessKeyword = (keyword: string) => keyword.toLowerCase().replace(/\s+/g, '');
    const matchKeyword = ({ name, professor }: CourseType) => {
      const nameMatched = preprocessKeyword(name).includes(preprocessKeyword(delayedSearchKeyword));
      const professorMatched = professor.some((p) =>
        preprocessKeyword(p).includes(preprocessKeyword(delayedSearchKeyword)),
      );
      return nameMatched || professorMatched;
    };
    return combinedCourses.filter(matchKeyword);
  }, [combinedCourses, delayedSearchKeyword]);

  const combinedCoursesState = useGetArrayState(combinedCourses);

  const parseSelectedCourseOnPush = (course: CourseType): SelectedCourseType => {
    if (!selectedGrades.includes(grade)) {
      return { ...course, fromOtherGrade: true };
    }
    return course;
  };

  return (
    <>
      <div className="bg-background sticky top-[183px] flex flex-col gap-3 pb-3">
        <div className="bg-bg-layerDefault sticky top-0 flex w-full items-center rounded-xl">
          <div className="py-2 pl-3">
            <IcMonoSearch className="text-brandPrimary" size={18} />
          </div>
          <input
            className="grow px-3 py-2 outline-0"
            onChange={setSearchKeyword}
            placeholder={`${selectedGrades[0] >= 4 ? '4학년 이상' : `${selectedGrades.join(',')}학년`} 전공선택과목`}
            type="text"
            value={searchKeyword}
          />
        </div>
      </div>
      <SwitchCase
        caseBy={{
          FILLED: () => (
            <CourseSelectionList
              courses={searchedCombinedCourses}
              parseSelectedCourseOnPush={parseSelectedCourseOnPush}
            />
          ),
          EMPTY: () => <CourseBySelectedGradesEmpty />,
        }}
        value={combinedCoursesState}
      />
    </>
  );
};

const OtherMajorElectiveContent = () => {
  const courses = useSuspenseGetOtherMajorElectives();
  const combinedCourses = useCombinedCourses(courses);
  const combinedCoursesState = useGetArrayState(combinedCourses);

  return (
    <SwitchCase
      caseBy={{
        FILLED: () => <CourseSelectionList courses={combinedCourses} />,
        EMPTY: () => <CourseBySelectedGradesEmpty />,
      }}
      value={combinedCoursesState}
    />
  );
};

export const MajorElectiveSelectionStep = ({ onNextClick }: MajorElectiveSelectionStepProps) => {
  const { grade } = useAssertedStudentInfoContext();
  const [selectedGrades, setSelectedGrades] = useState<StudentGrade[]>([grade]);
  const [isOtherMajorSelected, setIsOtherMajorSelected] = useState(false);

  const courses = useSuspenseGetCourses('MAJOR_ELECTIVE');
  const courseState = useGetArrayState(courses);

  const { selectedCredit } = useContext(SelectedCoursesContext);
  const { description, image, primaryButtonText, title } = contentMap[courseState];

  return (
    <CourseSelectionLayout>
      <CourseSelectionLayout.Header description={description} progress={44} title={title} />

      {image ? (
        <CourseSelectionLayout.ImageBody image={image} />
      ) : (
        <CourseSelectionLayout.Body className="!gap-0">
          <div className="flex flex-col gap-1.5 pb-3">
            <div className="flex items-center gap-1.5">
              <span className="bg-brandPrimary inline-block size-2.5 rounded-full" />
              <span className="font-semibold">전공선택 과목</span>
            </div>
            {/* TODO: 학점 정보 API 연동 후 동적으로 표시 */}
          </div>
          <div className="flex gap-1.5 pb-3">
            {selectableGrades.map((grades) => (
              <GradeChip
                grades={grades}
                isSelected={
                  !isOtherMajorSelected && grades.some((grade) => selectedGrades.includes(grade))
                }
                key={grades.join(', ')}
                onClickGradeChip={() => {
                  setSelectedGrades(grades);
                  setIsOtherMajorSelected(false);
                }}
              />
            ))}
            <SelectableChip
              onSelectChange={() => setIsOtherMajorSelected(true)}
              selected={isOtherMajorSelected}
            >
              타전공
            </SelectableChip>
          </div>
          <Suspense fallback={null}>
            {isOtherMajorSelected ? (
              <OtherMajorElectiveContent />
            ) : (
              <MajorElectiveContent selectedGrades={selectedGrades} />
            )}
          </Suspense>
        </CourseSelectionLayout.Body>
      )}

      <CourseSelectionLayout.Footer
        primaryButtonProps={{
          children: primaryButtonText,
          onClick: onNextClick,
        }}
        selectedCredit={selectedCredit}
      />
    </CourseSelectionLayout>
  );
};

const contentMap: Record<ArrayState, StepContentType> = {
  FILLED: {
    title: '이번 학기에 이수할\n전공선택과목을 알려주세요!',
    description: '타학년 전공선택과목도 선택할 수 있어요.',
    primaryButtonText: '다전공, 교직이수 과목 담으러 가기',
  },
  EMPTY: {
    title: '이번 학기에 이수할\n전공선택과목이 없어요.',
    image: '/images/like.webp',
    primaryButtonText: '다전공, 교직이수 과목 담으러 가기',
  },
};

const selectableGrades = [[1], [2], [3], [4, 5]] as const satisfies StudentGrade[][];

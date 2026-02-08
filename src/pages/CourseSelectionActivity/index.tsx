import { useFlow, useStepFlow } from '@stackflow/react/future';
import { useMutation } from '@tanstack/react-query';
import { Suspense, useState } from 'react';
import { SwitchCase } from 'react-simplikit';

import { postTimetableRecommendation } from '@/api/timetables/post-timetable-recommendation';
import { Mixpanel } from '@/bootstrap/mixpanel';
import { PostHog } from '@/bootstrap/posthog';
import { ActivityLayout } from '@/components/ActivityLayout';
import { useSelectedTimetableContext } from '@/components/Providers/SelectedTimetableProvider/hook';
import { useAssertedStudentInfoContext } from '@/components/Providers/StudentInfoProvider/hook';
import { useCoursesTotalPoint } from '@/hooks/course/useCoursesTotalPoint';
import { useFilteredCoursesByCategory } from '@/hooks/course/useFilteredCoursesByCategory';
import { useSafeActivityParams } from '@/hooks/stackflow/useSafeActivityParams';
import CourseSelectionFallback from '@/pages/CourseSelectionActivity/components/CourseSelectionFallback';
import { CourseSelectionResultStep } from '@/pages/CourseSelectionActivity/components/CourseSelectionSteps/CourseSelectionResultStep';
import { DoubleMajorSelectionStep } from '@/pages/CourseSelectionActivity/components/CourseSelectionSteps/DoubleMajorSelectionStep';
import { GeneralRequiredSelectionStep } from '@/pages/CourseSelectionActivity/components/CourseSelectionSteps/GeneralRequiredSelectionStep';
import { MajorElectiveSelectionStep } from '@/pages/CourseSelectionActivity/components/CourseSelectionSteps/MajorElectiveSelectionStep';
import { MajorPrerequisiteSelectionStep } from '@/pages/CourseSelectionActivity/components/CourseSelectionSteps/MajorPrerequisiteSelectionStep';
import { MajorRequiredSelectionStep } from '@/pages/CourseSelectionActivity/components/CourseSelectionSteps/MajorRequiredSelectionStep';
import { MinorSelectionStep } from '@/pages/CourseSelectionActivity/components/CourseSelectionSteps/MinorSelectionStep';
import { RetakeSelectionStep } from '@/pages/CourseSelectionActivity/components/CourseSelectionSteps/RetakeSelectionStep';
import { TeachingCertificateSelectionStep } from '@/pages/CourseSelectionActivity/components/CourseSelectionSteps/TeachingCertificateSelectionStep';
import SoongptErrorBoundary from '@/pages/CourseSelectionActivity/components/SoongptErrorBoundary';
import { SelectedCoursesContext } from '@/pages/CourseSelectionActivity/context';
import { SelectedCourseType } from '@/pages/CourseSelectionActivity/type';
import { TimetableType } from '@/types/timetable';
import { buildPartialSelectionFromCourses } from '@/utils/timetablePartialSelection';
import { toTimetableCourse } from '@/utils/timetableSelection';

export const CourseSelectionActivity = () => {
  const { type } = useSafeActivityParams('course_selection');
  const { grade, schoolId, department, subDepartment, teachTrainingCourse, semester } =
    useAssertedStudentInfoContext();

  const [selectedCourses, setSelectedCourses] = useState<SelectedCourseType[]>([]);

  const { push } = useFlow();
  const { pushStep } = useStepFlow('course_selection');

  const filteredCoursesByCategory = useFilteredCoursesByCategory(selectedCourses);
  const totalPoints = useCoursesTotalPoint(selectedCourses);
  const {
    setPartialSelection,
    setRecommendationStatus,
    setRecommendedPrimaryTimetable,
    setRecommendedAlternatives,
    setDeletableConflictCourses,
    setSelectedTimetable,
    setSelectedGeneralElectives,
    setSelectedChapelCourse,
    setAvailableChapels,
    setAvailableGeneralElectives,
    setFinalizedTimetable,
  } = useSelectedTimetableContext();
  const { mutateAsync: mutateTimetableRecommendation } = useMutation({
    mutationKey: ['timetables', 'final-recommendation'],
    mutationFn: postTimetableRecommendation,
  });

  // Todo: 전필은 로딩시 무조건 선택되어야 함

  const handleCreateTimetable = async () => {
    PostHog.trackActivityCtaClicked('course_selection', 'create_timetable_click', {
      selectedCourseCount: selectedCourses.length,
      selectedCredit: totalPoints,
    });
    PostHog.trackStepNextClicked('COURSE_SELECTION_RESULT', {
      selectedCourseCount: selectedCourses.length,
      selectedCredit: totalPoints,
    });

    const partialSelection = buildPartialSelectionFromCourses(
      {
        department,
        grade,
        schoolId,
        semester,
        subDepartment,
        teachTrainingCourse,
      },
      selectedCourses,
    );

    const previewTimetable: TimetableType = {
      timetableId: 0,
      tag: '기본 태그',
      score: null,
      totalPoint: totalPoints,
      courses: selectedCourses.map((course) => toTimetableCourse(course)),
    };

    setPartialSelection(partialSelection);
    setRecommendationStatus(null);
    setRecommendedPrimaryTimetable(null);
    setRecommendedAlternatives([]);
    setDeletableConflictCourses([]);
    setSelectedGeneralElectives([]);
    setSelectedChapelCourse(null);
    setAvailableGeneralElectives([]);
    setAvailableChapels([]);
    setFinalizedTimetable(null);
    setSelectedTimetable(previewTimetable);

    let response;
    try {
      response = await mutateTimetableRecommendation(partialSelection);
    } catch {
      push('error', { message: '시간표 추천을 불러오지 못했어요.' });
      return;
    }

    const { status, successResponse, singleConflictCourses } = response.result;

    setRecommendationStatus(status);
    PostHog.trackFunnelStageCompleted('course_selection', {
      selectedCourseCount: selectedCourses.length,
      selectedCredit: totalPoints,
      status,
    });

    if (status === 'SUCCESS' && successResponse) {
      setRecommendedPrimaryTimetable(successResponse.primaryTimetable);
      setRecommendedAlternatives(successResponse.alternativeSuggestions);
      setSelectedTimetable(successResponse.primaryTimetable);
      setDeletableConflictCourses([]);
      push('timetable_suggest', {});
      Mixpanel.trackCourseSelectionFinishClick(selectedCourses.map((course) => course.name));
      return;
    }

    if (status === 'SINGLE_CONFLICT') {
      setDeletableConflictCourses(singleConflictCourses ?? []);
      push('timetable_delete', {});
      Mixpanel.trackCourseSelectionFinishClick(selectedCourses.map((course) => course.name));
      return;
    }

    push('timetable_guide', {});
    Mixpanel.trackCourseSelectionFinishClick(selectedCourses.map((course) => course.name));
  };

  return (
    <SelectedCoursesContext.Provider
      value={{ selectedCourses, selectedCredit: totalPoints, setSelectedCourses }}
    >
      <ActivityLayout>
        <SoongptErrorBoundary
          FallbackComponent={<CourseSelectionFallback type="error" />}
          progress={50}
        >
          <Suspense fallback={<CourseSelectionFallback type="pending" />}>
            <SwitchCase
              caseBy={{
                RETAKE: () => (
                  <RetakeSelectionStep
                    onNextClick={() => {
                      PostHog.trackStepNextClicked('RETAKE', {
                        selectedCourseCount: selectedCourses.length,
                        selectedCredit: totalPoints,
                      });
                      pushStep({
                        type: 'MAJOR_PREREQUISITE',
                      });
                    }}
                  />
                ),
                MAJOR_PREREQUISITE: () => (
                  <MajorPrerequisiteSelectionStep
                    onNextClick={() => {
                      PostHog.trackStepNextClicked('MAJOR_PREREQUISITE', {
                        selectedCourseCount: selectedCourses.length,
                        selectedCredit: totalPoints,
                      });
                      pushStep({
                        type: 'MAJOR_REQUIRED',
                      });
                    }}
                  />
                ),
                MAJOR_REQUIRED: () => (
                  <MajorRequiredSelectionStep
                    onNextClick={() => {
                      PostHog.trackStepNextClicked('MAJOR_REQUIRED', {
                        selectedCourseCount: selectedCourses.length,
                        selectedCredit: totalPoints,
                      });
                      pushStep({
                        type: 'MAJOR_ELECTIVE',
                      });
                      Mixpanel.trackRequiredCourseSelectionClick({
                        type: 'MAJOR_REQUIRED',
                        courses: filteredCoursesByCategory.MAJOR_REQUIRED.map(
                          (course) => course.name,
                        ),
                      });
                    }}
                  />
                ),
                MAJOR_ELECTIVE: () => (
                  <MajorElectiveSelectionStep
                    onNextClick={() => {
                      PostHog.trackStepNextClicked('MAJOR_ELECTIVE', {
                        selectedCourseCount: selectedCourses.length,
                        selectedCredit: totalPoints,
                      });
                      pushStep({
                        type: 'DOUBLE_MAJOR',
                      });
                      Mixpanel.trackMajorElectiveCourseSelectionClick({
                        courses: filteredCoursesByCategory.MAJOR_ELECTIVE.map(
                          (course) => course.name,
                        ),
                        otherGradeCourse: filteredCoursesByCategory.MAJOR_ELECTIVE.some(
                          (course) => course.fromOtherGrade,
                        ),
                      });
                    }}
                  />
                ),
                DOUBLE_MAJOR: () => (
                  <DoubleMajorSelectionStep
                    onNextClick={() => {
                      PostHog.trackStepNextClicked('DOUBLE_MAJOR', {
                        selectedCourseCount: selectedCourses.length,
                        selectedCredit: totalPoints,
                      });
                      pushStep({
                        type: 'MINOR',
                      });
                    }}
                  />
                ),
                MINOR: () => (
                  <MinorSelectionStep
                    onNextClick={() => {
                      PostHog.trackStepNextClicked('MINOR', {
                        selectedCourseCount: selectedCourses.length,
                        selectedCredit: totalPoints,
                      });
                      pushStep({
                        type: 'TEACHING_CERTIFICATE',
                      });
                    }}
                  />
                ),
                TEACHING_CERTIFICATE: () => (
                  <TeachingCertificateSelectionStep
                    onNextClick={() => {
                      PostHog.trackStepNextClicked('TEACHING_CERTIFICATE', {
                        selectedCourseCount: selectedCourses.length,
                        selectedCredit: totalPoints,
                      });
                      pushStep({
                        type: 'GENERAL_REQUIRED',
                      });
                    }}
                  />
                ),
                GENERAL_REQUIRED: () => (
                  <GeneralRequiredSelectionStep
                    onNextClick={() => {
                      PostHog.trackStepNextClicked('GENERAL_REQUIRED', {
                        selectedCourseCount: selectedCourses.length,
                        selectedCredit: totalPoints,
                      });
                      pushStep({
                        type: 'COURSE_SELECTION_RESULT',
                      });
                      Mixpanel.trackRequiredCourseSelectionClick({
                        type: 'GENERAL_REQUIRED',
                        courses: filteredCoursesByCategory.GENERAL_REQUIRED.map(
                          (course) => course.name,
                        ),
                      });
                    }}
                  />
                ),
                // Todo: 검색뷰 및 액티비티 푸시
                COURSE_SELECTION_RESULT: () => (
                  <CourseSelectionResultStep onNextClick={handleCreateTimetable} />
                ),
              }}
              value={type}
            />
          </Suspense>
        </SoongptErrorBoundary>
      </ActivityLayout>
    </SelectedCoursesContext.Provider>
  );
};

import CourseSelectionView from '@/pages/CourseSelectionActivity/components/CourseSelectionView';
import { Course } from '@/schemas/courseSchema';

type CourseSelectionFallbackType = 'error' | 'pending';

interface CourseSelectionFallbackInfo {
  description?: string;
  image?: string;
  title: string;
}

const courseSelectionFallbackInfo: Record<
  CourseSelectionFallbackType,
  CourseSelectionFallbackInfo
> = {
  pending: {
    title: '이번 학기에 이수해야 하는\n과목을 불러오고 있어요.',
    description: '잠시만 기다려주세요!',
  },
  error: {
    title: '이번 학기에 이수해야 하는\n과목을 불러오지 못했어요..',
    description: '인터넷 연결 상태를 확인해주세요!',
    image: '/images/warning.webp',
  },
};

interface CourseSelectionFallbackProps {
  type: CourseSelectionFallbackType;
}

const CourseSelectionFallback = ({ type }: CourseSelectionFallbackProps) => {
  return (
    <CourseSelectionView
      courses={[emptyCourse, emptyCourse, emptyCourse]}
      description={courseSelectionFallbackInfo[type].description}
      image={courseSelectionFallbackInfo[type].image}
      resultState="FILLED"
      selectedCourses={[]}
      selectedGrades={[]}
      title={courseSelectionFallbackInfo[type].title}
    />
  );
};

const emptyCourse: Course = {
  courseName: '',
  professorName: '',
  courseTime: [],
  classification: 'MAJOR_REQUIRED',
  credit: 0,
  target: [],
};

export default CourseSelectionFallback;

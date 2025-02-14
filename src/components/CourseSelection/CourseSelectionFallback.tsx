import CourseSelectionView from './CourseSelectionView.tsx';
import { emptyCourses } from '../../data/courseSelectionInfo.ts';
import Warning from '../../assets/warning.svg';

type CourseSelectionFallbackType = 'pending' | 'error';

interface CourseSelectionFallbackInfo {
  title: string;
  description?: string;
  image?: string;
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
    image: Warning,
  },
};

interface CourseSelectionFallbackProps {
  type: CourseSelectionFallbackType;
}

const CourseSelectionFallback = ({ type }: CourseSelectionFallbackProps) => {
  return (
    <CourseSelectionView
      courses={emptyCourses}
      resultState={'FILLED'}
      selectedCourses={[]}
      selectedGrades={[]}
      title={courseSelectionFallbackInfo[type].title}
      description={courseSelectionFallbackInfo[type].description}
      image={courseSelectionFallbackInfo[type].image}
    />
  );
};

export default CourseSelectionFallback;

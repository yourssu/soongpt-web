import { CourseSelectionLayout } from '@/pages/CourseSelectionActivity/components/CourseSelectionLayout';
import { CourseSelectionListLoading } from '@/pages/CourseSelectionActivity/components/CourseSelectionListLoading';

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
  const { description, image, title } = courseSelectionFallbackInfo[type];

  return (
    <CourseSelectionLayout>
      <CourseSelectionLayout.Header description={description} title={title} />
      {type === 'pending' && (
        <CourseSelectionLayout.Body>
          <CourseSelectionListLoading />
        </CourseSelectionLayout.Body>
      )}
      {image && <CourseSelectionLayout.ImageBody image={image} />}
    </CourseSelectionLayout>
  );
};

export default CourseSelectionFallback;

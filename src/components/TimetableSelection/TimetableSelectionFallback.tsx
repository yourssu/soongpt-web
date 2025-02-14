import TimetableSelectionView from './TimetableSelectionView.tsx';
import { ReactElement } from 'react';
import { TimetableSkeleton } from '../TimetableSkeleton.tsx';
import Warning from '../../assets/warning.svg';
import { useFlow } from '../../stackflow.ts';

type TimetableSelectionFallbackType = 'pending' | 'error';

interface TimetableSelectionFallbackInfo {
  title: string;
  buttonText: string;
  buttonDisabled: boolean;
  handleNextClick?: () => void;
  element: ReactElement;
}

interface TimetableSelectionFallbackProps {
  type: TimetableSelectionFallbackType;
}

const TimetableSelectionFallback = ({ type }: TimetableSelectionFallbackProps) => {
  const { pop } = useFlow();

  const timetableSelectionFallbackInfo: Record<
    TimetableSelectionFallbackType,
    TimetableSelectionFallbackInfo
  > = {
    pending: {
      title: '사용자님을 위한\n시간표를 가져오는 중이에요!',
      buttonText: '이 시간표가 좋아요',
      buttonDisabled: true,
      element: (
        <TimetableSkeleton className="pt-4">
          <TimetableSkeleton.Header />
        </TimetableSkeleton>
      ),
    },
    error: {
      title: '사용자님을 위한\n시간표를 찾지 못했어요..',
      buttonText: '다시 만들기',
      buttonDisabled: false,
      handleNextClick: () => pop(2),
      element: (
        <div className="flex flex-1 flex-col items-center justify-center">
          <img src={Warning} alt="Warning" className="size-42.5" />
        </div>
      ),
    },
  };

  return (
    <TimetableSelectionView
      element={timetableSelectionFallbackInfo[type].element}
      handleNextClick={timetableSelectionFallbackInfo[type].handleNextClick}
      buttonText={timetableSelectionFallbackInfo[type].buttonText}
      title={timetableSelectionFallbackInfo[type].title}
      buttonDisabled={timetableSelectionFallbackInfo[type].buttonDisabled}
    />
  );
};

export default TimetableSelectionFallback;

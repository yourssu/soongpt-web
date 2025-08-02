import clsx from 'clsx';
import { CircleCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';

import { Mixpanel } from '@/bootstrap/mixpanel';
import Hint from '@/components/Hint';
import { useAlertDialog } from '@/hooks/useAlertDialog';
import { StudentGrade } from '@/types/student';

interface ChapelInputProps {
  grade: StudentGrade;
  initialValue: boolean | undefined;
  onNext: (chapel: boolean) => void;
}

type ChapelType = 'SMALL_GROUPED_CHAPEL' | 'VISION_CHAPEL';

const ChapelInput = ({ onNext, initialValue, grade }: ChapelInputProps) => {
  const [chapel, setChapel] = useState(initialValue ?? true);
  const openChapleInfoDialog = useAlertDialog();

  const chapelType: ChapelType = grade >= 2 ? 'VISION_CHAPEL' : 'SMALL_GROUPED_CHAPEL';

  const handleClickChapel = () => {
    setChapel(!chapel);
    onNext(!chapel);
  };

  const handleClickChapelInfo = async () => {
    Mixpanel.trackRegistrationInformationClick(chapelType);
    const { content, title } = chapelInfoDialogContentMap[chapelType];
    openChapleInfoDialog({
      content,
      title,
      closeableWithOutside: true,
      closeButton: true,
    });
  };

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      initial={{
        opacity: 0,
        y: -20,
      }}
      transition={{
        duration: 0.3,
        ease: 'easeOut',
      }}
    >
      <label className="mb-1.5 block text-sm">채플 수강 여부</label>

      <button
        className={clsx(
          'bg-bg-layerDefault focus-visible:outline-borderRing flex w-full items-center justify-between rounded-xl px-4 py-3 text-lg font-medium',
          chapel ? 'text-brandPrimary' : 'text-neutralPlaceholder',
        )}
        onClick={handleClickChapel}
        type="button"
      >
        {chapelNameMap[chapelType]} 수강
        <CircleCheck
          className={`size-6 ${chapel ? 'text-brandPrimary' : 'text-neutralDisabled'}`}
        />
      </button>
      {chapelType === 'VISION_CHAPEL' && !!chapel && (
        <Hint className="mt-2">
          <Hint.Text>지정 채플이 아닌 다른 시간대의 채플이 추천될 수 있어요.</Hint.Text>
        </Hint>
      )}
      <button
        className="text-brandPrimary cursor-pointer text-xs underline"
        onClick={handleClickChapelInfo}
      >
        채플 수강신청 안내
      </button>
    </motion.div>
  );
};

const chapelNameMap = {
  SMALL_GROUPED_CHAPEL: '소그룹 채플',
  VISION_CHAPEL: '비전 채플',
} as const satisfies Record<ChapelType, string>;

const chapelInfoDialogContentMap = {
  SMALL_GROUPED_CHAPEL: {
    title: '소그룹 채플 수강신청',
    content: (
      <>
        <div>
          소그룹 채플은 <span className="text-brandSecondary">관리자 수강신청</span>이 원칙
        </div>
        <div>취소 후 재신청 불가</div>
      </>
    ),
  },
  VISION_CHAPEL: {
    title: '비전 채플 수강신청',
    content: (
      <>
        <div>
          비전 채플은 <span className="text-brandSecondary">관리자 수강신청</span>이 원칙
        </div>
        <div>
          수강신청 목록에서 <span className="text-brandSecondary">취소 후 재신청 가능</span>
        </div>
      </>
    ),
  },
} as const satisfies Record<ChapelType, { content: React.ReactNode; title: string }>;

export default ChapelInput;

import { CircleCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';

import { useAlertDialog } from '@/hooks/useAlertDialog';
import { Grade } from '@/schemas/studentSchema';

interface ChapelInputProps {
  grade: Grade;
  initialValue: boolean | undefined;
  onNext: (chapel: boolean) => void;
}

type ChapelType = 'ASSIGNED_CHAPEL' | 'SMALL_GROUPED_CHAPEL';

const ChapelInput = ({ onNext, initialValue, grade }: ChapelInputProps) => {
  const [chapel, setChapel] = useState(initialValue ?? true);
  const openChapleInfoDialog = useAlertDialog();

  const chapelType: ChapelType = grade >= 2 ? 'ASSIGNED_CHAPEL' : 'SMALL_GROUPED_CHAPEL';

  const handleClickChapel = () => {
    setChapel(!chapel);
    onNext(!chapel);
  };

  const handleClickChapelInfo = async () => {
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
        className="bg-bg-layerDefault focus-visible:outline-borderRing text-brandPrimary flex w-full items-center justify-between rounded-xl px-4 py-3 text-lg font-semibold"
        onClick={handleClickChapel}
        type="button"
      >
        {chapel ? `${chapelNameMap[chapelType]} 수강` : '채플 미수강'}
        <CircleCheck
          className={`size-6 ${chapel ? 'text-brandPrimary' : 'text-neutralDisabled'}`}
        />
      </button>
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
  ASSIGNED_CHAPEL: '지정 채플',
} as const satisfies Record<ChapelType, string>;

const chapelInfoDialogContentMap = {
  SMALL_GROUPED_CHAPEL: {
    title: '소그룹 채플 수강신청',
    content: (
      <>
        <div>
          소그룹채플은 <span className="text-brandSecondary">관리자 수강신청</span>이 원칙
        </div>
        <div>취소 후 재신청 불가</div>
      </>
    ),
  },
  ASSIGNED_CHAPEL: {
    title: '비전채플 수강신청',
    content: (
      <>
        <div>
          소그룹채플은 <span className="text-brandSecondary">관리자 수강신청</span>이 원칙
        </div>
        <div>
          수강신청 목록에서 <span className="text-brandSecondary">취소 후 재신청 가능</span>
        </div>
      </>
    ),
  },
} as const satisfies Record<ChapelType, { content: React.ReactNode; title: string }>;

export default ChapelInput;

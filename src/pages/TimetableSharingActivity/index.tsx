import { AppScreen } from '@stackflow/plugin-basic-ui';
import { ActivityComponentType } from '@stackflow/react';
import html2canvas from 'html2canvas';
import ky from 'ky';
import { Suspense, useRef } from 'react';

import { Mixpanel } from '@/bootstrap/mixpanel';
import AppBar from '@/components/AppBar';
import TimetableSharingTemplate from '@/pages/TimetableSharingActivity/components/TimetableSharingTemplate';
import { TemplateSkeleton } from '@/pages/TimetableSharingActivity/components/TimetableSkeleton';

type TimetableSharingParams = {
  timetableId: number;
};

const TimetableSharingActivity: ActivityComponentType<TimetableSharingParams> = ({
  params: { timetableId },
}) => {
  const templateRef = useRef<HTMLDivElement>(null);

  const captureTemplate = async () => {
    if (!templateRef.current) {
      return null;
    }

    const canvas = await html2canvas(templateRef.current, {
      scale: 2, // 더 선명한 이미지를 위해 2배 크기로 렌더링
      backgroundColor: null, // 투명 배경 유지
    });
    // Canvas를 이미지로 변환
    return canvas.toDataURL('image/png');
  };

  const handleClickSave = async () => {
    // Mixpanel 이벤트 추적
    Mixpanel.trackTimetableSaveClick();

    try {
      const imageUrl = await captureTemplate();
      if (imageUrl) {
        // 다운로드 링크 생성
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = `시간표_${new Date().getTime()}.png`;

        // 다운로드 트리거
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error('Failed to save template:', error);
    }
  };

  const handleClickShare = async () => {
    // Mixpanel 이벤트 추적
    Mixpanel.trackTimetableShareClick();

    try {
      const imageUrl = await captureTemplate();

      if (imageUrl) {
        // Convert base64 to blob
        const blob = await ky(imageUrl).blob();

        const file = new File([blob], `시간표_${new Date().getTime()}.png`, {
          type: 'image/png',
        });

        const shareData = {
          title: '숭피티 추천 시간표',
          text: '숭피티 추천 시간표를 확인해보세요!',
          files: [file],
        };

        await navigator.share(shareData);
      }
    } catch (error) {
      console.error('Failed to share template:', error);
    }
  };

  return (
    <AppScreen>
      <div className="flex min-h-dvh flex-col py-6">
        <AppBar progress={100} />
        <div className="mt-6 flex flex-1 flex-col items-center justify-evenly">
          <Suspense fallback={<TemplateSkeleton />}>
            <TimetableSharingTemplate ref={templateRef} timetableId={timetableId} />
            <div className="mt-4 flex justify-center gap-2">
              <button
                className="text-brandSecondary bg-bg-brandLayerDefault rounded-2xl px-9 py-3 font-semibold"
                onClick={handleClickSave}
                type="button"
              >
                저장할래요
              </button>
              <button
                className="bg-brandPrimary rounded-2xl px-9 py-3 font-semibold text-white"
                onClick={handleClickShare}
                type="button"
              >
                공유할래요
              </button>
            </div>
          </Suspense>
        </div>
      </div>
    </AppScreen>
  );
};

export default TimetableSharingActivity;

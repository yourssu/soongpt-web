import * as Popover from '@radix-ui/react-popover';
import { useMutation } from '@tanstack/react-query';
import { range } from 'es-toolkit';
import { Check, ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';

import { postTimetable } from '@/api/timetables';
import { Mixpanel } from '@/bootstrap/mixpanel';
import { ActivityLayout } from '@/components/ActivityLayout';
import { ProgressAppBar } from '@/components/AppBar/ProgressAppBar';
import { Hint } from '@/components/Hint';
import { useAssertedStudentInfoContext } from '@/components/Providers/StudentInfoProvider/hook';
import { useAlertDialog } from '@/hooks/useAlertDialog';
import { PointCarryOverCalculator } from '@/pages/DesiredCreditActivity/components/PointCarryOverCalculator';
import { PreferedGeneralElectivesChipGroup } from '@/pages/DesiredCreditActivity/components/PreferedGeneralElectivesChipGroup';
import RollingNumber from '@/pages/DesiredCreditActivity/components/RollingNumber';
import { useFlow } from '@/stackflow';
import { ActivityComponentType } from '@/utils/stackflow';

type DesiredCreditParams = {
  codes: number[];
  generalRequiredCodes: number[];
  majorElectiveCodes: number[];
  majorRequiredCodes: number[];
  selectedTotalPoints: number;
};

const MAX_CREDIT = 22 + 3; // 최대 학점 22 + 이월학점 3

export const DesiredCreditActivity: ActivityComponentType<DesiredCreditParams> = ({ params }) => {
  const { grade, schoolId, department, isChapel } = useAssertedStudentInfoContext();

  const chapelPoints = isChapel ? 0.5 : 0;
  const totalPoints = params.selectedTotalPoints + chapelPoints;

  const [generalElective, setGeneralElective] = useState(0); // 교양선택 학점
  const [showGeneralElectiveDropdown, setShowGeneralElectiveDropdown] = useState(false);
  const [preferredGeneralElectives, setPreferredGeneralElectives] = useState<string[]>([]);

  const { mutate: mutateTimetable } = useMutation({
    mutationKey: ['timetables'],
    mutationFn: postTimetable,
    onSuccess: () => {
      Mixpanel.incrementUserCount();
      Mixpanel.trackTimetableGenerateComplete();
    },
  });
  const openDialog = useAlertDialog();

  const availableGeneralElective = range(MAX_CREDIT - totalPoints + 1);
  const desiredCredit = totalPoints + generalElective;

  const { push } = useFlow();

  const handleCreditSelect = (selectedCredit: number) => {
    setGeneralElective(selectedCredit);
    setShowGeneralElectiveDropdown(false);
  };

  const handleMaxPointInfoClick = () => {
    const contentType = grade === 1 ? '1학년' : '2학년_이상';

    openDialog({
      title: maxPointInfoDialogContent[contentType].title,
      content: maxPointInfoDialogContent[contentType].content,
      closeButton: true,
      closeableWithOutside: true,
    });

    Mixpanel.trackRegistrationInformationClick('MAX_POINT_INFO');
  };

  const handleGeneralElectiveInfoClick = () => {
    const contentType = schoolId >= 23 ? '23학번_이상' : '22학번_이하';

    openDialog({
      title: '교양과목 이수 체계 안내',
      content: generalElectiveInfoDialogContent[contentType],
      closeButton: true,
      closeableWithOutside: true,
    });
  };

  const handleNextClick = async () => {
    Mixpanel.trackDesiredCreditClick({
      existCredit: totalPoints,
      addCredit: generalElective,
      sumCredit: desiredCredit,
      fieldSelect: preferredGeneralElectives.length > 0,
    });

    mutateTimetable({
      schoolId,
      department,
      grade,
      isChapel,
      codes: params.codes,
      generalRequiredCodes: params.generalRequiredCodes,
      majorElectiveCodes: params.majorElectiveCodes,
      majorRequiredCodes: params.majorRequiredCodes,
      generalElectivePoint: generalElective,
      preferredGeneralElectives,
    });

    push('TimetableSelectionActivity', {});
  };

  return (
    <ActivityLayout>
      <ActivityLayout.ScrollArea>
        <ActivityLayout.Header>
          <ProgressAppBar progress={75} />
          <div className="mt-6 flex flex-1 flex-col items-center">
            <h2 className="text-center text-[28px]/[normal] font-semibold">
              사용자님의 이번학기 <br />
              희망 학점은{' '}
              <RollingNumber
                className="text-brandPrimary"
                decimals={isChapel ? 1 : 0}
                number={desiredCredit}
              />
              학점이군요!
            </h2>
            <span className="mt-1 font-light">희망 학점에 맞추어 선택과목을 추천해드릴게요.</span>
          </div>
        </ActivityLayout.Header>

        <ActivityLayout.Body>
          <div className="grid grid-cols-2 gap-x-2.5 gap-y-6">
            <div>
              <label className="mb-1.5 block text-sm">현재 선택한 학점</label>
              <input
                className="bg-bg-layerDefault text-brandPrimary w-full rounded-xl px-4 py-3 text-lg font-semibold"
                disabled
                type="number"
                value={totalPoints}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm">추천받을 교양 학점</label>
              <Popover.Root
                onOpenChange={setShowGeneralElectiveDropdown}
                open={showGeneralElectiveDropdown}
              >
                <Popover.Trigger asChild>
                  <button
                    className={`bg-bg-layerDefault focus-visible:outline-borderRing flex w-full items-center justify-between rounded-xl px-4 py-3 text-lg font-semibold ${generalElective === 0 ? 'text-neutralPlaceholder' : 'text-brandPrimary'}`}
                    type="button"
                  >
                    {generalElective}
                    <ChevronDown className="text-neutral size-4" />
                  </button>
                </Popover.Trigger>

                <AnimatePresence>
                  {showGeneralElectiveDropdown && (
                    <Popover.Content asChild forceMount sideOffset={5}>
                      <motion.ul
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        className="bg-bg-layerDefault z-10 max-h-44 w-[var(--radix-popover-trigger-width)] overflow-y-auto rounded-xl border border-gray-200 shadow-sm"
                        exit={{
                          opacity: 0,
                          y: -10,
                        }}
                        initial={{ opacity: 0, y: -10 }}
                        transition={{
                          duration: 0.2,
                        }}
                      >
                        {availableGeneralElective.map((availableCredit) => (
                          <li key={availableCredit}>
                            <button
                              className="text-neutralSubtle focus-visible:outline-borderRing flex w-full items-center justify-between rounded-xl px-4 py-2 text-lg font-semibold hover:bg-gray-100 focus-visible:-outline-offset-1"
                              onClick={() => handleCreditSelect(availableCredit)}
                              type="button"
                            >
                              {availableCredit}
                              {availableCredit === generalElective && (
                                <Check className="size-4 text-green-500" />
                              )}
                            </button>
                          </li>
                        ))}
                      </motion.ul>
                    </Popover.Content>
                  )}
                </AnimatePresence>
              </Popover.Root>
            </div>
          </div>
          <button
            className="text-brandPrimary mt-2 cursor-pointer self-start text-xs underline"
            onClick={handleMaxPointInfoClick}
          >
            수강 신청 최대 학점 안내
          </button>

          <div className="mt-5 flex flex-col gap-2.5 text-sm">
            <div>추천받을 교양과목 분야</div>
            <PreferedGeneralElectivesChipGroup
              onChange={setPreferredGeneralElectives}
              values={preferredGeneralElectives}
            />
            <Hint className="text-xs">분야를 선택하지 않으면 임의로 추천해드려요.</Hint>
            <button
              className="text-brandPrimary cursor-pointer self-start text-xs underline"
              onClick={handleGeneralElectiveInfoClick}
            >
              교양과목 이수 체계 안내(
              {schoolId >= 23 ? '2023학년도 이후' : '2022학년도 이전'} 입학자)
            </button>
          </div>
        </ActivityLayout.Body>

        <ActivityLayout.Footer>
          <motion.button
            animate={{ opacity: 1, y: 0 }}
            className="bg-brandPrimary mt-auto w-full rounded-2xl py-3.5 font-semibold text-white"
            initial={{
              opacity: 0,
              y: 20,
            }}
            onClick={handleNextClick}
            transition={{
              duration: 0.3,
              ease: 'easeOut',
            }}
            type="button"
          >
            네 맞아요
          </motion.button>
        </ActivityLayout.Footer>
      </ActivityLayout.ScrollArea>
    </ActivityLayout>
  );
};

const generalElectiveInfoDialogContent = {
  '23학번_이상': (
    <div className="font-medium">
      <div>
        교양필수 19학점 + <span className="text-brandSecondary">교양선택 9학점</span> 필수 이수
      </div>
      <br />
      <div>[교양선택]</div>
      <div>
        아래 영역 중 <span className="text-brandSecondary">3개 영역 이상 이수</span>
      </div>
      <ul>
        <li className="pl-4">
          <span>a. 인간・언어</span>
        </li>
        <li className="pl-4">
          <span>b. 문화・예술</span>
        </li>
        <li className="pl-4">
          <span>c. 사회・정치・경제</span>
        </li>
        <li className="pl-4">
          <span>d. Bridge 교과(수리・물리・화학・생물)</span>
        </li>
        <li className="pl-4">e. 자기개발・진로탐색</li>
      </ul>
    </div>
  ),
  '22학번_이하': (
    <div className="font-medium">
      <div>
        교양필수 16학점 + <span className="text-brandSecondary">교양선택 12학점</span> 필수 이수
      </div>
      <br />
      <div>[교양선택]</div>
      <div>
        아래 영역 중 1개 영역 선택하여 <span className="text-brandSecondary">1과목 필수</span>
      </div>
      <ul>
        <li className="pl-4">
          <span>a. 인성과 리더십</span>
        </li>
        <li className="pl-4">
          <span>b. 자기계발과 진로탐색</span>
        </li>
      </ul>
      <br />
      <div>
        아래 영역 중 1개 영역 선택하여 <span className="text-brandSecondary">1과목 필수</span>
      </div>
      <ul>
        <li className="pl-4">
          <span>a. 한국어의사소통</span>
        </li>
        <li className="pl-4">
          <span>b. 국제어문</span>
        </li>
      </ul>
      <br />
      <div>
        아래 영역 중 1개 영역 선택하여 <span className="text-brandSecondary">2과목 필수</span>
      </div>
      <ul>
        <li className="pl-4">
          <span>a. 문학・예술</span>
        </li>
        <li className="pl-4">
          <span>b. 역사・철학・종교</span>
        </li>
        <li className="pl-4">
          <span>c. 정치・경제・경영</span>
        </li>
        <li className="pl-4">
          <span>d. 사회・문화・심리</span>
        </li>
        <li className="pl-4">
          <span>e. 자연과학・공학・기술</span>
        </li>
      </ul>
    </div>
  ),
};

const maxPointInfoDialogContent = {
  '1학년': {
    title: '1학년 수강신청 최대 학점 안내',
    content: (
      <div className="font-medium">
        <div>
          수강신청 최대 학점: <span className="text-brandSecondary">22학점</span>
        </div>
        <div>
          단, 1・2학기 <span className="text-brandSecondary">총 38학점 이내</span>
        </div>
        <br />
        <div>예) 1-1에 22학점을 수강신청 했다면, 1-2에는 최대 16학점 신청 가능</div>
        <br />
        <div>
          1학년은 <span className="text-brandSecondary">이월학점제 해당 없음</span>
        </div>
        <br />
        <div>*수강신청 최대 학점을 채워야 하는 것은 아니며,</div>
        <div>
          <span className="text-brandSecondary">수강신청 최소 학점은 없음</span>
        </div>
      </div>
    ),
  },
  '2학년_이상': {
    title: '2학년 이상 수강신청 최대 학점 안내',
    content: (
      <div className="font-medium">
        <div>
          수강신청 최대 학점: <span className="text-brandSecondary">19학점</span>
        </div>
        <div>
          ① <span className="text-brandSecondary">직전학기 평균평점이 4.0 이상인 경우, 22학점</span>
        </div>
        <div>② 직전학기 평균평점이 1.5 미만인 경우, 15학점</div>
        <br />
        <div>이월학점:</div>
        <ul>
          <li className="text-brandSecondary">
            <span className="px-2">•</span>
            <span>19학점-(직전학기 수강신청 학점)</span>
          </li>
          <li className="text-brandSecondary">
            <span className="px-2">•</span>
            <span>3학점</span>
          </li>
        </ul>
        <div>
          <span className="text-brandSecondary">중 작은 값</span> (최대 3학점 이월 가능, -학점은
          없음)
        </div>
        <br />
        <PointCarryOverCalculator />
        <br />
        <div>*수강신청 최대 학점을 채워야 하는 것은 아니며,</div>
        <div>
          <span className="text-brandSecondary">수강신청 최소 학점은 없음</span>
        </div>
      </div>
    ),
  },
};

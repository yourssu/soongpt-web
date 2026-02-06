import type { useSuspenseGetGeneralElectiveProgress } from '@/pages/GeneralElectiveSelectionActivity/hooks/useSuspenseGetGeneralElectiveProgress';

type GeneralElectiveProgress = ReturnType<typeof useSuspenseGetGeneralElectiveProgress>;

interface GeneralElectiveProgressTextProps {
  progress: GeneralElectiveProgress;
}

export const GeneralElectiveProgressText = ({ progress }: GeneralElectiveProgressTextProps) => {
  if (progress.scheme === '23+') {
    const [human, culture, society, science, bridge, self] = progress.fieldCredits;

    return (
      <div className="text-sm leading-tight font-light">
        <p>
          * 교양필수{' '}
          <span className="font-semibold">
            {progress.requiredCredits}학점 중 {progress.completedCredits}학점
          </span>{' '}
          이수했어요.
        </p>
        <p>
          * 인간 {human?.completedCredits ?? 0}학점 / 문화{' '}
          <span className="font-semibold">{culture?.completedCredits ?? 0}학점</span> / 사회{' '}
          <span className="font-semibold">{society?.completedCredits ?? 0}학점</span> / 과학{' '}
          {science?.completedCredits ?? 0}학점
        </p>
        <p>
          / Bridge 교과 {bridge?.completedCredits ?? 0}학점 / 자기개발 {self?.completedCredits ?? 0}
          학점
        </p>
        <p>* 1~5영역에서 {progress.minFieldsRequired}개 영역 이상 이수해야해요.</p>
      </div>
    );
  }

  const coreSummary = progress.coreAreas
    .map((area) => `${area.label} ${area.completedCount}과목`)
    .join(' / ');
  const balance = progress.balanceAreas.find((area) => area.completedCount > 0);

  return (
    <div className="text-sm leading-tight font-light">
      <p>
        * 교양필수{' '}
        <span className="font-semibold">
          {progress.requiredCourseCount}과목 중 {progress.completedCourseCount}과목
        </span>{' '}
        이수했어요.
      </p>
      <p>* {coreSummary} /</p>
      <p>
        * 균형교양교과{' '}
        <span className="font-semibold">
          {balance?.completedCount ?? 0}과목({balance?.label ?? '문학・예술'})
        </span>
      </p>
      <p>
        * 숭실품성교과, 기초역량교과에서 각 1과목씩 총 2과목,
        <br />
        균형교양교과에서 {progress.requiredBalanceAreaCount}개 영역을 선택하여 각 1과목씩
        <br />총 2과목 이수해야해요.
      </p>
    </div>
  );
};

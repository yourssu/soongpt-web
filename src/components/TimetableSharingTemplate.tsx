import useEmblaCarousel from 'embla-carousel-react';
import {
  forwardRef,
  HTMLAttributes,
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from 'react';

import Timetable, { getMajorCredit, getTotalCredit, SharingHeader } from '@/components/Timetable';
import { StudentMachineContext } from '@/contexts/StudentMachineContext';
import { useGetTimetable } from '@/hooks/useGetTimetable';
import { Mixpanel } from '@/utils/mixpanel';

interface Color {
  chipBg: string;
  chipText: string;
  headerText: string;
  studentText: string;
  tableHeaderBg: string;
  templateBg: string;
  templateContentBg: string;
}

export const TEMPLATE_COLORS: Color[] = [
  {
    templateBg: '#000000',
    templateContentBg: 'linear-gradient(161deg, #3D3D3D 5.9%, #181818 96.88%)',
    tableHeaderBg: '#3D3D3D',
    headerText: '#FFFFFF',
    studentText: '#FFFFFF',
    chipBg: 'rgba(42, 42, 42, 0.36)',
    chipText: '#FFFFFF',
  },
  {
    templateBg: '#1A2D58',
    templateContentBg: '#1554DB',
    tableHeaderBg: '#1554DB',
    headerText: '#FFFFFF',
    studentText: '#FFFFFF',
    chipBg: 'rgba(42, 42, 42, 0.36)',
    chipText: '#FFFFFF',
  },
  {
    templateBg:
      'linear-gradient(196deg, #F3BCFE -3.56%, #E7B8FA 4.64%, #C3D6FF 76.88%, #C2D1F1 148.32%, #C9D6F3 155.72%)',
    templateContentBg: '#F9F9F9',
    tableHeaderBg: '#F9F9F9',
    headerText: '#292929',
    studentText: '#292929',
    chipBg: 'rgba(42, 42, 42, 0.36)',
    chipText: '#FFFFFF',
  },
  {
    templateBg: '#FFFFFF',
    templateContentBg: 'linear-gradient(180deg, #A4B9FF 0%, #E2A9D0 100%)',
    tableHeaderBg: '#A4B9FF',
    headerText: '#FFFFFF',
    studentText: '#FFFFFF',
    chipBg: 'rgba(255, 255, 255, 0.25)',
    chipText: '#FFFFFF',
  },
  {
    templateBg: '#EDF8FF',
    templateContentBg:
      'linear-gradient(145deg, #FDE8FF 16.15%, #F3F3F3 28.18%, #C5E7FF 37.19%, #DAE7FF 41.4%, #F4F1F1 58.83%, #C5E7FF 72.29%, #DCE8FF 76.48%, #FDE8FF 101.51%, #FFFBFB 107.52%)',
    tableHeaderBg:
      'linear-gradient(90deg, #C5E7FF 0%, #FDE8FF 31.21%, #DDE7FF 69.21%, #ECE8FF 91.71%)',
    headerText: '#FFFFFF',
    studentText: '#292929',
    chipBg: 'rgba(255, 255, 255, 0.25)',
    chipText: '#292929',
  },
];

const Template = forwardRef<HTMLDivElement, PropsWithChildren<{ bgImage: string }>>(
  ({ children, bgImage, ...props }, ref) => {
    return (
      <div
        className={`w-full overflow-hidden rounded-xl px-6 py-16`}
        ref={ref}
        style={{
          background: `${bgImage}`,
        }}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Template.displayName = 'Template';

const TemplateContent = ({ children, bgImage }: PropsWithChildren<{ bgImage: string }>) => {
  return (
    <div
      className="rounded-xl px-3 py-2"
      style={{
        background: `${bgImage}`,
      }}
    >
      {children}
    </div>
  );
};

const TemplateStudent = ({ textColor }: PropsWithChildren<{ textColor: string }>) => {
  const context = StudentMachineContext.useSelector((state) => state.context);

  return (
    <div
      className={`mt-1.5 pl-2`}
      style={{
        color: textColor,
      }}
    >
      <div className="text-xs font-semibold">{context.grade}학년</div>
      <div className="text-[10px] font-semibold">{context.department}</div>
    </div>
  );
};

const TemplateCredit = ({ children }: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={`mt-1.5 flex items-center justify-between px-2 font-semibold`}>{children}</div>
  );
};

const TemplateCreditChip = ({
  children,
  bgColor,
  textColor,
}: PropsWithChildren<{ bgColor: string; textColor: string }>) => {
  return (
    <div
      className={`flex items-center gap-2 rounded-xl px-2 py-1`}
      style={{
        background: bgColor,
        color: textColor,
      }}
    >
      {children}
    </div>
  );
};

interface TimetableSharingTemplateProps {
  timetableId: number;
}

const TimetableSharingTemplate = forwardRef<HTMLDivElement, TimetableSharingTemplateProps>(
  ({ timetableId }, templateRef) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const { data: timetable } = useGetTimetable(timetableId);
    const [emblaRef, emblaApi] = useEmblaCarousel();

    const onSelect = useCallback(() => {
      if (emblaApi) {
        setSelectedIndex(emblaApi.selectedScrollSnap());
      }
    }, [emblaApi]);

    const scrollTo = useCallback(
      (index: number) => {
        if (emblaApi) {
          emblaApi.scrollTo(index);
        }
      },
      [emblaApi],
    );

    useEffect(() => {
      if (emblaApi) {
        onSelect();
        emblaApi.on('select', onSelect);

        return () => {
          emblaApi.off('select', onSelect);
        };
      }
    }, [emblaApi, onSelect]);

    // Mixpanel 이벤트 추적
    useEffect(() => {
      Mixpanel.trackTimetableSharingEnter(timetable);
    }, [timetable]);

    return (
      <>
        <div className="w-full overflow-hidden px-5" ref={emblaRef}>
          <div className="-ml-5 flex">
            {TEMPLATE_COLORS.map((color, index) => (
              <div className="min-w-0 flex-[0_0_100%] transform-gpu pl-5" key={`template-${index}`}>
                <Template
                  bgImage={color.templateBg}
                  ref={selectedIndex === index ? templateRef : null}
                >
                  <TemplateContent bgImage={color.templateContentBg}>
                    <Timetable className="!border-0 bg-white" timetable={timetable}>
                      <Timetable.Header
                        as={SharingHeader}
                        bgColor={color.tableHeaderBg}
                        textColor={color.headerText}
                      />
                    </Timetable>
                    <TemplateStudent textColor={color.studentText} />
                    <TemplateCredit>
                      <TemplateCreditChip bgColor={color.chipBg} textColor={color.chipText}>
                        <div className="text-[10px]">이수학점</div>
                        <div className="text-[10px]">{getTotalCredit(timetable.courses)}</div>
                      </TemplateCreditChip>
                      <TemplateCreditChip bgColor={color.chipBg} textColor={color.chipText}>
                        <div className="text-[10px]">전공학점</div>
                        <div className="text-[10px]">{getMajorCredit(timetable.courses)}</div>
                      </TemplateCreditChip>
                    </TemplateCredit>
                  </TemplateContent>
                </Template>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4 flex justify-center gap-3">
          {TEMPLATE_COLORS.map((color, index) => (
            <button
              className={`size-7.5 rounded-full shadow-sm outline-2 transition-colors ${index === selectedIndex ? 'outline-brandPrimary' : 'outline-neutralPlaceholder'}`}
              key={`button-${index}`}
              onClick={() => scrollTo(index)}
              style={{
                background: color.templateContentBg,
              }}
              type="button"
            />
          ))}
        </div>
      </>
    );
  },
);

TimetableSharingTemplate.displayName = 'TimetableSharingTemplate';

export default TimetableSharingTemplate;

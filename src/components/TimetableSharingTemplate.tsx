import useEmblaCarousel from 'embla-carousel-react';
import {
  forwardRef,
  HTMLAttributes,
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useGetTimetable } from '../hooks/useGetTimetable';
import { StudentMachineContext } from '../machines/studentMachine';
import Timetable, { getMajorCredit, getTotalCredit, SharingHeader } from './Timetable';

interface Color {
  templateBg: string;
  templateContentBg: string;
  tableHeaderBg: string;
  headerText: string;
  chipBg: string;
  chipText: string;
}

export const TEMPLATE_COLORS: Color[] = [
  {
    templateBg:
      'conic-gradient(from 136deg at 57.41% 53.71%, #000 42.11314111948013deg, #3A3A3A 360deg)',
    templateContentBg: 'linear-gradient(161deg, #3D3D3D 5.9%, #181818 96.88%)',
    tableHeaderBg: '#3D3D3D',
    headerText: '#FFFFFF',
    chipBg: 'rgba(42, 42, 42, 0.36)',
    chipText: '#FFFFFF',
  },
  {
    templateBg: '#1A2D58',
    templateContentBg: '#1554DB',
    tableHeaderBg: '#1554DB',
    headerText: '#FFFFFF',
    chipBg: 'rgba(42, 42, 42, 0.36)',
    chipText: '#FFFFFF',
  },
  {
    templateBg:
      'linear-gradient(196deg, #F3BCFE -3.56%, #E7B8FA 4.64%, #C3D6FF 76.88%, #C2D1F1 148.32%, #C9D6F3 155.72%)',
    templateContentBg: '#F9F9F9',
    tableHeaderBg: '#F9F9F9',
    headerText: '#292929',
    chipBg: 'rgba(42, 42, 42, 0.36)',
    chipText: '#FFFFFF',
  },
  {
    templateBg: '#FFFFF',
    templateContentBg: 'linear-gradient(180deg, #A4B9FF 0%, #E2A9D0 100%)',
    tableHeaderBg: '#A4B9FF',
    headerText: '#FFFFFF',
    chipBg: 'rgba(255, 255, 255, 0.25)',
    chipText: '#FFFFFF',
  },
  {
    templateBg: '#EDF8FF',
    templateContentBg:
      'conic-gradient(from 126deg at 48.53% 51.74%, #FFF 0deg, #C5E7FF 41.400000751018524deg, #D9E7FF 54.00000214576721deg, #FDE8FF 77.40000128746033deg, #F3F3F3 113.39999914169312deg, #C5E7FF 140.3999948501587deg, #DAE7FF 153.00000429153442deg, #FDE8FF 174.6000051498413deg, #F4F1F1 205.19999742507935deg, #C5E7FF 224.02934074401855deg, #C5E7FF 245.48347234725952deg, #DCE8FF 258.04187536239624deg, #FDE8FF 262.8000068664551deg, #FEEFFE 275.3999948501587deg, #FFFBFB 296.9999957084656deg, #C5E7FF 311.40000343322754deg, #FDE8FF 333.0000042915344deg, #FFFBFB 351.00000858306885deg)',
    tableHeaderBg: '#C5E7FF',
    headerText: '#292929',
    chipBg: 'rgba(255, 255, 255, 0.25)',
    chipText: '#292929',
  },
];

const Template = forwardRef<HTMLDivElement, PropsWithChildren<{ bgImage: string }>>(
  ({ children, bgImage, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`w-full overflow-hidden rounded-xl px-6 py-16`}
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
        backgroundColor: bgColor,
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

    return (
      <>
        <div className="w-full overflow-hidden px-5" ref={emblaRef}>
          <div className="-ml-5 flex">
            {TEMPLATE_COLORS.map((color, index) => (
              <div key={`template-${index}`} className="min-w-0 flex-[0_0_100%] transform-gpu pl-5">
                <Template
                  bgImage={color.templateBg}
                  ref={selectedIndex === index ? templateRef : null}
                >
                  <TemplateContent bgImage={color.templateContentBg}>
                    <Timetable timetable={timetable} className="!border-0 bg-white">
                      <Timetable.Header
                        as={SharingHeader}
                        bgColor={color.tableHeaderBg}
                        textColor={color.headerText}
                      />
                    </Timetable>
                    <TemplateStudent textColor={color.headerText} />
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
              key={`button-${index}`}
              className={`size-7.5 rounded-full shadow-sm outline-2 transition-colors ${index === selectedIndex ? 'outline-primary' : 'outline-placeholder'}`}
              style={{
                background: color.templateContentBg,
              }}
              type="button"
              onClick={() => scrollTo(index)}
            />
          ))}
        </div>
      </>
    );
  },
);

export default TimetableSharingTemplate;

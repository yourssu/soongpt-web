import { useEffect, useState } from 'react';

import { ActivityLayout } from '@/components/ActivityLayout';
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';

const USAINT_LOGIN_URL = 'https://smartid.ssu.ac.kr/Symtra_sso/smln.asp?apiReturnUrl=example.com';

const carouselContents = [
  {
    image: '/images/landing/1.png',
    description: `클릭 한 번으로 최적의 시간표 완성,<br/>26-1 수강신청도 <strong>숭피티</strong>와 함께!`,
  },
  {
    image: '/images/landing/2.png',
    description: '~~가 새로 추가되었다는 문구',
  },
  {
    image: '/images/landing/3.png',
    description: '로그인 안내 문구',
  },
];

export const LandingActivity = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    const syncCurrentIndex = () => {
      setCurrentIndex(api.selectedScrollSnap());
    };

    syncCurrentIndex();
    api.on('select', syncCurrentIndex);
    api.on('reInit', syncCurrentIndex);

    return () => {
      api.off('select', syncCurrentIndex);
      api.off('reInit', syncCurrentIndex);
    };
  }, [api]);

  const activeSlide = carouselContents[currentIndex];

  return (
    <ActivityLayout>
      <ActivityLayout.ScrollArea>
        <ActivityLayout.Body className="flex w-full items-center justify-center">
          <div className="flex w-full max-w-[390px] flex-col items-center justify-center">
            <h1 className="text-brandPrimary text-center text-[50px]/[1] font-semibold tracking-[-1px]">
              숭피티
            </h1>

            <Carousel className={'mt-10'} setApi={setApi}>
              <CarouselContent className={'h-full w-[340px] *:rounded-md'}>
                {carouselContents.map((content, index) => (
                  <CarouselItem className="flex flex-col items-center gap-4" key={index}>
                    <img
                      alt={`landing-carousel-${index}`}
                      className="h-[340px] w-[300px] rounded-[40px] bg-gray-200 object-cover"
                      src={content.image}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>

            <p
              className={`mt-[23px] h-[60px] w-[300px] text-center text-[20px] leading-[30px] tracking-[-0.4px] text-black`}
              dangerouslySetInnerHTML={{ __html: activeSlide.description }}
            />

            <div className={`mt-[23px] flex h-4 items-center gap-2`}>
              {carouselContents.map((slide, index) => (
                <div
                  className={`rounded-full transition-all duration-200 ${
                    index === currentIndex ? 'bg-brandPrimary size-4' : 'size-3 bg-[#c2c8ff]'
                  }`}
                  key={slide.image}
                />
              ))}
            </div>

            <button
              className="bg-brandPrimary mt-10 h-14 w-[300px] rounded-[16px] text-[16px]/[24px] font-semibold tracking-[-0.32px] text-white"
              onClick={() => {
                window.location.href = USAINT_LOGIN_URL;
              }}
              type="button"
            >
              유세인트 로그인 하기
            </button>
          </div>
        </ActivityLayout.Body>
      </ActivityLayout.ScrollArea>
    </ActivityLayout>
  );
};

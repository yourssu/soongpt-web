import { useEffect, useState } from 'react';

import { ActivityLayout } from '@/components/ActivityLayout';
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

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
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <ActivityLayout>
      <ActivityLayout.ScrollArea>
        <ActivityLayout.Body className={'justify-center'}>
          <div className="text-brandPrimary mb-12 text-[50px] font-semibold">숭피티</div>

          <Carousel setApi={setApi}>
            <CarouselContent className={'h-[340px] w-[300px] *:rounded-md'}>
              {carouselContents.map((content, index) => (
                <CarouselItem className="flex flex-col items-center gap-4" key={index}>
                  <img
                    alt={`landing-carousel-${index}`}
                    className="h-[300px] w-[340px] bg-gray-100 object-cover"
                    src={content.image}
                  />
                  <div
                    className="text-neutralTextSecondary text-center text-lg font-medium"
                    dangerouslySetInnerHTML={{ __html: content.description }}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>

          <div className="mt-12 flex items-center justify-center gap-2 py-2">
            {Array.from({ length: count }).map((_, index) => (
              <div
                className={`rounded-full transition-colors ${
                  index + 1 === current ? 'bg-brandPrimary size-4' : 'size-2.5 bg-gray-300'
                }`}
                key={index}
              />
            ))}
          </div>
        </ActivityLayout.Body>
        <ActivityLayout.Footer>
          <button
            className="bg-brandPrimary w-full rounded-2xl py-3.5 font-semibold text-white"
            type="button"
          >
            유세인트 로그인 하기
          </button>
        </ActivityLayout.Footer>
      </ActivityLayout.ScrollArea>
    </ActivityLayout>
  );
};

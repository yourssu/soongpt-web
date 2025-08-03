/**
 *  hour:minute 형식의 문자열에서 시간과 분을 추출해요.
 */
export const parseCourseTime = (time: string) => {
  const [hour, minute] = time.split(':').map(Number);

  return {
    hour,
    minute,
  };
};

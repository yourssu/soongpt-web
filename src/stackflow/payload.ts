/* eslint-disable @typescript-eslint/naming-convention */

import { CourseType } from '@/schemas/courseSchema';
import { ActivityName } from '@/stackflow/metadata';

type noopPayload = never;

type DrivenType = Record<ActivityName, unknown>;
type EnsureDrivenType<T extends DrivenType> = T;

/**
 * await-push(send/receive)에서 액티비티별 결과 payload 타입을 강제하기 위한 매핑이에요.
 * 이 파일이 없으면 activity 이름과 payload 형태가 느슨하게 연결되어 런타임 오류를 놓치기 쉬워요.
 */
type PayloadOverrides = {
  // payload가 필요한 액티비티만 여기에 추가해요.
  // 예시)
  // timetable_result: { timetableId: number };
  course_search: {
    actionType: '삭제' | '추가';
    course: CourseType;
  };
};

// 모든 ActivityName을 기본적으로 never로 채우고, PayloadOverrides에 정의한 항목만 override해요.
export type ActivityNameWithPayload = EnsureDrivenType<{
  [K in ActivityName]: K extends keyof PayloadOverrides ? PayloadOverrides[K] : noopPayload;
}>;

import { AppScreen } from '@stackflow/plugin-basic-ui';
import { ActivityComponentType } from '@stackflow/react';

import AppBar from '../components/AppBar';
import Timetable from '../components/Timetable';
import { Timetable as TimetableType } from '../schemas/timetableSchema';

const mockTimetable: TimetableType = {
  timetableId: 1,
  tag: '아침 수업 없는 시간표',
  score: 95,
  courses: [
    {
      courseName: '웹프로그래밍기초및실습',
      professorName: '유소율',
      classification: '전공필수',
      credit: 3,
      courseTime: [
        {
          week: '월',
          start: '15:00',
          end: '16:55',
          classroom: '명신관 405',
        },
        {
          week: '월',
          start: '17:00',
          end: '18:50',
          classroom: '명신관 405',
        },
      ],
    },
    {
      courseName: '비전채플',
      professorName: '조은식',
      classification: '전공필수',
      credit: 0.5,
      courseTime: [
        {
          week: '월',
          start: '13:30',
          end: '14:20',
          classroom: '한경직기념관',
        },
      ],
    },
    {
      courseName: '컴퓨터비전',
      professorName: '송현주',
      classification: '전공필수',
      credit: 3,
      courseTime: [
        {
          week: '화',
          start: '12:00',
          end: '13:15',
          classroom: '진리관 305',
        },
        {
          week: '목',
          start: '12:00',
          end: '13:15',
          classroom: '진리관 305',
        },
      ],
    },
    {
      courseName: '운영체제',
      professorName: '홍지만',
      classification: '전공필수',
      credit: 3,
      courseTime: [
        {
          week: '월',
          start: '09:00',
          end: '10:15',
          classroom: '진리관 401',
        },
        {
          week: '수',
          start: '09:00',
          end: '10:15',
          classroom: '진리관 401',
        },
      ],
    },
    {
      courseName: '컴파일러',
      professorName: '김철수',
      classification: '전공선택',
      credit: 3,
      courseTime: [
        {
          week: '화',
          start: '13:30',
          end: '14:45',
          classroom: '명신관 502',
        },
        {
          week: '수',
          start: '13:30',
          end: '14:45',
          classroom: '명신관 502',
        },
      ],
    },
    {
      courseName: '데이터베이스',
      professorName: '박지성',
      classification: '전공선택',
      credit: 3,
      courseTime: [
        {
          week: '화',
          start: '15:00',
          end: '16:15',
          classroom: '진리관 307',
        },
        {
          week: '목',
          start: '15:00',
          end: '16:15',
          classroom: '진리관 307',
        },
      ],
    },
  ],
};

const TimetableSelectionActivity: ActivityComponentType = () => {
  return (
    <AppScreen>
      <div className="min-h-screen py-12">
        <AppBar progress={100} />
        <div className="mt-15 flex flex-col items-center">
          <h2 className="text-center text-[28px] font-semibold">
            사용자님을 위한
            <br />
            시간표를 가져왔어요!
          </h2>
          <div className="mt-10 w-full px-10">
            <Timetable timetable={mockTimetable} />
          </div>
        </div>
      </div>
    </AppScreen>
  );
};

export default TimetableSelectionActivity;

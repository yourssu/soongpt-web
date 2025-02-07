import { createPortal } from 'react-dom';
import CourseListItem from './CourseListItem.tsx';
import { useContext } from 'react';
import { CourseListContext } from '../context/CourseListContext.ts';
import { AnimatePresence, motion } from 'motion/react';

interface SelectedCourseListProps {
  open: boolean;
  handleClose: () => void;
}

const SelectedCourseList = ({ open, handleClose }: SelectedCourseListProps) => {
  const root = document.getElementsByTagName('main')[0];
  const courses = useContext(CourseListContext);

  return (
    root &&
    createPortal(
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-modal/80 absolute inset-0 z-50 flex flex-col-reverse px-4 pt-12 pb-[34px]"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="flex flex-col overflow-auto rounded-2xl bg-white p-4"
            >
              <div className="mb-4 flex flex-1 flex-col gap-3.5 overflow-auto px-4">
                {courses.length === 0 ? (
                  <div>선택된 과목이 없어요.</div>
                ) : (
                  courses.map((course) => (
                    <CourseListItem
                      key={course.courseId}
                      course={course}
                      onClickCourseItem={() => {}}
                      isSelected={false}
                    />
                  ))
                )}
              </div>
              <button
                type="button"
                className="bg-primary w-full rounded-2xl py-3.5 text-base font-semibold text-white"
                onClick={handleClose}
              >
                전공선택과목 보기
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>,
      root,
    )
  );
};

export default SelectedCourseList;

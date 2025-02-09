import { createPortal } from 'react-dom';
import CourseListItem from './CourseListItem.tsx';
import {
  MouseEventHandler,
  TouchEventHandler,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { CourseListContext } from '../context/CourseListContext.ts';
import { AnimatePresence, motion } from 'motion/react';
import useMeasure from 'react-use-measure';

interface SelectedCourseBottomSheetProps {
  open: boolean;
  handleClose: () => void;
}

const SelectedCoursesBottomSheet = ({ open, handleClose }: SelectedCourseBottomSheetProps) => {
  const root = document.getElementsByTagName('main')[0];
  const courses = useContext(CourseListContext);
  const [contentRef, contentBounds] = useMeasure();
  const [dragging, setDragging] = useState(false);
  const startYRef = useRef(0);
  const startValueRef = useRef(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const maxHeight = window.innerHeight - 204;

  useEffect(() => {
    setContainerHeight(Math.min(contentBounds.height, maxHeight));
  }, [contentBounds, maxHeight]);

  const handleMouseDown: MouseEventHandler = (e) => {
    setDragging(true);
    startYRef.current = e.clientY;
    startValueRef.current = containerHeight;
  };

  const handleMouseMove: MouseEventHandler = (e) => {
    if (!dragging) return;
    const deltaY = startYRef.current - e.clientY;
    setContainerHeight(Math.min(deltaY + startValueRef.current, maxHeight));
  };

  const handleMouseUp: MouseEventHandler = () => {
    setDragging(false);

    if (containerHeight < contentBounds.height) setContainerHeight(contentBounds.height);
  };

  const handleTouchStart: TouchEventHandler = (e) => {
    setDragging(true);
    startYRef.current = e.touches[0].clientY;
    startValueRef.current = containerHeight;
  };

  const handleTouchMove: TouchEventHandler = (e) => {
    if (!dragging) return;
    const deltaY = startYRef.current - e.touches[0].clientY;
    setContainerHeight(Math.min(deltaY + startValueRef.current, maxHeight));
  };

  const handleTouchEnd: TouchEventHandler = () => {
    setDragging(false);

    if (containerHeight < contentBounds.height)
      setContainerHeight(Math.min(contentBounds.height, maxHeight));
  };

  return (
    root &&
    createPortal(
      <AnimatePresence>
        {open && (
          <motion.div
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onTouchEnd={handleTouchEnd}
            onTouchMove={handleTouchMove}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-modal/80 absolute inset-0 z-50 flex flex-col-reverse px-4 pt-12 pb-[34px]"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
              className={`flex flex-col ${dragging ? 'overflow-hidden' : 'overflow-auto'} rounded-2xl bg-white px-4 pb-4`}
            >
              <div
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
                className="flex w-full justify-center p-4"
              >
                <div className="bg-hint h-[4px] w-[30px] rounded-[100px] select-none"></div>
              </div>
              <motion.div
                className={`mb-[18px] ${dragging ? 'overflow-hidden' : 'overflow-auto'}`}
                animate={{
                  maxHeight: open ? containerHeight : 0,
                  height: open ? containerHeight : 0,
                }}
                initial={{ maxHeight: 0, height: 0 }}
                exit={{ maxHeight: 0, height: 0 }}
                transition={
                  dragging
                    ? {
                        delay: 0,
                        duration: 0.1,
                      }
                    : undefined
                }
              >
                <div
                  ref={contentRef}
                  className={`flex flex-1 flex-col gap-3.5 ${dragging ? 'overflow-hidden' : 'overflow-auto'} px-4 select-none`}
                >
                  {courses.length === 0 ? (
                    <div>선택된 과목이 없어요.</div>
                  ) : (
                    courses.map((course) => (
                      <CourseListItem
                        key={`${course.courseName} ${course.professorName}`}
                        course={course}
                        onClickCourseItem={() => {}}
                        isSelected={false}
                      />
                    ))
                  )}
                </div>
              </motion.div>
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

export default SelectedCoursesBottomSheet;

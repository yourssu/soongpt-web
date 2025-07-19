import { AnimatePresence, motion } from 'motion/react';
import {
  MouseEventHandler,
  TouchEventHandler,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import useMeasure from 'react-use-measure';

import CourseListItem from '@/components/CourseListItem';
import { CourseListContext } from '@/context/CourseListContext';

interface SelectedCourseBottomSheetProps {
  handleClose: () => void;
  open: boolean;
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
    if (!dragging) {
      return;
    }
    const deltaY = startYRef.current - e.clientY;
    setContainerHeight(Math.min(deltaY + startValueRef.current, maxHeight));
  };

  const handleMouseUp: MouseEventHandler = () => {
    setDragging(false);

    if (containerHeight < contentBounds.height) {
      setContainerHeight(contentBounds.height);
    }
  };

  const handleTouchStart: TouchEventHandler = (e) => {
    setDragging(true);
    startYRef.current = e.touches[0].clientY;
    startValueRef.current = containerHeight;
  };

  const handleTouchMove: TouchEventHandler = (e) => {
    if (!dragging) {
      return;
    }
    const deltaY = startYRef.current - e.touches[0].clientY;
    setContainerHeight(Math.min(deltaY + startValueRef.current, maxHeight));
  };

  const handleTouchEnd: TouchEventHandler = () => {
    setDragging(false);

    if (containerHeight < contentBounds.height) {
      setContainerHeight(Math.min(contentBounds.height, maxHeight));
    }
  };

  return (
    root &&
    createPortal(
      <AnimatePresence>
        {open && (
          <motion.div
            animate={{ opacity: 1 }}
            className="bg-bg-modalLayerDefault/80 absolute inset-0 z-50 flex flex-col-reverse overflow-hidden px-4 pt-12 pb-[34px]"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onTouchEnd={handleTouchEnd}
            onTouchMove={handleTouchMove}
          >
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className={`flex flex-col ${dragging ? 'overflow-hidden' : 'overflow-auto'} rounded-2xl bg-white px-4 pb-4`}
              exit={{ opacity: 0, y: 20 }}
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
            >
              <div
                className="flex w-full justify-center p-4"
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
              >
                <div className="bg-neutralHint h-[4px] w-[30px] rounded-[100px]" />
              </div>
              <motion.div
                animate={{
                  maxHeight: open ? containerHeight : 0,
                  height: open ? containerHeight : 0,
                }}
                className={`mb-[18px] ${dragging ? 'overflow-hidden' : 'overflow-auto'}`}
                exit={{ maxHeight: 0, height: 0 }}
                initial={{ maxHeight: 0, height: 0 }}
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
                  className={`flex flex-1 flex-col gap-3.5 ${dragging ? 'overflow-hidden' : 'overflow-auto'} px-4 select-none`}
                  ref={contentRef}
                >
                  {courses.length === 0 ? (
                    <div>선택된 과목이 없어요.</div>
                  ) : (
                    courses.map((course) => (
                      <CourseListItem
                        course={course}
                        isSelected={false}
                        key={`${course.courseName} ${course.professorName}`}
                        onClickCourseItem={() => {}}
                      />
                    ))
                  )}
                </div>
              </motion.div>
              <button
                className="bg-brandPrimary w-full rounded-2xl py-3.5 text-base font-semibold text-white"
                onClick={handleClose}
                type="button"
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

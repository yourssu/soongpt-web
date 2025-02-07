import SelectedCourseList from './SelectedCourseList.tsx';
import { useState } from 'react';

const ViewSelectedCoursesButton = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <button
        type="button"
        className="bg-pressed text-secondary max-w-52 flex-1 rounded-2xl py-3.5 font-semibold"
        onClick={handleOpen}
      >
        선택한 과목 보기
      </button>
      <SelectedCourseList open={open} handleClose={handleClose} />
    </>
  );
};

export default ViewSelectedCoursesButton;

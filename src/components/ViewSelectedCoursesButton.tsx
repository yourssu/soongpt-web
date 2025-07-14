import { useState } from 'react';

import SelectedCoursesBottomSheet from './SelectedCoursesBottomSheet.tsx';

const ViewSelectedCoursesButton = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <button
        className="bg-pressed text-secondary max-w-52 flex-1 rounded-2xl py-3.5 font-semibold"
        onClick={handleOpen}
        type="button"
      >
        선택한 과목 보기
      </button>
      <SelectedCoursesBottomSheet handleClose={handleClose} open={open} />
    </>
  );
};

export default ViewSelectedCoursesButton;

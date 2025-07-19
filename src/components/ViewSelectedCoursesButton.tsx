import { useState } from 'react';

import SelectedCoursesBottomSheet from '@/components/SelectedCoursesBottomSheet';

const ViewSelectedCoursesButton = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <button
        className="bg-bg-brandLayerDefault text-brandSecondary max-w-52 flex-1 rounded-2xl py-3.5 font-semibold"
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

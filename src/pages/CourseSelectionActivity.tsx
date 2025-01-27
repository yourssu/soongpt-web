import { AppScreen } from '@stackflow/plugin-basic-ui';
import { ActivityComponentType } from '@stackflow/react';
import { useFlow } from '../stackflow';

interface CourseSelectionParams {
  title: string;
}

const CourseSelectionActivity: ActivityComponentType<CourseSelectionParams> = ({
  params: { title },
}) => {
  const { pop } = useFlow();

  const handleClickButton = () => {
    pop();
  };

  return (
    <AppScreen>
      <div className="min-h-screen px-2 py-8">
        <div className="flex flex-col items-center">
          <h1>{title}</h1>
          <button onClick={handleClickButton}>Go to Onboarding page</button>
        </div>
      </div>
    </AppScreen>
  );
};

export default CourseSelectionActivity;

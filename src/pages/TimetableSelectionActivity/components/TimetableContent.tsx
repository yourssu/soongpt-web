import { TimetableContentLayout } from '@/pages/TimetableSelectionActivity/components/TimetableContentLayout';
import { TimetableMutationBaseStatus } from '@/pages/TimetableSelectionActivity/type';

interface TimetableContentProps {
  status: TimetableMutationBaseStatus;
}

export const TimetableContent = ({
  status,
  children,
}: React.PropsWithChildren<TimetableContentProps>) => {
  const { title, description, showShoppingCartButton } = titleContentMap[status];

  return (
    <>
      <TimetableContentLayout.Header
        description={description}
        showShoppingCartButton={showShoppingCartButton}
        title={title}
      />
      <TimetableContentLayout.Body>{children}</TimetableContentLayout.Body>
    </>
  );
};

const titleContentMap: Record<
  TimetableMutationBaseStatus,
  { description?: string; showShoppingCartButton?: boolean; title: string }
> = {
  pending: {
    title: '사용자님을 위한\n시간표를 가져오는 중이에요!',
    description: '원하는 시간표를 장바구니에 담아보세요.',
    showShoppingCartButton: true,
  },
  success: {
    title: '사용자님을 위한\n시간표를 가져왔어요!',
  },
  idle: {
    title: '사용자님을 위한\n시간표를 가져오는 중이에요!',
  },
};

import { Mixpanel } from '@/bootstrap/mixpanel';
import { useAlertDialog } from '@/hooks/useAlertDialog';

interface TimetableContentLayoutHeaderProps {
  description?: string;
  showShoppingCartButton?: boolean;
  title: string;
}

const Header = ({
  title,
  description,
  showShoppingCartButton,
}: TimetableContentLayoutHeaderProps) => {
  const openShoppingCartDialog = useAlertDialog();

  const handleShoppingCartButtonClick = () => {
    openShoppingCartDialog({
      title: '예비 수강신청(장바구니)',
      closeButton: true,
      closeableWithOutside: true,
      content: (
        <div className="font-medium">
          <div>[장바구니 이용 기간]</div>
          <div>
            <span className="text-brandSecondary">7/30(수) 00:00</span> ~ 9/5(금) 09:00
          </div>
          <br />
          <div>[장바구니 이용 제한 기간]</div>
          <div>
            <span className="text-brandSecondary">8/4(월) ~ 8/8(금) 09:00 ~ 16:00은 이용 불가</span>
          </div>
          <div>(수강신청 변경 기간도 이용 불가)</div>
          <br />
          <div>
            - <span className="text-brandSecondary">최대 15과목</span>까지 담기 가능
          </div>
          <br />
          <div>
            - 장바구니에 담아놓아도{' '}
            <span className="text-brandSecondary">자동 수강신청 되지 않음</span>
          </div>
        </div>
      ),
    });
    Mixpanel.trackRegistrationInformationClick('SHOPPING_CART');
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <h2 className="mt-6 text-center text-[28px]/[normal] font-semibold whitespace-pre-wrap">
        {title}
      </h2>
      {!!description && <span className="font-light">{description}</span>}
      {!!showShoppingCartButton && (
        <button
          className="text-brandPrimary text-xs underline"
          onClick={handleShoppingCartButtonClick}
        >
          예비 수강신청(장바구니) 안내
        </button>
      )}
    </div>
  );
};

const Body = ({ children }: React.PropsWithChildren<unknown>) => {
  return <div className="mt-7.5 flex w-full flex-1 flex-col pb-4">{children}</div>;
};

export const TimetableContentLayout = {
  Header,
  Body,
};

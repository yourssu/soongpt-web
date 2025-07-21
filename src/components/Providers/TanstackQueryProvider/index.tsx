import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export const TanstackQueryProvider = ({ children }: React.PropsWithChildren<unknown>) => {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

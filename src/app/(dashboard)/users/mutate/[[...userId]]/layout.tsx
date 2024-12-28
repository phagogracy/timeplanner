import { PageBar } from '@/core/ui/zenlots/src';

export default function AddUsersLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { userId: string };
}) {
  return (
    <div className="flex flex-col">
      <PageBar
        leading={
          <div className="text-base font-bold text-dark-500">
            {params.userId ? 'Update' : 'Add New'} Users
          </div>
        }
      ></PageBar>
      {children}
    </div>
  );
}

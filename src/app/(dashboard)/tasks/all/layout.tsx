import { Button, PageBar } from '@/core/ui/zenlots/src';
import { AddSquare } from 'iconsax-react';

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col">
      <PageBar
        leading={
          <div className="text-base font-bold text-dark-500">Tasks</div>
        }
      >
        <div className="flex">
          <Button
            text="Add New Task"
            className="h-8"
            type="link"
            href="/tasks/mutate"
            prefix={<AddSquare size={18} variant="Bold" className="mr-1" />}
          />
        </div>
      </PageBar>
      {children}
    </div>
  );
}

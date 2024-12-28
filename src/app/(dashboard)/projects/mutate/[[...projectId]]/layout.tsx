import { PageBar } from '@/core/ui/zenlots/src';

export default function ProjectMutationLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { projectId: string };
}) {
  return (
    <div className="flex flex-col">
      <PageBar
        leading={
          <div className="text-base font-bold text-dark-500">
            {params.projectId ? 'Update' : 'Add New'} Project
          </div>
        }
      ></PageBar>
      {children}
    </div>
  );
}

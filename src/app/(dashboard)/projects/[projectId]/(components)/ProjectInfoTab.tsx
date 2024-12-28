import { ProjectResponse } from '@/modules/projects/projectType';
import { format } from "date-fns";

const ProjectInfoTab = ({ project }: { project: ProjectResponse }) => {
  return (
    <div className="m-4 flex flex-col max-w-5xl">
      <div
        className={`h-fit grid md:grid-rows-none grid-rows-3 md:grid-cols-2 mt-4 gap-4`}
      >
        <div className="grid grid-cols-2 md:grid-cols-none md:grid-rows-2">
          <div className="text-sm text-primaryGray-500">Title</div>
          <div className="text-base capitalize">{project.title}</div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-none md:grid-rows-2">
          <div className="text-sm text-primaryGray-500">Start Date</div>
          <div className="text-base capitalize">{format(new Date(project.start_date), "PPpp")}</div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-none md:grid-rows-2">
          <div className="text-sm text-primaryGray-500">End Date</div>
          <div className="text-base capitalize">{format(new Date(project.end_date), "PPpp")}</div>
        </div>
      </div>
    </div>
  );
};
export default ProjectInfoTab;

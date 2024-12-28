"use client";

import { useGetApiResponse } from "@/core/api/getApiResponse";
import { useAppDispatch } from "@/core/redux/clientStore";
import AlertDialog from "@/core/ui/components/AlertDialog";
import Button from "@/core/ui/zenlots/src/components/Button";
import PageBar from "@/core/ui/zenlots/src/components/PageBar";
import Spinner from "@/core/ui/zenlots/src/components/Spinner";
import projectApi from "@/modules/projects/projectApi";
import { ProjectResponse } from "@/modules/projects/projectType";
import { CloseSquare, Edit2, Trash } from "iconsax-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ProjectInfoTab from "./(components)/ProjectInfoTab";

export default function EachProjectPage({
  params,
}: {
  params: { projectId: string };
}) {
  const navigator = useRouter();
  const dispatch = useAppDispatch();
  const [tab, setTab] = useState(0);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [onDelete, setOnDelete] = useState<any>(undefined);

  useEffect(() => {
    if (params.projectId) {
      dispatch(projectApi.endpoints.getProject.initiate(params.projectId));
    }
  }, [params, params.projectId]);

  const projectData = useGetApiResponse<ProjectResponse>(
    `getProject("${params.projectId ? params.projectId : undefined}")`
  );

  return (
    <>
      <AlertDialog
        isOpen={modalIsOpen}
        deleteContent={`Project: ${onDelete}`}
        onClickNo={() => {
          setIsOpen(false);
        }}
        onClickYes={async () => {
          if (onDelete) {
            await Promise.resolve(
              dispatch(projectApi.endpoints.deleteProject.initiate(onDelete))
            );
            navigator.push("/projects");
          }
          setIsOpen(false);
          setOnDelete(undefined);
        }}
      />
      <div className="flex flex-col">
        {projectData ? (
          <>
            <PageBar
              leading={
                <div className="flex flex-col pt-6 pb-4">
                  <div className="text-sm font-medium text-primaryGray-500">
                    #{projectData.id}
                  </div>
                  <div className="text-base font-bold text-dark-500">
                    Project For {projectData.title}
                  </div>
                </div>
              }
              bottom={
                <div className="flex gap-4 text-base font-normal text-primaryGray-500 pb-2">
                  <button
                    className={
                      tab == 0
                        ? "text-dark-500 font-semibold relative text-sm"
                        : "text-dark-500 font-normal text-sm"
                    }
                    onClick={() => {
                      setTab(0);
                    }}
                  >
                    Project Information
                    {tab == 0 ? (
                      <div className="absolute top-[calc(100%+6px)] h-[2px] w-full bg-dark-500 rounded-md"></div>
                    ) : (
                      <></>
                    )}
                  </button>

                  <button
                    className={
                      tab == 1
                        ? "text-dark-500 font-semibold relative text-sm"
                        : "text-dark-500 font-normal text-sm"
                    }
                    onClick={() => {
                      setTab(1);
                    }}
                  >
                    Project Tasks
                    {tab == 1 ? (
                      <div className="absolute top-[calc(100%+6px)] h-[2px] w-full bg-dark-500 rounded-md"></div>
                    ) : (
                      <></>
                    )}
                  </button>
                </div>
              }
            >
              <div className="flex gap-2">
                <Button
                  className="w-9 h-9"
                  buttonType="bordered"
                  prefix={<Trash size={20} variant="Bold" />}
                  onClick={() => {
                    if (params.projectId) {
                      setOnDelete(params.projectId);
                      setIsOpen(true);
                    }
                  }}
                />
                <Button
                  className="w-9 h-9"
                  buttonType="bordered"
                  prefix={<Edit2 size={20} variant="Bold" />}
                  type="link"
                  href={`/projects/mutate/${params.projectId}`}
                />
                <Button
                  className="w-9 h-9"
                  buttonType="bordered"
                  type="button"
                  onClick={() => {
                    navigator.push("/projects/all");
                  }}
                  suffix={<CloseSquare size={20} variant="Bold" />}
                />
              </div>
            </PageBar>
            {tab == 0 ? <ProjectInfoTab project={projectData} /> : <></>}
          </>
        ) : (
          <div className="flex justify-center items-center min-h-[calc(100vh-3.25rem)]">
            <Spinner />
          </div>
        )}
      </div>
    </>
  );
}

"use client";

import { useAppDispatch, useAppSelector } from "@/core/redux/clientStore";
import { RootState } from "@/core/redux/store";
import { PaginatedResponseType } from "@/core/types/responseTypes";
import AlertDialog from "@/core/ui/components/AlertDialog";
import PaginationNav from "@/core/ui/components/Pagination";
import SelectorV2 from "@/core/ui/components/Selector";
import {
  Button,
  DateSelector,
  TableCard,
  tableStyles,
  TextField,
} from "@/core/ui/zenlots/src";
import projectApi from "@/modules/projects/projectApi";
import {
  ProjectResponse,
  ProjectSchemaType,
} from "@/modules/projects/projectType";
import { format } from "date-fns";
import { useFormik } from "formik";
import { SearchNormal1 } from "iconsax-react";
import Link from "next/link";
import { Edit2, Trash } from "iconsax-react";
import { useEffect, useState } from "react";
import { SingleValue } from "react-select";


const ProjectTableListing = () => {
  const dispatch = useAppDispatch();
  const [deleteModelOpen, toggleDeleteModel] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [onDelete, setOnDelete] = useState<any>(undefined);

  useEffect(() => {
    dispatch(
      projectApi.endpoints.getAllProjects.initiate({
        pageIndex: pageIndex,
      })
    );
  }, [dispatch, pageIndex]);

  const projectsData = useAppSelector(
    (state: RootState) =>
      state.baseApi.queries[`getAllProjects`]
        ?.data as PaginatedResponseType<ProjectResponse>
  );

  return (
    <>
      <AlertDialog
        isOpen={deleteModelOpen}
        deleteContent={onDelete}
        onClickNo={() => {
          toggleDeleteModel(false);
        }}
        onClickYes={async () => {
          if (onDelete) {
            await Promise.resolve(
              dispatch(
                projectApi.endpoints.deleteProject.initiate(onDelete as string)
              )
            );
          }
          toggleDeleteModel(false);
          setOnDelete(undefined);
        }}
      />
      <TableCard
        footer={
          projectsData && projectsData?.results.length ? (
            <PaginationNav
              gotoPage={setPageIndex}
              canPreviousPage={pageIndex > 0}
              canNextPage={pageIndex < projectsData.pagination.total_page - 1}
              pageCount={projectsData.pagination.total_page}
              pageIndex={projectsData.pagination.current_page - 1}
            />
          ) : (
            <></>
          )
        }
      >
        <thead className="tracking-wider">
          <tr className={tableStyles.table_thead_tr}>
            <th className={tableStyles.table_th}>S.N.</th>
            <th className={tableStyles.table_th}>Project Title</th>
            <th className={tableStyles.table_th}>Start Date</th>
            <th className={tableStyles.table_th}>End Date</th>
            <th className={tableStyles.table_th}>ACTIONS</th>
          </tr>
        </thead>
        <tbody className="tracking-wider">
          {projectsData?.results.map((project, index) => {
            return (
              <tr
                key={index}
                className={`${tableStyles.table_tbody_tr} hover:bg-slate-50`}
              >
                <td className={`${tableStyles.table_td} font-bold`}>
                  {index + 1}.
                </td>
                <td className={tableStyles.table_td}>{project.title}</td>
                <td className={tableStyles.table_td}>
                  {format(new Date(project.start_date), "PPpp")}
                </td>
                <td className={tableStyles.table_td}>
                  {format(new Date(project.end_date), "PPpp")}
                </td>
                <td className={tableStyles.table_td}>
                  <div className={`flex items-stretch h-full gap-2 max-w-xs`}>
                    <Button
                      className="h-8 w-8"
                      type="link"
                      href={`/projects/mutate/${project.id}/`}
                      prefix={<Edit2 size={18} variant="Bold" />}
                    />
                    <Button
                      className="h-8 w-8"
                      kind="danger"
                      type="button"
                      prefix={<Trash size={18} variant="Bold" />}
                      onClick={() => {
                        setOnDelete(project.id);
                        toggleDeleteModel(true);
                      }}
                    />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </TableCard>
    </>
  );
};

export default ProjectTableListing;

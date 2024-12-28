"use client";

import { useGetApiResponse } from "@/core/api/getApiResponse";
import { useAppDispatch, useAppSelector } from "@/core/redux/clientStore";
import { RootState } from "@/core/redux/store";
import { PaginatedResponseType } from "@/core/types/responseTypes";
import { SelectorDataType } from "@/core/types/selectorTypes";
import SelectorV2 from "@/core/ui/components/Selector";
import {
  Button,
  DateSelector,
  FormCard,
  FormGroup,
  TextField,
} from "@/core/ui/zenlots/src";
import {
  ProjectSchemaType,
  ProjectResponse,
  projectSchema,
} from "@/modules/projects/projectType";
import projectApi from "@/modules/projects/projectApi";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SingleValue } from "react-select";
import { toFormikValidate } from "zod-formik-adapter";

const Page = ({ params }: { params: { projectId: string } }) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (params.projectId) {
      dispatch(projectApi.endpoints.getProject.initiate(params.projectId));
    }
  }, [params, dispatch]);

  const toMutateProjectData = useGetApiResponse<ProjectResponse>(
    `getProject("${params.projectId ? params.projectId : undefined}")`
  );

  const onSubmit = async (values: ProjectSchemaType) => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);
    try {
      var data = params.projectId
        ? await Promise.resolve(
            dispatch(
              projectApi.endpoints.updateProject.initiate({
                id: params.projectId,
                ...values,
              })
            )
          )
        : await Promise.resolve(
            dispatch(projectApi.endpoints.addProject.initiate(values))
          );

      if (Object.prototype.hasOwnProperty.call(data, "data")) {
        router.push("/projects/all");
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const formik = useFormik<ProjectSchemaType>({
    enableReinitialize: true,
    initialValues: {
      title: toMutateProjectData ? toMutateProjectData.title : "",
      startDate: toMutateProjectData?.start_date
        ? new Date(toMutateProjectData.start_date)
        : undefined,
      endDate: toMutateProjectData?.end_date
        ? new Date(toMutateProjectData.end_date)
        : undefined,
    },
    validate: toFormikValidate(projectSchema),
    onSubmit,
  });

  return (
    <FormCard onSubmit={formik.handleSubmit} className="m-4">
      <FormGroup title="Project Information">
        <div className="flex flex-col gap-2 mb-2">
          <TextField
            id="title"
            placeholder="Project Title"
            type="text"
            label="Title"
            className="flex-1"
            {...formik.getFieldProps("title")}
          />
          {!!formik.errors.title && (
            <div className="text-red-500 text-sm">{formik.errors.title}</div>
          )}
        </div>
        <div className="flex gap-2 mb-2 max-sm:flex-col">
          <div className="flex flex-col flex-1">
            <DateSelector
              id="start_date"
              label="Start Date"
              onChange={(startDate) =>
                formik.setFieldValue("startDate", startDate)
              }
              value={
                formik.values.startDate
                  ? new Date(formik.values.startDate)
                  : undefined
              }
            />
            {!!formik.errors.startDate && (
              <div className="text-red-500 text-sm">
                {formik.errors.startDate}
              </div>
            )}
          </div>
          <div className="flex flex-col flex-1">
            <DateSelector
              id="end_date"
              label="End Date"
              onChange={(endDate) => formik.setFieldValue("endDate", endDate)}
              value={
                formik.values.endDate
                  ? new Date(formik.values.endDate)
                  : undefined
              }
            />
            {!!formik.errors.endDate && (
              <div className="text-red-500 text-sm">
                {formik.errors.endDate}
              </div>
            )}
          </div>
        </div>
      </FormGroup>
      <div className="flex justify-end gap-2 m-4">
        <Button
          text="Submit"
          className="h-8 w-fit"
          type="submit"
          isLoading={isLoading}
        />
        <Button
          text="Cancel"
          kind="danger"
          className="h-8 w-fit"
          buttonType="flat"
          onClick={() => {
            router.back();
          }}
        />
      </div>
    </FormCard>
  );
};

export default Page;

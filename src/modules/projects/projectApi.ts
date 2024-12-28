import { apiPaths, setHeaders } from "@/core/api/apiConstants";
import { baseApi } from "@/core/api/apiQuery";
import { PaginatedResponseType } from "@/core/types/responseTypes";
import { toast } from "react-toastify";
import { ProjectResponse, ProjectSchemaType } from "./projectType";

const projectApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addProject: builder.mutation<any, ProjectSchemaType>({
      query: (payload) => {
        var formData = new FormData();
        if (payload.title) formData.append("title", payload.title);
        if (payload.startDate)
          formData.append("start_date", payload.startDate.toISOString());
        if (payload.endDate)
          formData.append("end_date", payload.endDate.toISOString());
        return {
          url: `${apiPaths.projectUrl}/`,
          method: "POST",
          body: formData,
          prepareHeaders: async (headers: Headers) => await setHeaders(headers),
        };
      },
      async onQueryStarted(payload, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Project Created.");
        } catch (err) {
          console.log(err);
          toast.error("Failed creating a project.");
        }
      },
      transformResponse: (response: any) => {
        return response;
      },
    }),
    getAllProjects: builder.query<
      PaginatedResponseType<ProjectResponse>,
      { pageIndex: number }
    >({
      query: (props) => {
        return `${apiPaths.projectUrl}/?page=${props.pageIndex}`;
      },
      providesTags: (response) =>
        response
          ? [
              ...response?.results?.map(
                ({ id }) => ({ type: "Projects", id }) as const
              ),
              { type: "Projects", id: "LIST" },
            ]
          : [{ type: "Projects", id: "LIST" }],
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },
      async onQueryStarted(payload, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err) {
          console.log(err);
        }
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
    }),

    getProject: builder.query<ProjectResponse, string>({
      query: (projectId) => `${apiPaths.projectUrl}/${projectId}/`,
      providesTags: (result, error, projectId) => {
        return [{ type: "Projects", projectId }];
      },
      serializeQueryArgs: ({ queryArgs, endpointName }) => {
        return `${endpointName}("${queryArgs}")`;
      },
      async onQueryStarted(payload, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err) {
          console.log(err);
          toast.error(JSON.stringify(err));
        }
      },
    }),

    deleteProject: builder.mutation<void, string>({
      query(projectId) {
        return {
          url: `${apiPaths.projectUrl}/${projectId}/`,
          method: "DELETE",
        };
      },
      async onQueryStarted(payload, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Project has been deleted.");
        } catch (err) {
          console.log(err);
          toast.error("Failed deleting a project.");
        }
      },
      invalidatesTags: (result, error, projectId) => [
        { type: "Projects", projectId },
      ],
    }),

    updateProject: builder.mutation<ProjectResponse, ProjectSchemaType>({
      query: ({ id, ...payload }) => {
        var formData = new FormData();
        if (payload.title) formData.append("title", payload.title);
        if (payload.startDate)
          formData.append("start_date", payload.startDate.toISOString());
        if (payload.endDate)
          formData.append("end_date", payload.endDate.toISOString());
        return {
          url: `${apiPaths.projectUrl}/${id}/`,
          method: "PATCH",
          body: formData,
          prepareHeaders: async (headers: Headers) => await setHeaders(headers),
        };
      },
      async onQueryStarted(payload, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Project Updated.");
        } catch (err) {
          console.log(err);

          toast.error("Failed updating a project.");
        }
      },
      invalidatesTags: (result, error, { id }) => [{ type: "Projects", id }],
    }),
  }),
  overrideExisting: true,
});

export default projectApi;

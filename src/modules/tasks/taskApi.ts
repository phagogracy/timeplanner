import { apiPaths, setHeaders } from "@/core/api/apiConstants";
import { baseApi } from "@/core/api/apiQuery";
import { PaginatedResponseType } from "@/core/types/responseTypes";
import { toast } from "react-toastify";
import { TaskResponse, TaskSchemaType } from "./taskType";

const taskApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addTask: builder.mutation<any, TaskSchemaType>({
      query: (payload) => {
        var formData = new FormData();
        if (payload.title) formData.append("title", payload.title);
        if (payload.description)
          formData.append("description", payload.description);
        if (payload.assigned_to) formData.append("title", payload.assigned_to);
        if (payload.startDate)
          formData.append("start_date", payload.startDate.toISOString());
        if (payload.endDate)
          formData.append("end_date", payload.endDate.toISOString());
        return {
          url: `${apiPaths.taskUrl}/`,
          method: "POST",
          body: formData,
          prepareHeaders: async (headers: Headers) => await setHeaders(headers),
        };
      },
      async onQueryStarted(payload, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Task Created.");
        } catch (err) {
          console.log(err);
          toast.error("Failed creating a task.");
        }
      },
      transformResponse: (response: any) => {
        return response;
      },
    }),
    getAllTasks: builder.query<
      PaginatedResponseType<TaskResponse>,
      { pageIndex: number }
    >({
      query: (props) => {
        return `${apiPaths.taskUrl}/?page=${props.pageIndex}`;
      },
      providesTags: (response) =>
        response
          ? [
              ...response?.results?.map(
                ({ id }) => ({ type: "Tasks", id }) as const
              ),
              { type: "Tasks", id: "LIST" },
            ]
          : [{ type: "Tasks", id: "LIST" }],
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

    getTask: builder.query<TaskResponse, string>({
      query: (taskId) => `${apiPaths.taskUrl}/${taskId}/`,
      providesTags: (result, error, taskId) => {
        return [{ type: "Tasks", taskId }];
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

    deleteTask: builder.mutation<void, string>({
      query(taskId) {
        return {
          url: `${apiPaths.taskUrl}/${taskId}/`,
          method: "DELETE",
        };
      },
      async onQueryStarted(payload, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Task has been deleted.");
        } catch (err) {
          console.log(err);
          toast.error("Failed deleting a task.");
        }
      },
      invalidatesTags: (result, error, taskId) => [{ type: "Tasks", taskId }],
    }),

    updateTask: builder.mutation<TaskResponse, TaskSchemaType>({
      query: ({ id, ...payload }) => {
        var formData = new FormData();
        if (payload.title) formData.append("title", payload.title);
        if (payload.description)
          formData.append("description", payload.description);
        if (payload.assigned_to) formData.append("title", payload.assigned_to);
        if (payload.startDate)
          formData.append("start_date", payload.startDate.toISOString());
        if (payload.endDate)
          formData.append("end_date", payload.endDate.toISOString());
        return {
          url: `${apiPaths.taskUrl}/${id}/`,
          method: "PATCH",
          body: formData,
          prepareHeaders: async (headers: Headers) => await setHeaders(headers),
        };
      },
      async onQueryStarted(payload, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("Task Updated.");
        } catch (err) {
          console.log(err);

          toast.error("Failed updating a task.");
        }
      },
      invalidatesTags: (result, error, { id }) => [{ type: "Tasks", id }],
    }),
  }),
  overrideExisting: true,
});

export default taskApi;

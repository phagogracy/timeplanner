import { apiPaths } from "@/core/api/apiConstants";
import { baseApi } from "@/core/api/apiQuery";
import { PaginatedResponseType } from "@/core/types/responseTypes";
import { toast } from "react-toastify";
import { UserResponse, UserSchemaType } from "./usersType";

const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addUser: builder.mutation<any, UserSchemaType>({
      query: (payload) => {
        const formData = new FormData();

        formData.append("username", payload.username);
        formData.append("email", payload.email);
        formData.append("is_staff", payload.is_staff.toString());
        formData.append("password", payload.password);
        return {
          url: `${apiPaths.userUrl}/`,
          method: "POST",
          body: formData,
        };
      },
      async onQueryStarted(payload, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("User Created.");
        } catch (err) {
          console.log(err);
          toast.error("Failed creating a user.");
        }
      },
      transformResponse: (response: any) => {
        return response;
      },
    }),

    // Get All
    getUser: builder.query<PaginatedResponseType<UserResponse>, number>({
      query: (pageNumber) => `${apiPaths.userUrl}?page=${pageNumber}`,
      providesTags: (response) =>
        response
          ? [
              ...response?.results?.map(
                ({ id }) => ({ type: "Users", id }) as const
              ),
              { type: "Users", id: "LIST" },
            ]
          : [{ type: "Users", id: "LIST" }],
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
    // Get each User
    getEachUser: builder.query<UserResponse, string>({
      query: (userId) => `${apiPaths.userUrl}${userId}/`,
      providesTags: (result, error, userId) => {
        return [{ type: "Users", userId }];
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

    // delete each User

    deleteUser: builder.mutation<void, string>({
      query(username) {
        return {
          url: `${apiPaths.userUrl}${username}/`,
          method: "DELETE",
        };
      },
      async onQueryStarted(payload, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("User has been deleted.");
        } catch (err) {
          console.log(err);
          toast.error("Failed deleting a user.");
        }
      },
      invalidatesTags: (result, error, userId) => [{ type: "Users", userId }],
    }),
    
    updateUser: builder.mutation<UserResponse, UserSchemaType>({
      query: ({ username, ...payload }) => {
        const formData = new FormData();

        if (payload.id) {
          formData.append("id", payload.id);
        }
        return {
          url: `${apiPaths.userUrl}${payload.id}/`,
          method: "PATCH",
          body: formData,
        };
      },
      async onQueryStarted(payload, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success("User Updated.");
        } catch (err) {
          console.log(err);
          toast.error("Failed updating a user.");
        }
      },
      invalidatesTags: (result, error, username) => [
        { type: "Users", username },
      ],
    }),
  }),
  overrideExisting: true,
});

export default userApi;

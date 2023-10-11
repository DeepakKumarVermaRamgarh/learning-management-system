import { apiSlice } from "../api/apiSlice";

export const courseApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createCourse: builder.mutation({
      query: (data) => ({
        url: "create-course",
        method: "POST",
        body: data,
        credientials: "include" as const,
      }),
    }),
    getAllCourses: builder.query({
      query: () => ({
        url: "get-all-courses",
        method: "GET",
        credientials: "include" as const,
      }),
    }),
    delteCourse: builder.mutation({
      query: (id) => ({
        url: `delete-course/${id}`,
        method: "DELETE",
        credientials: "include" as const,
      }),
    }),
    getCourse: builder.query({
      query: (id) => ({
        url: `get-course/${id}`,
        method: "GET",
        credientials: "include" as const,
      }),
    }),
    editCourse: builder.mutation({
      query: ({ courseId, data }) => ({
        url: `/edit-course/${courseId}`,
        method: "PUT",
        body: data,
        credientials: "include" as const,
      }),
    }),
    getCourses: builder.query({
      query: () => ({
        url: "get-courses",
        method: "GET",
        credientials: "include" as const,
      }),
    }),
  }),
});

export const {
  useCreateCourseMutation,
  useGetAllCoursesQuery,
  useDelteCourseMutation,
  useGetCourseQuery,
  useEditCourseMutation,
  useGetCoursesQuery,
} = courseApi;

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
    deleteCourse: builder.mutation({
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
    getCourseDetails: builder.query({
      query: (id) => ({
        url: `get-course/${id}`,
        method: "GET",
        credientials: "include" as const,
      }),
    }),
    getCourseContent: builder.query({
      query: (id) => ({
        url: `get-course-content/${id}`,
        method: "GET",
        credientials: "include" as const,
      }),
    }),
    addNewQuestion: builder.mutation({
      query: ({ question, courseId, contentId }) => ({
        url: `add-question`,
        method: "PUT",
        body: { question, courseId, contentId },
        credientials: "include" as const,
      }),
    }),
    addAnswerInQuestion: builder.mutation({
      query: ({ answer, courseId, contentId, questionId }) => ({
        url: `add-answer`,
        method: "PUT",
        body: { answer, courseId, contentId, questionId },
        credientials: "include" as const,
      }),
    }),
    addReviewInCourse: builder.mutation({
      query: ({ courseId, review, rating }) => ({
        url: `add-review/${courseId}`,
        method: "PUT",
        body: { review, rating },
        credientials: "include" as const,
      }),
    }),
    addReplyInReview: builder.mutation({
      query: ({ comment, courseId, reviewId }) => ({
        url: `add-reply/${reviewId}`,
        method: "PUT",
        body: { comment, courseId, reviewId },
        credientials: "include" as const,
      }),
    }),
    getAllCourses: builder.query({
      query: () => ({
        url: "get-all-courses",
        method: "GET",
        credentials: "include" as const,
      }),
    }),
  }),
});

export const {
  useCreateCourseMutation,
  useGetAllCoursesQuery,
  useDeleteCourseMutation,
  useGetCourseQuery,
  useEditCourseMutation,
  useGetCoursesQuery,
  useGetCourseDetailsQuery,
  useGetCourseContentQuery,
  useAddNewQuestionMutation,
  useAddAnswerInQuestionMutation,
  useAddReviewInCourseMutation,
  useAddReplyInReviewMutation,
} = courseApi;

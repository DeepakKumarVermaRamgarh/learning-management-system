import React, { FC, useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { AiOutlineDelete } from "react-icons/ai";
import { FiEdit2 } from "react-icons/fi";
import { Box, Button, Modal } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {
  useDeleteCourseMutation,
  useGetAllCoursesQuery,
} from "@/redux/features/courses/courseApi";
import Loader from "../../Loader/Loader";
import { format } from "timeago.js";
import { styles } from "@/app/styles/style";
import toast from "react-hot-toast";
import Link from "next/link";

type Props = {};

const AllCourses: FC<Props> = () => {
  const { theme, setTheme } = useTheme();
  const {
    data,
    isLoading,
    refetch,
    error: courseFetchError,
  } = useGetAllCoursesQuery(undefined, { refetchOnMountOrArgChange: true });
  const [open, setOpen] = useState(false);
  const [courseId, setCourseId] = useState("");
  const [deleteCourse, { isSuccess, error }] = useDeleteCourseMutation({});

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "title", headerName: "Course Title", flex: 1 },
    { field: "ratings", headerName: "Ratings", flex: 0.3 },
    { field: "purchased", headerName: "Purchased", flex: 0.3 },
    { field: "created_at", headerName: "Created At", flex: 0.5 },
    {
      field: "edit",
      headerName: "Edit",
      flex: 0.2,
      renderCell: (params: any) => (
        <>
          <Link href={`/admin/edit-course/${params.row.id}`}>
            <FiEdit2 className="dark:text-white text-black" size={20} />
          </Link>
        </>
      ),
    },
    {
      field: "delete",
      headerName: "Delete",
      flex: 0.2,
      renderCell: (params: any) => (
        <>
          <Button
            onClick={() => {
              setOpen(!open);
              setCourseId(params.row.id);
            }}
          >
            <AiOutlineDelete className="dark:text-white text-black" size={20} />
          </Button>
        </>
      ),
    },
  ];

  const rows: any = [];

  {
    data &&
      data.courses.forEach((item: any) => {
        const { _id, name, ratings, purchased, createdAt } = item;
        rows.push({
          id: _id,
          title: name,
          ratings,
          purchased,
          created_at: format(createdAt),
        });
      });
  }

  const handleDelete = async () => {
    const id = courseId;
    await deleteCourse(id);
  };

  useEffect(() => {
    if (isSuccess) {
      setOpen(false);
      refetch();
      toast.success("Course Deleted Successfully!");
    }
    if (error) {
      if ("data" in error) {
        const errorMessage = error as any;
        toast.error(errorMessage.data.message);
      }
    }
    if (courseFetchError) {
      if ("data" in courseFetchError) {
        const errorMessage = courseFetchError as any;
        toast.error(errorMessage.data.message);
      }
    }
  }, [error, isSuccess, courseFetchError]);

  return (
    <div className="mt-[120px]">
      {isLoading ? (
        <Loader />
      ) : (
        <Box m={"20px"}>
          <Box
            m="40px 0 0 0"
            height="80vh"
            sx={{
              "& .MuiDataGrid-root": {
                border: "none",
                outline: "none",
              },
              "& .css-1iyq7zh-MuiDataGrid-columnHeaders": {
                color: theme === "dark" ? "#fff" : "#000",
              },
              "& .MuiDataGrid-sortIcon": {
                color: theme === "dark" ? "#fff" : "#000",
              },
              "& .MuiDataGrid-row": {
                color: theme === "dark" ? "#fff" : "#000",
                borderBottom:
                  theme === "dark"
                    ? "1px solid #ffffff30 !important"
                    : "1px solid #ccc !important",
              },
              "& .MuiTablePagination-root": {
                color: theme === "dark" ? "#fff" : "#000",
              },
              "& .MuiDataGrid-cell": {
                borderBottom: "none",
              },
              "& .name-column--cell": {
                color: theme === "dark" ? "#fff" : "#000",
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: theme === "dark" ? "#1f2a40" : "#f2f0f0",
              },
              "& .MuiDataGrid-virtualScroller": {
                backgroundColor: theme === "dark" ? "#1f2a40" : "#f2f0f0",
              },
              "& .MuiDataGrid-footerContainer": {
                color: theme === "dark" ? "#fff" : "#000",
                borderTop: "none",
                backgroundColor: theme === "dark" ? "#3e4396" : "#a4a9fc",
              },
              "& .MuiCheckbox-root": {
                color:
                  theme === "dark" ? "#b7ebde !important" : "#000 !important",
              },
              "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                color: "#fff !important",
              },
            }}
          >
            <DataGrid checkboxSelection rows={rows} columns={columns} />
          </Box>

          {open && (
            <Modal
              open={open}
              onClose={() => setOpen(!open)}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-5">
                <h1 className={styles.title}>
                  Are you sure you want to delete this course ?
                </h1>
                <div className="flex w-full items-center justify-between mb-6 mt-6 ">
                  <div
                    className={`${styles.button} !w-[120px] h-[30px] `}
                    onClick={() => setOpen(!open)}
                  >
                    Cancel
                  </div>
                  <div
                    className={`${styles.button} !w-[120px] h-[30px] bg-[crimson] `}
                    onClick={handleDelete}
                  >
                    Delete
                  </div>
                </div>
              </Box>
            </Modal>
          )}
        </Box>
      )}
    </div>
  );
};

export default AllCourses;

import React, { FC } from "react";
import { useTheme } from "next-themes";
import { AiOutlineDelete } from "react-icons/ai";
import { FiEdit2 } from "react-icons/fi";
import { Box, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useGetAllCoursesQuery } from "@/redux/features/courses/courseApi";
import Loader from "../../Loader/Loader";
import { format } from "timeago.js";

type Props = {};

const AllCourses: FC<Props> = () => {
  const { theme, setTheme } = useTheme();
  const { data, isLoading } = useGetAllCoursesQuery({});

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "title", headerName: "Course Title", flex: 1 },
    { field: "ratings", headerName: "Ratings", flex: 0.5 },
    { field: "purchased", headerName: "Purchased", flex: 0.5 },
    { field: "created_at", headerName: "Created At", flex: 0.5 },
    {
      field: "",
      headerName: "Edit",
      flex: 0.2,
      renderCell: () => (
        <>
          <Button>
            <FiEdit2 className="dark:text-white text-black" size={20} />
          </Button>
        </>
      ),
    },
    {
      field: "",
      headerName: "Delete",
      flex: 0.2,
      renderCell: () => (
        <>
          <Button>
            <AiOutlineDelete className="dark:text-white text-black" size={20} />
          </Button>
        </>
      ),
    },
  ];

  // create row array using typescript
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
              "& .css-pqjvzy-MuiSvgIcon-root-MuiSelect-icon": {
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
        </Box>
      )}
    </div>
  );
};

export default AllCourses;

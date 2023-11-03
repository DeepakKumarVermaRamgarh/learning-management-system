import { useState, useEffect } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import { useTheme } from "next-themes";
import { format } from "timeago.js";
import { AiOutlineMail } from "react-icons/ai";
import { useGetAllOrdersQuery } from "@/redux/features/orders/ordersApi";
import { useGetAllUsersQuery } from "@/redux/features/user/userApi";
import { useGetAllCoursesQuery } from "@/redux/features/courses/courseApi";
import Loader from "../../Loader/Loader";

type Props = {
  isDashboard?: boolean;
};

const AllInvoices = ({ isDashboard }: Props) => {
  const { theme, setTheme } = useTheme();
  const { data, isLoading } = useGetAllOrdersQuery(undefined, {});
  const { data: usersData } = useGetAllUsersQuery(undefined, {});
  const { data: coursesData } = useGetAllCoursesQuery(undefined, {});

  const [orderData, setOrderData] = useState<any[]>([]);

  useEffect(() => {
    if (data) {
      const temp = data.orders.map((order: any) => {
        const user = usersData?.users.find(
          (user: any) => user._id === order.userId
        );
        const course = coursesData?.courses.find(
          (course: any) => course._id === order.courseId
        );
        return {
          ...order,
          userName: user?.name,
          userEmail: user?.email,
          title: course?.name,
          price: "Rs." + course?.price,
        };
      });
      setOrderData(temp);
    }
  }, [coursesData?.courses, data, usersData?.user]);

  const columns: any[] = [
    { field: "id", headerName: "ID", flex: 0.3 },
    { field: "userName", headerName: "Name", flex: isDashboard ? 0.6 : 0.5 },
    ...(isDashboard
      ? []
      : [
          { field: "userEmail", headerName: "Email", flex: 1 },
          { field: "title", headerName: "Course Title", flex: 1 },
        ]),
    { field: "price", headerName: "Price", flex: 0.5 },
    ...(isDashboard
      ? [{ field: "created_at", headerName: "Created At", flex: 0.5 }]
      : [
          {
            field: "mail",
            headerName: "Mail",
            flex: 0.2,
            rederCell: (params: any) => {
              return (
                <a href={`mailto:${params.row.userEmail}`}>
                  <AiOutlineMail
                    className="dark:text-white text-black"
                    size={20}
                  />
                </a>
              );
            },
          },
        ]),
  ];

  const rows: any[] = [];

  orderData &&
    orderData.forEach((order: any) => {
      const { _id: id, userName, userEmail, title, price, createdAt } = order;
      rows.push({
        id,
        userName,
        userEmail,
        title,
        price,
        created_at: format(createdAt),
      });
    });

  return (
    <div className={!isDashboard ? "mt-[120px]" : "mt-0"}>
      {isLoading ? (
        <Loader />
      ) : (
        <Box m={isDashboard ? "0" : "40px"}>
          <Box
            m={isDashboard ? "0" : "40px 0 0 0"}
            height={isDashboard ? "35vh" : "90vh"}
            overflow={"hidden"}
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
            <DataGrid
              checkboxSelection={isDashboard ? false : true}
              rows={rows}
              columns={columns}
              components={isDashboard ? {} : { Toolbar: GridToolbar }}
            />
          </Box>
        </Box>
      )}
    </div>
  );
};

export default AllInvoices;

import React, { FC, FormEvent, useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { AiOutlineDelete, AiOutlineMail } from "react-icons/ai";
import { Box, Button, Modal } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { format } from "timeago.js";
import Loader from "@/app/components/Loader/Loader";
import {
  useDeleteUserMutation,
  useGetAllUsersQuery,
  useUpdateUserRoleMutation,
} from "@/redux/features/user/userApi";
import { styles } from "@/app/styles/style";
import toast from "react-hot-toast";

type Props = {
  isTeam?: boolean;
};

const AllUsers: FC<Props> = ({ isTeam }) => {
  const [active, setActive] = useState(false);
  const { theme, setTheme } = useTheme();
  const { data, isLoading, refetch } = useGetAllUsersQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );

  const [email, setEmail] = useState("");
  const [role, setRole] = useState("admin");
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState("");

  const [updateUserRole, { error: updateError, isSuccess }] =
    useUpdateUserRoleMutation();
  const [deleteUser, { isSuccess: deleteSuccess, error: deleteError }] =
    useDeleteUserMutation({});

  useEffect(() => {
    if (updateError) {
      if ("data" in updateError) {
        const errorMessage = updateError as any;
        toast.error(errorMessage.data.message);
      }
    }

    if (isSuccess) {
      refetch();
      toast.success("User role updated successfully.");
      setActive(false);
    }

    if (deleteSuccess) {
      refetch();
      toast.success("User deleted successfully.");
      setActive(false);
    }

    if (deleteError) {
      if ("data" in deleteError) {
        const errorMessage = deleteError as any;
        toast.error(errorMessage.data.message);
      }
    }
  }, [isSuccess, deleteError, updateError, deleteSuccess, refetch]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !role || email.trim() === "") {
      toast.error("Invalid email or role");
      return;
    }
    console.log(email, role);
    await updateUserRole({ email, role });
    setOpen(false);
    setEmail("");
    setRole("");
  };

  const handleDelete = async () => {
    const id = userId;
    await deleteUser(id);
    setOpen(false);
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 0.3 },
    { field: "name", headerName: "Name", flex: 0.5 },
    { field: "email", headerName: "Email", flex: 0.8 },
    { field: "role", headerName: "Role", flex: 0.5 },
    { field: "courses", headerName: "Purchased", flex: 0.5 },
    { field: "created_at", headerName: "Joined At", flex: 0.5 },
    {
      field: "",
      headerName: "Email",
      flex: 0.2,
      renderCell: (params: any) => (
        <>
          <a href={`mailto:${params.row.email}`}>
            <AiOutlineMail className="dark:text-white text-black" size={20} />
          </a>
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
              setUserId(params.row.id);
            }}
          >
            <AiOutlineDelete className="dark:text-white text-black" size={20} />
          </Button>
        </>
      ),
    },
  ];

  const rows: any = [];

  if (isTeam) {
    const admins =
      data && data.users.filter((item: any) => item.role === "admin");

    admins?.forEach((item: any) => {
      const { _id, name, email, courses, role, createdAt } = item;
      rows.push({
        id: _id,
        name,
        email,
        role,
        courses: courses.length,
        created_at: format(createdAt),
      });
    });
  } else {
    data &&
      data.users.forEach((item: any) => {
        const { _id, name, email, role, courses, createdAt } = item;
        rows.push({
          id: _id,
          name,
          email,
          role,
          courses: courses.length,
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
          {isTeam && (
            <div className="w-full flex justify-end">
              <button
                className={`${styles.button} !w-[220px]`}
                onClick={() => setActive(!active)}
              >
                Add New Member
              </button>
            </div>
          )}

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

          {active && (
            <Modal
              open={active}
              onClose={() => setActive(!active)}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-5 flex flex-col bg-[#111c43] p-8 rounded">
                <h1 className={styles.title}>Add New Member</h1>
                <form
                  className="flex flex-col gap-3 min-w-fit"
                  onSubmit={handleSubmit}
                >
                  <input
                    type="email"
                    inputMode="email"
                    placeholder="User Email"
                    className={styles.input}
                    value={email}
                    onChange={(e) => setEmail(e.target.value.trim())}
                    required
                  />
                  <select
                    className={styles.input}
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                  </select>
                  <button type="submit" className={`${styles.button}`}>
                    Add Member
                  </button>
                </form>
              </Box>
            </Modal>
          )}

          {open && (
            <Modal
              open={open}
              onClose={() => setOpen(!open)}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-5 bg-[#111c43] p-8 rounded">
                <h1 className={styles.title}>
                  Are you sure to delete this user ?
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

export default AllUsers;

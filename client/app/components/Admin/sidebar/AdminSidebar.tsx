import React, { FC, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useTheme } from "next-themes";
import Image from "next/image";
import avatarDefault from "../../../../public/assets/avatar.png";
import { Box, IconButton, Typography } from "@mui/material";
import { Menu, MenuItem, Sidebar } from "react-pro-sidebar";
import Link from "next/link";
import {
  MdArrowBackIos,
  MdArrowForward,
  MdExitToApp,
  MdGroups,
  MdManageHistory,
  MdOndemandVideo,
  MdOutlineBarChart,
  MdOutlineHome,
  MdOutlineMap,
  MdOutlineReceipt,
  MdPeopleOutline,
  MdQuiz,
  MdVideoCall,
  MdWeb,
  MdWysiwyg,
} from "react-icons/md";
import Item from "./Item";

type Props = {};

const AdminSidebar: FC<Props> = () => {
  const { user } = useSelector((state: any) => state.auth);
  const [logout, setLogout] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const logoutHandler = () => setLogout(true);

  return (
    <Box
      sx={{
        "& .ps-sidebar-container": {
          background: `${
            theme === "dark" ? "#111c43 !important" : "#fff !important"
          }`,
          paddingBottom: "40px",
          "& .pro-icon-wrapper": {
            backgroundColor: "transparent !important",
          },
          "& .ps-menuitem-root:hover": {
            color: "#868dfb !important",
          },
          "& .ps-menu-button:hover": {
            color: "#868dfb !important",
          },
          "& .ps-menuitem-root.ps-active": {
            color: "#6870fa !important",
          },
          "& .pro-inner-item": {
            padding: "5px 35px 5px 20px !important",
            opacity: 1,
          },
          "& .ps-menuitem-root": {
            color: `${theme === "dark" ? "#fff" : "#000"}`,
          },
        },
      }}
    >
      <Sidebar
        collapsed={isCollapsed}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          width: isCollapsed ? "0%" : "16%",
          zIndex: 1000,
        }}
      >
        <Menu>
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MdArrowForward /> : undefined}
            style={{ margin: "10px 0 20px 0" }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Link href="/">
                  <h3 className="text-[25px] font-Poppins uppercase dark:text-white text-black">
                    E-Learning
                  </h3>
                </Link>
                <IconButton
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className="inline-block"
                >
                  <MdArrowBackIos className="text-black dark:text-[#ffffffc1]" />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {!isCollapsed && (
            <Box mb="25px">
              <Box
                display="flex"
                justifyContent={"center"}
                alignItems={"center"}
              >
                <Image
                  src={user.avatar ? user.avatar.url : avatarDefault}
                  alt="Profile-Pic"
                  width={100}
                  height={100}
                  className="cursor-pointer rounded-full border-[3px] border-[#5b6fe6] "
                />
              </Box>
              <Box textAlign="center">
                <Typography
                  variant="h4"
                  sx={{ m: "10px 0 0 0" }}
                  className="!text-[20px] text-black dark:text-[#ffffffc1] capitalize"
                >
                  {user.name}
                </Typography>
                <Typography
                  variant="h4"
                  sx={{ m: "10px 0 0 0" }}
                  className="!text-[20px] text-black dark:text-[#ffffffc1] capitalize"
                >
                  - {user.role}
                </Typography>
              </Box>
            </Box>
          )}

          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            <Item
              title="Dashboard"
              to="/admin"
              icon={<MdOutlineHome />}
              selected={selected}
              setSelected={setSelected}
            />
            <Typography
              variant="h5"
              sx={{ m: "15px 0 5px 25px" }}
              className="!text-[18px] text-black dark:text-[#ffffffc1] capitalize !font-[400]"
            >
              {" "}
              {!isCollapsed && "Data"}{" "}
            </Typography>
            <Item
              title="Users"
              to="/admin/users"
              icon={<MdGroups />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Invoices"
              to="/admin/invoices"
              icon={<MdOutlineReceipt />}
              selected={selected}
              setSelected={setSelected}
            />

            <Typography
              variant="h5"
              sx={{ m: "15px 0 5px 20px" }}
              className="!text-[18px] text-black dark:text-[#ffffffc1] capitalize !font-[400]"
            >
              {" "}
              {!isCollapsed && "Content"}{" "}
            </Typography>
            <Item
              title="Create Course"
              to="/admin/create-course"
              icon={<MdVideoCall />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Live Courses"
              to="/admin/courses"
              icon={<MdOndemandVideo />}
              selected={selected}
              setSelected={setSelected}
            />

            <Typography
              variant="h5"
              sx={{ m: "15px 0 5px 20px" }}
              className="!text-[18px] text-black dark:text-[#ffffffc1] capitalize !font-[400]"
            >
              {" "}
              {!isCollapsed && "Customization"}{" "}
            </Typography>
            <Item
              title="Hero"
              to="/admin/hero"
              icon={<MdWeb />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="FAQ"
              to="/admin/faq"
              icon={<MdQuiz />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Categories"
              to="/admin/categories"
              icon={<MdWysiwyg />}
              selected={selected}
              setSelected={setSelected}
            />

            <Typography
              variant="h5"
              sx={{ m: "15px 0 5px 20px" }}
              className="!text-[18px] text-black dark:text-[#ffffffc1] capitalize !font-[400]"
            >
              {" "}
              {!isCollapsed && "Controllers"}{" "}
            </Typography>
            <Item
              title="Manage Team"
              to="/admin/team"
              icon={<MdPeopleOutline />}
              selected={selected}
              setSelected={setSelected}
            />

            <Typography
              variant="h5"
              sx={{ m: "15px 0 5px 20px" }}
              className="!text-[18px] text-black dark:text-[#ffffffc1] capitalize !font-[400]"
            >
              {" "}
              {!isCollapsed && "Analytics"}{" "}
            </Typography>
            <Item
              title="Courses Analytics"
              to="/admin/courses-analytics"
              icon={<MdOutlineBarChart />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Order Analytics"
              to="/admin/orders-analytics"
              icon={<MdOutlineMap />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Users Analytics"
              to="/admin/users-analytics"
              icon={<MdManageHistory />}
              selected={selected}
              setSelected={setSelected}
            />

            <Typography
              variant="h5"
              sx={{ m: "15px 0 5px 20px" }}
              className="!text-[18px] text-black dark:text-[#ffffffc1] capitalize !font-[400]"
            >
              {" "}
              {!isCollapsed && "Extras"}{" "}
            </Typography>
            <div onClick={logoutHandler}>
              <Item
                title="Logout"
                to="/"
                icon={<MdExitToApp />}
                selected={selected}
                setSelected={setSelected}
              />
            </div>
          </Box>
        </Menu>
      </Sidebar>
    </Box>
  );
};

export default AdminSidebar;

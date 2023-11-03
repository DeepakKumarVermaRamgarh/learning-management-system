"use client";

import React, { FC, useEffect, useState } from "react";
import ThemeSwitcher from "../../../app/utils/ThemeSwitcher";
import { IoMdNotificationsOutline } from "react-icons/io";
import socketIO from "socket.io-client";
import {
  useGetAllNotificationsQuery,
  useUpdatedNotificationStatusMutation,
} from "@/redux/features/notifications/notificationsApi";
import { format } from "timeago.js";
const socketId = socketIO(process.env.NEXT_PUBLIC_SOCKET_SERVER_URI || "", {
  transports: ["websocket"],
});

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const DashboardHeader: FC<Props> = ({ open, setOpen }) => {
  const { data, refetch } = useGetAllNotificationsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const [updateNotificationStatus, { isSuccess }] =
    useUpdatedNotificationStatusMutation();

  const [notifications, setNotifications] = useState<any[]>([]);

  const [audio] = useState(new Audio(process.env.NEXT_NOTIFICATION_AUDIO_URL));

  const playNotificationSound = () => audio.play();

  useEffect(() => {
    if (data) {
      setNotifications(
        data.notifications.filter(
          (notification: any) => notification.status === "unread"
        )
      );
    }

    if (isSuccess) {
      refetch();
    }

    audio.load();
  }, [data, isSuccess]);

  useEffect(() => {
    socketId.on("newNotification", (data) => {
      refetch();
      playNotificationSound();
    });
  }, []);

  const handleNotificationStatusChange = async (id: string) => {
    await updateNotificationStatus(id);
  };

  return (
    <div className="w-full flex items-center justify-end p-6 fixed top-5 right-0 z-[100]">
      <ThemeSwitcher />
      <div
        className="relative cursor-pointer m-2"
        onClick={() => setOpen(!open)}
      >
        <IoMdNotificationsOutline className="text-2xl cursor-pointer dark:text-white text-black" />
        <span className="absolute -top-2 -right-2 bg-[#3ccba0] rounded-full w-[20px] h-[20px] text-[12px] flex items-center justify-center text-white">
          {notifications && notifications.length}
        </span>
      </div>

      {open && (
        <div className="w-[350px] max-h-[50vh] overflow-auto dark:bg-[#111c43] bg-white shadow-xl absolute top-16 z-[500] rounded">
          <h5 className="text-center text-[20px] font-Poppins text-black dark:text-white p-3">
            Notifications
          </h5>
          {notifications &&
            notifications.map((notification: any, index: number) => (
              <div
                className="dark:bg-[#2d3a4ea1] bg-[#00000013] font-Poppins border-b dark:border-b-[#ffffff47] border-b-[#0000000f]"
                key={index}
              >
                <div className="w-full flex items-center justify-between p-2">
                  <p className="text-black dark:text-white">
                    {notification.title}
                  </p>
                  <p
                    className="text-black dark:text-white cursor-pointer"
                    onClick={() =>
                      handleNotificationStatusChange(notification._id)
                    }
                  >
                    Mark as read
                  </p>
                </div>
                <p className="px-2 text-black dark:text-white">
                  {notification.message}
                </p>
                <p className="p-2 text-black dark:text-white text-[14px]">
                  {format(notification.createdAt)}
                </p>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default DashboardHeader;

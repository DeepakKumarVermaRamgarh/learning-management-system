import { Server as SocketIOServer } from "socket.io";
import http from "http";

export const initSocketServer = (server: http.Server) => {
  const io = new SocketIOServer(server);

  io.on("connection", (socket) => {
    console.log("A user connected", socket.id);

    //   listen for "notification" even from the frontend
    socket.on("notification", (data) => {
      // Broadcast the notification data to all connected clients (in this case admin dashboard)
      io.emit("newNotification", data);
    });

    socket.on("disconnect", () => {
      console.log(socket.id, " user disconnected");
    });
  });
};

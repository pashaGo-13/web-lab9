import { Server } from "socket.io";

export function initSocket(httpServer) {
    const io = new Server(httpServer);
    const clients = {};

    io.on("connection", (socket) => {
        console.log("Новое подключение к чату:", socket.id);

        socket.on("register", (name) => {
            const userName = name || `Guest_${socket.id.substring(0, 4)}`;
            clients[socket.id] = { name: userName };
            
            io.emit("clientsList", clients);
        });

        socket.on("message", (text) => {
            if (clients[socket.id]) {
                io.emit("chatMessage", {
                    from: clients[socket.id].name,
                    text: text
                });
            }
        });

        socket.on("disconnect", () => {
            if (clients[socket.id]) {
                delete clients[socket.id];
                io.emit("clientsList", clients);
            }
        });
    });
}
import express from "express";
import { Server } from "socket.io"; 
import http from "http";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;



const httpServer = http.createServer(app);
const io = new Server(httpServer);

app.set("view engine","ejs");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.render("index.ejs");
});

io.on("connection", (socket) => {
    console.log("A user connected");
    socket.on("send-location", (data) => {
        io.emit("receive-location",{id : socket.id,...data});
    });

    socket.on("disconnect", () => {
        io.emit("user-disconnect",socket.id);
    });
});

httpServer.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

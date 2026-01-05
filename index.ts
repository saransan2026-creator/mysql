import express from "express";
import router from "./Routes/Authroutes";

const app = express();
app.use(express.json());

app.use("/api", router);

app.get("/", (_req, res) => res.send("API Running..."));

app.listen(5000, () => console.log("Server running on port 5000"));


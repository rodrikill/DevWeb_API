import express from "express";
import UserRouter from "./routes/UserRoutes";
import PostRouter from "./routes/PostRoutes";
import ComentarioRouter from "./routes/ComentarioRoutes"

const port = 3000;

const app = express();
app.use(express.json());

app.use(UserRouter);
app.use(PostRouter);
app.use(ComentarioRouter);

app.listen(port, function () {
  console.log("Servidor rodando na porta " + port);
});

const express = require("express");
require("./db/mongoose");

const figlet = require("figlet");
const userRouter = require("./routers/userRouter");
const taskRouter = require("./routers/taskRouter");

const app = express();

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.get("/", (req, res) => {
  res.send("<h1>Task Mananager APIs</h1>");
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  figlet.text(
    "Task - Manager - API",
    {
      font: "Standard",
      horizontalLayout: "default",
      verticalLayout: "default",
    },
    (err, data) => {
      if (err) throw new Error("Something went wrong !!");
      console.log(data);
    }
  );
  console.log(`Server is listening on PORT: ${port}`);
});
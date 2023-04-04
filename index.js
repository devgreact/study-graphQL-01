const express = require("express");
const app = express();
const todoRouter = require("./routes/todo.js");
const port = 4000;
app.use(express.json());
app.use(express.urlencoded());
app.use("/api/todo", todoRouter);
app.listen(port, () => {
  console.log(`REST API listening at http://localhost:${port}`);
});

const express = require("express");
const api = express.Router();
const database = require("../database.js");
// GET : todo 목록 전체 읽어오기
api.get("/", (req, res) => {
  let result = database.todos;
  Object.keys(req.query).forEach((key) => {
    result = result.filter((data) => {
      return data[key] && data[key].toString() === req.query[key].toString();
    });
  });
  res.send(result);
});

// GET : todo 목록 ID 읽어오기
api.get("/:id", (req, res) => {
  res.send(
    database.todos.filter((data) => {
      return data.id && data.id.toString() === req.params.id.toString();
    })[0]
  );
});

// POST : todo 목록 추가하기
api.post("/", (req, res) => {
  const data = {
    id: database.todos.length + 1,
  };
  Object.keys(req.body).forEach((key) => {
    data[key] = req.body[key];
  });
  database.todos = [...database.todos, data];
  res.send(data);
});

// PUT : todo 목록 아이디 수정하기
api.put("/:id", (req, res) => {
  let result = null;
  database.todos
    .filter((data) => {
      return data.id && data.id.toString() === req.params.id.toString();
    })
    .map((data) => {
      Object.keys(data).forEach((key) => {
        delete data[key];
      });
      Object.assign(data, req.body);
      data.id = req.params.id;
      result = data;
    });
  res.send(result);
});

// DELETE : todo 목록 ID 삭제하기
api.delete("/:id", (req, res) => {
  const result = database.todos.filter((data) => {
    return data.id && data.id.toString() === req.params.id.toString();
  });
  database.todos = database.todos.filter((data) => {
    return !data.id || data.id.toString() !== req.params.id.toString();
  });
  res.send(result);
});

module.exports = api;

# REST-API 복습

## Node.js 프로젝트 생성

npm init

## index.js 실행파일 생성

```js
  console.log("hello);
```

## expres 서버 설치

npm i express

## nodemon 설치 (코드가 바뀔 때마다 어플리케이션 재실행)

npm install -g nodemon

## csv json 모듈 설치

npm i convert-csv-to-json

## package.json - "scripts" 항목 생성

"start": "nodemon index.js"

## 프로젝트 실행 명령어 (해당 프로젝트 폴더에서)

npm start

## 브라우저에서 localhost:3000 으로 확인

# Mock Data 제작

## data/todo.csv ('Edit csv' Extension 설치)

```csv
id,title,completed,date,weather
1,공부중입니다.,false,2023-04-01,1
2,리액트공부,false,2023-04-02,2
3,html 공부,true,2023-04-03,2
4,css 공부,true,2023-04-04,3
5,js 공부,false,2023-04-05,3
6,git공부,true,2023-04-06,5
7,서버공부,true,2023-04-07,4
```

## /routes/todo.js

```js
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
```

## index.js

```js
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
```

## database.js

```js
const csvToJson = require("convert-csv-to-json");

const database = {
  todos: [],
};
Object.keys(database).forEach((key) => {
  database[key] = [
    ...database[key],
    ...csvToJson.fieldDelimiter(",").getJsonFromCsv(`./data/${key}.csv`),
  ];
  if (database[key].length > 0) {
    const firstItem = database[key][0];
    Object.keys(firstItem).forEach((itemKey) => {
      if (
        database[key].every((item) => {
          return /^-?\d+$/.test(item[itemKey]);
        })
      ) {
        database[key].forEach((item) => {
          item[itemKey] = Number(item[itemKey]);
        });
      }
    });
  }
});

module.exports = database;
```

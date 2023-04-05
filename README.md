# REST-API 복습
- 소프트웨어가 정보를 주고 받는 방식
- GraphQL 이전부터 사용

- client > Request 
- client < Response (data)

- 데이터를 주고받을 주체들간 약속된 형식
- URI 형식(어떤 정보를) + 요청방식(어떻게 할 것인가)
  - Get       : 정보받아오기
  - POST      : 정보 입력하기
  - PUT/PATCH : 정보 수정하기
  - DELETE    : 정보 삭제하기

## 1. Node.js 프로젝트 생성

npm init

## 2. index.js 실행파일 생성

```js
  console.log("hello);
```

## 3. nodemon 설치 및 npm i 실행
```
  npm install -g nodemon
  npm start
```


# 정보활용

## GET : 정보 받아오기

Postman : GET http://localhost:4000/api/todo
Postman : GET http://localhost:4000/api/todo/2

## POST : 정보 입력하기(body, x-www-form-urlencode)

Postman : POST http://localhost:4000/api/todo

## PUT/PATCH : 정보 수정하기

Postman : PUT http://localhost:4000/api/todo/2

## DELETE : 정보 삭제하기

Postman : DELETE http://localhost:4000/api/todo/2

## RESTAPI 의 한계
- 필요로 하지 않은 정보까지 전부 받아오게 됨
- 낭비되는 데이터의 양도 많아짐(OverFetching 문제)
- 내가 원하는 정보가 여러곳에 흩어진 경우에 
- 요청을 여러번 보내는 문제(UnderFetching 문제)
- 이를 해소하기 위해서 GraphQL 이 나옴

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

# 정보활용

## GET : 정보 받아오기

Postman : GET http://localhost:4000/api/todo
Postman : GET http://localhost:4000/api/todo/2

## POST : 정보 입력하기

Postman : POST http://localhost:4000/api/todo

## PUT/PATCH : 정보 수정하기

Postman : PUT http://localhost:4000/api/todo/2

## DELETE : 정보 삭제하기

Postman : DELETE http://localhost:4000/api/todo/2

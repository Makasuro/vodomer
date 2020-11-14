const { response } = require("express");
const express = require("express");
const { hostname } = require("os");
const bs = require('body-parser');
const db = require("./database");


// создаем сервер
const srv = express();

// create application/json parser
var jsonParser = bs.json();

// определяем обработчик для маршрута "/"
srv.get("/", (request, response) => {
    response.send("<h2>Здесь будет сайт водомера</h2>");
});

// получение текущего значения счетчика горячей воды
srv.get("/water/hot" , async (request, response) => {
    response.send({hot: await db.GetCount('hot')});
});

// запись текущего значения счетчика горячей воды
srv.post("/water/hot", jsonParser, (request, response) => {
    db.SetHotCount(request.body.hot);
    response.status(200).send();
});

// получение текущего значения счетчика холодной воды
srv.get("/water/cold" , async (request, response) => {
       response.send({cold: await db.GetCount('cold')});
});

// запись текущего значения счетчика холодной воды
srv.post("/water/cold", jsonParser, (request, response) => {
    db.SetColdCount(request.body.cold);
    response.status(200).send();
});

// получение значений счетчиков за предыдущий месяц
srv.get("/history/last" , async (request, response) => {
    const last = await db.GetLastRecord();
    response.status(200).send({hot: last.hot ,cold: last.cold , date: last.date });
});

// запись текущего состояния счетчиков в данном месяце
srv.post("/history/last", jsonParser, async (request, response) => {
    await db.SetLastRecord(request.body.hot, request.body.cold);
    response.status(200).send('Ok');
});

// получение истории за период для построения графиков
srv.get("/history/period" , async (request, response) => {
    let result = await db.GetHistory();
    response.send(result);
});

srv.listen(1337);
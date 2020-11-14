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
srv.get("/water/hot" , (request, response) => {
    response.send({hot:1234});
});

// запись текущего значения счетчика горячей воды
srv.post("/water/hot", jsonParser, (request, response) => {
    db.SetHotCount(request.body.hot);
    response.status(200).send();
});

// получение текущего значения счетчика холодной воды
srv.get("/water/cold" , (request, response) => {
    response.send({cold:1234});
});

// запись текущего значения счетчика холодной воды
srv.post("/water/cold" ,jsonParser, (request, response) => {
    db.SetColdCount(request.body.cold);
    response.status(200).send();
});

// получение значений счетчиков за предыдущий месяц
srv.get("/history/last" , (request, response) => {
    response.send({hot:1234,cold:1234, date:'01.01.2020'});
});
// запись текущего состояния счетчиков в данном месяце
srv.post("/history/last" , (request, response) => {
    response.status(200).send('Ok');
});
// получение истории за период для построения графиков
srv.get("/history/period" , (request, response) => {
    response.send([{hot:1234,cold:1234, date:'01.01.2020'},{hot:1234,cold:1234, date:'01.02.2020'}]);
});
srv.listen(1337);
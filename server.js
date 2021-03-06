const { response } = require("express");
const express = require("express");
const { hostname } = require("os");
const bs = require('body-parser');
const db = require("./database");
const mail = require("./mail");
var cors = require('cors')

 


// создаем сервер
const srv = express();
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');
//const swaggerDocument = require('./swagger.json');

srv.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// create application/json parser
var jsonParser = bs.json();
srv.use(cors());
srv.use('/', express.static('./wwwroot/radio'));
srv.use('/vodomer', express.static('./wwwroot/vodomer'));
srv.use('/home', express.static('./wwwroot/home'));

// отправка письма
srv.post("/api/mail", jsonParser, async (request, response) => {
    const last = await db.GetLastRecord();
    const curHot = await db.GetCount('hot');
    const curCold = await db.GetCount('cold');
    let letter = await mail.MakeMailBody(last.hot,curHot,curHot-last.hot,last.cold,curCold,curCold-last.cold);
    await mail.SendMail('asico@list.ru', letter );
    response.status(200).send();
});

// получение текущего значения счетчика горячей воды
srv.get("/api/water/hot" , async (request, response) => {
    response.send({hot: await db.GetCount('hot')});
});

// запись текущего значения счетчика горячей воды
srv.post("/api/water/hot", jsonParser, (request, response) => {
    db.SetHotCount(request.body.hot);
    response.status(200).send();
});

// получение текущего значения счетчика холодной воды
srv.get("/api/water/cold" , async (request, response) => {
       response.send({cold: await db.GetCount('cold')});
});

// запись текущего значения счетчика холодной воды
srv.post("/api/water/cold", jsonParser, (request, response) => {
    db.SetColdCount(request.body.cold);
    response.status(200).send();
});

// получение значений счетчиков за предыдущий месяц
srv.get("/api/history/last" , async (request, response) => {
    const last = await db.GetLastRecord();
    response.status(200).send({hot: last.hot ,cold: last.cold , date: last.date });
});

// запись текущего состояния счетчиков в данном месяце
srv.post("/api/history/last", jsonParser, async (request, response) => {
    await db.SetLastRecord(request.body.hot, request.body.cold, request.body.date);
    response.status(200).send('Ok');
});

// получение истории за период для построения графиков
srv.get("/api/history" , async (request, response) => {
    let result = await (await db.GetHistory()).map((item, index, items)=>{
        if(index === 0) {
        item.rateCold = 0;
        item.rateHot = 0;
        } else {
            item.rateCold = item.cold - items[index-1].cold;
            item.rateHot = item.hot - items[index-1].hot;
        }
        return item;
    });
    response.send(result);
});

srv.listen(80);
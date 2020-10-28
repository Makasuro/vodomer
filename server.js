const { response } = require("express");
const express = require("express");
const { hostname } = require("os");


const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://vodomerUser:Pepelatz01@cluster0.eneo3.mongodb.net/vodomerDb?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true,useUnifiedTopology: true });
//console.log('client', client);
client.connect(err => {
    if(err){
        console.log(err);
        return;
    }
    const collection = client.db("vodomerDb").collection("counters");
    let hot = {hot: 123};
    collection.insertOne(hot, function(err, result){
        if(err){ 
            return console.log(err);
           }
    console.log(result.ops);
    client.close();
});
  
});



// создаем сервер
const srv = express();
// определяем обработчик для маршрута "/"
srv.get("/", (request, response) => {
    response.send("<h2>Здесь будет сайт водомера</h2>");
});
// получение текущего значения счетчика горячей воды
srv.get("/water/hot" , (request, response) => {
    response.send({hot:1234});
});

// запись текущего значения счетчика горячей воды
srv.post("/water/hot" , (request, response) => {
    response.status(200).send('Ok');
});

// получение текущего значения счетчика холодной воды
srv.get("/water/cold" , (request, response) => {
    response.send({cold:1234});
});

// запись текущего значения счетчика холодной воды
srv.post("/water/cold" , (request, response) => {
    response.status(200).send('Ok');
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
const express = require("express");
// создаем объект приложения
const srv = express();
// определяем обработчик для маршрута "/"
srv.get("/", function(request, response){
     
    // отправляем ответ
    response.send("<h2>Привет Express!</h2>");
});
// начинаем прослушивать подключения на 3000 порту
srv.listen(1337);
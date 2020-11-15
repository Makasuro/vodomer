const MongoClient = require('mongodb').MongoClient;
const config = require('./config.json');
const uri = `mongodb+srv://${config["mongo-user"]}:${config["mongo-password"]}@cluster0.eneo3.mongodb.net/vodomerDb?retryWrites=true&w=majority`;

exports.GetHistory = async (dateFrom, dateTo) => {
    let client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    const collection = client.db("vodomerDb").collection("history");
    let result = await collection.find().toArray();
    client.close();
    return result;
};

exports.SetLastRecord = async (hot, cold, date) => {
    let client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    const collection = client.db("vodomerDb").collection("history");
    if(!date){
        date = new Date();
    }else{
        date = new Date(date);
    }
    await collection.insertOne({ hot, cold, date });
    client.close();
};

exports.GetLastRecord = async () => {
    let client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    const collection = client.db("vodomerDb").collection("history");
    let result = await collection.findOne({}, {sort:{$natural:-1}});
    client.close();
    return result;
};

exports.GetCount = async (type) =>{
    let client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    const collection = client.db("vodomerDb").collection("counters");
    let result = await collection.findOne({ "type" : type });
    client.close();
    return result.count;
};

exports.SetColdCount = (cold) => {
    let client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    client.connect(err => {
            if(err){
                console.log('Connection error:',err);
                return;
            }
            const collection = client.db("vodomerDb").collection("counters");
            collection.updateOne(
                { "type" : "cold" },
            { $set: {"count" : cold } },
            { upsert: true })
            .then(result=> {
                client.close();
            });
        });
};

exports.SetHotCount = (hot) => {
    let client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    client.connect(err => {
            if(err){
                console.log('Connection error:',err);
                return;
            }
            const collection = client.db("vodomerDb").collection("counters");
            collection.updateOne(
                { "type" : "hot" },
            { $set: {"count" : hot } },
            { upsert: true })
            .then(result=> {
                client.close();
            });
        });
};


const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://vodomerUser:Pepelatz01@cluster0.eneo3.mongodb.net/vodomerDb?retryWrites=true&w=majority";

exports.SetColdCount = (cold) => {
    let client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    client.connect(err => {
            if(err){
                console.log('Connection error:',err);
                return;
            }
            const collection = client.db("vodomerDb").collection("counters");
            console.log('collection:',collection);
            collection.updateOne(
                { "type" : "cold" },
            { $set: {"count" : cold } },
            { upsert: true })
            .then(result=> {
                client.close();
            });
        });
}

exports.SetHotCount = (hot) => {
    let client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    client.connect(err => {
            if(err){
                console.log('Connection error:',err);
                return;
            }
            const collection = client.db("vodomerDb").collection("counters");
            console.log('collection:',collection);
            collection.updateOne(
                { "type" : "hot" },
            { $set: {"count" : hot } },
            { upsert: true })
            .then(result=> {
                client.close();
            });
        });
}


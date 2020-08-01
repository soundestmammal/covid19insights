const mongoose = require('mongoose');
const { mongopw } = require('./keys');
mongoose.connect(`mongodb://root:${mongopw}@cluster0-shard-00-00.lifld.mongodb.net:27017,cluster0-00-01.lifld.mongodb.net:27017,cluster0-shard-00-02.lifld.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
    console.log("MongoDB Connected!");
})
.catch((err) => {
    console.log(err);
});
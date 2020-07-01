const express = require('express');
const cors = require('cors');

const dataRouter = require('./routers/data');

const app = express();
app.use(express.json());
app.use(cors());
app.use(dataRouter);

app.listen(3090, () => {
    console.log("The application is running on port 3090");
});
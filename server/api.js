const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res.send("WElcome to the root route!");
});

app.get('/api', (req, res)=>{
    res.send("This is the c19insights api right here.")
});

const PORT = 3001;

app.listen(PORT, () => {
    console.log(`Server is listening on Port: ${PORT}`);
});
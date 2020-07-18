const express = require('express');

const app = express();

app.use( express.static( `${__dirname}/../client/build` ) );

const path = require('path');

app.get('*', (req, res)=>{
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is listening on Port: ${PORT}`);
});
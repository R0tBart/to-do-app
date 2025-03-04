const express = require('express');


const app = express();




app.get('/', (req, res) => {

    res.send('Request received!');
});


app.get('/chris', (req, res) => {
    res.send('Chris antwortet!');
});

app.listen(3050, 'localhost', ()=> {
    console.log('Server running on port 3050');
});

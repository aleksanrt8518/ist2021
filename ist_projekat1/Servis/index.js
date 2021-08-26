var express = require('express');
var Servis=require('proizvodi');
var app = express();
const port = 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/',(request, response)=>{
    response.send("Server radi");
});

app.get('/allItems',(request, response)=>{
    response.send(Servis.allItems())
});

app.post('/addItem',(request, response)=>{
    Servis.addItem(request.body);
    response.end("OK");
})

app.post('/editItem/:id/:name/:category/:price/:tags/:desc',(request, response)=>{
    Servis.editItem(request.params["id"],request.params["name"],request.params["category"],request.params["price"],request.params["tags"],request.params["desc"]);
    response.end("OK");
});

app.delete('/deleteItem/:id',(request, response)=>{
    Servis.deleteItem(request.params["id"]);
    response.end("OK");
});

app.get('/searchItemByCategory',(request, response)=>{
    response.send(Servis.searchItemByCategory(request.query["category"]));
});

app.get('/getItem/:id',(request, response)=>{
    response.send(Servis.getItem(request.params["id"]));
})


app.listen(port,()=>{console.log(`startovan server na portu ${port}`)});
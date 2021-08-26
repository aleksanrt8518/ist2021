const express = require("express");
const fs=require("fs");
const app = express();
const path = require('path');
const axios = require('axios');
const { response } = require("express");
const port = 5000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

let readView=(name)=>{
    return fs.readFileSync(path.join(__dirname+"/view/"+name+".html"),"utf-8")
}

app.get("/",(req,res)=>{
    res.send(readView("index"));
});

app.get("/allItems",(req,res)=>{
    
    axios.get('http://localhost:3000/allItems')
    .then(response => {
        let view="";
        response.data.forEach(element => {
            view+=`<tr>
            <td>${element.id}</td>
            <td>${element.name}</td>
            <td>${element.price} RSD</td>
            <td><a href="/edit/${element.id}" id="edit">Izmeni</a></td>
            <td><a href="/detailed/${element.id}" id="detailed">Detaljno</a></td>
            <td><a href="/delete/${element.id}" id="delete">Izbrisi</a></td>
        </tr>`;
        });
        res.send(readView("allItems").replace("#{data}",view));
    })
    .catch(error => {
        console.log(error);
    });
    
    
});

app.get("/detailed/:id",(req,res)=>{
    axios.get(`http://localhost:3000/getItem/${req.params["id"]}`)
    .then(response=>{
        let view="";
            view+=`
            <td>tags</td>
            <td>desc</td>
            </tr>
            <tr>
            <td>${response.data.id}</td>
            <td>${response.data.name}</td>
            <td>${response.data.price} RSD</td>
            <td>${response.data.tags}</td>
            <td>${response.data.desc}</td>
            <td><a href="/edit/${response.data.id}" id="edit">Izmeni</a></td>
            <td><a href="/delete/${response.data.id}" id="delete">Izbrisi</a></td>
        </tr>`;
        res.send(readView("allItems").replace("#{data}",view));
    })
    .catch(error => {
        console.log(error);
    });
});


app.get("/delete/:id",(req,res)=>{
    axios.delete(`http://localhost:3000/deleteItem/${req.params["id"]}`)
    res.redirect("/allItems");
});

app.get("/addItem",(req,res)=>{
    res.send(readView("formazadodavanje"));
});

app.post("/saveItem",(req,res)=>{
    axios.post("http://localhost:3000/addItem",{
        name:req.body.name,
        category:req.body.category,
        price:req.body.price,
        tags:req.body.tags,
        desc:req.body.desc
    })
    res.redirect("/allItems");
})

app.post("/searchItemByCategory",(req,res)=>{
    axios.get(`http://localhost:3000/searchItemByCategory?category=${req.body.category}`)
    .then(response=>{
        let view="";
        response.data.forEach(element => {
            view+=`
            <tr>
            <td>${element.id}</td>
            <td>${element.name}</td>
            <td>${element.price}</td>
            <td><a href="/edit/${element.id}" id="edit">Izmeni</a></td>
            <td><a href="/detailed/${element.id}" id="detailed">Detaljno</a></td>
            <td><a href="/delete/${element.id}" id="delete">Izbrisi</a></td>
        </tr>`;
        });
        res.send(readView("allItems").replace("#{data}",view));
    })
});

app.get("/edit/:id",(req,res)=>{
    axios.get(`http://localhost:3000/getItem/${req.params["id"]}`)
    .then(response=>{
        let view="";
            view+=`
            <br>
            Izabrani Item: ${response.data.name}
            <br>
            <br>
            <form action="/saveEditedItem" method="post">
        ID Itema: <input type="text" name="id" value="${response.data.id}" readonly>
        <br>
        <br>
        Ime Itema: <input type="text" name="name" value="${response.data.name}">
        <br>
        <br>
        category: <input type="text" name="category" value="${response.data.category}">
        <br>
        <br>
        price <input type="number" name="price" min="0" value="${response.data.price}">
        <br>
        <br>
        tags: <input type="text" name="tags" value="${response.data.tags}">
        <br>
        <br>
        desc: 
        <br>
        <textarea name="desc" minlength="10" maxlength="180"
        rows="6" cols="33" placeholder="Unesite desc Itema">${response.data.desc}</textarea>
        <br>
        <p>Minimalan broj karaktera 10, maksimalan broj karaktera 180.</p>
        <br>
        <button type="submit">Izmeni</button>
    </form>`;
        res.send(readView("allItems").replace("#{data}",view));
    })
    .catch(error => {
        console.log(error);
    });
});

app.post("/saveEditedItem",(req,res)=>{
    axios.post(`http://localhost:3000/editItem/${req.body["id"]}/${req.body["name"]}/${req.body["category"]}/${req.body["price"]}/${req.body["tags"]}/${req.body["desc"]}`)
    res.redirect("/allItems");
})

app.listen(port,()=>{console.log(`klijent na portu ${port}`)});
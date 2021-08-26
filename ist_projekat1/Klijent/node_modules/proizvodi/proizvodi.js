const fs = require('fs');
const PATH="items.json";

let readFromFiles=()=>{
    let items=fs.readFileSync(PATH, (err, data) => {
        if (err) throw err;
            return data;
    });
    return JSON.parse(items);
}

let saveItems=(data)=>{
    fs.writeFileSync(PATH,JSON.stringify(data));
}

exports.allItems = () => {
    return readFromFiles();
}
exports.addItem = (newItem) => {
    let id=1;
    let items=this.allItems();
    if(items.length>0){
        id=items[items.length-1].id+1;
    }
    newItem.id=id;
    items.push(newItem)
    saveItems(items);
}
exports.getItem = (id) => {
    return this.allItems().find(x => x.id == id);
}
exports.editItem = (id, name, category, price, tags, desc) => {
    let items=this.allItems();
    items.forEach(element => {
        if(element.id == id)
            {
                element.name = name;
                element.category = category;
                element.price = price;
                element.tags = tags;
                element.desc = desc;
            };
    });
    saveItems(items);
}
exports.deleteItem = (id) => {
    saveItems(this.allItems().filter(item=>item.id!=id));
}
exports.searchItemByCategory = (category) =>{
    return this.allItems().filter(item=>item.category==category);
}
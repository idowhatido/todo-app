const bodyParser = require("body-parser");
const express = require("express");
const { default: mongoose } = require("mongoose");
const date = require(__dirname + "/date.js");
const app = express();
const _ = require("lodash");

// const  itemlist = ["test1", "test2"];
// const workitem = [];


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));


mongoose.connect("mongodb+srv://admin:Test123@cluster0.5u4i4wq.mongodb.net/todolist", {useNewUrlParser : true})

const itemSchema = {
    name : String
};

const Item = mongoose.model("Item", itemSchema);

const Item1 = new Item({
    name : "Get Up"
});

const Item2 = new Item({
    name : "Brush Teeth"
});

const defaultItems = [Item1, Item2];


const listSchema = {
    name : String,
    items : [itemSchema]
}

const List = mongoose.model("List", listSchema);

app.get("/", function (request, responce) {

    let day = date.getDate();
    
    Item.find({}, function(err, items){

        if(items.length ==0){
            Item.insertMany(defaultItems, function(err){
                if(err){
                    console.log(err);
                }
                else{
                    console.log("Default Added");
                }
            });
            responce.redirect("/")
        }
        else{
            responce.render("list", {ListTitle : "today", itemlist : items});
        }
        
    });
});

app.post("/", function (request, responce){
    let item = request.body.listItem;
    let listName = request.body.list; 

    const newItem = new Item({
        name : item
    })

    if(listName == "today"){
        newItem.save();
        responce.redirect("/");
    }
    else{
        List.findOne({name : listName}, function(err, foundList){
            foundList.items.push(newItem);
            foundList.save();
        });
        responce.redirect("/" + listName);
    }
});

app.post("/delete", function(request, responce){
    const deleteItem = request.body.checkbox;
    const listName = request.body.ListName;

    if(listName == "today"){
        console.log(deleteItem);
        Item.findByIdAndRemove(deleteItem, function(err){
            console.log(err);
        })
        responce.redirect("/");
    }
    else{
        List.findOneAndUpdate({name:listName}, {$pull : {items: {_id : deleteItem}}}, function(err, foundList){
            if(!err){
                responce.redirect("/" + listName);
            }
        });
    }
});


app.get("/:listName", function (request, responce) {
    const listName = _.capitalize(request.params.listName);

    List.findOne({name : listName}, function(err, foundList){
        if(!err){
            if(!foundList){
                const list = new List({
                    name : listName,
                    items : defaultItems
                });
                list.save();
                responce.redirect("/" + listName);
            }
            else{
                responce.render("list", {ListTitle : listName, itemlist : foundList.items});
            }
        }
    });
})


// app.get("/about", function(request, responce){
//     responce.render("about")
// })
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port);


app.listen(port, function(){
    console.log("server started");
});

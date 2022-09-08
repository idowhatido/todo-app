const bodyParser = require("body-parser");
const express = require("express");
const date = require(__dirname + "/date.js");
const app = express();

const  itemlist = ["test1", "test2"];
const workitem = [];
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));



app.get("/", function (request, responce) {

    let day = date.getDate();
    responce.render("list", {ListTitle : day, itemlist : itemlist});
});

app.post("/", function (request, responce){
    let item = request.body.listItem;

    if(request.body.list == "Work"){
        workitem.push(item);
        responce.redirect("/work");
    }
    else{
        itemlist.push(item);
        responce.redirect("/");
    }
});

app.get("/work", function (request, responce) {
    responce.render("list", {ListTitle: "Work", itemlist:workitem });
})
// app.post("/post", function(request, responce){
//     let item = request.body.listItem;
//     workitem.push(item);   
//})

app.get("/about", function(request, responce){
    responce.render("about")
})

app.listen(3000, function(){
    console.log("server started");
});

const bodyParser = require("body-parser");
const express = require("express")
const app = express();

let itemlist = ["test1", "test2"];
let workitem = [];
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));



app.get("/", function (request, responce) {
    let today = new Date();
    let options = {
        weekday : "long",
        day : "numeric",
        month : "long"
    }
    let day = today.toLocaleDateString("en-US", options);
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

//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser:true});

const itemsSchema = {
  name: String
};

const Item = mongoose.model("Item", itemsSchema);

const Item1 = new Item({
  name: "Welcome to your todolist!"
});

const Item2 = new Item({
  name: "Welcome to your todolist!"
});

const Item3 = new Item({
  name: "Welcome to your todolist!"
});

const deafultItems = [Item1, Item2, Item3];

const ListSchema = {
  name: String,
  items: [itemsSchema]
};

const List = mongoose.model("List", ListSchema);

app.get("/", function(req, res) {
  
  
  Item.find({}, function(err, foundItems){
    if (foundItems.length === 0){
    Item.insertMany(deafultItems, function(err){
      if(err){
        console.log(err);
      }else {
        console.log("Successfully saved deafult items to database");
      }
  });
    res.redirect("/");
  }else{
    res.render("list", {listTitle: "Today", newListItems: foundItems});
  }
  });
});

app.get("/:customListName",function(req,res){
  customListName = req.params.customListName;
  List.findOne({name: customListName},function(err, foundList){
    if(!err){
      if (!foundList){
        //Create a new list
        const list = new List({
          name: customListName,
          items: defaultItems
        });
      
        list.save();
        res.redirect("/"+ customListName);
      } else {
        //Show an existing list
        res.render("list", {listTitle: foundList.name, newListItems:foundList.items});  
      }
      }
  });
  
});


app.post("/", function(req, res){
  const itemName = req.body.newItem;
  const listName = req.body.list;
  const item = new Item({
    name: itemName
  });

  if (listName === "Today"){
    items.save();
    res.redirect("/");
  } else {
    List.findOne({name: listName}, function(err, foundItems){
      foundItems.items.push(item);
      foundList.save();
      res.redirect("/" + listName);
    });
  }
});

app.post("/delete", function(req,res){
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === "Today"){
    Item.findByIdAndRemove(checkedItemId, function(err){
      if(!err){
        console.log("Successfully deleted checked item");
        res.redirect("/");
      }
    });
  } else {
     List.findOneAndUpdate({name: ListName}, {$pull: {items: {_id:checkedItemId}}},function(err, foundList){
       if (!err){
         res.redirect("/" + listName);
       }
     });
  }

  
});


app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});

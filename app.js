const express= require("express");
const bodyParser= require("body-parser");
const date= require(__dirname+"/date.js");
const mongoose= require("mongoose");
const _ = require("lodash");

mongoose.connect('mongodb+srv://sujan:CGAtx0A9EF83fWrT@cluster0.ilovy1s.mongodb.net/todoDB?retryWrites=true&w=majority');

const itemschema= {
  name:{
    type:String,
    required:[true,"Name is not added"],
  }
};

const Item= mongoose.model("Item", itemschema);

const item1= new Item({name:"Welcome to do list"});
const item2= new Item({name:"Hit the + button to add new items"});
const item3= new Item({name:"<-- Hit it to delete an item"});

const defaultitems= [item1,item2,item3];

const listschema={
  name:String,
  items: [itemschema],
}

const List= mongoose.model("List", listschema);

// Item.insertMany(defaultitems);

const app= express();
app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("public"));
app.set("view engine","ejs");

app.get("/",function(req,res){
  
  let day=date.getday();
  Item.find({}).then(function(lists){
    res.render("list",{listtitle:"today",item:lists});
  });  

})

app.post("/",function (req,res){
  console.log(req.body);
  let newItem= new Item({name:req.body.newitem});
  if (req.body.type==="today") {
    Item.insertMany([newItem]);
    res.redirect("/");
  }
  else{
    console.log(req.body.type);
    List.findOne({name:req.body.type}).then(function(lists){
    lists.items.push(newItem);
    console.log(lists.items);
    List.updateOne({name:req.body.type},{items:lists.items}).then(function(){console.log("Updated");});
    res.redirect("/"+req.body.type);      
    })
  }
})

app.post("/delete",function (req,res){

  if (req.body.type==="today") {
    Item.deleteOne({_id:req.body.deletedItem}).then(function(result)
    {
      console.log('Deleted'+result)
    });
    res.redirect("/");
  }
  else{
    List.findOne({name:req.body.type}).then(function(lists){
    let items=lists.items;
   // let counter=0;
    // items.forEach(element => {
      
    //   if (element.id===req.body.deletedItem) {
    //     let a=items.slice(0,counter);
    //     let b=items.slice(counter+1);
    //     lists.items=a.concat(b);
    //   }
    //   counter++;
    // });
    console.log(lists.items);
    List.updateOne({name:req.body.type},{$pull:{items:{_id:req.body.deletedItem}}}).then(function(){console.log("Updated");});
    res.redirect("/"+req.body.type);      
    })
  }

  });

app.get("/:name",function(req,res){
  const listname= _.capitalize(req.params.name);
  console.log(defaultitems);

  List.findOne({name:listname}).then(function(list){
    // console.log(list[0].name);
    if(list===null){
      console.log('off');
      const customlist= new List({
        name:listname,
        items: defaultitems,
      })    
      customlist.save()
      res.render("list",{listtitle:customlist.name,item:customlist.items});
    }
    else{
      res.render("list",{listtitle:list.name,item:list.items});
    }
    
  })



  // res.render("list",{listtitle:req.params});
})

app.get("/about",function (req,res) {
  res.render("about");
});

app.listen("3000",function(){
    console.log('Server started on 3000');
})


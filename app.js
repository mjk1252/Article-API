//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');


mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true, useUnifiedTopology:true, useFindAndModify: false });

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("article", articleSchema);


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

//TODO

app.get("/articles", (req, res) => {
    Article.find({}, (err, foundArticles) => {
        if(!err){
            res.send(foundArticles);
        }
        else{
            console.log(err);
        }
    })
})




app.listen(3000, function() {
  console.log("Server started on port 3000");
});
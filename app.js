//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');


mongoose.connect("mongodb://localhost:27017/wikiDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

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


// Chain Routes for all //////////////////////////////////////////////
app.route("/articles")

    .get((req, res) => {
        Article.find({}, (err, foundArticles) => {
            if (!err) {
                res.send(foundArticles);
            } else {
                res.send(err);
            }
        })
    })


    .post((req, res) => {

        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });

        newArticle.save((err) => {
            if (!err) {
                res.send("Success!");
            } else {
                res.send(err);
            }
        })
    })


    .delete(function (req, res) {
        Article.deleteMany((err) => {
            if (!err) {
                res.send("Deleted all articles");
            } else {
                res.send(err);
            }
        })
    });


// Chain Routes for one //////////////////////////////////////////////
app.route("/articles/:articleTitle")

    .get((req, res) => {
        const articleTitle = req.params.articleTitle;

        Article.findOne({
            title: articleTitle
        }, (err, foundArticle) => {
            if (foundArticle) {
                res.send(foundArticle)
            } else {
                res.send("Not Such Article found")
            }
        });
    })

    .put((req, res) => {
        Article.findOneAndUpdate(
            {title: req.params.articleTitle},
            {title: req.body.title, content: req.body.content},
            {upsert: true},
            (err) => {
            if (!err) {
                res.send("Updated Article")
            } else {
                res.send(err)
            }
        })
    })
    
    .patch((req, res) => {
        Article.findOneAndUpdate(
            {title: req.params.articleTitle},
            {$set: req.body},
            {upsert: false},
            (err) => {
            if (!err) {
                res.send("Updated Article")
            } else {
                res.send(err)
            }
        })
    })
    
    
    .delete((req, res) => {
        Article.deleteOne({title: req.params.articleTitle}, (err) => {
            if(!err){
                res.send("Sucessfully Deleted")
            }
            else{
                res.send("Could not delete required article or article couldnt be find")
            }
        })
    });




app.listen(3000, function () {
    console.log("Server started on port 3000");
});
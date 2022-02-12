"use strict";

// Routes for news/articles

const jsonschema = require("jsonschema");
const axios = require('axios');
const sgMail = require('@sendgrid/mail');
const express = require("express");
const router = new express.Router();
require('dotenv').config();

const { getDates } = require("../helpers/date");
const NEWS_API_KEY = process.env.NEWS_API_KEY;
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const articleSearchSchema = require("../schemas/articleSearch.json");
const { BadRequestError } = require("../expressError");
const{ emailArticle } = require("../helpers/emails");
const { ensureCorrectUser } = require("../middleware/auth");
const User = require("../models/user");
const { weatherTerms } = require("../helpers/weatherQuery")


// returns a list of weather related articles from the past 7 days
// sorted by relevancy

router.get("/", async function (req, res, next) {
    try {
        let dates = getDates();
        let searchTerms = weatherTerms();
        
        let resp = await axios.get(`https://newsapi.org/v2/everything?q=${searchTerms}&from=${dates.earliestDate}&to=${dates.todaysDate}&sortBy=relevance&page=1&apiKey=${NEWS_API_KEY}`);

        return res.json(resp.data);

      } catch (err) {
        return next(err);
      }
});

// search articles with custon keyword

router.get("/search", async function (req, res, next) {
    let searchTerm = req.query;
    // makes multi word search, url friendly
    let encoded = encodeURI(searchTerm.keyword)
  
  
    try {
        const validator = jsonschema.validate(searchTerm, articleSearchSchema);
        if (!validator.valid) {
          const errs = validator.errors.map(e => e.stack);
          throw new BadRequestError(errs);
        }

        const resp = await axios.get(`https://newsapi.org/v2/everything?q=+${encoded}&apiKey=${NEWS_API_KEY}`)

        return res.json(resp.data);

      } catch (err) {
        return next(err);
      }
});

// send article via email
// send article-url and message via body --> {"article": "url.com", "message": "text", "email": "email@email.com"}

router.post("/send-article", function(req, res, next){
    const user = res.locals.user;
    const body = req.body;

    const recipient = body.email;
    const articleUrl = body.article;
    const message = body.message;


    try {
        sgMail.setApiKey(SENDGRID_API_KEY)
        emailArticle(recipient, user, message, articleUrl)
        return res.json("message sent");
      } catch (err) {
        return next(err);
      }
});

// gets a list of a users saved articles and returns them
router.get("/:username/saved-articles", ensureCorrectUser, async function(req,res,next){
  try{
      let username = req.params.username;
      let user = await User.get(username);
      let articles = user.articles;
      return res.json(articles);
  }catch (err){
      return next(err);
  }
})


// user saves article
// send via body --> {"article":{
//                      "title": "title",
//                      "articleUrl": "article url",
//                      "imageUrl": "image url",
//                      "datePublished": "date",
//                      "sourceName": "company",
//                      "description": "description" }}

router.post("/:username/save-article", ensureCorrectUser, async function (req, res, next){
  try {
      let article = req.body.article;
     
      await User.saveArticle(req.params.username, article);
      return res.json({ saved: article.title });
    } catch (err) {
      return next(err);
    }
});

// user deletes a saved article by id
router.delete("/:username/delete-article/:id", ensureCorrectUser, async function (req, res, next){
  try {
      const articleId = +req.params.id;
      await User.removeArticle(req.params.username, articleId);
      return res.json({ deleted: articleId });
    } catch (err) {
      return next(err);
    }
});

    module.exports = router;

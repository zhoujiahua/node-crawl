const express = require("express");
const router = express.Router();

let msgData;
router.use((req, res, next) => {
    msgData = {
        code: 0,
        msg: 'success'
    }
    next();
})

// Home page
router.get("/", (req, res) => {
    res.render('index', { title: 'Home page' })
})

// Crawl the page
router.get("/crawl", (req, res) => {
    res.render('crawl', { title: 'crawl', data: {} });
})

// Crawl the page
router.get("/advantest", (req, res) => {
    res.render('advantest', { title: 'advantest', data: {} });
})

// Webplay the page
router.get("/webplay", (req, res) => {
    res.render('webplay', { title: 'Webplay', data: {} });
})

module.exports = router;
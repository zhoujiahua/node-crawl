const express = require("express");
const router = express.Router();
const request = require("request");
const cheerio = require("cheerio");
const TimeTask = require('./../utils/task');
const TK = new TimeTask();
const checkJwt = require("./../auth/index");
const data = require('./../config/data.json');

let msgData;
router.use((req, res, next) => {
    msgData = {
        code: 0,
        msg: 'success'
    }
    next();
})

// Test API
router.get("/test", (req, res) => {
    msgData.data = {
        name: 'Jerry',
        age: 18
    };
    res.json(msgData);
})

// JWT API
router.get("/jwt", checkJwt, (req, res) => {
    msgData.msg = "Your access token was successfully validated!";
    msgData.data = data;
    res.json(msgData);
});


// Crawl data
router.get("/crawl", (req, res) => {
    let r = req.query;
    r.url = r.url || 'https://baidu.com';
    let headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36",
        Referer: r.url
    }
    request({
        url: r.url,
        method: 'GET',
        headers
    }, (err, response, body) => {
        if (!err && response.statusCode == 200) {
            let $ = cheerio.load(body);
            msgData.referer = r.url;
            msgData.len = $('html link').length;

            $('html link').each((k, v) => {
                let linkUrl = $(v).attr('href');
                if (linkUrl.indexOf(r.url) == -1) {
                    $(v).attr('href', r.url + linkUrl.replace(/https:\//, ''))
                }
            })

            $('html img').each((k, v) => {
                let imgUrl = $(v).attr('src');
                if (imgUrl.indexOf(r.url) == -1) {
                    $(v).attr('src', r.url + imgUrl)
                }
            })

            msgData.data = $.html();
            res.json(msgData)
        }
    })
})


// Webplay
router.get("/webplay", (req, res) => {
    let r = req.query;
    let token = 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlJUUTVNRFE1T0VWRFFUSXpNREJCTTBJeVEwWTROa0l3UVRCQk1UWkNNRFJCTnpnNU9FRTNNdyJ9.eyJpc3MiOiJodHRwczovL3NhbmRib3gubG9naW4ubXlhZHZhbnRlc3QuY29tLyIsInN1YiI6InNhbWxwfGFkdmFudGVzdHxqZXJyeS56aG91QHB0bi5hZHZhbnRlc3QuY29tIiwiYXVkIjpbImh0dHBzOi8vZ2xhc3N3YWxsLmFkdmFudGVzdC5jb20vIiwiaHR0cHM6Ly9teWFkdmFudGVzdC1zYW5kYm94LmV1LmF1dGgwLmNvbS91c2VyaW5mbyJdLCJpYXQiOjE2MDc1NjUyMjUsImV4cCI6MTYwNzY1MTYyNSwiYXpwIjoiUW5TaXZ1YU5ZZGNpSG00UmJ4YXNRSUlGVXhuSWNMRmwiLCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIn0.sLrNfPtnRETH1pm8tbxWbg-qOpD_T75ABCrIZcwd9fEQX83_jNMc6d0Srq6qfSRcKcfDmxydM49FATynEbmSP67oZjLsILEJ5j6iFtZDVkAzPDFZEnDRR_VKkRdqGNzedM6jNL_gHAH2wN_cnyO6Qn5DosVMg0TkvpgXrpliG0yQ2U-3GKKwazZIodwhf3R4mYCbVzfAW7dsp8lWJNeR9MYltKs8uwAQdSs7QoFXQnCCXoANIYegG8qAm7Hzgc0wltL28c0TV5ysOGmJhbJcbEN-BIgJOoA_gYAvzAoCK-yKTz-iePgkIYAV0GhIXpFwRddFj80v2zPLeOniUXb2aA';
    r.url = r.url || 'https://68axsi5ieg.execute-api.eu-central-1.amazonaws.com/spotfire/wp/render/GqW9tzb7IKfvftfQ03/analysis?file=/Glasswall/glasswall_mockup';
    let headers = {
        "content-type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36",
        "Referer": 'http://localhost:3000',
        "authorization": token
    }
    console.log(headers)
    request({
        url: r.url,
        method: 'GET',
        headers
    }, (err, response, body) => {
        if (!err && response.statusCode == 200) {
            let html = cheerio.load(body);
            msgData.data = html.html();
            res.json(msgData)
        }
    })
})


// Start task
router.get("/schedule", (req, res) => {
    let r = req.query,
        timeTask = TK.startTask('0-59 * * * * *');
    console.log(r);
    msgData.data = timeTask;
    res.json(msgData);
})

// Cancel task
router.get('/cancel', (req, res) => {
    let r = req.query,
        cancelTask = TK.cancelTask(r.key);
    console.log(r);
    msgData.data = cancelTask;
    res.json(msgData);
})

module.exports = router;
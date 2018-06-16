const express = require('express');
const app = express();
const http = require('http');
const server = http.Server(app);
const bodyParser = require("body-parser");

// Database
const config = require("./config");
require("./db/db")(config);

const Word = require("./db/schemas/word").Word;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({extended: true}));
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    if (req.method === 'OPTIONS') {
        res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE, PUT");
        res.header("Access-Control-Allow-Headers", "X-Requested-With, Accept, Content-Type, Origin");
        res.header("Access-Control-Request-Headers", "X-Requested-With, Accept, Content-Type, Origin");
        return res.sendStatus(200);
    } else {
        return next();
    }
});
app.use(express.static("public"));


app.all("/word", (req, res) => {
    let theWord = req.query.word || req.body.word;
    console.log(theWord);
    if (!theWord || typeof theWord !== "string") {
        return res.status(400).json({error: "Missing word"});
    }
    theWord = theWord.toLowerCase();

    Word.findOne({word: theWord}, (err, word) => {
        res.json({
            word: word ? word.word : theWord,
            positive: !!word && word.type === "positive",
            negative: !!word && word.type === "negative",
            type: !word ? 0 : word.type === "positive" ? 1 : word.type === "negative" ? -1 : 0
        });
    })
});

app.all("/sentence", (req, res) => {
    let theSentence = req.query.sentence || req.body.sentence;
    console.log(theSentence);
    if (!theSentence || typeof theSentence !== "string") {
        return res.status(400).json({error: "Missing sentence"});
    }
    theSentence = theSentence.toLowerCase();

    let wordArray = theSentence.split(" ");
    Word.find({word: {$in: wordArray}}, (err, words) => {
        let typeMap = {};
        let positiveCount = 0;
        let negativeCount = 0;
        if (words) {
            for (let i = 0; i < words.length; i++) {
                let word = words[i];
                if (word) {
                    typeMap[word.word] = word.type === "positive" ? 1 : word.type === "negative" ? -1 : 0;
                    if (word.type === "positive") positiveCount++;
                    if (word.type === "negative") negativeCount++;
                }
            }
        }

        res.json({
            wordsTotal: wordArray.length,
            wordsPositive: positiveCount,
            wordsNegative: negativeCount,
            positivity: Number((positiveCount / wordArray.length)),
            negativity: Number((negativeCount / wordArray.length)),
            type: positiveCount > negativeCount ? 1 : negativeCount > positiveCount ? -1 : 0,
            types: typeMap
        })
    })
})


server.listen(config.port, function () {
    console.log('listening on *:' + config.port);
});
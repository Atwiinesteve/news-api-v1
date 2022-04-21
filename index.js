// Importing Modules
const express = require('express');
const cheerio = require('cheerio');
const axios = require('axios');


// Application Setup.
const app = express();
const PORT = process.env.PORT || 3000;

// News Papers.
let newspapers = [

    {
        name: "skySports",
        address: "https://www.skysports.com/football",
        base: ''
    },
    {
        name: "espnSports",
        address: "https://africa.espn.com/football/",
        base: 'https://africa.espn.com'
    },
    {
        name: "bbcSports",
        address: "https://www.bbc.com/sport",
        base: 'https://www.bbc.com'
    }

];

// Individual Newspapers
newspapers.forEach((newspaper) => {

    axios.get(newspaper.address)
        .then((response) => {
            const html = response.data
            const $ = cheerio.load(html)

            $('a:contains("football")', html).each(function() {
                const title = $(this).text();
                const url = $(this).attr('href');

                articles.push({
                    title,
                    url: newspaper.base + url,
                    source: newspaper.name
                })
            })

        }).catch((error) => { console.log(error) })

})

// Articles
let articles = []

// Route
app.get('/', (req, res) => {
    res.send('Hello from News API ... ');
})

// Getting News API.
app.get('/news', (req, res) => {
    res.json(articles);
});

// Getting Newspaper by ID.
app.get('/news/:newspaperID', (req, res) => {
    const newspaperID = req.params.newspaperID;
    const newspaperAddress = newspapers.filter((newspaper) => newspaper.name === newspaperID)[0].address;
    const newspaperBase = newspapers.filter((newspaper) => newspaper.name === newspaperID)[0].base;

    axios.get(newspaperAddress)
        .then(response => {
            const html = response.data;
            const $ = cheerio.load(html);
            const specificArticles = [];

            $('a:contains("footbal")', html).each(function() {
                const title = $(this).text();
                const url = $(this).attr('href');

                specificArticles.push({
                    title,
                    url: newspaperBase + url,
                    source: newspaperID
                })

            })

            res.json(specificArticles)

        }).catch((err) => { console.log(err) })
})

// Server Initiliazation.
app.listen(PORT, () => { console.log(`Application Server Running at http://localhost:${PORT}`); });
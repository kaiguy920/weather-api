/////////////////////////////////
// import dependencies
/////////////////////////////////
// this allows us to load our env variables
require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const methodOverride = require('method-override')
const axios = require('axios')

////////////////////////////////////////////
// Create our express application object
////////////////////////////////////////////
const app = require('liquid-express-views')(express())

////////////////////////////////////////////
// Middleware
////////////////////////////////////////////
// this is for request logging
app.use(morgan('tiny'))
app.use(methodOverride('_method'))
// parses urlencoded request bodies
app.use(express.urlencoded({ extended: false }))
// to serve files from public statically
app.use(express.static('public'))

////////////////////////////////////////////
// Routes
////////////////////////////////////////////
app.get('/', (req, res) => {
    res.send('your server is running, better go catch it')
})


//  index route
app.get('/weather', (req, res) => {
    res.render('index')
})

app.get('/weatherForcast', async (req, res) => {
    // defining weatherData here, so render has access to res.data outside of .then
    let weatherData;
    // await is saying, don't render the page until you have this info
    await axios
        .get(`https://api.openweathermap.org/data/2.5/weather?zip=${req.query.zip},us&units=imperial&appid=${process.env.API_KEY}`)
        .then(res => {
            console.log(res.data)
            weatherData = res.data;
        })
        .catch(error => {
            console.error(error)
        })
    res.render('show', { data: weatherData })
})

////////////////////////////////////////////
// Server Listener
////////////////////////////////////////////
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`app is listening on port: ${PORT}`)
})
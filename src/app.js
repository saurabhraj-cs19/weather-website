const path = require('path')
const express = require('express')
const hbs = require('hbs')

const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')
const { request } = require('express')

// console.log(__dirname)
// console.log(__filename)
// console.log(path.join(__dirname, '../public'))


const app = express()

//define paths for express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

//templating engine hbs, setup hbadlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)


//setup static direcroty to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather App',
        name: 'Saurabh Raj'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Saurabh Raj'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        helpText: 'Helpful text',
        title: 'Help',
        name: 'Saurabh Raj'
    })
})


app.get('/weather', (req, res) => {
    if (!req.query.address){
        return res.send({
            error: "You must provide an address"
        })
    }

    geocode(req.query.address, (error, {latitude, longitude, location} = {}) => {
        if (error) {
            return res.send({ error })
        }
        forecast(latitude,longitude,(error, forecastData) =>{
            if (error) {
                return res.send({error})
            }
            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            })
        })
    })
})

app.get('/help/*', (req,res) => {
    res.render('404', {
        title: '404 help',
        name: 'Saurabh Raj',
        errorMessage: 'Help article not found'
    })
})

// * is the wildcard character, match every request
app.get('*', (req,res) => {
    res.render('404', {
        title: '404',
        name: 'Saurabh Raj',
        errorMessage: 'Page not found'
    })
})

//start server
app.listen(3000, () => {
    console.log('Server is up on port 3000')
})
const path = require('path');
var hbs = require('hbs');
const express = require('express');
const request = require('request');
const geoCode = require('./utils/geocode');
const forecast = require('./utils/forecast');
const app = express();
const port = process.env.PORT || 3000;

//define paths for Express config
const viewsPath = path.join(__dirname, "../templates/views");
const publicDirectoryPath = path.join(__dirname, '../public');
const partialsPath = path.join(__dirname, "../templates/partials");

//setup handlbars engine and use location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

//setup static dir to server
app.use(express.static(publicDirectoryPath));

app.get('/', (req, res) => {
    res.render("index", {
        title: 'Weather',
        name: 'Dylan'
    });
});

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Dylan'
    });
});

app.get('/help', (req, res) => {
   
    
    res.render('help', {
        helpText: 'This is some helpful text.',
        title: 'Help',
        name: 'Dylan'
    });
});

app.get('/weather', (req, res) => {
    if(!req.query.address){
        return res.send({
            error:"Please provide an address"
        })
    }
    geoCode(req.query.address, (error, {latitude, longitude, location} = {}) =>{
        if(error){
            return res.send({
                error: error
            })
            
        }
        forecast(latitude, longitude, (error, forecastData) =>{
            if(error){
                return res.send({
                    error: error
                })
            }
            res.send({
                address: req.query.address,
                latitude: latitude,
                longitude: longitude,
                location: location,
                forecast: forecastData
            })
        })
    })
        
    

});

app.get('/products', (req, res) => {
    if(!req.query.search){
        return res.send({
            error: "Must provide search term"
        })
    }
    console.log(req.query)
    res.send({
        products: []
    });
});

app.get("/help/*", (req, res) => {
    res.render('404',{
        errorMessage: "Help Article Not Found",
        name: "Dylan"
    })
});

//404 MUST ALWAYS BE LAST
app.get("*", (req, res) => {
    res.render('404',{
        errorMessage: "Page Not Found",
        name: "Dylan"
    })
});

app.listen(port, () => {
    console.log('Server is up on port ' + port);
});
const request = require('request');

function forecast(latitude, longitude, callback){
  const url = "http://api.weatherstack.com/current?access_key=78c159a29ef69ae7a41c169c17a37f03&query="+ latitude +","+ longitude +"&units=f";
  request({url: url, json: true}, (error, response)=> {
    if(error){
      callback("Unable to connect to weather service", undefined);
    }
    else if(response.body.error){
        callback("Unable to find location", undefined);
      }
    else{
      const currentTemp = response.body.current.temperature;
      const realFeel = response.body.current.feelslike;
      const precipPercent = response.body.current.precip * 100;
      const weatherDescription = response.body.current.weather_descriptions[0];
      callback(undefined, `${weatherDescription}. It is currently ${currentTemp} degrees with a real feel of ${realFeel} and ${precipPercent}% chance of percipitation today`);
      }
  });
  
}

module.exports = forecast;
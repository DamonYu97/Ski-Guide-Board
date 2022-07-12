
function forecast() {
    tint(150, 255);
    image(homeBackgroundImg, 0, 0, windowWidth, windowHeight);
    leftButton('🏠', 50);
    if (buttonValue == 'home') {
        console.log('key pressed');
        currentPage = 'home';
        return
    }

    forecastWeatherBox(hourlyWeather[1], 200);
    forecastWeatherBox(hourlyWeather[2], 420);
    forecastWeatherBox(hourlyWeather[3], 640);
    forecastWeatherBox(hourlyWeather[4], 860);
    forecastWeatherBox(hourlyWeather[5], 1080);
}

function forecastWeatherBox(hourlyData, x) {
    fill(255, 230);
    strokeWeight(4);
    stroke(135,206,235, 200);
    rect(x, 200, 200, 500, 20, 20, 20, 20);

    const date = new Date(hourlyData.dt * 1000);
    const hour = numbleFillZero(date.getHours(), 2);
    const minute = numbleFillZero(date.getMinutes(), 2);
    const time = hour + ":" + minute;

    fill(0)
    if (date.getHours() == new Date().getHours()) {
        textSize(50);
        strokeWeight(3);
        stroke(0);
        text('Now', x + 50, 250);
    } else {
        noStroke();
        textSize(40);
        text(time, x + 50, 250);
    }

    const description = hourlyData.weather[0].main;
    //console.log(description);
    let textIcon = '🌨';
    switch(description) {
        case 'Clouds':
            textIcon = '☁️';
            break;
        case 'Rain':
            textIcon = '🌧';
            break;
        case 'Snow':
            textIcon = '🌨';
            break;
        case 'Clear':
            textIcon = '☀️';
            break;
    }
    textSize(80);
    text(textIcon, x + 60, 350);
    //console.log(description);

    weatherDataRow(hourlyData.temp, "℃", x, 440, '#ff8c00');
    weatherDataRow(hourlyData.humidity, "%", x, 540, '#5489ED');
    weatherDataRow(hourlyData.wind_speed, "m/s", x, 650, '#ff8c00');
}

function weatherDataRow(data, unit, x, y, color) {
    fill(color);
    strokeWeight(6);
    stroke(0, 190);
    const  value = Number(data).toFixed(1);
    if(value.toString().length > 3) {
      textSize(60);
    } else {
      textSize(80)
    }
    text(value, x + 40,  y);
  
    strokeWeight(3);
    textSize(25);
    text(unit, x + 155, y);
}
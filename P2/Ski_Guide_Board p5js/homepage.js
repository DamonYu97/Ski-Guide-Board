let homeBackgroundImg;
let currentWeather = {
    temperature: 1.2,
    humidity: 70,
    wind_direction: 280,
    wind_speed: 6.3,
    snow_level: 0
  };
let hourlyWeather;
let lastWeatherUpdateHour;
let icons = {
    temperatureIcon: null,
    humidityIcon: null,
    windIcon: null,
    snowIcon: null,
    tbarLiftIcon: null,
    chairLiftIcon: null
}
let temperatureSensorData;
let mapImage;
let buttonCode;

function homePage() {
    tint(150, 255);
    image(homeBackgroundImg, 0, 0, windowWidth, windowHeight);
    timeDisplay();
    currentWeatherDisplay();

    fill('green');
    textSize(50);
    text('Piste Map 👇', windowWidth / 2 - 170, windowHeight - 200);
    runsLevelButtonsDisplay();
    leftButton('⛅️', 50);
    rightButton('🎞', 50);
    if (buttonValue == 'easy') {
        console.log('key pressed');
        currentPage = 'easy';
    } else if (buttonValue == 'middle') {
        console.log('key pressed');
        currentPage = 'middle';
    } else if (buttonValue == 'hard') {
        console.log('key pressed');
        currentPage = 'hard';
    } else if (buttonValue == 'hard+') {
        console.log('key pressed');
        currentPage = 'hard+';
    } else if (buttonValue == 'forecast') {
        console.log('key pressed');
        currentPage = 'forecast';
    }
}

function preload() {
  homeBackgroundImg = loadImage('https://images.unsplash.com/photo-1550443640-6e18cdd503a4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2940&q=80');
  updateWeather();
  icons.temperatureIcon = loadImage('assets/icons/temperature.png');
  icons.humidityIcon = loadImage('assets/icons/humidity.png');
  icons.windIcon = loadImage('assets/icons/wind.png');
  icons.snowIcon = loadImage('assets/icons/snow.png');
  icons.tbarLiftIcon = loadImage('assets/icons/tbar-lift.png');
  icons.chairLiftIcon = loadImage('assets/icons/chair-lift.png');
  mapImage = loadImage('assets/map.jpeg');
}


function updateWeather() {
  fetch('https://api.openweathermap.org/data/2.5/onecall?lat=56.766312&lon=-3.398280&exclude=minutely,daily&units=metric&exclude=hourly,daily&appid=a5e335a7e72ea039e68bc32c733fb2fc')
  .then(response => response.json())
  .then(data => {
    if (data.current != undefined && data.current != null) {
        currentWeather = {
          temperature: data.current.temp,
          humidity: data.current.humidity,
          wind_direction: data.current.wind_deg,
          wind_speed: data.current.wind_speed,
          snow_level: 0
        };
        hourlyWeather = data.hourly;
      }
  
    if (temperatureSensorData != undefined && temperatureSensorData.length > 0) {
      currentWeather.temperature = temperatureSensorData[0];
      currentWeather.humidity = temperatureSensorData[1];
    }
    console.log(currentWeather);
    console.log(hourlyWeather);
  });
  lastWeatherUpdateHour = hour();
}

function timeDisplay() {
  let currentDate = new Date();
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  let hour = numbleFillZero(currentDate.getHours(), 2);
  let minute = numbleFillZero(currentDate.getMinutes(), 2);
  let time = hour + ":" + minute;
  let date = day() + " " + months[month()];
  const leftMostX = windowWidth/2 - 350;
  
  fill(255, 230);
  strokeWeight(4);
  stroke(200, 200);
  rect(leftMostX, 30, 700, 200, 20, 20, 20, 20);

  fill(0)
  noStroke();
  textSize(160);
  text(time, leftMostX + 50, 180);
  fill(30, 200);
  textSize(40);
  text(date, leftMostX + 500, 150);  
}

function currentWeatherDisplay() {
    if(hour() == 17 && lastWeatherUpdateHour != 17) {
      console.log('update weather');
      updateWeather();
    }

    if (frameCount%1000 == 0) {
      //console.log('update weather');
      updateWeather();
    }
    if (currentWeather != undefined) {
      const leftMostX = windowWidth/2 - 500;
      const gapX = 250;
      weatherBox(icons.temperatureIcon, 'Temperature', Number(currentWeather.temperature).toFixed(1), '℃', leftMostX, 300);
      weatherBox(icons.humidityIcon, 'Humidity', Number(currentWeather.humidity).toFixed(1), '%', leftMostX + gapX, 300);
      weatherBox(icons.windIcon, 'Wind', Number(currentWeather.wind_speed).toFixed(1), 'm/s', leftMostX + gapX * 2, 300);
      weatherBox(icons.snowIcon, 'Snow Level', Number(currentWeather.snow_level).toFixed(1), 'M', leftMostX + gapX * 3, 300);
    }
}

function weatherBox(icon, name, value, unit, x, y) {
  fill(255, 230);
  strokeWeight(4);
  stroke(135,206,235, 200);
  rect(x, y, 230, 300, 20, 20, 20, 20);

  image(icon, x + 6, y + 20, 32, 32);
  fill('#5489ED');
  strokeWeight(2);
  textSize(25)
  text(name, x + 43, y + 46);

  fill(255,140,0);
  strokeWeight(6);
  stroke(0, 190);
  if(value.toString().length > 3) {
    textSize(70);
  } else {
    textSize(100)
  }
  text(value, x + 30, y + 200);

  strokeWeight(3);
  textSize(30);
  text(unit, x + 180, y + 200);
}

function numbleFillZero(num, length) {
  let str = '' + num;
  while (str.length < length) {
    str = '0' + str;
  }
  return str;
}

function runsLevelButtonsDisplay() {
    const leftMostX = windowWidth / 2 - 400;
    const gap = 200;
    bottomButton('Easy', 'green', leftMostX);
    bottomButton('Middle', '#0066CC', leftMostX + gap);
    bottomButton('Hard', '#CC0000', leftMostX + gap*2);
    bottomButton('Hard+', 10, leftMostX + gap*3);
}

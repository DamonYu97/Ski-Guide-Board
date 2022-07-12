var sketch;
let homeBackgroundImg;
let currentWeather;
let hourlyWeather;
let lastWeatherUpdateHour;
let icons = {
  temperatureIcon: null,
  humidityIcon: null,
  windIcon: null,
  snowIcon: null
}
let tempIcon;
let serial;
const portName = '/dev/tty.usbmodem141401';
let temperatureSensorData;

function preload() {
  homeBackgroundImg = loadImage('https://images.unsplash.com/photo-1550443640-6e18cdd503a4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2940&q=80');
  updateWeather();
  icons.temperatureIcon = loadImage('assets/icons/temperature.png');
  icons.humidityIcon = loadImage('assets/icons/humidity.png');
  icons.windIcon = loadImage('assets/icons/wind.png');
  icons.snowIcon = loadImage('assets/icons/snow.png');
}

function serialEvent() {
  let tempData = serial.readStringUntil('t').trim();
  if (tempData.length > 0) {
    temperatureSensorData = tempData.split('h');
    //console.log(temperatureSensorData.length);
  }
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
    } else {
      currentWeather = {
        temperature: '',
        humidity: '',
        wind_direction: '',
        wind_speed: '',
        snow_level: ''
      };
    }
    
    if (temperatureSensorData != undefined && temperatureSensorData.length > 0) {
      currentWeather.temperature = temperatureSensorData[0];
      currentWeather.humidity = temperatureSensorData[1];
    }
    console.log(currentWeather);
    hourlyWeather = data.hourly;
    console.log(hourlyWeather);
  });
  lastWeatherUpdateHour = hour();
}


function setup() {
  serial = new p5.SerialPort('138.251.252.16');
  serial.on('data', serialEvent);
  serial.open(portName);
  sketch = createCanvas(windowWidth, windowHeight);
  sketch.class("sketch-style");
  sketch.position(0, 0, 'static');
  sketch.parent('sketch_parent');
}

function draw() {
  background(255, 255, 255);
  homePage(serial);
}


function timeDisplay() {
  let currentDate = new Date();
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  let hour = numbleFillZero(currentDate.getHours(), 2);
  let minute = numbleFillZero(currentDate.getMinutes(), 2);
  let time = hour + ":" + minute;
  let date = day() + " " + months[month()];
  
  fill(255, 230);
  strokeWeight(4);
  stroke(200, 200);
  rect(windowWidth/2 - 400, 30, 700, 200, 20, 20, 20, 20);

  fill(0)
  noStroke();
  textSize(160);
  text(time, windowWidth/2 - 350, 180);
  fill(30, 200);
  textSize(40);
  text(date, windowWidth/2 + 100, 180);  
}

function currentWeatherDisplay() {
    if(hour() == 17 && lastWeatherUpdateHour != 17) {
      console.log('update weather');
      updateWeather();
    }

    console.log(frameCount%20);
    if (frameCount%20 == 0) {
      console.log('update weather');
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
  if(value > 9 || value < -9) {
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



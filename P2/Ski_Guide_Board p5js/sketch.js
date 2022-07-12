var sketch;
var serial;
const portName = '/dev/tty.usbmodem142401';
var currentPage = 'home';

function setup() {
  serial = new p5.SerialPort('138.251.177.136');
  serial.on('data', serialEvent);
  //serial.on('data', buttonEvent);
  serial.open(portName);
  sketch = createCanvas(windowWidth, windowHeight);
  sketch.class("sketch-style");
  sketch.position(0, 0, 'static');
  sketch.parent('sketch_parent');
}

function serialEvent() {
  let tempData = serial.readLine().trim();
  if (tempData.length > 0) {
      if (tempData.charAt(0) == 't') {
        //console.log(tempData);
        temperatureSensorData = tempData.substring(1).split('h');
      } else if (tempData.charAt(0) == 'b') {
        buttonCode = tempData.charAt(1);
        setButtonValue();
        console.log(buttonCode);
      } else if (tempData.charAt(0) == 's') {
        scaleRate = 1 + 0.01 * Number(tempData.substring(1));
        console.log(scaleRate);
      } else if (tempData.charAt(0) == 'l') {
        moveX += 20;
      } else if (tempData.charAt(0) == 'r') {
        moveX -= 20;
      } else if (tempData.charAt(0) == 'u') {
        moveY += 20;
      } else if (tempData.charAt(0) == 'd') {
        moveY -= 20;
      } 
   
  }
}

function draw() {
  background(255, 255, 255);
  switch(currentPage) {
    case 'home':
      homePage();
      break;
    case 'forecast':
      forecast();
      break;
    case 'easy':
      pisteMap('easy');
      break;
    case 'middle':
      pisteMap('middle');
      break;
    case 'hard':
      pisteMap('hard');
      break;
    case 'hard+':
      pisteMap('hard+');
      break;
  }
}


#include <DHT.h>
#include <DHT_U.h>
#include <Servo.h>
#include <Servo.h>
Servo myServo;
#define DHTTYPE DHT11

const int SERVOPIN = 9;
const int LEDPIN = 13;
const int BTN1 = 2;
const int BTN2 = 4;
const int BTN3 = 7;
const int BTN4 = 8;
const int BTN5 = 12;
const int xAxis = A1;
const int yAxis = A2;
const int  PTPIN= A3; 
DHT dht = DHT(A0, DHTTYPE);

int angle = 0;
int scale = 0;

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  dht.begin();
  pinMode(LEDPIN, OUTPUT);
  pinMode(BTN1, INPUT);
  pinMode(BTN2, INPUT);
  pinMode(BTN3, INPUT);
  pinMode(BTN4, INPUT);
  pinMode(BTN5, INPUT);
  digitalWrite(LEDPIN, LOW);
  myServo.attach(SERVOPIN);
}

void loop() {
  temperatureRead();
  buttonsRead();
  joyStickRead();
  servoMove();
  readPotentiometer();
  delay(100);
}

void readPotentiometer() {
  int value = analogRead(PTPIN);
  int temp = map(value, 0 ,1023, 0, 50);
  if (temp != scale) {
    scale = temp;
    Serial.println("s" + String(scale));
  }
}

void servoMove() {
  if (Serial.available() > 0) {
    angle = Serial.read();
    myServo.write(angle);
  }
}

void joyStickRead() {
  int xPosition = analogRead(xAxis);
  int yPosition = analogRead(yAxis);
  if (xPosition > 800 ) {
    Serial.println('r');
  } else if (xPosition < 300) {
    Serial.println('l');
  }

  if (yPosition > 800 ) {
    Serial.println('u');
  } else if (yPosition < 300) {
    Serial.println('d');
  }
  
}

void buttonsRead() {
  int btn1State = 0;
  btn1State = digitalRead(BTN1);
  if (btn1State == 1) {
    Serial.println("b1");
  }
  int btn2State = 0;
  btn2State = digitalRead(BTN2);
  if (btn2State == 1) {
    Serial.println("b2");
  }
  int btn3State = 0;
  btn3State = digitalRead(BTN3);
  if (btn3State == 1) {
    Serial.println("b3");
  }
  int btn4State = 0;
  btn4State = digitalRead(BTN4);
  if (btn4State == 1) {
    Serial.println("b4");
  }
  int btn5State = 0;
  btn5State = digitalRead(BTN5);
  if (btn5State == 1) {
    Serial.println("b5");
  }
}

void temperatureRead() {
  
  // Wait a few seconds between measurements.
  delay(100);

  // Reading temperature or humidity takes about 250 milliseconds!
  // Sensor readings may also be up to 2 seconds 'old' (its a very slow sensor)
  float humidity = dht.readHumidity();
  // Read temperature as Celsius (the default)
  float temperature = dht.readTemperature();

  // Check if any reads failed and exit early (to try again).
  if (isnan(humidity) || isnan(temperature) ) {
    //Serial.println(F("Failed to read from DHT sensor!"));
    return;
  }
  //Serial.print(F(" Humidity: "));
  //Serial.print(humidity);
  //Serial.print(F("%  Temperature: "));
  //Serial.print(temperature);
  String buf = 't' + String(temperature) + 'h' + String(humidity); 
  Serial.println(buf);
}

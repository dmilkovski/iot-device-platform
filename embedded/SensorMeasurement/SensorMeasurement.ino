#include <Wire.h>
#include <SoftwareSerial.h>
#include <Adafruit_AM2320.h>

//Define Baud and timeing
#define BAUD 9600

#define ON 1
#define OFF 0

#define loopStartDelay 5000 //ms
#define measureInterval 1000 //ms
#define loopDelay 250 //ms

//Define relay pins
const int RELAYS[] = {2};

unsigned int relayCount = (sizeof(RELAYS)/sizeof(int));
unsigned int timerMeasure = 0;

//ESP communication pins
#define RX_PIN 12
#define TX_PIN 11

//temperature And Humidity sensor
Adafruit_AM2320 am2320 = Adafruit_AM2320();

//define temperature and humidity vars
float temp, humidity;

String relayState = String("");

SoftwareSerial espCommunication(RX_PIN, TX_PIN);

void setup() {
  Serial.begin(BAUD);
  espCommunication.begin(BAUD);
  
  Serial.println("Program init");
  
  //initialize temperature and humidity
  temp = 0;
  humidity = 0;
  
  //initialize relay pins
  for (int i = 0; i < relayCount; i++)
  {
   pinMode(RELAYS[i], OUTPUT);
   digitalWrite(RELAYS[i], OFF);
  }  
  
  delay(loopStartDelay);
  Serial.println("Loop started");
  am2320.begin();
}

void loop() {
  if (espCommunication.available() > 0){
     relayState = espCommunication.readStringUntil('\r');
     for (int i = 0; i < relayCount; i++)
     {
         if (relayState[i] == '1')
            digitalWrite(RELAYS[i], ON);
         else if (relayState[i] == '0')
            digitalWrite(RELAYS[i], OFF);
     }
     relayState = "";
  }

  if (timerMeasure >= measureInterval) {
    temp = am2320.readTemperature();
    delay(40);
    humidity = am2320.readHumidity();
    delay(40);
    
    //Tempereture And Humidity Data (TT.TT|HH.HH)
    //send Tempereture to ESP
    espCommunication.print(temp, 2);
    espCommunication.print('|');
    espCommunication.print(humidity, 2);
    espCommunication.print('\r');

    timerMeasure = 0;
  }

  timerMeasure += loopDelay;
  delay(loopDelay);
}

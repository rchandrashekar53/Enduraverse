#include <WiFi.h>          // For ESP32 (Use <ESP8266WiFi.h> for ESP8266)
#include <HTTPClient.h>
#include <Adafruit_MPU6050.h>
#include <Adafruit_Sensor.h>
#include <Wire.h>

#define WIFI_SSID "YOUR_WIFI_SSID"
#define WIFI_PASS "YOUR_WIFI_SSID_PASSWORD"
#define THINGSPEAK_URL "http://api.thingspeak.com/update"
#define API_KEY "your_thingspeak_WRITE_api_key"

Adafruit_MPU6050 mpu;

void setup() {
  Serial.begin(115200);
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(1000);
  }
  Serial.println("\nConnected to WiFi");

  if (!mpu.begin()) {
    Serial.println("Failed to find MPU6050 chip");
    while (1) {
      delay(10);
    }
  }
  Serial.println("MPU6050 Found!");
}

void loop() {
  sensors_event_t a, g, temp;
  mpu.getEvent(&a, &g, &temp);

  float accX = a.acceleration.x;
  float accY = a.acceleration.y;
  float accZ = a.acceleration.z;
  float gyroX = g.gyro.x;
  float gyroY = g.gyro.y;
  float gyroZ = g.gyro.z;
  float temperature = temp.temperature;

  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    
    String url = String(THINGSPEAK_URL) + "?api_key=" + API_KEY +
                 "&field1=" + String(accX) +
                 "&field2=" + String(accY) +
                 "&field3=" + String(accZ) +
                 "&field4=" + String(gyroX) +
                 "&field5=" + String(gyroY) +
                 "&field6=" + String(gyroZ) +
                 "&field7=" + String(temperature);

    http.begin(url);
    int httpResponseCode = http.GET();
    
    if (httpResponseCode > 0) {
      Serial.print("Data sent to ThingSpeak. Response code: ");
      Serial.println(httpResponseCode);
    } else {
      Serial.print("Error sending data: ");
      Serial.println(httpResponseCode);
    }

    http.end();
  } else {
    Serial.println("WiFi Disconnected!");
  }

  delay(1000); // ThingSpeak allows updates every 15 seconds
}
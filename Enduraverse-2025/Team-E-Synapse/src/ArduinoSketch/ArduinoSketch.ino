#include <Wire.h>
#include <Adafruit_MPU6050.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <NTPClient.h>
#include <WiFiUdp.h>

// Wi-Fi Credentials
const char* ssid = "Galaxy M35 5G C2BA";
const char* password = "12345678";

// Appwrite Endpoint and API Key
const char* appwriteEndpoint = "https://cloud.appwrite.io/v1";
const char* appwriteProjectID = "67b57be1003052aa6282";
const char* appwriteAPIKey = "standard_a90e171d732c3da44d7e841cee4d91b846ff4a19152acead2bef0e0bc78e0147c96ce674006beaa88d86609b8edd6a1c2ddf8a3f26834fafde5be4943852b34f23b591afeda8fdbb95cbe8243b1228d830aa394d5ae4e20039b6837a130ad7365f2ed6b9f5c8a0a945ee7f4501f1f4e724b10c36a36ec9152513ae304cfd50c5";

// Appwrite Database and Collection IDs
const char* databaseID = "67b57da3000fd43c619a";
const char* collectionID = "67b5a262002bc11c0b92";

// MPU6050 setup
Adafruit_MPU6050 mpu;

// NTP setup for timestamp
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "pool.ntp.org", 0, 60000); // UTC time

void setup() {
  Serial.begin(115200);

  // Initialize Wi-Fi
  WiFi.begin(ssid, password);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nConnected to Wi-Fi!");

  // Initialize NTP
  timeClient.begin();
  timeClient.update();

  // Initialize MPU6050
  if (!mpu.begin()) {
    Serial.println("Failed to find MPU6050 chip");
    while (1) { delay(10); }
  }
  Serial.println("MPU6050 Initialized.");
}

String getISO8601Timestamp() {
  timeClient.update();
  unsigned long rawTime = timeClient.getEpochTime();
  
  // Convert epoch time to components (year, month, day, etc.)
  struct tm* timeinfo = gmtime((time_t*)&rawTime);
  
  char buffer[25];
  sprintf(buffer, "%04d-%02d-%02dT%02d:%02d:%02dZ",
          timeinfo->tm_year + 1900, // Year since 1900
          timeinfo->tm_mon + 1,     // Month (0-11)
          timeinfo->tm_mday,        // Day
          timeinfo->tm_hour,        // Hours
          timeinfo->tm_min,         // Minutes
          timeinfo->tm_sec);        // Seconds
  
  return String(buffer);
}

void loop() {
  sensors_event_t a, g, temp;
  mpu.getEvent(&a, &g, &temp);

  // Get current timestamp
  String timestamp = getISO8601Timestamp();

  // Prepare sensor data
  String jsonPayload = "{"
                       "\"documentId\": \"unique()\","
                       "\"data\": {"
                       "\"timestamp\": \"" + timestamp + "\","
                       "\"accelX\": " + String(a.acceleration.x) + ","
                       "\"accelY\": " + String(a.acceleration.y) + ","
                       "\"accelZ\": " + String(a.acceleration.z) + ","
                       "\"gyroX\": " + String(g.gyro.x) + ","
                       "\"gyroY\": " + String(g.gyro.y) + ","
                       "\"gyroZ\": " + String(g.gyro.z) +
                       "}}";

  // Send data to Appwrite
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    String url = String(appwriteEndpoint) + "/databases/" + databaseID + "/collections/" + collectionID + "/documents";
    http.begin(url);
    http.addHeader("Content-Type", "application/json");
    http.addHeader("X-Appwrite-Project", appwriteProjectID);
    http.addHeader("X-Appwrite-Key", appwriteAPIKey);

    int httpResponseCode = http.POST(jsonPayload);

    if (httpResponseCode > 0) {
      String response = http.getString();
      Serial.println("Data sent successfully! Response: " + response);
    } else {
      Serial.println("Error sending data. HTTP Response Code: " + String(httpResponseCode));
    }

    http.end();
  } else {
    Serial.println("Wi-Fi disconnected. Reconnecting...");
    WiFi.begin(ssid, password);
  }

  delay(1000); // Delay before sending the next batch of data
}

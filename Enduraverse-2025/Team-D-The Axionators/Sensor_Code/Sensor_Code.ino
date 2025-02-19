#include <WiFi.h>
#include <WebSocketsClient.h>
#include <Adafruit_MPU6050.h>
#include <Adafruit_Sensor.h>
#include <Wire.h>

const char *ssid = "OnePlus 7Pro";
const char *password = "brnp5587";
const char *server = "192.168.80.19"; // Update with your backend IP

WebSocketsClient webSocket;
Adafruit_MPU6050 mpu;
unsigned long lastSendTime = 0;
const int SEND_INTERVAL = 3000; // 3 seconds interval

void setup()
{
    Serial.begin(115200);
    WiFi.begin(ssid, password);

    while (WiFi.status() != WL_CONNECTED)
    {
        delay(1000);
        Serial.println("Connecting to WiFi...");
    }
    Serial.println("✅ Connected to WiFi");

    if (!mpu.begin())
    {
        Serial.println("❌ MPU6050 Not Found!");
        while (1)
            delay(10);
    }
    Serial.println("✅ MPU6050 Found!");

    mpu.setAccelerometerRange(MPU6050_RANGE_8_G);
    mpu.setGyroRange(MPU6050_RANGE_500_DEG);
    mpu.setFilterBandwidth(MPU6050_BAND_21_HZ);

    webSocket.begin(server, 3000, "/ws");
    webSocket.onEvent(webSocketEvent);
    webSocket.setReconnectInterval(3000); // Reconnect every 3s if disconnected
}

void loop()
{
    unsigned long currentMillis = millis();

    if (currentMillis - lastSendTime >= SEND_INTERVAL)
    {
        lastSendTime = currentMillis;

        sensors_event_t a, g, temp;
        mpu.getEvent(&a, &g, &temp);

        // Detect alert (accident or speed breaker)
        String alertType = detectAlert(a, g);

        String message = "{\"acceleration\": {\"x\": " + String(a.acceleration.x) +
                         ", \"y\": " + String(a.acceleration.y) +
                         ", \"z\": " + String(a.acceleration.z) +
                         "}, \"gyroscope\": {\"x\": " + String(g.gyro.x) +
                         ", \"y\": " + String(g.gyro.y) +
                         ", \"z\": " + String(g.gyro.z) +
                         "}, \"temperature\": " + String(temp.temperature) +
                         ", \"alert\": \"" + alertType + "\"}";

        webSocket.sendTXT(message);
        Serial.println("📡 Sent: " + message);
    }

    webSocket.loop(); // Keep WebSocket connection alive
}

void webSocketEvent(WStype_t type, uint8_t *payload, size_t length)
{
    switch (type)
    {
    case WStype_CONNECTED:
        Serial.println("✅ WebSocket Connected!");
        break;
    case WStype_DISCONNECTED:
        Serial.println("❌ WebSocket Disconnected!");
        break;
    case WStype_TEXT:
        Serial.print("📩 Received: ");
        Serial.println((char *)payload);
        break;
    }
}

// Function to Detect Alerts (Accident, Speed Breaker)
String detectAlert(sensors_event_t a, sensors_event_t g)
{
    if (a.acceleration.x < -8.0)
    {
        return "Accident Detected";
    }
    if (a.acceleration.z > 15.0 && abs(g.gyro.y) > 1.5)
    {
        return "Speed Breaker Detected";
    }
    return "None";
}

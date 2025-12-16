// ESP32 Code (Arduino Framework)
#include <WiFi.h>
#include <HTTPClient.h>
#include <WebSocketsClient.h>
#include <ArduinoJson.h>

// Configuration
const char* WIFI_SSID = "your-wifi-ssid";
const char* WIFI_PASSWORD = "your-wifi-password";
const char* SERVER_HOST = "192.168.1.100";  // Django server IP
const int SERVER_PORT = 8000;
const char* DEVICE_TOKEN = "your-secure-device-token-here";

// Pin Configuration
const int HUMIDITY_SENSOR_PIN = 34;  // Analog input
const int PUMP_RELAY_PIN = 25;       // Digital output

// State
bool pumpState = false;
int minHumidity = 20;
int maxHumidity = 40;
unsigned long lastTelemetryTime = 0;
const unsigned long TELEMETRY_INTERVAL = 1000;  // 1 second

// Objects
HTTPClient http;
WebSocketsClient webSocket;

void setup() {
  Serial.begin(115200);
  
  // Configure pins
  pinMode(PUMP_RELAY_PIN, OUTPUT);
  digitalWrite(PUMP_RELAY_PIN, LOW);
  
  // Connect to WiFi
  connectWiFi();
  
  // Connect WebSocket
  connectWebSocket();
}

void loop() {
  webSocket.loop();
  
  // Send telemetry every second
  if (millis() - lastTelemetryTime >= TELEMETRY_INTERVAL) {
    sendTelemetry();
    lastTelemetryTime = millis();
  }
}

void connectWiFi() {
  Serial.println("Connecting to WiFi...");
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
  Serial.println("\nWiFi connected");
  Serial.print("IP: ");
  Serial.println(WiFi.localIP());
}

void connectWebSocket() {
  String wsUrl = "/ws/device/?token=" + String(DEVICE_TOKEN);
  webSocket.begin(SERVER_HOST, SERVER_PORT, wsUrl);
  webSocket.onEvent(webSocketEvent);
  webSocket.setReconnectInterval(5000);
  Serial.println("WebSocket connecting...");
}

void webSocketEvent(WStype_t type, uint8_t * payload, size_t length) {
  switch(type) {
    case WStype_DISCONNECTED:
      Serial.println("WebSocket disconnected");
      break;
      
    case WStype_CONNECTED:
      Serial.println("WebSocket connected");
      break;
      
    case WStype_TEXT:
      handleWebSocketMessage((char*)payload);
      break;
  }
}

void handleWebSocketMessage(char* payload) {
  StaticJsonDocument<200> doc;
  DeserializationError error = deserializeJson(doc, payload);
  
  if (error) {
    Serial.println("JSON parse error");
    return;
  }
  
  const char* type = doc["type"];
  
  if (strcmp(type, "command") == 0) {
    // Pump command
    bool pumpOn = doc["pump_on"];
    setPumpState(pumpOn);
    Serial.print("Pump command received: ");
    Serial.println(pumpOn ? "ON" : "OFF");
  }
  else if (strcmp(type, "config") == 0) {
    // Threshold update
    minHumidity = doc["min_humidity"];
    maxHumidity = doc["max_humidity"];
    Serial.printf("Threshold updated: min=%d, max=%d\n", minHumidity, maxHumidity);
  }
}

int readHumidity() {
  // Read analog value (0-4095) and convert to percentage (1-100)
  int rawValue = analogRead(HUMIDITY_SENSOR_PIN);
  int humidity = map(rawValue, 0, 4095, 1, 100);
  humidity = constrain(humidity, 1, 100);
  return humidity;
}

void setPumpState(bool state) {
  pumpState = state;
  digitalWrite(PUMP_RELAY_PIN, state ? HIGH : LOW);
}

void sendTelemetry() {
  int humidity = readHumidity();
  unsigned long timestamp = millis() / 1000;
  
  // Create JSON payload
  StaticJsonDocument<200> doc;
  doc["humidity"] = humidity;
  doc["pump_on"] = pumpState;
  doc["timestamp"] = timestamp;
  
  String payload;
  serializeJson(doc, payload);
  
  // Send HTTP POST
  String url = "http://" + String(SERVER_HOST) + ":" + String(SERVER_PORT) + "/api/telemetry/";
  
  http.begin(url);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Authorization", "Bearer " + String(DEVICE_TOKEN));
  
  int httpCode = http.POST(payload);
  
  if (httpCode > 0) {
    if (httpCode == HTTP_CODE_OK) {
      // Successfully sent
    } else {
      Serial.printf("HTTP error: %d\n", httpCode);
    }
  } else {
    Serial.printf("HTTP request failed: %s\n", http.errorToString(httpCode).c_str());
  }
  
  http.end();
}

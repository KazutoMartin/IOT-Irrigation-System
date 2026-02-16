#include <WiFi.h>
#include <HTTPClient.h>
#include <WebSocketsClient.h>
#include <ArduinoJson.h>
#include <time.h>

const char* WIFI_SSID = "Faezeh's net TT";     
const char* WIFI_PASSWORD = "hnbo8539";  

const char* SERVER_HOST = "141.11.182.226"; 
const int SERVER_PORT = 80;
const char* DEVICE_TOKEN = "SECRET"; 
const int RELAY_PIN = 25;      
const int SENSOR_POWER_PIN = 27; 
const int SENSOR_DATA_PIN = 34;
const int DRY_VALUE = 4095; 
const int WET_VALUE = 1500; 
bool isPumpRunning = false;
int currentHumidity = 0;
int startWateringThreshold = 30; 
int stopWateringThreshold = 70;  
unsigned long lastTelemetryTime = 0;
const unsigned long TELEMETRY_INTERVAL = 5000; 
unsigned long lastIrrigationTime = 0;
const unsigned long IRRIGATION_INTERVAL = 1000; 

HTTPClient http;
WebSocketsClient webSocket;

void setup() {
  Serial.begin(115200);

  pinMode(RELAY_PIN, OUTPUT);
  pinMode(SENSOR_POWER_PIN, OUTPUT);
  pinMode(SENSOR_DATA_PIN, INPUT);
  digitalWrite(RELAY_PIN, HIGH); 
  isPumpRunning = false;         
  digitalWrite(SENSOR_POWER_PIN, LOW);

  connectWiFi();
  connectWebSocket();
}

void loop() {
  webSocket.loop();
  
  unsigned long currentMillis = millis();
  if (currentMillis - lastIrrigationTime >= IRRIGATION_INTERVAL) {
    handleAutomaticIrrigation();
    lastIrrigationTime = currentMillis;
  }
  
  if (currentMillis - lastTelemetryTime >= TELEMETRY_INTERVAL) {
    sendTelemetry();
    lastTelemetryTime = currentMillis;
  }
}

int readSoilMoisture() {
  digitalWrite(SENSOR_POWER_PIN, HIGH);
  delay(50); 
  int rawValue = analogRead(SENSOR_DATA_PIN);
  digitalWrite(SENSOR_POWER_PIN, LOW); 

  int percent = map(rawValue, DRY_VALUE, WET_VALUE, 0, 100);
  return constrain(percent, 0, 100);
}

void setPump(bool turnOn) {
  isPumpRunning = turnOn; 
  
  if (turnOn) {
    digitalWrite(RELAY_PIN, LOW); 
    Serial.println(">>> PUMP ON");
  } else {
    digitalWrite(RELAY_PIN, HIGH); 
    Serial.println(">>> PUMP OFF");
  }
}

void handleAutomaticIrrigation() {
  currentHumidity = readSoilMoisture();

  // Serial.print("Current Humidity: ");
  // Serial.print(currentHumidity);
  // Serial.println("%");
  if (currentHumidity < startWateringThreshold && !isPumpRunning) {
    Serial.println("Auto: Soil DRY. Starting Pump...");
    setPump(true);
  }
  else if (currentHumidity > stopWateringThreshold && isPumpRunning) {
    Serial.println("Auto: Soil WET. Stopping Pump...");
    setPump(false);
  }
  
}

void connectWiFi() {
  Serial.print("Connecting to WiFi");
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }
  Serial.println("\nWiFi Connected!");
  Serial.print("Device IP: ");
  Serial.println(WiFi.localIP());
}

void connectWebSocket() {
  String wsUrl = "/ws/device/?token=" + String(DEVICE_TOKEN);
  webSocket.setExtraHeaders("Origin: http://141.11.182.226"); 
  
  webSocket.begin(SERVER_HOST, SERVER_PORT, wsUrl);
  webSocket.onEvent(webSocketEvent);
  webSocket.enableHeartbeat(10000, 3000, 2); 
  webSocket.setReconnectInterval(5000);
}

void webSocketEvent(WStype_t type, uint8_t * payload, size_t length) {
  switch(type) {
    case WStype_DISCONNECTED: Serial.println("[WS] Disconnected!"); break;
    case WStype_CONNECTED: Serial.println("[WS] Connected to Server!"); break;
    case WStype_TEXT: handleServerMessage((char*)payload); break;
    case WStype_ERROR: Serial.println("[WS] Error!"); break;
  }
}

void handleServerMessage(char* payload) {
  StaticJsonDocument<512> doc; // Increased size slightly for safety
  DeserializationError error = deserializeJson(doc, payload);
  if (error) { Serial.println("JSON Error"); return; }
  
  const char* type = doc["type"];
  
  if (strcmp(type, "config") == 0) {
    if (doc.containsKey("min_humidity")) startWateringThreshold = doc["min_humidity"];
    if (doc.containsKey("max_humidity")) stopWateringThreshold = doc["max_humidity"];
    Serial.println("Thresholds updated from Server.");
  }
  else if (strcmp(type, "command") == 0) {
    if (doc.containsKey("pump_on")) {
      bool commandState = doc["pump_on"]; 
      Serial.print("Received Command -> Set Pump: ");
      Serial.println(commandState ? "ON" : "OFF");
      setPump(commandState); 
    }
  }
}

void sendTelemetry() {
  if(WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi Lost! Cannot send data.");
    return;
  }

  StaticJsonDocument<200> doc;
  doc["humidity"] = currentHumidity + 1; 
  doc["timestamp"] = 0; 
  doc["pump_on"] = isPumpRunning;

  String payload;
  serializeJson(doc, payload);

  String url = "http://" + String(SERVER_HOST) + "/api/telemetry/";
  
  http.begin(url);
  http.addHeader("Authorization", "Bearer " + String(DEVICE_TOKEN));
  http.addHeader("Content-Type", "application/json");
  int httpCode = http.POST(payload);
  
  if (httpCode > 0) {
    if (httpCode == HTTP_CODE_OK || httpCode == 201) {
       Serial.printf("Telemetry Sent: %d\n", httpCode);
    } else {
       Serial.printf("Server Error! Code: %d\n", httpCode);
    }
  } else {
    Serial.printf("Connection Failed! Error: %s\n", http.errorToString(httpCode).c_str());
  }
  http.end();
}

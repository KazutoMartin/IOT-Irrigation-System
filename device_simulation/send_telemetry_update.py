import requests
import time
import random

# Server configuration
SERVER_URL = "http://141.11.182.226"
API_ENDPOINT = f"{SERVER_URL}/api/telemetry/"

# 🔐 Authentication
API_TOKEN = "SECRET"   # <-- توکن واقعی را اینجا بگذار

# Device configuration
DEVICE_ID = "ESP32_SIM_001"
DEVICE_NAME = "Simulated ESP32 Sensor"


def generate_sensor_data():
    """Generate simulated sensor readings"""
    return {
        "device_id": DEVICE_ID,
        "device_name": DEVICE_NAME,
        "humidity": round(random.uniform(30.0, 80.0)),
        "pump_on": False,
        "timestamp": int(time.time())
    }


def send_telemetry(data):
    """Send telemetry data to the server"""
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {API_TOKEN}"
    }

    try:
        print("Sending:", data)

        response = requests.post(
            API_ENDPOINT,
            json=data,
            headers=headers,
            timeout=10
        )

        if response.status_code in (200, 201):
            print(f"✓ Data sent successfully | Humidity={data['humidity']}%")
            return True
        else:
            print(f"✗ Failed: {response.status_code} - {response.text}")
            return False

    except requests.exceptions.ConnectionError:
        print("✗ Connection error: Could not reach the server")
    except requests.exceptions.Timeout:
        print("✗ Timeout: Server did not respond in time")
    except Exception as e:
        print(f"✗ Error sending data: {e}")

    return False


def main():
    print("=" * 60)
    print("ESP32 IoT Simulator - Authenticated (Bearer Token)")
    print("=" * 60)
    print(f"Server: {SERVER_URL}")
    print(f"Device ID: {DEVICE_ID}")
    print("=" * 60)

    interval = 5  # seconds

    try:
        while True:
            sensor_data = generate_sensor_data()
            send_telemetry(sensor_data)
            time.sleep(interval)

    except KeyboardInterrupt:
        print("\n✓ Simulator stopped by user")


if __name__ == "__main__":
    main()

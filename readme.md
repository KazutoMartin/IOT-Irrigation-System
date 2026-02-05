# 🌾 IoT Smart Irrigation System

A full-stack IoT solution for automated irrigation management with real-time monitoring and remote pump control.

## 🚀 Features

- Real-time Monitoring via WebSocket  
- Remote pump control from web dashboard  
- Progressive Web App (PWA)  
- ESP32 device integration  
- REST API for historical telemetry  

## 🛠 Tech Stack

Backend:
- Django
- Django REST Framework
- Django Channels
- Daphne
- SQLite

Frontend:
- Next.js (App Router)
- Tailwind CSS
- WebSocket

Infrastructure:
- Nginx
- systemd
- PM2
- Ubuntu VPS

## 📁 Project Structure

IOT-Irrigation-System/
- backend/
  - config/
    - settings.py
    - asgi.py
    - irrigation/
      - models.py
      - views.py
      - consumers.py
      - routing.py
- frontend/
  - irrigation-pwa/
    - app/
    - components/
    - lib/
- scripts/
  - esp32_simulator.py

## 🚀 Backend Setup

1. Create virtual environment
2. Install dependencies
3. Apply migrations
4. Run server with Daphne

## 🚀 Frontend Setup

1. Install dependencies
2. Build production bundle
3. Run with PM2

## 📡 API

REST:
- GET /api/status/
- GET /api/devices/
- POST /api/telemetry/
- GET /api/telemetry/

WebSocket:
- ws://SERVER_IP/ws/irrigation/

## 🧪 Testing

Use the ESP32 WebSocket simulator to send telemetry and receive pump commands.

## 🖥 Production

- Backend served on port 8001 via Daphne
- Frontend served on port 3000 via PM2
- Nginx reverse proxy for HTTP and WebSocket

## 🔐 Security

- DEBUG disabled
- Proper ALLOWED_HOSTS
- Environment variables for secrets
- HTTPS/WSS recommended

## 📊 Architecture

ESP32 ⇄ Django Channels ⇄ Next.js PWA  
Nginx as reverse proxy

## 🚧 Future Work

- Authentication
- Weather API
- ML-based irrigation logic
- Dockerization

## 📝 License

MIT

Deployed at: 141.11.182.226  
Status: Production Ready ✅

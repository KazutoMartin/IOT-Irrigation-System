# 🌾 IoT Smart Irrigation System

![Python](https://img.shields.io/badge/Python-3.11%2B-3776AB?style=flat-square&logo=python&logoColor=white)
![Django](https://img.shields.io/badge/Django-5.0%2B-092E20?style=flat-square&logo=django&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-14%2B-000000?style=flat-square&logo=nextdotjs&logoColor=white)
![ESP32](https://img.shields.io/badge/ESP32-Compatible-E7352C?style=flat-square&logo=espressif&logoColor=white)


A full-stack IoT solution for automated irrigation management featuring real-time monitoring, remote pump control, and responsive web interface. Built with Django Channels WebSocket backend, Next.js Progressive Web App frontend, and ESP32 microcontroller integration.

## 🚀 Features

- Real-time Monitoring via WebSocket  
- Remote pump control from web dashboard  
- Progressive Web App (PWA)  
- ESP32 device integration  
- REST API for historical telemetry

## 🧠 Irrigation Logic

The system uses a threshold-based control mechanism managed entirely by the backend:

- The ESP32 periodically sends soil humidity readings to the Django backend via HTTP.
- The backend continuously evaluates incoming data against configurable minimum and maximum humidity thresholds.
- When the humidity level falls below the minimum threshold, the backend issues a real-time command to activate the irrigation pump.
- Once the humidity reaches or exceeds the maximum threshold, the backend sends a command to deactivate the pump, preventing over‑irrigation.
- Pump control commands are delivered to the ESP32 using WebSocket-based real-time communication, ensuring low latency and reliable state synchronization.

**This design centralizes decision-making in the backend, enabling consistent control logic, easy threshold tuning, and scalable deployment across multiple devices.**

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

> ⚠️ The configuration and example values in this repository are intended for **development only**.  
> Always use a `.env` file and keep secret keys out of the codebase, especially in production.


## 📊 Architecture

ESP32 ⇄ Django Channels ⇄ Next.js PWA  
Nginx as reverse proxy

## 🚧 Future Work

- Authentication
- Weather API
- ML-based irrigation logic
- Dockerization

## 📝 License

This project is licensed under the **MIT License**.  
See the [LICENSE](LICENSE) file for details.


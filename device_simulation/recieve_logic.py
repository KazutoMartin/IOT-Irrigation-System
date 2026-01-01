#!/usr/bin/env python3
"""
Simple WebSocket Listener
Connects to a WebSocket and prints all received messages
"""

import asyncio
import websockets
import json
from datetime import datetime


async def listen_to_websocket(ws_url):
    """Connect to WebSocket and print all messages"""
    print(f"🔌 Connecting to {ws_url}...")
    
    try:
        async with websockets.connect(ws_url) as websocket:
            print(f"✅ Connected successfully at {datetime.now().strftime('%H:%M:%S')}")
            print("📡 Listening for messages... (Press Ctrl+C to stop)\n")
            print("=" * 70)
            
            async for message in websocket:
                timestamp = datetime.now().strftime('%H:%M:%S')
                
                # Try to parse as JSON for pretty printing
                try:
                    data = json.loads(message)
                    print(f"\n[{timestamp}] 📥 Received JSON:")
                    print(json.dumps(data, indent=2))
                except json.JSONDecodeError:
                    # If not JSON, print as plain text
                    print(f"\n[{timestamp}] 📥 Received text:")
                    print(message)
                
                print("-" * 70)
                
    except websockets.exceptions.ConnectionClosed:
        print("\n🔌 Connection closed by server")
    except Exception as e:
        print(f"\n❌ Error: {e}")


async def main():
    """Main function"""
    # Configure your WebSocket URL here
    WS_URL = "ws://141.11.182.226/ws/device/?token=SECRET"
    
    print("=" * 70)
    print("🎧 WebSocket Message Listener")
    print("=" * 70)
    print(f"Target: {WS_URL}")
    print(f"Started: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 70)
    print()
    
    try:
        await listen_to_websocket(WS_URL)
    except KeyboardInterrupt:
        print("\n\n👋 Stopped by user")


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n\n👋 Exiting...")

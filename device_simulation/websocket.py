import asyncio
import websockets

async def quick_test():
    ws_url = "ws://141.11.182.226:8001/ws/frontend/"
    
    try:
        async with websockets.connect(ws_url) as ws:
            print("✓ WebSocket connected!")
            await ws.send("Hello from ESP32 simulator")
            response = await ws.recv()
            print(f"✓ Received: {response}")
    except Exception as e:
        print(f"✗ Failed: {e}")

asyncio.run(quick_test())

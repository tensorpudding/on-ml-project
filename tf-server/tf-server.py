#!/usr/bin/python3

# O(n) Machine Learning Project
# Copyright 2022
# AUTHORS: Michael Moorman, Nghia

import asyncio
import websockets
import numpy as np
import tensorflow as tf
import cv2
import base64

# Load TF handwriting recognition model
model = tf.keras.models.load_model('/model')

def process_image(b64_data):
    print(b64_data)
    print(base64.b64decode(b64_data[22:]))
    png_data = np.frombuffer(base64.b64decode(b64_data[22:]), np.uint8)
    np_data = cv2.imdecode(png_data, cv2.IMREAD_COLOR)
    gray = cv2.cvtColor(np_data, cv2.COLOR_BGR2GRAY)
    resized = cv2.resize(gray, (28,28), interpolation = cv2.INTER_AREA)
    newimg = tf.keras.utils.normalize (resized, axis = 1)
    newimg = np.array(newimg).reshape(-1, 28, 28, 1)
    return newimg

async def process_request(socket):
    async for b64_data in socket:
        img = process_image(b64_data)
        prediction = np.argmax(model.predict(img))
        print(f"Sending prediction: {prediction}")
        await socket.send(str(prediction))

async def main():
    async with websockets.serve(process_request, "0.0.0.0", 8850, subprotocols=["tf"]):
        print("Starting server")
        await asyncio.Future()

asyncio.run(main())
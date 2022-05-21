#!/usr/bin/python3

# O(n) Machine Learning Project
# Copyright 2022
# AUTHORS: Michael Moorman, Nghia

import os
import asyncio
import websockets as ws
import numpy as np
import tensorflow as tf
import cv2
import base64 as b64
import json
import signal

# Load TF handwriting recognition model
model = tf.keras.models.load_model('/model')
# Get server configuration information
SERVER_HOST = os.environ.get('TF_SERVER_HOST') or "localhost"
SERVER_PORT = os.environ.get('TF_SERVER_PORT') or 8850

def process_image(b64_data):
    png_data = np.frombuffer(b64.b64decode(b64_data[22:]), np.uint8)
    np_data = cv2.imdecode(png_data, cv2.IMREAD_COLOR)
    gray = cv2.cvtColor(np_data, cv2.COLOR_BGR2GRAY)
    resized = cv2.resize(gray, (28,28), interpolation = cv2.INTER_AREA)
    newimg = tf.keras.utils.normalize (resized, axis = 1)
    newimg = np.array(newimg).reshape(-1, 28, 28, 1)
    return newimg

async def process_request(socket):
    """
    Main method for processing input.
    Input can be images for prediction, or user-provided "ground truth" for the previous prediction
    """
    async for json_message in socket:
        message = json.loads(json_message)
        if message['type'] == 'image':
            img = process_image(message['b64_data'])
            prediction = np.argmax(model.predict(img))
            print(f"Sending prediction: {prediction}")
            await socket.send(str(prediction))
        elif message['type'] == 'truth':
            # Processing samples code goes here
            img = process_image(message['b64_data'])
            truth = message['ground_truth']
            model.fit(np.array([img]), np.array([truth]))
            await socket.send(f"We have trained the model on this sample with ground truth {truth}")
        else:
            # Raise some kind of error here
            pass

async def main():
    async with ws.serve(process_request, SERVER_HOST, SERVER_PORT, subprotocols=["tf"]):
        print("Starting server")
        await asyncio.Future()

asyncio.run(main())
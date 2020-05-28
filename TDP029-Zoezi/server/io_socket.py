#!/usr/bin/env python3.7
import socket, sys, json, websocket, time, _thread
from config import *
from queue import *
from terminal import Terminal

LISTENING_PORT = int(CONFIG["BACKEND"]["LISTENING_PORT"])
MAX_CONN = int(CONFIG["BACKEND"]["MAX_CONN"])

class inbound_socket:
    def __init__(self):
        self.marketplace_key = CONFIG["BACKEND"]["MARKETPLACE_KEY"]
        self.request_queue = Queue()

    # Listen for updates and putting them in request_queue
    def listen(self):
        attempts = 0
        while(attempts <= 3):
            try:
                ws = websocket.create_connection(CONFIG["BACKEND"]["WEBSOCKET_URL"])
                ws.send(json.dumps({ "type": 'channel2', "command": 'on', "key": self.marketplace_key }))
                Terminal.affirmative("Zoezi socket established")
                Terminal.status("Beginning to listen for updates")
                while True:
                    #will crach if badlly formated data
                    data = json.loads(ws.recv())
                    if (data["type"] != "ping"):
                        self.request_queue.put(data)
            except:
                attempts += 1
                time.sleep(10)
                Terminal.error("Failed to connect to Zoezi socket. Trying again in 10 sec!")
                continue
        Terminal.status("Failed to connect to Zoezi socket. Please try again later!")
        return

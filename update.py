from websocket import WebSocket
import sys

conn = WebSocket()
conn.connect("wss://director.tjhsst.edu/sites/399/terminal/?", cookie=f"csrftoken={sys.argv[1]};sessionid={sys.argv[2]}")
if 'true' not in conn.recv():
    print("Could not connect")
    exit(1)

conn.send_bytes(b'./update.sh\n')
conn.recv()
conn.recv()
while '/site#' not in conn.recv().decode():
    continue
conn.close()
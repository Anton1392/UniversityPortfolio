import socket
import sys
import re
import time

from urllib.parse import urlparse


class Proxy:
    iq_reductors = ["Spongebob", "Britney Spears", "Paris Hilton", "Norrköping"]

    max_buffer_size = 50000000 # In bytes

    timeout_time = 2 # Seconds.

    # Filters content. Takes in a bytearray.
    def is_allowed_content(response, self):
        try:
            # Decodes response to string
            body = response.decode().lower()

            for reductor in self.iq_reductors:
                if reductor.lower() in body:
                    return False
            return True
        except:
            return True # Sometime wierd encodings in body.

    # Filters URLs. Takes in a string.
    def is_allowed_url(url, self):
        print("SCANNED URL: " + url)
        lower_content = url.lower()

        for reductor in self.iq_reductors:
            if reductor.lower() in lower_content:
                return False
        return True

    # Filters client data for host name and url for filtering.
    def get_request_information(request):
        decoded_request = request.decode()
        get_req = decoded_request.split("\n")[0]
        host_name = re.search("Host: (.+)\n", decoded_request).groups()[0][:-1] # Ignores final carriage return
        url = host_name + get_req.split(" ")[1]

        print("Hostname: " + host_name)
        return (host_name, url)

    def run(self):
        # Localhost and user-defined port.
        host = "127.0.0.1"
        try:
            port = int(sys.argv[1])
        except:
            print("ERROR: Port not specified. usage: python main.py port")
            sys.exit(0)

        # Sets up server socket.
        server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        server_socket.bind((host, port))
        print("Server socket initialized at {}:{}.".format(host, port))
        server_socket.listen(5)
        print("Server socket listening.")

        # Main loop
        while True:
            try:
                print("Trying to accept...")
                client_socket, client_address = server_socket.accept() # Client_address currently unused.
                client_socket.settimeout(self.timeout_time)
                print("Connection found!")

                # Iterate, build header request section.
                request = bytearray()
                while bytearray([13,10,13,10]) not in request: # bytearray([13,10,13,10]) is the byte value for \r\n\r\n
                    print("Trying to recieve data from client.")
                    data = client_socket.recv(4096)
                    print(data)
                    if data != bytearray([]): # Append data and reset timer.
                        request += data
                    else:
                        break # if no new data, prevents infinite loops.

                # Slices off any trailing data.
                found = request.find(bytearray([13,10,13,10]))
                request = request[:found+4]

                # Finds valuable information
                host_name, url = self.get_request_information(request)

                # Filters URL, redirects
                if not self.is_allowed_url(url, self):
                    print("TRIED TO REDIRECT BY URL")
                    client_socket.sendall(b"HTTP/1.1 302 Found\r\n")
                    client_socket.sendall(b"Location: http://www.ida.liu.se/~TDTS04/labs/2011/ass2/error1.html\r\n")
                    client_socket.sendall(b"Connection: close\r\n")
                    client_socket.sendall(b"\r\n")
                    client_socket.close()
                    continue # Go to next connection.

                # Connects to webserver
                webserver_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                webserver_socket.settimeout(self.timeout_time)
                webserver_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
                webserver_socket.connect((host_name, 80))
                print("Connected to: " + host_name)

                # Sends request to webserver.
                webserver_socket.sendall(request)


                # Iterate, recieving each iteration, until \r\n\r\n is found, that is the header section.
                response_header = bytearray()
                while bytearray([13,10,13,10]) not in response_header:
                    data = webserver_socket.recv(4096)
                    #print("RESPONSE PART")
                    #print(data)
                    if data != bytearray([]): # Append data and reset timer.
                        response_header += data

                parts = response_header.split(bytearray([13,10,13,10]))
                response_header = parts[0] + bytearray([13,10,13,10])
                buffer = parts[1] # Appends trailing data to buffer, ensuring no losses.
                #print("BUFFER:")
                #print(buffer)

                # Finds content length.
                content_length = 0
                response_header_lower = response_header.decode().lower()
                try:
                    content_length = int(re.search("content-length: (\d+)", response_header_lower).groups()[0])
                except:
                    print("Content length could not be found. Possible 304 code.")
                print("Content-length: " + str(content_length))

                # Look for content-type. If anything but text, sendall the headers + all content.
                # If text, assemble header + text into buffer through iteration, send when length matches content-length.
                curr_content_length = len(buffer)
                if(re.search("content-type: text", response_header_lower)) is None:
                    # Verify and sendall
                    client_socket.sendall(response_header)
                    print("RESPONSE IS IN BYTES")
                    client_socket.sendall(buffer)
                    while curr_content_length < content_length:
                        part = webserver_socket.recv(4096)
                        if part != bytearray([]):
                            #print(part)
                            curr_content_length += len(part)
                            client_socket.sendall(part)
                        else:
                            break

                else:
                    print("RESPONSE IS IN PLAIN TEXT")
                    while curr_content_length < content_length and len(buffer) <= self.max_buffer_size:
                        part = webserver_socket.recv(4096)
                        print("Recieveing part from webserver")
                        if part != bytearray([]):
                            #print(part)
                            curr_content_length += len(part)
                            buffer += part
                        else:
                            break

                    if not self.is_allowed_content(buffer, self): # Redirect
                        print("TRIED TO REDIRECT")
                        client_socket.sendall(b"HTTP/1.1 302 Found\r\n")
                        client_socket.sendall(b"Location: http://www.ida.liu.se/~TDTS04/labs/2011/ass2/error2.html\r\n")
                        client_socket.sendall(b"Connection: close\r\n")
                        client_socket.sendall(b"\r\n")
                    else:
                        print("*************************")
                        print("TRIES TO SEND: ")
                        #print(response_header)
                        #print(buffer)
                        # Sends the headers + what we have in the buffer
                        client_socket.sendall(response_header)
                        client_socket.sendall(buffer)
                        # If there is even more data to send, send it without filtering it, this imposes no limit
                        # There is however a "limit" on how much data can be filtered, only the first 50 Mb gets filtered.
                        while curr_content_length < content_length:
                            part = webserver_socket.recv(4096)
                            if part != bytearray([]):
                                #print(part)
                                curr_content_length += len(part)
                                client_socket.sendall(part)
                            else:
                                break # Content length mismatches may be a thing.


                client_socket.close()
                webserver_socket.close()
                print("Connection Closed")
                print("####################################")
                print("####################################")
                print("####################################")
            except Exception as e:
                print(e)

        server_socket.close()

p = Proxy
p.run(p)

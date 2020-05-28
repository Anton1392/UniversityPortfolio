using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Net;
using System.Net.Sockets;
using System.Threading;
using System.Diagnostics;
using Newtonsoft.Json;
using System.ComponentModel;
using System.Runtime.CompilerServices;
using System.Drawing;
using System.IO;

namespace P2PChatt
{
    public class Connection : INotifyPropertyChanged
    {
        private MainWindow parent;

        Socket sckListen;
        public int listenPort { get; set; }

        Socket sckRemote;

        public string connectIP { get; set; }
        public int connectPort { get; set; }

        Thread recieveThread;
        Thread listenThread;

        private bool _allowSendMessages { get; set; }
        public bool allowSendMessages
        {
            get
            {
                return _allowSendMessages;
            }
            set
            {
                _allowSendMessages = value;
                OnPropertyChanged("allowSendMessages");
            }
        }

        private bool _pendingAccept { get; set; }
        public bool pendingAccept
        {
            get
            {
                return _pendingAccept;
            }
            set
            {
                _pendingAccept = value;
                OnPropertyChanged("pendingAccept");
            }
        }

        private bool _isConnected { get; set; }
        public bool isConnected
        {
            get
            {
                return _isConnected;
            }
            set
            {
                _isConnected = value;
                isNotConnected = !value;
                OnPropertyChanged("isConnected");
            }
        }
        public bool isNotConnected
        {
            get
            {
                return !isConnected;
            }
            set
            {
                OnPropertyChanged("isNotConnected");
            }
        }

        public Connection(MainWindow _parent)
        {
            listenPort = 3000;
            connectIP = "127.0.0.1";
            connectPort = 3000;
            pendingAccept = false;
            allowSendMessages = false;
            parent = _parent;
        }

        /// <summary>
        /// Listens for incoming connections on a port.
        /// </summary>
        public void Listen()
        {
            sckListen = new Socket(AddressFamily.InterNetwork, SocketType.Stream, ProtocolType.Tcp);
            try
            {
                sckListen.Bind(new IPEndPoint(0, listenPort)); // Listens on local port
            }
            catch (SocketException e)
            {
                parent.ShowMessage("Socket in use.");
                return;
            }

            sckListen.Listen(0);
            // Creates new thread with a socket listener.
            listenThread = new Thread(() =>
            {
                parent.ShowMessage(String.Format("Listening on port: {0}", listenPort));

                try
                {
                    sckRemote = sckListen.Accept();
                    StartThreads();
                    sckListen.Close();

                    parent.ShowMessage("Connection pending, please accept or deny.");
                    pendingAccept = true;
                    isConnected = true;
                }
                catch (SocketException e)
                {
                    parent.ShowMessage("Stopped listening.");
                }
            });
            listenThread.IsBackground = true;
            listenThread.Start();
        }

        /// <summary>
        /// Tries to connect to a specified IP address and port.
        /// </summary>
        public void Connect()
        {
            // Stops listening
            if(sckListen != null)
            {
                sckListen.Close();
            }

            sckRemote = new Socket(AddressFamily.InterNetwork, SocketType.Stream, ProtocolType.Tcp);
            parent.ShowMessage(String.Format("Connecting to {0}:{1}", connectIP, connectPort));
            Thread t = new Thread(() =>
            {
                try
                {
                    sckRemote.Connect(new IPEndPoint(IPAddress.Parse(connectIP), connectPort));
                    StartThreads();
                    parent.ShowMessage("Connected to remote, waiting for accept/deny.");
                    isConnected = true;
                }
                catch (SocketException)
                {
                    parent.ShowMessage("No-one is on this port.");
                }
            });
            t.IsBackground = true;
            t.Start();
        }

        /// <summary>
        /// Accepts a connection, allowing communication.
        /// </summary>
        public void Accept()
        {
            if (pendingAccept)
            {
                ProtocolMessage msg = new ProtocolMessage();
                msg.requestType = ProtocolMessage.RequestType.EstablishConnection;

                // Send accept message over socket
                Thread t = new Thread(() =>
                        {
                            try
                            {
                                sckRemote.Send(Encoding.Unicode.GetBytes(msg.Stringify()));
                                allowSendMessages = true;
                                parent.ShowMessage("Accepted connection!");
                            }
                            catch (SocketException e)
                            {
                                Trace.WriteLine("Failed to send accept message, disconnecting.");
                                Disconnect();
                            }
                        });
                t.IsBackground = true;
                t.Start();

                pendingAccept = false;
            }
        }

        /// <summary>
        /// Denies a connection, disallowing communication.
        /// </summary>
        public void Deny()
        {
            if (pendingAccept)
            {
                ProtocolMessage msg = new ProtocolMessage();
                msg.requestType = ProtocolMessage.RequestType.DenyConnection;

                // Send deny message over socket and disconnect.
                Thread t = new Thread(() =>
                        {
                            try
                            {
                                sckRemote.Send(Encoding.Unicode.GetBytes(msg.Stringify()));
                            }
                            catch (SocketException e)
                            {
                                Trace.WriteLine("Failed to send disconnect message, disconnecting anyway.");
                            }
                            parent.ShowMessage("Denied connection.");
                            Disconnect();
                        });
                t.IsBackground = true;
                t.Start();

                pendingAccept = false;
            }
        }

        public void StartThreads()
        {
            // Starts recieving thread
            recieveThread = new Thread(() =>
            {
                //byte[] buf = new byte[1024];
                List<byte> buf = new List<byte>();
                while (true)
                {
                    try
                    {
                        byte[] tempBuf = new byte[sckRemote.Available];
                        sckRemote.Receive(tempBuf);
                        buf.AddRange(tempBuf);

                        parent.ShowMessage("Recieved data. Buffer length: " + buf.Count);
                    }
                    catch (Exception e)
                    {
                        if (e is SocketException || e is ObjectDisposedException)
                        {
                            Trace.WriteLine("Socket recieving failed, disconnecting.");
                            Disconnect();
                            break;
                        }
                        throw;
                    }

                    // Split buffer by \r\n\r\n
                    byte[] stringConvert = buf.ToArray();
                    string tmp = Encoding.Unicode.GetString(stringConvert);

                    tmp = tmp.Replace("\0", ""); // Clean up all shitty zeroes
                    string[] messages = tmp.Split(new[] { "\r\n\r\n" }, StringSplitOptions.None);

                    // If last message is empty it's properly split by \r\n\r\n. All messages parse-able
                    if (messages[messages.Length - 1] == "")
                    {
                        parent.ShowMessage("Parsing...");
                        // Clear buffer, parse all messages except the final ""
                        buf.Clear();
                        for (int i = 0; i < messages.Length - 1; i++)
                        {
                            ParseMessage(messages[i]);
                        }
                    }
                    // Else keep getting data until it's properly parseable.
                }
            });
            recieveThread.IsBackground = true;
            recieveThread.Start();
        }

        private void ParseMessage(string msg)
        {
            // Deserialize into ProcolMessage.
            ProtocolMessage pm = JsonConvert.DeserializeObject<ProtocolMessage>(msg);

            // Do stuff with the message
            if (pm.requestType == ProtocolMessage.RequestType.EstablishConnection)
            {
                parent.ShowMessage("Connection accepted!");
                allowSendMessages = true;
            }
            else if (pm.requestType == ProtocolMessage.RequestType.DenyConnection)
            {
                Disconnect("Connection denied :(");
            }
            else if (pm.requestType == ProtocolMessage.RequestType.Disconnect)
            {
                Disconnect("Other party disconnecting");
            }
            else if (pm.requestType == ProtocolMessage.RequestType.Message)
            {
                parent.NewChatMessage(pm.message, pm.name);
                Data.AddMessage(pm);
            }
            else if (pm.requestType == ProtocolMessage.RequestType.Image)
            {
                parent.ShowMessage("Recieved image");
                // pm.message is a base64 string. Convert back to bytearray, convert that back to image.
                byte[] imgData = Convert.FromBase64String(pm.message);
                Bitmap bmp;
                using (MemoryStream ms = new MemoryStream(imgData))
                {
                    bmp = new Bitmap(ms);
                    parent.ShowImage(bmp);
                }
            }
        }

        public void SendMessage(string msg, string userName)
        {
            if (!allowSendMessages)
            {
                throw new ConnectionNotAcceptedException("Other party needs to accept connection before sending is allowed.");
            }

            ProtocolMessage pm = new ProtocolMessage();
            pm.requestType = ProtocolMessage.RequestType.Message;
            pm.message = msg;
            pm.name = userName;

            Thread t = new Thread(() =>
            {
                // Sends message over socket
                try
                {
                    sckRemote.Send(Encoding.Unicode.GetBytes(pm.Stringify()));
                    Data.AddMessage(pm);
                }
                catch (SocketException e)
                {
                    Disconnect("Failed to send message, disconnecting.");
                }
            });
            t.IsBackground = true;
            t.Start();
        }

        public void Disconnect(string messageToShow = "Disconnecting")
        {
            Thread saveT = new Thread(() =>
            {
                Data.Save();
                Trace.WriteLine("Saved");
            });
            saveT.Start();
            ProtocolMessage msg = new ProtocolMessage();
            msg.requestType = ProtocolMessage.RequestType.Disconnect;
            // Send disconnect message over socket and disconnect.
            Thread t = new Thread(() =>
                    {
                        try
                        {
                            sckRemote.Send(Encoding.Unicode.GetBytes(msg.Stringify()));
                        }
                        catch (Exception e)
                        {
                            if (e is SocketException || e is ObjectDisposedException)
                            {
                                Trace.WriteLine("Failed to send disconnect message, disconnecting anyway.");
                            }
                        }
                        try
                        {
                            sckRemote.Shutdown(SocketShutdown.Both);
                        }
                        catch (Exception e)
                        {
                            if (e is SocketException || e is ObjectDisposedException)
                            {
                                // Socket is already dead, ignore.
                            }
                        }
                        sckRemote.Close();
                        parent.ShowMessage(messageToShow);
                        allowSendMessages = false;
                        isConnected = false;
                        pendingAccept = false;
                        recieveThread.Abort();
                    });
            t.IsBackground = true;
            t.Start();

            parent.ResetChat();
        }

        public void SendImage(Bitmap bmp)
        {
            if (!allowSendMessages)
            {
                throw new ConnectionNotAcceptedException("Other party needs to accept connection before sending is allowed.");
            }

            // Convert image to a bytearray
            MemoryStream ms = new MemoryStream();
            bmp.Save(ms, System.Drawing.Imaging.ImageFormat.Jpeg);
            byte[] imageArray = ms.ToArray();
            parent.ShowMessage("imageArray: " + imageArray.Length);

            // Convert bytearray into a base64-encoded string, put it in the json.
            ProtocolMessage pm = new ProtocolMessage();
            pm.requestType = ProtocolMessage.RequestType.Image;
            pm.message = Convert.ToBase64String(imageArray);
            parent.ShowMessage("pm.message: " + pm.message.Length);
            Thread t = new Thread(() =>
            {
                // Sends message over socket
                try
                {
                    parent.ShowMessage("Sent image. Message length: " + Encoding.Unicode.GetBytes(pm.Stringify()).Length);
                    sckRemote.Send(Encoding.Unicode.GetBytes(pm.Stringify()));
                }
                catch (SocketException e)
                {
                    Disconnect("Failed to send message, disconnecting.");
                }
            });
            t.IsBackground = true;
            t.Start();

        }

        // Handles two-way binding from pendingAccept to the accept/deny buttons.
        public event PropertyChangedEventHandler PropertyChanged;
        private void OnPropertyChanged(string caller)
        {
            var handler = PropertyChanged;
            if (handler != null)
            {
                handler(this, new PropertyChangedEventArgs(caller));
            }
        }
    }
}

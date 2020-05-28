using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace P2PChatt
{
    /// <summary>
    /// Class holding the protocol standard, serializes to Json to pass over sockets.
    /// </summary>
    public class ProtocolMessage
    {
        public enum RequestType { EstablishConnection, DenyConnection, Disconnect, Message, Image };

        public RequestType requestType;
        public string message;
        public string name;
        public string date;

        public ProtocolMessage()
        {
        }

        public string Stringify()
        {
            return JsonConvert.SerializeObject(this) + "\r\n\r\n"; // Add delimiter
        }
    }
}

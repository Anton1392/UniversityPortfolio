using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Diagnostics;
using System.Threading.Tasks;
using System.IO;
using Newtonsoft.Json;

namespace P2PChatt
{
    public class ChatSession
    {
        public List<ProtocolMessage> messages;
        public DateTime date;
        public string name;
        public string other_name;

        public ChatSession()
        {
            name = "";
            other_name = "";
            date = DateTime.Now;
            messages = new List<ProtocolMessage>();
        }
        
        public void AddMessage(ProtocolMessage pm)
        {
            messages.Add(pm);
            if (name == "")
            {
                name = pm.name;
            }
            else if(other_name == "")
            {
                other_name = pm.name;
            }
            else if(pm.name != other_name && pm.name != name) // Two of the same name, then new name.
            {
                name = pm.name;
            }
        }
    }

    public static class Data
    {
        private static ChatSession current_chat = new ChatSession();
        private static string log_file = "chat_log.json";
        
        public static void Init()
        {
            // Creates logfile if it doesn't exist.
            bool exists = File.Exists(log_file);
            if (!exists)
            {
                File.Create(log_file);
            }
            else
            {
                Trace.WriteLine("File already exists");
            }
        }

        public static void Save()
        {
            if (!current_chat.messages.Any())
            {
                // chat session empty, nothing to save
                return;
            }

            string json;
            while (true)
            {
                try
                {
                    json = File.ReadAllText(log_file);
                    break;
                }
                catch (IOException)
                {
                    Trace.WriteLine("File busy... retrying");
                }
            }

            List<ChatSession> log = JsonConvert.DeserializeObject<List<ChatSession>>(json);
            if (log == null)
            {
                log = new List<ChatSession>();
            }
            log.Add(current_chat);
            json = JsonConvert.SerializeObject(log);
            while (true)
            {
                try
                {
                    File.WriteAllText(log_file, json);
                    break;
                }
                catch (IOException e)
                {
                    Trace.WriteLine("File busy.. retrying");
                }
            }
            current_chat = new ChatSession();
        }
        public static void AddMessage(ProtocolMessage pm)
        {
            current_chat.AddMessage(pm);
        }
        public static List<ChatSession> GetLog()
        {
            Trace.WriteLine("> Show chat log!");
            string json;
            try
            {
                json = File.ReadAllText(log_file);
            }
            catch (IOException e)
            {
                // Not fatal.
                return null;
            }
            if (json == "") { return null; }
            List<ChatSession> log = JsonConvert.DeserializeObject<List<ChatSession>>(json);
            return log;
        }
    }
}

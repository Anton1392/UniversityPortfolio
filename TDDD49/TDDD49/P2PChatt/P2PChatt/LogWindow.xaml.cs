using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Diagnostics;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Shapes;

namespace P2PChatt
{
    /// <summary>
    /// Interaction logic for LogWindow.xaml
    /// </summary>
    public partial class LogWindow : Window
    {
        public List<ChatSession> log;
        public LogWindow()
        {
            InitializeComponent();
            log = Data.GetLog();
            if(log != null)
            {
                for (int i = log.Count - 1; i >= 0; i--)
                {
                    ChatSession s = log[i];
                    string txt = "\n" + s.date + " - " + s.name + " & " + s.other_name;
                    foreach (ProtocolMessage m in s.messages)
                    {
                        txt += "\n" + m.name + ": " + m.message;

                    }
                    txt += "\n";
                    this.Dispatcher.Invoke(() =>
                        logBox.Items.Add(txt)
                    );
                }
            }
        }

        private void nameSearch_TextChanged(object sender, TextChangedEventArgs e)
        {
            string searchName = nameSearch.Text;
            if (log == null) { return; }
            var query = from ses in log
                        where ses.name.ToLower().Contains(searchName.ToLower()) || ses.other_name.ToLower().Contains(searchName.ToLower())
                        select ses;

            List<ChatSession> result = query.ToList();

            if (searchName == "")
            {
                result = log;
                Trace.WriteLine("result = log");
            }

            logBox.Items.Clear();
            for (int i = result.Count - 1; i >= 0; i--)
            {
                ChatSession s = result[i];
                Trace.WriteLine("Adding session: " + s.name);
                string txt = "\n" + s.date + " - " + s.name + " & " + s.other_name;
                foreach (ProtocolMessage m in s.messages)
                {
                    txt += "\n" + m.name + ": " + m.message;

                }
                txt += "\n";
                this.Dispatcher.Invoke(() =>
                    logBox.Items.Add(txt)
                );
            }
        }
    }
}

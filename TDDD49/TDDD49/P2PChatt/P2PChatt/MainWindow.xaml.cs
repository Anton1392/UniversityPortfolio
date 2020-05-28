using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Diagnostics;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;
using System.Text.RegularExpressions;
using System.ComponentModel;
using System.Drawing;
using System.IO;
using Microsoft.Win32;

namespace P2PChatt
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>

    public partial class MainWindow : Window, INotifyPropertyChanged
    {
        public Connection conn { get; set; }

        private string _myName { get; set; }
        public string myName
        {
            get
            {
                return _myName;
            }
            set
            {
                _myName = value;
                OnPropertyChanged("myName");
            }
        }

        private string _messageToSend { get; set; }
        public string messageToSend
        {
            get
            {
                return _messageToSend;
            }
            set
            {
                _messageToSend = value;
                OnPropertyChanged("messageToSend");
            }
        }

        public MainWindow()
        {
            Data.Init();
            conn = new Connection(this);
            InitializeComponent();
            DataContext = this;
            myName = "defaultName";
            this.Closing += new CancelEventHandler(MainWindow_Closing);

        }
        void MainWindow_Closing(object sender, CancelEventArgs e)
        {
            Data.Save();
        }

        public void ShowMessage(string msg)
        {
            this.Dispatcher.Invoke(() =>
            {
                txtInfo.Content += "\n" + msg;
                //txtInfo.Content = msg;
            });
        }

        private void btnListen_Click(object sender, RoutedEventArgs e)
        {
            conn.Listen();
        }

        private void btnConnect_Click(object sender, RoutedEventArgs e)
        {
            conn.Connect();
        }

        private void validPort(object sender, TextCompositionEventArgs e)
        {
            // Makes the port box only accept numbers
            Regex re = new Regex("[^0-9]+");
            e.Handled = re.IsMatch(e.Text);
        }

        private void validIP(object sender, TextCompositionEventArgs e)
        {
            // Only accepts numbers and dots
            Regex re = new Regex("[^0-9.]+");
            e.Handled = re.IsMatch(e.Text);
        }

        private void btnDeny_Click(object sender, RoutedEventArgs e)
        {
            conn.Deny();
        }

        private void btnAccept_Click(object sender, RoutedEventArgs e)
        {
            conn.Accept();
        }

        private void btnDisconnect_Click(object sender, RoutedEventArgs e)
        {
            conn.Disconnect();
        }

        private void btnLog_Click(object sender, RoutedEventArgs e)
        {
            new LogWindow().Show();
        }

        private void btnSendMsg_Click(object sender, RoutedEventArgs e)
        {
            if (txtMsg.Text != "")
            {
                conn.SendMessage(messageToSend, myName);
                this.Dispatcher.Invoke(() =>
                {
                    lstChatBox.Items.Add(myName + ": " + messageToSend);
                    txtMsg.Text = "";
                });
            }
        }

        public void NewChatMessage(string msg, string sender)
        {
            this.Dispatcher.Invoke(() =>
            {
                lstChatBox.Items.Add(sender + ": " + msg);
            });
        }

        public void ResetChat()
        {
            this.Dispatcher.Invoke(() =>
            {
                lstChatBox.Items.Clear();
            });
        }

        public void ShowImage(Bitmap bmp)
        {
            this.Dispatcher.Invoke(() =>
            {
                using (MemoryStream memory = new MemoryStream())
                {
                    // Make the Bitmap into an image source
                    bmp.Save(memory, System.Drawing.Imaging.ImageFormat.Jpeg);
                    memory.Position = 0;
                    BitmapImage bitmapImage = new BitmapImage();
                    bitmapImage.BeginInit();
                    bitmapImage.StreamSource = memory;
                    bitmapImage.CacheOption = BitmapCacheOption.OnLoad;
                    bitmapImage.EndInit();

                    // Create a new image control, add it to the chatbox.
                    System.Windows.Controls.Image img = new System.Windows.Controls.Image();
                    img.Width = 100;
                    img.Height = 100;
                    img.Source = bitmapImage;

                    lstChatBox.Items.Add(img);

                    SaveImageLocal(bmp);
                }
            });
        }

        public void SaveImageLocal(Bitmap bmp)
        {
            // Milliseconds since 1970-01-01, unique filename.
            double millis = DateTime.Now.Subtract(DateTime.MinValue.AddYears(1969)).TotalMilliseconds;
            // Saves sent file locally.
            bmp.Save(millis + ".jpg", System.Drawing.Imaging.ImageFormat.Jpeg);
        }

        public event PropertyChangedEventHandler PropertyChanged;
        private void OnPropertyChanged(string caller)
        {
            var handler = PropertyChanged;
            if (handler != null)
            {
                handler(this, new PropertyChangedEventArgs(caller));
            }
        }

        private void btnImage_Click(object sender, RoutedEventArgs e)
        {
            // TODO: Validate file size, throw own exception if too large.
            OpenFileDialog dlg = new OpenFileDialog();
            dlg.Title = "Pick an image.";
            dlg.Filter = "png files (*.png)|*.png";
            if (dlg.ShowDialog() == true)
            {
                // TODO: Validate file size, throw own exception if too large.

                // Loads image, puts it into a memorystream.
                Bitmap bmp = new Bitmap(dlg.FileName);

                // Show image locally
                ShowImage(bmp);

                // Send image over socket
                conn.SendImage(bmp);
            }
        }
    }
}

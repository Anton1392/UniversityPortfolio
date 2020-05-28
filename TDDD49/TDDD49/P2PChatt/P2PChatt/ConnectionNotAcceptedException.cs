using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P2PChatt
{
    public class ConnectionNotAcceptedException : Exception
    {
        public ConnectionNotAcceptedException()
        {

        }
        public ConnectionNotAcceptedException(string message)
            : base(message)
        {

        }
        public ConnectionNotAcceptedException(string message, Exception inner)
            : base(message, inner)
        {

        }
    }
}

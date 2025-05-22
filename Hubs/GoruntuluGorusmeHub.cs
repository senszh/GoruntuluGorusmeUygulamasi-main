using GoruntuluGorusmeBitirme.Database;
using Microsoft.AspNet.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace GoruntuluGorusmeBitirme.Hubs
{
    public class GoruntuluGorusmeHub : Hub
    {
        public override Task OnConnected()
        {
            Clients.Caller.connect();
            return base.OnConnected();
        }

        public void sendVideoCallRequest(string RECEICER_ID, string SENDER_ID)
        {
            GoruntuluGorusmeEntities db = new GoruntuluGorusmeEntities();
            int SID = int.Parse(SENDER_ID);
            ACCOUNT acc = db.ACCOUNT.Where(p => p.USER_ID == SID).FirstOrDefault();
            string RECEIVER_NAME = acc == null ? "" : acc.NAME_SURNAME;
            Clients.Others.sendVideoCallRequestByReceiver(RECEICER_ID, SENDER_ID, RECEIVER_NAME);
        }

        public void connect(int USER_ID, string HUB_ID)
        {
            GoruntuluGorusmeEntities db = new GoruntuluGorusmeEntities();
            ACCOUNT acc = db.ACCOUNT.Where(p => p.USER_ID == USER_ID).FirstOrDefault();
            acc.HUB_ID = HUB_ID;
            db.SaveChanges();
        }

        public void videoCallAccept(string RECEICER_ID, string SENDER_ID)
        {
            Clients.All.videoCallAccept(RECEICER_ID, SENDER_ID);
        }
        public void videoCallReject(string RECEICER_ID, string SENDER_ID)
        {
            Clients.All.videoCallReject(RECEICER_ID, SENDER_ID);
        }
        public void JoinRoom(int RECEICER_ID, int SENDER_ID)
        {
            GoruntuluGorusmeEntities db = new GoruntuluGorusmeEntities();
            ACCOUNT SENDER_USER = db.ACCOUNT.Where(p => p.USER_ID == SENDER_ID).FirstOrDefault();
            ACCOUNT RECEIVER_USER = db.ACCOUNT.Where(p => p.USER_ID == RECEICER_ID).FirstOrDefault();
            Clients.Client(RECEIVER_USER.HUB_ID).connectedRoom(SENDER_USER.HUB_ID);
        }
        public void SendSignal(string signal, string RECEICER_ID)
        {
            GoruntuluGorusmeEntities db = new GoruntuluGorusmeEntities();
            ACCOUNT SENDER_USER = db.ACCOUNT.Where(p => p.HUB_ID == Context.ConnectionId).FirstOrDefault();
            ACCOUNT RECEIVER_USER = db.ACCOUNT.Where(p => p.HUB_ID == RECEICER_ID).FirstOrDefault(); 

            // Make sure both users are valid
            if (SENDER_USER == null || RECEIVER_USER == null)
            {
                return;
            }
            Clients.Client(RECEIVER_USER.HUB_ID).receiveSignal(SENDER_USER.HUB_ID, signal);
        }

        public void sendMessage(string RECEICER_ID, string SENDER_ID, string MESSAGE)
        {

            GoruntuluGorusmeEntities db = new GoruntuluGorusmeEntities();
            MESSAGE MESSAGE_DB = new MESSAGE();
            MESSAGE_DB.MESSAGE_RECEIVER = int.Parse(RECEICER_ID);
            MESSAGE_DB.MESSAGE_SENDER = int.Parse(SENDER_ID);
            MESSAGE_DB.MESSAGE_CONTENT = MESSAGE;
            MESSAGE_DB.MESSAGE_DATE = DateTime.Parse(DateTime.Now.ToString());
            db.MESSAGE.Add(MESSAGE_DB);
            db.SaveChanges();

            Clients.Caller.sendMessageBySender(MESSAGE);
            Clients.Others.sendMessageByReceiver(RECEICER_ID, SENDER_ID, MESSAGE);
        }
    
        public void sendError(string HUB_ID, string message)
        {
            Clients.Client(HUB_ID).sendError(message);
        }
    }
}
using GoruntuluGorusmeBitirme.Database;
using System;

public class ChatHub : Microsoft.AspNet.SignalR.Hub
{
    public void SaveTranscript(int userId, string message)
    {
        System.Diagnostics.Debug.WriteLine("SaveTranscript çaðrýldý: " + userId + " - " + message);
      
        using (var db = new GoruntuluGorusmeEntities())
        {
            var log = new CHAT_LOG
            {
                SENDER_ID = userId,
                MESSAGE_CONTENT = message, // <-- Mesaj içeriði alaný
                SENT_TIME = DateTime.Now  // <-- Kayýt zamaný alaný
            };
            db.CHAT_LOG.Add(log);
            db.SaveChanges();
        }
    }

    // SignalR method to end the call and notify both users
    public void EndCall(int senderUserId, int receiverUserId)
    {
        // Gerekirse burada ek temizlik iþlemleri yapýlabilir

        // Her iki kullanýcýya da görüþmenin sonlandýðýný bildir
        Clients.User(senderUserId.ToString()).onCallEnded();
        Clients.User(receiverUserId.ToString()).onCallEnded();
    }
}
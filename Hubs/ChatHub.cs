using GoruntuluGorusmeBitirme.Database;
using System;

public class ChatHub : Microsoft.AspNet.SignalR.Hub
{
    public void SaveTranscript(int userId, string message)
    {
        System.Diagnostics.Debug.WriteLine("SaveTranscript �a�r�ld�: " + userId + " - " + message);
      
        using (var db = new GoruntuluGorusmeEntities())
        {
            var log = new CHAT_LOG
            {
                SENDER_ID = userId,
                MESSAGE_CONTENT = message, // <-- Mesaj i�eri�i alan�
                SENT_TIME = DateTime.Now  // <-- Kay�t zaman� alan�
            };
            db.CHAT_LOG.Add(log);
            db.SaveChanges();
        }
    }

    // SignalR method to end the call and notify both users
    public void EndCall(int senderUserId, int receiverUserId)
    {
        // Gerekirse burada ek temizlik i�lemleri yap�labilir

        // Her iki kullan�c�ya da g�r��menin sonland���n� bildir
        Clients.User(senderUserId.ToString()).onCallEnded();
        Clients.User(receiverUserId.ToString()).onCallEnded();
    }
}
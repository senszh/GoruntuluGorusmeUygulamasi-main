using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.AspNet.SignalR;
using GoruntuluGorusmeBitirme.Database; // Kendi EF namespace’in

public class ChatHub : Hub
{
    private static readonly Dictionary<int, string> _connections = new Dictionary<int, string>();

    public override Task OnConnected()
    {
        int userId = 0;
        var userIdStr = Context.QueryString.Get("userId");
        if (!string.IsNullOrEmpty(userIdStr))
            int.TryParse(userIdStr, out userId);

        if (userId != 0)
            _connections[userId] = Context.ConnectionId;

        return base.OnConnected();
    }

    public override Task OnDisconnected(bool stopCalled)
    {
        var pair = _connections.FirstOrDefault(x => x.Value == Context.ConnectionId);
        if (pair.Key != 0)
            _connections.Remove(pair.Key);
        return base.OnDisconnected(stopCalled);
    }

    public async Task SaveTranscript(int userId, string transcript)
    {
        using (var db = new GoruntuluGorusmeEntities()) 
        {
            var log = new CHAT_LOG
            {
                SENDER_ID = userId,
                MESSAGE_CONTENT = transcript,
                SENT_TIME = DateTime.Now
            };
            db.CHAT_LOG.Add(log);
            await db.SaveChangesAsync();
        }

        await Clients.Caller.transcriptSaved();
    }

    public Task EndCall(int senderId, int receiverId)
    {
        if (_connections.TryGetValue(senderId, out var senderConn))
            Clients.Client(senderConn).onCallEnded();
        if (_connections.TryGetValue(receiverId, out var receiverConn))
            Clients.Client(receiverConn).onCallEnded();

        return Task.CompletedTask;
    }

    // Görüntülü görüþme isteði gönderen SignalR metodu
    public void sendVideoCallRequest(int receiverUserId, int senderUserId)
    {
        string senderName = "Çaðrý Yapan"; 
        Clients.User(receiverUserId.ToString()).sendVideoCallRequestByReceiver(receiverUserId, senderUserId, senderName);

        GoruntuluGorusmeEntities db = new GoruntuluGorusmeEntities();
        int SID = senderUserId;
        ACCOUNT acc = db.ACCOUNT.Where(p => p.USER_ID == SID).FirstOrDefault();
        string RECEIVER_NAME = acc == null ? "" : acc.NAME_SURNAME;
        Clients.Others.sendVideoCallRequestByReceiver(receiverUserId, senderUserId, RECEIVER_NAME);

        // Debug için log ekle
        System.Diagnostics.Debug.WriteLine($"sendVideoCallRequest: {senderUserId} -> {receiverUserId}");
    }

}

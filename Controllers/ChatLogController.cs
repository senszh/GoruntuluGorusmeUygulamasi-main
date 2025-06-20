using GoruntuluGorusmeBitirme.Database;
using GoruntuluGorusmeBitirme.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace GoruntuluGorusmeBitirme.Controllers
{
    public class ChatLogController : BaseController
    {
        public ActionResult Index()
        {
            var user = (ACCOUNT)Session["LOGIN_USER"];
            if (user == null)
                return RedirectToAction("Index", "Auth");

            var logs = db.CHAT_LOG
                         .Where(x => x.SENDER_ID == user.USER_ID)
                         .OrderByDescending(x => x.SENT_TIME)
                         .ToList();

            ViewBag.USER = user; 

            return View(logs);
        }


        public ActionResult Ozetle()
        {
            var loginUser = (ACCOUNT)Session["LOGIN_USER"];
            if (loginUser == null)
                return RedirectToAction("Index", "Auth");

            // En son konuşma oturumunu bul (kimle konuştuysa)
            var latestPair = db.CHAT_LOG
                .Where(x => x.SENDER_ID == loginUser.USER_ID || x.RECEIVER_ID == loginUser.USER_ID)
                .OrderByDescending(x => x.SENT_TIME)
                .Select(x => new
                {
                    x.SENDER_ID,
                    x.RECEIVER_ID,
                    x.SENT_TIME
                })
                .FirstOrDefault();

            if (latestPair == null)
            {
                ViewBag.Ozet = "Herhangi bir konuşma bulunamadı.";
                return View("OzetSonucu");
            }

            if ((latestPair.SENDER_ID == loginUser.USER_ID && latestPair.RECEIVER_ID == null) ||
                (latestPair.SENDER_ID != loginUser.USER_ID && latestPair.SENDER_ID == null))
            {
                ViewBag.Ozet = "Kullanıcı bilgisi eksik.";
                return View("OzetSonucu");
            }

            int otherUserId = latestPair.SENDER_ID == loginUser.USER_ID
                ? latestPair.RECEIVER_ID.Value
                : latestPair.SENDER_ID.Value;

            var latestDate = latestPair.SENT_TIME.HasValue ? latestPair.SENT_TIME.Value.Date : DateTime.MinValue;

            // Sadece o günkü oturumu al
            var logs = db.CHAT_LOG
                .Where(x =>
                    ((x.SENDER_ID == loginUser.USER_ID && x.RECEIVER_ID == otherUserId) ||
                     (x.SENDER_ID == otherUserId && x.RECEIVER_ID == loginUser.USER_ID)) &&
                    x.SENT_TIME.Value.Date == latestDate)
                .OrderBy(x => x.SENT_TIME)
                .Select(x => x.MESSAGE_CONTENT)
                .ToList();

            if (!logs.Any())
            {
                ViewBag.Ozet = "Bugüne ait konuşma kaydı bulunamadı.";
                return View("OzetSonucu");
            }

            var metin = string.Join(". ", logs);

            var service = new CohereService();
            var ozet = service.Summarize(metin);

            ViewBag.Ozet = ozet;
            return View("OzetSonucu");
        }


        public ActionResult OzetSonucu()
        {
            
            string ozet = "Buraya özet metni gelecek.";
            ViewBag.Ozet = ozet;

            return View();
        }
    }
}

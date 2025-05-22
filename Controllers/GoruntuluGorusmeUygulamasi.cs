using System.Linq;
using System.Web.Mvc;
using GoruntuluGorusmeUygulamasi.Database;
namespace GoruntuluGorusmeUygulamasi.Controllers

{
    public class ChatLogController : Controller
    {
        private GoruntuluGorusmeEntities db = new GoruntuluGorusmeEntities();

        public ActionResult Index()
        {
            var logs = db.CHAT_LOG.ToList();
            return View(logs);
        }
    }
}

	

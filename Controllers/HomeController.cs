using GoruntuluGorusmeBitirme.Attributes;
using GoruntuluGorusmeBitirme.Database;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace GoruntuluGorusmeBitirme.Controllers
{
    [Auth]
    public class HomeController : BaseController
    {
        // GET: Home
        public ActionResult Index(int USER_ID = 0)
        {
            ACCOUNT USER = db.ACCOUNT.Where(p => p.USER_ID == USER_ID).FirstOrDefault();
            if (USER == null)
            {
                USER = new ACCOUNT();
            }
            ViewBag.USER = USER;
            return PartialView();
        }
        public ActionResult AccountsPartial()
        {
            ACCOUNT LOGIN_USER = (ACCOUNT)Session["LOGIN_USER"];

            List<ACCOUNT> accList = db.ACCOUNT.Where(p=> p.USER_ID != LOGIN_USER.USER_ID).ToList();
            return PartialView(accList);
        }
        public ActionResult MessageDetailPartial(ACCOUNT USER)
        {
            ACCOUNT LOGIN_USER = (ACCOUNT)Session["LOGIN_USER"];
            List<MESSAGE> msgList = db.MESSAGE.Where(p => (p.ACCOUNT.USER_ID == USER.USER_ID && p.ACCOUNT1.USER_ID == LOGIN_USER.USER_ID) || (p.ACCOUNT1.USER_ID == USER.USER_ID && p.ACCOUNT.USER_ID == LOGIN_USER.USER_ID)).ToList();
            ViewBag.USER = USER;
            return PartialView(msgList);
        }
    }
}
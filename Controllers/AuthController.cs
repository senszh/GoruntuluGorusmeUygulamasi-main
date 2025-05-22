using GoruntuluGorusmeBitirme.Database;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace GoruntuluGorusmeBitirme.Controllers
{
    public class AuthController : BaseController
    {
        // GET: Auth
        public ActionResult Index()
        {
            ACCOUNT acc = (ACCOUNT) Session["LOGIN_USER"];
            if (acc != null)
            {
                return RedirectToAction("Index", "Home");
            }
            return View();
        }
        public ActionResult Login(string EMAIL, string PASSWORD)
        {
            ACCOUNT acc = db.ACCOUNT.Where(p => p.EMAIL == EMAIL && p.PASS == PASSWORD).SingleOrDefault();
            if (acc == null)
            {
                ViewBag.ERROR = "Lütfen giriş bilgilerinizi kontrol ediniz!";
                return View("Index");
            }
            Session["LOGIN_USER"] = acc;
            return RedirectToAction("Index", "Home");
        }
        public ActionResult RegisterPartial()
        {
            ACCOUNT acc = (ACCOUNT)Session["LOGIN_USER"];
            if (acc != null)
            {
                return RedirectToAction("Index", "Home");
            }
            return PartialView();
        }
        public ActionResult Register(string EMAIL, string NAME_SURNAME, string PASSWORD, string IMAGE)
        {
            ACCOUNT acc = new ACCOUNT();
            acc.EMAIL = EMAIL;
            acc.NAME_SURNAME = NAME_SURNAME;
            acc.PASS = PASSWORD;
            acc.IMAGE = IMAGE;
            db.ACCOUNT.Add(acc);
            db.SaveChanges();
            return RedirectToAction("Index", "Auth");
        }
    }
}
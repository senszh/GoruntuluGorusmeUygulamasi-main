using GoruntuluGorusmeBitirme.Database;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace GoruntuluGorusmeBitirme.Controllers
{
    public class BaseController : Controller
    {
        public GoruntuluGorusmeEntities db;
        // GET: Base
        public BaseController()
        {
            db = new GoruntuluGorusmeEntities();
        }
    }
}
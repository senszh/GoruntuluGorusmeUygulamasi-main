using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace GoruntuluGorusmeBitirme.Attributes
{
    public class AuthAttribute : FilterAttribute, IAuthorizationFilter
    {
        public void OnAuthorization(AuthorizationContext filterContext)
    {
        if (filterContext.HttpContext.Session["LOGIN_USER"] == null)
        {
            filterContext.Result = new RedirectResult("/Auth/Index");

        }
    }
}
}
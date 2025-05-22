using Microsoft.Owin;
using Owin;
using System;
using System.Threading.Tasks;

[assembly: OwinStartup(typeof(GoruntuluGorusmeBitirme.App_Start.GoruntululGorusmeStartup))]

namespace GoruntuluGorusmeBitirme.App_Start
{
    public class GoruntululGorusmeStartup
    {
        public void Configuration(IAppBuilder app)
        {
            app.MapSignalR();
        }
    }
}

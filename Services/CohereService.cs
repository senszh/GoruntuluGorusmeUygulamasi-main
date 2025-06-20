using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Web.Configuration;
using Newtonsoft.Json.Linq;

namespace GoruntuluGorusmeBitirme.Services
{
    public class CohereService
    {
        private readonly string apiKey;

        public CohereService()
        {
            apiKey = WebConfigurationManager.AppSettings["CohereApiKey"];
        }

        public string Summarize(string inputText)
        {
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri("https://api.cohere.ai/v1/");
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

                var body = new
                {
                    text = inputText,
                    length = "medium",
                    format = "paragraph",
                    model = "command",
                    temperature = 0.3
                };

                var content = new StringContent(Newtonsoft.Json.JsonConvert.SerializeObject(body), Encoding.UTF8, "application/json");
                var response = client.PostAsync("summarize", content).Result;

                if (response.IsSuccessStatusCode)
                {
                    var result = response.Content.ReadAsStringAsync().Result;
                    var json = JObject.Parse(result);
                    return json["summary"]?.ToString();
                }

                return "Özetleme başarısız oldu.";
            }
        }
    }
}

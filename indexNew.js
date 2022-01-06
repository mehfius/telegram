var app   = require("./config/server");
var axios = require('axios')

const TELEGRAM_API          = 'https://api.telegram.org/bot'+process.env['TOKEN']
const URI                   = '/webhook/'+process.env['SERVER_URL']
const WEBHOOK_URL           = process.env['TOKEN'] + URI

const init = async () => {

    //const res = await axios.get(`${TELEGRAM_API}/setWebhook?url=${WEBHOOK_URL}`)

    const url = TELEGRAM_API+'/setWebhook?url='+WEBHOOK_URL;

    const res = await axios.get(url);


}

app.listen(5000, async function () {

  //await init();
  console.log("rodando");
});

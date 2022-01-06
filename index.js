require('dotenv').config()

const express     = require('express')
const axios       = require('axios')
const bodyParser  = require('body-parser')

const { TOKEN, SERVER_URL } = process.env
const TELEGRAM_API          = `https://api.telegram.org/bot${TOKEN}`
const URI                   = `/webhook/${TOKEN}`
const WEBHOOK_URL           = SERVER_URL + URI

const app = express()

app.use(bodyParser.json())

const init = async () => {

    const res = await axios.get(`${TELEGRAM_API}/setWebhook?url=${WEBHOOK_URL}`)

}

app.post(URI, async (req, res) => {

    const chatId   = req.body.message.chat.id
    const text     = req.body.message.text
    const username = req.body.message.from.username;
    const users     = ["matheusferraz","fernanshow"];

    console.log("["+chatId+"] ["+username+"] ["+text+"]");

    const main = async function (label,value){

      const { createClient } = require("@supabase/supabase-js");

      var connSupa           = function () {return createClient(process.env['url'],process.env['anom_key'])};

      var connection         = connSupa();

      const { data, error }  = await connection.from("users").select('created_at,id,label,cpf,email,telefone').eq(label,value);

      var text = "";

      if(!data.length){

        text="Comando Inválido ou registro não encontrado";

      }else{

        Object.entries(data[0]).forEach(([key, value]) => {
          
          let label = key;

          let valor = (value)?value:"Não informado";

          if (key=="created_at"){

            var options = { day: "numeric", year: "numeric", month: "short", time: "short", hour12: false, hour: "2-digit", minute: "2-digit" };

            valor=new Date(valor).toLocaleDateString('pt-BR',options)+"\n";
            label="";

          }else if(key=="label"){

            label="Nome  : ";

          }else if(key=="cpf"){

            label="CPF   : ";

          }else if(key=="id"){

            label="ID    : ";

          }else if(key=="email"){

            label="Email : ";

         }else if(key=="telefone"){

            label="Phone : ";

          }

              text+="<pre><b>"+label+"</b>"+valor+"</pre>\n";
      
        });
  

      }

      return text;

    };

    const send = async function (text){
    

      await axios.post(`${TELEGRAM_API}/sendMessage`, {chat_id: chatId,text: text,parse_mode:'html'})

      //await axios.post(`${TELEGRAM_API}/sendMessage`, {chat_id: 1089100690,text: "."})
      

    }; 

    var array = text.split(" ");

    let label = array[0];
    let value = array[1];

    let commands = ["id","email"];

    if(commands.includes(array[0])){

      send(await main(label,value));

    }else{

      send();

    }

    return res.send("1");

})

app.listen(process.env.PORT || 5000, async () => {
    console.log('🚀 app running on port', process.env.PORT || 5000)
    await init()
})
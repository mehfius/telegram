var app   = require("./config/server");
var axios = require('axios')

const conn     = app.config.supa();

const TELEGRAM_API          = 'https://api.telegram.org/bot'+process.env['TOKEN']
const URI                   = '/webhook/'+process.env['TOKEN']
const WEBHOOK_URL           = process.env['SERVER_URL'] + URI

const commands  = ["id","email"];
const admin     = ["matheusferraz","fernanshow"];
const users     = ["matheusferraz","fernanshow"];

const init = async () => {

  const url = TELEGRAM_API+'/setWebhook?url='+WEBHOOK_URL;
  const res = await axios.get(url);

}

const send = async function (chat_id,text){

  await axios.post(`${TELEGRAM_API}/sendMessage`, {chat_id: chat_id,text: text,parse_mode:'html'})

}; 

const consulta = async function (label,value){

  const { data, error }  = await conn.from("view_log").select('created_at,id,label,areas,cpf,email,password,telefone,cards,cardsrecebidos,sessions').eq(label,value);

  return data;

};

const dataBR = function (data){

  var options = { day: "numeric", year: "numeric", month: "short", time: "short", hour12: false, hour: "2-digit", minute: "2-digit" };

  return new Date(data).toLocaleDateString('pt-BR',options);

}

const formataSessions = function (data){

  var text ="";
  var x=0;

  Object.entries(data).forEach(([key, value]) => {

      if(x<20){

        text+="<pre>"+value.ip+" -> "+dataBR(value.created_at)+"</pre>\n";


      }

      x++;

  });

  return text;

} 

const formataData = function (data){

  var text ="";

    Object.entries(data[0]).forEach(([key, value]) => {

      let label = key;

      let valor = (value)?value:"Não informado";

      switch (key) {

        case "created_at":  label="Membro desde : ";valor=dataBR(value)+"\n";break;
        case "label":       label="Nome  : ";break;
        case "areas":       label="Tipo  : ";break;
        case "cpf":         label="CPF   : ";break;
        case "id":          label="ID    : ";break;
        case "email":       label="Email : ";break;
        case "telefone":    label="Phone : ";break;
        case "cards":       label="Cards criados: ";break;
        case "password":    label="Pass  : ";break;
        case "cardsrecebidos":       label="Cards recebidos : ";break; 
        case "sessions":    label="\nÚltimos logins : \n";valor=formataSessions(valor);break;

      }

      text+="<pre><b>"+label+"</b>"+valor+"</pre>\n";

    });

  return text;

}

app.post(URI, async (req, res) => {

  const chat_id   = req.body.message.chat.id
  const text      = req.body.message.text.toLowerCase();
  const username  = req.body.message.from.username;

  console.log("["+chat_id+"] ["+username+"] ["+text+"]");

  var array = text.split(" ");
  var data  = "";
  
  let label = array[0];
  let value = array[1];

  if(users.includes(username)){
  
    if(commands.includes(array[0])){

      var bd = await consulta(label,value);

      if(!bd.length){

        data = label+" "+value+" não encontrado";

      }else{

        if(!admin.includes(username)){

            delete bd[0].password;


        }

        data = formataData(bd);

      }

    }else{

      data="Comando Inválido";

    }
  
  }else{

    data = "Usuário não autorizado"

  }

  send(chat_id,data);

  return res.send("1");

});

app.listen(5000, async function () {

  await init();
  console.log("rodando");
  
});

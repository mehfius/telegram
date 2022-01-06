module.exports = function(app){

  app.post('/login', function(req,res){

    const password = req.body.password;
    const email    = req.body.email;
    const suite    = req.body.suite;
    let   send     = {}


    res.setHeader('Access-Control-Allow-Origin', '*');

    var connection = app.config.supa();

    const main = async function (){

      let { data, error } = await connection.from('view_login').select('*').eq('email',email).eq('password',password)

      console.log(data);
      console.log("Logado: "+data.length);
      console.log("Email: "+req.body.email);

      if(data.length==0){
        
        send.status="504";

      }else{

        //const send = await convert(data[0]);
        data[0].user.session = await insertSession(data[0].id);

        delete data[0].id 

        send = data[0];

        send.status=1;

      }

      res.send(send); 

    }

    main();

    const insertSession = async function (id){

      const uuid      = require('uuid');
      const requestIp = require('request-ip');

      const sessions = {};
            sessions.ip    = requestIp.getClientIp(req);
            sessions.users = id;
            sessions.agent = req.get('User-Agent');
            sessions.uuid  = uuid.v4();

            await connection.from('sessions').insert(sessions);

            return sessions.uuid;
            
    }

  });

};
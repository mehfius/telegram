module.exports = function(app){

  app.post('/filter', function(req,res){

    const session    = req.body.session;
    const modules    = req.body.modules;
    const id         = req.body.id;
    const connection = app.config.supa();

    const main = async function (){


      console.log(req.body);

      var { data, error } = await connection.from("view_filters_"+modules).select('id,label,count').eq('uuid',session);

      res.send(data); 

  }

  main();

  });
  
}
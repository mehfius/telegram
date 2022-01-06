module.exports = function(app){

  app.post('/form', function(req,res){

    const session  = req.body.session;
    const modules  = req.body.modules;
    const id       = req.body.id;

    const conn     = app.config.supa();

    const main     = async function (){

      if(modules=="users"){

          let { data, error } = await conn.from("form_"+modules).select('*').eq('uuid',session).range(0,1);

          Object.entries(data[0].form.fields).forEach(([key, value]) => {

            if(!value.value){
              delete(value["value"]);
            }

            if(!value.attributes){
              delete(value["attributes"]);
            }
            
          });

          console.log(data[0]);

        res.send(data[0]); 

      }else{

        if(id){

          let { data, error } = await conn.from("form_"+modules).select('*').eq('uuid',session).eq('id',id).range(0,1);

          Object.entries(data[0].form.fields).forEach(([key, value]) => {

              if(value.url=='pacientes' && data[0].areas==100){
              
                delete data[0].form.fields.splice(key, 1);
            
              }
            
          });

          console.log(data[0].form.fields);
          res.send(data[0]); 

        }else{

          let { data, error } = await conn.from("form_"+modules).select('*').range(0,1);

            delete data[0].id;
            delete data[0].uuid;

            Object.entries(data[0].form.fields).forEach(([key, value]) => {

              if(value.url=='pacientes' && data[0].areas==100){
              
                delete data[0].form.fields.splice(key, 1);
              
              }

              delete(value["value"]);
              delete(value["uuidv4"]);
              
            });
          
          console.log(data[0]);
          res.send(data[0]);  

        }

      }

    }

    main();

  });
  
}
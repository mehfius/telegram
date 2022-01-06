const { createClient } = require("@supabase/supabase-js");

var connSupa = function () {

  console.log("Conecta no supa");

  return createClient(process.env['url'],process.env['anom_key'])

};
 
module.exports = function () {
  console.log("O autoload carregou o módulo de conexão com bd");

  return connSupa;
};

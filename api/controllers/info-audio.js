// api/controllers/user-audio.js
import "@babel/polyfill";
module.exports = {

  friendlyName: "play audio for user",

  description: "play audio for user",

  inputs: {

  },
  exits: {

  },

  fn: async function (inputs, exits) {

    //sails.log(inputs.valleypos);
    var results;
    var datastore = sails.getDatastore();
    var sql = "select * from audioinfo";
    var v = await datastore.sendNativeQuery(sql, '');
   // sails.log(v.rows);
    if (v.rows != []) {
      results = v.rows;
    }
    //fileinputs = ['123'];
	 sails.log("user=audio.js")
    sails.log(results.length);
  return exits.success({results});
  }

};

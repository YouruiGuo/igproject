// api/controllers/user-audio.js

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
    datastore = sails.getDatastore();
    sql = "select * from audioinfo";
    var v = await datastore.sendNativeQuery(sql, '');
    sails.log(v.rows);
    if (v.rows != []) {
      results = v.rows;
    }
    //fileinputs = ['123'];
    sails.log(results);
    return exits.success(results);
  }

};

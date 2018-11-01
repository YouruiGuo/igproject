// api/controllers/user-audio.js

module.exports = {

  friendlyName: "play audio for user",

  description: "play audio for user",

  inputs: {
    valleypos: {
      type: 'string'
    }
  },
  exits: {

  },

  fn: async function (inputs, exits) {

    //sails.log(inputs.valleypos);
    var fileinputs;
    datastore = sails.getDatastore();
    sql = "select * from audioinfo where valley = $1";
    valuesToEscape = [(parseInt(inputs.valleypos)+1).toString()];
    var v = await datastore.sendNativeQuery(sql, valuesToEscape);
    //sails.log(v.rows);
    if (v.rows != []) {
      fileinputs = v.rows;
    }
    //fileinputs = ['123'];
    sails.log(valuesToEscape, fileinputs);
    return exits.success(fileinputs);
  }

};

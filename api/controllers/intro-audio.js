// api/controllers/intro-audio.js

module.exports = {

  friendlyName: "play audio for intro page",

  description: "play audio for intro page",

  inputs: {
    valleypos: {
      type: 'string'
    }
  },
  exits: {

  },

  fn: async function (inputs, exits) {

    sails.log(inputs.valleypos);
    var fileinputs;
    datastore = sails.getDatastore();
    sql = "select * from audioinfo where valley = $1";
    var valuesToEscape = [inputs.valleypos];
    var v = await datastore.sendNativeQuery(sql, valuesToEscape);
//    sails.log(v.rows);
    if (v.rows != []) {
      fileinputs = v.rows;
    }
    //fileinputs = ['123'];
    sails.log(fileinputs);
    return exits.success(fileinputs);
  }

};

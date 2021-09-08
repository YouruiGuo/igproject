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
	success: {

	}

  },

  fn: async function (inputs, exits) {

    //sails.log(inputs.valleypos);
    var fileinputs;
    var datastore = sails.getDatastore();
    var sql = "select * from audioinfo where valley = $1";
    var valuesToEscape = [(parseInt(inputs.valleypos)+1).toString()];
    var v = await datastore.sendNativeQuery(sql, valuesToEscape);
    //sails.log(v.rows);
    if (v.rows != []) {
      fileinputs = v.rows;
    }
    //fileinputs = ['123'];
    sails.log("user-audio.js")
    sails.log(fileinputs.length);
    return exits.success({fileinputs});
  }

};

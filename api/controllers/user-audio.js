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

    sails.log(inputs.valleypos);
    //var coords = await sails.helpers.getLocation();

    return exits.success();
  }

};

// api/controllers/user-audio.js

module.exports = {

  friendlyName: "play audio for user",

  description: "play audio for user",

  inputs: {

  },

  fn: async function (inputs, exits) {


    var coords = await sails.helpers.getLocation();
    sails.log(coords);
    return exits.success();
  }

};

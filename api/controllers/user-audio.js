// api/controllers/user-audio.js

module.exports = {

  friendlyName: "play audio for user",

  description: "play audio for user",

  inputs: {

  },
  exits: {
    success: {
      viewTemplatePath: 'pages/homepage'
    }
  },

  fn: async function (inputs, exits) {


    //var coords = await sails.helpers.getLocation();

    return exits.success();
  }

};

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

    
    return exits.success();
  }

};

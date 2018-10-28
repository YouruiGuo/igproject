// api/helpers/merge-track.js

module.exports = {

  friendlyName: "merge audio tracks",

  description: "return a merged audio track",

  inputs: {

    longtitude: {
       type: 'number',
    },

    latitude: {
      type: 'number',
    }
  },

  fn: async function (inputs, exits) {



    return exits.success();
  }

};

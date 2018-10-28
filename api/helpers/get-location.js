// api/helpers/get-location.js

module.exports = {

  friendlyName: "get user location",

  description: "return a coordinate with longitutde and latitude",

  inputs: {

  },

  fn: async function (inputs, exits) {

    if (navigator.geolocation) {
        coords = navigator.geolocation.getCurrentPosition();
    }


    return exits.success(coords);
  }

};

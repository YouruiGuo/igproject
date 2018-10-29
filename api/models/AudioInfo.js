/**
* AudioInfo.js
*
* @description ::  A model definition.  Represents a database table/collection/etc.
* @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
*/

module.exports = {
  attributes: {

    musicID: {
      type: 'string',
    },

    filePath: {
      type: 'string',
    },

    longitude: {
      type: 'number',
    },

    latitude: {
      type: 'number',
    },

  },
};

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

    identifier: {
      type: 'string',
    },

    TrackName: {
      type: 'string',
    },

    filePath: {
      type: 'string',
    },

    valley: {
      type: 'string',
    },

    imagePath: {
      type: 'string',
    },

    videoPath: {
      type: 'string',
    },

    generalDesc: {
      type: 'string',
    },

    instrumentDesc: {
      type: 'string',
    },

    musicianDesc: {
      type: 'string',
    },

    lyrictranslit: {
      type: 'string',
    },

    lyrictranslation: {
      type: 'string',
    },

    longitude: {
      type: 'number',
    },

    latitude: {
      type: 'number',
    },

    oneLineDescription: {
      type: 'string',
    },

  },
};

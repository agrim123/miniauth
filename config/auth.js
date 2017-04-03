// config/auth.js
require('dotenv').config();
// expose our config directly to our application using module.exports
module.exports = {

    'facebookAuth' : {
        'clientID'        : process.env.FACEBOOK_APP_ID,
        'clientSecret'    : process.env.FACEBOOK_APP_SECRET,
        'callbackURL'     : process.env.FACEBOOK_CALLBACK_URL,
        'profileURL'      : 'https://graph.facebook.com/v2.5/me?fields=id,first_name,last_name,email,picture,gender,link',

    },

    'googleAuth' : {
        'clientID'         : process.env.GOOGLE_APP_ID,
        'clientSecret'     : process.env.GOOGLE_APP_SECRET,
        'callbackURL'      : process.env.GOOGLE_CALLBACK_URL
    }

};

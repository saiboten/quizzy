/**
 * Created by Tobias on 12.07.2015.
 */

var google = require('googleapis');
var plus = google.plus('v1');
var OAuth2 = google.auth.OAuth2;
var user_service = require('./user_service');

var oauth2Client = new OAuth2('1042604314842-cv14s6t4lva28tjm3f66499fm59s3sbp.apps.googleusercontent.com', 'IINI9r9-nKIW3ulkuxg6FOAF', 'http://localhost:3001/oauth2callback');

// generate a url that asks permissions for Google+ and Google Calendar scopes
var scopes = [
    'https://www.googleapis.com/auth/plus.me',
    'email'
];

var get_url = function() {
    return oauth2Client.generateAuthUrl({
        access_type: 'offline', // 'online' (default) or 'offline' (gets refresh_token)
        scope: scopes // If you only need one scope you can pass it as string
    });
};

var set_username_from_code = function(req,code, callback) {
    console.log("Code from google", code);
    oauth2Client.getToken(code, function(err, tokens) {
        // Now tokens contains an access_token and an optional refresh_token. Save them.
        if(!err) {
            oauth2Client.setCredentials(tokens);

            plus.people.get({ userId: 'me', auth: oauth2Client }, function(err, response) {
               console.log("Response from ME!", response);
                user_service.set_username(req,response.emails[0].value);
                callback();
            });
        }
    });


};

module.exports.get_url = get_url;
module.exports.set_username_from_code = set_username_from_code;
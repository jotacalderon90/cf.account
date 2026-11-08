'use strict';

const logger = require('cl.jotacalderon.cf.framework/lib/log')(__filename);

const { google } = require('googleapis');

const self = function () {
  if (process.env.GOOGLE_CLIENTID && process.env.GOOGLE_CLIENTID != '') {
    this.enabled = true;
  } else {
    return;
  }

  // Create the google auth object which gives us access to talk to google's apis.
  this.createConnection = function () {
    return new google.auth.OAuth2(
      process.env.GOOGLE_CLIENTID,
      process.env.GOOGLE_SECRET,
      process.env.GOOGLE_REDIRECT
    );
  };

  //Get a url which will open the google sign-in page and request access to the scope provided (such as calendar events).
  this.getConnectionUrl = function (auth) {
    return auth.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent', // access type and approval prompt will force a new refresh token to be made each time signs in
      scope: [
        'openid',
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile'
      ],
    });
  };

};

self.prototype.getURL = function () {
  try {
    return this.enabled ? this.getConnectionUrl(this.createConnection()) : '';
  } catch (error) {
    logger.error(error);
    this.error = error;
    return null;
  }
};

self.prototype.getUserInfo = async function (code) {
  try {
    // get the auth 'tokens' from the request
    const auth = this.createConnection();
    const { tokens } = await auth.getToken(code);
    
    auth.setCredentials(tokens);
    
    const ticket = await auth.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENTID,
    });
    
    return ticket.getPayload();
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

self.prototype.sendMemo = async function (tokens, raw) {
  try {
    const auth = this.createConnection();
    auth.setCredentials(tokens);
    const plus = this.getGooglePlusApi(auth);
    const res = await plus.users.messages.send({ userId: 'me', requestBody: { raw: raw } });
    return res.data;
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

module.exports = new self();

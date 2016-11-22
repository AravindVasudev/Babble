module.exports = {
  facebook: {
    clientID: process.env.FB_CLIENT_ID,
    clientSecret: process.env.FB_CLIENT_SECRET,
    callbackURL: process.env.OPENSHIFT_APP_NAME ? 'http://babble.gq/auth/facebook/callback' : 'http://localhost:3000/auth/facebook/callback'
  }
}

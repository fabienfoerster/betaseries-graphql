const express = require('express')
const session = require('express-session')
const passport = require('passport')
const OAuth2Strategy = require('passport-oauth2').Strategy
const app = express()
const port = 4000
const BETASERIES_KEY = process.env.BETASERIES_KEY
const BETASERIES_SECRET = process.env.BETASERIES_SECRET

passport.use(
  new OAuth2Strategy(
    {
      authorizationURL: 'https://www.betaseries.com/authorize',
      tokenURL: 'https://api.betaseries.com/oauth/access_token',
      clientID: BETASERIES_KEY,
      clientSecret: BETASERIES_SECRET,
      callbackURL: `http://localhost:${port}/auth/betaseries/callback`
    },
    function(accessToken, refreshToken, user, verify) {
      user.id = accessToken
      user.accessToken = accessToken
      return verify(null, user)
    }
  )
)

passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser((user, done) => {
  done(null, user)
})

app.use(
  session({
    secret: 'Betaseries rules',
    resave: false,
    saveUninitialized: true
  })
)
app.use(passport.initialize())
app.use(passport.session())

app.get('/', (req, res) => {
  res.redirect('/auth/betaseries')
})

app.get('/auth/betaseries', passport.authenticate('oauth2'))

app.get(
  '/auth/betaseries/callback',
  passport.authenticate('oauth2', {
    failureRedirect: '/auth/betaseries',
    successRedirect: '/graphql'
  })
)

app.get('/graphql', (req, res) => {
  console.log(requser)
  res.send('Hello GraphQL')
})

app.listen(port)
console.log(`Listenning on http://localhost:${port}/graphql ...`)

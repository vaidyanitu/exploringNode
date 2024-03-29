var LocalStrategy = require('passport-local').Strategy;
// var GoogleStrategy = require('passport-google-oauth20').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var User= require('./Model/User');
var config=require('./config');

module.exports=function(passport){

// passport needs ability to serialize and unserialize users out of session

// used to serialize the user for the session
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

// used to deserialize the user
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});


passport.use('local-signup', new LocalStrategy({
// by default, local strategy uses username and password,
// we will override with email
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true //allows us to pass back the entire request to the callback    
},
function(req,email,password,done){//callback with email and password from our form
    console.log("Email:",email);
    console.log("Password:",password);
    User.findOne({ 'local.email' :  email }, function(err, user) {
        // if there are any errors, return the error
        if (err)
            return done(err);

        // check to see if theres already a user with that email
        if (user) {           
            return done(null, false, {'signupMessage': 'That email is already taken.'});
        } else {

            // if there is no user with that email
            // create the user
            var newUser = new User();

            // set the user's local credentials
            newUser.local.email    = email;
            newUser.local.password = newUser.generateHash(password);

            // save the user
            newUser.save(function(err) {
                if (err)
                    throw err;
                return done(null, newUser);
            });
        }
    });
}));

passport.use('local-login', new LocalStrategy({
// by default, local strategy uses username and password,
// we will override with email
usernameField: 'email',
passwordField: 'password',
passReqToCallback: true //allows us to pass back the entire request to the callback    
},
function(req,email,password,done){//callback with email and password from our form
    User.findOne({'local.email':email}, function(err,user){
        if(err) return done(err);
        if(!user) return done(null,false,{message:"Invalid Email or Password"});
        if(!user.validPassword(password))
        return done(null,false,{message:"Invalid Email or Password"});
        return done(null,user);
    });
}));

passport.use(new GoogleStrategy({
    clientID:config.clientID,
    clientSecret:config.clientSecret,
    callbackURL:"http://localhost:2500/google/callback"
},
function(accessToken,refreshToken,profile,done){
    console.log("Profile:",profile);    
    console.log('AccessToken:',accessToken);
    // User.findOrCreate({'google.googleId':profile.id},function(err,user){
    //     return done(err,user);
    // });


    User.findOne({
        'google.googleId':profile.id
    }, function(err, user) {
        if (err) {
            return done(err);
        }
        //No user was found... so create a new user 
        if (!user) {
            user = new User();
            
                user.google.token= accessToken,
                user.google.email= profile.emails[0].value,
                user.google.name= profile.username,
                user.google.googleId= profile.id,
            
            user.save(function(err) {
                if (err) console.log(err);
                return done(err, user);
            });
        } else {
            //found user. Return
            return done(err, user);
        }
    });

}
));


}

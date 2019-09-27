var User=require('./Model/User');

module.exports=function(app,passport){
    app.get('/',(req,res)=>{
        res.send("Hello there!");
    })

    app.post('/register', (req,res) => {
        console.log(req.body);
        if(req.body.email=='' || req.body.email==undefined){
            let error = 'Email Address is required';
            return res.status(400).json(error);
        }
        else if(req.body.password=='' || req.body.password==undefined){
            let error = 'Password is required';
            return res.status(400).json(error);
        }
        else{
            User.findOne({'local.email': req.body.email})
                .then(user => {
                    console.log(user);                
                    if(user){
                    let error = 'Email Address Exists in Database.';
                    return res.status(400).json(error);
                    } else {
                    const newUser = new User();                         
                    newUser.local.email= req.body.email;
                    newUser.local.password=newUser.generateHash(req.body.password);                    
                    
                        newUser.save().then(user => res.json(user))
                            .catch(err => res.status(400).json(err));
                        
                }
            });
        }
   });

   app.post('/signup',function(req,res,next){
   passport.authenticate('local-signup'
   ,function(err,user,info){
       if(err){
       let error = err;
       console.log("Error:",err);
            return res.status(400).json(error);
       }
       if(!user){
        console.log("user exists");
        return res.status(400).json({message:info});
       } 

       //req/res held in closure
       req.logIn(user, function(err){
           if(err){return res.status(400).json(err);}
           console.log(user);
           return res.status(200).json({message:'User Signup Successful',User:user});
       });             
   })(req,res,next)

   /*Since the passport.authenticate() method is called within the route controller, it has access to the request, req, and response, res,
    objects through a closure. If authentication is successful, you call req.LogIn() to establish a login session. req.logIn() is a
     function exposed by Passport.js on the req object.
    When the login operation completes, user is assigned to the req object as req.user.*/
});

 app.post('/login',(req,res,next)=>{ 
     passport.authenticate('local-login',
     function(err,user,info){
        if(err){
            let error = err;
            console.log("Error:",err);
                 return res.status(400).json(error);
            }
        if(!user){
            console.log("user exists");
            return res.status(400).json({message:info});
            }
        //req/res held in closure
       req.logIn(user, function(err){
        if(err){return res.status(400).json(err);}
        console.log(user);
        return res.status(200).json({message:'Login Successful',User:user});
    });  
     })(req,res,next)        
 });

// GET /google
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve
//   redirecting the user to google.com.  After authorization, Google
//   will redirect the user back to this application at /google/callback

app.get('/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login',
   'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/userinfo.email'] }));


app.get('/google/callback',
passport.authenticate('google',  { failureRedirect: '/'}),
(req,res)=>{
    res.redirect('/secret');
})

// Secret route
app.get('/secret', isUserAuthenticated, (req, res) => {
    res.send('You have reached the secret route');
});

app.get('/test',(req,res)=>{
    res.set('Content-Type', 'text/html');
    res.send(new Buffer('<h2>Test String</h2><div class="jumbotron text-center"><h1><span class="fa fa-lock"></span> \
                        Node Authentication</h1><p>Login or Register with:</p><a href="/google" class="btn btn-danger"> \
                        <span class="fa fa-google-plus"></span> Google</a></div>'
        ));  
    res.end();
})

function isUserAuthenticated(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.send('You must login!');
    }
}

}


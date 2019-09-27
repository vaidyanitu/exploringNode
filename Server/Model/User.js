const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

const UserSchema = new Schema({
    local            : {
        email        : String,
        password     : String
    },
    facebook         : {
        id           : String,
        token        : String,
        name         : String,
        email        : String
    },
    google         : {
        googleId     : String,
        token        : String,
        name         : String,
        email        : String
    }
});

//methods=====================================
//generating a hash
UserSchema.methods.generateHash= function(password){
    return bcrypt.hashSync(password,bcrypt.genSaltSync(8),null);
};

//checking if password is valid
UserSchema.methods.validPassword= function(password){
    return bcrypt.compareSync(password,this.local.password);
};

module.exports=mongoose.model('User',UserSchema);

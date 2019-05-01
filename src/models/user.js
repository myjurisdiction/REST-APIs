const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const mongooseHide = require('mongoose-hidden')()
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Todos = require('../models/tasks')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        default: 'Anonymous'
    },
    email: {
        type: String,
        required: true,
        unique: true,
        // hide: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)){
                throw new Error('invalid email')
            }
        }
        
    },
    password: {
        type: String,
        required: true,
        hide: true,
        trim: true,
        minlength: 6,  
        validate(value){
            if (value.toLowerCase().includes('password')){
                throw new Error("your password contains 'password' ")
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer,
        hide: true
    }

}, {
    timestamps: true
    } )
userSchema.plugin(uniqueValidator)
userSchema.plugin(mongooseHide)

// this data has not been saved on the database.. this just establishes the relatiionship between 'User' and 'Todos' model

userSchema.virtual('todos', {
    ref: 'Todos',
    localField: '_id',
    foreignField: 'owner'
})



userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, 'blahblahblah')
    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
} 

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })
    if(!user) {
        throw new Error('unable to login')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch){
        throw new Error('Unable to Login')
    }
    return user
}

// converting plain text password to hash and storing it
userSchema.pre('save', async function (next) {
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

userSchema.pre('remove', async function (next) {
    const user = this
    await Todos.deleteMany({ owner: user._id})

    next()
})

const User = mongoose.model('User', userSchema) 

module.exports = User

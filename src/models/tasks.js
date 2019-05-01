const mongoose = require('mongoose')
// const validator = require('validator')

const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
})

// adding middleware

// taskSchema.pre('save', async function (next) {
//     this
//     console.log('hi.. i am middleware')
//     next()
// })



const Todos = mongoose.model('Todos', taskSchema)

module.exports = Todos
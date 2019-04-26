const mongoose = require('mongoose')
// const validator = require('validator')

const Todos = mongoose.model('Todos', {
    description: {
        type: String,
        required: true,
    },
    status: {
        type: Boolean,
        required: true,  
    }
})

module.exports = Todos
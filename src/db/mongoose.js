const mongoose = require('mongoose')


// connect to your database here: 

mongoose.connect(process.env.URI_STRING, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
})



const mongoose = require('mongoose')


// connect to your database here: 

mongoose.connect("mongodb://127.0.0.1:27017/task-manager", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
})



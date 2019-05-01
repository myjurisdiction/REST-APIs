const express = require('express')
const Todos = require('../models/tasks')
const auth = require('../middleware/auth')
const taskRouter = new express.Router()

taskRouter.post('/tasks', auth, async (req, res) => {
    const todo = new Todos({
        ...req.body,
        owner: req.user._id
    })

   try {
        await todo.save()
        res.status(201).send(todo)
   } catch (e) {
        res.status(500).send(e)
        console.log('something wrong with the server..')
   }

})

// get all tasks

taskRouter.get('/tasks', auth, async (req,res) => {

    const match = {}
    const sort = {}
// tasks?sortBy:createdAt=desc
    if (req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1  // this is a ternary operator
    }
    if (req.query.status) {
        match.status = req.query.status === 'true'
    }

    try {
        await req.user.populate({ 
            path: 'todos', 
            match, 
            options: { limit: parseInt(req.query.limit), skip: parseInt(req.query.skip)},
            sort
        }).execPopulate()
        res.status(200).send(req.user.todos)
    } catch (e) {
        res.status(400).send(e)
    }

})

// get by Id 

taskRouter.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id
    try {
        const todo = await Todos.findOne({ _id, owner: req.user._id}) 

        if (!todo) {
            return res.status(400).send({ message: 'this task donot exists' })
        }
        res.status(200).send(todo)
    } catch (e) {
        res.status(500).send(e)
    }  
})

// update the user..
// user just cannot update any value in here...

taskRouter.patch ('/tasks/:id', auth, async (req, res) => {

    const updates = Object.keys(req.body) // provide the keys to the updates array
    const allowedUpdates = ['description', 'status']
    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update)
    })
 
    if(!isValidOperation) {
        return res.status(400).send({ error: 'Invalid Updates..' })
    }

    try {
        const todo = await Todos.findOne({ _id: req.params.id, owner: req.user._id})
        
        // const todo = await Todos.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true}
        if (!todo) {
            return res.status(400).send({ error: 'this task donot exist'})
        }
        updates.forEach((update) => todo[update] = req.body[update])
        await todo.save()
        res.send(todo)
    } catch (e) {
        res.status(400).send(e)
    }

})

// deleting tasks

taskRouter.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const todo = await Todos.findOneAndDelete({ _id: req.params.id, owner: req.user._id})

        if(!todo){
            return res.status(404).send({ error: 'User not found' })
        }

        res.send({ todo, message: 'Task has been deleted'})
    } catch (e) {
        res.status(400).send(e)
    }
})

module.exports = taskRouter
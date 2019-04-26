const express = require('express')
const Todos = require('../models/tasks')
const taskRouter = new express.Router()

taskRouter.post('/tasks',  async (req, res) => {
    const todo = await new Todos(req.body)

   try {
        await todo.save()
        res.status(201).send(todo)
   } catch (e) {
        res.status(500).send(e)
        console.log('something wrong with the server..')
   }

})

// get all tasks

taskRouter.get('/tasks', async (req,res) => {

    try {
        const todo = await Todos.find({})
        res.status(200).send(todo)
    } catch (e) {
        res.status(400).send(e)
    }

})

// get by Id

taskRouter.get('/tasks/:id', async (req, res) => {
    const id = req.params.id
    try {
        const todo = await Todos.findById(id)
        if (!todo) {
            return res.status(400).send('could not find the task..')
        }
        res.status(200).send(todo)
    } catch (e) {
        res.status(500).send(e)
    }  
})

// update the user..
// user just cannot update any value in here...

taskRouter.patch ('/tasks/:id', async (req, res) => {

    const updates = Object.keys(req.body) // provide the keys to the updates array
    const allowedUpdates = ['description', 'status']
    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update)
    })

    if(!isValidOperation) {
        return res.status(400).send({ error: 'Invalid Updates..' })
    }

    try {
        const todo = await Todos.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true})

        if (!todo) {
            return res.status(400).send()
        }
        res.send(todo)
    } catch (e) {
        res.status(400).send(e)
    }

})

// deleting tasks

taskRouter.delete('/tasks/:id', async (req, res) => {
    try {
        const todo = await Todo.findByIdAndDelete(req.params.id)

        if(!todo){
            return res.status(404).send({ error: 'User not found' })
        }

        res.send(todo)
    } catch (e) {
        res.status(400).send(e)
    }
})

module.exports = taskRouter
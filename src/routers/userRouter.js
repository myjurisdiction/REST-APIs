const express = require('express')
const User = require('../models/user')
const router = new express.Router()

// creating a user
router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        res.status(201).send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})

//fetching all users 
router.get('/users', async (req, res) => {
    try {
        const user = await User.find({})
        res.status(200).send(user)
    } catch (e) {
        res.status(400).send(e)
    }

})

// fetch user by id

router.get('/users/:id', async (req, res) => {
   const  id = req.params.id

   try {
       const user = await User.findById(id)
       if (!user) {
           return res.status(400).send({ error: 'Could not find this user' })
       }
       res.status(200).send(user)
   } catch (e) {
        res.status(500).send(e)
   }
})

router.patch('/users/:id', async (req, res) => {
    const updates = Object.keys(req.body)  // here we have changed 'req.body' from object to an array
    const allowedUpdates = ['name', 'email', 'password']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid Updates' })
    }

    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true})
        if(!user) {
            return res.status(400).send()
        }
        res.status(200).send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})

// deleting User
router.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)

        if(!user){
            return res.status(404).send({ error: 'User not found' })
        }

        res.send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})

module.exports = router

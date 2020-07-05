const express = require('express')
const User = require('../models/user')
const router = new express.Router()
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')
const { sendWelcomeEmail, sendSadEmail } = require('../emails/account') 


// user avatar configuration
const avatar = multer({
    // dest: 'avatars',
    limits: {
        fileSize: 1000000 // this seems working just fine
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(jpeg|jpg|png)$/)){   // used regular expression here
            return cb(new Error('please upload an image'))
        }
        cb(undefined, true)
    }
})

// creating a user
router.post('/users', async (req, res) => {
    const user = new User(req.body)
    console.log(req.body);
    try {
        await user.save()
        sendWelcomeEmail(user.email, user.name) 
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (e) {
        console.log(e);
        res.status(400).send(e)
    }
})

// user login
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        // user.tokens=[]
        res.send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
})

// upload user avatar

router.post('/users/me/avatar', auth, avatar.single('user_image'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250 }).jpeg().toBuffer()
    req.user.avatar = buffer // when to upload profile picture -> set it to req.file.buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

// delete user avatar
router.delete('/users/me/avatar', auth, avatar.single('user_image'), async (req, res) => {
    req.user.avatar = undefined // when to delte the profile picture -> set it to undefined
    await req.user.save()
    res.status(200).send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

//  fetch user profile
router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user || !user.avatar) {
            throw new Error()
        }
        res.set('Content-Type', 'image/jpeg')
        res.status(200).send(user.avatar)
    } catch (e) {
        res.status(500).send(e)
    }
})

// user logout

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send()

    } catch (e) {
        res.status(500).send(e)
    }
})

// user logout all

router.post('/users/logoutall', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send({ message: 'User logged out from all devices'})
    } catch (e) {
        res.status(500).send()
    }
})

//fetch user profile

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

router.patch('/users/me', auth,  async (req, res) => {
    const updates = Object.keys(req.body)  // here we have changed 'req.body' from object to an array
    const allowedUpdates = ['name', 'email', 'password']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid Updates' })
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update]) // alter the user property
        await req.user.save() // save the user

        // const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true})
        
        res.status(200).send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        sendSadEmail(req.user.email, req.user.name)
        res.status(200).send({ message: 'user has been deleted'})

    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router


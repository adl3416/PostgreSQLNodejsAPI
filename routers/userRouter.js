 import express, { json } from 'express'
 import postgresClient from '../config/db.js'   //



 const router = express.Router()


// Create user
 router.post('/', async (req, res) => {
    try {
        const text =  "insert into users (email,password,fullname) VALUES ($1, crypt($2, gen_salt('bf')), $3) RETURNING*"

        const values = [req.body.email, req.body.password, req.body.fullname]

        const  {rows} = await postgresClient.query(text,values)
       return res.status(201).json({createdUser: rows[0]})

        //return res.status(201).json({ createdUser: rows[0] })
    } catch (error) {
        console.log('Error occured', error.message)
        return res.status(400).json({ message: error. message })
    }

   
 })


 // Authenticate user

 router.post('/login', async(req,res) =>{
    try {
        const text = "select * from users where email = $1 and password = crypt($2,password)" 
        const values = [req.body.email, req.body.password]
        const {rows} = await postgresClient.query(text,values)
        if(!rows.length)
            return res.status(404).json({message: 'user not found'}) 
        return res.status(200).json({message: 'Authenication successful'})
        //console.log(rows)

    } catch (error) {
        console.log('Error occured', error.message)
        return res.status(400).json({message:error.message})
    }
 })


 // Update user
router.put('/update/:userId', async (req, res) => {
    try {
        const {userId}= req.params  // belirledigimiz :dan sonraki parametreyi yakaliyoruz
        const text = "update users set email = $1, fullname = $2  where id = $3 returning *"
        const values =[req.body.email, req.body.fullname, userId]
        const {rows} = await postgresClient.query(text,values)
        if(!rows.length)
            return res.status(404).json({message: 'user not found'}) 
        return res.status(200).json({updatedUser: rows[0]})
    } catch (error) {
        console.log('Error occured', error.message)
        return res.status(400).json({message:error.message})
    }

})

// Delete user
router.delete('/:userId', async (req, res) => {
    try {
        const { userId } = req.params

        const text = "DELETE FROM users WHERE id = $1 RETURNING *"

        const values = [userId]

        const { rows } = await postgresClient.query(text, values)
        if(!rows.length)
            return res.status(404).json({ message: 'User not found.' })

        return res.status(200).json({ deletedUser: rows[0] })
    } catch (error) {
        console.log('Error occured', error.message)
        return res.status(400).json({ message: error.message })   
    }
})

// Get users
router.get('/', async (req, res) => {
    try {
        const text = "SELECT * FROM users ORDER BY id ASC"

        const { rows } = await postgresClient.query(text)

        return res.status(200).json(rows)
    } catch (error) {
        console.log('Error occured', error.message)
        return res.status(400).json({ message: error.message })   
    }
})


 export default router;
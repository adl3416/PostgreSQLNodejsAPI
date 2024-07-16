 import express from 'express'
 import postgresClient from '../config/db.js'   //



 const router = express.Router()

 //create user
 router.post('/', async (req, res) => {
    try {
         const text =  "insert into users (email,password,fullname) VALUES ($1, crpyt($2, gen_salt('bf')), $3) RETURNING*"
         const values = [reg.body.email, reg.body.password, reg.body.fullname]
         const  result = await postgresClient.query(text,values)
         console.log(result)
         
    } catch (error) {
        console.log('Error occured', error.message)
        return res.status(400).json({message:error, message})
    }
 })

  

 export default router;
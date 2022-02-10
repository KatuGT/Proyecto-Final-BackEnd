require('dotenv').config()
const mongoose = require('mongoose')

mongoose.connect(process.env.DB_URL, ()=>{
    console.log(`conectado a la base de datos: ${process.env.DB_URL}`)
})
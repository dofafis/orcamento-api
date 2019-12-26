let express = require('express')
let cors = require('cors')
let app = express()

// Enabling CORS
app.use(cors())

// Built-in express json parser
app.use(express.json())

//setup routes
require('./app/routes/routes')(app)

app.listen(3000, function () {
    console.log('Express server running on port 3000')
})

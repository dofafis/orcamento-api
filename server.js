let express = require('express')
let app = express()

// Built-in express json parser
app.use(express.json())

// Exemplo de rota
app.get('/hello-world', helloWorldMidleware, function(req, res) {
    res.end(req.body.helloWorld)
})

function helloWorldMidleware(req, res, next) {
    req.body.helloWorld = "Hello World!"
    next()
}

app.listen(3000, function () {
    console.log('Express server running on port 3000')
})

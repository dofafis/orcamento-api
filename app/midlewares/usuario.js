const crypto = require('crypto')
const uuid = require('uuid')
const myCache = require('../cache')

const usuarioMidlewares = {
    validarPost: function(req, res, next) {
        var usuario = req.body

        // Preenchendo o campo data_hora com a data e hora atual
        usuario.data_hora = new Date().toISOString()
        req.body = usuario

        // nome, cpf, data_nascimento, email, senha, data_hora, ativo
        var valid = (typeof(usuario) === 'undefined' 
                        || typeof(usuario.nome) === 'undefined' 
                        || typeof(usuario.cpf) === 'undefined' 
                        || typeof(usuario.data_nascimento) === 'undefined'
                        || typeof(usuario.email) === 'undefined'
                        || typeof(usuario.senha) === 'undefined' 
                        || typeof(usuario.data_hora) === 'undefined' 
                        || typeof(usuario.ativo) === 'undefined') ? false : true

        if(!valid)
            res.end(JSON.stringify({
                status: 400,
                message: 'Os campos nome, cpf, data_nascimento, email, senha e ativo sao obrigatorios'
            }))
        else{
            req.body.ativo = false
            next()
        }
    },

    encriptarSenha: function(req, res, next) {
        var hash = crypto.createHmac('sha512', req.body.data_hora)
        hash.update(req.body.senha)
        req.body.senha = hash.digest('hex')

        next()
    },

    criarUUID: function(req, res, next) {
        req.body.uuid = uuid.v1()
        next()
    },
    validarPut: function(req, res, next) {
        if(typeof(req.body.cpf) === 'undefined' && typeof(req.body.uuid) === 'undefined' && typeof(req.body.email) === 'undefined')
            res.end(JSON.stringify({
                status: 400,
                message: 'E obrigatorio a presenca de um dos seguintes atributos: uuid, cpf, email'
            }))
        else {
            let sensitiveFields = ['senha', 'data_hora']
            let thereAreSensitiveFields = false
            sensitiveFields.forEach(field => {
                if(typeof(req.body[field]) !== 'undefined')
                    thereAreSensitiveFields = true
            })
    
            if(thereAreSensitiveFields)
                res.end(JSON.stringify({
                    status: 400,
                    message: 'Esta rota altera apenas os campos: nome, data_nascimento e ativo, verifique a documentaçao para rotas de alteracao de senha, email e ou cpf'
                }))
            else
                next()
        }

    },
    validarAtivacaoDeConta: function(req, res, next) {
        if(typeof(req.params.code) === 'undefined')
            res.end(JSON.stringify({
                status: 400,
                message: 'O parametro \'code\' e obrigatorio'
            }))
        else if(typeof(myCache.get(req.params.code)) === 'undefined')
            res.end(JSON.stringify({
                status: 400,
                message: 'O parametro \'code\' nao e valido'
            }))
        else
            next()
    }

}

module.exports = usuarioMidlewares

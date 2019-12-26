const crypto = require('crypto')
const uuid = require('uuid')

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
        else
            next()
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
    }
}

module.exports = usuarioMidlewares

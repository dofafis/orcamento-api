const crypto = require('crypto')
const uuid = require('uuid')
const myCache = require('../cache')
const environment = require('../../config/environment')
const jwt = require('jwt-simple')
const { usuario } = require('../models')
const Op = require('sequelize').Op

const validarCpf = require('validar-cpf')

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
            if(!validarCpf(req.body.cpf))
                res.end(JSON.stringify({
                    status: 400,
                    message: 'O cpf enviado nao e valido'
                }))
            req.body.ativo = false
            next()
        }
    },

    encriptarSenha: function(req, res, next) {
        var hash = crypto.createHmac('sha512', environment.API_SECRET)
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
    },
    validarAlteracaoSenha: function(req, res, next) {
        //campos senhaAtual, novaSenha, confirmaNovaSenha, (cpf, uuid ou email)
        let body = req.body

        if(typeof(body.senhaAtual) === 'undefined' 
        || typeof(body.novaSenha) === 'undefined' 
        || typeof(body.confirmaNovaSenha) === 'undefined'
        || (typeof(body.cpf) === 'undefined' && typeof(body.uuid) === 'undefined' && typeof(body.email) === 'undefined'))
            res.end(JSON.stringify({
                status: 400,
                message: 'Os campos senhaAtual, novaSenha e confirmaNovaSenha sao obrigatorios, e voce deve escolher um dos identificadores (cpf, uuid ou email) obrigatoriamente'
            }))
        else if(body.novaSenha !== body.confirmaNovaSenha)
            res.end(JSON.stringify({
                status: 400,
                message: 'Os campos \'novaSenha\' e \'confirmaNovaSenha\' devem ser iguais'
            }))
        else{
            req.body.senha = req.body.novaSenha
            next()
        }
    },
    validarLogin: function(req, res, next) {
        let body = req.body

        if(typeof(body.cpf) === 'undefined' && typeof(body.uuid) === 'undefined' && typeof(body.email) === 'undefined')
            res.end(JSON.stringify({
                status: 400,
                message: 'E obrigatorio escolher pelo menos um identificador (cpf, uuid ou email)'
            }))
        else if(typeof(body.senha) === 'undefined')
            res.end(JSON.stringify({
                status: 400,
                message: 'O campo \'senha\' e obrigatorio'
            }))
        else
            next()
    },
    autenticar: function(req, res, next) {
        let token = req.headers.access_token

        if(typeof(token) === 'undefined')
            res.end(JSON.stringify({
                status: 400,
                message: 'E obrigatorio o envio de um access_token'
            }))
        else {
            let decoded = jwt.decode(token, environment.API_SECRET)
    
            if((Date.now() - decoded.exp) > 3600000)
                res.end(JSON.stringify({
                    status: 400,
                    message:'O access_token expirou, nao e mais valido'
                }))
            else {
                req.user = decoded.uuid
                next()
            }
        }
    },
    autorizar: function(req, res, next) {
        usuario.findAll({
            where: {
                [Op.or]: [
                    {
                        cpf: [req.params.identifier, req.body.cpf] 
                    },
                    {
                        uuid: [req.params.identifier, req.body.uuid]
                    },
                    {
                        email: [req.params.identifier, req.body.email] 
                    }
                ],
                ativo: {
                    [Op.eq]: true
                }
            }
        })
        .then(function (usuarios) {
            if(usuarios.length === 1){
                if(usuarios[0].uuid === req.user)
                    next()
                else
                    res.end(JSON.stringify({
                        status: 400,
                        message: 'Voce nao possui autorizacao para acessar esta rota'
                    }))
            }else
                res.end(JSON.stringify({
                    status: 500,
                    message: 'Houve um problema no servidor, tente novamente mais tarde'
                }))
        })
        .catch(function (error) {
            res.end(JSON.stringify({
                status: 500,
                message: error.name
            }))
        })
    }
}

module.exports = usuarioMidlewares

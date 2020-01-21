const uuid = require('uuid')
const { transacao } = require('../models')
const Op = require('sequelize').Op

const transacaoMiddlewares = {
    validarPost: function(req, res, next) {
        var transacao = req.body

        // Preenchendo o campo data_hora com a data e hora atual
        transacao.data_hora = new Date().toISOString()
        req.body = transacao

        var valid = (typeof(transacao) === 'undefined' 
                        || typeof(transacao.uuid_usuario) === 'undefined' 
                        || typeof(transacao.uuid_categoria) === 'undefined' 
                        || typeof(transacao.descricao) === 'undefined' 
                        || typeof(transacao.valor) === 'undefined'
                        || typeof(transacao.tipo) === 'undefined') ? false : true

        if(!valid)
            res.end(JSON.stringify({
                status: 400,
                message: 'Os campos uuid_usuario, uuid_categoria, descricao, valor, tipo sao obrigatorios'
            }))
        else{
            next()
        }
    },
    validarPut: function(req, res, next) {
        if(typeof(req.body.uuid) === 'undefined')
            res.end(JSON.stringify({
                status: 400,
                message: 'E obrigatorio a presenca do atributo uuid'
            }))
        else {
            let sensitiveFields = ['uuid_usuario']
            let thereAreSensitiveFields = false
            sensitiveFields.forEach(field => {
                if(typeof(req.body[field]) !== 'undefined')
                    thereAreSensitiveFields = true
            })
    
            if(thereAreSensitiveFields)
                res.end(JSON.stringify({
                    status: 400,
                    message: 'Esta rota altera apenas os campos: uuid_categoria, descricao, valor, tipo'
                }))
            else
                next()
        }
    },
    criarUUID: function(req, res, next) {
        req.body.uuid = uuid.v1()
        next()
    },
    autorizar: function(req, res, next) {
        transacao.findAll({
            where: {
                uuid: {
                    [Op.eq]: req.params.uuid
                } 
            }
        })
        .then(function (transacaos) {
            if(transacaos.length === 1){
                if(transacaos[0].uuid_usuario === req.user)
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

module.exports = transacaoMiddlewares

const uuid = require('uuid')
const { categoria } = require('../models')
const Op = require('sequelize').Op

const categoriaMiddlewares = {
    validarPost: function(req, res, next) {
        var categoria = req.body

        // nome, descricao, limite, uuid_usuario
        var valid = (typeof(categoria) === 'undefined' 
                        || typeof(categoria.nome) === 'undefined' 
                        || typeof(categoria.descricao) === 'undefined' 
                        || typeof(categoria.limite) === 'undefined'
                        || typeof(categoria.uuid_usuario) === 'undefined') ? false : true

        if(!valid)
            res.end(JSON.stringify({
                status: 400,
                message: 'Os campos nome, descricao, limite, uuid_usuario sao obrigatorios'
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
                    message: 'Esta rota altera apenas os campos: nome, descricao'
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
        categoria.findAll({
            where: {
                uuid: {
                    [Op.eq]: req.params.uuid
                } 
            }
        })
        .then(function (categorias) {
            if(categorias.length === 1){
                if(categorias[0].uuid_usuario === req.user)
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

module.exports = categoriaMiddlewares

const { usuario } = require('../models')
const { categoria } = require('../models')
const { transacao } = require('../models')

const Op = require('sequelize').Op

// transacao (uuid, uuid_usuario, uuid_categoria, descricao, valor, tipo, data_hora)
const transacaoService = {
    cadastrar: function(req, res) {
        transacao.create(req.body)
            .then(function (transacaoCadastrada) {
                res.end(JSON.stringify(transacaoCadastrada))
            })
            .catch(function (error) {
                console.log(error)
                if(error.name === 'SequelizeUniqueConstraintError')
                    res.end(JSON.stringify({
                        status: 400,
                        message: 'A transaçao ja foi cadastrado'
                    }))
                else
                    res.end(JSON.stringify({
                        status: 500,
                        message: 'Nao foi possivel cadastrar a transaçao, verifique as informaçoes e tente novamente'
                    }))
            })
    },
    alterar: function(req, res) {
    // transacao (uuid, uuid_usuario, uuid_categoria, descricao, valor, tipo, data_hora)
        const validFields = ['uuid_categoria', 'descricao', 'valor', 'tipo']

        let updates = {}

        validFields.forEach(field => {
            if(typeof(req.body[field]) !== 'undefined')
                updates[field] = req.body[field]
        })

        transacao.update(updates, {
            where: {
                uuid: { 
                    [Op.eq]: req.body.uuid
                }
            }
        })
        .then(
            result => {
                if(result[0] === 1)
                    res.end(JSON.stringify({
                        status: 200,
                        message: 'Transaçao alterada com sucesso'
                    }))
            }
        )
        .catch(
            error => {
                res.end(JSON.stringify({
                    status: 500,
                    message: error.name
                }))
            }
        )
    },
    retornarPorUUID: function(req, res) {
        transacao.findAll({
            where: {
                uuid: { 
                    [Op.eq]: req.params.uuid 
                }
            }
        })
        .then(function (transacoes) {
            transacoes = transacoes.length === 0 ? { status: 400, message: 'Transacao nao encontrada, verifique as informaçoes e tente novamente'} : transacoes[0]
            res.end(JSON.stringify(transacoes))
        })
        .catch(function (error) {
            res.end(JSON.stringify({
                status: 500,
                message: error.name
            }))
        })
    },
    retornarPorUsuarioUUID: function(req, res) {
        
        transacao.findAll({
            where: {
                uuid_usuario: { 
                    [Op.eq]: req.params.uuid_usuario 
                }
            }
        })
        .then(function (transacoes) {
            res.end(JSON.stringify(transacoes))
        })
        .catch(function (error) {
            res.end(JSON.stringify({
                status: 500,
                message: error.name
            }))
        })

    },
    retornarPorUsuarioECategoriaUUID: function(req, res) {
        
        transacao.findAll({
            where: {
                uuid_usuario: { 
                    [Op.eq]: req.params.uuid_usuario 
                },
                uuid_categoria: {                    
                    [Op.eq]: req.params.uuid_categoria 
                }
            }
        })
        .then(function (transacoes) {
            res.end(JSON.stringify(transacoes))
        })
        .catch(function (error) {
            res.end(JSON.stringify({
                status: 500,
                message: error.name
            }))
        })

    },
    deletar: function(req, res) {

        transacao.destroy({
            where: {
                uuid: { 
                    [Op.eq]: req.params.uuid 
                }
            }
        })
        .then(function(affectedRows) {
            if(affectedRows === 1)
                res.end(JSON.stringify({
                    status: 200, 
                    message: 'Transacao excluida com sucesso'
                }))
            else
                res.end(JSON.stringify({
                    status: 400, 
                    message: 'A transacao que deseja excluir nao existe na base de dados'
                }))
        })
        .catch(function(error) {
            res.end(JSON.stringify({
                status: 500,
                message: error.name
            }))
        })

    }
}

module.exports = transacaoService
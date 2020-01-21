// transacao (uuid, uuid_usuario, uuid_categoria, descricao, valor, tipo, data_hora)
module.exports = (sequelize, DataTypes) => {
    const transacao = sequelize.define('transacao', {
        uuid: {
            type: DataTypes.UUID,
            primaryKey: true
        }, 
        descricao: DataTypes.STRING,
        valor: DataTypes.INTEGER,
        tipo: DataTypes.INTEGER,
        data_hora: DataTypes.DATE,
        uuid_usuario: {
            type: DataTypes.UUID,
            references: {
                model: 'usuario',
                key: 'uuid'
            }
        },
        uuid_categoria: {
            type: DataTypes.UUID,
            references: {
                model: 'categoria',
                key: 'uuid'
            }
        }
    },
    {
        timestamps: false,
        freezeTableName: true
    });
  
    return transacao;
}

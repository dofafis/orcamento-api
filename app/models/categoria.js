// categoria (uuid, nome, descricao, uuid_usuario)
module.exports = (sequelize, DataTypes) => {
    const categoria = sequelize.define('categoria', {
        uuid: {
            type: DataTypes.UUID,
            primaryKey: true
        }, 
        nome: DataTypes.STRING,
        descricao: DataTypes.STRING,
        uuid_usuario: {
            type: DataTypes.UUID,
            references: {
                model: 'usuario',
                key: 'uuid'
            }
        }
    },
    {
        timestamps: false
    });
  
    return categoria;
}

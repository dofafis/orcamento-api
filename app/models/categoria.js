// categoria (uuid, nome, descricao, limite, uuid_usuario)
module.exports = (sequelize, DataTypes) => {
    const categoria = sequelize.define('categoria', {
        uuid: {
            type: DataTypes.UUID,
            primaryKey: true
        }, 
        nome: DataTypes.STRING,
        descricao: DataTypes.STRING,
        limite: DataTypes.INTEGER,
        uuid_usuario: {
            type: DataTypes.UUID,
            references: {
                model: 'usuario',
                key: 'uuid'
            }
        }
    },
    {
        timestamps: false,
        freezeTableName: true
    });
  
    return categoria;
}

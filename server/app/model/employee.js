import Sequelize from 'sequelize'

export default (sequelize) => {
  return sequelize.define('employee', {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
    },
    name: Sequelize.STRING,
    sex: Sequelize.STRING,
    birth: Sequelize.DATE
  }, {
    charset: 'utf8',
    collate: 'utf8_general_ci',
    timestamps: false,
  })
}
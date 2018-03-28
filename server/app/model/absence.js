import Sequelize from 'sequelize'

export default (sequelize) => {
  return sequelize.define('absence', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    year: Sequelize.INTEGER,
    month: Sequelize.INTEGER,
    day: Sequelize.INTEGER,
    reason: Sequelize.STRING,
  }, {
    charset: 'utf8',
    collate: 'utf8_general_ci',
    timestamps: false,
  })
}
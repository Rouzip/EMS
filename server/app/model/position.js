import Sequelize from 'sequelize'

export default (sequelize) => {
  return sequelize.define('position', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: Sequelize.STRING,
    salary: Sequelize.BIGINT,
  }, {
    charset: 'utf8',
    collate: 'utf8_general_ci',
    timestamps: false,
  })
}
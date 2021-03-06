import Sequelize from 'sequelize'

export default (sequelize) => {
  return sequelize.define('extraWork', {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
    },
    time: Sequelize.INTEGER,  // 时长
    year: Sequelize.INTEGER,
    month: Sequelize.INTEGER,
    day: Sequelize.INTEGER,
    salary: Sequelize.INTEGER,
    reason: Sequelize.STRING,
  }, {
    charset: 'utf8',
    collate: 'utf8_general_ci',
    timestamps: false,
  })
}
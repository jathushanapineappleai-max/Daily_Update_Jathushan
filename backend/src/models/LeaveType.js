const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const LeaveType = sequelize.define('LeaveType', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    leave_name: { type: DataTypes.STRING(50), allowNull: false },
    day_count: { type: DataTypes.INTEGER, allowNull: false },
    requires_proof: { type: DataTypes.BOOLEAN, defaultValue: false }
  }, {
    tableName: 'leave_type',
    timestamps: false
  });

  LeaveType.associate = (models) => {
    LeaveType.hasMany(models.LeaveBalance, { foreignKey: 'leave_type_id', onDelete: 'CASCADE' });
    LeaveType.hasMany(models.LeaveRequest, { foreignKey: 'leave_type_id' });
  };

  return LeaveType;
};
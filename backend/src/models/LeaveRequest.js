const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const LeaveRequest = sequelize.define('LeaveRequest', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    leave_type_id: { type: DataTypes.INTEGER, allowNull: false },
    leave_mode: { type: DataTypes.ENUM('full_day', 'half_day', 'hours_permission'), allowNull: false },
    number_of_days: { type: DataTypes.DECIMAL(4, 1), allowNull: false },
    start_date: { type: DataTypes.DATEONLY, allowNull: false },
    end_date: { type: DataTypes.DATEONLY, allowNull: true },
    start_time: { type: DataTypes.TIME, allowNull: true },
    end_time: { type: DataTypes.TIME, allowNull: true },
    status: { type: DataTypes.ENUM('pending', 'approved', 'rejected', 'cancelled'), defaultValue: 'pending' },
    approved_by: { type: DataTypes.INTEGER, allowNull: true },
    requested_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, {
    tableName: 'leave_request',
    timestamps: false
  });

  LeaveRequest.associate = (models) => {
    LeaveRequest.belongsTo(models.User, { foreignKey: 'user_id', onDelete: 'CASCADE' });
    LeaveRequest.belongsTo(models.LeaveType, { foreignKey: 'leave_type_id' });
    LeaveRequest.belongsTo(models.User, { foreignKey: 'approved_by', as: 'ApprovedBy' });
  };

  return LeaveRequest;
};
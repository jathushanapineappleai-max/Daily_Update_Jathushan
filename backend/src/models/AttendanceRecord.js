const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const AttendanceRecord = sequelize.define('AttendanceRecord', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    clock_in: { type: DataTypes.DATE, allowNull: false },
    clock_out: { type: DataTypes.DATE, allowNull: true },
    method: { type: DataTypes.ENUM('biometric', 'manual', 'mobile'), defaultValue: 'manual' },
    is_spoof_detected: { type: DataTypes.BOOLEAN, defaultValue: false }
  }, {
    tableName: 'attendance_record',
    timestamps: false
  });

  AttendanceRecord.associate = (models) => {
    AttendanceRecord.belongsTo(models.User, { foreignKey: 'user_id', onDelete: 'CASCADE' });
  };

  return AttendanceRecord;
};
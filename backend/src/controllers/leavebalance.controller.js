// controllers/leavebalance.controller.js
const db = require('../models');
const LeaveBalance = db.LeaveBalance;
const LeaveRequest = db.LeaveRequest;
const LeaveServices = require('../services/LeaveService');

const isSequelizeValidationError = (err) =>
  err && (err.name === 'SequelizeValidationError' || err.name === 'SequelizeDatabaseError');

/**
 * GET /api/leave-balance
 * Optional query: user_id, leave_type_id, year, limit, offset
 */
exports.getAll = async (req, res) => {
  try {
    const where = {};
    if (req.query.user_id) where.user_id = req.query.user_id;
    if (req.query.leave_type_id) where.leave_type_id = req.query.leave_type_id;
    if (req.query.year) where.year = parseInt(req.query.year, 10);

    let limit = parseInt(req.query.limit, 10) || 100;
    let offset = parseInt(req.query.offset, 10) || 0;
    if (limit < 1) limit = 1;
    if (limit > 1000) limit = 1000;
    if (offset < 0) offset = 0;

    const result = await LeaveBalance.findAndCountAll({
      where,
      limit,
      offset,
      order: [['id', 'ASC']]
    });

    res.json({ count: result.count, rows: result.rows, limit, offset });
  } catch (err) {
    console.error('Error fetching leave balances:', err);
    if (isSequelizeValidationError(err)) return res.status(400).json({ error: err.message });
    return res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};

/**
 * GET /api/leave-balance/:id
 */
exports.getById = async (req, res) => {
  try {
    const rec = await LeaveBalance.findByPk(req.params.id);
    if (!rec) return res.status(404).json({ error: 'Not found' });
    return res.json(rec);
  } catch (err) {
    console.error('Error fetching leave balance by id:', err);
    if (isSequelizeValidationError(err)) return res.status(400).json({ error: err.message });
    return res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};

/**
 * POST /api/leave-balance/move-from-request
 * Body: { leave_request_id: <id> }
 * Manually trigger move (service will create or update LeaveBalance).
 */
exports.moveFromRequest = async (req, res) => {
  const { leave_request_id } = req.body;
  if (!leave_request_id) return res.status(400).json({ error: 'leave_request_id is required' });

  try {
    const leaveReq = await LeaveRequest.findByPk(leave_request_id);
    if (!leaveReq) return res.status(404).json({ error: 'LeaveRequest not found' });

    const lb = await LeaveServices.addToLeaveBalance(leaveReq);
    return res.status(200).json({ message: 'Moved to leave_balance', data: lb });
  } catch (err) {
    console.error('Error moving to leave_balance:', err);
    return res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};

/**
 * POST /api/leave-balance/revert-from-request
 * Body: { leave_request_id: <id> }
 * Manually revert (subtract) a previously moved request.
 */
exports.revertFromRequest = async (req, res) => {
  const { leave_request_id } = req.body;
  if (!leave_request_id) return res.status(400).json({ error: 'leave_request_id is required' });

  try {
    const leaveReq = await LeaveRequest.findByPk(leave_request_id);
    if (!leaveReq) return res.status(404).json({ error: 'LeaveRequest not found' });

    const lb = await LeaveServices.removeFromLeaveBalance(leaveReq);
    return res.status(200).json({ message: 'Reverted from leave_balance', data: lb });
  } catch (err) {
    console.error('Error reverting from leave_balance:', err);
    return res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};

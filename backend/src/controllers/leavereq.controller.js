// controllers/leavereq.controller.js
const db = require('../models');
const LeaveRequest = db.LeaveRequest;
const LeaveType = db.LeaveType;
const LeaveServices = require('../services/LeaveService');

const VALID_LEAVE_MODES = ['full_day', 'half_day', 'hours_permission'];
const VALID_STATUSES = ['pending', 'approved', 'rejected', 'cancelled'];

const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/;

function parseTimeToDate(timeStr) {
  const today = new Date();
  const [hh, mm, ss = 0] = timeStr.split(':').map(Number);
  return new Date(today.getFullYear(), today.getMonth(), today.getDate(), hh, mm, ss);
}

const isSequelizeValidationError = (err) =>
  err && (err.name === 'SequelizeValidationError' || err.name === 'SequelizeDatabaseError');

/**
 * CREATE leave request
 * POST /api/leave-request
 */
exports.create = async (req, res) => {
  const t = await db.sequelize.transaction();
  try {
    const {
      user_id,
      leave_type_id,
      leave_mode,
      number_of_days,
      start_date,
      end_date,
      start_time,
      end_time
    } = req.body;

    const missing = [];
    if (!user_id) missing.push('user_id');
    if (!leave_type_id) missing.push('leave_type_id');
    if (!leave_mode) missing.push('leave_mode');
    if (number_of_days === undefined) missing.push('number_of_days');
    if (!start_date) missing.push('start_date');

    if (missing.length) {
      await t.rollback();
      return res.status(400).json({ error: `Missing fields: ${missing.join(', ')}` });
    }

    if (!VALID_LEAVE_MODES.includes(leave_mode)) {
      await t.rollback();
      return res.status(400).json({ error: 'Invalid leave_mode' });
    }

    const numDays = parseFloat(number_of_days);
    if (Number.isNaN(numDays) || numDays <= 0) {
      await t.rollback();
      return res.status(400).json({ error: 'Invalid number_of_days' });
    }

    const sDate = new Date(start_date);
    if (Number.isNaN(sDate.getTime())) {
      await t.rollback();
      return res.status(400).json({ error: 'Invalid start_date' });
    }

    if (leave_mode === 'hours_permission') {
      if (!start_time || !end_time) {
        await t.rollback();
        return res.status(400).json({ error: 'start_time and end_time required' });
      }
      if (!TIME_REGEX.test(start_time) || !TIME_REGEX.test(end_time)) {
        await t.rollback();
        return res.status(400).json({ error: 'Invalid time format' });
      }
      if (parseTimeToDate(end_time) <= parseTimeToDate(start_time)) {
        await t.rollback();
        return res.status(400).json({ error: 'end_time must be after start_time' });
      }
    }

    const leaveType = await LeaveType.findByPk(leave_type_id, {
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    if (!leaveType) {
      await t.rollback();
      return res.status(400).json({ error: 'Leave type not found' });
    }

    const deductDays = Math.round(numDays);
    if (leaveType.day_count < deductDays) {
      await t.rollback();
      return res.status(400).json({ error: 'Insufficient leave balance' });
    }

    const created = await LeaveRequest.create({
      user_id,
      leave_type_id,
      leave_mode,
      number_of_days: numDays,
      start_date,
      end_date: end_date || null,
      start_time: start_time || null,
      end_time: end_time || null,
      requested_at: new Date()
    }, { transaction: t });

    await leaveType.update(
      { day_count: leaveType.day_count - deductDays },
      { transaction: t }
    );

    await t.commit();
    return res.status(201).json({ message: 'Leave request created', data: created });

  } catch (err) {
    try { await t.rollback(); } catch (_) {}
    console.error('create error', err);
    if (isSequelizeValidationError(err)) return res.status(400).json({ error: err.message });
    return res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};

/**
 * UPDATE STATUS
 * PUT /api/leave-request/:id/status
 */
exports.updateStatus = async (req, res) => {
  const t = await db.sequelize.transaction();
  try {
    const { id } = req.params;
    const { status: newStatus, approved_by } = req.body;

    if (!VALID_STATUSES.includes(newStatus)) {
      await t.rollback();
      return res.status(400).json({ error: 'Invalid status' });
    }

    const leaveReq = await LeaveRequest.findByPk(id, {
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    if (!leaveReq) {
      await t.rollback();
      return res.status(404).json({ error: 'Leave request not found' });
    }

    const prevStatus = leaveReq.status;

    // ===== APPROVE =====
    if (newStatus === 'approved') {
      if (prevStatus !== 'approved') {
        // move to leave_balance inside the same transaction
        await LeaveServices.addToLeaveBalance(leaveReq, { transaction: t });
      }

      await leaveReq.update(
        { status: 'approved', approved_by: approved_by || null },
        { transaction: t }
      );
    }

    // ===== REJECT / CANCEL =====
    else if (newStatus === 'rejected' || newStatus === 'cancelled') {
      if (prevStatus === 'approved') {
        // revert leave_balance inside the same transaction
        await LeaveServices.removeFromLeaveBalance(leaveReq, { transaction: t });
      }

      // restore day_count (we assume creation deducted it)
      // lock leaveType row to update
      const leaveType = await LeaveType.findByPk(leaveReq.leave_type_id, { transaction: t, lock: t.LOCK.UPDATE });
      if (leaveType) {
        const deducted = Math.max(0, Math.round(parseFloat(leaveReq.number_of_days || 0)));
        await leaveType.update({ day_count: leaveType.day_count + deducted }, { transaction: t });
      }

      await leaveReq.update(
        { status: newStatus, approved_by: approved_by || null },
        { transaction: t }
      );
    }

    // ===== BACK TO PENDING =====
    else if (newStatus === 'pending') {
      if (prevStatus === 'approved') {
        // revert leave_balance inside the same transaction
        await LeaveServices.removeFromLeaveBalance(leaveReq, { transaction: t });
      }

      // reset approved_by and keep day_count logic similar to cancelled/rejected:
      const leaveType = await LeaveType.findByPk(leaveReq.leave_type_id, { transaction: t, lock: t.LOCK.UPDATE });
      if (leaveType) {
        // only restore if previously deducted at creation (we assume create deducted)
        const deducted = Math.max(0, Math.round(parseFloat(leaveReq.number_of_days || 0)));
        await leaveType.update({ day_count: leaveType.day_count + deducted }, { transaction: t });
      }

      await leaveReq.update(
        { status: 'pending', approved_by: null },
        { transaction: t }
      );
    }

    await t.commit();
    return res.json({ message: 'Status updated successfully' });

  } catch (err) {
    try { await t.rollback(); } catch (_) {}
    console.error('updateStatus error', err);
    if (isSequelizeValidationError(err)) return res.status(400).json({ error: err.message });
    return res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};

/**
 * GET ALL
 * GET /api/leave-request
 * query: user_id, status, leave_type_id, limit, offset
 */
exports.getAll = async (req, res) => {
  try {
    const { user_id, status, leave_type_id } = req.query;
    let limit = parseInt(req.query.limit, 10) || 100;
    let offset = parseInt(req.query.offset, 10) || 0;
    if (limit < 1) limit = 1;
    if (limit > 1000) limit = 1000;
    if (offset < 0) offset = 0;

    const where = {};
    if (user_id) where.user_id = user_id;
    if (status) {
      if (!VALID_STATUSES.includes(status)) return res.status(400).json({ error: 'Invalid status filter' });
      where.status = status;
    }
    if (leave_type_id) where.leave_type_id = leave_type_id;

    const include = [];
    if (db.LeaveType) include.push({ model: db.LeaveType });
    if (db.User) include.push({ model: db.User });
    if (db.User && LeaveRequest.associations && LeaveRequest.associations.ApprovedBy) {
      include.push({ model: db.User, as: 'ApprovedBy' });
    }

    const result = await LeaveRequest.findAndCountAll({
      where,
      include,
      limit,
      offset,
      order: [['requested_at', 'DESC']]
    });

    return res.json({ count: result.count, rows: result.rows, limit, offset });
  } catch (err) {
    console.error('getAll error', err);
    if (isSequelizeValidationError(err)) return res.status(400).json({ error: err.message });
    return res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};

/**
 * GET BY ID
 * GET /api/leave-request/:id
 */
exports.getById = async (req, res) => {
  try {
    const id = req.params.id;
    const include = [];
    if (db.LeaveType) include.push({ model: db.LeaveType });
    if (db.User) include.push({ model: db.User });
    if (db.User && LeaveRequest.associations && LeaveRequest.associations.ApprovedBy) {
      include.push({ model: db.User, as: 'ApprovedBy' });
    }

    const rec = await LeaveRequest.findByPk(id, { include });
    if (!rec) return res.status(404).json({ error: 'Leave request not found' });
    return res.json(rec);
  } catch (err) {
    console.error('getById error', err);
    if (isSequelizeValidationError(err)) return res.status(400).json({ error: err.message });
    return res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};

/**
 * DELETE
 * DELETE /api/leave-request/:id
 */
exports.delete = async (req, res) => {
  const t = await db.sequelize.transaction();
  try {
    const id = req.params.id;
    const leaveReq = await LeaveRequest.findByPk(id, { transaction: t, lock: t.LOCK.UPDATE });
    if (!leaveReq) {
      await t.rollback();
      return res.status(404).json({ error: 'Leave request not found' });
    }

    // if it was approved, revert leave_balance
    if (leaveReq.status === 'approved') {
      await LeaveServices.removeFromLeaveBalance(leaveReq, { transaction: t });
    }

    // restore the leaveType.day_count if creation had deducted it (we assume it did)
    const leaveType = await LeaveType.findByPk(leaveReq.leave_type_id, { transaction: t, lock: t.LOCK.UPDATE });
    if (leaveType) {
      const deducted = Math.max(0, Math.round(parseFloat(leaveReq.number_of_days || 0)));
      await leaveType.update({ day_count: leaveType.day_count + deducted }, { transaction: t });
    }

    await leaveReq.destroy({ transaction: t });
    await t.commit();
    return res.json({ message: 'Leave request deleted', id });
  } catch (err) {
    try { await t.rollback(); } catch (_) {}
    console.error('delete error', err);
    if (isSequelizeValidationError(err)) return res.status(400).json({ error: err.message });
    return res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};

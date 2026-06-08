const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const { protect } = require('../middleware/auth');

// @route   GET /api/expenses
// @desc    Get user's expenses with search & filters
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { search, category, startDate, endDate } = req.query;
    
    // Construct query object
    const query = { userId: req.user._id };

    // Search filter (title or description case-insensitive)
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Category filter
    if (category && category !== 'All') {
      query.category = category;
    }

    // Date range filter
    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = new Date(startDate);
      }
      if (endDate) {
        // Set end date to end of that day (23:59:59) for full-day inclusive check
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.date.$lte = end;
      }
    }

    // Fetch matching expenses sorted by date descending
    const expenses = await Expense.find(query).sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    console.error('Fetch expenses error:', error);
    res.status(500).json({ message: 'Server error fetching expenses' });
  }
});

// @route   POST /api/expenses
// @desc    Add a new expense
// @access  Private
router.post('/', protect, async (req, res) => {
  const { title, amount, category, date, description } = req.body;

  try {
    if (!title || amount === undefined || !category) {
      return res.status(400).json({ message: 'Title, amount, and category are required' });
    }

    const expense = await Expense.create({
      userId: req.user._id,
      title,
      amount: Number(amount),
      category,
      date: date ? new Date(date) : new Date(),
      description: description || '',
    });

    res.status(201).json(expense);
  } catch (error) {
    console.error('Create expense error:', error);
    res.status(400).json({ message: error.message || 'Server error creating expense' });
  }
});

// @route   PUT /api/expenses/:id
// @desc    Update an expense
// @access  Private
router.put('/:id', protect, async (req, res) => {
  const { title, amount, category, date, description } = req.body;

  try {
    let expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    // Verify ownership
    if (expense.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized to edit this expense' });
    }

    // Update fields
    expense.title = title !== undefined ? title : expense.title;
    expense.amount = amount !== undefined ? Number(amount) : expense.amount;
    expense.category = category !== undefined ? category : expense.category;
    expense.date = date !== undefined ? new Date(date) : expense.date;
    expense.description = description !== undefined ? description : expense.description;

    const updatedExpense = await expense.save();
    res.json(updatedExpense);
  } catch (error) {
    console.error('Update expense error:', error);
    res.status(500).json({ message: error.message || 'Server error updating expense' });
  }
});

// @route   DELETE /api/expenses/:id
// @desc    Delete an expense
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    // Verify ownership
    if (expense.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized to delete this expense' });
    }

    await expense.deleteOne();
    res.json({ message: 'Expense removed' });
  } catch (error) {
    console.error('Delete expense error:', error);
    res.status(500).json({ message: error.message || 'Server error deleting expense' });
  }
});

module.exports = router;

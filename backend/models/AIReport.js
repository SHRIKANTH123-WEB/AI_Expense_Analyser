const mongoose = require('mongoose');

const aiReportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    analysisDate: {
      type: Date,
      default: Date.now,
    },
    spendingPatterns: {
      type: String,
      required: true,
    },
    unnecessaryExpenses: {
      type: [String],
      default: [],
    },
    savingsOpportunities: {
      type: [String],
      default: [],
    },
    financialAdvice: {
      type: String,
      required: true,
    },
    highestCategory: {
      type: String,
      required: true,
    },
    budgetRecommendations: {
      type: [String],
      default: [],
    },
    rawResponse: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('AIReport', aiReportSchema);

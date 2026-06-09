const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const ExpenseMongoose = require('../models/Expense');
const AIReportMongoose = require('../models/AIReport');
const { MockExpense, MockReport } = require('../config/mockDb');
const { protect } = require('../middleware/auth');

const getExpenseModel = () => global.useMockDb ? MockExpense : ExpenseMongoose;
const getReportModel = () => global.useMockDb ? MockReport : AIReportMongoose;

// @route   POST /api/ai/analyze
// @desc    Analyze spending patterns and generate report using Gemini
// @access  Private
router.post('/analyze', protect, async (req, res) => {
  const ExpenseModel = getExpenseModel();
  const ReportModel = getReportModel();
  try {
    const userId = req.user._id.toString();

    // 1. Fetch user expenses
    const expenses = await ExpenseModel.find({ userId }).sort({ date: -1 });

    if (expenses.length === 0) {
      return res.status(400).json({
        message: 'No expenses found. Add some expenses first to run AI analysis!',
      });
    }

    // 2. Perform aggregations for the prompt
    let totalSpending = 0;
    const categoryTotals = {};
    const monthlySpending = {};
    const transactionList = [];

    expenses.forEach((exp) => {
      totalSpending += exp.amount;

      // Category totals
      categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;

      // Monthly totals (YYYY-MM)
      const monthKey = new Date(exp.date).toISOString().slice(0, 7);
      monthlySpending[monthKey] = (monthlySpending[monthKey] || 0) + exp.amount;

      // Add to transaction list for prompt context
      transactionList.push({
        title: exp.title,
        amount: exp.amount,
        category: exp.category,
        date: new Date(exp.date).toISOString().slice(0, 10),
        description: exp.description || 'None',
      });
    });

    // Determine highest category
    let highestCat = '';
    let maxSpending = 0;
    Object.entries(categoryTotals).forEach(([cat, amt]) => {
      if (amt > maxSpending) {
        maxSpending = amt;
        highestCat = cat;
      }
    });

    // Determine current month spending
    const currentMonthKey = new Date().toISOString().slice(0, 7);
    const currentMonthTotal = monthlySpending[currentMonthKey] || 0;

    // Check if GEMINI_API_KEY is provided
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY') {
      console.warn('GEMINI_API_KEY is not configured. Using intelligent mock analyzer...');

      // Find highest transaction
      const highestTx = expenses.reduce((max, e) => e.amount > max.amount ? e : max, expenses[0]);
      
      // Build realistic patterns based on highest spending category
      let patterns = '';
      const percent = totalSpending > 0 ? ((maxSpending / totalSpending) * 100).toFixed(0) : 0;
      if (highestCat === 'Food') {
        patterns = `Your spending behavior is primarily driven by daily consumables and dining. Food expenses account for ${percent}% of your total tracked outflow. We detected multiple frequent transactions here, which suggests regular dining out, food delivery, or incremental grocery store visits. Consolidating meal purchases can yield significant monthly savings.`;
      } else if (highestCat === 'Entertainment') {
        patterns = `Leisure, subscriptions, and entertainment are currently the leading cost drivers in your discretionary budget, accounting for ${percent}% of total outflows. To build long-term wealth, consider defining a fixed monthly limit for entertainment and shifting your surplus into high-yield savings.`;
      } else if (highestCat === 'Shopping') {
        patterns = `Retail transactions and shopping represent your largest outflow, comprising ${percent}% of total tracked expenses. Spikes in retail volume are often triggered by discretionary purchases. Implementing a 48-hour cool-down period before checking out online will help curb impulse buying.`;
      } else {
        patterns = `Your total tracked spending is ₹${totalSpending.toFixed(2)} spread across ${expenses.length} transactions. Your primary cost center is "${highestCat}" where you have spent ₹${maxSpending.toFixed(2)} (${percent}% of total). Setting specific limits in your top categories will streamline your cash flow.`;
      }

      // Identify specific outliers for Unnecessary Expenses
      const unnecessaryExpenses = [];
      if (highestTx && highestTx.amount > 300) {
        unnecessaryExpenses.push(`Outlier detected: ₹${highestTx.amount.toFixed(2)} spent on "${highestTx.title}" in the ${highestTx.category} category. Evaluate if this purchase was essential.`);
      }
      
      // Filter for shopping/entertainment/other discretionary items
      const discretionary = expenses.filter(e => e._id !== highestTx?._id && (e.amount > 150 || ['Shopping', 'Entertainment', 'Food'].includes(e.category)));
      discretionary.slice(0, 2).forEach(e => {
        unnecessaryExpenses.push(`Discretionary outflow: ₹${e.amount.toFixed(2)} on "${e.title}" (${e.category}).`);
      });

      if (unnecessaryExpenses.length === 0) {
        unnecessaryExpenses.push("No major red flags or high-risk transaction patterns detected in this audit period.");
      }

      const savingsOpportunities = [
        `Designate next month as a low-spend period for "${highestCat}" to recapture up to ₹${(maxSpending * 0.25).toFixed(0)} (25% category savings target).`,
        `Automate a recurring transfer of ₹${(totalSpending * 0.15).toFixed(0)} (15% of your average outflow) to your emergency savings immediately after receiving income.`,
        "Audit active subscription services or memberships and deactivate accounts unused over the last 30 days."
      ];

      const financialAdvice = `With a current expense run-rate of ₹${totalSpending.toFixed(2)}, we advise targeting an emergency reserve of ₹${(totalSpending * 3).toFixed(0)} to cover 3 months of basic living costs. Shift focus towards non-discretionary expenses to accelerate this goal.`;

      // Dynamic Mock Fallback Generation
      const mockReport = await ReportModel.create({
        userId,
        spendingPatterns: patterns,
        unnecessaryExpenses,
        savingsOpportunities,
        financialAdvice,
        highestCategory: highestCat,
        budgetRecommendations: Object.keys(categoryTotals).map(cat => {
          const recommended = Math.max(50, Math.round((categoryTotals[cat] * 0.8) / 10) * 10);
          return `${cat}: Keep under ₹${recommended} monthly (20% reduction target)`;
        }),
        rawResponse: 'INTELLIGENT_AUDIT_REPORT_GENERATED'
      });

      return res.json(mockReport);
    }

    // 3. Setup Gemini API and generate report
    const genAI = new GoogleGenerativeAI(apiKey);
    // Use gemini-1.5-flash for reliability and speed
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Format details for the prompt
    const expenseDataStr = JSON.stringify({
      totalExpensesCount: expenses.length,
      totalTrackedSpending: totalSpending,
      highestSpendingCategory: highestCat,
      spendingPerCategory: categoryTotals,
      monthlyBreakdown: monthlySpending,
      recentTransactions: transactionList.slice(0, 80), // Send top 80 transactions for context
    }, null, 2);

    const prompt = `You are an expert personal financial advisor and AI Expense Analyzer.
Analyze the user's spending data and generate a detailed report.
The user is ${req.user.username}.
Here is the aggregated spending data and recent transaction list:
${expenseDataStr}

You must return a valid JSON object matching the following structure:
{
  "spendingPatterns": "A comprehensive analysis of the user's spending patterns and habits based on the data. Be encouraging but direct.",
  "unnecessaryExpenses": ["List of specific potential impulse purchases, duplicate services, or high amounts that seem unnecessary"],
  "savingsOpportunities": ["Specific actionable strategies for the user to save money based on their spending categories"],
  "financialAdvice": "Strategic advice for long term wealth building, emergency fund goals, or budgeting techniques.",
  "highestCategory": "Must be the exact category name that has the highest total spending",
  "budgetRecommendations": ["Recommended monthly limits for their active spending categories. (e.g. Food: ₹300, Transport: ₹100)"]
}

Rules:
- Respond ONLY with the JSON object. Do not include markdown code block formatting (like \`\`\`json) or any pre/post text. Just return the raw JSON.
- Ensure the categories in unnecessaryExpenses reference actual expenses from the data where possible.
- If they have very few expenses, encourage them to track more to get higher quality advice.
- All numbers/currencies in advice should be formatted clearly.`;

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: 'application/json',
      },
    });

    const responseText = result.response.text();
    let parsedData;
    try {
      parsedData = JSON.parse(responseText);
    } catch (parseErr) {
      console.error('Error parsing Gemini output directly, attempting fallback extraction:', responseText);
      // Fallback: strip markdown if model failed to output pure JSON
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Failed to parse JSON response from Gemini');
      }
    }

    // 4. Save and return report
    const aiReport = await ReportModel.create({
      userId,
      spendingPatterns: parsedData.spendingPatterns || 'No patterns identified.',
      unnecessaryExpenses: parsedData.unnecessaryExpenses || [],
      savingsOpportunities: parsedData.savingsOpportunities || [],
      financialAdvice: parsedData.financialAdvice || 'No custom financial advice generated.',
      highestCategory: parsedData.highestCategory || highestCat || 'Other',
      budgetRecommendations: parsedData.budgetRecommendations || [],
      rawResponse: responseText,
    });

    res.json(aiReport);
  } catch (error) {
    console.error('AI analysis route error:', error);
    res.status(500).json({
      message: 'Server error generating AI analysis',
      error: error.message,
    });
  }
});

// @route   GET /api/ai/reports
// @desc    Get user's AI analysis history
// @access  Private
router.get('/reports', protect, async (req, res) => {
  const ReportModel = getReportModel();
  try {
    const reports = await ReportModel.find({ userId: req.user._id.toString() }).sort({ analysisDate: -1 });
    res.json(reports);
  } catch (error) {
    console.error('Fetch reports error:', error);
    res.status(500).json({ message: 'Server error fetching reports' });
  }
});

module.exports = router;

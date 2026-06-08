const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Expense = require('../models/Expense');
const AIReport = require('../models/AIReport');
const { protect } = require('../middleware/auth');

// @route   POST /api/ai/analyze
// @desc    Analyze spending patterns and generate report using Gemini
// @access  Private
router.post('/analyze', protect, async (req, res) => {
  try {
    const userId = req.user._id;

    // 1. Fetch user expenses
    const expenses = await Expense.find({ userId }).sort({ date: -1 });

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
      const monthKey = exp.date.toISOString().slice(0, 7);
      monthlySpending[monthKey] = (monthlySpending[monthKey] || 0) + exp.amount;

      // Add to transaction list for prompt context
      transactionList.push({
        title: exp.title,
        amount: exp.amount,
        category: exp.category,
        date: exp.date.toISOString().slice(0, 10),
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

      // Dynamic Mock Fallback Generation
      const mockReport = new AIReport({
        userId,
        spendingPatterns: `Based on your ${expenses.length} transaction(s) total spending is $${totalSpending.toFixed(2)}. Your largest cost center is "${highestCat}" where you have spent $${maxSpending.toFixed(2)}. ${
          expenses.length > 5 
            ? 'Your spending shows recurring activity. Regular reviews will help optimize your cash flow.' 
            : 'You are in the early stages of logging expenses. Continue tracking to uncover deeper trends.'
        } (Note: This is a calculated mock report because GEMINI_API_KEY is not configured in the backend environment).`,
        unnecessaryExpenses: expenses
          .filter(e => e.amount > 150 || ['Shopping', 'Entertainment'].includes(e.category))
          .slice(0, 3)
          .map(e => `High spending of $${e.amount} on "${e.title}" (${e.category})`),
        savingsOpportunities: [
          `Reduce discretionary spending in "${highestCat}" by planning your purchases in advance.`,
          "Set up an automatic savings transfer of 10% of your income at the start of each month.",
          "Review subscription services and cancel any accounts unused in the last 30 days."
        ],
        financialAdvice: `Establish an emergency fund covering 3-6 months of expenses. To keep monthly costs in check, create a hard monthly spending ceiling and track it weekly. Your current tracked spending this month is $${currentMonthTotal.toFixed(2)}.`,
        highestCategory: highestCat,
        budgetRecommendations: Object.keys(categoryTotals).map(cat => {
          const recommended = Math.max(50, Math.round((categoryTotals[cat] * 0.8) / 10) * 10);
          return `${cat}: Keep under $${recommended} monthly (20% reduction target)`;
        }),
        rawResponse: 'MOCK_FALLBACK_REPORT_GENERATED_BY_SYSTEM'
      });

      await mockReport.save();
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
  "budgetRecommendations": ["Recommended monthly limits for their active spending categories. (e.g. Food: $300, Transport: $100)"]
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
    const aiReport = new AIReport({
      userId,
      spendingPatterns: parsedData.spendingPatterns || 'No patterns identified.',
      unnecessaryExpenses: parsedData.unnecessaryExpenses || [],
      savingsOpportunities: parsedData.savingsOpportunities || [],
      financialAdvice: parsedData.financialAdvice || 'No custom financial advice generated.',
      highestCategory: parsedData.highestCategory || highestCat || 'Other',
      budgetRecommendations: parsedData.budgetRecommendations || [],
      rawResponse: responseText,
    });

    await aiReport.save();
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
  try {
    const reports = await AIReport.find({ userId: req.user._id }).sort({ analysisDate: -1 });
    res.json(reports);
  } catch (error) {
    console.error('Fetch reports error:', error);
    res.status(500).json({ message: 'Server error fetching reports' });
  }
});

module.exports = router;

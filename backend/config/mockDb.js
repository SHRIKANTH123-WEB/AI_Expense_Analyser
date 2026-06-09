const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, '..', 'data', 'db.json');

// Ensure data directory exists
const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize file if not exists
if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, JSON.stringify({ users: [], expenses: [], reports: [] }, null, 2));
}

const readDb = () => {
  try {
    const data = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (e) {
    return { users: [], expenses: [], reports: [] };
  }
};

const writeDb = (data) => {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('Failed to write local database:', e);
  }
};

// Unique ID Generator
const generateId = () => Math.random().toString(36).substring(2, 9) + Date.now().toString(36);

const MockUser = {
  findOne: (query) => {
    const db = readDb();
    const user = db.users.find(u => {
      if (query.email && u.email.toLowerCase() === query.email.toLowerCase()) return true;
      if (query.username && u.username.toLowerCase() === query.username.toLowerCase()) return true;
      if (query._id && u._id === query._id) return true;
      return false;
    });
    let result = null;
    if (user) {
      result = {
        ...user,
        matchPassword: async function(enteredPassword) {
          return await bcrypt.compare(enteredPassword, this.password);
        }
      };
    }
    const promise = Promise.resolve(result);
    promise.select = function() { return this; };
    return promise;
  },
  findById: (id) => {
    const db = readDb();
    const user = db.users.find(u => u._id === id);
    let result = null;
    if (user) {
      result = {
        _id: user._id,
        username: user.username,
        email: user.email,
      };
    }
    const promise = Promise.resolve(result);
    promise.select = function() { return this; };
    return promise;
  },
  create: async (userData) => {
    const db = readDb();
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);
    
    const newUser = {
      _id: generateId(),
      username: userData.username,
      email: userData.email.toLowerCase(),
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    };
    db.users.push(newUser);
    writeDb(db);
    return newUser;
  }
};

const MockExpense = {
  find: (query) => {
    const db = readDb();
    let results = db.expenses.filter(e => e.userId === query.userId);

    // Filter by search (title or description)
    if (query.$or) {
      const searchRegexes = query.$or.map(cond => {
        const field = Object.keys(cond)[0];
        const pattern = cond[field].$regex;
        return { field, regex: new RegExp(pattern, 'i') };
      });

      results = results.filter(e => {
        return searchRegexes.some(r => r.regex.test(e[r.field] || ''));
      });
    }

    // Filter by category
    if (query.category) {
      results = results.filter(e => e.category === query.category);
    }

    // Filter by dates
    if (query.date) {
      if (query.date.$gte) {
        results = results.filter(e => new Date(e.date) >= new Date(query.date.$gte));
      }
      if (query.date.$lte) {
        results = results.filter(e => new Date(e.date) <= new Date(query.date.$lte));
      }
    }

    // Implement sort, find returns chainable methods
    const chain = {
      sort: (sortRule) => {
        const field = Object.keys(sortRule)[0];
        const direction = sortRule[field];
        results.sort((a, b) => {
          const valA = new Date(a[field]);
          const valB = new Date(b[field]);
          return direction === -1 ? valB - valA : valA - valB;
        });
        return results;
      }
    };
    return chain;
  },

  create: async (data) => {
    const db = readDb();
    const newExpense = {
      _id: generateId(),
      userId: data.userId,
      title: data.title,
      amount: Number(data.amount),
      category: data.category,
      date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
      description: data.description || '',
      createdAt: new Date().toISOString()
    };
    db.expenses.push(newExpense);
    writeDb(db);
    return newExpense;
  },

  findById: async (id) => {
    const db = readDb();
    const exp = db.expenses.find(e => e._id === id);
    if (!exp) return null;

    // Return active document interface for save/delete operations
    return {
      ...exp,
      save: async function() {
        const currentDb = readDb();
        const idx = currentDb.expenses.findIndex(e => e._id === id);
        if (idx !== -1) {
          currentDb.expenses[idx] = {
            ...currentDb.expenses[idx],
            title: this.title,
            amount: Number(this.amount),
            category: this.category,
            date: this.date,
            description: this.description,
            updatedAt: new Date().toISOString()
          };
          writeDb(currentDb);
          return currentDb.expenses[idx];
        }
        return this;
      },
      deleteOne: async function() {
        const currentDb = readDb();
        currentDb.expenses = currentDb.expenses.filter(e => e._id !== id);
        writeDb(currentDb);
        return { message: 'Removed' };
      }
    };
  }
};

const MockReport = {
  find: (query) => {
    const db = readDb();
    const results = db.reports.filter(r => r.userId === query.userId);
    return {
      sort: (sortRule) => {
        const field = Object.keys(sortRule)[0];
        const direction = sortRule[field];
        results.sort((a, b) => {
          const valA = new Date(a[field]);
          const valB = new Date(b[field]);
          return direction === -1 ? valB - valA : valA - valB;
        });
        return results;
      }
    };
  },
  create: async (data) => {
    const db = readDb();
    const newReport = {
      _id: generateId(),
      userId: data.userId,
      spendingPatterns: data.spendingPatterns,
      unnecessaryExpenses: data.unnecessaryExpenses,
      savingsOpportunities: data.savingsOpportunities,
      budgetRecommendations: data.budgetRecommendations,
      analysisDate: data.analysisDate || new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
    db.reports.push(newReport);
    writeDb(db);
    return newReport;
  }
};

module.exports = {
  MockUser,
  MockExpense,
  MockReport,
  comparePassword: async (entered, hashed) => {
    return await bcrypt.compare(entered, hashed);
  }
};

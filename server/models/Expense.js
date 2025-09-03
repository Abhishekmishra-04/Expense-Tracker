class Expense {
  constructor(id, title, amount, category, date, description = '') {
    this.id = id;
    this.title = title;
    this.amount = parseFloat(amount);
    this.category = category;
    this.date = date;
    this.description = description;
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  static validate(data) {
    const errors = [];
    
    if (!data.title || data.title.trim().length === 0) {
      errors.push('Title is required');
    }
    
    if (!data.amount || isNaN(parseFloat(data.amount)) || parseFloat(data.amount) <= 0) {
      errors.push('Amount must be a positive number');
    }
    
    if (!data.category || data.category.trim().length === 0) {
      errors.push('Category is required');
    }
    
    if (!data.date) {
      errors.push('Date is required');
    }
    
    return errors;
  }

  update(data) {
    if (data.title !== undefined) this.title = data.title;
    if (data.amount !== undefined) this.amount = parseFloat(data.amount);
    if (data.category !== undefined) this.category = data.category;
    if (data.date !== undefined) this.date = data.date;
    if (data.description !== undefined) this.description = data.description;
    this.updatedAt = new Date().toISOString();
  }
}

module.exports = Expense;
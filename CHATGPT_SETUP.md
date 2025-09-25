# 🤖 ChatGPT Integration Setup Guide

Your AI plagiarism detector is now enhanced with ChatGPT integration! Follow these steps to enable full AI-powered code analysis.

## 🚀 Quick Setup (2 minutes)

### Step 1: Get OpenAI API Key

1. Visit [OpenAI Dashboard](https://platform.openai.com/api-keys)
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy your API key (starts with `sk-`)

### Step 2: Configure Environment

1. Create a `.env` file in your project root (copy from `.env.example`)
2. Add your OpenAI API key:

```bash
# Required for ChatGPT integration
OPENAI_API_KEY=sk-your-actual-api-key-here

# Optional: Enable web search
WEB_SEARCH_ENABLED=true
WEB_SEARCH_API_KEY=your_search_api_key

# Optional: Database for storing results
DATABASE_URL=your_neon_database_url
```

### Step 3: Restart Server

```bash
npm run dev
```

## ✅ Verify Setup

1. Go to http://localhost:8080/ai-logic-test
2. Check the "AI Service Status" section
3. You should see "ChatGPT AI: OpenAI ChatGPT is ready" with a green indicator

## 🧪 Test the Integration

Try these sample codes to see ChatGPT in action:

### 1. Common Algorithm (Should return LOW confidence)
```javascript
function bubbleSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}
```

### 2. Novel Business Logic (Should return HIGH confidence)
```python
class InventoryOptimizer:
    def __init__(self, products, constraints):
        self.products = products
        self.constraints = constraints
        
    def optimize_stock_levels(self):
        # Custom business logic for inventory optimization
        for product in self.products:
            demand_forecast = self.predict_demand(product)
            seasonal_factor = self.calculate_seasonality(product)
            optimal_stock = demand_forecast * seasonal_factor
            yield product.id, optimal_stock
```

## 🔍 What ChatGPT Provides

When configured, ChatGPT enhances your plagiarism detector with:

1. **Intelligent Logic Analysis**: Understands code context and business logic
2. **Natural Language Summaries**: Explains what the code does in plain English
3. **Smart Pseudocode**: Generates clean, language-agnostic pseudocode
4. **Targeted Search Phrases**: Creates specific phrases for web plagiarism detection
5. **Confidence Assessment**: Accurately determines if code is original or common

## 📊 API Response Example

With ChatGPT enabled, you'll get responses like:

```json
{
  "summary": "The code implements a domain-specific inventory optimization algorithm that uses demand forecasting and seasonal adjustments to calculate optimal stock levels. The solution demonstrates advanced business logic with custom optimization strategies.",
  "pseudocode": "FUNCTION optimize_inventory(products, constraints):\n  FOR each product in products:\n    demand = predict_demand(product)\n    seasonal = calculate_seasonality(product)\n    optimal = demand * seasonal\n    RETURN product.id, optimal",
  "searchPhrases": [
    "inventory optimization algorithm",
    "demand forecasting implementation", 
    "seasonal stock adjustment",
    "business logic optimization"
  ],
  "confidence": "high"
}
```

## 💰 OpenAI Pricing

- **GPT-4**: ~$0.03 per 1K tokens (recommended)
- **GPT-3.5-turbo**: ~$0.002 per 1K tokens (budget option)
- Each analysis uses ~200-500 tokens
- **Cost per analysis**: $0.006 - $0.015 (very affordable!)

## 🔧 Configuration Options

### Switch to GPT-3.5 (cheaper)
```bash
# Add to your OpenAI service if needed
OPENAI_MODEL=gpt-3.5-turbo
```

### Enable Debug Logging
```bash
DEBUG=true
```

### Database Integration
```bash
# For storing analysis results (optional)
DATABASE_URL=postgresql://user:pass@host:5432/db
```

## 🚨 Troubleshooting

### "OpenAI API key not configured"
- Check your `.env` file exists and has `OPENAI_API_KEY=sk-...`
- Restart the server after adding the key

### "OpenAI configured but connection failed"
- Verify your API key is correct
- Check your OpenAI account has available credits
- Ensure your network allows HTTPS requests to api.openai.com

### "Analysis failed"
- Check server logs for specific error messages
- Verify your OpenAI account is in good standing
- Try a simpler code sample first

## 🎯 Usage Recommendations

1. **Start Small**: Test with simple algorithms first
2. **Compare Results**: Try the same code with/without ChatGPT
3. **Monitor Costs**: Keep track of your OpenAI usage
4. **Use for Production**: The system gracefully falls back to rule-based analysis if ChatGPT fails

## 🔗 Useful Links

- [OpenAI API Documentation](https://platform.openai.com/docs)
- [OpenAI Pricing](https://openai.com/pricing)
- [API Key Management](https://platform.openai.com/api-keys)
- [Usage Dashboard](https://platform.openai.com/usage)

---

**🎉 You're ready to use AI-powered plagiarism detection with ChatGPT!**

Visit http://localhost:8080/ai-logic-test to start testing your enhanced plagiarism detector.

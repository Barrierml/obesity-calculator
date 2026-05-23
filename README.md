# Obesity Subtype Ridge Calculator

Interactive web calculator for predicting obesity subtypes (C1–C5) from 7 clinical variables using a multinomial ridge regression model trained on UK Biobank (N = 88,877).

## Quick Start

Open `index.html` in any browser. No server, build step, or installation required.

## File Structure

```
website/
├── index.html          # Main page (open this)
├── css/
│   └── style.css       # Styles
├── js/
│   └── calculator.js   # Ridge formula + Chart.js
└── README.md
```

## Features

- 7 clinical variable inputs with validation
- Real-time probability calculation (C1–C5)
- Chart.js horizontal probability bar chart
- Example presets for all 5 subtypes
- Full ridge coefficient table
- Methodology documentation

## How It Works

1. **Z-score normalization**: z = (x − μ) / σ using UKB population parameters
2. **Linear scoring**: scoreₖ = β₀ₖ + Σ βᵢₖ · zᵢ
3. **Softmax**: P(Cₖ) = exp(scoreₖ) / Σ exp(scoreₗ)
4. **Prediction**: Subtype = argmax P(Cₖ)

All computation happens in the browser (client-side only). No patient data is sent to any server.

## Deployment

### Option 1: GitHub Pages (free)

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/obesity-subtype-calculator.git
git push -u origin main
```

Then enable GitHub Pages in repo Settings → Pages → Source: main branch.

### Option 2: Cloudflare + GitHub Pages (faster in China)

1. Register a domain (e.g., example.com)
2. Add domain to Cloudflare (free plan)
3. Point DNS to GitHub Pages IPs (see Cloudflare docs)
4. Add `CNAME` file with your domain to this folder

### Option 3: Local use

Just open `index.html` in any browser. No internet needed after first load.

## Model Details

- **Model**: Multinomial Logistic Regression with L2 penalty (ridge)
- **Training data**: 88,877 UK Biobank participants (BMI ≥ 30)
- **Features**: SBP, HbA1c, TG, HDL-C, Creatinine, ALT, WHR
- **Output**: C1-C5 probability scores + predicted subtype
- **Validation**: 5-fold cross-validation, macro-AUC = 0.89

## Dependencies

- Chart.js 4.4.0 (loaded from CDN, ~60KB gzipped)

No other dependencies. Pure vanilla HTML/CSS/JS.

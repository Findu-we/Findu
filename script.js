// Tab Navigation
function openTab(evt, tabName) {
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(tab => tab.classList.remove('active'));
    
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(tabName).classList.add('active');
    evt.currentTarget.classList.add('active');
}

// Smooth Scroll
function scrollTo(id) {
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// Format Currency
function formatCurrency(value) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value);
}

// Calculator Functions
function calculateInvestment() {
    const principal = parseFloat(document.getElementById('principal').value) || 0;
    const rate = parseFloat(document.getElementById('rate').value) || 0;
    const years = parseFloat(document.getElementById('years').value) || 0;
    
    if (principal <= 0 || rate < 0 || years <= 0) {
        document.getElementById('result-investment').innerHTML = '<strong>⚠️ Masukkan nilai yang valid</strong>';
        return;
    }
    
    // Compound Interest Formula: A = P(1 + r/100)^t
    const amount = principal * Math.pow(1 + (rate / 100), years);
    const profit = amount - principal;
    
    const resultHTML = `
        <div>
            <strong>Modal Awal:</strong> ${formatCurrency(principal)}<br>
            <strong>Return Tahunan:</strong> ${rate}%<br>
            <strong>Durasi:</strong> ${years} tahun<br>
            <strong style="color: #667eea;">Total Investasi:</strong> ${formatCurrency(amount)}<br>
            <strong style="color: #28a745;">Keuntungan:</strong> ${formatCurrency(profit)}
        </div>
    `;
    
    document.getElementById('result-investment').innerHTML = resultHTML;
}

function calculateLoan() {
    const loanAmount = parseFloat(document.getElementById('loan-amount').value) || 0;
    const loanRate = parseFloat(document.getElementById('loan-rate').value) || 0;
    const loanMonths = parseFloat(document.getElementById('loan-months').value) || 0;
    
    if (loanAmount <= 0 || loanRate < 0 || loanMonths <= 0) {
        document.getElementById('result-loan').innerHTML = '<strong>⚠️ Masukkan nilai yang valid</strong>';
        return;
    }
    
    // Monthly Interest Rate
    const monthlyRate = loanRate / 100 / 12;
    
    // Monthly Payment Formula: M = P * [r(1+r)^n] / [(1+r)^n - 1]
    let monthlyPayment;
    if (monthlyRate === 0) {
        monthlyPayment = loanAmount / loanMonths;
    } else {
        monthlyPayment = loanAmount * 
            (monthlyRate * Math.pow(1 + monthlyRate, loanMonths)) / 
            (Math.pow(1 + monthlyRate, loanMonths) - 1);
    }
    
    const totalPayment = monthlyPayment * loanMonths;
    const totalInterest = totalPayment - loanAmount;
    
    const resultHTML = `
        <div>
            <strong>Pinjaman:</strong> ${formatCurrency(loanAmount)}<br>
            <strong>Bunga Tahunan:</strong> ${loanRate}%<br>
            <strong>Durasi:</strong> ${loanMonths} bulan<br>
            <strong style="color: #667eea;">Cicilan/Bulan:</strong> ${formatCurrency(monthlyPayment)}<br>
            <strong style="color: #ff6b6b;">Total Bunga:</strong> ${formatCurrency(totalInterest)}<br>
            <strong>Total Pembayaran:</strong> ${formatCurrency(totalPayment)}
        </div>
    `;
    
    document.getElementById('result-loan').innerHTML = resultHTML;
}

function calculateBudget() {
    const income = parseFloat(document.getElementById('income').value) || 0;
    
    if (income <= 0) {
        document.getElementById('result-budget').innerHTML = '<strong>⚠️ Masukkan nilai yang valid</strong>';
        return;
    }
    
    // 50/30/20 Budget Rule
    const needs = income * 0.50;      // Kebutuhan (50%)
    const wants = income * 0.30;      // Keinginan (30%)
    const savings = income * 0.20;    // Tabungan/Investasi (20%)
    
    const resultHTML = `
        <div>
            <strong>Pendapatan Bulanan:</strong> ${formatCurrency(income)}<br>
            <strong style="color: #ff6b6b;">Kebutuhan (50%):</strong> ${formatCurrency(needs)}<br>
            <strong style="color: #ffc107;">Keinginan (30%):</strong> ${formatCurrency(wants)}<br>
            <strong style="color: #28a745;">Tabungan/Investasi (20%):</strong> ${formatCurrency(savings)}
        </div>
    `;
    
    document.getElementById('result-budget').innerHTML = resultHTML;
}

function calculateROI() {
    const investment = parseFloat(document.getElementById('roi-investment').value) || 0;
    const profit = parseFloat(document.getElementById('roi-profit').value) || 0;
    
    if (investment <= 0) {
        document.getElementById('result-roi').innerHTML = '<strong>⚠️ Masukkan nilai yang valid</strong>';
        return;
    }
    
    // ROI Formula: ROI = (Profit / Investment) * 100
    const roi = (profit / investment) * 100;
    const totalValue = investment + profit;
    
    const resultHTML = `
        <div>
            <strong>Modal:</strong> ${formatCurrency(investment)}<br>
            <strong>Profit:</strong> ${formatCurrency(profit)}<br>
            <strong style="color: #667eea;">ROI:</strong> ${roi.toFixed(2)}%<br>
            <strong>Total Nilai:</strong> ${formatCurrency(totalValue)}
        </div>
    `;
    
    document.getElementById('result-roi').innerHTML = resultHTML;
}

// Auto-calculate on load
window.addEventListener('load', function() {
    calculateInvestment();
    calculateLoan();
    calculateBudget();
    calculateROI();
});

// Real-time calculation
document.addEventListener('input', function(e) {
    if (e.target.id.startsWith('principal') || e.target.id.startsWith('rate') || e.target.id.startsWith('years')) {
        calculateInvestment();
    }
    if (e.target.id.startsWith('loan-')) {
        calculateLoan();
    }
    if (e.target.id === 'income') {
        calculateBudget();
    }
    if (e.target.id.startsWith('roi-')) {
        calculateROI();
    }
});

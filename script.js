// ===== Authentication Functions =====
function openAuthModal(event) {
    event.preventDefault();
    document.getElementById('authModal').classList.add('active');
    document.getElementById('loginCard').classList.remove('hidden');
    document.getElementById('registerCard').classList.add('hidden');
}

function closeAuthModal() {
    document.getElementById('authModal').classList.remove('active');
}

function toggleAuth() {
    document.getElementById('loginCard').classList.toggle('hidden');
    document.getElementById('registerCard').classList.toggle('hidden');
}

function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    // Simulasi login
    console.log('Login dengan:', email);
    alert(`Selamat datang, ${email}!`);
    closeAuthModal();
    document.getElementById('login-email').value = '';
    document.getElementById('login-password').value = '';
}

function handleRegister(event) {
    event.preventDefault();
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirm = document.getElementById('register-confirm').value;
    
    if (password !== confirm) {
        alert('Password tidak cocok!');
        return;
    }
    
    // Simulasi register
    console.log('Registrasi pengguna:', name, email);
    alert(`Selamat datang di Findu, ${name}!`);
    closeAuthModal();
    
    // Reset form
    document.getElementById('register-name').value = '';
    document.getElementById('register-email').value = '';
    document.getElementById('register-password').value = '';
    document.getElementById('register-confirm').value = '';
}

// Close modal when clicking outside
document.addEventListener('click', function(event) {
    const authModal = document.getElementById('authModal');
    if (event.target === authModal) {
        closeAuthModal();
    }
});

// ===== AI Mentor Functions =====
const aiResponses = {
    'mulai investasi saham': 'Untuk memulai investasi saham, Anda perlu: 1) Buka rekening di perusahaan sekuritas, 2) Pelajari dasar analisis saham, 3) Mulai dengan saham blue chip yang stabil, 4) Gunakan strategi DCA (Dollar Cost Averaging) untuk investasi berkala.',
    'diversifikasi portfolio': 'Diversifikasi adalah cara terbaik mengurangi risiko. Alokasikan dana ke berbagai instrumen: saham (40%), obligasi (30%), reksadana (20%), dan cash/emergency fund (10%). Hal ini membantu menyeimbangkan risiko dan return.',
    'membuat budget': 'Gunakan metode 50/30/20: 50% untuk kebutuhan (makanan, sewa, utilitas), 30% untuk keinginan (hiburan, jalan-jalan), dan 20% untuk tabungan/investasi. Catat semua pengeluaran untuk tracking yang lebih baik.',
    'tips menghemat uang': 'Tips menghemat: 1) Buat daftar belanja dan patuhi, 2) Kurangi pengeluaran langganan yang tidak digunakan, 3) Gunakan cashback dan reward, 4) Masak di rumah daripada makan di luar, 5) Set target menabung bulanan.',
    'strategi investasi jangka panjang': 'Untuk jangka panjang (10+ tahun): 1) Gunakan strategi buy and hold, 2) Fokus pada growth stocks dengan fundamentals kuat, 3) Reinvestasi dividen, 4) Hindari panic selling saat pasar turun, 5) Monitor portfolio setahun sekali.',
    'cara mengelola risiko investasi': 'Manajemen risiko: 1) Diversifikasi aset, 2) Set stop loss untuk mencegah kerugian besar, 3) Jangan investasi dengan uang darurat, 4) Pelajari sebelum investasi, 5) Investasi sesuai profil risiko Anda (konservatif/moderat/agresif).',
    'investasi untuk pemula': 'Langkah pemula: 1) Belajar dasar pasar modal, 2) Mulai dengan modal kecil (Rp 100rb-500rb), 3) Pilih instrumen low-risk seperti reksadana, 4) Buka rekening di aplikasi yang user-friendly, 5) Ikuti komunitas investor untuk belajar bersama.',
    'cryptocurrency untuk pemula': 'Crypto 101: 1) Pahami teknologi blockchain, 2) Bitcoin adalah crypto tertua dan paling stabil, 3) Hanya investasikan uang yang bisa Anda rugikan, 4) Gunakan exchange terpercaya, 5) Simpan di wallet yang aman dengan 2FA enabled.'
};

function sendMessage(predefinedMessage = null) {
    const input = document.getElementById('mentorInput');
    const message = predefinedMessage || input.value.trim();
    
    if (!message) return;
    
    // Hide quick replies
    const quickReplies = document.getElementById('quickReplies');
    if (quickReplies) {
        quickReplies.style.display = 'none';
    }
    
    // Add user message
    addMessage(message, 'user');
    input.value = '';
    
    // Simulate AI response with delay
    setTimeout(() => {
        const response = getAIResponse(message);
        addMessage(response, 'bot');
    }, 800);
}

function addMessage(text, sender) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const avatar = sender === 'bot' ? '🤖' : '👤';
    
    messageDiv.innerHTML = `
        <div class="message-avatar">${avatar}</div>
        <div class="message-content">
            <p>${text}</p>
        </div>
    `;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function getAIResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    
    // Check for exact or partial matches
    for (const [key, response] of Object.entries(aiResponses)) {
        if (lowerMessage.includes(key)) {
            return response;
        }
    }
    
    // Default responses for common questions
    if (lowerMessage.includes('halo') || lowerMessage.includes('hai')) {
        return 'Hai! 👋 Ada yang bisa saya bantu? Saya siap menjawab pertanyaan tentang keuangan, investasi, budgeting, atau apapun yang berkaitan dengan literasi keuangan.';
    }
    
    if (lowerMessage.includes('saham')) {
        return 'Saham adalah surat berharga yang mewakili kepemilikan Anda di sebuah perusahaan. Dengan membeli saham, Anda menjadi pemilik sebagian dari perusahaan tersebut. Ada berbagai jenis saham seperti Blue Chip (perusahaan besar), Growth Stocks (potensi pertumbuhan tinggi), dan Dividend Stocks (memberikan dividen rutin).';
    }
    
    if (lowerMessage.includes('obligasi')) {
        return 'Obligasi adalah instrumen investasi berupa surat utang yang diterbitkan pemerintah atau perusahaan. Sebagai investor obligasi, Anda akan menerima pembayaran bunga (kupon) secara berkala dan pengembalian pokok pada waktu jatuh tempo. Risiko obligasi umumnya lebih rendah dari saham.';
    }
    
    if (lowerMessage.includes('reksadana')) {
        return 'Reksadana adalah wadah investasi yang mengumpulkan dana dari banyak investor untuk diinvestasikan ke berbagai instrumen (saham, obligasi, pasar uang). Keuntungan: mudah, terjangkau, dan sudah terdiversifikasi. Ada berbagai jenis sesuai profil risiko Anda.';
    }
    
    if (lowerMessage.includes('return') || lowerMessage.includes('keuntungan')) {
        return 'Return adalah keuntungan yang Anda dapatkan dari investasi. Bisa berupa capital gain (harga jual > harga beli) atau income (dividen, kupon, bunga). Return berbanding lurus dengan risiko - semakin tinggi potensi return, semakin tinggi risikonya.';
    }
    
    if (lowerMessage.includes('risiko')) {
        return 'Risiko investasi adalah kemungkinan kerugian. Ada beberapa jenis: market risk (perubahan harga pasar), inflation risk (daya beli menurun), liquidity risk (sulit dijual), dan credit risk (perusahaan bangkrut). Selalu pertimbangkan tolerance risiko Anda sebelum berinvestasi.';
    }
    
    // Generic fallback response
    return 'Pertanyaan yang bagus! Untuk topik spesifik, silakan pilih dari topik populer di sidebar atau coba pertanyaan lain tentang investasi, budgeting, atau perencanaan keuangan. Saya siap membantu! 😊';
}

// ===== Tab Navigation =====
function openTab(evt, tabName) {
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(tab => tab.classList.remove('active'));
    
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(tabName).classList.add('active');
    evt.currentTarget.classList.add('active');
}

// ===== Smooth Scroll =====
function scrollTo(id) {
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// ===== Currency Formatter =====
function formatCurrency(value) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value);
}

// ===== Calculator Functions =====
function calculateInvestment() {
    const principal = parseFloat(document.getElementById('principal').value) || 0;
    const rate = parseFloat(document.getElementById('rate').value) || 0;
    const years = parseFloat(document.getElementById('years').value) || 0;
    
    if (principal <= 0 || rate < 0 || years <= 0) {
        document.getElementById('result-investment').innerHTML = '<strong>⚠️ Masukkan nilai yang valid</strong>';
        return;
    }
    
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
    
    const monthlyRate = loanRate / 100 / 12;
    
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
    
    const needs = income * 0.50;
    const wants = income * 0.30;
    const savings = income * 0.20;
    
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

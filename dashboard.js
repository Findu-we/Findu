let isBufferActive = false;

// 1. Logika AI Ego yang Sensitif & Interaktif
function getAiFeedback(type, name, amt) {
    const res = document.getElementById('ai-response');
    const moodEmoji = document.getElementById('ai-mood-emoji');
    const aiStatus = document.getElementById('ai-status');
    const aiCard = document.getElementById('ai-card-wrapper');
    
    let msg = "";
    let mood = "😐";
    let status = "Stabil";
    aiCard.classList.remove('shake');

    const lowName = name.toLowerCase();

    if (type === 'income') {
        status = "Senang";
        mood = "🤑";
        if (amt > 5000000) {
            msg = `WIDIH! Rp ${amt.toLocaleString()}? Kamu resmi jadi pahlawan finansial hari ini. Jangan lupa sedekah dan tabung 30%-nya!`;
            mood = "👑";
        } else {
            msg = "Pemasukan masuk radar! Dompetmu tersenyum sekarang.";
        }
    } else {
        // Logika Sensitif Pengeluaran
        const expenseRatio = amt / wallet; // Seberapa besar pengeluaran dibanding saldo

        if (lowName.includes('kopi') || lowName.includes('starbucks')) {
            status = "Sarkas";
            mood = "☕";
            msg = "Lagi-lagi kopi? Ingat, tumpukan struk kopi hari ini bisa jadi tiket liburan di masa depan. Tapi ya sudahlah...";
        } else if (expenseRatio > 0.5) {
            status = "PANIK";
            mood = "😱";
            msg = "STOP! Kamu mengeluarkan lebih dari SETENGAH saldomu hanya untuk satu hal? Ini bahaya, bos!";
            aiCard.classList.add('shake');
        } else if (amt > 1000000) {
            status = "Tegas";
            mood = "🧐";
            msg = `Rp ${amt.toLocaleString()} melayang... Pastikan barang '${name}' ini tidak berakhir jadi pajangan berdebu dalam dua minggu.`;
        } else if (wallet < 500000) {
            status = "Khawatir";
            mood = "📉";
            msg = "Saldo kritis! Kamu harus mulai mode hemat ekstrem atau kita bakal makan promag akhir bulan.";
        } else {
            status = "Disiplin";
            mood = "👍";
            msg = "Pengeluaran tercatat. Masih dalam batas wajar, tapi tetap awasi pengeluaran berikutnya.";
        }
    }

    res.innerHTML = `"${msg}"`;
    moodEmoji.innerText = mood;
    aiStatus.innerText = status;
}

// 2. Fitur Pikir Dulu (Anti-Impulse Buffer)
function processTx() {
    const name = document.getElementById('tx-name').value.trim();
    const amt = parseFloat(document.getElementById('tx-amt').value) || 0;

    if (!name || amt <= 0) return alert("Data tidak valid!");

    // Jika pengeluaran > 500rb, aktifkan 'Pikir Dulu'
    if (mode === 'expense' && amt >= 500000 && !isBufferActive) {
        activateBuffer(name, amt);
        return;
    }

    executeTransaction(name, amt);
}

function activateBuffer(name, amt) {
    isBufferActive = true;
    const overlay = document.getElementById('impulse-overlay');
    const timerText = document.getElementById('buffer-timer');
    let timeLeft = 5;

    overlay.style.display = 'flex';
    
    const countdown = setInterval(() => {
        timeLeft--;
        timerText.innerText = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(countdown);
            overlay.style.display = 'none';
            if (confirm(`Setelah berpikir 5 detik, apakah kamu tetap ingin membeli ${name}?`)) {
                executeTransaction(name, amt);
            }
            isBufferActive = false;
        }
    }, 1000);
}

function executeTransaction(name, amt) {
    const tx = { name, amt, mode, time: new Date().toLocaleTimeString('id-ID') };
    transactions.unshift(tx);

    if (mode === 'income') {
        wallet += amt;
        totalIncome += amt;
        xp += 20; 
    } else {
        wallet -= amt;
        totalExpense += amt;
        xp += 10;
    }

    updateUI();
    getAiFeedback(mode, name, amt);
    
    document.getElementById('tx-name').value = "";
    document.getElementById('tx-amt').value = "";
}
// Tambahkan mata uang CNY di objek rates dan symbols
const rates = { IDR: 1, USD: 0.000064, CNY: 0.00046 };
const symbols = { IDR: 'Rp', USD: '$', CNY: '¥' };

// Fungsi untuk update Rekomendasi Investasi otomatis
function updateInvestLiteracy() {
    const investDiv = document.getElementById('invest-recom');
    let html = "";

    if (wallet <= 0) {
        html = `<div style="grid-column: span 2; color: var(--danger);">⚠️ Saldo kosong. Prioritaskan mencari pemasukan tambahan.</div>`;
    } else if (wallet < 1000000) {
        html = `
            <div class="card" style="padding:10px; font-size:0.8rem; border:1px solid #cbd5e1;">
                <b>Dana Darurat</b><br>Kumpulkan hingga Rp 3jt sebelum investasi.
            </div>
            <div class="card" style="padding:10px; font-size:0.8rem; border:1px solid #cbd5e1;">
                <b>Edukasi</b><br>Beli buku keuangan untuk naikkan skill.
            </div>`;
    } else {
        html = `
            <div class="card" style="padding:10px; font-size:0.8rem; border:1px solid #10b981;">
                <b>Reksadana Pasar Uang</b><br>Risiko rendah, cocok untuk pemula.
            </div>
            <div class="card" style="padding:10px; font-size:0.8rem; border:1px solid #3b82f6;">
                <b>SBN / Obligasi</b><br>Aman dijamin negara, bunga stabil.
            </div>`;
    }
    investDiv.innerHTML = html;
}

// Jangan lupa panggil updateInvestLiteracy() di dalam updateUI()
function updateUI() {
    // ... kode update UI yang lama ...
    updateInvestLiteracy(); // Panggil fitur literasi
}

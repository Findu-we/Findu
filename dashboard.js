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
// Initial State
let wallet = 0;
let totalIncome = 0;
let totalExpense = 0;
let xp = 450;
let mode = 'income';
let transactions = [];
let isBufferActive = false;

// Konfigurasi Mata Uang
const rates = { IDR: 1, USD: 0.000064, CNY: 0.00046 };
const symbols = { IDR: 'Rp', USD: '$', CNY: '¥' };

// Load Data Saat Mulai
window.onload = () => {
    const session = localStorage.getItem('currentUser');
    if (session) {
        const userData = JSON.parse(session);
        document.getElementById('user-display').innerText = userData.fullname || "User";
    }
    updateUI();
};

// Fungsi Ganti Mode (Pemasukan/Pengeluaran)
function setMode(m) {
    mode = m;
    const btnIn = document.getElementById('btn-in');
    const btnOut = document.getElementById('btn-out');
    
    if (m === 'income') {
        btnIn.style.background = 'var(--emerald)';
        btnOut.style.background = '#64748b';
    } else {
        btnIn.style.background = '#64748b';
        btnOut.style.background = 'var(--danger)';
    }
}

// Fungsi Utama Simpan Transaksi
function processTx() {
    const nameInput = document.getElementById('tx-name');
    const amtInput = document.getElementById('tx-amt');
    const name = nameInput.value.trim();
    const amt = parseFloat(amtInput.value) || 0;

    if (!name || amt <= 0) {
        alert("Mohon masukkan nama dan nominal yang valid!");
        return;
    }

    // Fitur Pikir Dulu: Jika pengeluaran >= 500rb (IDR)
    if (mode === 'expense' && amt >= 500000 && !isBufferActive) {
        activateBuffer(name, amt);
        return;
    }

    executeTransaction(name, amt);
}

// Logika Anti-Impulse Buffer
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
            if (confirm(`Waktu berpikir habis. Apakah kamu tetap yakin membeli ${name}?`)) {
                executeTransaction(name, amt);
            }
            isBufferActive = false;
            document.getElementById('buffer-timer').innerText = "5"; // Reset timer
        }
    }, 1000);
}

// Eksekusi Akhir Transaksi
function executeTransaction(name, amt) {
    const tx = { 
        name, 
        amt, 
        mode, 
        time: new Date().toLocaleTimeString('id-ID') 
    };
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
    
    // Clear Input
    document.getElementById('tx-name').value = "";
    document.getElementById('tx-amt').value = "";
}

// Update Tampilan (UI)
function updateUI() {
    const curr = document.getElementById('curr').value;
    const r = rates[curr];
    const s = symbols[curr];

    // Stats
    document.getElementById('wal-text').innerText = `${s} ${(wallet * r).toLocaleString()}`;
    document.getElementById('income-text').innerText = `${s} ${(totalIncome * r).toLocaleString()}`;
    document.getElementById('expense-text').innerText = `${s} ${(totalExpense * r).toLocaleString()}`;
    
    // XP & Progress
    document.getElementById('xp-text').innerText = xp;
    document.getElementById('xp-bar').style.width = Math.min((xp / 1000) * 100, 100) + "%";

    // Table
    const body = document.getElementById('tx-body');
    if (transactions.length === 0) {
        body.innerHTML = '<tr><td colspan="3" style="text-align:center">Belum ada data</td></tr>';
    } else {
        body.innerHTML = transactions.map(t => `
            <tr>
                <td><b>${t.name}</b><br><small style="color:${t.mode === 'income' ? 'var(--emerald)' : 'var(--danger)'}">${t.mode.toUpperCase()}</small></td>
                <td style="color:${t.mode === 'income' ? 'var(--emerald)' : 'var(--danger)'}; font-weight:700">
                    ${t.mode === 'income' ? '+' : '-'} ${s} ${(t.amt * r).toLocaleString()}
                </td>
                <td><small>${t.time}</small></td>
            </tr>
        `).join('');
    }

    updateInvestLiteracy();
}

// Fitur Literasi & Investasi
function updateInvestLiteracy() {
    const investDiv = document.getElementById('invest-recom');
    let html = "";

    if (wallet <= 0) {
        html = `<div style="grid-column: span 2; color: #ef4444; font-size: 0.8rem;">⚠️ Saldo kosong. Cari pemasukan tambahan dahulu.</div>`;
    } else if (wallet < 1000000) {
        html = `
            <div style="background:#f8fafc; padding:10px; border-radius:10px; font-size:0.75rem; border:1px solid #e2e8f0;">
                <b>Tabungan Tabungan</b><br>Fokus amankan Dana Darurat 3x pengeluaran.
            </div>
            <div style="background:#f8fafc; padding:10px; border-radius:10px; font-size:0.75rem; border:1px solid #e2e8f0;">
                <b>Edukasi</b><br>Investasi terbaik adalah leher ke atas (skill).
            </div>`;
    } else {
        html = `
            <div style="background:#f0fdf4; padding:10px; border-radius:10px; font-size:0.75rem; border:1px solid #10b981;">
                <b>Reksadana (Low Risk)</b><br>Cocok untuk menjaga nilai uangmu.
            </div>
            <div style="background:#eff6ff; padding:10px; border-radius:10px; font-size:0.75rem; border:1px solid #3b82f6;">
                <b>Saham/SBN</b><br>Pertimbangkan untuk jangka panjang (5th+).
            </div>`;
    }
    investDiv.innerHTML = html;
}

// AI Ego Logic
function getAiFeedback(type, name, amt) {
    const res = document.getElementById('ai-response');
    const moodEmoji = document.getElementById('ai-mood-emoji');
    const aiStatus = document.getElementById('ai-status');
    let msg = "";
    let mood = "😐";
    let status = "Normal";

    const lowName = name.toLowerCase();

    if (type === 'income') {
        msg = "Mantap! Saldo bertambah. Jangan langsung lapar mata ya!";
        mood = "🤑";
        status = "Senang";
    } else {
        if (amt > wallet * 0.5) {
            msg = "GILA! Kamu ngabisin setengah saldo cuma buat ini? Pikir lagi!";
            mood = "😱";
            status = "PANIK";
        } else if (lowName.includes('kopi') || lowName.includes('ngopi')) {
            msg = "Ngopi terus... awas dompet kering gara-gara gaya hidup!";
            mood = "☕";
            status = "Sarkas";
        } else {
            msg = "Pengeluaran dicatat. Semoga ini memang kebutuhan penting.";
            mood = "🧐";
            status = "Tegas";
        }
    }
    res.innerHTML = `"${msg}"`;
    moodEmoji.innerText = mood;
    aiStatus.innerText = status;
}

// Simulasi Masa Depan
function runSimulation() {
    const price = parseFloat(document.getElementById('sim-amt').value) || 0;
    const res = document.getElementById('sim-result');

    if (price <= 0) return alert("Masukkan harga barang!");

    const futureVal = price * Math.pow(1 + 0.06, 5); 
    res.style.display = "block";
    res.innerHTML = `
        <div style="background:rgba(217, 119, 6, 0.1); padding:10px; border-radius:10px; border:1px solid var(--gold);">
            <p>⏳ <b>Efek 5 Tahun:</b> Jika uang ini diinvestasikan, nilainya bisa jadi <b>Rp ${Math.round(futureVal).toLocaleString()}</b>.</p>
        </div>
    `;
}

// Dark Mode Toggle
function toggleDark() {
    document.body.classList.toggle('dark-mode');
}
// Fungsi untuk menyimpan data ke LocalStorage
function saveToLocal() {
    const dataToSave = {
        wallet,
        totalIncome,
        totalExpense,
        xp,
        transactions
    };
    // Simpan dengan key 'findu_data'
    localStorage.setItem('findu_data', JSON.stringify(dataToSave));
}

function executeTransaction(name, amt) {
    const tx = { 
        name, 
        amt, 
        mode, 
        time: new Date().toLocaleString('id-ID') // Gunakan toLocaleString agar tanggal tersimpan
    };
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
    
    // SIMPAN KE LOCAL STORAGE
    saveToLocal();

    document.getElementById('tx-name').value = "";
    document.getElementById('tx-amt').value = "";
}
window.onload = () => {
    // 1. Cek Sesi Login (User)
    const session = localStorage.getItem('currentUser');
    if (session) {
        const userData = JSON.parse(session);
        document.getElementById('user-display').innerText = userData.fullname || "User";
    }

    // 2. Cek Data Transaksi & Saldo Lama
    const savedData = localStorage.getItem('findu_data');
    if (savedData) {
        const parsed = JSON.parse(savedData);
        
        // Kembalikan nilai variabel dari penyimpanan
        wallet = parsed.wallet || 0;
        totalIncome = parsed.totalIncome || 0;
        totalExpense = parsed.totalExpense || 0;
        xp = parsed.xp || 450;
        transactions = parsed.transactions || [];
    }

    updateUI();
};
function resetData() {
    if (confirm("Apakah Anda yakin ingin menghapus semua riwayat transaksi?")) {
        localStorage.removeItem('findu_data');
        location.reload(); // Refresh halaman
    }
}

const panel = document.getElementById('sideInfoPanel');
const openBtn = document.getElementById('toggleInfo');
const closeBtn = document.getElementById('closeInfo');

openBtn.addEventListener('click', () => {
    if (panel.style.right === "0px") {
        panel.style.right = "-420px";  // tutup
    } else {
        panel.style.right = "0px";     // buka
    }
});


closeBtn.addEventListener('click', () => {
    panel.style.right = "-420px";
});
// --- Helpers untuk mengupdate input parameter ---
function updateParamInputs() {
    const type = document.getElementById('functionType').value;
    const container = document.getElementById('paramInputs');
    if (type === 'linear') {
        container.innerHTML = `
                <div class="row g-2">
                    <div class="col-md-6">
                        <label class="form-label">Koefisien a</label>
                        <input id="paramA" type="number" class="form-control" value="2" step="0.1">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">Konstanta b</label>
                        <input id="paramB" type="number" class="form-control" value="1" step="0.1">
                    </div>
                </div>
            `;
    } else if (type === 'quadratic') {
        container.innerHTML = `
                <div class="row g-2">
                    <div class="col-md-6">
                        <label class="form-label">Konstanta c</label>
                        <input id="paramC" type="number" class="form-control" value="0" step="0.1">
                    </div>
                </div>
                <small class="text-muted">Asumsi cabang positif: x ≥ 0</small>
            `;
    } else {
        container.innerHTML = '';
    }
}

document.getElementById('functionType').addEventListener('change', updateParamInputs);
updateParamInputs();

// --- Contoh ---
function setExample(n) {
    if (n === 1) {
        document.getElementById('functionType').value = 'linear';
        updateParamInputs();
        setTimeout(() => {
            document.getElementById('paramA').value = 2;
            document.getElementById('paramB').value = 1;
            document.getElementById('pointA').value = 5;
        }, 50);
    } else if (n === 2) {
        document.getElementById('functionType').value = 'quadratic';
        updateParamInputs();
        setTimeout(() => {
            document.getElementById('paramC').value = 0;
            document.getElementById('pointA').value = 4;
        }, 50);
    } else if (n === 3) {
        document.getElementById('functionType').value = 'cubic';
        updateParamInputs();
        setTimeout(() => {
            document.getElementById('pointA').value = 8;
        }, 50);
    }
}

// --- Kalkulator utama ---
function calculate() {
    const type = document.getElementById('functionType').value;
    const a = parseFloat(document.getElementById('pointA').value);
    let result;

    if (type === 'linear') result = calculateLinear(a);
    else if (type === 'quadratic') result = calculateQuadratic(a);
    else if (type === 'cubic') result = calculateCubic(a);
    else if (type === 'sqrt') result = calculateSqrt(a);
    else if (type === 'exp') result = calculateExp(a);
    else if (type === 'ln') result = calculateLn(a);

    displayResults(result);
}

// =====================
//     FUNGSI LINEAR
// =====================
function calculateLinear(a) {
    const A = parseFloat(document.getElementById('paramA').value);
    const B = parseFloat(document.getElementById('paramB').value);
    if (A === 0) return { error: 'Koefisien a tidak boleh 0 untuk fungsi linear.' };

    const b = (a - B) / A;
    const fPrime = A;
    const value = 1 / fPrime;

    return {
        function: `f(x) = ${A}x + ${B}`,
        steps: [
            {
                title: 'Langkah 1: Identifikasi fungsi',
                content: `Fungsi diberikan \\(f(x) = ${A}x + ${B}\\).`,
                explanation: 'Fungsi linear — invers ada jika A ≠ 0.'
            },
            {
                title: 'Langkah 2: Cari fungsi invers',
                content: `Tukar variabel: \\(x = ${A}y + ${B}\\).<br>
                              Selesaikan untuk y: \\(y = \\frac{x - ${B}}{${A}}\\).<br>
                              Jadi \\(f^{-1}(x)=\\frac{x - ${B}}{${A}}\\).`,
                explanation: 'Tukar x dan y lalu isolasi y.'
            },
            {
                title: 'Langkah 3: Hitung f^{-1}(a)',
                content: `\\(f^{-1}(${a}) = \\frac{${a} - ${B}}{${A}} = ${b.toFixed(6)}\\).`,
                explanation: 'Substitusi a ke fungsi invers.'
            },
            {
                title: 'Langkah 4: Turunan f',
                content: `\\(f'(x) = ${A}\\).`,
                explanation: 'Turunan linear adalah konstanta A.'
            },
            {
                title: 'Langkah 5: Evaluasi f\'(f^{-1}(a))',
                content: `\\(f'(${b.toFixed(6)}) = ${fPrime}\\).`,
                explanation: 'Karena f\' konstan, nilainya sama di semua x.'
            },
            {
                title: 'Langkah 6: Gunakan rumus turunan invers',
                content: `\\((f^{-1})'(${a}) = \\frac{1}{${fPrime}} = ${value.toFixed(6)}\\).`,
                explanation: 'Aplikasikan rumus \\((f^{-1})\'(a)=1/f\'(f^{-1}(a))\\).'
            }
        ],
        finalAnswer: value.toFixed(8),
        verification: `Invers \\(f^{-1}(x)=\\frac{x-${B}}{${A}}\\) turunan = \\(1/${A}=${value.toFixed(6)}\\).`
    };
}

// =====================
//     QUADRATIC
// =====================
function calculateQuadratic(a) {
    const C = parseFloat(document.getElementById('paramC').value) || 0;
    if (a < C) return { error: `Untuk f(x)=x^2+${C}, nilai a harus ≥ ${C}.` };

    const b = Math.sqrt(a - C);
    const fPrimeAtB = 2 * b;
    if (fPrimeAtB === 0) return { error: 'f\'(b) = 0, rumus tidak berlaku (pembagian nol).' };
    const value = 1 / fPrimeAtB;

    return {
        function: `f(x) = x^2 + ${C}, x ≥ 0`,
        steps: [
            {
                title: 'Langkah 1: Identifikasi fungsi',
                content: `\\(f(x)=x^2+${C}\\). Domain x≥0.`,
                explanation: 'Dipilih cabang positif agar fungsi 1–1.'
            },
            {
                title: 'Langkah 2: Cari invers',
                content: `\\(f^{-1}(x)=\\sqrt{x-${C}}\\).`,
                explanation: 'Ambil akar positif.'
            },
            {
                title: 'Langkah 3: Hitung f^{-1}(a)',
                content: `\\(f^{-1}(${a})=${b.toFixed(6)}\\).`,
                explanation: 'Substitusi nilai a.'
            },
            {
                title: 'Langkah 4: Turunan f',
                content: `\\(f'(x)=2x\\).`,
                explanation: 'Aturan pangkat.'
            },
            {
                title: 'Langkah 5: Evaluasi f\'(b)',
                content: `\\(f'(${b.toFixed(6)}) = ${fPrimeAtB.toFixed(6)}\\).`,
                explanation: 'Substitusi ke turunan.'
            },
            {
                title: 'Langkah 6: Rumus',
                content: `\\((f^{-1})'(${a}) = ${value.toFixed(6)}\\).`,
                explanation: 'Aplikasi rumus turunan invers.'
            },
        ],
        finalAnswer: value.toFixed(8),
        verification: `Turunan invers: \\(1/(2\\sqrt{x-${C}})\\). Pada x=${a}: ${value.toFixed(6)}.`
    };
}

// =====================
//     CUBIC
// =====================
function calculateCubic(a) {
    const b = Math.cbrt(a);
    const fPrimeAtB = 3 * b * b;
    if (fPrimeAtB === 0) return { error: 'f\'(b) = 0, rumus tidak berlaku.' };

    const value = 1 / fPrimeAtB;

    return {
        function: 'f(x)=x^3',
        steps: [
            { title: 'Langkah 1', content: '\\(f(x)=x^3\\).', explanation: 'Fungsi one-to-one.' },
            { title: 'Langkah 2', content: '\\(f^{-1}(x)=\\sqrt[3]{x}\\).', explanation: 'Invers kubik.' },
            { title: 'Langkah 3', content: `\\(f^{-1}(${a})=${b.toFixed(6)}\\).`, explanation: 'Akar kubik dari a.' },
            { title: 'Langkah 4', content: '\\(f\'(x)=3x^2\\).', explanation: 'Turunan pangkat.' },
            { title: 'Langkah 5', content: `\\(f'(${b.toFixed(6)})=${fPrimeAtB.toFixed(6)}\\).`, explanation: 'Substitusi.' },
            { title: 'Langkah 6', content: `\\((f^{-1})'(${a})=${value.toFixed(6)}\\).`, explanation: 'Rumus invers.' }
        ],
        finalAnswer: value.toFixed(8),
        verification: `Turunan invers: \\(1/(3x^{2/3})\\). Pada x=${a}: ${value.toFixed(6)}.`
    };
}

// =====================
//     SQRT
// =====================
function calculateSqrt(a) {
    if (a < 0) return { error: 'Untuk f(x)=√x, nilai a harus ≥ 0.' };

    const b = a * a;
    if (a === 0) return { error: 'f\'(f^{-1}(a)) tak terdefinisi pada a=0.' };

    const fPrimeAtB = 1 / (2 * a);
    const value = 1 / fPrimeAtB; // = 2a

    return {
        function: 'f(x)=\\sqrt{x}, x≥0',
        steps: [
            { title: 'Langkah 1', content: '\\(f(x)=\\sqrt{x}\\).', explanation: 'Cabang positif.' },
            { title: 'Langkah 2', content: '\\(f^{-1}(x)=x^2\\).', explanation: 'Kebalikan akar.' },
            { title: 'Langkah 3', content: `\\(f^{-1}(${a})=${b}\\).`, explanation: 'Kuadrat dari a.' },
            { title: 'Langkah 4', content: '\\(f\'(x)=1/(2\\sqrt{x})\\).', explanation: 'Aturan pangkat.' },
            { title: 'Langkah 5', content: `\\(f'(${b})=1/(2${a})=${fPrimeAtB}\\).`, explanation: 'Substitusi.' },
            { title: 'Langkah 6', content: `\\((f^{-1})'(${a})=${value}\\).`, explanation: 'Rumus invers.' }
        ],
        finalAnswer: value.toFixed(8),
        verification: `Turunan invers: 2x. Pada x=${a}: ${value}.`
    };
}

// =====================
//     EXP
// =====================
function calculateExp(a) {
    if (a <= 0) return { error: 'Untuk f(x)=e^x, nilai a harus > 0.' };

    const b = Math.log(a);
    const fPrimeAtB = a;
    const value = 1 / a;

    return {
        function: 'f(x)=e^x',
        steps: [
            { title: 'Langkah 1', content: '\\(f(x)=e^x\\).', explanation: 'Eksponensial.' },
            { title: 'Langkah 2', content: '\\(f^{-1}(x)=\\ln x\\).', explanation: 'Invers eksponensial.' },
            { title: 'Langkah 3', content: `\\(\\ln(${a})=${b.toFixed(6)}\\).`, explanation: 'Hitung ln(a).' },
            { title: 'Langkah 4', content: '\\(f\'(x)=e^x\\).', explanation: 'Turunan dirinya.' },
            { title: 'Langkah 5', content: `\\(e^{${b.toFixed(6)}}=${fPrimeAtB}\\).`, explanation: 'e^{ln(a)} = a.' },
            { title: 'Langkah 6', content: `\\((f^{-1})'(${a})=${value}\\).`, explanation: 'Rumus invers.' }
        ],
        finalAnswer: value.toFixed(8),
        verification: `Turunan invers: 1/x. Pada x=${a}: ${value}.`
    };
}

// =====================
//     LN
// =====================
function calculateLn(a) {
    const b = Math.exp(a);
    const fPrimeAtB = 1 / b;
    const value = b;

    return {
        function: 'f(x)=\\ln x, x>0',
        steps: [
            { title: 'Langkah 1', content: '\\(f(x)=\\ln x\\).', explanation: 'Domain x>0.' },
            { title: 'Langkah 2', content: '\\(f^{-1}(x)=e^x\\).', explanation: 'Invers logaritma.' },
            { title: 'Langkah 3', content: `\\(e^{${a}}=${b.toFixed(6)}\\).`, explanation: 'Hitung e^a.' },
            { title: 'Langkah 4', content: '\\(f\'(x)=1/x\\).', explanation: 'Turunan ln.' },
            { title: 'Langkah 5', content: `\\(1/${b.toFixed(6)}=${fPrimeAtB.toFixed(6)}\\).`, explanation: 'Substitusi.' },
            { title: 'Langkah 6', content: `\\((f^{-1})'(${a})=${value.toFixed(6)}\\).`, explanation: 'Hasil turunan.' }
        ],
        finalAnswer: value.toFixed(8),
        verification: `Turunan e^x = e^x. Pada x=${a}: ${value}.`
    };
}

// =====================
//     TAMPILKAN HASIL
// =====================
function displayResults(result) {
    const container = document.getElementById('results');
    if (!result) {
        container.innerHTML = '';
        return;
    }

    if (result.error) {
        container.innerHTML = `<div class="alert alert-danger">${result.error}</div>`;
        return;
    }

    let stepsHtml = '';
    result.steps.forEach(step => {
        stepsHtml += `
                <div class="step-box">
                    <div class="step-title">${step.title}</div>
                    <div class="mb-2">${step.content}</div>
                    <small class="text-muted"><strong>Penjelasan:</strong> ${step.explanation}</small>
                </div>
            `;
    });

    container.innerHTML = `
            <div class="alert alert-info"><strong>Fungsi:</strong> ${result.function}</div>
            <h5 class="fw-bold">Langkah-langkah:</h5>
            ${stepsHtml}
            <div class="result-box">
                <h5 class="fw-bold text-success">Hasil Akhir</h5>
                <div class="fs-5">\\((f^{-1})'(a) = ${result.finalAnswer}\\)</div>
            </div>
            <div class="alert alert-success mt-3"><strong>Verifikasi:</strong><br>${result.verification}</div>
        `;

    if (window.MathJax && MathJax.typesetPromise) {
        MathJax.typesetPromise([container]).catch(() => { });
    }
}

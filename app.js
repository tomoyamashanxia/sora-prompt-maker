// ========================================
// Sora Prompt Maker - App Logic
// ========================================

// State
let state = {
    cameo: null,     // { id, name }
    outfit: null,    // 'A' or 'B'
    word: null       // { en, kana, ja }
};

// Outfit definitions
const OUTFITS = {
    A: '白タンクトップ、デニム',
    B: 'ベージュのビジネススーツ、白タンクトップ、デニムショーツ'
};

// ========================================
// Random Selection Functions
// ========================================
function randomizeCameo() {
    const btn = document.querySelector('.card-cameo .btn-dice');
    btn.classList.add('rolling');
    setTimeout(() => btn.classList.remove('rolling'), 500);

    const idx = Math.floor(Math.random() * CAMEOS.length);
    state.cameo = CAMEOS[idx];

    const idEl = document.getElementById('cameoId');
    const nameEl = document.getElementById('cameoName');
    idEl.textContent = state.cameo.id;
    nameEl.textContent = state.cameo.name;
    idEl.classList.remove('value-updated');
    nameEl.classList.remove('value-updated');
    void idEl.offsetWidth;
    idEl.classList.add('value-updated');
    nameEl.classList.add('value-updated');

    updatePrompt();
}

function selectOutfit(type) {
    state.outfit = type;
    document.getElementById('outfitA').classList.toggle('selected', type === 'A');
    document.getElementById('outfitB').classList.toggle('selected', type === 'B');
    updatePrompt();
}

function randomizeOutfit() {
    const btn = document.querySelector('.card-outfit .btn-dice');
    btn.classList.add('rolling');
    setTimeout(() => btn.classList.remove('rolling'), 500);
    selectOutfit(Math.random() < 0.5 ? 'A' : 'B');
}

function randomizeWord() {
    const btn = document.querySelector('.card-word .btn-dice');
    btn.classList.add('rolling');
    setTimeout(() => btn.classList.remove('rolling'), 500);

    const idx = Math.floor(Math.random() * WORDS.length);
    // WORDS format: [english, japanese, katakana_pronunciation]
    const [en, ja, kana] = WORDS[idx];
    state.word = { en, kana, ja };

    const enEl = document.getElementById('wordEn');
    const kanaEl = document.getElementById('wordKana');
    const jaEl = document.getElementById('wordJa');
    enEl.textContent = en;
    kanaEl.textContent = kana;
    jaEl.textContent = ja;

    enEl.classList.remove('value-updated');
    void enEl.offsetWidth;
    enEl.classList.add('value-updated');

    updatePrompt();
}

// ========================================
// Generate All
// ========================================
function generateAll() {
    randomizeCameo();
    randomizeOutfit();
    randomizeWord();
}

// ========================================
// Prompt Generation
// ========================================
function updatePrompt() {
    const el = document.getElementById('promptPreview');

    if (!state.cameo || !state.outfit || !state.word) {
        const missing = [];
        if (!state.cameo) missing.push('① Cameo');
        if (!state.outfit) missing.push('② 衣装');
        if (!state.word) missing.push('④ 英単語');
        el.textContent = `まだ選択されていない項目: ${missing.join(', ')}`;
        el.classList.remove('has-content');
        return;
    }

    const outfitText = OUTFITS[state.outfit];
    const prompt = `@${state.cameo.id} : 女性の英語教師、${outfitText}、臍ピアス、日本語を話す。
生徒: 日本人の中年男性、髪が薄い、痩せている、とても背が低い(彼女の肩の高さより低い身長)、ニヤッと笑っている、日本語を話す。

レッスンで女性教師がジェスチャーを駆使してめちゃくちゃわかりやすく英単語を教えている。
冒頭で挨拶「こんにちは、${state.cameo.name}です！」
場所は、この英語フレーズに関連がある箇所で。
英語フレーズ: 「${state.word.en}、${state.word.kana}、${state.word.ja}」
最後に「チャンネル登録してね！」`;

    el.textContent = prompt;
    el.classList.add('has-content');
}

// ========================================
// Copy to Clipboard
// ========================================
function copyPrompt() {
    const el = document.getElementById('promptPreview');
    const text = el.textContent;

    if (!state.cameo || !state.outfit || !state.word) {
        showToast('先に全項目を選択してください ⚠️');
        return;
    }

    navigator.clipboard.writeText(text).then(() => {
        const btn = document.getElementById('btnCopy');
        btn.classList.add('copied');
        btn.querySelector('.btn-text').textContent = 'コピーしました！ ✅';
        setTimeout(() => {
            btn.classList.remove('copied');
            btn.querySelector('.btn-text').textContent = 'プロンプトをコピー';
        }, 2000);
        showToast('プロンプトをコピーしました！ ✅');
    }).catch(() => {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast('コピーしました！ ✅');
    });
}

function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
}

// ========================================
// Initialize
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    updatePrompt();
});

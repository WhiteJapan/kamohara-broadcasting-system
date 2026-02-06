const DB = {
    STATIONS: [
        { id: "018", txt: "長町..各駅" },
        { id: "019", txt: "長町から各駅" },
        { id: "020", txt: "三田" },
        { id: "021", txt: "横河" },
        { id: "022", txt: "荒川" },
        { id: "023", txt: "長町" },
        { id: "024", txt: "立町" },
        { id: "025", txt: "長塚" },
        { id: "026", txt: "松山" },
        { id: "027", txt: "陸前今庄" },
        { id: "028", txt: "今庄ランド前" },
        { id: "029", txt: "東名取" },
        { id: "030", txt: "名取" },
        { id: "031", txt: "南流山" },
        { id: "032", txt: "岩富" },
        { id: "033", txt: "山栄" },
    ],
    TRAIN_INFO: [
        { id: "001", txt: "今日も鴨原..." },
        { id: "002", txt: "ご乗車..." },
        { id: "003", txt: "快速" },
        { id: "004", txt: "区快" },
        { id: "005", txt: "各駅" },
        { id: "006", txt: "この電車は" },
        { id: "007", txt: "ワンマンカー" },
        { id: "008", txt: "三田行き" },
        { id: "009", txt: "長町行き" },
        { id: "010", txt: "長塚行き" },
        { id: "011", txt: "陸今行き" },
        { id: "012", txt: "名取行き" },
        { id: "013", txt: "山栄行き" },
        { id: "014", txt: "です" },
        { id: "015", txt: "途中の停車..." },
        { id: "016", txt: "終点..." },
        { id: "017", txt: "の順に停車..." },
        { id: "096", txt: "各駅に停車" }
    ],
    HI: [
        { name: "三田", next: "034", soon: "035", canBeTerm: true, not: false },
        { name: "横河", next: "036", soon: "037", canBeTerm: false, not: false },
        { name: "荒川", next: "038", soon: "039", canBeTerm: false, not: false },
        { name: "長町", next: "040", soon: "041", canBeTerm: true, terminalNext: "042", terminalSoon: "043", not: false },
        { name: "立町", next: "044", soon: "045", canBeTerm: false, not: false },
        { name: "長塚", next: "046", soon: "047", canBeTerm: true, terminalNext: "048", terminalSoon: "049", not: false },
        { name: "松山", next: "050", soon: "051", canBeTerm: false, not: false },
        { name: "陸前今庄", next: "052", soon: "053", canBeTerm: true, terminalNext: "054", terminalSoon: "055", not: false },
        { name: "今庄ランド前", next: "056", soon: "057", canBeTerm: false, not: false },
        { name: "東名取", next: "058", soon: "059", canBeTerm: false, not: true },
        { name: "名取", next: "060", soon: "061", canBeTerm: true, terminalNext: "062", terminalSoon: "063", not: false },
        { name: "南流山", next: "064", soon: "065", canBeTerm: false, not: false },
        { name: "岩富", next: "066", soon: "067", canBeTerm: false, not: false },
        { name: "山栄", next: "068", soon: "069", canBeTerm: true, not: false }
    ],
    EF: [
        { id: "072", txt: "出口,右" },
        { id: "073", txt: "出口,左" },
        { id: "094", txt: "ドア閉扉" },
        { id: "095", txt: "手を離せ！" },
        { id: "092", txt: "乗り換え" },
        { id: "074", txt: "優先席" },
        { id: "075", txt: "優先席付近" },
        { id: "076", txt: "事故防止" },
        { id: "077", txt: "揺れる" },
        { id: "078", txt: "停止信号" },
        { id: "079", txt: "安全確認" },
        { id: "080", txt: "運転見合わせ" },
        { id: "081", txt: "待機命令" },
        { id: "082", txt: "折り返し" },
        { id: "083", txt: "運転中止" },
        { id: "084", txt: "当駅止まり" },
        { id: "085", txt: "運転再開目処なし" },
        { id: "086", txt: "乗り降り" },
        { id: "087", txt: "逝っとけ" },
        { id: "088", txt: "対向列車" },
        { id: "089", txt: "発車" },
        { id: "090", txt: "回送" },
        { id: "091", txt: "下北沢" },
    ]
};

// --- 設定管理 (Core Logic) ---
const SETTINGS_KEY = 'krab_settings_v2.0';
const DEFAULT_SETTINGS = {
    theme: 'auto',
    volume: 100,
    speed: 100,
    skipWarning: false,
    history: [],
    fullscreen: false,
    reduceAnim: false
};
let settings = { ...DEFAULT_SETTINGS };

function loadSettings() {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) {
        try {
            settings = { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
        } catch (e) {
            console.error("Settings load error:", e);
        }
    }
    applySettings();
}

function saveSettings() {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

function applySettings() {
    // テーマ適用
    const applyTheme = (t) => {
        let actual = t;
        if (t === 'auto') {
            actual = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        document.documentElement.setAttribute('data-theme', actual);
        // UI更新
        document.querySelectorAll('.theme-opt').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.value === t);
        });
    };
    applyTheme(settings.theme);

    // 音量適用
    player.volume = settings.volume / 100;
    const volRange = document.getElementById('volume-range');
    const volVal = document.getElementById('volume-val');
    if (volRange) {
        volRange.value = settings.volume;
        updateSliderFill(volRange);
    }
    if (volVal) volVal.innerText = settings.volume + '%';

    // 速度適用
    player.playbackRate = settings.speed / 100;
    const speedRange = document.getElementById('speed-range');
    const speedVal = document.getElementById('speed-val');
    if (speedRange) {
        speedRange.value = settings.speed;
        updateSliderFill(speedRange);
    }
    if (speedVal) speedVal.innerText = (settings.speed / 100).toFixed(1) + 'x';

    // 警告スキップ
    const skipWarningCheck = document.getElementById('skip-warning-check');
    if (skipWarningCheck) skipWarningCheck.checked = settings.skipWarning;

    // フルスクリーン (UIのみ)
    const fsCheck = document.getElementById('fullscreen-check');
    if (fsCheck) fsCheck.checked = settings.fullscreen;

    // アニメーションを減らす
    const raCheck = document.getElementById('reduce-anim-check');
    if (raCheck) {
        raCheck.checked = settings.reduceAnim;
        document.body.classList.toggle('reduce-animations', settings.reduceAnim);
    }

    updateHistoryUI();
}

function updateSliderFill(el) {
    const min = el.min || 0;
    const max = el.max || 100;
    const val = el.value;
    const percent = (val - min) / (max - min) * 100;
    el.style.background = `linear-gradient(to right, var(--accent-secondary) 0%, var(--accent-secondary) ${percent}%, var(--slider-track) ${percent}%, var(--slider-track) 100%)`;
}

function updateHistoryUI() {
    const container = document.getElementById('broadcast-history');
    if (!container) return;
    if (settings.history.length === 0) {
        container.innerHTML = '<div class="history-placeholder">履歴はありません</div>';
        return;
    }
    container.innerHTML = settings.history.map(item => `
        <div class="info-item">
            <span class="info-label">${item.txt}</span>
            <span class="info-value">${item.time}</span>
        </div>
    `).join('');
}

function addHistory(txt) {
    const now = new Date();
    const time = now.getHours().toString().padStart(2, '0') + ":" + now.getMinutes().toString().padStart(2, '0') + ":" + now.getSeconds().toString().padStart(2, '0');
    settings.history.unshift({ txt, time });
    if (settings.history.length > 5) settings.history.pop();
    saveSettings();
    updateHistoryUI();
}

// --- 再生ロジック ---
let buildQueue = [];
let hiDisplayOrder = 1; // 1: 昇順, -1: 降順
let isPlaying = false;
const player = new Audio();

let completedStations = new Set();
let currentStatus = {
    index: -1,   // station original index
    type: null   // 'next' or 'soon'
};

function playQueue(ids, onComplete) {
    if (isPlaying) { player.pause(); player.currentTime = 0; }
    isPlaying = true;

    // 手動放送（BuilderやEF）による割り込みの場合、案内状態をリセット
    // 案内IDでない場合（idsの長さが1より大きい、またはids[0]がDB.HIに含まれない）
    const isGuidance = ids.length === 1 && DB.HI.some(h => h.next == ids[0] || h.soon == ids[0] || h.terminalNext == ids[0] || h.terminalSoon == ids[0]);
    if (!isGuidance) {
        currentStatus = { index: -1, type: null };
        refreshActiveHI();
    }

    // 履歴追加ロジック
    const firstId = ids[0];
    let historyTxt = "不明な放送";
    const st = DB.STATIONS.find(s => s.id == firstId);
    const ti = DB.TRAIN_INFO.find(t => t.id == firstId);
    const ef = DB.EF.find(e => e.id == firstId);
    // 駅案内の場合はIDがnext, soonなど
    const hi = DB.HI.find(h => h.next == firstId || h.soon == firstId || h.terminalNext == firstId || h.terminalSoon == firstId);

    if (st) historyTxt = `単発: ${st.txt}`;
    else if (ti) historyTxt = `案内: ${ti.txt}`;
    else if (ef) historyTxt = `選択: ${ef.txt}`;
    else if (hi) historyTxt = `${hi.name} 案内放送`;
    else if (ids.length > 1) historyTxt = "Builder カスタム構成";

    addHistory(historyTxt);

    let i = 0;
    const next = () => {
        if (i < ids.length && isPlaying) {
            const track = String(ids[i]).padStart(3, '0');
            player.src = `audio/${track}.wav`;

            // 再生開始前に最新設定を適用
            player.volume = settings.volume / 100;
            player.playbackRate = settings.speed / 100;

            player.play().catch(e => {
                console.error("再生エラー:", track, e);
                i++; next();
            });
            player.onended = () => { i++; next(); };
        } else {
            isPlaying = false;
            if (onComplete) onComplete();
        }
    };
    next();
}

function stopBroadcast() {
    isPlaying = false;
    player.pause();
    player.currentTime = 0;
}

// --- Builder Logic ---
function updateBuilderDisplay() {
    const disp = document.getElementById('builderDisplay');
    if (!disp) return;
    disp.innerHTML = "";
    if (buildQueue.length === 0) {
        disp.innerText = "構成待ち...";
        disp.classList.add('is-empty');
        return;
    }
    disp.classList.remove('is-empty');
    buildQueue.forEach((item, index) => {
        const part = document.createElement('div');
        part.className = "build-segment";
        part.draggable = true;
        part.dataset.index = index;

        part.ondragstart = (e) => { e.dataTransfer.setData('text/plain', index); part.classList.add('dragging'); };
        part.ondragend = () => part.classList.remove('dragging');
        part.ondragover = (e) => { e.preventDefault(); part.classList.add('drag-over'); };
        part.ondragleave = () => part.classList.remove('drag-over');
        part.ondrop = (e) => {
            e.preventDefault(); part.classList.remove('drag-over');
            const fromIdx = parseInt(e.dataTransfer.getData('text/plain'));
            const toIdx = index;
            if (fromIdx !== toIdx) {
                const movedItem = buildQueue.splice(fromIdx, 1)[0];
                buildQueue.splice(toIdx, 0, movedItem);
                updateBuilderDisplay();
            }
        };

        const label = document.createElement('span');
        label.className = "segment-label";
        label.innerText = item.txt;

        const DBtn = document.createElement('button');
        DBtn.className = "segment-del";
        DBtn.innerHTML = "×";
        DBtn.onclick = (e) => { e.stopPropagation(); buildQueue.splice(index, 1); updateBuilderDisplay(); };

        part.append(label, DBtn);
        disp.appendChild(part);
    });
}

// --- Station Control ---
function updateTerminalSwitches() {
    let selectedIdx = -1;
    DB.HI.forEach((_, i) => {
        if (document.getElementById(`hi-term-${i}`)?.checked) selectedIdx = i;
    });
    DB.HI.forEach((st, i) => {
        const sw = document.getElementById(`hi-term-${i}`);
        if (sw && st.canBeTerm) sw.disabled = (selectedIdx !== -1 && selectedIdx !== i);
    });
    refreshActiveHI();
}

function toggleAllStops(value) {
    DB.HI.forEach((_, i) => {
        const sw = document.getElementById(`hi-stop-${i}`);
        if (sw) sw.checked = value;
    });
    refreshActiveHI();
}

function markPreviousStationsAsCompleted(currentIndex) {
    const stations = DB.HI.map((st, i) => ({ ...st, originalIndex: i }));
    if (hiDisplayOrder === -1) stations.reverse();

    for (const st of stations) {
        if (st.originalIndex === currentIndex) break;
        completedStations.add(st.originalIndex);
    }
}

function refreshActiveHI() {
    const list = document.getElementById('active-station-list');
    if (!list) return;
    list.innerHTML = "";

    const stations = DB.HI.map((st, i) => ({ ...st, originalIndex: i }));
    if (hiDisplayOrder === -1) stations.reverse();

    const nextTargetIndex = stations.find(st => !completedStations.has(st.originalIndex))?.originalIndex;

    stations.forEach((st) => {
        const i = st.originalIndex;

        // not: true の駅は完全に表示しない
        if (st.not) return;

        const isStopInput = document.getElementById(`hi-stop-${i}`);
        const isTermInput = document.getElementById(`hi-term-${i}`);
        const isStop = isStopInput ? isStopInput.checked : true; // Default to true (停車) if input not found
        const isTerm = isTermInput ? isTermInput.checked : false;

        const isActive = currentStatus.index === i;
        const isCompleted = completedStations.has(i);
        // 表示条件を厳密化: 停車設定でない駅は、案内中（isActive）でない限り絶対に表示しない
        if (!isStop && !isActive) return;

        const row = document.createElement('div');
        row.className = "station-row";
        if (!isStop) row.classList.add('is-passing');
        if (isTerm) row.classList.add('is-terminal');
        if (isCompleted) row.classList.add('is-completed');
        if (isActive) {
            row.classList.add('is-active');
            if (currentStatus.type === 'soon') row.classList.add('status-soon');
        }

        let statusBadge = "";
        if (isActive) {
            statusBadge = `<span class="status-badge">${currentStatus.type === 'next' ? '次は' : (isStop ? 'まもなく' : '通過中')}</span>`;
        } else if (isCompleted) {
            statusBadge = `<span class="pass-label">通過済み</span>`;
        }

        row.innerHTML = `
            <div class="st-name-area">
                ${statusBadge}
                <div class="st-name-main">
                    ${st.name}${isTerm ? '<span class="term-label">終点</span>' : ''}
                </div>
            </div>
        `;

        const btnGroup = document.createElement('div');
        btnGroup.className = "st-btn-group";

        const nBtn = document.createElement('button');
        nBtn.className = "btn-next"; nBtn.innerText = "Next";
        nBtn.onclick = () => {
            markPreviousStationsAsCompleted(i); // この駅より前を完了にする
            completedStations.delete(i);
            currentStatus = { index: i, type: 'next' };
            const track = (isTerm && st.terminalNext) ? st.terminalNext : st.next;
            playQueue([track]);
            refreshActiveHI();
        };

        const sBtn = document.createElement('button');
        sBtn.className = "btn-soon"; sBtn.innerText = "Soon";
        sBtn.onclick = () => {
            markPreviousStationsAsCompleted(i); // この駅より前を完了にする
            completedStations.delete(i);
            currentStatus = { index: i, type: 'soon' };
            let queue = [];
            if (isTerm) {
                queue.push((st.terminalSoon) ? st.terminalSoon : st.soon, "070", "071");
            } else {
                queue.push(st.soon);
            }
            refreshActiveHI();
            playQueue(queue); // 自動完了のコールバックを削除
        };
        btnGroup.append(nBtn, sBtn);
        row.appendChild(btnGroup);
        list.appendChild(row);
    });
}

function resetProgress() {
    completedStations.clear();
    currentStatus = { index: -1, type: null };
    refreshActiveHI();
}

// --- Main Init ---
document.addEventListener('DOMContentLoaded', () => {
    loadSettings();

    // 警告モーダル
    const modal = document.getElementById('warningModal');
    if (modal && !settings.skipWarning) {
        modal.classList.add('active');
        document.getElementById('modalConfirmBtn').onclick = () => modal.classList.remove('active');
    }

    // 設定表
    const hiBody = document.getElementById('station-master-body');
    if (hiBody) {
        DB.HI.forEach((st, i) => {
            const row = document.createElement('tr');

            if (st.not) {
                // not: true の場合、駅名のみ表示し、停車・終着列全体に横棒
                row.innerHTML = `<td style="font-weight:bold;">${st.name}</td>
                                 <td colspan="2" style="text-align:center; vertical-align:middle; padding: 0 8px;">
                                    <div style="width: 100%; height: 26px; background: rgba(255, 255, 255, 0.05); border-radius: 13px; display: flex; align-items: center; justify-content: center; color: rgba(255, 255, 255, 0.4); font-size: 11px; font-weight: 800;">—</div>
                                 </td>`;
            } else {
                // 通常の場合
                const stopHtml = `<label class="custom-chk"><input type="checkbox" id="hi-stop-${i}" onchange="refreshActiveHI()"><span class="checkmark stop-sw"></span></label>`;
                const termHtml = st.canBeTerm
                    ? `<label class="custom-chk"><input type="checkbox" id="hi-term-${i}" onchange="updateTerminalSwitches()"><span class="checkmark term-sw"></span></label>`
                    : `<span class="term-disabled-text">—</span>`;
                row.innerHTML = `<td style="font-weight:bold;">${st.name}</td>
                                 <td>${stopHtml}</td>
                                 <td>${termHtml}</td>`;
            }

            hiBody.appendChild(row);
        });
    }

    // Builderパーツ
    const createBtn = (id, data) => {
        const container = document.getElementById(id);
        if (container) {
            data.forEach(item => {
                const b = document.createElement('button'); b.innerText = item.txt;
                b.onclick = () => { buildQueue.push(item); updateBuilderDisplay(); };
                container.appendChild(b);
            });
        }
    };
    createBtn('builder-stations', DB.STATIONS);
    createBtn('builder-train-info', DB.TRAIN_INFO);

    // 選択放送
    const efList = document.getElementById('ef-immediate-list');
    if (efList) {
        DB.EF.forEach(item => {
            const b = document.createElement('button'); b.innerText = item.txt;
            b.onclick = () => playQueue([item.id]);
            efList.appendChild(b);
        });
    }

    // Builder controls
    document.getElementById('playBtn').onclick = () => buildQueue.length && playQueue(buildQueue.map(i => i.id));
    document.getElementById('clearBtn').onclick = () => { buildQueue = []; updateBuilderDisplay(); };
    document.getElementById('stopBtn').onclick = () => stopBroadcast();

    // Sort logic
    const sortBtn = document.getElementById('sortOrderBtn');
    if (sortBtn) {
        sortBtn.onclick = () => {
            hiDisplayOrder *= -1;
            sortBtn.innerText = hiDisplayOrder === 1 ? '⇅ 昇順' : '⇅ 降順';
            refreshActiveHI();
        };
    }

    // Resize logic (Mouse & Touch)
    const handle = document.getElementById('resizeHandle');
    const builderCard = document.getElementById('builderCard');
    if (handle && builderCard) {
        let isResizing = false;

        const startResize = (e) => {
            isResizing = true;
            document.body.style.cursor = 'row-resize';
            e.preventDefault();
        };

        const doResize = (e) => {
            if (!isResizing) return;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            const mainRect = document.querySelector('.main-sections').getBoundingClientRect();
            let newHeight = Math.max(80, Math.min(mainRect.height - 100, clientY - mainRect.top));
            builderCard.style.height = newHeight + 'px';
            builderCard.style.flex = 'none';
        };

        const stopResize = () => {
            if (isResizing) {
                isResizing = false;
                document.body.style.cursor = '';
            }
        };

        handle.addEventListener('mousedown', startResize);
        handle.addEventListener('touchstart', startResize, { passive: false });

        document.addEventListener('mousemove', doResize);
        document.addEventListener('touchmove', doResize, { passive: false });

        document.addEventListener('mouseup', stopResize);
        document.addEventListener('touchend', stopResize);
    }

    // UI Toggle
    const uiToggleBtn = document.getElementById('ui-toggle-btn');
    if (uiToggleBtn) {
        uiToggleBtn.onclick = () => {
            document.body.classList.toggle('ui-hidden');
            uiToggleBtn.classList.toggle('hidden-mode');
            uiToggleBtn.innerHTML = document.body.classList.contains('ui-hidden')
                ? '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>'
                : '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>';
        };
    }

    // --- Settings UI control ---
    const settingsBtn = document.getElementById('settings-btn');
    const settingsModal = document.getElementById('settingsModal');
    const settingsCloseBtn = document.getElementById('settingsCloseBtn');

    if (settingsBtn) settingsBtn.onclick = () => settingsModal.classList.add('active');
    if (settingsCloseBtn) settingsCloseBtn.onclick = () => settingsModal.classList.remove('active');

    // モーダル外側クリックで閉じる
    if (settingsModal) {
        settingsModal.onclick = (e) => {
            if (e.target === settingsModal) {
                settingsModal.classList.remove('active');
            }
        };
    }

    // Settings sidebar navigation
    const navItems = document.querySelectorAll('.settings-nav-item');
    const categories = document.querySelectorAll('.settings-category');

    navItems.forEach(navItem => {
        navItem.addEventListener('click', () => {
            const targetCategory = navItem.dataset.category;

            // Update active nav item
            navItems.forEach(item => item.classList.remove('active'));
            navItem.classList.add('active');

            // Update Toolbar Title
            const titleEl = document.getElementById('settings-current-title');
            const navText = navItem.querySelector('span').innerText;
            if (titleEl) titleEl.innerText = navText;

            // Update active category
            categories.forEach(category => {
                if (category.dataset.category === targetCategory) {
                    category.classList.add('active');
                } else {
                    category.classList.remove('active');
                }
            });

            // Mobile Navigation Logic
            const container = document.querySelector('.settings-container');
            const backBtn = document.querySelector('.nav-btn.back');
            if (window.innerWidth <= 768) {
                container.classList.add('show-content');
                if (backBtn) {
                    backBtn.disabled = false;

                    // Add click listener if not already added (simple check)
                    if (!backBtn.dataset.hasListener) {
                        backBtn.addEventListener('click', () => {
                            container.classList.remove('show-content');
                            backBtn.disabled = true;
                        });
                        backBtn.dataset.hasListener = 'true';
                    }
                }
            }
        });
    });

    // Theme opts
    const themeCards = document.querySelectorAll('.theme-card');
    themeCards.forEach(card => {
        card.onclick = () => {
            settings.theme = card.dataset.value;
            saveSettings();
            applySettings();

            // Update UI
            themeCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
        };
    });

    // Initial Active State
    const currentThemeCard = document.querySelector(`.theme-card[data-value="${settings.theme}"]`);
    if (currentThemeCard) {
        currentThemeCard.classList.add('active');
    }

    // Mediamatch listener
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        if (settings.theme === 'auto') applySettings();
    });

    // Volume
    const volRange = document.getElementById('volume-range');
    if (volRange) {
        volRange.oninput = () => {
            settings.volume = parseInt(volRange.value);
            updateSliderFill(volRange);
            saveSettings();
            applySettings();
        };
    }

    // Speed
    const speedRange = document.getElementById('speed-range');
    if (speedRange) {
        speedRange.oninput = () => {
            settings.speed = parseInt(speedRange.value);
            updateSliderFill(speedRange);
            saveSettings();
            applySettings();
        };
    }

    // Skip warning
    const skipCheck = document.getElementById('skip-warning-check');
    if (skipCheck) {
        skipCheck.onchange = () => {
            settings.skipWarning = skipCheck.checked;
            saveSettings();
        };
    }

    // Fullscreen toggle
    const fsCheck = document.getElementById('fullscreen-check');
    if (fsCheck) {
        fsCheck.onchange = () => {
            settings.fullscreen = fsCheck.checked;
            if (settings.fullscreen) {
                if (!document.fullscreenElement) {
                    document.documentElement.requestFullscreen().catch(err => {
                        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
                    });
                }
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                }
            }
            saveSettings();
        };
    }

    // Reduce animations toggle
    const raCheck = document.getElementById('reduce-anim-check');
    if (raCheck) {
        raCheck.onchange = () => {
            settings.reduceAnim = raCheck.checked;
            document.body.classList.toggle('reduce-animations', settings.reduceAnim);
            saveSettings();
        };
    }

    // Reset
    const resetBtn = document.getElementById('reset-settings-btn');
    if (resetBtn) {
        resetBtn.onclick = () => {
            if (confirm('すべての設定を初期状態に戻しますか?')) {
                localStorage.removeItem(SETTINGS_KEY);
                location.reload();
            }
        };
    }

    // Clear History
    const clearHistoryBtn = document.getElementById('clear-history-btn');
    if (clearHistoryBtn) {
        clearHistoryBtn.onclick = () => {
            if (settings.history.length > 0 && confirm('すべての放送履歴を削除しますか?')) {
                settings.history = [];
                saveSettings();
                updateHistoryUI();
            }
        };
    }

    // Clock
    setInterval(() => {
        const clockEl = document.getElementById('clock');
        if (clockEl) clockEl.innerText = new Date().toLocaleTimeString('ja-JP', { hour12: false });
    }, 1000);

    // Initial render
    refreshActiveHI();
    updateBuilderDisplay();

    // LCD Font Scaling
    const lcdObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
            const height = entry.contentRect.height;
            const disp = entry.target;
            // 構成待ち状態（is-empty）の時だけ大きくスケール
            if (disp.classList.contains('is-empty')) {
                disp.style.fontSize = '14px'; // Consistent size for empty state
            } else {
                disp.style.fontSize = ''; // Reset to CSS default for segments
            }
        }
    });
    const lcdMonitor = document.getElementById('builderDisplay');
    if (lcdMonitor) lcdObserver.observe(lcdMonitor);

    // 背景パララックス
    document.addEventListener('mousemove', (e) => {
        const bg = document.querySelector('.bg-image-layer');
        if (!bg) return;
        const x = (e.clientX / window.innerWidth - 0.5) * 20; // 20px range
        const y = (e.clientY / window.innerHeight - 0.5) * 20;
        bg.style.transform = `translate(${-x}px, ${-y}px)`;
    });
    // Mobile Warning Close
    const warningCloseBtn = document.getElementById('mobile-warning-close');
    const warningEl = document.getElementById('mobile-warning');

    if (warningCloseBtn && warningEl) {
        warningCloseBtn.addEventListener('click', () => {
            warningEl.style.opacity = '0';
            warningEl.style.transform = 'translateY(20px)';
            setTimeout(() => {
                warningEl.style.display = 'none';
            }, 300);
        });
    }
});
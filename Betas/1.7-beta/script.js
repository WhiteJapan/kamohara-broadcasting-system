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
        { id: "030", txt: "名取り" },
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
        { id: "012", txt: "名取り行き" },
        { id: "013", txt: "山栄行き" },
        { id: "014", txt: "です" },
        { id: "015", txt: "途中の停車..." },
        { id: "016", txt: "終点..." },
        { id: "017", txt: "の順に停車..." },
        { id: "017", txt: "各駅に停車" }
    ],
    HI: [
        { name: "三田", next: "034", soon: "035", canBeTerm: true },
        { name: "横河", next: "036", soon: "037", canBeTerm: false },
        { name: "荒川", next: "038", soon: "039", canBeTerm: false },
        { name: "長町", next: "040", soon: "041", canBeTerm: true, terminalNext: "042", terminalSoon: "043" },
        { name: "立町", next: "044", soon: "045", canBeTerm: false },
        { name: "長塚", next: "046", soon: "047", canBeTerm: true, terminalNext: "048", terminalSoon: "049" },
        { name: "松山", next: "050", soon: "051", canBeTerm: false },
        { name: "陸前今庄", next: "052", soon: "053", canBeTerm: true, terminalNext: "054", terminalSoon: "055" },
        { name: "今庄ランド前", next: "056", soon: "057", canBeTerm: false },
        { name: "東名取", next: "058", soon: "059", canBeTerm: false },
        { name: "名とり", next: "060", soon: "061", canBeTerm: true, terminalNext: "062", terminalSoon: "063" },
        { name: "南流山", next: "064", soon: "065", canBeTerm: false },
        { name: "岩富", next: "066", soon: "067", canBeTerm: false },
        { name: "山栄", next: "068", soon: "069", canBeTerm: true }
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

let buildQueue = [];
let hiDisplayOrder = 1; // 1: 昇順, -1: 降順
let isPlaying = false;
const player = new Audio();

// 再生ロジック (確実に3桁のファイル名にする)
function playQueue(ids) {
    if (isPlaying) { player.pause(); player.currentTime = 0; }
    isPlaying = true;
    let i = 0;
    const next = () => {
        if (i < ids.length && isPlaying) {
            const track = String(ids[i]).padStart(3, '0');
            player.src = `audio/${track}.wav`;
            player.play().catch(e => { console.error("再生エラー:", track); i++; next(); });
            player.onended = () => { i++; next(); };
        } else {
            isPlaying = false;
        }
    };
    next();
}

function stopBroadcast() {
    isPlaying = false;
    player.pause();
    player.currentTime = 0;
}

// 順序を入れ替える
function movePart(index, direction) {
    const newIndex = index + direction;
    if (newIndex >= 0 && newIndex < buildQueue.length) {
        const temp = buildQueue[index];
        buildQueue[index] = buildQueue[newIndex];
        buildQueue[newIndex] = temp;
        updateBuilderDisplay();
    }
}

// 構成パーツを個別に削除
function removePart(index) {
    buildQueue.splice(index, 1);
    updateBuilderDisplay();
}

// 画面上の表示更新（ドラッグ＆ドロップ対応、矢印ボタン廃止）
function updateBuilderDisplay() {
    const disp = document.getElementById('builderDisplay');
    disp.innerHTML = "";
    if (buildQueue.length === 0) {
        disp.innerText = "構成待ち...";
        return;
    }
    buildQueue.forEach((item, index) => {
        const part = document.createElement('div');
        part.className = "build-segment";
        part.draggable = true;
        part.dataset.index = index;

        // ドラッグイベント
        part.ondragstart = (e) => {
            e.dataTransfer.setData('text/plain', index);
            part.classList.add('dragging');
        };
        part.ondragend = () => part.classList.remove('dragging');
        part.ondragover = (e) => {
            e.preventDefault();
            part.classList.add('drag-over');
        };
        part.ondragleave = () => part.classList.remove('drag-over');
        part.ondrop = (e) => {
            e.preventDefault();
            part.classList.remove('drag-over');
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
        DBtn.title = "削除";
        DBtn.onclick = (e) => { e.stopPropagation(); removePart(index); };

        part.append(label, DBtn);
        disp.appendChild(part);
    });
}

// 終着スイッチの排他制御
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

// 実行リストの生成
function refreshActiveHI() {
    const list = document.getElementById('active-station-list');
    list.innerHTML = "";

    const stations = DB.HI.map((st, i) => ({ ...st, originalIndex: i }));
    if (hiDisplayOrder === -1) stations.reverse();

    stations.forEach((st) => {
        const i = st.originalIndex;
        const isStop = document.getElementById(`hi-stop-${i}`).checked;
        const isTerm = document.getElementById(`hi-term-${i}`)?.checked;
        if (isStop) {
            const row = document.createElement('div');
            row.className = "station-row";
            if (isTerm) row.style.borderLeft = "6px solid #ef4444";

            const nameArea = document.createElement('div');
            nameArea.className = "st-name-area";
            nameArea.innerHTML = `${st.name}${isTerm ? '<span class="term-label" style="font-size:10px; margin-left:8px; opacity:0.7;">終点</span>' : ''}`;

            const btnGroup = document.createElement('div');
            btnGroup.className = "st-btn-group";

            const nBtn = document.createElement('button');
            nBtn.className = "btn-next"; nBtn.innerText = "Next";
            nBtn.onclick = () => {
                const track = (isTerm && st.terminalNext) ? st.terminalNext : st.next;
                playQueue([track]);
            };

            const sBtn = document.createElement('button');
            sBtn.className = "btn-soon"; sBtn.innerText = "Soon";
            sBtn.onclick = () => {
                let queue = [];
                if (isTerm) {
                    if (st.terminalSoon) queue.push(st.terminalSoon);
                    else queue.push(st.soon);
                    queue.push("070", "071");
                } else {
                    queue.push(st.soon);
                }
                playQueue(queue);
            };

            btnGroup.append(nBtn, sBtn);
            row.append(nameArea, btnGroup);
            list.appendChild(row);
        }
    });
}

// 初期化
document.addEventListener('DOMContentLoaded', () => {
    // 警告モーダルの表示
    const modal = document.getElementById('warningModal');
    if (modal) {
        modal.classList.add('active');
        document.getElementById('modalConfirmBtn').onclick = () => modal.classList.remove('active');
    }

    // 設定表の生成
    const hiBody = document.getElementById('station-master-body');
    DB.HI.forEach((st, i) => {
        const termHtml = st.canBeTerm
            ? `<label class="custom-chk"><input type="checkbox" id="hi-term-${i}" onchange="updateTerminalSwitches()"><span class="checkmark term-sw"></span></label>`
            : `<span class="term-disabled-text">不可</span>`;
        const row = document.createElement('tr');
        row.innerHTML = `<td><label class="custom-chk"><input type="checkbox" id="hi-stop-${i}" onchange="refreshActiveHI()"><span class="checkmark stop-sw"></span></label></td>
                         <td style="font-weight:bold;">${st.name}</td><td>${termHtml}</td>`;
        hiBody.appendChild(row);
    });

    // Builderボタンの生成
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

    // EFボタンの生成
    const efList = document.getElementById('ef-immediate-list');
    if (efList) {
        DB.EF.forEach(item => {
            const b = document.createElement('button');
            b.innerText = item.txt;
            b.onclick = () => playQueue([item.id]);
            efList.appendChild(b);
        });
    }

    // 各種イベント
    const playBtn = document.getElementById('playBtn');
    if (playBtn) playBtn.onclick = () => buildQueue.length && playQueue(buildQueue.map(i => i.id));

    const clearBtn = document.getElementById('clearBtn');
    if (clearBtn) clearBtn.onclick = () => { buildQueue = []; updateBuilderDisplay(); };

    const stopBtn = document.getElementById('stopBtn');
    if (stopBtn) stopBtn.onclick = () => stopBroadcast();

    // 最小化トグル
    const minimizeBtn = document.getElementById('minimizeBtn');
    if (minimizeBtn) {
        minimizeBtn.onclick = () => {
            const card = document.getElementById('builderCard');
            card.classList.toggle('minimized');
        };
    }

    // 順序切替
    const sortBtn = document.getElementById('sortOrderBtn');
    if (sortBtn) {
        sortBtn.onclick = () => {
            hiDisplayOrder *= -1;
            sortBtn.innerText = hiDisplayOrder === 1 ? '⇅ 昇順' : '⇅ 降順';
            refreshActiveHI();
        };
    }

    // UI表示切替ボタンの制御
    const uiToggleBtn = document.getElementById('ui-toggle-btn');
    if (uiToggleBtn) {
        uiToggleBtn.onclick = () => {
            document.body.classList.toggle('ui-hidden');
            uiToggleBtn.classList.toggle('hidden-mode');

            // アイコンの切り替え (Eye / Eye-off)
            if (document.body.classList.contains('ui-hidden')) {
                uiToggleBtn.innerHTML = `
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5"
                        stroke-linecap="round" stroke-linejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>`;
            } else {
                uiToggleBtn.innerHTML = `
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5"
                        stroke-linecap="round" stroke-linejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                    </svg>`;
            }
        };
    }

    setInterval(() => { document.getElementById('clock').innerText = new Date().toLocaleTimeString(); }, 1000);
});
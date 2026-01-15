//  _  __    _    __  __  ___  _   _    _    ____     _    
// | |/ /   / \  |  \/  |/ _ \| | | |  / \  |  _ \   / \   
// | ' /   / _ \ | |\/| | | | | |_| | / _ \ | |_) | / _ \  
// |  <   / ___ \| |  | | |_| |  _  |/ ___ \|  _ < / ___ \ 
// |_|\_\|_|   \_\_|  |_|\___/|_| |_/_/   \_\_| \_\_/   \_\

const audioData = [
    { cat: "1.導入", name: "今日も鴨原電鉄をご利用...", file: "1.mp3" },
    { cat: "1.導入", name: "この電車は各駅停車", file: "2.mp3" },
    { cat: "1.導入", name: "この電車は快速", file: "3.mp3" },
    { cat: "1.導入", name: "この電車は区間快速", file: "4.mp3" },
    { cat: "1.導入", name: "次は", file: "25.mp3" },
    { cat: "1.導入", name: "まもなく", file: "26.mp3" },
    { cat: "1.導入", name: "発車までしばらくお待ち...", file: "24.mp3" },
    { cat: "2.駅名", name: "三田", file: "7.mp3" },
    { cat: "2.駅名", name: "横河", file: "8.mp3" },
    { cat: "2.駅名", name: "荒川", file: "9.mp3" },
    { cat: "2.駅名", name: "長町", file: "10.mp3" },
    { cat: "2.駅名", name: "立町", file: "11.mp3" },
    { cat: "2.駅名", name: "長塚", file: "12.mp3" },
    { cat: "2.駅名", name: "松山", file: "13.mp3" },
    { cat: "2.駅名", name: "陸前今庄", file: "14.mp3" },
    { cat: "2.駅名", name: "今庄ランド前", file: "15.mp3" },
    { cat: "2.駅名", name: "東名取", file: "16.mp3" },
    { cat: "2.駅名", name: "名取", file: "17.mp3" },
    { cat: "2.駅名", name: "南流山", file: "18.mp3" },
    { cat: "2.駅名", name: "岩富", file: "19.mp3" },
    { cat: "2.駅名", name: "山栄", file: "20.mp3" },
    { cat: "3.案内", name: "行きです", file: "5.mp3" },
    { cat: "3.案内", name: "途中の停車駅は", file: "6.mp3" },
    { cat: "3.案内", name: "終点", file: "21.mp3" },
    { cat: "3.案内", name: "の順に停車いたします", file: "22.mp3" },
    { cat: "3.案内", name: "各駅に停車いたします", file: "23.mp3" },
    { cat: "3.案内", name: "です", file: "27.mp3" },
    { cat: "3.案内", name: "お出口は左側です", file: "31.mp3" },
    { cat: "3.案内", name: "お出口は右側です", file: "32.mp3" },
    { cat: "3.案内", name: "鴨原空港アクセス線は...", file: "29.mp3" },
    { cat: "3.案内", name: "ご乗車ありがとうございます", file: "28.mp3" },
    { cat: "3.案内", name: "今日もご利用くださいまして...", file: "30.mp3" },
    { cat: "3.案内", name: "ご乗車ありがとうございました", file: "33.mp3" }
];

let queue = [];
let isPlaying = false;
let currentAudio = null;

function init() {
    const container = document.getElementById('parts-container');
    const categories = [...new Set(audioData.map(d => d.cat))];
    
    categories.forEach(cat => {
        const box = document.createElement('div');
        box.className = 'category-box';
        box.innerHTML = `<div class="category-title">${cat}</div>`;
        audioData.filter(d => d.cat === cat).forEach(item => {
            const btn = document.createElement('button');
            btn.className = 'part-btn';
            btn.innerText = item.name;
            btn.onclick = () => { if(!isPlaying) { queue.push({...item, qid: Math.random()}); renderQueue(); } };
            box.appendChild(btn);
        });
        container.appendChild(box);
    });

    document.getElementById('playBtn').onclick = togglePlay;
    document.getElementById('undoBtn').onclick = () => { if(!isPlaying){ queue.pop(); renderQueue(); } };
    document.getElementById('clearBtn').onclick = () => { if(!isPlaying){ queue = []; renderQueue(); } };
}

function renderQueue() {
    const list = document.getElementById('queue-list');
    list.innerHTML = queue.length === 0 ? "パーツを選択してください..." : 
        queue.map(i => `<span class="queue-item">${i.name}</span>`).join('');
}

async function togglePlay() {
    if (isPlaying) {
        isPlaying = false;
        if (currentAudio) currentAudio.pause();
        resetBtn();
    } else {
        if (queue.length === 0) return;
        isPlaying = true;
        const btn = document.getElementById('playBtn');
        btn.innerText = "■ 停止"; btn.classList.add('stop');

        for (const item of queue) {
            if (!isPlaying) break;

            await new Promise(res => {
                const audio = new Audio(`sounds/${item.file}`);
                currentAudio = audio;

                // 残り0.15秒で次のパーツへ進む監視タイマー
                const checkEnd = setInterval(() => {
                    if (audio.duration && (audio.duration - audio.currentTime) <= 0.15) {
                        clearInterval(checkEnd);
                        res(); 
                    }
                }, 10);

                audio.onended = () => { clearInterval(checkEnd); res(); };
                audio.onerror = () => { clearInterval(checkEnd); res(); };

                // 再生開始
                audio.play().catch(e => { clearInterval(checkEnd); res(); });
            });
            // await setTimeoutは不要。Promiseが解決されたら即座に次のループへ。
        }
        // 全体の終了を少し待ってからボタンをリセット
        setTimeout(() => { if(!currentAudio || currentAudio.ended) resetBtn(); }, 500);
    }
}

function resetBtn() {
    const btn = document.getElementById('playBtn');
    btn.innerText = "▶ 放送再生"; btn.classList.remove('stop');
    isPlaying = false;
}

window.onload = init;
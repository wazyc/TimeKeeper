document.readyState === 'complete' ? init() : window.onload = init;

let mode = "stop";
let works;

let g;

function init() {

    let start_btn = document.getElementById("start_btn");
    let stop_btn = document.getElementById("stop_btn");
    let save_btn = document.getElementById("save_btn");
    let load_btn = document.getElementById("load_btn");

    works = Work("work", 15);

    // スタートボタン
    start_btn.addEventListener('click', start);
    // 停止ボタン
    stop_btn.addEventListener('click', stop);
    // タイマー
    document.getElementById("elapsed_time").value = 0;
    document.getElementById("elapsed_time").addEventListener('input', elapsed_time_changed);
    // セーブボタン
    save_btn.addEventListener('click', save);
    // ロードボタン
    load_btn.addEventListener('click', load);


    // let e = document.getElementById("debug");
    // g = new Gauge(e);


}

const setButton = document.getElementById('btn');
const titleInput = document.getElementById('title');

function mvScroll(rowNumber: number = null) {
    if (!rowNumber) {
        rowNumber = works.now_task_number;
    }

    const row_id = `tr_${rowNumber.toString()}`;
    const target = document.getElementById(row_id);
    // const targetOffsetTop = window.scrollY + target.getBoundingClientRect().top;

    target.scrollIntoView({
        // top: targetOffsetTop,
        behavior: 'smooth',
        block: 'center',
    });
}


// //////////////////////////////////////////////////////////////////////////////////////////////
// ヘッダーボタンのイベント
// //////////////////////////////////////////////////////////////////////////////////////////////

function start() {
    console.log("starting...");
    window.screen_api.setScreenSize(650, 160);
    mode = "start";
    document.getElementById("start_btn").disabled = true;
    document.getElementById("stop_btn").disabled = false;
    // document.getElementById("reset_btn").disabled = true;
    timeoutID = setTimeout(time_check, 1000);
    begin_dt = new Date();
}

function stop() {
    window.screen_api.setScreenSize(650, 650);
    mode = "stop";
    document.getElementById("start_btn").disabled = false;
    document.getElementById("stop_btn").disabled = true;
    // document.getElementById("reset_btn").disabled = false;
    clearTimeout(timeoutID);
    begin_dt = null;
}

function save() {
    const data = {
        title: document.getElementById("title_input").value,
        tasks: works.tasks
    }
    window.data_api.setStore("plan_1", data);
}

async function load() {
    const data = await window.data_api.getStore("plan_1");
    if (data.length === 0){return 0;}
    document.getElementById("title_input").value = data.title;
    works.tasks = data.tasks;
    works.refresh_display();
}

// //////////////////////////////////////////////////////////////////////////////////////////////
// タイマー処理
// //////////////////////////////////////////////////////////////////////////////////////////////
let timeoutID;
let begin_dt: Date; // タイムチェック間の時間差を計算するため。
let elapsed_time_ms = 0;

function time_check() {
    // console.log("timeCheck");

    if (begin_dt) {
        let now_dt = new Date();
        let diff_ms = now_dt.getTime() - begin_dt.getTime();
        elapsed_time_ms += diff_ms;
        begin_dt = now_dt;
    }
    works.elapsed_time = Math.floor(elapsed_time_ms / 1000 / 60);
    document.getElementById("elapsed_time").value = works.elapsed_time;
    works.refresh_display();
    mvScroll();

    // console.log(Math.floor(elapsed_time_ms/1000))

    timeoutID = setTimeout(time_check, 1000);
}

// //////////////////////////////////////////////////////////////////////////////////////////////
// 経過時間を手入力した場合の処理
// //////////////////////////////////////////////////////////////////////////////////////////////
function elapsed_time_changed() {

    let elapsed_time = Number(document.getElementById("elapsed_time").value);
    elapsed_time_ms = elapsed_time * 60 * 1000;

    if (elapsed_time > 999) {
        document.getElementById("elapsed_time").value = 999;
    }
    works.elapsed_time = elapsed_time;
    works.refresh_display();
}




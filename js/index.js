var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
document.readyState === 'complete' ? init() : window.onload = init;
var mode = "stop";
var works;
var g;
function init() {
    var start_btn = document.getElementById("start_btn");
    var stop_btn = document.getElementById("stop_btn");
    var save_btn = document.getElementById("save_btn");
    var load_btn = document.getElementById("load_btn");
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
var setButton = document.getElementById('btn');
var titleInput = document.getElementById('title');
function mvScroll(rowNumber) {
    if (rowNumber === void 0) { rowNumber = null; }
    if (!rowNumber) {
        rowNumber = works.now_task_number;
    }
    var row_id = "tr_".concat(rowNumber.toString());
    var target = document.getElementById(row_id);
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
    var data = {
        title: document.getElementById("title_input").value,
        tasks: works.tasks
    };
    window.data_api.setStore("plan_1", data);
}
function load() {
    return __awaiter(this, void 0, void 0, function () {
        var data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, window.data_api.getStore("plan_1")];
                case 1:
                    data = _a.sent();
                    if (data.length === 0) {
                        return [2 /*return*/, 0];
                    }
                    document.getElementById("title_input").value = data.title;
                    works.tasks = data.tasks;
                    works.refresh_display();
                    return [2 /*return*/];
            }
        });
    });
}
// //////////////////////////////////////////////////////////////////////////////////////////////
// タイマー処理
// //////////////////////////////////////////////////////////////////////////////////////////////
var timeoutID;
var begin_dt; // タイムチェック間の時間差を計算するため。
var elapsed_time_ms = 0;
function time_check() {
    // console.log("timeCheck");
    if (begin_dt) {
        var now_dt = new Date();
        var diff_ms = now_dt.getTime() - begin_dt.getTime();
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
    var elapsed_time = Number(document.getElementById("elapsed_time").value);
    elapsed_time_ms = elapsed_time * 60 * 1000;
    if (elapsed_time > 999) {
        document.getElementById("elapsed_time").value = 999;
    }
    works.elapsed_time = elapsed_time;
    works.refresh_display();
}

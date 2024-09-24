// //////////////////////////////////////////////////////////////////////////////////////////////
// Work
// //////////////////////////////////////////////////////////////////////////////////////////////
var Work = /** @class */ (function () {
    function Work(ele_id, task_count) {
        var _this = this;
        // 初期化処理 /////////////////////////////////////////////////////////
        // DOM
        this.generate_task_area = function () {
            // console.log("generate_task_area");
            var owner = document.getElementById(_this.owner_id);
            var tr;
            var td;
            var name_input;
            var time_input;
            var gauge;
            var div;
            var up_button;
            var down_button;
            var delete_button;
            var _loop_1 = function (i) {
                // 行追加
                tr = document.createElement("tr");
                setAttribute(tr, "id", "tr_".concat(i));
                addClass(tr, "task-row");
                owner.appendChild(tr);
                // 列追加（No.）
                td = document.createElement("td");
                setAttribute(td, "id", "number_col_".concat(i));
                addClass(td, "number-col");
                td.innerText = "".concat(i + 1);
                tr.appendChild(td);
                // 列追加（Name）
                td = document.createElement("td");
                setAttribute(td, "id", "name_col_".concat(i));
                addClass(td, "name-col");
                name_input = document.createElement("input");
                name_input.addEventListener("input", function () {
                    _this.task_changed(i);
                });
                setAttribute(name_input, "id", "text_input_".concat(i));
                addClass(name_input, "name-input");
                td.appendChild(name_input);
                tr.appendChild(td);
                // 列追加（Time）
                td = document.createElement("td");
                setAttribute(td, "id", "time_col_".concat(i));
                addClass(td, "time-col");
                time_input = document.createElement("input");
                time_input.addEventListener("input", function () {
                    _this.task_changed(i);
                });
                setAttribute(time_input, "id", "text_input_".concat(i));
                setAttribute(time_input, "type", "number");
                setAttribute(time_input, "min", "0");
                setAttribute(time_input, "max", "999");
                addClass(time_input, "time-input");
                td.appendChild(time_input);
                tr.appendChild(td);
                // 列追加（ゲージ）
                td = document.createElement("td");
                setAttribute(td, "id", "gauge_col_".concat(i));
                addClass(td, "gauge-col");
                div = document.createElement("div");
                setAttribute(div, "id", "gauge_".concat(i));
                setAttribute(div, "tabindex", "-1");
                addClass(div, "gauge");
                td.appendChild(div);
                gauge = new Gauge(div, {
                    min: 0,
                    max: 0,
                    value: 0,
                    target: 0,
                });
                tr.appendChild(td);
                // 列追加（ボタン）
                td = document.createElement("td");
                setAttribute(td, "id", "control_col_".concat(i));
                addClass(td, "control-col");
                // up
                up_button = document.createElement("button");
                setAttribute(up_button, "id", "up_button_".concat(i));
                setAttribute(up_button, "tabindex", "-1");
                addClass(up_button, "control-button");
                up_button.innerText = "▲";
                up_button.addEventListener("click", function () {
                    _this.up_click(i);
                });
                // down
                down_button = document.createElement("button");
                setAttribute(down_button, "id", "down_button_".concat(i));
                setAttribute(down_button, "tabindex", "-1");
                addClass(down_button, "control-button");
                down_button.innerText = "▼";
                down_button.addEventListener("click", function () {
                    _this.down_click(i);
                });
                // delete
                delete_button = document.createElement("button");
                setAttribute(delete_button, "id", "delete_button_".concat(i));
                setAttribute(delete_button, "tabindex", "-1");
                addClass(delete_button, "control-button");
                delete_button.innerText = "✕";
                delete_button.addEventListener("click", function () {
                    _this.delete_click(i);
                });
                td.appendChild(up_button);
                td.appendChild(down_button);
                td.appendChild(delete_button);
                tr.appendChild(td);
                _this.task_controls.push({
                    "name_input": name_input,
                    "time_input": time_input,
                    "gauge": gauge
                });
            };
            for (var i = 0; i < _this.task_count; i++) {
                _loop_1(i);
            }
        };
        // タスクデータ
        this.generate_task_data = function () {
            // console.log("generate_task_data");
            for (var i = 0; i < _this.task_count; i++) {
                _this.tasks.push(new Task());
            }
        };
        // コントロールボタンの動作 /////////////////////////////////////////////////////////
        this.up_click = function (i) {
            // console.log(`click up ${i}`);
            var task_index = i;
            if (task_index === 0) {
                return 0;
            }
            _this.tasks[task_index].task_number = task_index - 1;
            _this.moveAt(_this.tasks, task_index, task_index - 1);
            _this.refresh_display();
        };
        this.down_click = function (i) {
            // console.log(`click down ${i}`);
            var task_index = i;
            if (task_index === _this.task_count) {
                return 0;
            }
            _this.moveAt(_this.tasks, task_index, task_index + 1);
            _this.refresh_display();
        };
        this.delete_click = function (i) {
            // console.log(`click delete ${i}`);
            var task_index = i;
            _this.tasks[i] = new Task();
            _this.moveAt(_this.tasks, task_index, _this.tasks.length - 1);
            _this.refresh_display();
        };
        this.moveAt = function (array, index, at) {
            if (index === at || index > array.length - 1 || at > array.length - 1) {
                return array;
            }
            var value = array[index];
            var tail = array.slice(index + 1);
            array.splice(index);
            Array.prototype.push.apply(array, tail);
            array.splice(at, 0, value);
            return array;
        };
        // 表示処理 /////////////////////////////////////////////////////////
        // タスク名・時間が変更された時
        this.task_changed = function (task_number) {
            // console.log("task_changed", task_number, this.task_controls[task_number].name_input.value, Number(this.task_controls[task_number].time_input.value));
            _this.tasks[task_number].name = _this.task_controls[task_number].name_input.value;
            _this.tasks[task_number].time = Number(_this.task_controls[task_number].time_input.value);
            _this.refresh_display();
        };
        // 表示を更新
        this.refresh_display = function () {
            // タスクデータをもとに名前と時間を更新
            for (var i = 0; i < _this.task_count; i++) {
                _this.task_controls[i].name_input.value = _this.tasks[i].name;
                _this.task_controls[i].time_input.value = _this.tasks[i].time;
            }
            // ゲージを更新
            _this.refresh_gauge();
            // 現在進行中のタスク番号を取得
            _this.search_now_task_number();
            // 現在進行中のタスクのNo.を強調表示
            _this.highlight_now_task_number();
        };
        // ゲージの表示を更新
        this.refresh_gauge = function () {
            // 全ゲージの最大値を設定
            var gauge_max = 0;
            for (var i = 0; i < _this.task_count; i++) {
                if (gauge_max < _this.tasks[i].time) {
                    gauge_max = _this.tasks[i].time;
                }
            }
            var nokori = _this.elapsed_time;
            var gauge_val = 0;
            // this.now_task_number = 0;
            for (var i = 0; i < _this.task_count; i++) {
                if (nokori > _this.tasks[i].time) {
                    nokori = nokori - _this.tasks[i].time;
                    gauge_val = _this.tasks[i].time;
                }
                else {
                    gauge_val = nokori;
                    nokori = 0;
                }
                _this.task_controls[i].gauge.value = gauge_val;
                _this.task_controls[i].gauge.target = _this.tasks[i].time;
                _this.task_controls[i].gauge.max = gauge_max;
                _this.task_controls[i].gauge.refreshProgressBar();
            }
        };
        // 現在進行中のタスクナンバーを取得
        // refresh_gaugeのあとに実行すること
        this.search_now_task_number = function () {
            // 時間が設定されているタスクが一つもない場合は、最初のタスクを現在タスクとする
            var last_task = -1;
            for (var i = 0; i < _this.task_count; i++) {
                if (_this.tasks[i].time > 0) {
                    last_task = i;
                }
            }
            if (last_task === -1) {
                _this.now_task_number = 0;
                return 0;
            }
            // 現在タスクを探索
            _this.now_task_number = last_task;
            for (var i = _this.task_count - 1; i >= 0; i--) {
                if (_this.task_controls[i].gauge.value < _this.task_controls[i].gauge.target) {
                    _this.now_task_number = i;
                }
            }
        };
        // 現在進行中のタスクを強調表示
        this.highlight_now_task_number = function () {
            var number_ele;
            var progress_segment_one_ele;
            var progress_segment_two_ele;
            for (var i = 0; i < _this.task_count; i++) {
                number_ele = document.getElementById("number_col_".concat(i));
                progress_segment_one_ele = _this.task_controls[i].gauge.segment_one;
                progress_segment_two_ele = _this.task_controls[i].gauge.segment_two;
                if (i === _this.now_task_number) {
                    addClass(number_ele, "highlight-number");
                    addClass(progress_segment_one_ele, "progress-bar-striped");
                    addClass(progress_segment_one_ele, "progress-bar-animated");
                    addClass(progress_segment_two_ele, "bar-two_now");
                }
                else {
                    removeClass(number_ele, "highlight-number");
                    removeClass(progress_segment_one_ele, "progress-bar-striped");
                    removeClass(progress_segment_one_ele, "progress-bar-animated");
                    removeClass(progress_segment_two_ele, "bar-two_now");
                }
            }
        };
        // console.log("Work constructor");
        this.owner_id = ele_id;
        this.task_count = task_count;
        this.tasks = [];
        this.task_controls = [];
        this.generate_task_area();
        this.generate_task_data();
        this.elapsed_time = 0;
        this.now_task_number = 0;
        this.refresh_display();
        return this;
    }
    return Work;
}());
// //////////////////////////////////////////////////////////////////////////////////////////////
//　Task
// //////////////////////////////////////////////////////////////////////////////////////////////
var Task = /** @class */ (function () {
    function Task() {
        // console.log("Task constructor");
        this.name = "";
        this.time = 0;
        return this;
    }
    return Task;
}());
var Gauge = /** @class */ (function () {
    function Gauge(host_ele, options) {
        var _this = this;
        this.generateGauge = function () {
            addClass(_this.host_element, "progress");
            // 進捗バー
            _this.segment_one = document.createElement("div");
            addClass(_this.segment_one, "progress-bar");
            addClass(_this.segment_one, "bar-one");
            _this.segment_one.style.width = "0%";
            _this.host_element.appendChild(_this.segment_one);
            // 割り当て時間バー
            _this.segment_two = document.createElement("div");
            addClass(_this.segment_two, "progress-bar");
            addClass(_this.segment_two, "bar-two");
            _this.segment_two.style.width = "0%";
            _this.host_element.appendChild(_this.segment_two);
        };
        this.refreshProgressBar = function () {
            var segment_one_percent = _this.max === 0 ? 0 : Math.floor((_this.value / _this.max) * 100);
            var segment_two_percent = _this.max === 0 ? 0 : Math.floor((_this.target / _this.max) * 100) - segment_one_percent;
            _this.segment_one.style.width = segment_one_percent.toString() + "%";
            _this.segment_two.style.width = segment_two_percent.toString() + "%";
        };
        this.host_element = host_ele;
        if (options) {
            this.min = 'min' in options ? options.min : 0;
            this.max = 'max' in options ? options.max : 100;
            this.value = 'value' in options ? options.value : 0;
            this.target = 'target' in options ? options.target : 100;
        }
        else {
            this.min = 0;
            this.max = 100;
            this.value = 0;
            this.target = 100;
        }
        this.generateGauge();
        return this;
    }
    return Gauge;
}());
// //////////////////////////////////////////////////////////////////////////////////////////////
//　util
// //////////////////////////////////////////////////////////////////////////////////////////////
function setAttribute(e, name, value) {
    e.setAttribute(name, value);
}
function hasClass(e, className) {
    return e.classList.contains(className);
}
function addClass(e, className) {
    if (!hasClass(e, className)) {
        e.classList.add(className);
    }
}
function removeClass(e, className) {
    e.classList.remove(className);
}

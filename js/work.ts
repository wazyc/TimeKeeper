
// //////////////////////////////////////////////////////////////////////////////////////////////
// Work
// //////////////////////////////////////////////////////////////////////////////////////////////
class Work {
    private readonly task_count: number;
    private readonly owner_id: string;
    private readonly tasks: any[];
    private task_controls: any[];
    public elapsed_time: number;
    public now_task_number: number;

    constructor(ele_id: string, task_count: number) {
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

    // 初期化処理 /////////////////////////////////////////////////////////
    // DOM
    public generate_task_area = () => {
        // console.log("generate_task_area");

        let owner = document.getElementById(this.owner_id);

        let tr;
        let td;
        let name_input;
        let time_input;
        let gauge;
        let div;
        let up_button;
        let down_button;
        let delete_button;

        for (let i = 0; i < this.task_count; i++) {
            // 行追加
            tr = document.createElement("tr");
            setAttribute(tr, "id", `tr_${i}`);
            addClass(tr, "task-row");
            owner.appendChild(tr);

            // 列追加（No.）
            td = document.createElement("td");
            setAttribute(td, "id", `number_col_${i}`);
            addClass(td, "number-col");
            td.innerText = `${i + 1}`;
            tr.appendChild(td);

            // 列追加（Name）
            td = document.createElement("td");
            setAttribute(td, "id", `name_col_${i}`);
            addClass(td, "name-col");
            name_input = document.createElement("input");
            name_input.addEventListener("input", () => {
                this.task_changed(i);
            });
            setAttribute(name_input, "id", `text_input_${i}`);
            addClass(name_input, "name-input");
            td.appendChild(name_input);
            tr.appendChild(td);

            // 列追加（Time）
            td = document.createElement("td");
            setAttribute(td, "id", `time_col_${i}`);
            addClass(td, "time-col");
            time_input = document.createElement("input");
            time_input.addEventListener("input", () => {
                this.task_changed(i);
            });
            setAttribute(time_input, "id", `text_input_${i}`);
            setAttribute(time_input, "type", `number`);
            setAttribute(time_input, "min", `0`);
            setAttribute(time_input, "max", `999`);
            addClass(time_input, "time-input");
            td.appendChild(time_input);
            tr.appendChild(td);

            // 列追加（ゲージ）
            td = document.createElement("td");
            setAttribute(td, "id", `gauge_col_${i}`);
            addClass(td, "gauge-col");
            div = document.createElement("div");
            setAttribute(div, "id", `gauge_${i}`);
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
            setAttribute(td, "id", `control_col_${i}`);
            addClass(td, "control-col");
            // up
            up_button = document.createElement("button");
            setAttribute(up_button, "id", `up_button_${i}`);
            setAttribute(up_button, "tabindex", "-1");
            addClass(up_button, "control-button");
            up_button.innerText = "▲";
            up_button.addEventListener("click", () => {
                this.up_click(i);
            });
            // down
            down_button = document.createElement("button");
            setAttribute(down_button, "id", `down_button_${i}`);
            setAttribute(down_button, "tabindex", "-1");
            addClass(down_button, "control-button");
            down_button.innerText = "▼";
            down_button.addEventListener("click", () => {
                this.down_click(i);
            });
            // delete
            delete_button = document.createElement("button");
            setAttribute(delete_button, "id", `delete_button_${i}`);
            setAttribute(delete_button, "tabindex", "-1");
            addClass(delete_button, "control-button");
            delete_button.innerText = "✕";
            delete_button.addEventListener("click", () => {
                this.delete_click(i);
            });

            td.appendChild(up_button);
            td.appendChild(down_button);
            td.appendChild(delete_button);
            tr.appendChild(td);

            this.task_controls.push(
                {
                    "name_input": name_input,
                    "time_input": time_input,
                    "gauge": gauge
                }
            );
        }
    }

    // タスクデータ
    public generate_task_data = () => {
        // console.log("generate_task_data");
        for (let i = 0; i < this.task_count; i++) {
            this.tasks.push(new Task());
        }
    }

    // コントロールボタンの動作 /////////////////////////////////////////////////////////
    public up_click = (i: number) => {
        // console.log(`click up ${i}`);
        let task_index = i;
        if (task_index === 0) {
            return 0;
        }
        this.tasks[task_index].task_number = task_index - 1;
        this.moveAt(this.tasks, task_index, task_index - 1);
        this.refresh_display();
    }
    public down_click = (i: number) => {
        // console.log(`click down ${i}`);
        let task_index = i;
        if (task_index === this.task_count) {
            return 0;
        }
        this.moveAt(this.tasks, task_index, task_index + 1);
        this.refresh_display();
    }
    public delete_click = (i: number) => {
        // console.log(`click delete ${i}`);
        let task_index = i;
        this.tasks[i] = new Task();
        this.moveAt(this.tasks, task_index, this.tasks.length - 1);
        this.refresh_display();
    }
    private moveAt = (array: any[], index: number, at: number) => {
        if (index === at || index > array.length - 1 || at > array.length - 1) {
            return array;
        }
        const value = array[index];
        const tail = array.slice(index + 1);
        array.splice(index);
        Array.prototype.push.apply(array, tail);
        array.splice(at, 0, value);
        return array;
    }

    // 表示処理 /////////////////////////////////////////////////////////
    // タスク名・時間が変更された時
    public task_changed = (task_number: number) => {
        // console.log("task_changed", task_number, this.task_controls[task_number].name_input.value, Number(this.task_controls[task_number].time_input.value));
        this.tasks[task_number].name = this.task_controls[task_number].name_input.value;
        this.tasks[task_number].time = Number(this.task_controls[task_number].time_input.value);
        this.refresh_display();
    }

    // 表示を更新
    public refresh_display = () => {
        // タスクデータをもとに名前と時間を更新
        for (let i = 0; i < this.task_count; i++) {
            this.task_controls[i].name_input.value = this.tasks[i].name;
            this.task_controls[i].time_input.value = this.tasks[i].time;
        }
        // ゲージを更新
        this.refresh_gauge();

        // 現在進行中のタスク番号を取得
        this.search_now_task_number();

        // 現在進行中のタスクのNo.を強調表示
        this.highlight_now_task_number();
    }

    // ゲージの表示を更新
    public refresh_gauge = () => {
        // 全ゲージの最大値を設定
        let gauge_max = 0;
        for (let i = 0; i < this.task_count; i++) {
            if (gauge_max < this.tasks[i].time) {
                gauge_max = this.tasks[i].time;
            }
        }

        let nokori = this.elapsed_time;
        let gauge_val = 0;
        // this.now_task_number = 0;
        for (let i = 0; i < this.task_count; i++) {
            if (nokori > this.tasks[i].time) {
                nokori = nokori - this.tasks[i].time;
                gauge_val = this.tasks[i].time;
            } else {
                gauge_val = nokori;
                nokori = 0;
            }

            this.task_controls[i].gauge.value = gauge_val;
            this.task_controls[i].gauge.target = this.tasks[i].time;
            this.task_controls[i].gauge.max = gauge_max;
            this.task_controls[i].gauge.refreshProgressBar();
        }
    }

    // 現在進行中のタスクナンバーを取得
    // refresh_gaugeのあとに実行すること
    public search_now_task_number = () => {
        // 時間が設定されているタスクが一つもない場合は、最初のタスクを現在タスクとする
        let last_task = -1;
        for (let i = 0; i < this.task_count; i++) {
            if (this.tasks[i].time > 0) {
                last_task = i;
            }
        }
        if (last_task === -1) {
            this.now_task_number = 0;
            return 0;
        }
        // 現在タスクを探索
        this.now_task_number = last_task;
        for (let i = this.task_count - 1; i >= 0; i--) {
            if (this.task_controls[i].gauge.value < this.task_controls[i].gauge.target) {
                this.now_task_number = i;
            }
        }
    }

    // 現在進行中のタスクを強調表示
    private highlight_now_task_number = () => {
        let number_ele: HTMLElement;
        let progress_segment_one_ele: HTMLElement;
        let progress_segment_two_ele: HTMLElement;
        for (let i = 0; i < this.task_count; i++) {
            number_ele = document.getElementById(`number_col_${i}`);
            progress_segment_one_ele = this.task_controls[i].gauge.segment_one;
            progress_segment_two_ele = this.task_controls[i].gauge.segment_two;
            if (i === this.now_task_number) {
                addClass(number_ele, "highlight-number");
                addClass(progress_segment_one_ele, "progress-bar-striped");
                addClass(progress_segment_one_ele, "progress-bar-animated");
                addClass(progress_segment_two_ele, "bar-two_now");
            } else {
                removeClass(number_ele, "highlight-number");
                removeClass(progress_segment_one_ele, "progress-bar-striped");
                removeClass(progress_segment_one_ele, "progress-bar-animated");
                removeClass(progress_segment_two_ele, "bar-two_now");
            }
        }
    }

}

// //////////////////////////////////////////////////////////////////////////////////////////////
//　Task
// //////////////////////////////////////////////////////////////////////////////////////////////
class Task {
    public name: string;
    public time: number;

    constructor() {
        // console.log("Task constructor");
        this.name = "";
        this.time = 0;
        return this;
    }
}

// //////////////////////////////////////////////////////////////////////////////////////////////
//　Gauge
// //////////////////////////////////////////////////////////////////////////////////////////////
interface gauge_options {
    min?: number,
    max?: number,
    value?: number,
    target?: number
}

class Gauge {
    private host_element: Element;
    private segment_one: HTMLDivElement;
    private segment_two: HTMLDivElement;
    private min: number;
    private max: number;
    private value: number;
    private target: number;

    constructor(host_ele: Element, options: gauge_options | undefined) {
        this.host_element = host_ele;
        if (options) {
            this.min = 'min' in options ? options.min : 0;
            this.max = 'max' in options ? options.max : 100;
            this.value = 'value' in options ? options.value : 0;
            this.target = 'target' in options ? options.target : 100;
        } else {
            this.min = 0;
            this.max = 100;
            this.value = 0;
            this.target = 100;
        }
        this.generateGauge();
        return this;
    }

    private generateGauge = () => {
        addClass(this.host_element, "progress");
        // 進捗バー
        this.segment_one = document.createElement("div");
        addClass(this.segment_one, "progress-bar");
        addClass(this.segment_one, "bar-one");
        this.segment_one.style.width = "0%";
        this.host_element.appendChild(this.segment_one);
        // 割り当て時間バー
        this.segment_two = document.createElement("div");
        addClass(this.segment_two, "progress-bar");
        addClass(this.segment_two, "bar-two");
        this.segment_two.style.width = "0%";
        this.host_element.appendChild(this.segment_two);
    }

    public refreshProgressBar = () => {
        const segment_one_percent = this.max === 0 ? 0 : Math.floor((this.value / this.max) * 100);
        const segment_two_percent = this.max === 0 ? 0 : Math.floor((this.target / this.max) * 100) - segment_one_percent;

        this.segment_one.style.width = segment_one_percent.toString() + "%";
        this.segment_two.style.width = segment_two_percent.toString() + "%";
    }

}


// //////////////////////////////////////////////////////////////////////////////////////////////
//　util
// //////////////////////////////////////////////////////////////////////////////////////////////
function setAttribute(e: Element, name: string, value?: any): void {
    e.setAttribute(name, value);
}

function hasClass(e: Element, className: string): boolean {
    return e.classList.contains(className);
}

function addClass(e: Element, className: string): void {
    if (!hasClass(e, className)) {
        e.classList.add(className);
    }
}

function removeClass(e: Element, className: string): void {
    e.classList.remove(className);
}


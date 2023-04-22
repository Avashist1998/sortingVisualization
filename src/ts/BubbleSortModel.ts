import { SortingView } from "./SortingView";
import BaseSortingModel, { DataColorMap, SortData } from "./SortData";

class BubbleSortModel implements BaseSortingModel {
    data: SortData[];
    colors: DataColorMap;
    sorted: boolean;
    step: number;
    sortedIndex: number;
    needSwap: boolean;

    constructor(data: SortData[], color: DataColorMap) {
        this.step = 0;
        this.data = data;
        this.colors = color;
        this.sorted = false;
        this.sortedIndex = 0;
        this.needSwap = false;
    }

    next = () => {
        if (this.is_sorted()) {
            return
        }
        if (this.needSwap) {
            const tmp = this.data[this.step - 1]
            this.data[this.step - 1] = this.data[this.step]
            this.data[this.step] = tmp
            this.data[this.step - 1].color = this.colors.swap
            this.data[this.step].color = this.colors.selected;
            this.needSwap = false

        } else {
            for (let i = 0; i < this.sortedIndex; i++) {
                if (i === this.step) {
                    this.data[i].color = this.colors.selected;
                }
                else {
                    this.data[i].color = this.colors.base;
                }
            }

            if (this.step + 1 < this.data.length) {
                if (this.data[this.step + 1].value < this.data[this.step].value) {
                    this.data[this.step + 1].color = this.colors.swap;
                    this.needSwap = true
                }
            }
            if (this.sortedIndex === 0) {
                this.sorted = true
            }
            if (this.step === this.sortedIndex - 1) {
                this.step = -1
                this.sortedIndex -= 1
                this.data[this.sortedIndex].color = this.colors.sorted;
            }
            this.step += 1
        }
    }

    is_sorted = () => {
        return this.sorted
    }
}

export default BubbleSortModel

const tmpColor : DataColorMap = {
    base: "blue",
    swap: "red",
    sorted: "green",
    pivot: "orange",
    selected: "yellow"
}

let tmpData: SortData[] = []
for (let i = 0; i < 15; i++ )   {
    tmpData.push(
        {value: i, color: tmpColor.base} as SortData
    );
}

customElements.define('sorting-view', SortingView);
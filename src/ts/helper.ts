import type { SortData } from "./SortData"

export function validateData(userInput: string) {
    if (userInput.length === 0) {
        return false;
    } 
    else if(!(/ ?([0-9]* ?,)/.test(userInput))){
        return false;
    } else {
        const data = userInput.split(',');
        for (let val of data) {
            if (isNaN(Number(val))){
                return false;
            }
        }
        return true;
    }
}

export function convertData(userInput: string) {
    return  userInput.split(',').map(element => {
        return isNaN(Number(element)) ? 0 : Math.floor(Number(element));
    })
}

export function numberToSortData (nums: number[], color: string) {
    let data: SortData[] = []
    nums.map( (num, index) => {
        data.push({init_index: index, value: num, color: color} as SortData);
    })
    return data;
}



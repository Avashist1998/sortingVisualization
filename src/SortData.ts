
type SortData = {
    init_index: number
    value: number,
    color: string
}


type DataColorMap = {
    base: string,
    swap: string,
    pivot: string,
    sorted: string
    selected: string,
}

interface BaseSortingModel  {
    data: SortData[];
    colors: DataColorMap;
    next: () => void;
    is_sorted : () => boolean;
}

export type { SortData, DataColorMap };
export default BaseSortingModel;

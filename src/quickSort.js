
function initalizeQuickVar(numbers, id, baseColor, pivotColor, highLightColor, swapColor, sortedColor, height, width) {
    return {
        id: id,
        timer: null,
        paused: true,
        currSort: [],
        needSwap: 0,
        sortingStack: [],
        needToSortStack: [[0, numbers.length-1, numbers.length]],
        transitionTime: 250,
        freeRunTime: 250*1.2,
        step: 0, 
        sortedIndex: 0, 
        data: numberToSortData(numbers, baseColor), 
        sorted: false, 
        width: width,
        height: height,
        baseColor: baseColor,
        swapColor: swapColor,
        pivotColor: pivotColor,
        sortedColor: sortedColor,
        highLightColor: highLightColor,
        sortStep: quickSortStep,
        sortedUpdateUI: sortedUpdateButton
    }
}


function quickSwap(dataObject) {
    if (dataObject.needSwap === 1) {
        const tmp = dataObject.data[dataObject.currSort[0]];
        dataObject.data[dataObject.currSort[0]] = dataObject.data[dataObject.currSort[1]-1];
        dataObject.data[dataObject.currSort[1]-1] = dataObject.data[dataObject.currSort[1]];
        dataObject.data[dataObject.currSort[1]] = tmp
        dataObject.needSwap += 1
    }
    else {
        dataObject.data[dataObject.currSort[0]].color = dataObject.baseColor
        dataObject.data[dataObject.currSort[1]].color = dataObject.baseColor
        dataObject.currSort[1] -= 1
        dataObject.needSwap = 0
        dataObject.data[dataObject.currSort[0]].color = dataObject.highLightColor
    }
}

function quickSortStep(dataObject) {
    if (dataObject.sorted) {
        return
    }

    if (dataObject.needSwap !== 0) {
        quickSwap(dataObject)

    } else if (dataObject.currSort.length !== 0) {
        if (dataObject.currSort[0] >= dataObject.currSort[1]) {
            dataObject.data[dataObject.currSort[1]].color = dataObject.sortedColor
            const rightSize = (dataObject.currSort[3]-dataObject.currSort[1])
            if (rightSize > 1) {
                dataObject.needToSortStack.push([dataObject.currSort[1]+1, dataObject.currSort[3], dataObject.currSort[1]+1, dataObject.currSort[3], rightSize])
            } else {
                if (dataObject.currSort[1]+1 < dataObject.data.length) {

                    dataObject.data[dataObject.currSort[1]+1].color = dataObject.sortedColor; 
                }
            }
            const leftSize = (dataObject.currSort[1]-dataObject.currSort[2])
            if (leftSize > 1) {
                dataObject.needToSortStack.push([dataObject.currSort[2], dataObject.currSort[1]-1, dataObject.currSort[2], dataObject.currSort[1]-1, leftSize])
            } else if (leftSize == 1) {
                dataObject.data[dataObject.currSort[1]-1].color = dataObject.sortedColor;
            } else {
                dataObject.data[dataObject.currSort[1]].color = dataObject.sortedColor;
            }
            dataObject.currSort = [];

        } else if (dataObject.data[dataObject.currSort[0]].value > dataObject.data[dataObject.currSort[1]].value) {
            dataObject.needSwap = 1
            dataObject.data[dataObject.currSort[1]-1].color = dataObject.swapColor
        } else {
            dataObject.data[dataObject.currSort[0]].color = dataObject.baseColor
            dataObject.currSort[0] += 1
            dataObject.data[dataObject.currSort[0]].color = dataObject.highLightColor
        }
    }
    else {

        if (dataObject.needToSortStack.length === 0) {
            dataObject.sorted = true
        } else {
            const currArray = dataObject.needToSortStack.pop()
            dataObject.currSort =  [currArray[0], currArray[1], currArray[0], currArray[1], currArray[2]]
            dataObject.data[dataObject.currSort[1]].color = dataObject.pivotColor
            dataObject.data[dataObject.currSort[0]].color = dataObject.highLightColor
        }
    }
}


function toggleQuickPlay(dataObject) {
    if (!dataObject.paused) {
        dataObject.paused = true;
        clearInterval(dataObject.timer);
        document.getElementById("nextButton").className = "button";
        document.getElementById("playPauseButton").innerHTML = "Play"
        document.getElementById("playPauseButton").className = "playButton"
    } else {
        playSort(dataObject)
        dataObject.paused = false
        document.getElementById("nextButton").className = "disabled";
        document.getElementById("playPauseButton").innerHTML = "Pause"
        document.getElementById("playPauseButton").className = "pauseButton"
    }
}

function sortedUpdateButton() {
    document.getElementById("nextButton").className = "disabled";
    document.getElementById("playPauseButton").innerHTML = "Play"
    document.getElementById("playPauseButton").className = "disabled";
}

function resetQuickSortUI(dataObject) {
    dataObject.paused = true
    clearInterval(dataObject.timer);
    d3.select("svg").remove()
    document.getElementById("nextButton").className = "button";
    document.getElementById("playPauseButton").innerHTML = "Play"
    document.getElementById("playPauseButton").className = "playButton"

    document.getElementById("main").style.display = "none";
    document.getElementById('userInput').style.display = "block"
    document.getElementById('invalidInputWarning').style.display = "none"
}


window.initalizeQuickVar = initalizeQuickVar
window.toggleQuickPlay = toggleQuickPlay
window.resetQuickSortUI = resetQuickSortUI
window.quickSortStep = quickSortStep
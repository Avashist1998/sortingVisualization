
function initalizeMergeVar(numbers, id, baseColor, highLightColor, swapColor, sortedColor, height, width) {
    return { 
        id: id,
        step: 0,
        sortedIndex: 0,
        data: numberToSortData(numbers, baseColor),
        sorted: false,
        baseColor: baseColor,
        swapColor: swapColor,
        sortedColor: sortedColor,
        highLightColor: highLightColor,
        timer: null,
        paused: true,
        firstStep: true,
        stepSize: 2,
        shiftCount: 0,
        needSwap: false,
        mergeStack: [],
        interStack: [],
        mergeSwap: false,
        numberOfSteps: 0,
        twoPointerData: null,
        animationCompleted: false,
        mergeStackCompleted: false,
        twoPointerData: [],
        transitionTime: 250,
        freeRunTime: 250*1.2,
        width: width,
        height: height,
        sortStep: mergeSortStep,
        sortedUpdateUI: sortedUpdateButton
    }
}

function mergeSwap(dataObject) {
    const currStep = dataObject.step
    if (dataObject.data[currStep].value > dataObject.data[currStep+1].value) {
        const tmp = dataObject.data[currStep];
        
        // globalDataObject.data[currStep + 1].color = globalDataObject.data[currStep].color;
        dataObject.data[currStep] = dataObject.data[currStep + 1];
        
        dataObject.data[currStep].color = dataObject.swapColor;
        dataObject.data[currStep + 1] = tmp;
    } else {
        dataObject.data[currStep].color = dataObject.baseColor
        dataObject.step += 1
        dataObject.numberOfSteps += 1
        dataObject.needSwap = false
    }
}

function sortedAnimation(dataObject) {
    const currStep = dataObject.step
    for (let i = 0; i < dataObject.data.length; i++) {
        dataObject.data[i].color = dataObject.sortedColor
    }
    dataObject.animationCompleted = true
}

function mergeStackStep(dataObject) {
    if (dataObject.twoPointerData.length > 0) {
        if (dataObject.mergeSwap) {
            const tmp = dataObject.data[dataObject.twoPointerData[3]]
            for (let i = dataObject.twoPointerData[3]; i > dataObject.twoPointerData[0]; i--) {
                dataObject.data[i] = dataObject.data[i-1]
            }
            dataObject.data[dataObject.twoPointerData[0]] = tmp
            dataObject.data[dataObject.twoPointerData[0]].color = dataObject.baseColor
            dataObject.shiftCount += 1
            
            dataObject.twoPointerData[3] += 1
            dataObject.mergeSwap = false
        } else if (dataObject.twoPointerData[0] > dataObject.twoPointerData[2] + dataObject.shiftCount || dataObject.twoPointerData[3] > dataObject.twoPointerData[5]) {
            dataObject.shiftCount = 0
            dataObject.interStack.push([dataObject.twoPointerData[2]-dataObject.twoPointerData[1]+1, dataObject.twoPointerData[1]+ dataObject.twoPointerData[4], dataObject.twoPointerData[5]])
            for (let i = 0; i < dataObject.twoPointerData[1]+dataObject.twoPointerData[4]; i++) {
                dataObject.data[i+dataObject.twoPointerData[2]-dataObject.twoPointerData[1]+1].color = dataObject.baseColor
            }

            dataObject.data[dataObject.twoPointerData[1]+dataObject.twoPointerData[4]+dataObject.twoPointerData[2]-dataObject.twoPointerData[1]].color = dataObject.sortedColor
            dataObject.twoPointerData = []
        } else if (dataObject.data[dataObject.twoPointerData[0]].value <= dataObject.data[dataObject.twoPointerData[3]].value) {
            dataObject.twoPointerData[0] += 1
            if (dataObject.twoPointerData[0] <= dataObject.twoPointerData[2]+dataObject.shiftCount) {
                dataObject.data[dataObject.twoPointerData[0]-1].color = dataObject.baseColor
                dataObject.data[dataObject.twoPointerData[0]].color = dataObject.highLightColor
            }
        } else {
            dataObject.data[dataObject.twoPointerData[3]].color = dataObject.swapColor
            if (dataObject.twoPointerData[3]+1 <= dataObject.twoPointerData[5]) {
                dataObject.data[dataObject.twoPointerData[3]+1].color = dataObject.highLightColor
            }
            dataObject.mergeSwap = true
        }
    } else if (dataObject.mergeStack.length > 1) {
        const leftData = dataObject.mergeStack.pop(0)
        const rightData = dataObject.mergeStack.pop(0)
        dataObject.twoPointerData = [rightData[0], rightData[1],rightData[0]+rightData[1]-1, leftData[0], leftData[1], leftData[0]+leftData[1]-1]
        dataObject.data[leftData[0]].color = dataObject.highLightColor
        dataObject.data[rightData[0]].color = dataObject.highLightColor
    }
    else if ((dataObject.mergeStack.length === 1 || dataObject.mergeStack.length === 0) && (dataObject.interStack.length + dataObject.mergeStack.length  > 1)) {
        if (dataObject.mergeStack.length === 1) {
            dataObject.interStack.push(dataObject.mergeStack.pop());
        }
        while (dataObject.interStack.length > 0) {
            dataObject.mergeStack.push(dataObject.interStack.pop());
        }
        dataObject.mergeStackCompleted = true;
    
    } else {
        dataObject.step = 0
        dataObject.mergeStackCompleted = false
        dataObject.sorted = true
        sortedAnimation(dataObject)
    }
}

function mergeSortStep(dataObject) {
    const currStep = dataObject.step
    if (dataObject.sorted) {
        return 
    }

    if (dataObject.mergeStackCompleted) {
        mergeStackStep(dataObject)

    } else if (dataObject.firstStep) {
        dataObject.firstStep = false
        dataObject.numberOfSteps += 1
        dataObject.step += 1
        dataObject.data[currStep].color = dataObject.highLightColor
        if ((currStep < dataObject.data.length - 1) && dataObject.data[currStep].value > dataObject.data[currStep+1].value) {
            dataObject.data[currStep+1].color = dataObject.swapColor
            dataObject.needSwap = true
            dataObject.step -= 1
            dataObject.numberOfSteps -= 1
        }

    } else if (currStep === dataObject.data.length) {
        dataObject.data[currStep-1].color = dataObject.sortedColor;
        if (dataObject.data.length%2 !== 0) {
            dataObject.mergeStack.push([currStep-dataObject.numberOfSteps, dataObject.numberOfSteps])
        }
        dataObject.mergeStackCompleted = true
    } else if (dataObject.needSwap) {
        mergeSwap(dataObject)

    } else if (dataObject.numberOfSteps+1 === dataObject.stepSize) {
        dataObject.mergeStack.push([currStep-dataObject.stepSize+1, dataObject.stepSize])
        dataObject.data[currStep].color = dataObject.sortedColor;
        dataObject.data[currStep-1].color = dataObject.baseColor;
        if (dataObject.step < dataObject.data.length-1) {
            dataObject.firstStep = true
        }
        dataObject.numberOfSteps = 0
        dataObject.step += 1
    } else {
        dataObject.data[currStep].color = dataObject.baseColor
        dataObject.data[currStep+1].color = dataObject.highLightColor
        dataObject.step += 1
        dataObject.numberOfSteps += 1
    }
}

function toggleMergePlay(dataObject) {
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

function resetMergeSortUI(dataObject) {
    clearInterval(dataObject.timer);
    d3.select("svg").remove()

    document.getElementById("nextButton").className = "button";
    document.getElementById("playPauseButton").innerHTML = "Play"
    document.getElementById("playPauseButton").className = "button";

    document.getElementById("main").style.display = "none";
    document.getElementById('userInput').style.display = "block"
    document.getElementById("smallInputWarning").style.display = "none"
    document.getElementById('invalidInputWarning').style.display = "none"

}



window.initalizeMergeVar = initalizeMergeVar
window.toggleMergePlay = toggleMergePlay
window.resetMergeSortUI = resetMergeSortUI
window.mergeSortStep = mergeSortStep
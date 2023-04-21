function initalizeNaturalMergeVar(numbers, id, baseColor, highLightColor, swapColor, sortedColor, height, width) {
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
        animationCompleted: false,
        mergeStackCompleted: false,
        twoPointerData: [],
        transitionTime: 250,
        freeRunTime: 250*1.2,
        width: width,
        height: height,
        sortStep: naturalMergeSortStep,
        sortedUpdateUI: sortedUpdateButton
    }
}


function naturalMergeSortStep(dataObject) {
    const currStep = dataObject.step
    if (dataObject.sorted) {
        return 
    }

    if (dataObject.mergeStackCompleted) {
        mergeStackStep(dataObject)

    } else if (dataObject.firstStep) {
        dataObject.firstStep = false
        dataObject.data[currStep].color = dataObject.highLightColor

    } else if (currStep < dataObject.data.length - 1) {

        if (dataObject.data[currStep].value > dataObject.data[currStep+1].value) {
            if (dataObject.currStep > 0 && dataObject.data[dataObject.currStep-1].color !== dataObject.sortedColor) {
                dataObject.data[dataObject.currStep-1].color = dataObject.baseColor;
            }
            dataObject.data[currStep].color = dataObject.sortedColor;
            dataObject.data[currStep+1].color = dataObject.highLightColor;
            dataObject.mergeStack.push([currStep-dataObject.numberOfSteps, dataObject.numberOfSteps+1])
            dataObject.numberOfSteps = 0
            dataObject.step += 1

        } else {
            dataObject.data[currStep].color = dataObject.baseColor
            dataObject.data[currStep+1].color = dataObject.highLightColor
            dataObject.step += 1
            dataObject.numberOfSteps += 1
        }
    } else {
        if (currStep < dataObject.data.length) {
            dataObject.data[currStep].color = dataObject.sortedColor;
        }
        dataObject.mergeStack.push([currStep-dataObject.numberOfSteps, dataObject.numberOfSteps+1])
        dataObject.mergeStackCompleted = true
    }
}

function toggleNaturalMergePlay(dataObject) {
    if (!dataObject.paused) {
        dataObject.paused = true;
        clearInterval(timer);
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

function resetNaturalMergeSortUI(dataObject) {
    dataObject.paused = true;
    clearInterval(dataObject.timer);

    d3.select("svg").remove();
    document.getElementById("nextButton").className = "button";
    document.getElementById("playPauseButton").innerHTML = "Play";
    document.getElementById("playPauseButton").className = "playButton";

    document.getElementById("main").style.display = "none";
    document.getElementById('userInput').style.display = "block";
    document.getElementById('invalidInputWarning').style.display = "none";
}

window.mergeStackStep = mergeSortStep
window.naturalMergeSortStep = naturalMergeSortStep
window.toggleNaturalMergePlay = toggleNaturalMergePlay
window.resetNaturalMergeSortUI = resetNaturalMergeSortUI
window.initalizeNaturalMergeVar = initalizeNaturalMergeVar

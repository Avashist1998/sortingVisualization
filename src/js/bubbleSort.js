function initalizeBubbleVar(numbers, id, baseColor, highLightColor, swapColor, sortedColor, height, width) {
    return {id: id,
        step: 0, 
        sortedIndex: numbers.length,
        height: height,
        width: width, 
        data: arrayToChartData(numbers, baseColor),
        timer: null,
        paused: true,
        needSwap: false,
        transitionTime: 250,
        freeRunTime: 250*1.2,
        sorted: false, 
        swapColor: swapColor,
        baseColor: baseColor,
        sortedColor: sortedColor,
        highLightColor: highLightColor,
        sortStep: bubbleSortStep,
        sortedUpdateUI: sortedUpdateButton
    }
}

function bubbleSortStep(dataObject) {
    if (dataObject.sorted) {
        return
    }

    if (dataObject.needSwap) {
        const tmp = dataObject.data[dataObject.step-1]
        dataObject.data[dataObject.step-1] = dataObject.data[dataObject.step]
        dataObject.data[dataObject.step] = tmp
        dataObject.data[dataObject.step-1].color = dataObject.swapColor
        dataObject.data[dataObject.step].color = dataObject.highLightColor;
        dataObject.needSwap = false

    } else {
        for (let i = 0; i < dataObject.sortedIndex; i++) {
            if (i === dataObject.step) {
                dataObject.data[i].color = dataObject.highLightColor;
            } 
            else {
                dataObject.data[i].color = dataObject.baseColor;
            }
        }
    
        if (dataObject.step+1 < dataObject.data.length) {
            if (dataObject.data[dataObject.step+1].value <  dataObject.data[dataObject.step].value) {
                dataObject.data[dataObject.step+1].color = dataObject.swapColor;
                dataObject.needSwap = true
            }
        }
        if (dataObject.sortedIndex === 0) {
            dataObject.sorted = true
        }
        if (dataObject.step === dataObject.sortedIndex-1) {
            dataObject.step = -1
            dataObject.sortedIndex -= 1
            dataObject.data[dataObject.sortedIndex].color = dataObject.sortedColor;
        }
    
        dataObject.step += 1    
    }
}

function toggleBubblePlay(dataObject) {
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
    document.getElementById("playPauseButton").innerHTML = "Play";
    document.getElementById("playPauseButton").className = "disabled";
}

function resetBubbleSortUI(dataObject) {
    clearInterval(dataObject.timer);
    d3.select("svg").remove()

    document.getElementById("nextButton").className = "button";
    document.getElementById("playPauseButton").innerHTML = "Play"
    document.getElementById("playPauseButton").className = "playButton"

    document.getElementById("main").style.display = "none";
    document.getElementById('userInput').style.display = "block"
    document.getElementById('invalidInputWarning').style.display = "none"
}

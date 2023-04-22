function initalizeInsertVar(numbers, id, baseColor, highLightColor, swapColor, sortedColor, height, width) {
  return {
    id,
    timer: null,
    paused: true,
    needSwap: false,
    transitionTime: 250,
    freeRunTime: 250 * 1.2,
    step: 0,
    sortedIndex: 0,
    sorted: false,
    width,
    height,
    swapColor,
    baseColor,
    sortedColor,
    highLightColor,
    data: numberToSortData(numbers, baseColor),
    sortStep: insertSortStep,
    sortedUpdateUI: sortedUpdateButton
  };
}
function sortedUpdateButton() {
  document.getElementById("nextButton").className = "disabled";
  document.getElementById("playPauseButton").innerHTML = "Play";
  document.getElementById("playPauseButton").className = "disabled";
}
function insertSortStep(dataObject) {
  if (dataObject.sorted) {
    return;
  }
  if (dataObject.needSwap) {
    const tmp = dataObject.data[dataObject.step - 1];
    dataObject.data[dataObject.step - 1] = dataObject.data[dataObject.step];
    dataObject.data[dataObject.step] = tmp;
    dataObject.data[dataObject.step - 1].color = dataObject.highLightColor;
    dataObject.data[dataObject.step].color = dataObject.swapColor;
    dataObject.needSwap = false;
    dataObject.step -= 1;
  } else {
    if (dataObject.sortedIndex === 0) {
      dataObject.data[dataObject.step].color = dataObject.sortedColor;
      dataObject.sortedIndex += 1;
      dataObject.step += 1;
    } else {
      dataObject.data[dataObject.step].color = dataObject.highLightColor;
      if (dataObject.step > 0 && dataObject.data[dataObject.step - 1].value > dataObject.data[dataObject.step].value) {
        dataObject.data[dataObject.step - 1].color = dataObject.swapColor;
        dataObject.needSwap = true;
      } else {
        dataObject.sortedIndex += 1;
        dataObject.step = dataObject.sortedIndex;
        for (let i = 0; i < dataObject.sortedIndex; i++) {
          dataObject.data[i].color = dataObject.sortedColor;
        }
      }
      if (dataObject.sortedIndex === dataObject.data.length) {
        dataObject.sorted = true;
      }
    }
  }
}
function toggleInsertPlay(dataObject) {
  if (!dataObject.paused) {
    dataObject.paused = true;
    clearInterval(dataObject.timer);
    document.getElementById("nextButton").className = "button";
    document.getElementById("playPauseButton").innerHTML = "Play";
    document.getElementById("playPauseButton").className = "playButton";
  } else {
    playSort(dataObject);
    paused = false;
    document.getElementById("nextButton").className = "disabled";
    document.getElementById("playPauseButton").innerHTML = "Pause";
    document.getElementById("playPauseButton").className = "pauseButton";
  }
}
function resetInsertSortUI(dataObject) {
  clearInterval(dataObject.timer);
  d3.select("svg").remove();
  document.getElementById("nextButton").className = "button";
  document.getElementById("playPauseButton").innerHTML = "Play";
  document.getElementById("playPauseButton").className = "playButton";
  document.getElementById("main").style.display = "none";
  document.getElementById("userInput").style.display = "block";
  document.getElementById("invalidInputWarning").style.display = "none";
}
window.initalizeInsertVar = initalizeInsertVar;
window.resetInsertSortUI = resetInsertSortUI;
window.toggleInsertPlay = toggleInsertPlay;
window.insertSortStep = insertSortStep;

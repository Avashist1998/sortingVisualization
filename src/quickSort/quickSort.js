
var timer;
var paused;
var needSwap;
var freeRunTime;
var sortingStack;
var transitionTime;
var globalDataObject;
var currSort;
var needToSortStack;

function createGraph(numbers, id, baseColor, highLightColor, height=500, width){
    globalDataObject.id = id
    globalDataObject.step = 0
    globalDataObject.sorted = false
    globalDataObject.baseColor = baseColor
    globalDataObject.sortedIndex = 0
    globalDataObject.highLightColor = highLightColor
    globalDataObject.data = arrayToChartData(numbers, baseColor);
    // console.log(globalDataObject.data)
    createBarChar(globalDataObject.data, {
        x: data => data.init_index,
        y: data => data.value, 
        height: height, 
        width: width,
        color: globalDataObject.baseColor
    })
}

function createBarChar(data, {
    x = (d, i) => i, // given d in data, returns the (ordinal) x-value
    y = d => d, // given d in data, returns the (quantitative) y-value
    marginTop = 20, // the top margin, in pixels
    marginRight = 0, // the right margin, in pixels
    marginBottom = 30, // the bottom margin, in pixels
    marginLeft = 40, // the left margin, in pixels
    width = 640, // the outer width of the chart, in pixels
    height = 400, // the outer height of the chart, in pixels
    xDomain, // an array of (ordinal) x-values
    xRange = [marginLeft, width - marginRight], // [left, right]
    yType = d3.scaleLinear, // y-scale type
    yDomain, // [ymin, ymax]
    yRange = [height - marginBottom, marginTop], // [bottom, top]
    xPadding = 0.1, // amount of x-range to reserve to separate bars
} = {}) { 


    // Compute values.
    X = d3.map(data, x);
    Y = d3.map(data, y);

    // Compute default domains, and unique the x-domain.
    if (xDomain === undefined) xDomain = X;
    if (yDomain === undefined) yDomain = [0, d3.max(Y)];
    xDomain = new d3.InternSet(xDomain);

    // Omit any data not present in the x-domain.
    I = d3.range(X.length).filter(i => xDomain.has(X[i]));

    // Construct scales, axes, and formats.
    const xScale = d3.scaleBand(xDomain, xRange).padding(xPadding);
    const yScale = yType(yDomain, yRange);
    // xScale = xScale;
    // yScale = yScale;
    // const xAxis = d3.axisBottom(xScale).tickSizeOuter(0);
    // const yAxis = d3.axisLeft(yScale).ticks(height / 40, yFormat);

    // console.log(height)

    const svg = d3.select("#"+ globalDataObject.id)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto; height: intrinsic;");


    var bar = svg.append("g")
    .selectAll("rect")
    .data(I)
    .join("rect")
        .attr("x", i => xScale(X[i]))
        .attr("y", i => yScale(Y[i]))
        .attr("height", i => yScale(0) - yScale(Y[i]))
        .attr("width", xScale.bandwidth())
        .attr("fill", i => data[i].color);

    return svg.node();
}

function updateRender () {

    // Compute values.
    xPadding = 0.1
    xRange = [40, 640], 
    yType = d3.scaleLinear
    yRange = [500 - 30, 20]

    X = d3.map(globalDataObject.data, data => data.init_index);
    Y = d3.map(globalDataObject.data, data => data.value);

    // Compute default domains, and unique the x-domain.
    xDomain = X;
    yDomain = [0, d3.max(Y)];
    xDomain = new d3.InternSet(xDomain);

    // Omit any data not present in the x-domain.
    I = d3.range(X.length).filter(i => xDomain.has(X[i]));

    // Construct scales, axes, and formats.
    const xScale = d3.scaleBand(xDomain, xRange).padding(xPadding);
    const yScale = yType(yDomain, yRange);
    // console.log(X)
    // console.log(Y)
    d3.selectAll("rect").transition().duration(transitionTime)
    .attr("x", i => xScale(X[i]))
    .attr("y", i => yScale(Y[i]))
    .attr("height", i => yScale(0) - yScale(Y[i]))
    .style("fill", i => globalDataObject.data[i].color);
}


// Start the sort
    // pop the stack 
    // created your pointers
// move the pointer 

// add the sub sort to the stack
    // make the split value as green
    // add it to the stack


function swap() {
    if (needSwap === 1) {
        console.log("swap input: ", currSort)
        const tmp = globalDataObject.data[currSort[0]];
        globalDataObject.data[currSort[0]] = globalDataObject.data[currSort[1]-1];
        globalDataObject.data[currSort[1]-1] = globalDataObject.data[currSort[1]];
        globalDataObject.data[currSort[1]] = tmp
        needSwap += 1
    }
    else {
        // color and value updated
        globalDataObject.data[currSort[0]].color = globalDataObject.baseColor
        globalDataObject.data[currSort[1]].color = globalDataObject.baseColor
        currSort[1] -= 1
        needSwap = 0
        globalDataObject.data[currSort[0]].color = globalDataObject.highLightColor
        console.log("updated swap input: ", currSort)
    }
}

function sortStep() {
    // console.log("this is the sort step");
    if (globalDataObject.sorted) {
        return
    }

    if (needSwap !== 0) {
        swap()
    }
    else if (currSort.length !== 0) {
        console.log("the currSort value is ", currSort)
        if (currSort[0] >= currSort[1]) {
            globalDataObject.data[currSort[1]].color = "green"
            // add the sub sorted list to the stack
            const rightSize = (currSort[3]-currSort[1])
            console.log("right size: ", rightSize)
            if (rightSize > 1) {
                needToSortStack.push([currSort[1]+1, currSort[3], currSort[1]+1, currSort[3], rightSize])
            } else {
                if (currSort[1]+1 < globalDataObject.data.length) {

                    globalDataObject.data[currSort[1]+1].color = "green" 
                }
            }
            const leftSize = (currSort[1]-currSort[2])
            console.log("left size: ", leftSize)
            if (leftSize > 1) {
                needToSortStack.push([currSort[2], currSort[1]-1, currSort[2], currSort[1]-1, leftSize])
            } else {
                globalDataObject.data[currSort[1]-1].color = "green" 
            }
            console.log(needToSortStack)
            currSort = []
        }
        else if (globalDataObject.data[currSort[0]].value > globalDataObject.data[currSort[1]].value) {
            needSwap = 1
            globalDataObject.data[currSort[1]-1].color = "yellow"
        } else {
            globalDataObject.data[currSort[0]].color = globalDataObject.baseColor
            currSort[0] += 1
            globalDataObject.data[currSort[0]].color = globalDataObject.highLightColor
        }
    }
    else {
        if (needToSortStack.length === 0) {
            globalDataObject.sorted = true
            sortedUpdateButton()
        }
        else {
            // console.log(needToSortStack)
            const currArray = needToSortStack.pop()
            currSort =  [currArray[0], currArray[1], currArray[0], currArray[1], currArray[2]]
            // console.log("currArray :", currArray)
            // console.log("currSort: ", currSort)
            globalDataObject.data[currSort[1]].color = "teal"
            globalDataObject.data[currSort[0]].color = globalDataObject.highLightColor
        }
    }
    updateRender();
}


function playSort(){
    document.getElementById("nextButton").className = "disabled";
    if (globalDataObject.sorted) {
        return 
    }
    timer = setInterval(function() {
        sortStep();
        if (globalDataObject.sorted) {
            clearInterval(timer);
        }
    }, freeRunTime)
}


function togglePlay() {
    if (!paused) {
        paused = true;
        clearInterval(timer);
        document.getElementById("nextButton").className = "button";
        document.getElementById("playPauseButton").innerHTML = "Play"
        document.getElementById("playPauseButton").className = "playButton"
    } else {
        playSort()
        paused = false
        document.getElementById("nextButton").className = "disabled";
        document.getElementById("playPauseButton").innerHTML = "Pause"
        document.getElementById("playPauseButton").className = "pauseButton"
    }
}

function pauseRun() {
    clearInterval(timer);
    document.getElementById("nextButton").className = "button";

}

function sortedUpdateButton() {
    document.getElementById("nextButton").className = "disabled";
    document.getElementById("playPauseButton").innerHTML = "Play"
    document.getElementById("playPauseButton").className = "disabled";
}

function reset() {
    paused = true
    clearInterval(timer);
    d3.select("svg").remove()
    document.getElementById("nextButton").className = "button";
    document.getElementById("playPauseButton").innerHTML = "Play"
    document.getElementById("playPauseButton").className = "playButton"

    document.getElementById("main").style.display = "none";
    document.getElementById('userInput').style.display = "block"
    document.getElementById('invalidInputWarning').style.display = "none"

}

function updateSpeed() {
    var val = document.getElementById("playSpeed").value
    transitionTime = Math.ceil(1000/(val*val))
    freeRunTime = transitionTime*1.2

    if (!paused) {
        clearInterval(timer);
        playSort()
    }
}

function initalizeVar() {
    timer = null
    
    paused = true
    currSort = []
    needSwap = 0
    sortingStack = []
    needToSortStack = []
    transitionTime = 250
    freeRunTime = transitionTime*1.2
    globalDataObject = {id: "", step: 0, sortedIndex: 0, data: [], sorted: false, baseColor: "", highLightColor: ""}
}

function validateData(userInput) {
    if (userInput.length === 0) {
        return false
    } 
    else if(!(/ ?([0-9]* ?,)/.test(userInput))){
        return false
    } else {
        const data = convertData(userInput)
        for (let val of data) {
            if (data === undefined) {
                return false
            }
            return true
        }
    }
}

function convertData(userInput) {
    return  userInput.split(',').map(element => {
        return Number(element);
    })
}

function arrayToChartData (nums, color) {
    let data = []
    nums.map( (num, index) => {
        data.push({init_index: index, value: num, color: color});
    })
    return data;
}

// base_input = "10, 55, 23, 98, 87, 78, 9, 4, 12, 35, 45"
function renderGraphFromUserInput() {
    initalizeVar();
    const userInput = document.getElementById('listDataInput').value
    if (!validateData(userInput)) {
        document.getElementById('invalidInputWarning').style.display = "block"
    } 
    else if (convertData(userInput).length < 2) {
        document.getElementById("smallInputWarning").style.display = "block"
    } else {
        const unsortedInputData = convertData(userInput)
        needToSortStack.push([0, unsortedInputData.length-1, unsortedInputData.length])
        const sortedInputData = convertData(userInput).sort(function(a, b) { return a - b;});
        document.getElementById("main").style.display = "block"
        document.getElementById("inputData").innerHTML = unsortedInputData.join(", ")
        document.getElementById("sortedInputData").innerHTML = sortedInputData.join(", ")
        document.getElementById('userInput').style.display = "none"

        return createGraph(unsortedInputData, "quickSortChart", "steelblue", "red");
    }
}

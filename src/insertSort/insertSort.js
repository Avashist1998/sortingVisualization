var timer;
var paused;
var needSwap;
var chartWidth;
var chartHeight;
var freeRunTime;
var transitionTime;
var globalDataObject;

function initalizeVar() {
    timer = null
    paused = true
    needSwap = false
    transitionTime = 250
    freeRunTime = transitionTime*1.2
    globalDataObject = {id: "", step: 0, sortedIndex: 0, data: [], sorted: false, baseColor: "", highLightColor: ""}
}

function arrayToChartData (nums, color) {
    let data = []
    nums.map( (num, index) => {
        data.push({init_index: index, value: num, color: color});
    })
    return data;
}

function createGraph(numbers, id, baseColor, highLightColor, height=500, width){
    globalDataObject.id = id
    globalDataObject.step = 0
    globalDataObject.sorted = false
    globalDataObject.sortedIndex = 0
    globalDataObject.baseColor = baseColor
    globalDataObject.highLightColor = highLightColor
    globalDataObject.data = arrayToChartData(numbers, baseColor);
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
    xRange = [40, chartWidth], 
    yType = d3.scaleLinear
    yRange = [chartHeight - 30, 20]

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

function sortStep() {

    if (globalDataObject.sorted) {
        return
    }
    if (needSwap) {
        const tmp = globalDataObject.data[globalDataObject.step-1]
        globalDataObject.data[globalDataObject.step-1] = globalDataObject.data[globalDataObject.step]
        globalDataObject.data[globalDataObject.step] = tmp
        globalDataObject.data[globalDataObject.step-1].color = globalDataObject.highLightColor;
        globalDataObject.data[globalDataObject.step].color = "yellow"
        needSwap = false
        globalDataObject.step -= 1
    }
    else {

        if (globalDataObject.sortedIndex === 0 ) {
            globalDataObject.data[globalDataObject.step].color = "green"
            globalDataObject.sortedIndex += 1
            globalDataObject.step += 1
        }

        else {
            globalDataObject.data[globalDataObject.step].color = globalDataObject.highLightColor;
            if (globalDataObject.step > 0 && globalDataObject.data[globalDataObject.step-1].value >  globalDataObject.data[globalDataObject.step].value) {
                globalDataObject.data[globalDataObject.step-1].color = "yellow";
                needSwap = true
            } else {
                globalDataObject.sortedIndex += 1
                globalDataObject.step = globalDataObject.sortedIndex
                for (let i = 0; i < globalDataObject.sortedIndex; i++){
                    globalDataObject.data[i].color = "green";
                }
            }

            if (globalDataObject.sortedIndex === globalDataObject.data.length) {
                globalDataObject.sorted = true
                sortedUpdateButton()
            }

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
    document.getElementById("playPauseButton").innerHTML = "Play";
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
        const sortedInputData = convertData(userInput).sort(function(a, b) { return a - b;});
        document.getElementById("main").style.display = "block"
        document.getElementById('userInput').style.display = "none"
        document.getElementById("inputData").innerHTML = unsortedInputData.join(", ")
        document.getElementById("sortedInputData").innerHTML = sortedInputData.join(", ")
        chartHeight = 500;
        chartWidth = document.getElementById("chartBlock").scrollWidth;
        return createGraph(unsortedInputData, "insertSortChart", "steelblue", "red", chartHeight, chartWidth);
    }
}

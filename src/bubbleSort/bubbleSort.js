var timer;
var paused;
var needSwap;
var chartHeight;
var chartWidth;
var freeRunTime;
var transitionTime;
var globalDataObject;

function initalizeVar() {
    timer = null
    paused = true
    needSwap = false
    transitionTime = 250
    freeRunTime = transitionTime*1.2
    globalDataObject = { id: "", step: 0, sortedIndex: 0, data: [], sorted: false, baseColor: "", highLightColor: ""}
}


function ArrayToChartData (nums, color) {
    let data = []
    nums.map( (num, index) => {
        data.push({init_index: index, value: num, color: color});
    })
    return data;
}

function createGraph(numbers, id, baseColor, highLightColor, height, width){
    globalDataObject.id = id
    globalDataObject.step = 0
    globalDataObject.sorted = false
    globalDataObject.baseColor = baseColor
    globalDataObject.sortedIndex = numbers.length
    globalDataObject.highLightColor = highLightColor
    globalDataObject.data = ArrayToChartData(numbers, baseColor);
    // console.log(globalDataObject.data)
    createBarChar(globalDataObject.data, {
        x: data => data.init_index,
        y: data => data.value, 
        height: height, 
        width: width,
        color: globalDataObject.baseColor
    })
}

function updateRender () {

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

    d3.selectAll("rect").transition().duration(transitionTime)
    .attr("x", i => xScale(X[i]))
    .attr("y", i => yScale(Y[i]))
    .attr("width", xScale.bandwidth())
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
        globalDataObject.data[globalDataObject.step-1].color = "yellow"
        globalDataObject.data[globalDataObject.step].color = globalDataObject.highLightColor;
        needSwap = false
    }
    else {
        for (let i = 0; i < globalDataObject.sortedIndex; i++) {
            if (i === globalDataObject.step) {
                globalDataObject.data[i].color = globalDataObject.highLightColor;
            } 
            else {
                globalDataObject.data[i].color = globalDataObject.baseColor;
            }
        }
    
        if (globalDataObject.step+1 < globalDataObject.data.length) {
            if (globalDataObject.data[globalDataObject.step+1].value <  globalDataObject.data[globalDataObject.step].value) {
                globalDataObject.data[globalDataObject.step+1].color = "yellow";
                needSwap = true
            }
        }
    
        if (globalDataObject.sortedIndex === 0) {
            globalDataObject.sorted = true
            sortedUpdateButton()
    
        }
    
        if (globalDataObject.step === globalDataObject.sortedIndex-1) {
            globalDataObject.step = -1
            globalDataObject.sortedIndex -= 1
            globalDataObject.data[globalDataObject.sortedIndex].color = "green";
        }
    
        globalDataObject.step += 1    
    }
    updateRender();
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

function validateData(userInput) {
    if (userInput.length === 0) {
        return false
    } 
    return / ?([0-9]* ?,)/.test(userInput)
}

function convertData(userInput) {
    return  userInput.split(',').map(element => {
        return Number(element);
    })
}

function playSort() {
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

function updateSpeed() {
    var val = document.getElementById("playSpeed").value
    transitionTime = Math.ceil(1000/(val*val))
    freeRunTime = transitionTime*1.2

    if (!paused) {
        clearInterval(timer);
        playSort()
    }
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

function sortedUpdateButton() {
    document.getElementById("nextButton").className = "disabled";
    document.getElementById("playPauseButton").innerHTML = "Play";
    document.getElementById("playPauseButton").className = "disabled";
}



function reset() {
    clearInterval(timer);
    d3.select("svg").remove()

    document.getElementById("nextButton").className = "button";
    document.getElementById("playPauseButton").innerHTML = "Play"
    document.getElementById("playPauseButton").className = "playButton"

    document.getElementById("main").style.display = "none";
    document.getElementById('userInput').style.display = "block"
    document.getElementById('invalidInputWarning').style.display = "none"
}

// base_input = "10, 55, 23, 98, 87, 78, 9, 4, 12, 35, 45"
function renderGraphFromUserInput() {
    initalizeVar()
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
        return createGraph(unsortedInputData, "bubbleSortChart", "steelblue", "red", chartHeight, chartWidth);
    }
}

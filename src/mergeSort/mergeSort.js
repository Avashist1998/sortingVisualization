const transitionTime = 5
const freeRunTime = transitionTime + 10

var timer = null
var stepSize = 2
var shiftCount = 0
var needSwap = false
var mergeStack = []
var interStack = []
var mergeSwap = false
var firstStep = true
var numberOfSteps = 0
var twoPointerData = null
var animationCompleted = false
var mergeStackCompleted = false

var globalDataObject = { id: "", step: 0, sortedIndex: 0, data: [], sorted: false, baseColor: "", highLightColor: ""}

function ArrayToChartData (nums, color) {
    let data = []
    nums.map( (num, index) => {
        data.push({init_index: index, value: num, color: color});
    })
    return data;
}



function createGraph(numbers, id, baseColor, highLightColor, height=500, width){
    globalDataObject.id = id
    globalDataObject.step = -1
    globalDataObject.sorted = false
    globalDataObject.baseColor = baseColor
    globalDataObject.sortedIndex = 0
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


function swap() {
    const currStep = globalDataObject.step
    if (globalDataObject.data[currStep].value > globalDataObject.data[currStep+1].value) {
        const tmp = globalDataObject.data[currStep];
        const tmpCol = globalDataObject.data[currStep].color;
        
        // globalDataObject.data[currStep + 1].color = globalDataObject.data[currStep].color;
        globalDataObject.data[currStep] = globalDataObject.data[currStep + 1];
        
        globalDataObject.data[currStep].color = "yellow";
        globalDataObject.data[currStep + 1] = tmp;
    } else {
        globalDataObject.data[currStep].color = globalDataObject.baseColor
        globalDataObject.step += 1
        numberOfSteps += 1
        needSwap = false
    }
}

function sortedAnimation() {
    const currStep = globalDataObject.step
    for (let i = 0; i < globalDataObject.data.length; i++) {

        globalDataObject.data[i].color = "green"
    }
    animationCompleted = true
}

function mergeStackStep() {
    if (twoPointerData) {
        console.log("current right pointer: ", twoPointerData[0], " curr left pointer : ", twoPointerData[3]);
        if (mergeSwap) {
            const tmp = globalDataObject.data[twoPointerData[3]]
            for (let i = twoPointerData[3]; i > twoPointerData[0]; i--) {
                globalDataObject.data[i] = globalDataObject.data[i-1]
            }
            globalDataObject.data[twoPointerData[0]] = tmp
            globalDataObject.data[twoPointerData[0]].color = globalDataObject.baseColor
            shiftCount += 1
            
            twoPointerData[3] += 1
            mergeSwap = false
        } else if (twoPointerData[0] > twoPointerData[2] + shiftCount || twoPointerData[3] > twoPointerData[5]) {
            shiftCount = 0
            interStack.push([twoPointerData[2]-twoPointerData[1]+1, twoPointerData[1]+ twoPointerData[4], twoPointerData[5]])
            for (let i = 0; i < twoPointerData[1]+twoPointerData[4]; i++) {
                globalDataObject.data[i+twoPointerData[2]-twoPointerData[1]+1].color = globalDataObject.baseColor
            }
            console.log(twoPointerData[1]+twoPointerData[4])
            globalDataObject.data[twoPointerData[1]+twoPointerData[4]+twoPointerData[2]-twoPointerData[1]].color = "green"
            twoPointerData = null
        } else if (globalDataObject.data[twoPointerData[0]].value <= globalDataObject.data[twoPointerData[3]].value) {
            twoPointerData[0] += 1
            if (twoPointerData[0] <= twoPointerData[2]+shiftCount) {
                globalDataObject.data[twoPointerData[0]-1].color = globalDataObject.baseColor
                globalDataObject.data[twoPointerData[0]].color = globalDataObject.highLightColor
            }
        } else {
            globalDataObject.data[twoPointerData[3]].color = "yellow"
            if (twoPointerData[3]+1 <= twoPointerData[5]) {
                globalDataObject.data[twoPointerData[3]+1].color = globalDataObject.highLightColor
            }
            mergeSwap = true
        }
    }

    else if (mergeStack.length > 1) {
        const leftData = mergeStack.pop(0)
        const rightData = mergeStack.pop(0)
        twoPointerData = [rightData[0], rightData[1],rightData[0]+rightData[1]-1, leftData[0], leftData[1], leftData[0]+leftData[1]-1]
        globalDataObject.data[leftData[0]].color = globalDataObject.highLightColor
        globalDataObject.data[rightData[0]].color = globalDataObject.highLightColor
    }
    else if ((mergeStack.length === 1 || mergeStack.length === 0) && (interStack.length + mergeStack.length  > 1)) {
        if (mergeStack.length === 1) {
            interStack.push(mergeStack.pop());
        }
        while (interStack.length > 0) {
            mergeStack.push(interStack.pop());
        }
        mergeStackCompleted = true;
    
    } else {
        globalDataObject.step = 0
        mergeStackCompleted = false
        globalDataObject.sorted = true
        
        sortedAnimation()
    }
}


function sortStep() {
    const currStep = globalDataObject.step
    if (globalDataObject.sorted) {
        sortedUpdateButton()
        return 
    }

    if (mergeStackCompleted) {
        mergeStackStep()

    } else if (firstStep) {
        firstStep = false
        numberOfSteps += 1
        globalDataObject.step += 1
        globalDataObject.data[currStep+1].color = globalDataObject.highLightColor

    } else if (numberOfSteps === stepSize) {
        mergeStack.push([currStep-stepSize+1, stepSize])
        globalDataObject.data[currStep].color = "green"
        if (globalDataObject.step < globalDataObject.data.length-1) {
            firstStep = true
        }
        
        numberOfSteps = 0
        if (currStep === globalDataObject.data.length) {
            mergeStackCompleted = true
        }

    } else if (needSwap) {
        swap()

    } else if (currStep < globalDataObject.data.length - 1) {

        if (globalDataObject.data[currStep].value > globalDataObject.data[currStep+1].value) {
            globalDataObject.data[currStep].color = globalDataObject.highLightColor
            globalDataObject.data[currStep+1].color = "yellow"
            needSwap = true

        } else {
            globalDataObject.data[currStep].color = globalDataObject.baseColor
            globalDataObject.data[currStep+1].color = globalDataObject.highLightColor
            globalDataObject.step += 1
            numberOfSteps += 1
        }
    } else {
        if (currStep < globalDataObject.data.length) {
            globalDataObject.data[currStep].color = "green"
        }
        if (globalDataObject.data.length%2 !== 0) {
            mergeStack.push([currStep-numberOfSteps+1, numberOfSteps])
        }
        mergeStackCompleted = true
    }

    updateRender();
}


function startRun(){
    document.getElementById("nextButton").className = "disabled";
    if (globalDataObject.sorted) {
        return 
    }
    timer = setInterval(function() {
        sortStep();
        if (globalDataObject.sorted) {
            clearInterval(timer);
            sortedUpdateButton()
        }
    }, freeRunTime)
}


function pauseRun() {
    clearInterval(timer);
    document.getElementById("nextButton").className = "button";

}

function sortedUpdateButton() {
    document.getElementById("nextButton").className = "disabled";
    document.getElementById("playButton").className = "disabled";
    document.getElementById("pauseButton").className = "disabled";
}


function reset() {

    clearInterval(timer);
    stepSize = 2
    shiftCount = 0
    needSwap = false
    mergeStack = []
    interStack = []
    mergeSwap = false
    firstStep = true
    numberOfSteps = 0
    twoPointerData = null
    animationCompleted = false
    mergeStackCompleted = false
    d3.select("svg").remove()
    
    document.getElementById("playButton").className = "button";
    document.getElementById("pauseButton").className = "button";
    document.getElementById("nextButton").className = "button";

    document.getElementById("main").style.display = "none";
    document.getElementById('userInput').style.display = "block"
    document.getElementById("smallInputWarning").style.display = "none"
    document.getElementById('invalidInputWarning').style.display = "none"

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

tmp_input = "10, 55, 23, 98, 87, 78, 9, 4, 12, 35, 45"
function renderGraphFromUserInput() {
    const userInput = document.getElementById('listDataInput').value
    if (!validateData(userInput)) {
        document.getElementById('invalidInputWarning').style.display = "block"
    } 
    else if (convertData(userInput).length < 2) {
        document.getElementById("smallInputWarning").style.display = "block"
    }
    else {
        const unsortedInputData = convertData(userInput)
        const sortedInputData = convertData(userInput).sort(function(a, b) { return a - b;});
        document.getElementById("main").style.display = "block"
        document.getElementById("inputData").innerHTML = unsortedInputData.join(", ")
        document.getElementById("sortedInputData").innerHTML = sortedInputData.join(", ")
        document.getElementById('userInput').style.display = "none"

        return createGraph(unsortedInputData, "mergeSortChart", "steelblue", "red");
    }
}


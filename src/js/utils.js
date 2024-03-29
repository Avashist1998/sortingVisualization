import { validateData, convertData, numberToSortData } from "../ts/helper";

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
    id = "chartBlock"
} = {}) {

    // Compute values.
    var X = d3.map(data, x);
    var Y = d3.map(data, y);

    // Compute default domains, and unique the x-domain.
    if (xDomain === undefined) xDomain = X;
    if (yDomain === undefined) yDomain = [0, d3.max(Y)];
    var xDomain = new d3.InternSet(xDomain);

    // Omit any data not present in the x-domain.
    var I = d3.range(X.length).filter(i => xDomain.has(X[i]));

    // Construct scales, axes, and formats.
    const xScale = d3.scaleBand(xDomain, xRange).padding(xPadding);
    const yScale = yType(yDomain, yRange);

    const svg = d3.select("#"+ id)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto; height: intrinsic;");


    var bar = svg.append("g")
    .selectAll("rect"+id)
    .data(I)
    .join("rect")
        .attr("x", i => xScale(X[i]))
        .attr("y", i => yScale(Y[i]))
        .attr("height", i => yScale(0) - yScale(Y[i]))
        .attr("width", xScale.bandwidth())
        .attr("fill", i => data[i].color);

    return svg.node();
}

function createGraph(dataObject){
    createBarChar(dataObject.data, {
        x: data => data.init_index,
        y: data => data.value, 
        id: dataObject.id,
        width: dataObject.width,
        height: dataObject.height,
        color: dataObject.baseColor
    })
}

function updateRender (dataObject) {
    const xPadding = 0.1
    const xRange = [40, dataObject.width]
    const yType = d3.scaleLinear
    const yRange = [dataObject.height - 30, 20]

    const X = d3.map(dataObject.data, data => data.init_index);
    const Y = d3.map(dataObject.data, data => data.value);

    // Compute default domains, and unique the x-domain.
    var xDomain = X;
    const yDomain = [0, d3.max(Y)];
    xDomain = new d3.InternSet(xDomain);

    // Omit any data not present in the x-domain.
    const I = d3.range(X.length).filter(i => xDomain.has(X[i]));

    // Construct scales, axes, and formats.
    const xScale = d3.scaleBand(xDomain, xRange).padding(xPadding);
    const yScale = yType(yDomain, yRange);

    d3.select("#"+ dataObject.id).selectAll("rect").transition().duration(dataObject.transitionTime)
    .attr("x", i => xScale(X[i]))
    .attr("y", i => yScale(Y[i]))
    .attr("width", xScale.bandwidth())
    .attr("height", i => yScale(0) - yScale(Y[i]))
    .style("fill", i => dataObject.data[i].color); 
}

function playSort(dataObject) {
    if (dataObject.sorted) {
        return 
    }
    dataObject.timer = setInterval(function() {
        dataObject.sortStep(dataObject);
        updateRender(dataObject);
        if (dataObject.sorted) {
            clearInterval(dataObject.timer);
            dataObject.sortedUpdateUI();
        }
    }, dataObject.freeRunTime)
}


function updateTimeSpeed(dataObject, val) {
    dataObject.transitionTime = Math.ceil(1000/(val*val))
    dataObject.freeRunTime = dataObject.transitionTime*1.2

    if (!dataObject.paused) {
        clearInterval(dataObject.timer);
        playSort(dataObject)
    }
}

window.convertData = convertData
window.validateData = validateData
window.numberToSortData = numberToSortData

window.playSort = playSort
window.createGraph = createGraph
window.updateRender = updateRender
window.updateTimeSpeed = updateTimeSpeed
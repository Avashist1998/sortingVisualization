(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity)
      fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy)
      fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous")
      fetchOpts.credentials = "omit";
    else
      fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
function validateData(userInput) {
  if (userInput.length === 0) {
    return false;
  } else if (!/ ?([0-9]* ?,)/.test(userInput)) {
    return false;
  } else {
    const data = userInput.split(",");
    for (let val of data) {
      if (isNaN(Number(val))) {
        return false;
      }
    }
    return true;
  }
}
function convertData(userInput) {
  return userInput.split(",").map((element) => {
    return isNaN(Number(element)) ? 0 : Math.floor(Number(element));
  });
}
function numberToSortData(nums, color) {
  let data = [];
  nums.map((num, index) => {
    data.push({ init_index: index, value: num, color });
  });
  return data;
}
function createBarChar(data, {
  x = (d, i) => i,
  // given d in data, returns the (ordinal) x-value
  y = (d) => d,
  // given d in data, returns the (quantitative) y-value
  marginTop = 20,
  // the top margin, in pixels
  marginRight = 0,
  // the right margin, in pixels
  marginBottom = 30,
  // the bottom margin, in pixels
  marginLeft = 40,
  // the left margin, in pixels
  width = 640,
  // the outer width of the chart, in pixels
  height = 400,
  // the outer height of the chart, in pixels
  xDomain,
  // an array of (ordinal) x-values
  xRange = [marginLeft, width - marginRight],
  // [left, right]
  yType = d3.scaleLinear,
  // y-scale type
  yDomain,
  // [ymin, ymax]
  yRange = [height - marginBottom, marginTop],
  // [bottom, top]
  xPadding = 0.1,
  // amount of x-range to reserve to separate bars
  id = "chartBlock"
} = {}) {
  var X = d3.map(data, x);
  var Y = d3.map(data, y);
  if (xDomain === void 0)
    xDomain = X;
  if (yDomain === void 0)
    yDomain = [0, d3.max(Y)];
  var xDomain = new d3.InternSet(xDomain);
  var I = d3.range(X.length).filter((i) => xDomain.has(X[i]));
  const xScale = d3.scaleBand(xDomain, xRange).padding(xPadding);
  const yScale = yType(yDomain, yRange);
  const svg = d3.select("#" + id).append("svg").attr("width", width).attr("height", height).attr("viewBox", [0, 0, width, height]).attr("style", "max-width: 100%; height: auto; height: intrinsic;");
  svg.append("g").selectAll("rect" + id).data(I).join("rect").attr("x", (i) => xScale(X[i])).attr("y", (i) => yScale(Y[i])).attr("height", (i) => yScale(0) - yScale(Y[i])).attr("width", xScale.bandwidth()).attr("fill", (i) => data[i].color);
  return svg.node();
}
function createGraph(dataObject) {
  createBarChar(dataObject.data, {
    x: (data) => data.init_index,
    y: (data) => data.value,
    id: dataObject.id,
    width: dataObject.width,
    height: dataObject.height,
    color: dataObject.baseColor
  });
}
function updateRender(dataObject) {
  const xPadding = 0.1;
  const xRange = [40, dataObject.width];
  const yType = d3.scaleLinear;
  const yRange = [dataObject.height - 30, 20];
  const X = d3.map(dataObject.data, (data) => data.init_index);
  const Y = d3.map(dataObject.data, (data) => data.value);
  var xDomain = X;
  const yDomain = [0, d3.max(Y)];
  xDomain = new d3.InternSet(xDomain);
  d3.range(X.length).filter((i) => xDomain.has(X[i]));
  const xScale = d3.scaleBand(xDomain, xRange).padding(xPadding);
  const yScale = yType(yDomain, yRange);
  d3.select("#" + dataObject.id).selectAll("rect").transition().duration(dataObject.transitionTime).attr("x", (i) => xScale(X[i])).attr("y", (i) => yScale(Y[i])).attr("width", xScale.bandwidth()).attr("height", (i) => yScale(0) - yScale(Y[i])).style("fill", (i) => dataObject.data[i].color);
}
function playSort(dataObject) {
  if (dataObject.sorted) {
    return;
  }
  dataObject.timer = setInterval(function() {
    dataObject.sortStep(dataObject);
    updateRender(dataObject);
    if (dataObject.sorted) {
      clearInterval(dataObject.timer);
      dataObject.sortedUpdateUI();
    }
  }, dataObject.freeRunTime);
}
function updateTimeSpeed(dataObject, val) {
  dataObject.transitionTime = Math.ceil(1e3 / (val * val));
  dataObject.freeRunTime = dataObject.transitionTime * 1.2;
  if (!dataObject.paused) {
    clearInterval(dataObject.timer);
    playSort(dataObject);
  }
}
window.convertData = convertData;
window.validateData = validateData;
window.numberToSortData = numberToSortData;
window.playSort = playSort;
window.createGraph = createGraph;
window.updateRender = updateRender;
window.updateTimeSpeed = updateTimeSpeed;

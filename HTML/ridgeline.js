
// load the data here
const data = (await d3.csv("Assignment4_final.csv")).filter(e => {return e.Date !== ''});
const years = ['2021', '2017', '2013', '2009', '2005', '2001', '1997', '1993'];
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'];

// set the dimensions and margins of the graph
const margin = {top: 60, right: 30, bottom: 20, left:110},
    width = 800 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;


// append the svg object to the body of the page
const svg = d3.select("#ridgeLine")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        `translate(${margin.left}, ${margin.top})`);

// helper functions
// This is what I need to compute kernel density estimation
function kernelDensityEstimator(kernel, X) {
    return function(V) {
        return X.map(function(x) {
            return [x, d3.mean(V, function(v) { return kernel(x - v); })];
        });
    };
}
function kernelEpanechnikov(k) {
    return function(v) {
        return Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0;
    };
}
// end helper


let result = [];
let date;
data.forEach(element => {
    date = element.Date.split('.');
    if (years.includes(date[2])) {
        result.push({
            year: date[2],
            month: date[1],
            day: date[0],
            max: element.max,
            min: element.min
        })
    }
});
// Add X axis
const x = d3.scaleLinear()
    .domain([-15, 40])
    .range([ 0, width ]);
svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x).tickValues([ 0, 10 , 20, 30]).tickSize(-height));

// Create a Y scale for densities
const y = d3.scaleLinear()
    .domain([0, 0.5])
    .range([ height, 0]);

// Create the Y axis for names
const yName = d3.scaleBand()
    .domain(months)
    .range([0, height])
    .paddingInner(1)
svg.append("g")
    .call(d3.axisLeft(yName).tickSize(0));

// Compute kernel density estimation for each column:
const kde = kernelDensityEstimator(kernelEpanechnikov(7), x.ticks(40)) // increase this 40 for more accurate density.
await createAreas();

document.getElementById("selectYear").onchange = async function () {
    svg.selectAll("#deleteHandle").remove()
    await createAreas(this.value);
};

async function createAreas(selectedYear = '2021') {
    const allDensity = []
    let maxDensity;
    let minDensity;
    let output;

    for (let i = 0; i < months.length; i++) {
        output = result.filter(e => {return e.year === selectedYear && e.month === ('0' + i.toString()).slice(-2)});
        maxDensity = kde( output.map(function(d){  return d.max; }) )
        minDensity = kde( output.map(function(d){  return d.min; }) )
        allDensity.push({key: months[i], maxDensity: maxDensity, minDensity: minDensity})
    }

// Add areas
    svg.selectAll("areas")
        .data(allDensity)
        .join("path")
        .attr("transform", function(d){return(`translate(0, ${(yName(d.key)-height)})`)})
        .attr("id", "deleteHandle")
        .datum(function(d){return(d.minDensity)})
        .attr("fill", "#69b3a2")
        .attr("stroke", "#000")
        .attr("stroke-width", 1)
        .attr("opacity", 0.9)
        .attr("d",  d3.line()
            .curve(d3.curveBasis)
            .x(function(d) { return x(d[0]); })
            .y(function(d) { return y(d[1]); })
        );
    svg.selectAll("areas")
        .data(allDensity)
        .join("path")
        .attr("transform", function(d){return(`translate(0, ${(yName(d.key)-height)})`)})
        .attr("id", "deleteHandle")
        .datum(function(d){return(d.maxDensity)})
        .attr("fill", "#FF0A00")
        .attr("stroke", "#000")
        .attr("stroke-width", 1)
        .attr("opacity", 0.9)
        .attr("d",  d3.line()
            .curve(d3.curveBasis)
            .x(function(d) { return x(d[0]); })
            .y(function(d) { return y(d[1]); })
        );

}
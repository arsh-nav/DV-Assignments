// load the data here
const data = (await d3.csv("Assignment4_final.csv")).filter((e) => {
  return e.Date !== "";
});
const years = [  "1993", "1997", "2001", "2005", "2009", "2013", "2018", "2021",];
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// set the dimensions and margins of the graph
const margin = { top: 60, right: 30, bottom: 20, left: 110 },
  width = 800 - margin.left - margin.right,
  height = 600 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3
  .select("#ridgeLine")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// helper functions
// This is what I need to compute kernel density estimation
function kernelDensityEstimator(kernel, X) {
  return function (V) {
    return X.map(function (x) {
      return [
        x,
        d3.mean(V, function (v) {
          return kernel(x - v);
        }),
      ];
    });
  };
}
function kernelEpanechnikov(k) {
  return function (v) {
    return Math.abs((v /= k)) <= 1 ? (0.75 * (1 - v * v)) / k : 0;
  };
}
// end helper

// Add X axis
const x = d3.scaleLinear().domain([-15, 40]).range([0, width]);
svg
  .append("g")
  .attr("transform", `translate(0, ${height})`)
  .call(d3.axisBottom(x).tickValues([0, 10, 20, 30]).tickSize(-height));

// Create a Y scale for densities
const y = d3.scaleLinear().domain([0, 0.5]).range([height, 0]);

// Create the Y axis for years
const yYear = d3.scaleBand().domain(years.reverse()).range([0, height]).paddingInner(0.1);
svg.append("g").call(d3.axisLeft(yYear).tickSize(0));

// Compute kernel density estimation for each column:
const kde = kernelDensityEstimator(kernelEpanechnikov(7), x.ticks(40)); // increase this 40 for more accurate density.

// Draw ridgelines for min and max temperatures for each year
years.forEach((selectedYear) => {
  let result = [];

  data.forEach((element) => {
    let date = element.Date.split(".");
    if (date[2] === selectedYear) {
      result.push({
        year: date[2],
        month: date[1],
        day: date[0],
        max: element.max,
        min: element.min,
      });
    }
  });

  const maxDensity = kde(result.map((d) => d.max));
  const minDensity = kde(result.map((d) => d.min));

  // Calculate the y position for each ridgeline based on the year
  const yPos = yYear(selectedYear);

  // Draw ridgelines for min and max temperatures of the current year
  svg
    .append("path")
    .attr("class", `areas-min-${selectedYear}`)
    .datum(minDensity)
    .attr("fill", "#69b3a2")
    .attr("stroke", "#000")
    .attr("stroke-width", 1)
    .attr("opacity", 0.9)
    .attr(
      "d",
      d3
        .line()
        .curve(d3.curveBasis)
        .x((d) => x(d[0]))
        .y((d) => y(d[1])),
    )
    .attr("transform", `translate(0, -${yPos})`);

  svg
    .append("path")
    .attr("class", `areas-max-${selectedYear}`)
    .datum(maxDensity)
    .attr("fill", "#FF0A00")
    .attr("stroke", "#000")
    .attr("stroke-width", 1)
    .attr("opacity", 0.9)
    .attr(
      "d",
      d3
        .line()
        .curve(d3.curveBasis)
        .x((d) => x(d[0]))
        .y((d) => y(d[1])),
    )
    .attr("transform", `translate(0, -${yPos})`);
});

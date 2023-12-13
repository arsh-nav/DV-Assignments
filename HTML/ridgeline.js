var margin = {top: 60, right: 30, bottom: 20, left:110},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#ridgeline-plot")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");


  //read data
d3.csv("../datasets/alabama_p.csv").then(function(data) {
  // Extract years from the 'Date' column
  var years = [...new Set(data.map(d => Math.floor(d.Date / 100)))] // Extracting year from combined Date
  var n = years.length; // Calculate the number of unique years

	var categories = years.map(String);
  var groupedData = {}; // Object to hold grouped data
  data.forEach(function(d) {
    var year = Math.floor(d.Date / 100);
    var month = d.Date % 100;
    if (!groupedData[year]) groupedData[year] = {};
    if (!groupedData[year][month]) groupedData[year][month] = [];
    groupedData[year][month].push(d);
  });

  // Add X axis
  var x = d3.scaleLinear()
    .domain([-10, 140])
    .range([ 0, width ]);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // Create a Y scale for densities
  var y = d3.scaleLinear()
    .domain([0, 0.4])
    .range([ height, 0]);

  // Create the Y axis for names
  var yName = d3.scaleBand()
    .domain(categories)
    .range([0, height])
    .paddingInner(1);
  svg.append("g")
    .call(d3.axisLeft(yName));
	

  // Compute kernel density estimation for each year (separate curves for Min and Max)
  var kdeMin = kernelDensityEstimator(kernelEpanechnikov(7), x.ticks(40)); // KDE for Min values
  var kdeMax = kernelDensityEstimator(kernelEpanechnikov(7), x.ticks(40)); // KDE for Max values
  // Compute kernel density estimation for each year (separate curves for Min and Max)
var allDensityMin = [];
var allDensityMax = [];

years.forEach(year => {
  var yearData = data.filter(d => Math.floor(d.Date / 100) === year);
  
  // Extract Min and Max values for the current year
  var valuesMin = yearData.map(d => +d.Min); // Convert to numbers if not already
  var valuesMax = yearData.map(d => +d.Max); // Convert to numbers if not already

  // Check if the year has valid data
  if (valuesMin.length > 0 && valuesMax.length > 0) {
    var kdeMin = kernelDensityEstimator(kernelEpanechnikov(7), x.ticks(40)); // KDE for Min values
    var kdeMax = kernelDensityEstimator(kernelEpanechnikov(7), x.ticks(40)); // KDE for Max values

    var densityMin = kdeMin(valuesMin);
    var densityMax = kdeMax(valuesMax);

    allDensityMin.push({ key: year.toString(), density: densityMin });
    allDensityMax.push({ key: year.toString(), density: densityMax });
  }
});

  // Add areas for Min temperatures
svg.selectAll("areasMin")
  .data(allDensityMin)
  .enter()
  .append("path")
  .attr("transform", function(d) {
	  return "translate(0," + (yName(d.key)-height) + ")"; 
	  })
  .attr("fill", "none")
  .attr("fill", "rgba(0, 0, 255, 0.3)")
  .attr("stroke", "blue") // Color for Min temperature
  .attr("stroke-width", 2)
  .attr("d", function(d) {
  var line = d3.line()
    .curve(d3.curveBasis)
    .x(function(dd) { return x(dd[0]); })
    .y(function(dd) { return y(dd[1]); });

  return line(d.density);
});

// Add areas for Max temperatures
svg.selectAll("areasMax")
  .data(allDensityMax)
  .enter()
  .append("path")
  .attr("transform", function(d) { 
  return "translate(0," + (yName(d.key)-height) + ")"; 
  })
  .attr("fill", "none")
  .attr("fill", "rgba(255, 0, 0, 0.3)") 
  .attr("stroke", "red") // Color for Max temperature
  .attr("stroke-width", 3)
  .attr("d", function(d) {
    var lineGenerator = d3.line()
    .curve(d3.curveBasis)
    .x(function(densityPoint) { return x(densityPoint[0]); }) // Accessor for x-coordinate
    .y(function(densityPoint) { return y(densityPoint[1]); }); // Accessor for y-coordinate

    return lineGenerator(d.density);
});


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
});
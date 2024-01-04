// Set up the SVG container
var width = 800;
var height = 600;

var data;
var data2;
var data3;

var svg = d3
  .select("#map")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

var btn1 = document.getElementById("btn1");
var btn2 = document.getElementById("btn2");
var btn3 = document.getElementById("btn3");

fetch("../datasets/dd1.csv")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.text();
  })
  .then((csvData) => {
    // Convert CSV data to an array of objects
    data = d3.csvParse(csvData);
    btn1.addEventListener("click", function () {
      clearMap();
      addDots1();
    });
  })
  .catch((error) => {
    console.error("There was a problem with the fetch operation:", error);
  });

fetch("../datasets/dd2.csv")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.text();
  })
  .then((csvData) => {
    // Convert CSV data to an array of objects
    data2 = d3.csvParse(csvData);
    btn2.addEventListener("click", function () {
      clearMap();
      //console.log("crap");
      addDots2();
    });
  })
  .catch((error) => {
    console.error("There was a problem with the fetch operation:", error);
  });
fetch("../datasets/dd3.csv")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.text();
  })
  .then((csvData) => {
    // Convert CSV data to an array of objects
    data3 = d3.csvParse(csvData);
    btn3.addEventListener("click", function () {
      clearMap();
      addDots3();
    });
    addDots3();
  })
  .catch((error) => {
    console.error("There was a problem with the fetch operation:", error);
  });

fetch("../datasets/us-states.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then((us) => {
    // Handle the loaded data here
    createMap(us);
  })
  .catch((error) => {
    console.error("There was a problem with the fetch operation:", error);
  });
// Create a color scale for common_name values
var colorScale = d3.scaleOrdinal(d3.schemeCategory10);

// Create projection and path for the map
var projection = d3
  .geoAlbersUsa()
  .translate([width / 2, height / 2])
  .scale(1000);

var path = d3.geoPath().projection(projection);

function createMap(us) {
  // Bind data to the map and draw state boundaries
  svg
    .selectAll("path")
    .data(us.features)
    .enter()
    .append("path")
    .attr("d", path)
    .style("fill", "white")
    .style("stroke", "lightgray");
}

function clearMap() {
  svg.selectAll("circle").remove();
  svg.selectAll(".legend").remove();
  svg.selectAll("path").style("fill", "white");
}

function addDots1(index = 0) {
  if (index >= data.length) {
    return;
  }

  var sizeScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.size)])
    .range([1, 2]);

  svg
    .append("circle")
    .attr("cx", projection([+data[index].longitude, +data[index].latitude])[0])
    .attr("cy", projection([+data[index].longitude, +data[index].latitude])[1])
    .attr("r", sizeScale(data[index].size))
    .style("fill", "blue");

  setTimeout(function () {
    addDots1(index + 1);
  }, 1);
}
function addDots2(index = 0) {
  // Add legend
  if (index === 0) {
    var legend = svg
      .selectAll(".legend")
      .data(colorScale.domain())
      .enter()
      .append("g")
      .attr("class", "legend")
      .attr("transform", function (d, i) {
        return "translate(0," + i * 20 + ")";
      });

    legend
      .append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", function (d) {
        return colorScale(d);
      });

    legend
      .append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function (d) {
        return d;
      });
  }
  if (index >= data2.length) {
    return;
  }
  var sizeScale = d3
    .scaleLinear()
    .domain([0, d3.max(data2, (d) => d.size)])
    .range([1, 3]);

  svg
    .append("circle")
    .attr(
      "cx",
      projection([+data2[index].longitude, +data2[index].latitude])[0],
    )
    .attr(
      "cy",
      projection([+data2[index].longitude, +data2[index].latitude])[1],
    )
    .attr("r", sizeScale(data2[index].size))
    .style("fill", colorScale(data2[index].tree_type));

  setTimeout(function () {
    addDots2(index + 1);
  }, 10);
}
// function addDots3() {
//   const maxAbundance = d3.max(data3, (d) => +d.tree_abundance);

//   const colorScale = d3
//     .scaleSequential(d3.interpolateRgb("white", "darkgreen"))
//     .domain([0, maxAbundance]);

//   svg
//     .selectAll("path")
//     .style("fill", function (d) {
//       const stateName = d.properties.NAME;
//       const stateData = data3.find((item) => item.NAME === stateName);
//       if (stateData) {
//         return colorScale(+stateData.tree_abundance);
//       } else {
//         return "black";
//       }
//     })
//     .on("mouseover", function (event, d) {
//       const stateName = d.properties.NAME;
//       const stateData = data3.find((item) => item.NAME === stateName);
//       const stateSize = d.properties.CENSUSAREA;
//       if (stateData) {
//         const tooltip = d3
//           .select("#map")
//           .append("div")
//           .attr("class", "tooltip")
//           .style("opacity", 0);

//         tooltip.transition().duration(200).style("opacity", 0.9);
//         tooltip
//           .html(`Trees: ${stateData.tree_abundance}<br>Area: ${stateSize}`)
//           .style("left", event.pageX + "px")
//           .style("top", event.pageY - 28 + "px");
//       }
//     })
//     .on("mouseout", function () {
//       d3.select(".tooltip").remove();
//     });
}

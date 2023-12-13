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

let margin = { top: 20, right: 20, bottom: 30, left: 50 },
  width = 960 - margin.left - margin.right,
  height = 687 - margin.top - margin.bottom;

const data = (await d3.csv("data.csv")).map((d) => {
  return {
    month: d.month,
    year: d.year,
    max: parseFloat(d.max),
    min: parseFloat(d.min),
    mean: parseFloat(d.mean),
  };
});

let todo = [];

let x = d3.scaleBand().domain(months).range([0, width]);
let y = d3
  .scaleLinear()
  .domain([d3.min(data, (d) => d.min), d3.max(data, (d) => d.max)])
  .range([height, 0]);

let svg = d3
  .select("#lineChart")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
svg
  .append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x))
  .selectAll("text")
  .attr("y", 0)
  .attr("x", 9)
  .attr("dy", ".35em")
  .attr("transform", "translate(-10,0)rotate(45)")
  .style("text-anchor", "start");

svg
  .append("g")
  .attr("transform", "translate(-5,0)")
  .call(d3.axisLeft(y).tickSizeOuter(0));

svg
  .append("text")
  .attr("text-anchor", "end")
  .attr("x", 50)
  .attr("y", -10)
  .text("Temperature (°C)")
  .style("font-size", "12px");

// document.getElementById("selectedYear").onchange = async function () {
// svg.selectAll("#deleteHandle").remove();
//   await draw(this.value);
//};

const legend = svg
  .append("g")
  .attr("class", "legend")
  .attr("transform", "translate(" + (width - 100) + "," + 20 + ")"); // Position de la légende

const colors = d3.scaleOrdinal(d3.schemeCategory10);

async function draw() {
  const years = [
    "1978",
    "1983",
    "1988",
    "1993",
    "1998",
    "2003",
    "2008",
    "2013",
    "2018",
    "2022",
  ];

  for (const [index, year] of years.entries()) {
    let res = data.filter((e) => e.year === year);

    svg
      .append("path")
      .datum(res)
      .attr("id", "deleteHandle")
      .attr("fill", "none")
      .attr("stroke", colors(year))
      .attr("stroke-width", 4)
      .attr(
        "d",
        d3
          .line()
          .x((d) => x(d.month))
          .y((d) => y(d.max)),
      );

    svg
      .append("path")
      .datum(res)
      .attr("id", "deleteHandle")
      .attr("fill", "none")
      .attr("stroke", colors(year))
      .attr("stroke-width", 4)
      .attr(
        "d",
        d3
          .line()
          .x((d) => x(d.month))
          .y((d) => y(d.min)),
      );

    svg
      .append("g")
      .selectAll("circle")
      .data(res)
      .enter()
      .append("circle")
      .attr("id", "deleteHandle")
      .attr("cx", (d) => x(d.month))
      .attr("cy", (d) => y(d.mean))
      .attr("r", 7)
      .style("fill", colors(year))
      .attr("stroke", "black");

    legend
      .append("rect")
      .attr("x", 0)
      .attr("y", index * 20)
      .attr("width", 10)
      .attr("height", 10)
      .style("fill", colors(year))
      .attr("class", "legend-item");

    legend
      .append("text")
      .attr("x", 20)
      .attr("y", index * 20 + 9)
      .text(year)
      .attr("class", "legend-text");
  }
}

await draw();

const months = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

let margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 687 - margin.top - margin.bottom;

const data = (await d3.csv("data.csv")).map(d => {
    return {
        month: d.month,
        year: d.year,
        max: parseFloat(d.max),
        min: parseFloat(d.min),
        mean: parseFloat(d.mean)
    };
});

let x = d3.scaleBand().domain(months).range([0, width]);
let y = d3.scaleLinear()
    .domain([d3.min(data, d => d.min), d3.max(data, d => d.max)])
    .range([height, 0]);

let svg = d3.select("#lineChart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");
svg.append("g")
    .attr("transform", "translate(0," + (height) + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("y", 0)
    .attr("x",9)
    .attr("dy", ".35em")
    .attr("transform", "translate(-10,0)rotate(45)")
    .style("text-anchor", "start");

svg.append("g")
    .attr("transform", "translate(-5,0)")
    .call(d3.axisLeft(y).tickSizeOuter(0))

svg.append("text")
    .attr("text-anchor", "end")
    .attr("x", 50)
    .attr("y", -10)
    .text("Temperature (°C)")
    .style('font-size', '12px');

document.getElementById("selectedYear").onchange = async function () {
    svg.selectAll("#deleteHandle").remove();
    await draw(this.value);
};

async function draw(year = '2022') {
    let res = data.filter(e => {
        return e.year === year
    });

    svg.append("path")
        .datum(res)
        .attr("id", "deleteHandle")
        .attr("fill", "none")
        .attr("stroke", "#FF0A00")
        .attr("stroke-width", 4)
        .attr("d", d3.line()
            .x(d => x(d.month))
            .y(d => y(d.max))
        );
    svg.append("path")
        .datum(res)
        .attr("id", "deleteHandle")
        .attr("fill", "none")
        .attr("stroke", "#e56e6b")
        .attr("stroke-width", 4)
        .attr("d", d3.line()
            .x(d => x(d.month))
            .y(d => y(d.min))
        );

    svg.append('g')
        .selectAll("circle")
        .data(res)
        .enter()
        .append("circle")
        .attr("id", "deleteHandle")
        .attr("cx", d => x(d.month))
        .attr("cy", d => y(d.mean))
        .attr("r", 7)
        .style("fill", '#7ae703')
        .attr('stroke', "black")
}
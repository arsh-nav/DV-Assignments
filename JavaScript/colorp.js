var existingSvg = d3.select('#map').select('svg');
var svg = existingSvg.empty()
  ? d3.select('#map').append('svg').attr('width', width).attr('height', height)
  : existingSvg;
var width = 800;
var height = 600;

var svg = d3.select('#map')
  .append('svg')
  .attr('width', width)
  .attr('height', height);

// Load state boundaries data
fetch('../datasets/us-states.json')
  .then(response => response.json())
  .then(us => {
    fetch('../datasets/density_by_state.csv')
      .then(response => response.text())
      .then(data => {
        var stateCount = d3.csvParse(data);
        drawMap(us, stateCount);
      })
      .catch(error => {
        console.error('Error loading state count data:', error);
      });
  })
  .catch(error => {
    console.error('Error loading state boundaries data:', error);
  });

function drawMap(us, data) {
  var projection = d3.geoAlbersUsa()
    .translate([width / 2, height / 2])
    .scale(1000);

  var path = d3.geoPath().projection(projection);

  svg.selectAll('path')
    .data(us.features)
    .enter().append('path')
    .attr('d', path)
    .style('fill', function(d) {
      var stateName = d.properties.NAME ? d.properties.NAME.toLowerCase().trim() : null; // Adjust property name to 'NAME' and normalize
      var stateData = data.find(item => item.state && item.state.toLowerCase().trim() === stateName); // Check for stateData existence
      if (stateName && stateData) { // Check if both stateName and stateData are defined
        return getColor(stateData);
      } else {
        return 'rgb(255, 253, 220)'; // Fallback color for states with no data
      }
    })
    .style('stroke', 'black')
    .on('mouseover', function(d) {
      var stateName = d.properties.NAME ? d.properties.NAME : 'Unknown';
      var stateData = data.find(item => item.state && item.state.toLowerCase().trim() === stateName.toLowerCase().trim());
      var count = stateData ? stateData.count : 'Data unavailable';
      tooltip.transition()
        .duration(200)
        .style('opacity', .9);
      tooltip.html(stateName + '<br>' + 'Count: ' + count)
        .style('left', (d3.event.pageX) + 'px')
        .style('top', (d3.event.pageY - 28) + 'px');
    })
    .on('mouseout', function(d) {
      tooltip.transition()
        .duration(500)
        .style('opacity', 0);
    });

  var tooltip = d3.select('body')
    .append('div')
    .attr('class', 'tooltip')
    .style('opacity', 0);

    function getColor(data) {
        var count = parseInt(data.count);
      
        // Define the colors in a black & white palette
        var colors = ['#FFFFFF', '#E6E6E6', '#CCCCCC', '#B3B3B3', '#999999', '#808080', '#666666', '#4D4D4D', '#333333', '#1A1A1A'];
      
        // Define the ranges based on your data
        var ranges = [1000, 10000, 50000, 100000, 250000, 500000, 1000000, 1220000, 1440000,1680000];
      
        // Check the category based on the count
        var category = 0;
        for (var i = 0; i < ranges.length; i++) {
          if (count > ranges[i]) {
            category++;
          } else {
            break;
          }
        }
      
        // Return the color based on the category
        return colors[category];
      }
  // Add legend
  var legend = svg.append('g')
  .attr('class', 'legend')
  .attr('transform', 'translate(' + (width - 70) + ', 20)'); // Adjust the legend position as needed

  var legendColors = ['#FFFFFF', '#E6E6E6', '#CCCCCC', '#B3B3B3', '#999999', '#808080', '#666666', '#4D4D4D', '#333333', '#1A1A1A'];
  var legendText = ['1000', '10000', '50000', '100000', '250000', '500000', '1000000', '1220000', '1440000','1680000'];

  var legendItems = legend.selectAll('.legend-item')
    .data(legendColors)
    .enter().append('g')
    .attr('class', 'legend-item')
    .attr('transform', function(d, i) { return 'translate(0,' + (i * 20) + ')'; });

  legendItems.append('rect')
    .attr('x', 0)
    .attr('y', -9) // Adjust the vertical position as needed
    .attr('width', 15)
    .attr('height', 15)
    .style('fill', d => d);

  legendItems.append('text')
    .attr('x', 20)
    .attr('y', 0) // Adjust the vertical position as needed
    .attr('dy', '0.3em') // Adjust the vertical alignment of the text
    .text((d, i) => legendText[i]);

}

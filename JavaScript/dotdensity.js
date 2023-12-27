// mapboxgl.accessToken = 'pk.eyJ1IjoiYXJzaGludiIsImEiOiJjbHFtanU1ZzYxdTlhMmtvMG9idjk2cGV5In0.Bn2P5-rKDQ7jvuZsn6Ahbw'; // Replace with your Mapbox Access Token

// var map = new mapboxgl.Map({
//     container: 'map',
//     style: 'mapbox://styles/mapbox/streets-v11', // You can change the map style here
//     center: [-96, 37.8], // Centered at the US
//     zoom: 3 // Adjust the zoom level as needed
//   });
//  // Function to generate random points within a GeoJSON polygon using Turf.js
// function generateRandomPointsWithinPolygon(count, polygon) {
//     const points = [];
  
//     const bbox = turf.bbox(polygon);
//     const bboxPolygon = turf.bboxPolygon(bbox);
  
//     for (let i = 0; i < count; i++) {
//       let randomPoint = null;
//       do {
//         const randomLng = bbox[0] + Math.random() * (bbox[2] - bbox[0]);
//         const randomLat = bbox[1] + Math.random() * (bbox[3] - bbox[1]);
//         randomPoint = turf.point([randomLng, randomLat]);
//       } while (!turf.booleanPointInPolygon(randomPoint, bboxPolygon));
  
//       points.push(randomPoint);
//     }
  
//     return turf.featureCollection(points);
//   }
  
  
  
  
  // Use the generated GeoJSON data to add circles to the map
//   var dotCount = 1000; // Number of dots
//   var californiaPolygon = {
//     type: 'Polygon',
//     coordinates: [
//       [
//         [-124.482003, 32.528832],
//         [-114.131211, 32.528832],
//         [-114.131211, 42.009519],
//         [-124.482003, 42.009519],
//         [-124.482003, 32.528832]
//       ]
//     ]
//   };
  
//   // Use the specified GeoJSON polygon for generating random points
//   var boundingPolygon = californiaPolygon; // Replace with the desired state's polygon
  
//   // Generate random GeoJSON data with points within the specified polygon
//   var geojsonData = generateRandomPointsWithinPolygon(dotCount, boundingPolygon);
  
//   map.on('load', function () {
//     map.addSource('dots', {
//       type: 'geojson',
//       data: geojsonData
//     });
  
//     map.addLayer({
//       id: 'dots-layer',
//       type: 'circle',
//       source: 'dots',
//       paint: {
//         'circle-radius': 3,
//         'circle-color': 'red'
//       }
//     });
//   });
// Set up the SVG container
// var width = 800;
// var height = 600;

// var svg = d3.select('#map')
//   .append('svg')
//   .attr('width', width)
//   .attr('height', height);

//   d3.json('../datasets/us-states.json').then(function(error,us) {
//     // Load the CSV data
//     if (error) throw error;

//       // Create a color scale for common_name values
//       var colorScale = d3.scaleOrdinal(d3.schemeCategory10);
  
//       // Create projection and path for the map
//       var projection = d3.geoAlbersUsa()
//         .translate([width / 2, height / 2])
//         .scale(1000);
  
//       var path = d3.geoPath().projection(projection);
  
//       // Bind data to the map and draw state boundaries
//       svg.selectAll('path')
//         .data(us.features)
//         .enter().append('path')
//         .attr('d', path)
//         .style('fill', 'white')
//         .style('stroke', 'lightgray');
//   });
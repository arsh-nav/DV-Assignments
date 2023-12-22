const dataset = await d3.csv("../datasets/Assignment4_2.csv");
const dataset2=[]
var dataLength=0


for (let i = 0; i < dataset.length; i++) {
    dataset2.push(dataset[i]);
}

    const features = Object.keys(dataset[0]);
    //const features_val = Object.entries(dataset2);
    features.shift()

    //console.log(features_val)
console.log(dataset2)

const years=[]
dataset2.forEach((element,index)=>{
years.push(element['Years'])

})

// dataset.forEach(element => {
//    datasetArray.push( Object.entries(element));
// });
// console.log(datasetArray)

let svg = d3.select("#Radar_chart").append("svg")
    .attr("width", 1200)
    .attr("height", 1000);

let radialScale = d3.scaleLinear()
    .domain([-10,50])
    .range([0,400]);
//let ticks = years
let ticks=[2,6,10,14,18,22,26,30,34,38,42,46]
ticks.forEach(t =>
    
    svg.append("circle")
    .attr("cx", 400)
    .attr("cy", 400)
    .attr("fill", "none")
    .attr("stroke", "gray")
    .attr("r", radialScale(parseInt(t)))
    
    
);

function angleToCoordinate(angle, value){
    let x = Math.cos(angle) * radialScale(value);
    let y = Math.sin(angle) * radialScale(value);
    return {"x": 400 + x, "y": 400 - y,"v":value};
}

// In this loop we only set the basic form of radial chart with features as labels and its axis line
    for (var i = 0; i < features.length; i++) {
        
        let ft_name = features[i];
        let angle = (Math.PI / 2) + (2 * Math.PI * i / features.length);
       
        let line_coordinate = angleToCoordinate(angle, 50);
        let label_coordinate = angleToCoordinate(angle, 50.2);

        //draw axis line
        svg.append("line")
        .attr("x1", 400)
        .attr("y1", 400)
        .attr("x2", line_coordinate.x)
        .attr("y2", line_coordinate.y)
        .attr("stroke","black");

        //draw axis label
        svg.append("text")
        .attr("x", label_coordinate.x)
        .attr("y", label_coordinate.y)
        .text(ft_name);
    }


let line = d3.line()
    .x(d => d.x)
    .y(d => d.y);
let colors = ['#CC04CC','#D98E13','#05F133','#E5D998','#ACD913','#13D9A6','#1382D9','#D91313','#1F4E79','#6A0572']

// The circle vlues(data values) and their shape are set here
function getPathCoordinates(data_point){
    let coordinates = [];
    for (var i = 0; i < features.length; i++){
        let ft_name = features[i];
        let angle = (Math.PI / 2) + (2 * Math.PI * i / features.length);
        //console.log(data_point[ft_name])
        coordinates.push(angleToCoordinate(angle, data_point[ft_name]));
    }
   
    return coordinates;
}

const tooltip = d3.select("#Radar_chart")
    .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "black")
      .style("border-radius", "5px")
      .style("padding", "10px")
      .style("color", "white")

const showTooltip = function(event,d) {
    console.log('ok')
    tooltip
      .transition()
      .duration(200)
    tooltip
      .style("opacity", 1)
      .html("Mean Degree: " + d.v)
      .style("left", 200  + "50px")
      .style("top", 100 + "50px")
  }
  const moveTooltip = function(event, d) {
    tooltip
      // .style("left", (event.x)/2 + "px")
      // .style("top", (event.y)/2-50 + "px")
      .style("left", d.x  + "50px")
      .style("top", d.y+ "50px")
  }
  const hideTooltip = function(event, d) {
    tooltip
      .transition()
      .duration(200)
      .style("opacity", 0)
  }

for (var i = 0; i < dataset2.length; i ++){
    
       // console.log(parseFloat(datasetArray[i][j][1]))
    //let d = parseFloat(datasetArray[i][j][1]);
    
    //let d=dataset2[i];
    let color = colors[i];
    let coordinates = getPathCoordinates(dataset2[i]);
    //draw the path element
    svg.append("path")
    .datum(coordinates)
    .attr("d",line)
    .attr("stroke-width", 3)
    .attr("stroke", color)
    .attr("fill", "none")
    .attr("stroke-opacity", 1)
    .attr('class',dataset2[i]['Years'])
    .attr('data-value',dataset2[i]['Years'])
    .attr("opacity", 0.5)
    .style('display','none');


    for(var j=0;j<coordinates.length;j++)
    {

    
    svg.append('circle')
    .datum(coordinates[i,j])
    .attr('cx',coordinates[i,j].x)
    .attr('cy',coordinates[i,j].y)
    .attr('r',5)
    .attr("stroke-width", 3)
    .attr("stroke", color)
    .attr("fill", color)
    .attr("stroke-opacity", 1)
    .attr('class',dataset2[i]['Years'])
    .attr('data-value',dataset2[i]['Years'])
    .attr("opacity", 0.5)
    .on('mouseover',function(event,d){
        console.log(d)
        tooltip
      .transition()
      .duration(200)
    tooltip
      .style("opacity", 1)
      .html("Mean Degree: " + d.v)
      //.style("left", d.x  + "50px")
      //.style("top", d.y+ "50px")
       .style("left", (event.x)/2 + "px")
       .style("top", (event.y)/2-50 + "px")
    })
    .on("mousemove", function(e,d){

        tooltip
     // .style("left", d.x  + "50px")
      //.style("top", d.y+ "50px")
      .style("left", (e.x)/2 + "px")
      .style("top", (e.y)/2-50 + "px")
    } )
    .on("mouseleave", hideTooltip )
    .style('display','none');
    
     }
}

var legend= svg.append('rect')
    .attr('width',300)
    .attr('height',700)
    .attr('fill',"#050301")
    .attr('opacity',.5)
    .attr('x',850)
    .attr('class','legend')
    .attr('y',0);

    
    const check = function(event, d) {
       var checkedArray=[]
       var uncheckedArray=[]
       var temp= d3.selectAll("input[type=checkbox]")
       var temp2=temp._groups[0]
       temp2.forEach(element => {
       if(element.checked)
        checkedArray.push(element)
        else
        uncheckedArray.push(element)
       });
       
       checkedArray.forEach(element=>{
        
          
          var x = document.getElementsByClassName(element.id);

            for (var i = 0; i < x.length; i++) {
            x[i].style.display = 'block';
            }

        })

        uncheckedArray.forEach(element=>{
        
          
            var x = document.getElementsByClassName(element.id);
  
              for (var i = 0; i < x.length; i++) {
              x[i].style.display = 'none';
              }
  
          })
      }

      
   // To use the data and enter I used this, I could also use the commented lines above

   ////////
   // First it is creating a div and inside each div puts an input with the type of checkbox and a label for it.
   var countryWrapper = d3.select("#Radar_chart");

   var countryButton = 
       countryWrapper
           .selectAll(".checkbox")
           .data(dataset2)
           .enter()
           .append("div")
           .style('display','block')
           .style('position','relative')
           .style('left',1000)
           .style('top',-960)
           .style('margin',5)
           
           .attr("class", "checkbox");
   countryButton.append("input")
       .attr("type", "checkbox")
       .attr("id", function(d) { return d.Years; })
       //.attr("value", function(d) { return d.Years; })
       .attr("class", "checkboxes")
       .style('width',30)
       .style('height',30)
       .on('click', check);
   countryButton.append("label")
       //.attr('for', function(d) { return d.Years; })
       .text(function(d) { return d.Years; })
       .attr("class", "checkboxes");       
 
   var item=svg.selectAll('.item')
   .data(dataset2)
   .enter()
   .append('rect')
   .attr('x',900)
   .attr('y',function(element,index){
        return 50* (index+1)

    })
    .attr('width',30)
    .attr('height',30)
    .attr('fill',(d,i)=>colors[i])
    .attr('class',(d,i)=>'item'+i);

    svg.selectAll('.text')
    .data(dataset2)
    .enter()
    .append('text')
    .attr('class','text')
    .text(d=>d['Years'])
    .attr('x',950)
    .attr('y',function(element,index){
        return (document.querySelector('.item'+index).getAttribute('y'))
        //return 60* (index)

    })
    //I used transform to fix the position of the text
    .attr('transform', 'translate(' + 0 + ',' + 20 + ')');
    
    
    
    


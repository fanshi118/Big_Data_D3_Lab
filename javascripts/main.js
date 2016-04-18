var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 700 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// initialize x 
var xValue = function(d) { return d.displacement; }, // data -> value
    xScale = d3.scale.linear().range([0, width]), // value -> display
    xMap = function(d) { return xScale(xValue(d)); }, // data -> display
    xAxis = d3.svg.axis().scale(xScale).orient("bottom");

// initialize y
var yValue = function(d) { return d.mpg;}, // data -> value
    yScale = d3.scale.linear().range([height, 0]), // value -> display
    yMap = function(d) { return yScale(yValue(d));}, // data -> display
    yAxis = d3.svg.axis().scale(yScale).orient("left");

// setup fill color
var cValue = function(d) { return d.origin;},
    color = d3.scale.category10();

// add the graph canvas to the body of the webpage
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// highlight
function highlight(name) {
    svg.selectAll("circle")
    .style("stroke", function(d,i) {
        return d.name==name ? "black":undefined
    })
}

// unhighlight
function unhighlight() {
    svg.selectAll("circle").style("stroke", undefined)
}

d3.csv("https://s3.amazonaws.com/yubowenok/car.csv", function(error, data) {
    data.forEach(function(d) {
       d.mpg = +d.mpg;
       d.displacement = +d.displacement;
       d.cylinders = +d.cylinders;
       d.horsepower = +d.horsepower;
       d.weight = +d.weight;
       d.acceleration = +d.acceleration;
       d["model.year"] = +d["model.year"];
    });
    
    var headers = d3.keys(data[0]);
    for (var i=0; i<headers.length; i++) {
        var col = headers[i];
        if (col!="name" && col!="origin") {
            var select_y = d3.select("#sel-y")
                           .append("option")
                           .attr("value", headers[i])
                           .text(headers[i]);
            if (col!="displacement"){
                var select_x = d3.select("#sel-x")
                               .append("option")
                               .attr("value", headers[i])
                               .text(headers[i])
            }
        }
    };
     
  // don't want dots overlapping axis, so add in buffer to data domain
  xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]);
  yScale.domain([d3.min(data, yValue)-1, d3.max(data, yValue)+1]);

  // x-axis
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", -6)
      .style("text-anchor", "end")
      .text($( "#sel-x option:selected" ).text());

  // y-axis
  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text($( "#sel-y option:selected" ).text());

  // draw dots
  svg.selectAll(".dot")
      .data(data)
      .enter().append("circle")
      .attr("class", "dot")
      .attr("r", 2.5)
      .attr("cx", xMap)
      .attr("cy", yMap)
      .style("fill", function(d) { return color(cValue(d));})
      .text(function(d) { return d.name; })
      .on("mouseenter", function(d) {
          highlight(d.name);
          d3.select("h4").text(d.name);
      })
      .on("mouseleave", function(d) {
          unhighlight(d.name);
      });

  // draw legend
  var legend = svg.selectAll(".legend")
      .data(color.domain())
       .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  // draw legend colored rectangles
  legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  // draw legend text
  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d;})
 });
// Define SVG area dimensions
var svgWidth = 960;
var svgHeight = 500;

// Define the chart's margins as an object
var margin = {
  top: 60,
  right: 60,
  bottom: 60,
  left: 60
};

// Define dimensions of the chart area - margins creates extra space for axes
var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

// Select body, append SVG area to it, and set its dimensions
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append a group area, then set its margins and positioning 
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Load data from data.csv
d3.csv("assets/data/data.csv").then(function(healthData) {

  // Print the Data
  console.log(healthData);

  // Cast poverty and obesity values to integer
  healthData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.obesity = +data.obesity;
  });

  // Configure a linear scale for the x axis
  var xLinearScale = d3.scaleLinear() 
    .domain([d3.min(healthData, data => data.poverty) * 0.95,
    d3.max(healthData, data => data.poverty) * 1.05])  
    .range([0, chartWidth]);

  // Configure a linear scale for the y axis
  var yLinearScale = d3.scaleLinear()
    .domain([18, (d3.max(healthData, data => data.obesity))*1.06])
    .range([chartHeight, 0]);

  // Create chart axes
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  chartGroup.append("g")
  .attr("transform", `translate(0, ${chartHeight})`)
  .call(bottomAxis);

  // append y axis
  chartGroup.append("g")
  .call(leftAxis);

  // append circles and their labels
  var circlesGroup = chartGroup.selectAll("circle")
  .data(healthData)
  .enter()
  .append("circle")
  .classed("stateCircle", true)
  .attr("cx", d => xLinearScale(d.poverty))
  .attr("cy", d => yLinearScale(d.obesity))
  .attr("r", "13");
  
  var circlesLabels = chartGroup.selectAll(".stateText")
  .data(healthData)
  .enter()
  .append("text")
  .classed("stateText", true)
  .attr("font-size", "9.5px")
  .attr("x", d => xLinearScale(d.poverty))
  .attr("y", d => yLinearScale(d.obesity))
  .text(d=> d.abbr);


  // append axis titles 
  chartGroup.append("text")
    .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + (margin.top)/1.25})`)
    .attr("text-anchor", "middle")
    .attr("font-size", "16px")
    .attr("fill", "black")
    .text("In Poverty (%)");

  // append y axis
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (chartHeight / 1.5))
    .attr("dy", "1em")
    .classed("axis-text", true)
    .text("Obese (% of Population)");


}).catch(function(error) {
    console.log(error);
});

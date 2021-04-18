// Assignment Five (02.526 Interactive Data Visualisation)

let width = 1420, height = 800;

let colorScale = d3.scaleOrdinal(d3.schemeCategory10);

let xPosition = d3.scaleOrdinal()
.domain([0, 1, 2])
.range([150, 400, 650]);

let svg = d3.select("svg")
  .attr("width", width)
  .attr("height", height);

let data = [];
for (let i=0; i < 50; i++) {
  let obj = {};
  obj.id = "node" + i;
  obj.class = Math.floor(Math.random() * 10);
  data.push(obj);
}

let links = [];
for (let i=0; i < 13; i++) {
  let obj = {};
  obj.source = "node" + Math.floor(Math.random() * 20);
  obj.target = "node" + Math.floor(Math.random() * 20);
  links.push(obj);
}

let node = svg.append("g")
.attr("id", "nodes")
.selectAll("circle")
.data(data)
.enter()
.append("circle")
  .attr("r", 25)
  .style("fill", d=> colorScale(d.class))
.call(d3.drag()
.on("start", dragstarted)
.on("drag", dragged)
.on("end", dragended));

let linkpath = svg.append("g")
.attr("id", "links")
.selectAll("path")
.data(links)
.enter()
.append("path")
.attr("fill", "none")
.attr("stroke", "black");

function dragstarted(event, d) {
if (!event.active) simulation.alphaTarget(0.3).restart();
d.fx = d.x;
d.fy = d.y;
}

function dragged(event, d) {
d.fx = event.x;
d.fy = event.y;
}

function dragended(event, d) {
if (!event.active) simulation.alphaTarget(0);
d.fx = null;
d.fy = null;
}

let simulation = d3.forceSimulation()
.nodes(data)
// //this block of code will make all the nodes will be clustered into a single group
// .force("x", d3.forceX().strength(0.5).x( width /2 ))
// .force("y", d3.forceY().strength(0.2).y( height /2 ))
// // .force("link", d3.forceLink(links).id(d => d.id))
// .force("charge", d3.forceManyBody().strength(20))
// .force("collide", d3.forceCollide().strength(1).radius(25))
// this block of code will cluster the nodes into 3 separate groups
.force("x", d3.forceX().strength(0.5).x( d => xPosition(d.class) ))
.force("y", d3.forceY().strength(0.2).y( height /2 ))
//positive strength (attractive) or negative strength (repulsive) values
.force("link", d3.forceLink(links).id(d => d.id))
.force("charge", d3.forceManyBody().strength(13)) //try +500
.force("collide", d3.forceCollide().strength(1).radius(30))
.force("link", d3.forceLink(links)
    .id(d => d.id)
    .distance(50)
    .strength(0.5)
)

// when the alpha values decays down to a certain value, then the animation becomes static
  .on("tick", d => {
      node
      .attr("cx", d => d.x)
      .attr("cy", d => d.y);
      linkpath
      .attr("d", d => "M" + d.source.x + "," + d.source.y + " " + d.target.x + "," + d.target.y);
  });

d3.select("#group1").on("click", function() {
  simulation
  .force("x", d3.forceX().strength(0.5).x(d => xPosition(d.class)))
  .force("y", d3.forceY().strength(0.2).y( height /2 ))
  .alphaTarget(0.3)
  .restart();
})

d3.select("#group2").on("click", function() {
  simulation
  .force("x", d3.forceX().strength(0.1).x(400))
  .force("y", d3.forceY().strength(0.1).y(400))
  .alphaTarget(0.3)
  .restart();
}) 
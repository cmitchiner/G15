
var simulation;
var svg2 = d3.select("#networkViz")
    .append("svg")
    // .attr("width", '1900')
    // .attr("height", '750')
    .attr("viewBox", `0 0 1900 750`)
    .attr("preserveAspectRatio", "xMidYMid meet");
function changeSlider(g1, min, max) {
  let graph = JSON.parse(JSON.stringify(g1));
  graph.links = graph.links.filter(function (el) {
    return min <= el.value && el.value <= max;
  });

  graph.nodes = graph.nodes.filter(function (el) {
    return graph.links.some(e => e.source === el.id || e.target === el.id);
  });

  svg2.selectAll("*").remove();

  var color = d3.scaleOrdinal(d3.schemeCategory20);

  simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function (d) { return d.id; }))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width / 2, height / 2));


  var link = svg2.append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(graph.links)
    .enter().append("line")
    .attr("stroke-width", function (d) { return Math.sqrt(d.value); });

  var node = svg2.append("g")
    .attr("class", "nodes")
    .selectAll("circle")
    .data(graph.nodes)
    .enter().append("circle")
    .attr("r", 5)
    .attr("fill", function (d) { return color(d.group); })
    .call(d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended));

  node.append("title")
    .text(function (d) { return (d.id + "\n" +  d.group); });


  simulation
    .nodes(graph.nodes)
    .on("tick", ticked);

  simulation.force("link")
    .links(graph.links);


  function ticked() {
    link
      .attr("x1", function (d) { return d.source.x; })
      .attr("y1", function (d) { return d.source.y; })
      .attr("x2", function (d) { return d.target.x; })
      .attr("y2", function (d) { return d.target.y; });

    node
      .attr("cx", function (d) { return d.x = Math.max(5, Math.min(1895, d.x));})
      .attr("cy", function (d) { return d.y = Math.max(5, Math.min(745, d.y));});
  }
}

function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}
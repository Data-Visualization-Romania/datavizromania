import * as Config from "../Config.js";
import { select, selectAll } from "d3-selection";
import { nest } from "d3-collection";
import { pack, hierarchy } from "d3-hierarchy";

// Create a d3 Object with a subset of functions
const d3 = Object.assign(
  {},
  {
    select,
    selectAll,
    nest,
    pack,
    hierarchy,
  }
);

// PackChart Class
export default class PackChart {
  // constructor({a = 'default a value', b = 'default b value', c = 'default c value'} = {a:'default option a', b:'default option b', c:'default option c'}) {
  //   this.a = a;
  //   this.b = b;
  //   this.c = c;
  // }

  constructor(
    _parentElement = Config.parentElement,
    {
      groupId = "",
      packData = {},
      showBoundingRectangle = 0,
      stroke = Config.stroke,
      strokeWidth = Config.strokeWidth,
      width = 240,
      height = width,
      isHidden = true,
      translateX = 240,
      translateY = 330,
    } = {
      groupId,
      packData,
      showBoundingRectangle,
      stroke,
      strokeWidth,
      width,
      height,
      isHidden,
      translateX,
      translateY,
    }
  ) {
    this.parentElement = _parentElement;
    this.groupId = groupId;
    this.packData = packData;
    this.stroke = stroke;
    this.strokeWidth = strokeWidth;
    this.showBoundingRectangle = showBoundingRectangle;
    this.width = width;
    this.height = height;
    this.isHidden = isHidden;
    this.translateX = translateX;
    this.translateY = translateY;

    this.initViz();
  }

  initViz() {
    var viz = this;

    viz.g = d3
      .select(viz.parentElement)
      .append("g")
      .attr("id", viz.groupId)
      .attr("class", "pack-group")
      .classed("hide", viz.isHidden)
      .attr("fill", Config.color(0))
      .attr("transform", `translate(${viz.translateX}, ${viz.translateY})`);

    viz.setupData();
  }

  setupData() {
    var viz = this;

    const pack = (packData) =>
      d3.pack().size([viz.width, viz.width]).padding(3)(
        d3
          .hierarchy(packData)
          .sum((d) => d.value)
          .sort((a, b) => b.value - a.value)
      );

    const root = pack(viz.packData);

    viz.dataFiltered = root;

    viz.updateViz();
  }

  updateViz() {
    var viz = this;
    let view;

    if (viz.dataFiltered !== undefined) {
      viz.g
        .append("rect")
        .attr("class", "pack-back")
        .classed("hide", true)
        .attr("fill", Config.color(0))
        .attr("stroke", viz.stroke)
        .attr("stroke-width", viz.strokeWidth)
        .attr("width", viz.width)
        .attr("height", viz.height)
        .attr("transform", `translate(${-viz.width / 2}, ${-viz.height / 2})`);

      if (viz.showBoundingRectangle) {
        d3.select(".pack-back").classed("hide", false);
      }

      const node = viz.g
        .selectAll("circle")
        .data(viz.dataFiltered.descendants().slice(1))
        .join("circle")
        .attr("fill", (d) => {
          return d.children ? Config.color(d.depth) : "white";
        })
        .attr("stroke", viz.stroke)
        .attr("stroke-width", viz.strokeWidth)
        .attr("pointer-events", (d) => (!d.children ? "none" : null));

      node.attr(
        "transform",
        `translate(${viz.width / 2}, ${viz.height / 2}) scale(0.5)`
      );

      const label = viz.g
        .append("g")
        .style("font", "10px sans-serif")
        .attr("pointer-events", "none")
        .attr("text-anchor", "middle")
        .selectAll("text")
        .data(viz.dataFiltered.descendants())
        .join("text")
        .style("fill-opacity", (d) => (d.parent === viz.dataFiltered ? 1 : 0))
        .style("display", (d) =>
          d.parent === viz.dataFiltered ? "inline" : "none"
        );

      zoomTo([viz.dataFiltered.x, viz.dataFiltered.y, viz.dataFiltered.r * 2]);

      function zoomTo(v) {
        const k = viz.width / v[2];

        view = v;

        label.attr(
          "transform",
          (d) => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`
        );
        node.attr(
          "transform",
          (d) => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`
        );
        node.attr("r", (d) => d.r * k);
      }

      function zoom(event, d) {
        const focus0 = focus;

        focus = d;

        const transition = svg
          .transition()
          .duration(event.altKey ? 7500 : 750)
          .tween("zoom", (d) => {
            const i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2]);
            return (t) => zoomTo(i(t));
          });

        label
          .filter(function (d) {
            return d.parent === focus || this.style.display === "inline";
          })
          .transition(transition)
          .style("fill-opacity", (d) => (d.parent === focus ? 1 : 0))
          .on("start", function (d) {
            if (d.parent === focus) this.style.display = "inline";
          })
          .on("end", function (d) {
            if (d.parent !== focus) this.style.display = "none";
          });
      }
    }
  }
}

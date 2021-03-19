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
  constructor(
    _parentElement,
    {
      fontData = {},
      fontText = "DATAVIZ ROMÂNIA",
      isHidden = 0,
      width = 400,
      height = 500,
      fontFamily = "ministory-svg",
      fontSize = 170,
    } = { fontData, fontText, isHidden, width, height, fontFamily, fontSize }
  ) {
    this.parentElement = _parentElement;
    this.fontText = fontText;
    this.fontData = fontData;
    this.isHidden = isHidden;
    this.width = width;
    this.height = height;
    this.fontFamily = fontFamily;
    this.fontSize = fontSize;

    this.initViz();
  }

  initViz() {
    var viz = this;

    viz.g = d3
      .select(viz.parentElement)
      .append("g")
      .attr("class", "font-group")
      .classed("hide", viz.isHidden)
      .attr("fill", Config.color(0))
      .attr("width", viz.width)
      .attr("height", viz.height)
      .attr("transform", `translate(460, 220)`);

    viz.setupData();
  }

  setupData() {
    var viz = this;

    viz.dataFiltered = viz.fontData;

    viz.updateViz();
  }

  updateViz() {
    var viz = this;

    if (viz.dataFiltered !== undefined) {
      const textGroup = viz.g
        .append("g")
        .attr("class", "text-group")
        .classed("hide", true);

      textGroup
        .append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("dy", ".35em")
        .attr("class", "logo-text")
        .attr("font-family", viz.fontFamily)
        .attr("font-size", viz.fontSize)
        .attr("fill", Config.fill)
        .text("Dataviz");

      textGroup
        .append("text")
        .attr("x", 0)
        .attr("y", 180)
        .attr("dy", ".35em")
        .attr("class", "logo-text")
        .attr("font-family", viz.fontFamily)
        .attr("font-size", viz.fontSize)
        .attr("fill", Config.fill)
        .text("România");

      if (viz.g.node()) {
        viz.g.node().append(viz.dataFiltered.documentElement);
        viz.g
          .select("svg")
          .attr("transform", `translate(-6, -87)`) // cover mini story text
          .attr("class", "logo-svg");
      }
    }
  }
}

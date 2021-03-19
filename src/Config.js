import { range, ticks } from "d3-array";
import { interpolateRainbow } from "d3-scale-chromatic";
import {
  scaleOrdinal,
  scaleLinear,
  scaleQuantize,
  scaleQuantile,
  scaleSequential,
} from "d3-scale";
import { interpolate, interpolateHcl } from "d3-interpolate";
import { transition } from "d3-transition";
import { easeElastic } from "d3-ease";

const d3 = Object.assign(
  {},
  {
    interpolateRainbow,
    range,
    ticks,
    scaleOrdinal,
    scaleLinear,
    scaleQuantize,
    scaleQuantile,
    scaleSequential,
    interpolate,
    interpolateHcl,
    transition,
    easeElastic,
  }
);

// set the dimensions and margins of the graph
export const margin = { top: 50, left: 50, bottom: 20, right: 50 },
  width = 1200 - margin.left - margin.right,
  height = 630 - margin.top - margin.bottom,
  svg_width = width + margin.left + margin.right,
  svg_height = height + margin.top + margin.bottom,
  parentElement = ".zoomable-group",
  stroke = "#888",
  strokeWidth = "0.5",
  fill = "#222";

export const color = d3
  .scaleOrdinal()
  .domain([0, 1, 2, 3])
  .range(["#bdfde2", "#34fcfc", "#83c3fe", "#fff"]);

export const simple = () => "#bdfde2";
export const judete = () => "#bdfde2";

export const buffer = d3
  .scaleOrdinal()
  .domain([10, 20, 30, 40, 50, 60, 70, 80, 90, 100])
  .range([
    "#bfffe4",
    "#b2f2ea",
    "#a4e5f0",
    "#97d7f6",
    "#8acafc",
    "#7acafe",
    "#69d6fe",
    "#57e3fd",
    "#45f0fd",
    "#34fcfc",
  ]);

export const style1 = d3
  .scaleLinear()
  .domain([10, 55, 100])
  .range(["#bdfde2", "#83c3fe", "#34fcfc"])
  .interpolate(d3.interpolateHcl);
export const style2 = d3
  .scaleLinear()
  .domain(d3.ticks(0, 101, 3))
  .range(["#bdfde2", "#83c3fe", "#34fcfc"]);
export const style3 = d3
  .scaleLinear()
  .domain(d3.ticks(0, 101, 3))
  .range(["#bdfde2", "#34fcfc", "#83c3fe"]);
// .scaleQuantile()
// .domain([10, 100])
// .range(["#bdfde2", "#34fcfc", "#83c3fe"]);
export const style4 = d3
  .scaleLinear()
  .domain([10, 55, 100])
  .range(["#bdfde2", "#34fcfc", "#83c3fe"])
  .interpolate(d3.interpolateHcl);
// .scaleSequential()
// .domain([0, 99])
// .interpolator(d3.interpolate("#bdfde2", "#34fcfc"));

export const t = d3
  .transition()
  .delay(500)
  .duration(1000)
  .ease(d3.easeElastic.amplitude(1).period(1));
export const tFont = d3
  .transition()
  .delay(1500)
  .duration(3000)
  .ease(d3.easeElastic.amplitude(1).period(1));

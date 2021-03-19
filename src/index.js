import styles from "./sass/main.scss";
import * as Config from "./Config";
import { json, xml } from "d3-fetch";
import { arc } from "d3-shape";
import { select, selectAll } from "d3-selection";
import { nest } from "d3-collection";
import { geoPath, geoTransform } from "d3-geo";

import MapChart from "./models/MapChart.js";
import PackChart from "./models/PackChart.js";
import FontChart from "./models/FontChart.js";

// Create a d3 Object with a subset of functions
const d3 = Object.assign(
  {},
  {
    json,
    xml,
    arc,
    select,
    selectAll,
    nest,
    geoPath,
    geoTransform,
  }
);

let mapChart, packChart, fontChart;

const responsivefy = (svg) => {
  if (svg.node()) {
    // https://brendansudol.com/writing/responsive-d3
    const container = d3.select(svg.node().parentNode),
      width = parseInt(svg.style("width"), 10),
      height = parseInt(svg.style("height"), 10),
      aspect = width / height;

    const resize = () => {
      const targetWidth = parseInt(container.style("width"));
      svg.attr("width", targetWidth);
      svg.attr("height", Math.round(targetWidth / aspect));
    };

    svg
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMinYMid")
      .call(resize);

    d3.select(window).on("resize." + container.attr("id"), resize);
  }
};

const svg = d3
  .select("#chart")
  .append("svg")
  .attr("class", "chart-group")
  .attr("width", Config.svg_width)
  .attr("height", Config.svg_height)
  .call(responsivefy);

const layersGroup = svg
  .append("g")
  .attr("class", "zoomable-group")
  .attr("transform", `translate(0, 0)`);

// Load data
const promises = [
  d3.json("data/judete_bundle_wgs84.json"),
  d3.json("data/pack.json"),
  d3.xml("data/ministory.svg"),
  // d3.xml("data/averia-sans.svg"),
];

Promise.all(promises)
  .then((data) => {
    changeView(data);
    setActions();
  })
  .catch((error) => console.log(error));

const changeView = (data) => {
  const geoData = data[0];
  const packData = data[1];
  const fontData = data[2];

  // Set object for map
  mapChart = new MapChart(".zoomable-group", {
    groupId: "map",
    geoData,
    layer: "judete_buffer10_wgs84",
    showMerged: 0,
    isHidden: true,
  });

  // Set object for clusters
  packChart = new PackChart(".zoomable-group", {
    groupId: "pack",
    packData,
    showBoundingRectangle: 0,
    isHidden: true,
  });

  // Set object for font
  fontChart = new FontChart(".chart-group", {
    // fontChart = new FontChart(".zoomable-group", {
    fontText: "DATAVIZ ROMÂNIA",
    fontData,
    isHidden: 0,
  });
};

const setActions = () => {
  try {
    // Toggle Layers - map, pack and font
    const toggleGroup = (checked, id, hideClass) => {
      hideClass = hideClass || "hide";
      if (checked) {
        d3.selectAll(id).classed(hideClass, false);
      } else {
        d3.selectAll(id).classed(hideClass, true);
      }
    };

    d3.select("#toggle-map").on("click", function () {
      toggleGroup(d3.select(this).node().checked, "#map");
    });
    d3.select("#toggle-map").node().checked = true;
    d3.select("#toggle-map").dispatch("click");

    d3.select("#toggle-pack").on("click", function () {
      toggleGroup(d3.select(this).node().checked, "#pack");
    });
    d3.select("#toggle-pack").node().checked = true;
    d3.select("#toggle-pack").dispatch("click");

    d3.select("#toggle-pack-background").on("click", function () {
      toggleGroup(d3.select(this).node().checked, ".pack-back");
    });

    d3.select("#toggle-editor").node().checked = true;
    d3.select("#toggle-editor").on("click", function () {
      toggleGroup(d3.select(this).node().checked, ".editor", "hide-editor");
    });

    // Change map style - simple, QGIS, and other tests
    const styleMap = (d) => {
      const currentStyle = d3.select('input[type="radio"]:checked').node()
        .value;

      mapChart.setupData(currentStyle);
    };

    d3.select("#color-simple").node().checked = true;
    mapChart.setupData("simple");
    d3.selectAll('input[type="radio"]').on("click", (d) => styleMap(d));

    // Change stroke width
    d3.select("#stroke").property("value", 0.5);
    d3.select("#stroke").on("input", function () {
      const strokeWidth = +this.value;

      d3.select("#stroke-value").text(strokeWidth);

      svg.selectAll("*").transition(Config.t).attr("stroke-width", strokeWidth);
    });

    // Change font
    const letterSpacing = {
      "averia-sans": "-0.2rem",
      copasetic: "1.2rem",
      "fashion-victim": "-1.6rem",
      freeds: "1rem",
      "josefin-sans": "-1rem",
    };

    const transitionFonts = (currentFont, t) => {
      if (currentFont === "ministory-svg") {
        d3.selectAll(".text-group").classed("hide", true);
        d3.selectAll(".logo-svg").classed("hide", false);
      } else {
        d3.selectAll(".text-group").classed("hide", false);
        d3.selectAll(".logo-svg").classed("hide", true);
        d3.selectAll(".logo-text")
          .transition(Config.tFont)
          .attr("class", `logo-text ${currentFont}`)
          .style("letter-spacing", letterSpacing[currentFont] || "0");
      }
    };

    d3.selectAll(".font__text").on("touchstart mouseover", function () {
      const currentFont = d3.select(this).node().id;

      d3.select("body")
        .transition(Config.tFont)
        .attr("class", `${currentFont}`);
      d3.select(".title")
        .transition(Config.tFont)
        .attr("class", `title ${currentFont}`);
      transitionFonts(currentFont, Config.tFont);
    });
  } catch (err) {
    console.log(err);
  }

  // Collapse navigation on button and below 850px
  const navbar = d3.select("#navbar-collapse");
  const togglerButton = d3.select("#navbar-toggler").on("click", () => {
    console.log("--------------------------");
    if (navbar.style("display") === "block") {
      navbar.style("display", "none");
    } else {
      navbar.style("display", "block");
    }
  });

  d3.select(window).on("resize", () => {
    if (window.innerWidth >= 850) {
      navbar.style("display", "block");
    } else {
      navbar.style("display", "none");
    }
  });
};

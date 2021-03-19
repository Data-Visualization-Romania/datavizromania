import * as Config from "../Config.js";
import { select, selectAll } from "d3-selection";
import * as topojson from "topojson";
import { geoAlbers, geoTransverseMercator, geoPath } from "d3-geo";

// Create a d3 Object with a subset of functions
const d3 = Object.assign(
  {},
  {
    select,
    selectAll,
    geoAlbers,
    geoTransverseMercator,
    geoPath,
  },
  topojson
);

// MapChart Class
export default class MapChart {
  constructor(
    _parentElement,
    {
      groupId = "",
      geoData = {},
      layer = "judete_buffer10_wgs84",
      showMerged = 0,
      isHidden = true,
      stroke = Config.stroke,
      strokeWidth = Config.strokeWidth,
      width = 420,
      height = 300,
    } = {
      groupId,
      geoData,
      layer,
      showMerged,
      isHidden,
      stroke,
      strokeWidth,
      width,
      height,
    }
  ) {
    this.parentElement = _parentElement;
    this.groupId = groupId;
    this.geoData = geoData;
    this.layer = layer;
    this.showMerged = showMerged;
    this.stroke = stroke;
    this.strokeWidth = strokeWidth;
    this.isHidden = isHidden;
    this.width = width;
    this.height = height;

    this.initViz();
  }

  initViz() {
    var viz = this;

    viz.g = d3
      .select(viz.parentElement)
      .append("g")
      .attr("id", viz.groupId)
      .attr("class", "map-features")
      .classed("hide", viz.isHidden)
      .attr("width", viz.width)
      .attr("height", viz.height)
      .attr("transform", `translate(33, 170)`);

    viz.setupData();
  }

  setupData(currentStyle) {
    var viz = this;

    let currentLayer;
    viz.currentStyle = currentStyle || "simple";

    currentLayer =
      currentStyle === "simple"
        ? "judete_unite_wgs84"
        : currentStyle === "judete"
        ? "judete_wgs84"
        : "judete_buffer10_wgs84";

    viz.layer = currentLayer || viz.layer;

    viz.projection = d3
      .geoAlbers()
      .center([24.7731, 45.7909])
      .rotate([-14, 3.3, -10])
      .parallels([37, 54])
      .scale(5000);
    // .geoTransverseMercator()
    // .translate([viz.width / 2, viz.height / 2])
    // .scale(165)
    // .clipAngle(90);
    // .geoTransverseMercator()
    // .scale(50)
    // .translate([viz.width / 2, viz.height / 2])
    // .rotate([25, 0, 0]);

    viz.geoCounties = topojson.feature(
      viz.geoData,
      viz.geoData.objects[viz.layer]
    ).features;

    viz.geojsonFeatures = topojson.feature(viz.geoData, {
      type: "GeometryCollection",
      geometries: viz.geoData.objects[viz.layer].geometries,
    });

    // viz.land = topojson.merge(
    //   viz.geoData,
    //   viz.geoData.objects[viz.layer].geometries
    // );

    viz.dataFiltered = viz.geoCounties;

    viz.updateViz();
  }

  updateViz() {
    var viz = this;

    if (viz.dataFiltered !== undefined) {
      const thisMapPath = d3
        .geoPath()
        .projection(
          viz.projection.fitSize([viz.width, viz.height], viz.geojsonFeatures)
        );

      viz.path_update = d3
        .select(".map-features")
        .selectAll("path")
        .data(viz.dataFiltered);

      viz.path_update.exit().attr("class", "exit").remove();

      viz.path_enter = viz.path_update
        .enter()
        .append("path")
        .attr("class", "land")
        .attr("stroke", viz.stroke)
        .attr("stroke-width", viz.strokeWidth)
        .merge(viz.path_update)
        .attr("d", thisMapPath)
        .attr("fill", (d) =>
          Config[viz.currentStyle](
            viz.layer === "judete_buffer10_wgs84" ? d.properties.ZONE : ""
          )
        );

      viz.path_enter
        .transition(Config.t)
        .attr("fill", (d) =>
          Config[viz.currentStyle](
            viz.layer === "judete_buffer10_wgs84" ? d.properties.ZONE : ""
          )
        );
      viz.path_enter.append("title").text((d) => d.id);
    }
  }
}

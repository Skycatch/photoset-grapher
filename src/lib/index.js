'use strict';

import * as _3d from 'd3-3d';
import * as scale from 'd3-scale';
import * as transition from 'd3-transition';
import * as drag from 'd3-drag';
import * as array from 'd3-array';
import * as color from 'd3-color';
import { select, selectAll, mouse } from 'd3-selection';
import { event as currentEvent } from 'd3-selection';

const d3 = Object.assign({},
  { mouse, select, selectAll },
  scale,
  transition,
  drag,
  array,
  color,
  _3d
);

const kGridCells = 10;
const kScale = 20;

class PhotosetGrapher {

  constructor (id) {

    this.datasetId = id;
    this.target;
    this.cartesianSystem;
    this.width, this.height;
    this.grid3d, this.point3d, this.yScale3d;
    this.intervalAlt;
    this.minimumAlt;
  }

  boot (target, coordinates, basePoint) {

    this.target = target;
    this.coordinates = coordinates;
    this.basePoint = basePoint;
    this.cartesianSystem = d3.select(`svg${this.target}`)
    this.width = parseFloat(this.cartesianSystem.style('width'));
    this.height = parseFloat(this.cartesianSystem.style('height'));
    this.init();
  }

  init () {

    this.origin = [this.width / 2, this.height / 2];
    this.scatter = [];
    this.yLine = [];
    this.xGrid = [];
    this.beta = 0;
    this.alpha = 0;
    this.startAngle = Math.PI/4;

    this.cartesianSystem
      .call(
        d3.drag()
          .on('drag', this.dragged.bind(this))
          .on('start', this.dragStart.bind(this))
          .on('end', this.dragEnd.bind(this))
      ).append('g');
    this.color = d3.scaleOrdinal(d3.schemeCategory20);

    this.mx, this.my, this.mouseX, this.mouseY;

    this.grid3d = d3._3d()
      .shape('SURFACE', kScale)
      .origin(this.origin)
      .rotateY(this.startAngle)
      .rotateX(-this.startAngle)
      .scale(kScale);

    this.point3d = d3._3d()
      .x(function(d){ return d.x; })
      .y(function(d){ return d.y; })
      .z(function(d){ return d.z; })
      .origin(this.origin)
      .rotateY(this.startAngle)
      .rotateX(-this.startAngle)
      .scale(kScale);

    this.yScale3d = d3._3d()
      .shape('LINE_STRIP')
      .origin(this.origin)
      .rotateY( this.startAngle)
      .rotateX(-this.startAngle)
      .scale(kScale);

    let cnt = 0;
    let minX = 100000;
    let minY = 100000;
    let minZ = 100000;
    let maxX = 0;
    let maxY = 0;
    let maxZ = 0;

    if (this.basePoint) {
      if (Array.isArray(this.basePoint)) {
        minZ = Math.abs(this.basePoint[2]);
      }
      else {
        minZ = Math.abs(this.basePoint.z);
      }
    }

    this.coordinates.forEach((coord, i) => {

      if (Array.isArray(coord)) {
        if (minX > Math.abs(coord[1])) minX = Math.abs(coord[1]);
        if (maxX < Math.abs(coord[1])) maxX = Math.abs(coord[1]);
        if (minY > Math.abs(coord[0])) minY = Math.abs(coord[0]);
        if (maxY < Math.abs(coord[0])) maxY = Math.abs(coord[0]);
        if (coord[2]) {
          if (minZ > Math.abs(coord[2])) minZ = Math.abs(coord[2]);
          if (maxZ < Math.abs(coord[2])) maxZ = Math.abs(coord[2]);
        }
      }
      else {
        if (minX > Math.abs(coord.x)) minX = Math.abs(coord.x);
        if (maxX < Math.abs(coord.x)) maxX = Math.abs(coord.x);
        if (minY > Math.abs(coord.y)) minY = Math.abs(coord.y);
        if (maxY < Math.abs(coord.y)) maxY = Math.abs(coord.y);
        if (Math.abs(coord.z) && minZ > Math.abs(coord.z)) minZ = Math.abs(coord.z);
        if (Math.abs(coord.z) && minZ < Math.abs(coord.z)) maxZ = Math.abs(coord.z);
      }
    });

    this.coordinates.forEach((coord, i) => {

      if (Array.isArray(coord)) {
        if (coord[2]) {
          this.scatter.push({z: ((Math.abs(coord[1]) - minX) / (maxX - minX)) * -kGridCells, x: ((Math.abs(coord[0]) - minY) / (maxY - minY)) * -kGridCells, y: ((Math.abs(coord[2]) - minZ) / (maxZ - minZ)) * -kGridCells, id: `point_${i}`});
        }
        else {
          this.scatter.push({z: ((Math.abs(coord[1]) - minX) / (maxX - minX)) * -kGridCells, x: ((Math.abs(coord[0]) - minY) / (maxY - minY)) * -kGridCells, y: 0, id: `point_${i}`});
        }
      }
      else {0
        this.scatter.push({z: ((Math.abs(coord.x - minX)) / (maxX - minX)) * -kGridCells, x: ((Math.abs(coord.y) - minY) / (maxY - minY)) * -kGridCells, y: ((Math.abs(coord.z) - minZ) / (maxZ - minZ)) * -kGridCells || 0, id: `point_${i}`});
      }
    });


    for (let z = -kGridCells; z < kGridCells; z++) {
      for (let x = -kGridCells; x < kGridCells; x++) {
        this.xGrid.push([x, 1, z]);
      }
    }

    this.intervalAlt = (maxZ - minZ) / kGridCells;
    this.minimumAlt = minZ;
    d3.range(-1, kGridCells + 1, 1).forEach((d) => {
      this.yLine.push([-kGridCells, -d, -kGridCells]);
    });

    const data = {
      grid3d: this.grid3d(this.xGrid),
      point3d: this.point3d(this.scatter),
      yScale3d: this.yScale3d([this.yLine])
    };

    this.processData(data, 1000);
  }

  processData (data, tt) {

    const key = function(d){ return d.id; };

    /* ----------- GRID ----------- */

    this.xGrid = this.cartesianSystem.selectAll('path.grid').data(data.grid3d, key);

    this.xGrid
      .enter()
      .append('path')
      .attr('class', '_3d grid')
      .merge(this.xGrid)
      .attr('stroke', 'black')
      .attr('stroke-width', 0.3)
      .attr('fill', (d) => { return d.ccw ? 'lightgrey' : '#717171'; })
      .attr('fill-opacity', 0.9)
      .attr('d', data.grid3d.draw);

    this.xGrid.exit().remove();

    /* ----------- POINTS ----------- */

    const points = this.cartesianSystem.selectAll('circle').data(data.point3d, key);

    points
      .enter()
      .append('circle')
      .attr('class', '_3d')
      .attr('opacity', 0)
      .attr('cx', this.posPointX)
      .attr('cy', this.posPointY)
      .merge(points)
      .transition().duration(tt)
      .attr('r', 3)
      .attr('stroke', (d) => { return d3.color(this.color(d.id)).darker(3); })
      .attr('fill', (d) => { return this.color(d.id); })
      .attr('opacity', 1)
      .attr('cx', this.posPointX)
      .attr('cy', this.posPointY);

    points.exit().remove();

    /* ----------- y-Scale ----------- */

    const yScale = this.cartesianSystem.selectAll('path.yScale').data(data.yScale3d);

    yScale
      .enter()
      .append('path')
      .attr('class', '_3d yScale')
      .merge(yScale)
      .attr('stroke', 'black')
      .attr('stroke-width', .5)
      .attr('d', this.yScale3d.draw);

    yScale.exit().remove();

     /* ----------- y-Scale Text ----------- */

    const yText = this.cartesianSystem.selectAll('text.yText').data(data.yScale3d[0]);

    yText
      .enter()
      .append('text')
      .attr('class', '_3d yText')
      .attr('dx', '.3em')
      .merge(yText)
      .each(function(d){
        d.centroid = {x: d.rotated.x, y: d.rotated.y, z: d.rotated.z};
      })
      .attr('x', (d) => { return d.projected.x; })
      .attr('y', (d) => { return d.projected.y; })
      .text((d) => { return d[1] <= 0 ? (this.minimumAlt + (Math.abs(d[1]) * this.intervalAlt)).toFixed(1) : ''; });

    yText.exit().remove();

    d3.selectAll('._3d').sort(d3._3d().sort);
  }

  posPointX (d) {

    return d.projected.x;
  }

  posPointY (d) {

    return d.projected.y;
  }

  dragStart () {

    this.mx = currentEvent.x;
    this.my = currentEvent.y;
  }

  dragged () {

    this.mouseX = this.mouseX || 0;
    this.mouseY = this.mouseY || 0;
    this.beta = (currentEvent.x - this.mx + this.mouseX) * Math.PI / 230 ;
    this.alpha  = (currentEvent.y - this.my + this.mouseY) * Math.PI / 230  * (-1);

    const data = {
      grid3d: this.grid3d.rotateY(this.beta + this.startAngle).rotateX(this.alpha - this.startAngle)(this.xGrid),
      point3d: this.point3d.rotateY(this.beta + this.startAngle).rotateX(this.alpha - this.startAngle)(this.scatter),
      yScale3d: this.yScale3d.rotateY(this.beta + this.startAngle).rotateX(this.alpha - this.startAngle)([this.yLine]),
    };

    this.processData(data, 0);
  }

  dragEnd () {
    this.mouseX = currentEvent.x - this.mx + this.mouseX;
    this.mouseY = currentEvent.y - this.my + this.mouseY;
  }
}

module.exports = PhotosetGrapher;

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

const kScale = 20;
const kAminate = true;

const smartDivision = (a, b) => {

  let result = a / b;
  return isNaN(result) ? 0 : result;
}

class PhotosetGrapher {

  constructor () {

    this.target;
    this.cartesianSystem;
    this.width, this.height;
    this.grid3d, this.point3d, this.yScale3d, this.xScale3d, this.zScale3d;
    this.intervalY, this.intervalX, this.intervalZ;
    this.minimumY, this.minimumX, this.minimumZ;
    this.options = {};
  }

  boot (target, coordinates, basePoint) {

    this.target = target;
    this.coordinates = coordinates;
    this.basePoint = basePoint;
    this.cartesianSystem = d3.select(`svg${this.target}`)
    this.width = parseFloat(this.cartesianSystem.style('width'));
    this.height = parseFloat(this.cartesianSystem.style('height'));

    if (this.options && this.options.scale) {
      this.optionScale = this.options.scale % 2 === 0 ? this.options.scale : this.options.scale - 1;
    }
    else {
      this.optionScale = kScale;
    }

    if (this.options && this.options.animate !== undefined) {
      this.optionAnimate = this.options.animate;
    }
    else {
      this.optionAnimate = kAminate;
    }

    this.gridCells = this.optionScale / 2;
    this.init();
  }

  configure (options) {

    if (options && options.scale) {
      this.options.scale = options.scale;
    }
    if (options && options.animate !== undefined) {
      this.options.animate = options.animate;
    }
  }

  init () {

    this.origin = [this.width / 2, this.height / 2];
    this.scatter = [];
    this.yLine = [];
    this.xLine = [];
    this.zLine = [];
    this.xGrid = [];
    this.beta = 0;
    this.alpha = 0;
    this.startAngle = -Math.PI/30;

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
      .shape('SURFACE', this.optionScale)
      .origin(this.origin)
      .rotateY(this.startAngle)
      .rotateX(-this.startAngle)
      .scale(this.optionScale);

    this.point3d = d3._3d()
      .x(function(d){ return d.x; })
      .y(function(d){ return d.y; })
      .z(function(d){ return d.z; })
      .origin(this.origin)
      .rotateY(this.startAngle)
      .rotateX(-this.startAngle)
      .scale(this.optionScale);

    this.yScale3d = d3._3d()
      .shape('LINE_STRIP')
      .origin(this.origin)
      .rotateY(this.startAngle)
      .rotateX(-this.startAngle)
      .scale(this.optionScale);

    this.xScale3d = d3._3d()
      .shape('LINE_STRIP')
      .origin(this.origin)
      .rotateY(this.startAngle)
      .rotateX(-this.startAngle)
      .scale(this.optionScale);

    this.zScale3d = d3._3d()
      .shape('LINE_STRIP')
      .origin(this.origin)
      .rotateY(this.startAngle)
      .rotateX(-this.startAngle)
      .scale(this.optionScale);

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
        if (minX > Math.abs(coord[0])) minX = Math.abs(coord[0]);
        if (maxX < Math.abs(coord[0])) maxX = Math.abs(coord[0]);
        if (minY > Math.abs(coord[1])) minY = Math.abs(coord[1]);
        if (maxY < Math.abs(coord[1])) maxY = Math.abs(coord[1]);
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
          this.scatter.push({
            x: smartDivision((Math.abs(coord[0]) - minX), (maxX - minX)) * this.gridCells,
            y: smartDivision((Math.abs(coord[1]) - minY), (maxY - minY)) * this.gridCells,
            z: smartDivision((Math.abs(coord[2]) - minZ), (maxZ - minZ)) * this.gridCells,
            id: `point_${i}`
          });
        }
        else {
          this.scatter.push({
            x: smartDivision((Math.abs(coord[0]) - minX), (maxX - minX)) * this.gridCells,
            y: smartDivision((Math.abs(coord[1]) - minY), (maxY - minY)) * this.gridCells,
            z: 0,
            id: `point_${i}`
          });
        }
      }
      else {
        this.scatter.push({
          x: smartDivision((Math.abs(coord.x) - minX), (maxX - minX)) * this.gridCells,
          y: smartDivision((Math.abs(coord.y) - minY), (maxY - minY)) * this.gridCells,
          z: smartDivision((Math.abs(coord.z) - minZ), (maxZ - minZ)) * this.gridCells || 0,
          id: `point_${i}`
        });
      }
    });


    for (let y = -this.gridCells; y < this.gridCells; y++) {
      for (let x = -this.gridCells; x < this.gridCells; x++) {
        this.xGrid.push([x, y, 1]);
      }
    }

    this.intervalZ = (maxZ - minZ) / this.gridCells;
    this.minimumZ = minZ;

    this.intervalX = (maxX - minX) / this.gridCells;
    this.minimumX = minX;

    this.intervalY = (maxY - minY) / this.gridCells;
    this.minimumY = minY;

    d3.range(0, this.gridCells + 1, 1).forEach((d) => {
      this.xLine.push([d, 0, 0]);
      this.yLine.push([0, d, 0]);
      this.zLine.push([0, 0, d]);
    });

    const data = {
      grid3d: this.grid3d(this.xGrid),
      point3d: this.point3d(this.scatter),
      yScale3d: this.yScale3d([this.yLine]),
      xScale3d: this.xScale3d([this.xLine]),
      zScale3d: this.zScale3d([this.zLine])
    };

    this.processData(data, 1000);
    if (this.optionAnimate) this.animate(44);
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


    /* ----------- x-Scale ----------- */
    const xScale = this.cartesianSystem.selectAll('path.xScale').data(data.xScale3d);

    xScale
      .enter()
      .append('path')
      .attr('class', '_3d xScale')
      .merge(xScale)
      .attr('stroke', 'black')
      .attr('stroke-width', .5)
      .attr('d', this.xScale3d.draw);

    xScale.exit().remove();

     /* ----------- x-Scale Text ----------- */

    const xText = this.cartesianSystem.selectAll('text.xText').data(data.xScale3d[0]);

    // xText
    //   .enter()
    //   .append('text')
    //   .attr('class', '_3d xText')
    //   .attr('dx', '.3em')
    //   .merge(xText)
    //   .each(function(d){
    //     if (d) {
    //       d.centroid = {x: d.rotated.x, y: d.rotated.y, z: d.rotated.z};
    //     }
    //   })
    //   .attr('x', (d) => { return d.projected.x; })
    //   .attr('y', (d) => { return d.projected.y; })
    //   .text((d) => { return (this.minimumX + (Math.abs(d[0]) * this.intervalX)).toFixed(1) });

    // xText.exit().remove();

    d3.selectAll('._3d').sort(d3._3d().sort);


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

    // yText
    //   .enter()
    //   .append('text')
    //   .attr('class', '_3d yText')
    //   .attr('dx', '.3em')
    //   .merge(yText)
    //   .each(function(d){
    //     if (d) {
    //       d.centroid = {x: d.rotated.x, y: d.rotated.y, z: d.rotated.z};
    //     }
    //   })
    //   .attr('x', (d) => { return d.projected.x; })
    //   .attr('y', (d) => { return d.projected.y; })
    //   .text((d) => { return (this.minimumY + (Math.abs(d[1]) * this.intervalY)).toFixed(1) });

    // yText.exit().remove();

    d3.selectAll('._3d').sort(d3._3d().sort);

    /* ----------- z-Scale ----------- */

    const zScale = this.cartesianSystem.selectAll('path.zScale').data(data.zScale3d);

    zScale
      .enter()
      .append('path')
      .attr('class', '_3d zScale')
      .merge(zScale)
      .attr('stroke', 'black')
      .attr('stroke-width', .5)
      .attr('d', this.zScale3d.draw);

    zScale.exit().remove();

     /* ----------- y-Scale Text ----------- */

    const zText = this.cartesianSystem.selectAll('text.zText').data(data.zScale3d[0]);

    zText
      .enter()
      .append('text')
      .attr('class', '_3d zText')
      .attr('dx', '.3em')
      .merge(zText)
      .each(function(d){
        if (d) {
          d.centroid = {x: d.rotated.x, y: d.rotated.y, z: d.rotated.z};
        }
      })
      .attr('x', (d) => { return d.projected.x; })
      .attr('y', (d) => { return d.projected.y; })
      .text((d) => { return (this.minimumZ + (Math.abs(d[2]) * this.intervalZ)).toFixed(1) });

    zText.exit().remove();

    d3.selectAll('._3d').sort(d3._3d().sort);
  }

  posPointX (d) {

    return d.projected.x;
  }

  posPointY (d) {

    return d.projected.y;
  }

  dragStart () {
    if (this.animation) {
      clearInterval(this.animation);
    }
    this.mx = currentEvent.x;
    this.my = currentEvent.y;
  }

  dragged () {

    this.mouseX = this.mouseX || 0;
    this.mouseY = this.mouseY || 0;
    this.beta = (currentEvent.x - this.mx + this.mouseX) * Math.PI / 230 ;
    this.alpha  = (currentEvent.y - this.my + this.mouseY) * Math.PI / 130  * (-1);

    const data = {
      grid3d: this.grid3d.rotateY(this.beta + this.startAngle).rotateX(this.alpha - this.startAngle)(this.xGrid),
      point3d: this.point3d.rotateY(this.beta + this.startAngle).rotateX(this.alpha - this.startAngle)(this.scatter),
      yScale3d: this.yScale3d.rotateY(this.beta + this.startAngle).rotateX(this.alpha - this.startAngle)([this.yLine]),
      xScale3d: this.xScale3d.rotateY(this.beta + this.startAngle).rotateX(this.alpha - this.startAngle)([this.xLine]),
      zScale3d: this.zScale3d.rotateY(this.beta + this.startAngle).rotateX(this.alpha - this.startAngle)([this.zLine])
    };

    this.processData(data, 0);
  }

  dragEnd () {
    this.mouseX = currentEvent.x - this.mx + this.mouseX;
    this.mouseY = currentEvent.y - this.my + this.mouseY;
  }

  animate (tt) {

    this.animation = setInterval(() => {
      this.beta += Math.PI/180;
      this.alpha += 0;
      const data = {
        grid3d: this.grid3d.rotateY(this.beta + this.startAngle).rotateX(this.alpha - this.startAngle)(this.xGrid),
        point3d: this.point3d.rotateY(this.beta + this.startAngle).rotateX(this.alpha - this.startAngle)(this.scatter),
        yScale3d: this.yScale3d.rotateY(this.beta + this.startAngle).rotateX(this.alpha - this.startAngle)([this.yLine]),
        xScale3d: this.xScale3d.rotateY(this.beta + this.startAngle).rotateX(this.alpha - this.startAngle)([this.xLine]),
        zScale3d: this.zScale3d.rotateY(this.beta + this.startAngle).rotateX(this.alpha - this.startAngle)([this.zLine])
      };
      this.processData(data, 0);
    }, tt);
  }
}

module.exports = PhotosetGrapher;

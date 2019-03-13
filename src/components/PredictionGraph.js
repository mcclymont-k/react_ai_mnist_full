import React, { Component } from 'react';
import * as d3 from "d3";

class PredictionGraph extends Component {
  constructor() {
    super()
    this.state = {
      newData: [300.12, 399.13]
    }
  }
  componentDidMount() {
    this.mainChartRun()
  }
  mainChartRun() {
  const height = 400;
  const width = 400;
  const barWidth = 40;
  const barOffset = 2;

  let xAxisScale = d3.scaleBand()
    .domain(['3', '7'])
    .rangeRound([0,( width - 40)])
  let yAxisScale = d3.scaleLinear()
    .rangeRound([0, (40 - height)])

  let xAxis = d3.axisBottom()
    .scale(xAxisScale)
  let yAxis = d3.axisLeft()
    .scale(yAxisScale)

  let animateDuration = 200
  let animateDelay = 100

  // Prevents duplication by removing svg on each re render
  let removeChart = d3.selectAll('svg').remove();

  let mainChart = d3.select('.mainChart')
  mainChart.append('svg')
      .attr('width', width)
      .attr('height', height)
      .style('background', 'black')
      .selectAll('rect')
        .data(this.props.outputs)
          .enter().append('rect')
          .style('fill', 'white')
          .attr('width', barWidth)
          .attr('height', 0)
          .attr('x', function(d, i) {
            return ((i + 1) * 180) - 70
          })
          .attr('y', function(d) {
            console.log(height * d)
            return (height - ((height - 40) * d) - 20)
          })

  d3.select('svg').append('g')
    .attr("transform", "translate(40, " + (height - 20) + ")")
    .style('stroke', 'white')
    .call(xAxis)
  d3.select('svg').append('g')
    .attr('transform', 'translate(40, ' + (height - 20) + ')')
    .style('stroke', 'white')
    .call(yAxis)

  let allRects = d3.selectAll('rect')
    allRects.transition()
      .attr('height', function(d) {
        return (height - 40) * d
      })
      .ease(d3.easeLinear)
      .duration(animateDuration)
}
  render() {
    return (
      <div className='mainChart' style={{marginLeft: '20px'}}>
        {this.mainChartRun()}
      </div>
    )
  }
}

export default PredictionGraph;

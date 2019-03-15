import React, { Component } from 'react';
import '../CSS/canvas.css';
import axios from 'axios';
import Prediction from './Prediction';


var flag = false,
      prevX = 0,
      currX = 0,
      prevY = 0,
      currY = 0,
      dot_flag = false;

var x = "white",
    y = 10


class Canvas extends Component {
  constructor() {
    super()
    this.state = {
      predictionPresent: false,
      prediction: null
    }
  }
  findxy(res, e) {
    if (res === 'down') {
      prevX = currX;
      prevY = currY;
      currX = e.clientX - this.canvas.offsetLeft;
      currY = e.clientY - this.canvas.offsetTop;

      flag = true;
      dot_flag = true;
      if (dot_flag) {
        this.ctx.beginPath();
        this.ctx.fillStyle = x;
        this.ctx.fillRect(currX, currY, 2, 2);
        this.ctx.closePath();
        dot_flag = false;
      }
    }
    if (res === 'up' || res === "out") {
      flag = false;
    }
    if (res === 'move') {
      if (flag) {
        prevX = currX;
        prevY = currY;
        currX = e.clientX - this.canvas.offsetLeft;
        currY = e.clientY - this.canvas.offsetTop;
        this.draw();
      }
    }
  }
  draw() {
    this.ctx.beginPath();
    this.ctx.moveTo(prevX, prevY);
    this.ctx.lineTo(currX, currY);
    this.ctx.strokeStyle = x;
    this.ctx.lineWidth = y;
    this.ctx.stroke();
    this.ctx.closePath();
  }

  clearCanvas() {
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, this.w, this.h);
    this.removePrediction();
  }

  removePrediction() {
    this.setState({
      predictionPresent: false,
      prediction: null
    })
  }

  exportData() {
    let data = new FormData();
    this.canvas.toBlob(blob => {
      data.append('data', blob);
      axios.post('http://localhost:5000/predict', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
        .then(res => this.showPrediction(res));
      })
  }

  showPrediction(preds) {
    let rawOutputs = preds.data.outputs
    let outputsArray = rawOutputs.slice(8, -2).split(',').map(n => parseFloat(n))
    this.setState({
      predictionPresent: true,
      prediction: preds.data.prediction,
      outputs: outputsArray
    });
  }

  componentDidMount() {
    this.canvas = document.getElementById('can')
    this.ctx = this.canvas.getContext("2d")
    this.ctx.fillStyle = 'black';
    this.w = this.canvas.width
    this.h = this.canvas.height
    this.ctx.fillRect(0, 0, this.w, this.h);
    this.canvas.addEventListener("mousemove", (e) =>
      this.findxy('move', e)
    , false)
    this.canvas.addEventListener("mousedown", (e) =>
      this.findxy('down', e)
    , false)
    this.canvas.addEventListener("mouseup", (e) =>
      this.findxy('up', e)
    , false)
    this.canvas.addEventListener("mouseout", (e) =>
      this.findxy('out', e)
    , false)
  }

  render() {
    return (
      <div className='appContainer'>
        <h2 style={{textAlign: 'center', fontFamily: "'Roboto Slab', serif", fontSize: '40px'}}>Full MNIST Number Predictor</h2>
        <h3 style={{textAlign: 'center', width: "40%", fontSize: '15px', marginBottom:'10px'}}>Use the black square to draw a number between 0 & 9. Once you have drawn the number click the predict button to retrieve the predicted charachter and the associated confidence of the prediction. Bigger drawings tend to be more accurate.</h3>
        <div className='drawingBox'>
          <canvas id="can" width="280" height="280"></canvas>
        </div>
        <div className='buttonBox'>
          <button onClick={this.exportData.bind(this)} className='predictButton'>PREDICT</button>
          <button onClick={this.clearCanvas.bind(this)} className='clearButton'>X</button>
        </div>
        <Prediction prediction={this.state.prediction}
                    outputs={this.state.outputs}/>
      </div>
    )
  }

}

export default Canvas

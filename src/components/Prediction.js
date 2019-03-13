import React, { Component } from 'react';
import PredictionGraph from './PredictionGraph';

class Prediction extends Component {
  render() {
    return (
      <div>

        {
          this.props.prediction
            ? <div className='predictionBox'>
                <span style={{fontSize: '40px', fontWeight: 'bold', margin: '20px'}}>{this.props.prediction}</span>
                <PredictionGraph outputs={this.props.outputs}/>
              </div>
            : []
        }
      </div>
    )
  }
}

export default Prediction

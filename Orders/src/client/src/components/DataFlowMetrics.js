import React, {Component} from 'react';

export default class DataFlowMetrics extends Component {
    render() {
       
        return (
            <div>
                <div className="form-content">
                    <p className="form-content-title">Queries per second</p>
                    <p className="form-content-value">{this.props.qps}</p>
                </div>
                <div>
                    <p className="form-content-title">Average latency</p>
                    <p className="form-content-value">{this.props.average_transaction_time} ms</p>
                </div>
            </div>
        );
    }
}
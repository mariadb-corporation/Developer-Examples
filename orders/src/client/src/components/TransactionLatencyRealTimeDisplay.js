import React, {Component} from 'react';
import RTChart from 'react-rt-chart';

export default class TransactionLatencyRealTimeDisplay extends Component {
    render() {
        var data = {
            date: new Date(),
            Latency: this.props.transaction_execution_time !== undefined ? this.props.transaction_execution_time : 0
        };
       
        return (
            <div>
                <p className="chart-title">Transaction latency per second</p>
                <RTChart fields={['Latency']} data={data} />
            </div>
        );
    }
}
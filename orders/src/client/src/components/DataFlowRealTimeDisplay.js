import React, {Component} from 'react';
import RTChart from 'react-rt-chart';

export default class DataFlowRealTimeDisplay extends Component {
    render() {
        var data = {
            date: new Date(),
            Reads: this.props.read_count !== undefined ? this.props.read_count : 0, 
            Writes: this.props.write_count !== undefined ? this.props.write_count : 0
        };

        return (
            <div>
                <p className="chart-title">Reads and Writes per second</p>
                <RTChart fields={['Reads','Writes']} data={data} />
            </div>
        );
    }
}
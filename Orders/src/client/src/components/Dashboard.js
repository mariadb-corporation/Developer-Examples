import React, {Component} from 'react';
import DataFlowControlModule from './DataFlowControlModule';
import DataFlowMetrics from './DataFlowMetrics';
import DataFlowRealTimeDisplay from './DataFlowRealTimeDisplay';
import TransactionLatencyRealTimeDisplay from './TransactionLatencyRealTimeDisplay';

export default class Dashboard extends Component {

    constructor(props) {
        super(props);
        
        // Default values
        this.state = {
            showConnectionOptions: false,
            connection_id: 0,
            latest_read_count: 0,
            latest_write_count: 0,
            latest_execution_time: 0,
            transaction_times: [],
            average_transaction_time: 0,
            configuration: {
                traffic_multiplier: 1,
                read_percentage: 90,
                write_percentage: 10,
                variation_percentage: 20
            }
        };

        this.onChangeConnectionOption = this.onChangeConnectionOption.bind(this);
    }

    componentDidMount() {
        setInterval(() => this.evalConfig(), 1000);
    }
 
    async evalConfig() {
        let { read_percentage, write_percentage } = this.state.configuration;
        let qps = this.getQueryCount();
        let read_count = Math.round(qps*(read_percentage/100));
        let write_count = Math.round(qps*(write_percentage/100));
        let transaction_response_details = await this.executeTransaction(read_count, write_count);
        let transaction_times = this.state.transaction_times;
        transaction_times.push(transaction_response_details.execution_time);
        
        var transaction_times_total = 0;

        for(var i = 0; i < transaction_times.length; i++) {
            transaction_times_total += transaction_times[i];
        }

        var average_transaction_time = (transaction_times_total / transaction_times.length).toFixed(2);

        this.setState({
            qps,
            latest_read_count: read_count,
            latest_write_count: write_count,
            latest_execution_time: transaction_response_details.execution_time,
            transaction_times,
            average_transaction_time
        });
    }

    async executeTransaction(read_count, write_count) {
        var { connection_id }  = this.state;
        const response = await fetch('/api/orders?c=' + connection_id + '&r=' + read_count + "&w=" + write_count);
        const body = await response.json();
        if (response.status !== 200) {
            throw Error(body.message) 
        } 
        return body;
    }; 

    getQueryCount() {
        var { traffic_multiplier, variation_percentage } = this.state.configuration;
        var queries_base_count = 20 * traffic_multiplier;
        var min = queries_base_count - (queries_base_count * (variation_percentage/100)); 
        var max = queries_base_count + (queries_base_count * (variation_percentage/100));   
        return Math.floor(Math.random() * (+max - +min)) + +min; 
    }

    onConfigurationChanged(configuration) {
        this.setState({ configuration });
    }

    clickCount = 0;
    lastClicked = null;

    onSecretClick() {
        let clickedTime = Date.now();
        if (this.lastClicked !== null && ((clickedTime - this.lastClicked) <= 500) && this.clickCount === 1) {
            this.setState({ showConnectionOptions: !this.state.showConnectionOptions });
            this.clickCount = 0;
        }
        else {
            this.clickCount = 1;
            this.lastClicked = clickedTime;
        }
    }

    onChangeConnectionOption(event) {
        this.setState({ 
            showConnectionOptions: false,
            connection_id: event.target.value 
        });
    }

    render() {
        return (
            <div className="form-main">
                <div className={this.state.showConnectionOptions ? '' : 'hidden'}>
                    <select onChange={this.onChangeConnectionOption}>
                        <option value="0">Connection 1</option>
                        <option value="1">Connection 2</option>
                        <option value="2">Connection 3</option>
                    </select> 
                </div>
                <div className="form-content">
                    <div className="float-left div-width-50 form-sub-content">
                        <div><DataFlowControlModule onConfigurationChanged={(configuration) => this.onConfigurationChanged(configuration)} /></div>
                    </div>
                    <div className="float-right div-width-50 form-sub-content">
                        <div><DataFlowMetrics qps={this.state.qps} average_transaction_time={this.state.average_transaction_time} /></div>
                    </div>
                    <div style={{clear: "both"}} />
                </div>
                <div className="form-content">
                    <div className="float-left div-width-50 form-sub-content">
                        <div><DataFlowRealTimeDisplay read_count={this.state.latest_read_count} write_count={this.state.latest_write_count} /></div>
                    </div>
                    <div onClick={() => this.onSecretClick()} className="float-right div-width-50 form-sub-content">
                        <div><TransactionLatencyRealTimeDisplay transaction_execution_time={this.state.latest_execution_time} /></div>
                    </div>
                    <div style={{clear: "both"}} />
                </div>
            </div>
        );
    }
}
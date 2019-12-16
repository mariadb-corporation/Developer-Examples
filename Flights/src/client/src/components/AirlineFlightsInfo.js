import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
    PieChart, Pie, Legend, Tooltip, Cell,
    BarChart, Bar, XAxis, YAxis, CartesianGrid
  } from 'recharts';

export default class AirlineFlightsInfo extends Component {
    colors = ["#003545","#2F99A3","#ABC74A","#96DDCF",'#0E6488','#424F62'];

    state = {
        airline_delays: [],
        delays_comparison: []
    };

    componentDidMount() {
        if (this.props !== null && 
            this.props.origin !== null &&
            this.props.destination !== null &&
            this.props.airline !== null) {
            this.load(this.props);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps !== null && 
            nextProps.origin !== null &&
            nextProps.destination !== null &&
            nextProps.airline !== null) { 
            this.load(nextProps);
        }
    }

    async load(props) {
        const origin = props.origin.code;
        const dest = props.destination.code;
        const airline = props.airline.code;
        const yearFrom = props.yearFrom;
        const yearTo = props.yearTo;
        const month = props.month;
        const day = props.day; 

        await this.getAirlineDelays(origin, dest, airline, yearFrom, yearTo, month, day)
            .then(res => {
                var other = 100 - (res.carrier_delay_pct + res.weather_delay_pct + res.security_delay_pct + res.late_aircraft_delay_pct + res.nas_delay_pct);
                var airline_delays = [{name: 'Carrier', value: res.carrier_delay_pct}, 
                                    {name: 'Late Aircraft', value: res.late_aircraft_delay_pct},
                                    {name: 'NAS', value: res.nas_delay_pct},
                                    {name: 'Security', value: res.security_delay_pct}, 
                                    {name: 'Weather', value: res.weather_delay_pct},
                                    {name: 'Other', value: other.toFixed(2)}];
                this.setState({ airline_delays });
            })
            .catch(err => console.log(err));

        await this.getDelaysComparison(origin, dest, airline, yearFrom, yearTo, month, day)
            .then(res => {
                var delays_comparison  = [
                    {name: 'Carrier', Target: res[0].carrier, Average: res[1].carrier},
                    {name: 'Late Aircraft', Target: res[0].late_aircraft, Average: res[1].late_aircraft},
                    {name: 'NAS', Target: res[0].nas, Average: res[1].nas},
                    {name: 'Security', Target: res[0].sec, Average: res[1].sec},
                    {name: 'Weather', Target: res[0].weather, Average: res[1].weather}
                ];
                this.setState({ delays_comparison })
            })
            .catch(err => console.log(err));
    }

    async getAirlineDelays(origin, dest, airline, yearFrom, yearTo, month, day) {
        const response = await fetch('/api/flights/airline_delays?o=' + origin + "&dst=" + dest + "&a=" + airline +
                                                                      "&yf=" + yearFrom + "&yt=" + yearTo + "&m=" + month + "&d=" + day);
        const body = await response.json();
        if (response.status !== 200) {
            throw Error(body.message) 
        }
        return body;
    }; 

    async getDelaysComparison(origin, dest, airline, yearFrom, yearTo, month, day) {
        const response = await fetch('/api/flights/delays_comparison?o=' + origin + "&dst=" + dest + "&a=" + airline +
                                                                        "&yf=" + yearFrom + "&yt=" + yearTo + "&m=" + month + "&d=" + day);
        const body = await response.json();
        if (response.status !== 200) {
            throw Error(body.message) 
        }
        return body;
    }; 

    render() {
        const { airline_delays, delays_comparison } = this.state;

        return (
            <div className="charts-main">
                <div className="form-sub-header">
                    { !!(this.props.airline) ? this.props.airline.name : ''}
                </div>
                <div>
                    <div className="inline-div-50">
                        <p class="charts-title">Delay % By Type</p>
                        <PieChart className="form-content" width={400} height={300}>
                            <Pie isAnimationActive={false} data={airline_delays} cx={200} cy={125} outerRadius={80} fill="#8884d8" label>
                                {
                                    airline_delays.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={this.colors[index]}/>
                                    ))
                                }
                            </Pie>
                            <Tooltip/>
                            <Legend align="center" />
                        </PieChart>
                    </div>
                    <div className="inline-div-50">
                        <p class="charts-title">Airline (avg minutes) delays vs. All (avg minutes) delays </p>
                        <BarChart className="Form-content" width={400} height={300} data={delays_comparison}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend align="center" />
                            <Bar dataKey="Target" fill="#96DDCF" />
                            <Bar dataKey="Average" fill="#0E6488" />
                        </BarChart>
                    </div>
                </div>
            </div>
        );
    }
}

AirlineFlightsInfo.propTypes = {
    origin: PropTypes.object.isRequired,
    destination: PropTypes.object.isRequired,
    airline: PropTypes.string.isRequired,
    yearFrom: PropTypes.number.isRequired,
    yearTo: PropTypes.number.isRequired,
    month: PropTypes.number,
    day: PropTypes.number
};
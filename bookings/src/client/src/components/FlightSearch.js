import React, {Component} from 'react';
import Select from 'react-select';
import { SegmentedControl } from 'segmented-control'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import calendar from '../images/calendar.png';

export default class FlightSearch extends Component {

    state = {
        type: 0,
        airlines: [],
        airports: [],
        selectedOriginOption: null,
        selectedDestinationOption: null,
        count_options: [{ value: 0, label: "0" }, { value: 1, label: "1" }, { value: 2, label: "2" }],
        selectedAdultOption: { value: 1, label: "1" },
        selectedChildrenOption: { value: 0, label: "0" }
    };

    constructor(props) {
        super(props);
        this.handleOriginDepartureDateChange = this.handleOriginDepartureDateChange.bind(this);
        this.handleDestinationDepartureDateChange = this.handleDestinationDepartureDateChange.bind(this);
        this.executeSearch = this.executeSearch.bind(this);
    }

    componentDidMount() {
        this.loadAirports();
        this.loadAirlines();
    }

    async loadAirlines() {
        await this.getAirlines()
            .then(res => {
                const airlineOptions = res.map(airline => ({
                    value: airline.iata_code,
                    label: airline.airline
                }));
                this.setState({ airlines: airlineOptions })
            })
            .catch(err => console.log(err)); 
    }

    async loadAirports() {
        await this.getAirports()
            .then(res => {
                const airportOptions = res.map(airport => ({
                    value: airport.iata_code,
                    label: airport.airport
                }));
                this.setState({ airports: airportOptions })
            })
            .catch(err => console.log(err));
    }

    async getAirlines() {
        const response = await fetch('/api/airlines');
        const body = await response.json();
        if (response.status !== 200) {
            throw Error(body.message) 
        }
        return body;
    }; 

    async getAirports() {
        const response = await fetch('/api/airports');
        const body = await response.json();
        if (response.status !== 200) {
            throw Error(body.message) 
        }
        return body;
    }; 

    handleTypeChange(type) {
        this.setState({type});
    }

    handleOriginChange = selectedOriginOption => {
        this.setState({ selectedOriginOption });
    };

    handleDestinationChange = selectedDestinationOption => {
        this.setState({ selectedDestinationOption });
    };

    handleOriginDepartureDateChange(date) {
        this.setState({
            originDepartureDate: date
        });
    }

    handleDestinationDepartureDateChange(date) {
        this.setState({
            destinationDepartureDate: date
        });
    }

    getReturnDateCss() {
        let classes = "form-section float-left margin-left-10";

        if (this.state.type === 0) {
            classes += " hidden";
        }

        return classes;
    }

    async executeSearch() {
        
        const { selectedOriginOption, selectedDestinationOption} = this.state;

        var params = {
            origin: { 
                code: selectedOriginOption.value,
                name: selectedOriginOption.label
            },
            destination: {
                code: selectedDestinationOption.value,
                name: selectedDestinationOption.label
            },
            originDepartureDate: this.state.originDepartureDate
        };

        if (this.state.type === 1) {
            params.destinationDepartureDate = this.state.destinationDepartureDate
        }

        this.props.executeSearch(params);
    }

    renderAirportOptions(selectedOption, handleChange) {
        return (
            <Select
                className="width-500"
                value={selectedOption}
                onChange={handleChange}
                options={this.state.airports}
                isClearable="true"
            />
        );
    }

    render() {
        return (
            <div className="filter-content">
                <h2>Search Flights</h2>
                <table>
                    <tr colSpan="2">
                        <SegmentedControl
                            name="tripType"
                            options={[
                                { label: "One-way", value: 0, default: true },
                                { label: "Round trip", value: 1 }
                            ]}
                            setValue={val => this.handleTypeChange(val)}
                            style={{ width: 300, color: '#003545' }}
                        />
                    </tr>
                    <tr>
                        <td>
                            <div className="form-section">
                                <p>Origin</p>
                                {this.renderAirportOptions(this.state.selectedOriginOption,this.handleOriginChange)}
                            </div>
                        </td>
                        <td >
                            <div className="form-section">
                                <p>Destination</p>
                                {this.renderAirportOptions(this.state.selectedDestinationOption,this.handleDestinationChange)}
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div>
                                <div className="form-section float-left">
                                    <p>Departing</p>
                                    <div>
                                        <img className="float-left" src={calendar} alt="cal" />     
                                        <DatePicker className="datepicker float-left" selected={this.state.originDepartureDate} onChange={this.handleOriginDepartureDateChange} />
                                        <div style={{clear: "both"}} />
                                    </div>
                                </div>
                                <div className={this.getReturnDateCss()}>
                                    <p>Returning</p>
                                    <div>
                                        <img className="float-left" src={calendar} alt="cal" />     
                                        <DatePicker className="datepicker float-left" selected={this.state.destinationDepartureDate} onChange={this.handleDestinationDepartureDateChange} />
                                        <div style={{clear: "both"}} />
                                    </div>
                                </div>
                                <div style={{clear: "both"}} />
                            </div>
                        </td>
                        <td>
                            <div>
                                <div className="form-section float-left">
                                    <p>Adults (18+)</p>
                                    <Select
                                        className="width-125"
                                        options={this.state.count_options}
                                        value={this.state.selectedAdultOption}
                                    />
                                </div>
                                <div className="form-section float-left margin-left-10">
                                    <p>Children (0-17)</p>
                                    <Select
                                        className="width-125"
                                        options={this.state.count_options}
                                        value={this.state.selectedChildrenOption}
                                    />
                                </div>
                                <div style={{clear: "both"}} />
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan="4">
                            <div className="margin-20 center">
                                <button onClick={this.executeSearch}>Search</button>
                            </div>
                        </td>
                    </tr>
                </table>
                
            </div>
        );
    }
} 
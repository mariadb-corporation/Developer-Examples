import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';

// TODO: Add validation checks on origin and destination
export default class FlightsFilter extends Component {
    // TODO: Loop through to create years/days. Went with the quick and dirty instead. -RH
    state = {
        airlines: [],
        airports: [],
        selectedOriginOption: null,
        selectedDestinationOption: null,
        selectedAirlineOption: null,
        years: [{ value: 1990, label: 1990},{ value: 1991, label: 1991},{ value: 1992, label: 1992},{ value: 1993, label: 1993},
                { value: 1994, label: 1994},{ value: 1995, label: 1995},{ value: 1996, label: 1996},{ value: 1997, label: 1997},
                { value: 1998, label: 1998},{ value: 1999, label: 1999},{ value: 2000, label: 2000},{ value: 2001, label: 2001},
                { value: 2002, label: 2002},{ value: 2003, label: 2003},{ value: 2004, label: 2004},{ value: 2005, label: 2005},
                { value: 2006, label: 2006},{ value: 2007, label: 2007},{ value: 2008, label: 2008},{ value: 2009, label: 2009},
                { value: 2010, label: 2010},{ value: 2011, label: 2011},{ value: 2012, label: 2012},{ value: 2013, label: 2013},
                { value: 2014, label: 2014},{ value: 2015, label: 2015},{ value: 2016, label: 2016},{ value: 2017, label: 2017},
                { value: 2018, label: 2018},{ value: 2019, label: 2019}],
        selectedYearFromOption: { value: 1990, label: 1990},
        selectedYearToOption: { value: 2019, label: 2019},
        months: [{ value: 1, label: "January"}, { value: 2, label: "February"},
                 { value: 3, label: "March"}, { value: 4, label: "April"},
                 { value: 5, label: "May"}, { value: 6, label: "June"},
                 { value: 7, label: "July"}, { value: 8, label: "August"},
                 { value: 9, label: "September"}, { value: 10, label: "October"},
                 { value: 11, label: "November"}, { value: 12, label: "December"}],
        selectedMonthOption: null,
        days: [{ value: 1, label: 1},{ value: 2, label: 2},{ value: 3, label: 3},{ value: 4, label: 4},
                { value: 5, label: 5},{ value: 6, label: 6},{ value: 7, label: 7},{ value: 8, label: 8},
                { value: 9, label: 9},{ value: 10, label: 10},{ value: 11, label: 11},{ value: 12, label: 12},
                { value: 13, label: 13},{ value: 14, label: 14},{ value: 15, label: 15},{ value: 16, label: 16},
                { value: 17, label: 17},{ value: 18, label: 18},{ value: 19, label: 19},{ value: 20, label: 20},
                { value: 21, label: 21},{ value: 22, label: 22},{ value: 23, label: 23},{ value: 24, label: 24},
                { value: 25, label: 25},{ value: 26, label: 26},{ value: 27, label: 27},{ value: 28, label: 28},
                { value: 29, label: 29},{ value: 30, label: 30},{ value: 31, label: 31}],
        selectedDayOption: null
    };

    constructor(props) {
        super(props);
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

    handleOriginChange = selectedOriginOption => {
        this.setState({ selectedOriginOption });
    };

    handleDestinationChange = selectedDestinationOption => {
        this.setState({ selectedDestinationOption });
    };

    handleAirlineChange = selectedAirlineOption => {
        this.setState({ selectedAirlineOption });
    };

    handleYearFromChange = selectedYearFromOption => {
        this.setState({ selectedYearFromOption });
    };

    handleYearToChange = selectedYearToOption => {
        this.setState({ selectedYearToOption });
    };

    handleMonthChange = selectedMonthOption => {
        this.setState({ selectedMonthOption });
    };

    handleDayChange = selectedDayOption => {
        this.setState({ selectedDayOption });
    };

    async executeSearch() {
        const { selectedOriginOption, selectedDestinationOption, selectedAirlineOption, 
                selectedYearFromOption, selectedYearToOption, selectedMonthOption, selectedDayOption } = this.state;

        var params = {
            origin: { 
                code: selectedOriginOption.value,
                name: selectedOriginOption.label
            },
            destination: {
                code: selectedDestinationOption.value,
                name: selectedDestinationOption.label
            },
            yearFrom: selectedYearFromOption !== null ? selectedYearFromOption.value : null,
            yearTo: selectedYearToOption !== null ? selectedYearToOption.value : null,
            month: selectedMonthOption !== null ? selectedMonthOption.value : null,
            day: selectedDayOption !== null ? selectedDayOption.value : null
        };  

        if (selectedAirlineOption !== null) {
            params.airline = {
                code: selectedAirlineOption.value,
                name: selectedAirlineOption.label
            }
        }
        else {
            params.airline = null
        }

        this.props.executeSearch(params);
    }

    renderAirportOptions(selectedOption, handleChange) {
        return (
            <Select
                className="airport-picker"
                value={selectedOption}
                onChange={handleChange}
                options={this.state.airports}
                isClearable="true"
            />
        );
    }

    renderAirlineOptions(selectedOption, handleChange) {
        return (
            <Select
                className="airport-picker"
                value={selectedOption}
                onChange={handleChange}
                options={this.state.airlines}
                isClearable="true"
            />
        );
    }

    render() {
        return (
            <div>
                <table cellSpacing="10">
                    <tr>
                        <td>
                            <div className="form-section">
                                <p>Origin</p>
                                {this.renderAirportOptions(this.state.selectedOriginOption,this.handleOriginChange)}
                            </div>
                        </td>
                        <td>
                            <div className="form-section">
                                <p>Destination</p>
                                {this.renderAirportOptions(this.state.selectedDestinationOption,this.handleDestinationChange)}
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div className="form-section">
                                <p>Airline</p>
                                {this.renderAirlineOptions(this.state.selectedAirlineOption,this.handleAirlineChange)}
                            </div>
                        </td>
                        <td>
                            <div className="form-section">
                                <div className="float-left">
                                    <p>From</p>
                                    <Select
                                        className="select-year"
                                        value={this.state.selectedYearFromOption}
                                        onChange={this.handleYearFromChange}
                                        options={this.state.years}
                                    />
                                </div>
                                <div className="float-left">
                                    <p>To</p>
                                    <Select
                                        className="select-year"
                                        value={this.state.selectedYearToOption}
                                        onChange={this.handleYearToChange}
                                        options={this.state.years}
                                    />
                                </div>
                                <div className="float-left">
                                    <p>Month</p>
                                    <Select
                                        className="select-month"
                                        value={this.state.selectedMonthOption}
                                        onChange={this.handleMonthChange}
                                        options={this.state.months}
                                        isClearable="true"
                                    />
                                </div>
                                <div className="float-left">
                                    <p>Day</p>
                                    <Select
                                        className="select-day"
                                        value={this.state.selectedDayOption}
                                        onChange={this.handleDayChange}
                                        options={this.state.days}
                                        isClearable="true"
                                    />
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan="2">
                            <button className="button-search" onClick={this.executeSearch}>Search</button>
                        </td>
                    </tr>
                </table>
            </div>
        );
    }
}

FlightsFilter.propTypes = {
    executeSearch: PropTypes.func.isRequired
};
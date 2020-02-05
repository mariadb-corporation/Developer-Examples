import React, {Component} from 'react';
import FlightSearch from './FlightSearch';
import Flights from './Flights';
import Trips from './Trips';

export default class Dashboard extends Component {

    constructor(props) {
        super(props);

        this.state = {
            flights: [],
            trips: [],
            selectedTabIndex: 0
        };
    }

    componentDidMount() {
        this.loadTrips();
    }

    async loadTrips() {
        this.setState({
            trips: await this.getTrips()
        })
    }

    async getTrips() {
        const response = await fetch('/api/trips');
        const body = await response.json();
        if (response.status !== 200) {
            throw Error(body.message) 
        }
        return body;
    }

    async executeSearch(params) {
        this.setState({
            flights: await this.getFlights(params.origin.code, 
                                           params.destination.code,
                                           params.originDepartureDate)
        });
    }

    async getFlights(origin, destination, originDepartureDate) {
        const response = await fetch('/api/flights?o=' + origin + '&d=' + destination + '&dt=' + originDepartureDate);
        const body = await response.json();
        if (response.status !== 200) {
            throw Error(body.message) 
        }
        return body;
    }; 

    toggleSection(selectedTabIndex) {
        this.setState({selectedTabIndex});
    }

    getNavClasses(index) {
        if (this.state.selectedTabIndex === index) {
            return "header-link selected width-50 float-left";
        }
        else {
            return "header-link width-50 float-left";
        }
    }

    renderSection() {
        if (this.state.selectedTabIndex === 0) {
            return (
                <div className="form-content">
                    <FlightSearch executeSearch={(params) => this.executeSearch(params)} />
                    <Flights flights={this.state.flights} />
                </div>
            );
        }
        else {
            return (
                <div>
                    <Trips trips={this.state.trips} />
                </div>
            );
        }
    }

    render() {
        return (
            <div >
                <div className="form-nav-panel">
                    <div onClick={() => this.toggleSection(0)} className={this.getNavClasses(0)}>
                        <h3>Book a Trip!</h3>
                    </div>
                    <div onClick={() => this.toggleSection(1)} className={this.getNavClasses(1)}>
                        <h3>Upcoming Trips</h3>
                    </div>
                    <div style={{clear: "both"}} />
                </div>
                <div className="form-main">
                    {this.renderSection()}
                </div>
            </div>
        );
    }
}   
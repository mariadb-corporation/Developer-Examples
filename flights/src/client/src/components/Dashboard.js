import React, {Component} from 'react';
import FlightsFilter from './FlightsFilter';
import FlightPlanHeader from './FlightPlanHeader';
import AirlineFlightsInfo from './AirlineFlightsInfo';
import AirlinesFlightsInfo from './AirlinesFlightsInfo';

export default class Dashboard extends Component {
    state = {
        origin: null,
        destination: null,
        airline: null,
        yearFrom: null,
        yearTo: null,
        month: null,
        day: null
    };

    executeSearch(params) {
        this.setState({
            origin: params.origin,
            destination: params.destination,
            airline: params.airline,
            yearFrom: params.yearFrom,
            yearTo: params.yearTo,
            month: params.month,
            day: params.day
        });
    }

    airlineSelected(airline) {
        if (airline !== null) {
            this.setState({ airline });
        }
    }

    render() {
        const { origin, destination, airline, 
                yearFrom, yearTo, month, day } = this.state;

        return (
            <div className="form-main">
                <div className="filter-background">
                    <FlightsFilter executeSearch={(params) => this.executeSearch(params)} />
                </div>
                <div>
                    <div className={origin !== null ? '' : 'hidden'}>
                        <FlightPlanHeader origin={origin} destination={destination} />
                    </div>
                    <AirlinesFlightsInfo origin={origin} destination={destination} 
                                         yearFrom={yearFrom} yearTo={yearTo} month={month} day={day} 
                                         airlineSelected={(airline) => this.airlineSelected(airline)} />
                    <div className={airline !== null ? '' : 'hidden'}>
                        <AirlineFlightsInfo origin={origin} destination={destination} airline={airline} 
                                            yearFrom={yearFrom} yearTo={yearTo} month={month} day={day} />
                    </div>
                </div>
            </div>
        );
    }
}
import React, {Component} from 'react';
import Flight from './Flight';

export default class Flights extends Component {
    renderFlights() {
        return this.props.flights.map(flight => (
            <Flight flight={flight} />
        ))
    }

    render() {
        return (
            <div className="margin-top-10"> 
                <div>

                </div>
                {this.renderFlights()}
            </div>
        );
    }
} 
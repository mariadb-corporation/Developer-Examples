import React, {Component} from 'react';
import Trip from './Trip';

export default class Trips extends Component {
    renderTrips() {
        
        return this.props.trips.map(trip => (
            <Trip trip={trip} />
        ))
    }

    render() {
        return (
            <div className="margin-top-10"> 
                {this.renderTrips()}
            </div>
        );
    }
} 
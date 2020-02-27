import React, {Component} from 'react';
import PropTypes from 'prop-types';
import arrow from './../images/arrow-right.png';

export default class FlightPlanHeader extends Component {
    render() {
        if (this.props.origin !== null && this.props.destination !== null) {
            return(
                <div className="form-header">
                    <table className="table-50">
                        <tr>
                            <td><h2>{this.props.origin.code}</h2></td>
                            <td><img className="image-arrow" src={arrow} alt="->" /></td>
                            <td><h2>{this.props.destination.code}</h2></td>
                        </tr>
                    </table>
                </div>
            );
        }
        else {
            return(<div />);
        }
    }
}

FlightPlanHeader.propTypes = {
    origin: PropTypes.string.isRequired,
    destination: PropTypes.string.isRequired
};
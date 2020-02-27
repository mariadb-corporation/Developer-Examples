import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import WeatherIcon from 'react-icons-weather';
import AirlineIcon from './AirlineIcon';

export default class Trip extends Component {

    getPopover(props,assessment) {
        return(
            <Popover id="popover-basic" {...props}>
                <Popover.Title as="h3">Flight score ({assessment.overall_score}/5.0) </Popover.Title>
                <Popover.Content>
                    <table cellSpacing="10" cellPadding="10">
                        <tr>
                            <td>
                                <p className="section-label">Historical score</p>
                                <p className="section-description">
                                    Based on historical analytics this flight has a <b>{assessment.historical_delay_percentage}%</b>&nbsp;
                                    chance of being delayed. 
                                </p>
                            </td>
                            <td className="assessment-score" align="right" valign="top">{assessment.historical_score}</td>
                        </tr>
                        <tr>
                            <td>
                                <p className="section-label">Weather score</p> 
                            </td>
                            <td className="assessment-score" align="right" valign="top">{assessment.weather_score}</td>
                        </tr>
                        <tr>
                            <td>
                                <p className="section-label">Delay projection (minutes)</p>
                                <p className="section-description">
                                    This flight is delay probabilty has a multiplier of <b>{assessment.weather_delay_multiplier}</b>&nbsp;
                                    due to current weather projections. 
                                </p>
                            </td>
                            <td className="assessment-score" align="right" valign="top">{assessment.projected_delay}</td>
                        </tr>
                    </table>
                </Popover.Content>
            </Popover>
        );
    }

    getFormattedDate(dateStr) {
        let date = new Date(dateStr);
        return date.toDateString();
    }

    getFormattedTime(time) {
        return time.match(/.{1,2}/g).join(':');
    }

    getFormattedOffsetTime(time,offset) {
        let offsetTime = (parseInt(time) + offset).toString();

        if (offsetTime.length === 3) {
            return this.getFormattedTime("0" + offsetTime);
        }

        return this.getFormattedTime(offsetTime);
    }
     
    getDuration(departure,arrival) {
        let delta = (parseInt(arrival) - parseInt(departure)).toString();
        return this.getFormattedDuration(delta);
    }
 
    getFormattedDuration(delta) {
        if (delta.length === 4) {
            return delta.substring(0,1) + 'h ' + delta.substring(1,3) + 'm';
        }
        else {
            return delta[0] + 'h ' + delta.substring(1,3) + 'm';
        }
    }

    renderFlightScore(assessment) {
        let cssClass = "assessment-content float-right trip-score ";

        if (assessment.overall_score >= 4.0) {
            cssClass += "background-green";
        }
        else if (assessment.overall_score >= 2.5) {
            cssClass += "background-gray";

        }
        else {
            cssClass += "background-red";
        }

        return(
            <div className={cssClass}>
                <OverlayTrigger
                    trigger="hover"
                    placement="left"
                    overlay={this.getPopover(this.props, assessment)}>
                    <p>{assessment.overall_score}</p> 
                </OverlayTrigger>
            </div>
        );
    }

    renderTrips() {
        // This will handle round-trip rendering
        //return this.props.trip.map(trip => (

        let trip = this.props.trip;

        return(
            <div class="trip-content">
                <div>
                    <div className="header float-left">
                        Depart {trip.origin} - {trip.dest}
                        <p className="sub-header">{this.getFormattedDate(trip.fl_date)}</p>
                    </div>
                    <div className="float-right align-right margin-right-25 weather-summary-content"> 
                        <div>
                            <div className="float-left forecast-title">{trip.forecast.description}</div>
                            <div className="float-left"><WeatherIcon name="darksky" iconId={trip.forecast.icon} flip="horizontal" rotate="90" /></div>
                            <div style={{clear: "both"}} />
                        </div>
                        <div className="align-left forecast-details">
                            <div className="float-left"> 
                                <p>Low: {trip.forecast.temp_low}</p>
                                <p>High: {trip.forecast.temp_high}</p>
                            </div>
                            <div className="float-left margin-left-10"> 
                                <p>Precip: {trip.forecast.precip_probability}</p>
                                <p>Wind: {trip.forecast.wind_speed} mph</p>
                            </div>
                            <div style={{clear: "both"}} />
                        </div>
                    </div>
                    {this.renderFlightScore(trip.assessment)}
                    <div style={{clear: "both"}} />
                </div>
                
                <table cellspacing="0" cellpadding="0">
                    <tr> 
                        <th>Flight</th>
                        <th>Departs</th>
                        <th>Arrives</th>
                        <th>Duration</th>
                    </tr>
                    <tr>
                        <td>
                            {trip.airline_code} {trip.fl_num}
                        </td>
                        <td>
                            {this.getFormattedTime(trip.dep_time)}
                        </td>
                        <td>
                            {this.getFormattedTime(trip.arr_time)}
                        </td>
                        <td>
                            {this.getDuration(trip.dep_time,trip.arr_time)}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <AirlineIcon code={trip.airline_code} name={trip.airline} />
                        </td>
                        <td>
                            <div className="estimation-content">
                                <p>Estimated</p>
                                {this.getFormattedOffsetTime(trip.dep_time,trip.assessment.projected_delay)}
                            </div>
                        </td>
                        <td>
                            <div className="estimation-content">
                                <p>Estimated</p>
                                {this.getFormattedOffsetTime(trip.arr_time,trip.assessment.projected_delay)}
                            </div>
                        </td>
                        <td>
                            
                        </td>
                    </tr>
                </table>

            </div>
        );
        //))
    }

    render() {
        return (
            <div className="item-content">
                {this.renderTrips()}
            </div>
        );
    }
} 
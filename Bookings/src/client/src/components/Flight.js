import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import AirlineIcon from './AirlineIcon';
import info from '../images/info.png';

export default class Flight extends Component {

    renderFlightScore(score) {
        let cssClass = "float-left margin-left-10 bold ";

        if (score >= 4.5) {
            cssClass += "score-very-good";
        }
        else if (score >= 4.0) {
            cssClass += "score-good";
        }
        else if (score >= 3.0) {
            cssClass += "score-average";

        }
        else if (score >= 2.0) {
            cssClass += "score-poor";
        }
        else {
            cssClass += "score-very-poor";
        }

        return(
            <div className="float-left font-size-20">
                <p className="float-left">
                    Flight score:
                </p>
                <p className={cssClass}>
                    {score}
                </p>
                <div style={{clear: "both"}} />
            </div>
        );
    }

    getPopover(props,assessment) {
        return(
            <Popover id="popover-basic" {...props}>
                <Popover.Title as="h3">Flight score ({assessment.overall_score}/5.0) </Popover.Title>
                <Popover.Content>
                    <table cellSpacing="10" cellPadding="10">
                        <tr>
                            <td><p className="section-label">Price score</p></td>
                            <td className="assessment-score" align="right" valign="top">{assessment.price_score}</td>
                        </tr>
                        <tr>
                            <td>
                                <p className="section-label">Delay score</p>
                                <p className="section-description">This flight is delayed {assessment.delay_percentage}% of the time.</p>
                            </td>
                            <td className="assessment-score" align="right" valign="top">{assessment.delay_score}</td>
                        </tr>
                        <tr>
                            <td>
                                <p className="section-label">Cancellation score</p>
                                <p className="section-description">This flight is canceled {assessment.cancel_percentage}% of the time.</p>
                            </td>
                            <td className="assessment-score" align="right" valign="top">{assessment.cancel_score}</td>
                        </tr>
                    </table>
                </Popover.Content>
            </Popover>
        );
    }

    getFormattedTime(time) {
       return time.match(/.{1,2}/g).join(':');
    }
    
    getDuration(departure,arrival) {
        var delta = parseInt(arrival) - parseInt(departure);
        return this.getFormattedTimeFromInt(delta);
    }

    getFormattedTimeFromInt(num) { 
        var hours = Math.floor(num / 60);  
        var minutes = parseInt(num % 60);
        return hours + "h " + minutes + "m";         
    }

    render() {
        const flight = this.props.flight;

        return (
            <div className="item-content">
                <div>
                    <div className="width-33 align-left">
                        <h3>{this.getFormattedTime(flight.dep_time)} - {this.getFormattedTime(flight.arr_time)}</h3>
                        <p className="subtext">Avg. delay: {flight.avg_delay !== null ? Math.round(flight.avg_delay) : 0} minutes</p>
                    </div>
                    <div className="width-33 align-left">
                        <p>Flight duration: {this.getDuration(flight.dep_time,flight.arr_time)}</p>
                        <p className="subtext">Avg. flight duration: {this.getFormattedTimeFromInt(flight.avg_duration)}</p>
                    </div>
                    <div className="width-33 align-right valign-top">
                        <h3>${flight.price}</h3>
                    </div>
                </div>
                <div>
                    <div className="width-33 align-left">
                        <AirlineIcon code={flight.airline_code} name={flight.airline} />
                    </div>
                    <div className="width-33 align-left">
                        <p>{flight.origin} - {flight.dest}</p>
                    </div> 
                    <div className="width-33 align-left" />
                </div>
                <div>
                    <div className="float-left valign-middle">
                        {this.renderFlightScore(flight.assessment.overall_score)}
                        <div className="float-left valign-middle margin-left-5">
                            <OverlayTrigger
                                trigger="hover"
                                placement="right"
                                overlay={this.getPopover(this.props,flight.assessment)}>
                                <img src={info} alt="?" />   
                            </OverlayTrigger>
                        </div>
                        <div style={{clear: "both"}} />
                    </div>
                    <div className="align-right margin-top-25">
                        <button>Select</button>
                    </div>
                    <div style={{clear: "both"}} />
                </div>
            </div>
        );
    }
} 
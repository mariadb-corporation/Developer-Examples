import React, {Component} from 'react';
import PropTypes from 'prop-types';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default class AddEvent extends Component {

    constructor(props) {
        super(props);

        this.state = {
            eventDate: new Date()
        }

        this.handleChange = this.handleChange.bind(this);
        this.saveEvent = this.saveEvent.bind(this);
    }

    handleChange(date) {
        this.setState({
            eventDate: date
        });
    }

    handleDescriptionChange = event => {
        this.setState({ description: event.target.value });
    };

    async saveEvent() {
        var event = this.getEvent();

        var res = await fetch('/api/locations/sportsvenue/event',{
            method: 'POST',
            body: JSON.stringify(event),
            headers: {"Content-Type": "application/json"}
        });

        if (res.status === 200) {
            this.props.onSave();
        }
    }

    getEvent() {
        var event = {
            locationid: this.props.id,
            details: {
                date: this.state.eventDate.toLocaleDateString(),
                description: this.state.description
            }
        };

        return event;
    }

    render() {
        return (
          <div className="form-main">
            <table className="info-table">
                <tr>
                    <td>Date:</td>
                    <td><DatePicker selected={this.state.eventDate} onChange={this.handleChange} /></td>
                </tr>
                <tr>
                    <td>Description:</td>
                    <td><input value={this.state.description} onChange={this.handleDescriptionChange} /></td>
                </tr>
            </table>
            <div className="centered">
                <button onClick={this.saveEvent}>Save</button>
                <button className="negative" onClick={this.props.onCancel}>Cancel</button>
            </div>
          </div>
        );
    }
  }

  AddEvent.propTypes = {
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    id: PropTypes.number,
    name: PropTypes.string
  };
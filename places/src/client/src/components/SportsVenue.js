import React, {Component} from 'react';
import PropTypes from 'prop-types';
import AddEvent from './AddEvent';

export default class SportsVenue extends Component {
    constructor(props) {
      super(props);

      this.state = {
        addEvent: false,
        venue: {}
      }

      this.toggleAddEvent = this.toggleAddEvent.bind(this);
      this.eventAdded = this.eventAdded.bind(this);
    }

    componentDidMount() {
        if (this.props !== undefined && 
            this.props.id !== undefined &&
            this.props.id !== null) {
            this.loadVenue();
        }
    }

    loadVenue() {
        this.getVenue(this.props.id)
                .then(res => this.setState({ venue: res }))
                .catch(err => console.log(err));
    }

    getVenue = async (id) => {
        const response = await fetch('/api/locations/sportsvenue?id=' + id);
        const body = await response.json();

        if (response.status !== 200) {
            throw Error(body.message) 
        }

        return body;
    };

    toggleAddEvent() {
        this.setState({
            addEvent: !this.state.addEvent
        })
    }

    eventAdded() {
        this.toggleAddEvent();
        this.loadVenue();
        this.props.onUpdate();
    }

    renderAddEvent() {
        if (this.state.addEvent) {
            return (
                <div>
                    <AddEvent id={this.props.id} onSave={this.eventAdded} onCancel={this.toggleAddEvent} />
                </div>
            );
        }
        else {
            return(<button onClick={this.toggleAddEvent}>Add Event</button>);
        }
    }

    renderEventItems(events) {
        return events.map(event => (
            <tr>
                <td>{event.date}</td>
                <td>{event.description}</td>
            </tr>
        ));
    }

    renderEvents() {
        if (this.state.venue !== undefined &&
            this.state.venue.events !== undefined &&
            this.state.venue.events !== null) {

            var events = JSON.parse(this.state.venue.events);

            if (events.length > 0) {
                return (
                    <div>
                        <h4>Events</h4>
                        <table className="list-table">
                            <tr>
                                <th>Date</th>
                                <th>Description</th>
                            </tr>
                            {this.renderEventItems(events)}
                        </table>
                    </div>  
                );
            }
        }
    }

    render() {
        return (
            <div class="form-main">
                <table className="info-table">
                    <tr>
                        <td>Year Opened:</td>
                        <td>{this.state.venue.yearOpened}</td>
                    </tr>
                    <tr>
                        <td>Max Capacity:</td>
                        <td>{this.state.venue.capacity}</td>
                    </tr>
                </table>
                {this.renderEvents()}
                {this.renderAddEvent()}
            </div>
        );
    }
}

SportsVenue.propTypes = {
  onUpdate: PropTypes.func.isRequired,
  id: PropTypes.object
};
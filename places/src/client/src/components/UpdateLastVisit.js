import React, {Component} from 'react';
import PropTypes from 'prop-types';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default class UpdateLastVisit extends Component {

    constructor(props) {
        super(props);

        this.state = {
            visitDate: new Date()
        }

        this.handleChange = this.handleChange.bind(this);
        this.saveLastVisitedDate = this.saveLastVisitedDate.bind(this);
    }

    handleChange(date) {
        this.setState({
            visitDate: date
        });
    }

    async saveLastVisitedDate() {
        const response = await fetch('/api/locations/attractions?id=' + this.props.id + '&dt=' + this.state.visitDate.toLocaleDateString(), { method: 'PUT'});

        if (response.status === 200) {  
            this.props.onSave();
        }
    }

    render() {
        return (
          <div className="form-main">
            <table className="info-table">
                <tr>
                    <td>Attraction:</td>
                    <td>{this.props.name}</td>
                </tr>
                <tr>
                    <td>Date:</td>
                    <td><DatePicker selected={this.state.visitDate} onChange={this.handleChange} /></td>
                </tr>
            </table>
            <button onClick={this.saveLastVisitedDate}>Save</button>
          </div>
        );
    }
  }

  UpdateLastVisit.propTypes = {
    onSave: PropTypes.func.isRequired,
    id: PropTypes.number,
    name: PropTypes.string
  };
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import "react-datepicker/dist/react-datepicker.css";

export default class AddRestaurantVisit extends Component {

    constructor(props) {
        super(props);

        this.state = {
            visitDate: new Date()
        }

        this.saveFavorite = this.saveFavorite.bind(this);
    }

    handleDescriptionChange = event => {
        this.setState({ description: event.target.value });
    };

    handlePriceChange = event => {
        this.setState({ price: event.target.value });
    };

    async saveFavorite() {
        var favorite = this.getFavorite();
        var res = await fetch('/api/locations/restaurant/favorites',{
            method: 'POST',
            body: JSON.stringify(favorite),
            headers: {"Content-Type": "application/json"}
        });

        if (res.status === 200) {
            this.props.onSave();
        }
    }

    getFavorite() {
        var favorite = {
            locationid: this.props.id,
            details: {
                description: this.state.description,
                price: this.state.price
            }
        };

        return favorite;
    }

    render() {
        return (
          <div className="form-main">
            <table className="info-table " cellSpacing="10px">
                <tr>
                    <td>Description:</td>
                    <td><input value={this.state.description} onChange={this.handleDescriptionChange} /></td>
                </tr>
                <tr>
                    <td>Price:</td>
                    <td><input value={this.state.price} onChange={this.handlePriceChange} /></td>
                </tr>
            </table>
            <div className="centered">
                <button onClick={this.saveFavorite}>Add</button>
                <button className="negative" onClick={this.props.onCancel}>Cancel</button>
            </div>
          </div>
        );
    }
  }

  AddRestaurantVisit.propTypes = {
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    id: PropTypes.number
  };
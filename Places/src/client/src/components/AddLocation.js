import React, {Component} from 'react';
import PropTypes from 'prop-types';

export default class AddLocation extends Component {

    constructor(props) {
      super(props);

      this.state = {
        type: 'A'
      }

      this.onSelectChange = this.onSelectChange.bind(this);
      this.saveLocation = this.saveLocation.bind(this);
    }

    onSelectChange(event) {
      this.setState({ type: event.target.value });
      this.forceUpdate();
    }

    handleNameChange = event => {
      this.setState({ name: event.target.value });
    };

    handleDescriptionChange = event => {
        this.setState({ desciption: event.target.value });
    };

    handleLatitudeChange = event => {
      this.setState({ latitude: event.target.value });
    };

    handleLongitudeChange = event => {
        this.setState({ longitude: event.target.value });
    };

    handleFoodTypeChange = event => {
      this.setState({ foodType: event.target.value });
    };

    handleMenuChange = event => {
        this.setState({ menu: event.target.value });
    };

    handleCategoryChange = event => {
      this.setState({ category: event.target.value });
    };

    handleYearOpenedChange = event => {
      this.setState({ yearOpened: event.target.value });
    };

    handleCapacityChange = event => {
      this.setState({ capacity: event.target.value });
    };

    async saveLocation() {
      var location = this.getLocation();

      var res = await fetch('/api/locations',{
        method: 'POST',
        body: JSON.stringify(location),
        headers: {"Content-Type": "application/json"}
      });

      if (res.status === 200) {
        this.props.onSave();
      }
    }

    getLocation() {
      var location = {
        name: this.state.name,
        description: (this.state.description === undefined ? null : this.state.description),
        type: this.state.type,
        latitude: this.state.latitude,
        longitude: this.state.longitude
      };

      if (this.state.type === 'A') {
        location.attr = {
          category: this.state.category
        }
      }
      else if (this.state.type === 'R') {
        location.attr = {
          details: {
            foodType: this.state.foodType,
            menu: this.state.menu
          },
          favorites: []
        };
      }
      else if (this.state.type === 'S') {
        location.attr = {
          details: {
            yearOpened: this.state.yearOpened,
            capacity: this.state.capacity
          },
          events: []
        };
      }

      return location;
    }

    renderLocationTypeOptions() {
      if (this.state.type === 'A'){
        return(
          <tr>
            <td>Category:</td>
            <td><input value={this.state.category} onChange={this.handleCategoryChange} /></td>
          </tr>
        );
      }
      else if (this.state.type === 'R'){
        return(
          <tbody>
            <tr>
              <td>Food Type:</td>
              <td><input value={this.state.foodType} onChange={this.handleFoodTypeChange} /></td>
            </tr>
            <tr>
              <td>Menu:</td>
              <td><input value={this.state.menu} onChange={this.handleMenuChange} /></td>
            </tr>
          </tbody>
        );
      }
      else if (this.state.type === 'S'){
        return(
          <tbody>
            <tr>
              <td>Year Opened:</td>
              <td><input value={this.state.yearOpened} onChange={this.handleYearOpenedChange} /></td>
            </tr>
            <tr>
              <td>Max Capacity:</td>
              <td><input value={this.state.capacity} onChange={this.handleCapacityChange} /></td>
            </tr>
          </tbody>
        );
      }
    }

    render() {
        return (
          <div className="form-main">
            <table className="info-table">
              <tr>
                <td>Type:</td>
                <td>
                  <select onChange={this.onSelectChange}>
                    <option value="A">Attraction</option>
                    <option value="R">Restaurant</option>
                    <option value="S">Sports Venue</option>
                  </select>
                </td>
              </tr>
              <tr>
                <td>Name:</td>
                <td><input value={this.state.name} onChange={this.handleNameChange} /></td>
              </tr>
              <tr>
                <td>Description:</td>
                <td><input value={this.state.description} onChange={this.handleDescriptionChange} /></td>
              </tr>
              <tr>
                <td>Latitude:</td>
                <td><input value={this.state.latitude} onChange={this.handleLatitudeChange} /></td>
              </tr>
              <tr>
                <td>Longitude:</td>
                <td><input value={this.state.longitude} onChange={this.handleLongitudeChange} /></td>
              </tr>
              {this.renderLocationTypeOptions()}
            </table>

            <button onClick={this.saveLocation}>Save</button>

          </div>
        );
    }
  }

  AddLocation.propTypes = {
    onSave: PropTypes.func.isRequired
  };
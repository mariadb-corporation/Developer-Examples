import React, {Component} from 'react';
import PropTypes from 'prop-types';
import AddRestaurantFavorite from './AddRestaurantFavorite';

export default class Restaurant extends Component {
    constructor(props) {
      super(props);

      this.state = {
        addFavorite: false,
        restaurant: {}
      }

      this.toggleAddFavorite = this.toggleAddFavorite.bind(this);
      this.favoriteAdded = this.favoriteAdded.bind(this);
    }

    componentDidMount() {
        if (this.props !== undefined && 
            this.props.id !== undefined &&
            this.props.id !== null) {
            this.loadRestaurant();
        }
    }

    loadRestaurant() {
        this.getRestaurant(this.props.id)
                .then(res => this.setState({ restaurant: res }))
                .catch(err => console.log(err));
    }

    getRestaurant = async (id) => {
        const response = await fetch('/api/locations/restaurant?id=' + id);
        const body = await response.json();

        if (response.status !== 200) {
            throw Error(body.message) 
        }

        return body;
    };

    toggleAddFavorite() {
        this.setState({
            addFavorite: !this.state.addFavorite
        })
    }

    favoriteAdded() {
        this.toggleAddFavorite();
        this.loadRestaurant();
        this.props.onUpdate();
    }

    renderAddFavorite() {
        if (this.state.addFavorite) {
            return (
                <div>
                    <AddRestaurantFavorite id={this.props.id} onSave={this.favoriteAdded} onCancel={this.toggleAddFavorite} />
                </div>
            );
        }
        else {
            return(<button onClick={this.toggleAddFavorite}>Add Favorite Meal</button>);
        }
    }

    renderFavoriteItems(favorites) {
        return favorites.map(favorite => (
            <tr>
                <td>{favorite.description}</td>
                <td>{favorite.price}</td>
            </tr>
        ));
    }

    renderFavorites() {
        if (this.state.restaurant !== undefined &&
            this.state.restaurant.favorites !== undefined &&
            this.state.restaurant.favorites !== null) {

            var favorites = JSON.parse(this.state.restaurant.favorites);

            if (favorites.length > 0) {
                return (
                    <div>
                        <h4>Favorite Meals</h4>
                        <table className="list-table">
                            <tr>
                                <th>Description</th>
                                <th>Price</th>
                            </tr>
                            {this.renderFavoriteItems(favorites)}
                        </table> 
                    </div>  
                );
            }
        }
    }

    render() {
        return (
            <div className="form-main">
                <table className="info-table">
                    <tr>
                        <td>Type:</td>
                        <td>{this.state.restaurant.foodType}</td>
                    </tr>
                    <tr>
                        <td>Menu:</td>
                        <td><a target="_blank" rel="noopener noreferrer" href={this.state.restaurant.menu}>{this.state.restaurant.menu}</a></td>
                    </tr>
                </table>
                {this.renderFavorites()}
                {this.renderAddFavorite()}
            </div>
        );
    }
}

Restaurant.propTypes = {
    onUpdate: PropTypes.func.isRequired,
    id: PropTypes.number
};
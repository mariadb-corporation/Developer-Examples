import React, {Component} from 'react';
import {Map, Marker, GoogleApiWrapper} from 'google-maps-react';
import Modal from 'react-modal';

import close from './../images/close.png';
import restaurant_icon from './../images/restaurant_icon.png';
import sports_icon from './../images/sports_icon.png';
import star_icon from './../images/star_icon.png';

import InfoWindowEx from './InfoWindowEx'
import AddLocation from './AddLocation';
import Restaurant from './Restaurant';
import SportsVenue from './SportsVenue';
import UpdateLastVisit from './UpdateLastVisit';

export class MapContainer extends Component {

    constructor(props) {
        super(props);

        this.state = {
            showingInfoWindow: false,
            activeMarker: {},
            selectedPlace: {},
            locations: []
        }

        this.onMarkerClick = this.onMarkerClick.bind(this);
        this.onMapClicked = this.onMapClicked.bind(this);
        this.getIcon = this.getIcon.bind(this);

        this.toggleViewLocationModal = this.toggleViewLocationModal.bind(this);
        this.toggleAddLocationModal = this.toggleAddLocationModal.bind(this);
        this.toggleUpdateLastVisitModal = this.toggleUpdateLastVisitModal.bind(this);

        this.loadLocations = this.loadLocations.bind(this);
    }

    componentDidMount() {
        this.loadLocations();
    }

    async loadLocations() {
        await this.getLocations()
            .then(res => this.setState({ locations: res }))
            .catch(err => console.log(err));
    }

    async getLocations() {
        const response = await fetch('/api/locations');
        const body = await response.json();

        if (response.status !== 200) {
            throw Error(body.message) 
        }
        
        return body;
    }; 

    onMarkerClick(props, marker, e) {
        this.setState({
            selectedPlace: props,
            activeMarker: marker,
            showingInfoWindow: true
        });
    }
    
    onMapClicked(props) {
        if (this.state.showingInfoWindow) {
            this.setState({
                showingInfoWindow: false,
                activeMarker: null
            })
        }
    }

    getIcon(type) {
        if (type === 'R') {
            return restaurant_icon;
        }
        else if (type === 'S') {
            return sports_icon;
        } 
        else {
            return star_icon;
        }
    }

    openModal(location,target) {
        this.setState({
            locationid: location.id,
            locationtype: location.type,
            locationname: location.name
        });

        target();
    }

    toggleViewLocationModal() {
        this.setState({
            isViewLocationOpen: !this.state.isViewLocationOpen
        });
    }

    toggleAddLocationModal(reload) {
        this.setState({
            isAddLocationOpen: !this.state.isAddLocationOpen
        })

        if (reload) {
            this.loadLocations();
        }
    }   

    toggleUpdateLastVisitModal(reload) {
        this.setState({
            isUpdateLastVisitOpen: !this.state.isUpdateLastVisitOpen
        })

        if (reload) {
            this.loadLocations();
        }
    }

    viewLocation() {
        if (this.state.locationtype === 'R') {
            return(<Restaurant id={this.state.locationid} onUpdate={this.loadLocations}></Restaurant>);
        }
        else if (this.state.locationtype === 'S') {
            return(<SportsVenue id={this.state.locationid} onUpdate={this.loadLocations}></SportsVenue>);
        }
    }

    getInfoWindowContents(selectedPlace) {
        if (selectedPlace !== undefined &&
            selectedPlace.type !== undefined ) {

            var location = this.state.locations.filter(function(location) { return location.id === selectedPlace.id })[0];

            if (selectedPlace.type === 'R') {
                return(
                    <div>
                        <p className="actionable" onClick={() => this.openModal(location, this.toggleViewLocationModal)}>View Details</p>
                        <p className="small-text-title">{location.description}</p>
                    </div>
                );
            }
            else if (selectedPlace.type === 'S') {
                return(
                    <div>
                        <p className="actionable" onClick={() => this.openModal(location, this.toggleViewLocationModal)}>View Details</p>  
                        <p className="small-text-title">{location.description}</p>
                    </div>
                );
            }
            else {
                return(
                    <div>
                        <div>
                            <p className="small-text-title">Last visited</p>
                            {location.description}
                        </div>
                        <p className="actionable" onClick={() => this.openModal(location, this.toggleUpdateLastVisitModal)}>Update Last Visit</p>
                    </div>
                );
            }
        }
    }

    renderLocations() {
        return this.state.locations.map(location => (
            <Marker onClick={this.onMarkerClick}
                    id={location.id}
                    name={location.name}
                    type={location.type}
                    description={location.description}
                    position={{ lat: location.latitude, lng: location.longitude }} 
                    icon={{ url: this.getIcon(location.type) }}/>
        ))
    }

    render() {
        return (
            <div>
                <Map google={this.props.google} 
                     zoom={14} 
                     onClick={this.onMapClicked}
                     initialCenter={{
                        lat: 41.8781,
                        lng: -87.6298
                     }}>
                    {this.renderLocations()}
                    <InfoWindowEx
                        marker={this.state.activeMarker}
                        visible={this.state.showingInfoWindow}>
                        <div className="centered location-details">
                            <h3>{this.state.selectedPlace.name}</h3>   
                            {this.getInfoWindowContents(this.state.selectedPlace)}
                        </div>
                    </InfoWindowEx>
                </Map>
                <button className="add-location-actionable" onClick={this.toggleAddLocationModal}>Add Location</button>
                <Modal 
                    isOpen={this.state.isViewLocationOpen}
                    onRequestClose={this.toggleViewLocationModal}
                    className="modal"
                    overlayClassName="overlay">
                    <div>
                        <img src={close} className="modal-close" alt="close" onClick={this.toggleViewLocationModal} />
                        <div className="modal-title">
                            <h3>{this.state.locationname}</h3>
                        </div>
                        {this.viewLocation()}
                    </div>
                </Modal>
                <Modal 
                    isOpen={this.state.isAddLocationOpen}
                    onRequestClose={() => this.toggleAddLocationModal(false)}
                    className="modal"
                    overlayClassName="overlay">
                    <div>
                        <img src={close} className="modal-close" alt="close" onClick={() => this.toggleAddLocationModal(false)} />
                        <div className="modal-title">
                            <h3>Add Location</h3>
                        </div>
                        <AddLocation onSave={() => this.toggleAddLocationModal(true)} />
                    </div>
                </Modal>
                <Modal 
                    isOpen={this.state.isUpdateLastVisitOpen}
                    onRequestClose={this.toggleUpdateLastVisitModal}
                    className="modal"
                    overlayClassName="overlay">
                    <div>
                        <img src={close} className="modal-close" alt="close" onClick={() => this.toggleUpdateLastVisitModal(false)} />
                        <div className="modal-title">
                            <h3>Update Last Visit</h3>
                        </div>
                        <UpdateLastVisit id={this.state.locationid} name={this.state.locationname} onSave={() => this.toggleUpdateLastVisitModal(true)} />
                    </div>
                </Modal>
            </div>
        );
    }
}

export default GoogleApiWrapper({
    apiKey: ("ENTER_GOOGLE_API_KEY")
})(MapContainer)

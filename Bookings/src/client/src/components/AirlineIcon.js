import React, {Component} from 'react';
const images = require.context('../images', true);

export default class AirlineIcon extends Component {
    getIcon(code) {
        return images('./' + code + '.png');
    }

    render() {
        return (
            <div> 
                <img src={this.getIcon(this.props.code)} alt={this.props.name} />     
                {this.props.name}
            </div>
        );
    }
} 
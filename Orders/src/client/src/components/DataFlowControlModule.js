import React, {Component} from 'react';
import 'rc-slider/assets/index.css';
import Slider from 'rc-slider';

export default class ControlModule extends Component {

    marks = {
        0: 'Off',
        1: 'Normal',
        2: {
            style: {
                color: 'orange',
            },
            label: 'Weekends',
        },
        4: {
            style: {
                color: 'red',
            },
            label: 'Black Friday',
        },
    };

    constructor(props) {
        super(props);
        
        this.state = {
            traffic_multiplier: 1,
            write_percentage: 10,
            read_percentage: 90,
            variation_percentage: 20
        };

        this.onSliderChange = this.onSliderChange.bind(this);
        this.onChangeReadOption = this.onChangeReadOption.bind(this);
        this.onChangeWriteOption = this.onChangeWriteOption.bind(this);
        this.onChangeVariationOption = this.onChangeVariationOption.bind(this);
    }

    createPercentageOptions = (selectedValue) => {
        let options = []
    
        for (let i = 0; i <= 10; i++) {
            let val = i * 10;

            if (val === selectedValue) {
                options.push(<option selected={true} value={val}>{val}%</option>);
            }
            else {
                options.push(<option value={val}>{val}%</option>);
            }
        }

        return options;
    }

    onSliderChange(traffic_multiplier) {
        if (this.state.traffic_multiplier !== traffic_multiplier) {
            this.setState({traffic_multiplier});
            this.onConfigurationChanged(traffic_multiplier, this.state.read_percentage, this.state.write_percentage, this.state.variation_percentage);
        }
    }

    onChangeReadOption(event) {
        var read_percentage = event.target.value;
        if (this.state.read_percentage !== read_percentage) {
            var write_percentage = 100 - read_percentage;
            this.setState({ write_percentage, read_percentage });
            this.onConfigurationChanged(this.state.traffic_multiplier, read_percentage, write_percentage, this.state.variation_percentage);
        }
    }

    onChangeWriteOption(event) {
        var write_percentage = event.target.value;
        if (this.state.write_percentage !== write_percentage) {
            var read_percentage = 100 - write_percentage;
            this.setState({ write_percentage, read_percentage });
            this.onConfigurationChanged(this.state.traffic_multiplier, read_percentage, write_percentage, this.state.variation_percentage);
        }
    }

    onChangeVariationOption(event) {
        var variation_percentage = event.target.value;
        if (this.state.variation_percentage !== variation_percentage) {
            this.setState({ variation_percentage });
            this.onConfigurationChanged(this.state.traffic_multiplier, this.state.read_percentage, this.state.write_percentage, variation_percentage);
        }
    }

    onConfigurationChanged(traffic_multiplier,read_percentage,write_percentage,variation_percentage) {
        var configuration = { traffic_multiplier, read_percentage, write_percentage, variation_percentage };
        this.props.onConfigurationChanged(configuration);
    }

    render() {
        return (
            <div className="div-margin-25">
                <div>
                    <Slider min={0} max={4} marks={this.marks} step={null} onAfterChange={this.onSliderChange} defaultValue={this.state.traffic_multiplier} />
                </div>
                <div className="width-60 margin-top-65 centered-horizontally">
                    <div className="float-left div-width-33">
                        <p>Read %:</p>
                        <select onChange={this.onChangeReadOption}>
                            {this.createPercentageOptions(this.state.read_percentage)}
                        </select>
                    </div>
                    <div className="float-left div-width-33">
                        <p>Write %:</p>
                        <select onChange={this.onChangeWriteOption}>
                            {this.createPercentageOptions(this.state.write_percentage)}
                        </select>
                    </div>
                    <div className="float-left div-width-33">
                        <p>Variation %:</p>
                        <select onChange={this.onChangeVariationOption}>
                            {this.createPercentageOptions(this.state.variation_percentage)}
                        </select>
                    </div>
                    <div style={{clear: "both"}} />
                </div>
                            
            </div>
        );
    }
}
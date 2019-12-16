import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import {
  SelectionState,
  SortingState,
  IntegratedSorting,
} from '@devexpress/dx-react-grid';

import {
  Grid,
  Table,
  TableHeaderRow,
  TableSelection
} from '@devexpress/dx-react-grid-material-ui';

export default class AirlinesFlightsInfo extends Component {

    state = {
        data: [],
        selection: [],
        columns: [
            { name: 'airline', title: 'Airline' },
            { name: 'flight_count', title: 'Flights' },
            { name: 'market_share_pct', title: 'Market %' },
            { name: 'delayed_pct', title: 'Delayed %' },
            { name: 'diverted_pct', title: 'Diverted %' },
            { name: 'cancelled_pct', title: 'Cancelled %' }
        ]
    };

    constructor(props) {
        super(props);
        this.changeSelection = this.changeSelection.bind(this);
    }

    componentDidMount() {
        if (this.props !== null && 
            this.props.origin !== null &&
            this.props.destination !== null) {
            this.load(this.props.origin.code, this.props.destination.code, 
                      this.props.yearFrom, this.props.yearTo, this.props.month, this.props.day);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps !== null && 
            nextProps.origin !== null &&
            nextProps.destination !== null) {
            this.load(nextProps.origin.code, nextProps.destination.code, 
                      nextProps.yearFrom, nextProps.yearTo, nextProps.month, nextProps.day);
        }
    }

    async load(origin, dest, yearFrom, yearTo, month, day) {
        await this.getStats(origin, dest, yearFrom, yearTo, month, day)
            .then(res => {
                this.setState({ data: res })
            })
            .catch(err => console.log(err));
    }

    async getStats(origin, dest, yearFrom, yearTo, month, day) {
        const response = await fetch('/api/flights/airlines_stats?o=' + origin + "&dst=" + dest + "&yf=" 
                                                                      + yearFrom + "&yt=" + yearTo + "&m=" + month + "&d=" + day);
        const body = await response.json();
        if (response.status !== 200) {
            throw Error(body.message) 
        } 
        return body;
    }; 
    
    changeSelection(selection) {
        const lastSelected = selection
          .find(selected => this.state.selection.indexOf(selected) === -1);
        
        if (lastSelected !== undefined) {
            this.setState({ selection: [lastSelected] });
            var d = this.state.data[lastSelected];
            if (d !== undefined) {
                this.props.airlineSelected({ code: d.carrier, name: d.airline});
            }
        } else {
            // NOTE: Uncomment the next line in order to allow clear selection by double-click
            //this.setState({ selection: [] });
            //this.props.airlineSelected(null);
        }
    }

    render() {
        const { data, columns, selection } = this.state;

        return (
            <Paper>
                <Grid
                    rows={data}
                    columns={columns}>
                    <SelectionState
                        selection={selection}
                        onSelectionChange={this.changeSelection}
                    />
                    <SortingState defaultSorting={[{ columnName: 'cancelled_pct', direction: 'desc' }]} />
                    <IntegratedSorting />
                    <Table />
                    <TableHeaderRow showSortingControls />
                    <TableSelection
                        selectByRowClick
                        highlightRow
                        showSelectionColumn={false}
                    />
                </Grid>
            </Paper>
        );
    }
}

AirlinesFlightsInfo.propTypes = {
    airlineSelected: PropTypes.func.isRequired,
    origin: PropTypes.object,
    destination: PropTypes.object,
    yearFrom: PropTypes.number,
    yearTo: PropTypes.number,
    month: PropTypes.number,
    day: PropTypes.number
};
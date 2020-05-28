
import React, { Component } from 'react';
import '../../node_modules/react-vis/dist/style.css';
import {XYPlot, XAxis, YAxis, VerticalGridLines, HorizontalGridLines, VerticalBarSeries} from 'react-vis';
import BackendData from '../BackendData.js';
import Timestamp from '../Timestamp.js';
import ErrorBoundry from '../ErrorBoundry.js';
import months from './months.js';

export default class ChartColumn extends Component {

    constructor(props) {
        super(props);

        this.ChartWidth = React.createRef();

        this.state = {
            height: 300,
            width: 300,
            data: null,
            titles: {"X": "x", "Y": "y"}
        }
    }

    static getDerivedStateFromProps(props, state) {
        if (props !== undefined) {
            if (Object.keys(props.chart).length > 0) {
                if (props.chart.ChartData.EmployeeId !== state.prevId) {
                    return {
                        data: null,
                        prevId: props.chart.ChartData.EmployeeId,
                        titles: {'X': "x", 'Y': "y"}
                    }
                }
            }
        }
        return null;
    }
    
    async componentDidMounnt() {
        if (this.props.chart !== undefined) {
            //if (Object.keys(this.props.chart).length > 0) {  // TODO maybe this is needed
                const arg = this.props.chart.ChartData;
                const chart = this._fetchChartData(arg.EmployeeId, arg.From, arg.To);
                // Update state
                this.setState({
                    data: chart,
                    titles: this.props.chart.KeyData
                });
        }
    }

    componentDidUpdate(prevProps, prevState) {
        // Can't update with undefined props
        if (this.props !== undefined) {
            // Need to remove empty props
            if (Object.keys(this.props.chart).length > 0) {
                if (this.state.data === null) {
                    console.log("this.props: ");
                    console.log(this.props.chart);
                    const arg = this.props.chart.ChartData;
                    this._fetchChartData(arg.EmployeeId, arg.From, arg.To, this.props.chart.KeyData);
                }
            }
        }
    }

    _fetchChartData(id, from, to, keydata) {
        const be = new BackendData();
        
        const timeFrom = new Timestamp(from);
        const timeTo = new Timestamp(to);
        be.getESDcheckInterval(id, timeFrom.toTimestamp(), timeTo.toTimestamp())
            .then(result => {
                let dataTrue = [];
                let dataFalse = [];
                // Loop through each row
                let mapForDataTrue = new Map();
                let mapForDataFalse = new Map();
                for (let row of result) {
                    const timeStamp = new Timestamp(row.date, true);
                    // First time we need to check if key exist, otherwise increment one
                    if (row.passed === true) {
                        if (mapForDataTrue.has(timeStamp.month)) {
                            mapForDataTrue.set(timeStamp.month, (mapForDataTrue.get(timeStamp.month)+1));
                        }
                        else {
                            mapForDataTrue.set(timeStamp.month, 1);
                        }
                    }
                    else {
                        if (mapForDataFalse.has(timeStamp.month)) {
                            mapForDataFalse.set(timeStamp.month, (mapForDataFalse.get(timeStamp.month)+1));
                        }
                        else {
                            mapForDataFalse.set(timeStamp.month, 1);
                        }
                    }
                                
                }
                // Sort according to date
                //var sortedData = new Map([...map.entries()].sort());

                // Convert into chart data
                for (const [k, v] of mapForDataTrue.entries()) {
                    dataTrue.unshift({x: months[k], y: v})
                }
                for (const [k, v] of mapForDataFalse.entries()) {
                    dataFalse.unshift({x: months[k], y: v})
                }
                return {"DataPassed": dataTrue, "DataFailed": dataFalse};
            })
            .then(chart => {
                // Calculate height and width of chart
                let widthWin = this.ChartWidth.current.clientWidth-20;
                let heightWin = this.ChartWidth.current.clientHeight-20;
                //let width = chart.DataPassed.length * 80;
                //let height = chart.DataPassed.length * 80;
                // If amount of data is less then window
                if (widthWin > heightWin) {
                    widthWin = heightWin;
                } else {
                    heightWin = widthWin;
                }
                // Set new values
                this.setState({
                    data: chart,
                    titles: keydata,
                    height: heightWin,
                    width: widthWin
                })
            })
            .catch(error => {
                console.warn(error)
            })
    }

    render() {
    
        // default data 
        let renderDataPassed = [
            {x: 'A', y: 10},
            {x: 'B', y: 5},
            {x: 'C', y: 15}
        ];
        let renderDataFailed = [];
        // insert value if exist
        if (this.state.data !== null) {
            renderDataPassed = this.state.data["DataPassed"];
            renderDataFailed = this.state.data["DataFailed"];
        } 
   
        return (
            <div className="ChartColumn" ref={this.ChartWidth}>
                <ErrorBoundry>
                <XYPlot 
                    width={this.state.width}
                    height={this.state.height} 
                    xType="ordinal" >
                    <VerticalGridLines />
                    <HorizontalGridLines />
                    <VerticalBarSeries data={renderDataPassed} color="green" />
                    <VerticalBarSeries data={renderDataFailed} color="red" />
                    <XAxis title={this.state.titles.X} /> 
                    <YAxis title={this.state.titles.Y} /> 
                </XYPlot>
                </ErrorBoundry>
            </div>
        );
    }
}


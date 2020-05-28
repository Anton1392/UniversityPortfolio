import React, { Component } from 'react';
//import SelectionHeader from './SelectionHeader.js'
import ChartColumn from './ChartColumn.js';
import BackendData from '../BackendData.js';
import ErrorBoundry from '../ErrorBoundry.js';
import AdminSelectorUser from '../Admin/AdminSelectUser.js'
import Strings from '../strings.js'

export default class ChartMain extends Component {

    constructor(props) {
        super(props);

        this.be = new BackendData();
        this.mounted = false;

        this.state = {
            employeeUpdate: 0,
            selectedEmployee: '',
            from: '',
            to: '',
            chart: {},
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSelectChangeEmployee = this.handleSelectChangeEmployee.bind(this);
    }

    componentDidMount() {
        this.mounted = true;

        let jwt = localStorage.getItem("jwt");
        if (jwt) {
            this.be.token = jwt;
        }
        else {
            console.log("No jwt found");
        }
    }

    componentWillUnmount() {
        this.mounted = false;
        this.be.abort();
    }

    handleSelectChangeEmployee(selectedValue) {
        let arraySplit = selectedValue.split(' ');
        console.log(arraySplit)
        this.setState({
            selectedEmployee: arraySplit[0]
        });
    }

    handleChange(event) {
        const target = event.target;
        const name = target.name;
        let value = '';
        switch(name) {
            case 'employeeId':
                value = target.value;
                break;
            case 'from':
                value = target.value;
                break;
            case 'to':
                value = target.value;
                break;
            default:
                console.warn("Error handleChange got a default value")
                console.warn(target.value)
        }
        this.setState({
            [name]: value
        });
    }

    handleSubmit(event) {

        if( this.state.employeeId !== '' && this.state.from !== '' && this.state.to !== '') {
            const chartKeys = {
                'X': "Month",
                'Y': "Amount"
            };
            const chartData = {
                'EmployeeId': this.state.selectedEmployee,
                'From': this.state.from,
                'To': this.state.to
            };
            console.log(chartData)
            this.setState({
                chart: {
                    'KeyData': chartKeys,
                    'ChartData': chartData
                }
            });
        }

        event.preventDefault();
    }

    render() {
        return (
        <div>
            <div className="App-FormView App-FormView-Fixed">
                <form className="App-Form-Style" onSubmit={this.handleSubmit}>
                    <ul>
                    <li>
                        <ErrorBoundry>
                        <AdminSelectorUser
                            name="employeeSelector"
                            update={this.state.employeeUpdate}
                            onSelectChange={this.handleSelectChangeEmployee}>
                        </AdminSelectorUser>
                        </ErrorBoundry>
                    </li>
                    <li>
                        <label htmlFor="from">{Strings.TABLEFORM_DATE_FROM}</label>
                        <input type="date"
                            name="from"
                            value={this.state.from}
                            onChange={this.handleChange}/>
                    </li>
                    <li>
                        <label htmlFor="to">{Strings.TABLEFORM_DATE_TO}</label>
                        <input type="date"
                            name="to"
                            value={this.state.to}
                            onChange={this.handleChange}/>
                    </li>
                    <input type="submit" value="Submit"/>
                    </ul>
                </form>
            </div>
            <div className="App-DataView">
                <h1 id='title'>Chart</h1>
                <div className="App-DataView-Style">
                    <ErrorBoundry>
                        <ChartColumn chart={this.state.chart}/>
                    </ErrorBoundry>
                </div>
            </div>
        </div>
        )
    }
}

import BackendData from '../BackendData';
import Timestamp from '../Timestamp';
import Table from './Table';
import React, { Component, Fragment } from 'react';
import ErrorBoundry from '../ErrorBoundry';
import TableDialogExport from './TableDialogExport';
import AdminSelectUser from '../Admin/AdminSelectUser.js';
import Strings from '../strings.js';

export default class TableMain extends Component {

    constructor(props) {
        super(props);

        this.be = new BackendData();
        this.mounted = false;

        let table = {};
        table['KeyData'] = [];
        table['TableData'] = [];

        this.state = {
            employeeId: '',
            firstName: '',
            secondName: '',
            from: '',
            to: '',
            table: table,
            showExportDialog: false,
            employees: '',
            howtoMsg: 'Fill in the forms',
            userUpdate: 0,
            showDownload: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmitView = this.handleSubmitView.bind(this);
        this.handleButtonExport = this.handleButtonExport.bind(this);
        this._handleFetchData = this._handleFetchData.bind(this);
        this._updateTableData = this._updateTableData.bind(this);
        this._handleFetchError = this._handleFetchError.bind(this);
        this.handleSelectChangeUser = this.handleSelectChangeUser.bind(this);
        this.disablExportWindow = this.disablExportWindow.bind(this);
    }

    componentDidMount() {
      this.mounted = true;

      let jwt = localStorage.getItem("jwt");
      if (jwt) {
        this.be.token = jwt;
      }

      this.be.getEmployee()
        .then(result => {
          if (result !== undefined) {
            this.setState({
                employees: result
            });
          }
        })
        .catch(error => {
          this._handleFetchError(error);
        })
    }

    componentWillUnmount() {
        this.mounted = false;
        this.be.abort();
    }

    handleChange(event) {
        const target = event.target;
        const name = target.name;
        let value = '';
        switch(name) {
            case 'firstName':
                value = target.value;
                break;
            case 'secondName':
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

    handleSelectChangeUser(selectedValue) {
      let splitValue = selectedValue.split(" ");
      if ( splitValue.length < 3 ) {
        this.setState({
          firstName: '',
          secondName: '',
          employeeId: ''
        })
      }
      else {
        this.setState({
          firstName: splitValue[1],
          secondName: splitValue[2],
          employeeId: splitValue[0],
          howtoMsg: ''
        })
      }
    }

    handleButtonExport(event) {

        // Check if table exist
        if (this.state.table["TableData"].length !== 0  && this.state.table !== undefined) {
            this.setState({
                showExportDialog: true
            })
        }
        else {
            console.log("There is no data")
        }
        event.preventDefault();
    }

    // Do not show the export window
    disablExportWindow() {
      this.setState({
          showExportDialog: false
      })
    }

    // Choose correct request based on filled out forms
    handleSubmitView(event) {

        let tsUsed = this._checkTimestampUsed();
        let nameUsed = this._checkNameUsed();
        let from, to;
        if (tsUsed) {
          from = new Timestamp(this.state.from);
          to = new Timestamp(this.state.to);
        }

        // 4 cases: Name, Time
        //          Name, no Time
        //          No Name, Time
        //          No Name, no Time
        // If a name is used
        if ( nameUsed ) {
          try {
            // Check for valid input (integer)
            const employeeId = parseInt(this.state.employeeId);

            // Check if timestamps used
            if ( tsUsed ) {
              this.be.getESDcheckInterval(employeeId, from.toTimestamp(), to.toTimestamp())
              .then(result => {
                  return this._handleFetchData(result);
              })
              .then(chart => {
                this._updateTableData(chart);
              })
              .catch(error => {
                this._handleFetchError(error);
              })
            }
            else {
              // Get all esdchecks for employeeId for all time.
              this.be.getESDcheckByEmployee(employeeId)
                .then(result => {
                  return this._handleFetchData(result);
                })
                .then(chart => {
                    this._updateTableData(chart);
                })
                .catch(error => {
                  this._handleFetchError(error);
                })
              }
            }
            catch(error) {
                console.warn(error)
                return;
            }
        }
        // If no employee with specified name found
        else {
          if ( tsUsed ) {
            //TODO Function does not exist in backend yet
            // Get all ESD checks in specified interval
            /*
            this.be.getESDcheckInterval(from.toTimestamp(), to.toTimestamp())
              .then(result => {
                return this._handleFetchData(result);
              })
              .then(chart => {
                  this._updateTableData(chart);
              })
              .catch(error => {
                this._handleFetchError(error);
              })
              */

          }
          else {
            // Get all ESD checks in database
            this.be.getESDcheckAll()
              .then(result => {
                return this._handleFetchData(result);
              })
              .then(chart => {
                  this._updateTableData(chart);
              })
              .catch(error => {
                this._handleFetchError(error);
              })
            }
          }

        event.preventDefault();
    }

    _checkTimestampUsed() {
      return this.state.from !== '' && this.state.to !== ''
    }

    _checkNameUsed() {
      return this.state.firstName !== '' && this.state.secondName !== '';
    }

    // Handle incoming data and make names on columns sensible
    _handleFetchData(data) {

      let tableData = [];
      if (data !== undefined) {
          if (data.length === 0) {
            this.setState({
                howtoMsg: 'No data found'
            });
            return tableData;
          }
          // Loop through each row
          data.forEach(row => {
              let newRow = {};
              for (const [k, v] of Object.entries(row) ) {
                if ( k === 'date' ) {
                  let tmpTS = new Timestamp(v, true);
                  newRow["Date"] = tmpTS.toZonedString();
                }
                else if ( k === "employeeId" ) {
                  this.state.employees.forEach(emp => {
                    if ( v === emp["id"] ) {
                      newRow["Name"] = emp["firstName"] + " " + emp["lastName"];
                    }
                  })
                }
                else if ( k === "passed" ) {
                  if ( v ) {
                    newRow["ESD Test"] = "PASSED";
                  }
                  else {
                    newRow["ESD Test"] = "FAILED";
                  }
                }
              }
              tableData.push(newRow);
          });
      }
      return tableData;
    }

    _updateTableData(data) {
      if ( data !== undefined ) {
        let table = this.state.table;
        let showButton = false;
        if (Object.keys(data).length > 0) {
          showButton = true;
        }
        table['TableData'] = data;
        this.setState({
          table: table,
          showDownload: showButton
        });
      }
    }

    _handleFetchError(error) {
      this.setState({
        howtoMsg: 'Error while retrieving data'
      })
      console.warn(error)
      console.log(this.state.howtoMsg)
    }

    render() {

        return (
        <Fragment>
            <div className="App-FormView App-FormView-Fixed">
                <form className="App-Form-Style" onSubmit={this.handleSubmitView}>
                    <ul>
                    <li>
                        <ErrorBoundry>
                        <AdminSelectUser
                            name="esdSelector"
                            update={this.state.userUpdate}
                            onSelectChange={this.handleSelectChangeUser}>
                        </AdminSelectUser>
                        </ErrorBoundry>
                    </li>
                    <li>
                        <label htmlFor="firstName">{Strings.TABLEFORM_FIRST_NAME}</label>
                        <input type="text"
                            name="firstName" // name and variable name most be the same
                            disabled={true}
                            value={this.state.firstName}
                            onChange={this.handleChange} />
                    </li>
                    <li>
                        <label htmlFor="secondName">{Strings.TABLEFORM_LAST_NAME}</label>
                        <input type="text"
                            name="secondName"
                            disabled={true}
                            value={this.state.secondName}
                            onChange={this.handleChange} />
                    </li>
                    <li>
                        <label htmlFor="employeeId">{Strings.TABLEFORM_EMPLOYEE_ID}</label>
                        <input type="text"
                            name="employeeId"
                            value={this.state.employeeId}
                            onChange={this.handleChange} />
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
                <h1 id='title'>Dynamic Table</h1>
                <ErrorBoundry>
                    <Table data={this.state.table}/>
                </ErrorBoundry>
                <div className="App-DataView-Style">
                  { this.state.showDownload ? <button name="download" onClick={this.handleButtonExport}>Download</button> : null }
                </div>
                <TableDialogExport
                    show={this.state.showExportDialog}
                    disable={this.disablExportWindow}
                    data={this.state.table} />
            </div>
        </Fragment>
        )
    }
}

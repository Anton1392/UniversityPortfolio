
import React, { Component } from 'react'
import BackendData from '../BackendData.js'
import AdminSelectUser from './AdminSelectUser.js';
import AdminListEsd from './AdminListEsd.js';
import ErrorBoundry from '../ErrorBoundry.js'

export default class AdminMain extends Component {

    constructor(props) {
        super(props);

        this.be = new BackendData();
        this.mounted = false;

        this.state = {
            userLogin: '',
            userPwd: '',
            employeeFirst: '',
            employeeSecond: '',
            employeeCardId: '',
            userUpdate: 0,
            selectedDelete: '',
            selectedEsd: '',
            esdFrom: '',
            esdTo: '',
            esdUser: {}
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSelectChangeEmployee = this.handleSelectChangeEmployee.bind(this);
        this.handleSelectChangeEsd = this.handleSelectChangeEsd.bind(this);
        this.checkChangeEsd = this.checkChangeEsd.bind(this);
        this.handleClickCreateUser = this.handleClickCreateUser.bind(this);
        this.handleClickCreateEmployee = this.handleClickCreateEmployee.bind(this);
        this.handleClickDeleteEmployee = this.handleClickDeleteEmployee.bind(this);

    }

    componentDidMount() {
        this.mounted = true;

        const jwt = localStorage.getItem("jwt");
        if (jwt) {
            this.be.token = jwt;
        }
    }

    componentWillUnmount() {
        this.mounted = false;
        this.be.abort();
    }

    handleChange(event) {
        const target = event.target;
        const name = target.name;
        let value = target.value;
        if (this.mounted === true) {
            this.setState({
                [name]: value
            });
        }
        if (name === 'esdFrom') {
            this.checkChangeEsd(value, this.state.esdTo, this.state.selectedEsd);
        }
        else if (name === 'esdTo') {
            this.checkChangeEsd(this.state.esdFrom, value, this.state.selectedEsd);
        } 
    }


    handleSelectChangeEmployee(selectedValue) {
        if (this.mounted === true) {
            this.setState({
                selectedDelete: selectedValue
            })
        }
    }

    handleSelectChangeEsd(selectedValue) {
        if (this.mounted === true) {
            this.setState({
                selectedEsd: selectedValue,
            });
            this.checkChangeEsd(this.state.esdFrom, this.state.esdTo, selectedValue);
        }
    }

    checkChangeEsd(from, to, esd) {
        if (from !== '' && to !== '' && esd !== '') {
            let arraySplit = esd.split(' ');
            let selectedUser = {
                id: arraySplit[0],
                from: from,
                to: to
            };
            if (this.mounted === true) {
                this.setState({
                    esdUser: selectedUser
                });
            }
        }
        else {
            if (this.mounted === true) {
                this.setState({
                    esdUser: {}
                });
            }
        }
    }

    handleClickCreateUser(event) {
        if (this.state.userLogin !== '' && this.state.userPwd !== '') {
            this._fetchCreateUser(this.state.userLogin, this.state.userPwd);
        }
    }

    handleClickCreateEmployee(event) {
        if (this.state.employeeFirst !== '' 
            && this.state.employeeSecond !== '' 
            && this.state.employeeSecond !== '') {
            this._fetchCreateEmployee(
                this.state.employeeFirst, 
                this.state.employeeSecond, 
                this.state.employeeCardId);
        }
    }

    handleClickDeleteEmployee(event) {
        if (this.selectedDelete !== '') {
            const argArray = this.state.selectedDelete.split(' ');
            this._fetchDeleteEmployee(argArray[0]);
        }
    }

    _fetchCreateEmployee(first, second, id) {
        this.be.createEmployee(first, second, id)
        .then(result => {
            if (result !== undefined && this.mounted === true) {
                this.setState({
                    employeeFirst: '',
                    employeeSecond: '',
                    employeeCardId: '',
                    userUpdate: 1
                })
            }
        })
        .then(() => {
            if (this.mounted === true) {
                this.setState({
                    userUpdate: 0
                })
            }
        })
    }

    _fetchDeleteEmployee(id) {
        this.be.deleteEmployee(id)
        .then(result => {
            if (result !== undefined && this.mounted === true) {
                this.setState({
                    userUpdate: 1
                })
            }
        })
        .then(() => {
            if (this.mounted === true) {
                this.setState({
                    userUpdate: 0
                })
            }
        })
    }

    _fetchCreateUser(login, pwd) {
        const result = this.be.createUser(login, pwd);
        if (result !== true && this.mounted === true) {
            this.setState({
                userLogin: '',
                userPwd: ''
            })
            return true;
        } else {
            return false;
        }
    }


    render() {

        return (
            <div>
                <div className="App-FullView-Style" align="center">
                    <div className="App-Form-Style">
                        <ul>
                        <h3>Administrate User Create</h3>
                        <li>
                            <label htmlFor="userLogin">First name:</label>
                            <input type="text"
                                name="userLogin"
                                value={this.state.userLogin}
                                onChange={this.handleChange} />
                        </li>
                        <li>
                            <label htmlFor="userPwd">Second name:</label>
                            <input type="text"
                                name="userPwd"
                                value={this.state.userPwd}
                                onChange={this.handleChange} />
                        </li>
                        <li>
                            <button onClick={this.handleClickCreateUser}>Create</button>
                        </li>
                        </ul>
                    </div>
                    <div className="Table-Form-Inner App-Form-Style">
                        <ul>
                        <h3>Administrate Employee Delete</h3>
                        <li>
                        <label htmlFor="userName">Auth user:</label>
                            <ErrorBoundry>
                            <AdminSelectUser
                                name="userSelector"
                                update={this.state.userUpdate}
                                onSelectChange={this.handleSelectChangeEmployee}>
                            </AdminSelectUser>
                            </ErrorBoundry>
                        </li>
                        <li>
                            <button onClick={this.handleClickDeleteEmployee}>Delete</button>
                        </li>
                        </ul>
                    </div>
                    <div className="App-Form-Style">
                        <ul>
                        <h3>Administrate Employee Create</h3>
                        <li>
                            <label htmlFor="userFirstName">First name:</label>
                            <input type="text"
                                name="employeeFirst"
                                value={this.state.employeeFirst}
                                onChange={this.handleChange} />
                        </li>
                        <li>
                            <label htmlFor="userSecondName">Second name:</label>
                            <input type="text"
                                name="employeeSecond"
                                value={this.state.employeeSecond}
                                onChange={this.handleChange} />
                        </li>
                        <li>
                            <label htmlFor="userCardId">Card Id:</label>
                            <input type="text"
                                name="employeeCardId"
                                value={this.state.employeeCardId}
                                onChange={this.handleChange} />
                        </li>
                        <li>
                            <button onClick={this.handleClickCreateEmployee}>Create</button>
                        </li>
                        </ul>
                    </div>
                    <div className="App-Form-Style">
                        <ul>
                        <h3>Administrate ESD values</h3>
                        <li>
                            <label htmlFor="employeeId">Select employee:</label>
                            <ErrorBoundry>
                            <AdminSelectUser
                                name="esdSelector"
                                update={this.state.userUpdate}
                                onSelectChange={this.handleSelectChangeEsd}>
                            </AdminSelectUser>
                            </ErrorBoundry>
                        </li>
                        <li>
                            <label htmlFor="esdFrom">Date from:</label>
                            <input type="date"
                                name="esdFrom"
                                value={this.state.esdFrom}
                                onChange={this.handleChange}/>

                        </li>
                        <li>
                            <label htmlFor="esdTo">Date to:</label>
                            <input type="date"
                                name="esdTo"
                                value={this.state.esdTo}
                                onChange={this.handleChange}/>
                        </li>
                        <li>
                            <ErrorBoundry>
                            <AdminListEsd
                                name="esdList"
                                user={this.state.esdUser}>
                            </AdminListEsd>
                            </ErrorBoundry>
                        </li>
                        </ul>
                    </div>
                </div>
            </div>
        )
    }

}

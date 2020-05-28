
import React, { Component } from 'react'
import BackendData from '../BackendData.js'

export default class AdminSelectUser extends Component {

    constructor(props) {
        super(props);

        this.be = new BackendData();
        this.mounted = false;

        this.state = {
            list: []
        }
        this.update = 0;

        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        this.mounted = true;

        let jwt = localStorage.getItem("jwt");
        if (jwt) {
          this.be.token = jwt;
        }

        if (this.props !== undefined) {
            this._fetchAllUsers();
        }
    }

    componentDidUpdate(prevProps, prevState) {
        // Can't update with undefined props
        if (this.props !== undefined) {
            // Only update if parent ask to
            if (this.update !== Number(this.props.update)) {
                this._fetchAllUsers();
            }
        }
    }

    componentWillUnmount() {
        this.mounted = false;
        this.be.abort();
    }

    handleChange(event) {
        // Return selected value to parent
        const selected = event.target.selectedIndex;
        const value = event.target[selected].text;
        this.props.onSelectChange(value);
    }

    _fetchAllUsers() {
        const be = new BackendData();
        be.getEmployee().then(result => {
            let fetchedData = []
            if (result !== undefined) {
                // Loop through data and create map
                result.forEach(e => {
                    let row = {};
                    row["id"] = e.id;
                    row["name"] = e.id + " " + e.firstName + " " + e.lastName;
                    //fetchedData.unshift(row)
                    fetchedData.push(row)
                });
            }
            return fetchedData;
        })
        .then(list => {
            if (this.mounted) {
                this.setState({
                    list: list
                });
            }
        });
    }

    _structList() {
        let list = this.state.list;
        if (list !== undefined) {
            let options = list.map((data) =>
                <option key={data.id} value={data.id}>
                    {data.name}
                </option>
            );
            return options;
        }
        else
            return [];
    }

    render() {

        let options = this._structList();

        return (
            <select
                name="AdminSelectUser"
                className="Admin-User-Select"
                onChange={this.handleChange}>
                <option>Select user</option>
                {options}
            </select>
        )
    }

}

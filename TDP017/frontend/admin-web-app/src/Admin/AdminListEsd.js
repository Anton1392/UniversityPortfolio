
import React, { Component } from 'react'
import BackendData from '../BackendData.js'
import Timestamp from '../Timestamp.js';

export default class AdminListEsd extends Component {

    constructor(props) {
        super(props);

        this.be = new BackendData();
        this.mounted = false;

        this.state = {
            list: [], 
            listChkBoxes: {}
        }

        this.handleCheckBoxes = this.handleCheckBoxes.bind(this);
        this.handleClickDelete =  this.handleClickDelete.bind(this);
    }

    componentDidMount() {
        this.mounted = true;
        let jwt = localStorage.getItem("jwt");
        if (jwt) {
            this.be.addToken(jwt);
        }

        if (this.props.user !== undefined) {
            // Don't render empty objects
            if (Object.keys(this.props.user).length > 0) {
                this.createList();
            }
        }
    }

    componentDidUpdate(prevProps, prevState) {
        // Can't update with undefined props
        if (this.props.user !== undefined) {
            // Don't fetch empty objects
            if (Object.keys(this.props.user).length > 0) {
                // Compare props according to react's manual
                if (this.props.user.id !== prevProps.user.id) {
                    this.createList();
                }
            }
            // Clear list if needed
            else {
                if (this.props.user !== prevProps.user) {
                    this.clearList();
                }
            }
        }
    }

    componentWillUnmount() {
        this.mounted = false;
        this.be.abort();
    }

    handleCheckBoxes(event) {
        const chk = event.target.name;
        let chkBoxDict = this.state.listChkBoxes;
        chkBoxDict[chk] = (chkBoxDict[chk] === true) ? false : true;
        //console.log("chk" + chk);
        //console.log(chkBoxDict[chk]);
        this.setState({
            listChkBoxes: chkBoxDict
        });
    }

    handleClickDelete(event) {
        // Loop through listChkBoxes and delete does necessary
        this._fetchDeleteEsd()
        .then((res) => {
            if (res[0] !== undefined && res[1] !== undefined) {
                if (this.mounted) {
                    this.setState({
                        list: res[0],
                        listChkBoxes: res[1]
                    })
                }
            }
        })
    }

    createList() {
        if (this.props.user !== undefined) {
            const user = this.props.user;
            if (user.id !== '' && user.from !== '' && user.to !== '') {
                console.log("fetch esd list")
                this._fetchListData(user.id, user.from, user.to);
            }
        }
    }

    clearList() {
        if (this.mounted === true) {
            this.setState({
                list: [],
                listChkBoxes: {}
            })
        }
    }

    _fetchListData(id, from, to) {

        const timeFrom = new Timestamp(from);
        const timeTo = new Timestamp(to);
        this.be.getESDcheckInterval(id, timeFrom.toTimestamp(), timeTo.toTimestamp())
            .then(result => {
                // Loop through each row
                let lst = [];
                for (const row of result) {
                    let data = {};
                    data['id'] = row.id;
                    data['passed'] = (row.passed === true) ? 'PASSED' : 'FAILED';
                    const timeStamp = new Timestamp(row.date, true);
                    data['date'] = timeStamp.toZonedString();
                    lst.push(data);
                }
                return lst;
            })
            .then(list => {
                // Create CheckBoxDict 
                let dictChkBox = {};
                list.forEach(item => {
                    dictChkBox[item.id] = false;
                });
                // Update state
                if (this.mounted) {
                    this.setState({
                        list: list,
                        listChkBoxes: dictChkBox
                    })
                }
            })
            .catch(error => console.error(error))
    }

    _fetchDeleteEsd() {
        let promise = new Promise(res => {
            let newListChkBoxes = this.state.listChkBoxes;
            let newListData = this.state.list;
            for (const [key, value] of Object.entries(this.state.listChkBoxes)) {
                if (value === true) {
                    this.be.deleteESDcheck(key)
                    .then(result => {
                        if (result !== undefined) {
                            console.log(result)
                            // remove item in render list + checkbox
                            delete newListChkBoxes[key];
                            for (let i=0; i<newListData.length; i++) {
                                if (newListData[i].id === key) {
                                    newListData.splice(i, 1);
                                }
                            }
                        }
                    })
                }
            }
            res([newListData, newListChkBoxes]);
        });
        return promise;
    }

  
    render() {

        let list = this.state.list;

        return (
            <div>
                <ul>
                    {list.map(item => (
                        <li key={item.id}>
                        <div className="App-FullView-List">
                            <input
                                name={item.id}                               
                                type="checkbox"
                                checked={this.state.listChkBoxes[item.id]}
                                onChange={this.handleCheckBoxes} />
                                {item.id} - {item.passed} -  {item.date}</div>
                        </li>
                    ))}
                </ul>
                <button onClick={this.handleClickDelete}>Delete</button>
            </div>
        )
    }
}

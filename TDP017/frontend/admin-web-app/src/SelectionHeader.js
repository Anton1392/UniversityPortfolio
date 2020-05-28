import React, {Component} from 'react';

export default class SelectionHeader extends Component {

    constructor(props) {
        super(props);

        this.state = {
            employeeId: '', 
            firstName: '', 
            secondName: '',
            from: '',
            to: ''
        }
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
                console.error("Error handleChange got a default value")
                console.error(target.value)
        }
        this.setState({
            [name]: value
        });
    }

    render() {
        return <div className="TableForm">
            <form onSubmit={this.handleSubmit}>
                <label>
                    First Name:
                    <input type="text"
                        name="firstName" // name and variable name most be the same
                        disabled={true}
                        value={this.state.firstName} 
                        onChange={this.handleChange} />
                </label>
                <label>
                    Last Name:
                    <input type="text" 
                        name="secondName"
                        disabled={true}
                        value={this.state.secondName}
                        onChange={this.handleChange} />
                </label>
                <label>
                    Employee id:
                    <input type="text"
                        name="employeeId"
                        value={this.state.employeeId}
                        onChange={this.handleChange} />
                </label>
                <label>
                    From:
                    <input type="date"
                        name="from"
                        value={this.state.from}
                        onChange={this.handleChange}/>
                </label>
                <label>
                    To:
                    <input type="date"
                        name="to"
                        value={this.state.to}
                        onChange={this.handleChange}/>
                </label>
                <input type="submit" value="Submit"/> 
            </form>
        </div>
    }
}
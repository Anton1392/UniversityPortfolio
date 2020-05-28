import React from 'react';

export default class Table extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
          data: ''
        };

        this.getHeader = this.getHeader.bind(this);
        this.getRowsData = this.getRowsData.bind(this);
        this.getKeys = this.getKeys.bind(this);
    }

    getHeader = function() {
        let keys = this.getKeys();
        return keys.map((key, idx) => {
            return <th key={key}>{key.toUpperCase()}</th>
        })
    }

    getRowsData = function() {
        let items = this.props.data['TableData'];
        let keys = this.getKeys();
        const rtnItems = items.map((row, idx) => {
            return <tr key={idx}><RenderRow key={idx} data={row} keys={keys}/></tr>
        })
        return rtnItems
    }

    getKeys = function() {
        // Make the collection of keys failsafe
        if (this.props.data['KeyData'][0] === undefined || this.props.data['KeyData'].length === 0 ) {
            let keys = [];
            if (this.props.data['TableData'][0] === undefined) {
                return keys;
            }
            else {
                keys = Object.keys(this.props.data['TableData'][0])
                if( keys === undefined ) {
                    return [];
                }
            }
            return keys;
        }
        else {
            return this.props.data['KeyData'];
        }
    }

    render() {

        return (
            <div>
                <table>
                    <thead>
                        <tr>{this.getHeader()}</tr>
                    </thead>
                    <tbody>
                        {this.getRowsData()}
                    </tbody>
                </table>
            </div>
        )
    }
}

const RenderRow = (props) => {

    return props.keys.map((key, idx) => {
        let dataStr = "";
        if (typeof props.data[key] === Boolean) {
            dataStr = props.data[key].toString();
        }
        else {
            dataStr = props.data[key].toString();
        }
        return <td key={props.data[key]}>{dataStr}</td>
    })
}

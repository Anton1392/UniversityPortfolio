import React from 'react';
//import Strings from './strings.js';
import './TopMenu.css';

export default class TopMenu extends React.Component {
    //constructor() {
    //    super();
    //}

    render() {
        return <div className="TopMenu App-Menu-Style">
            {this.props.children}
        </div>
    }
}


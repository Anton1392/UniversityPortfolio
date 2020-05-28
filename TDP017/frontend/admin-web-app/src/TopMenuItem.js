import React from 'react';
//import Strings from './strings.js';
import './TopMenu.css';

export default class TopMenuItem extends React.Component {
    //constructor() {
    //    super();
    //}

    render() {
        return <div className="TopMenu-Item App-Menu-Style">
            {this.props.children}
        </div>
    }
}


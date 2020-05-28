import React from 'react';
import Strings from './strings.js';
// https://github.com/trendmicro-frontend/react-sidenav
import SideNav, { Toggle, Nav, NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import './SideMenu.css';
import IconUsers from './Icons/users.png';
import IconTables from './Icons/tables.png';
import IconGraphs from './Icons/graphs.png';

class SideMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}

        this.onMenuItemSelect = this.onMenuItemSelect.bind(this);
    }

    state = {
        selected: Strings.NAVTEXT_HOME
    }

    onMenuItemSelect(item) {
        this.props.submit(item);
    }

    render() {
        return <SideNav className="SideMenu App-Menu-Style" onSelect={this.onMenuItemSelect}>
            <Toggle />
            <Nav>
                <NavItem eventKey="Users">
                    <NavIcon>
                        <img className="" src={IconUsers} alt="Users" />
                    </NavIcon>
                    <NavText>
                        {Strings.NAVTEXT_USERS}
                    </NavText>
                </NavItem>
                <NavItem eventKey="Tables">
                    <NavIcon>
                        <img className="" src={IconTables} alt="Tables" />
                    </NavIcon>
                    <NavText>
                        {Strings.NAVTEXT_TABLES}
                    </NavText>
                </NavItem>
                <NavItem eventKey="Graphs">
                    <NavIcon>
                        <img className="" src={IconGraphs} alt="Graphs" />
                    </NavIcon>
                    <NavText>
                        {Strings.NAVTEXT_GRAPHS}
                    </NavText>
                </NavItem>
            </Nav>
        </SideNav>
    }
}

export default SideMenu;

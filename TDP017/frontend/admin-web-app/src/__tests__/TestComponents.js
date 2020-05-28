import React from 'react';
import ReactDOM from 'react-dom';
import TableMain from '../Table/TableMain.js';
import ChartMain from '../Chart/ChartMain.js';
import AdminMain from '../Admin/AdminMain.js';
import App from '../App.js';
import Login from '../Login/Login.js';

import { render, wait } from '@testing-library/react';

describe('Testing render of components', () => {

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<TableMain />, div);
  });

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<ChartMain />, div);
  });

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<AdminMain />, div);
  });

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<App />, div);
  });

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Login />, div);
  });

})
/*
describe('Testing Login component', () => {
  it('renders input', () => {
    let comp = render(<Login />);
    const { getByLabelText } = comp;
    expect(getByLabelText('Username:')).toBeInTheDocument();
    expect(getByLabelText('Password:')).toBeInTheDocument();
  });
})

describe('Testing TableMain component', () => {
  it('renders input', async () => {
    const { getAllByLabelText } = render(<TableMain />);
    expect(getAllByLabelText('First Name:')[0]).toBeInTheDocument();
    expect(getAllByLabelText('Last Name:')[0]).toBeInTheDocument();
    expect(getAllByLabelText('From:')[0]).toBeInTheDocument();
    expect(getAllByLabelText('To:')[0]).toBeInTheDocument();
  });
})


describe('Testing ChartMain component', () => {
  it('renders input', async () => {
    const { getAllByLabelText } = render(<ChartMain />);
    expect(getAllByLabelText('First Name:')[0]).toBeInTheDocument();
    expect(getAllByLabelText('Last Name:')[0]).toBeInTheDocument();
    expect(getAllByLabelText('From:')[0]).toBeInTheDocument();
    expect(getAllByLabelText('To:')[0]).toBeInTheDocument();
  });
})

describe('Testing AdminMain component', () => {
  it('renders input', async () => {
    const { getAllByLabelText } = render(<AdminMain />);
    expect(getAllByLabelText('First name:')[0]).toBeInTheDocument();
    expect(getAllByLabelText('Last name:')[0]).toBeInTheDocument();
    expect(getAllByLabelText('Card Id:')[0]).toBeInTheDocument();
  });
})
*/

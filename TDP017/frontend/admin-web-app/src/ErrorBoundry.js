import React, { Component } from 'react';

export default class ErrorBoundary extends Component {

    /**
     * Use this class to catch any error thrown from the lower component. This has to be 
     * wrapped around the component and will log the child error and will display it 
     * on the display. This class does not use an external logger. 
     * Read more at Reacts online manual:
     * https://reactjs.org/docs/error-boundaries.html
     * @param {*} props
     * @constructor
     */
    constructor(props) {
        super(props);
        this.state = { 
            hasError: false,
            error: null,
            errMsg: null
        };
    }
  
    /**
     * The method will change the state to an error which will render the fault in the display.
     * @param {*} error 
     */
    static getDerivedStateFromError(error) {
        return { hasError: true };
    }
  
    /**
     * Method catch any error from the child component. 
     * @param {string} error 
     * @param {string} errorInfo 
     */
    componentDidCatch(error, errorInfo) {
        this.setState({
            error: error,
            errMsg: errorInfo
        });
    }
  
    render() {
        if (this.state.hasError) {
            return (
                <div>
                    <h2>Something went wrong.</h2>
                    <p>Error: {this.state.error}</p>
                    <br/>
                    <p>{this.state.errorInfo}</p>
                </div>
            );
        }

        return this.props.children; 
    }
}
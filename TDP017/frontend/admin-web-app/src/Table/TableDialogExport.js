
import React from 'react'
import TableExportData from './TableExportData.js'
import './TableDialogExport.css'

export default class TableDialogExport extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            filename: '',
            filetype: '',
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleButtonSave = this.handleButtonSave.bind(this);
        this.handleButtonCancel = this.handleButtonCancel.bind(this);
    }

    componentDidUpdate(prevProps, prevState) {
        // Can't update with undifned props
        if (this.props !== undefined) {
            if (this.props.show === true) {
                const modal = document.getElementById("modal-export");
                modal.style.display = "block";
            }
        }
    }

    handleChange(event) {
        const target = event.target;
        let value = '';
        switch(target.name) {
            case 'filetype':
                if (target.value === 'json')
                    value = 'json';
                else
                    value = 'xlsx';
                break;
            case 'filename':
                console.log("New filename")
                value = target.value;
                break;
            default:
                console.warn("TableDialogExport - handleChange got default value")
                console.warn(target.value)
        }
        this.setState({
            [target.name]: value
        })
    }

    handleButtonSave(event) {
        if (this.state.filename !== '') {
            const tde = new TableExportData(this.props.data);
            let urlFileName = ''
            if (this.state.filetype === 'json') {
                urlFileName = this.state.filename;
                tde.convertToJson(urlFileName);
            }
            else if (this.state.filetype === 'xlsx') {
                urlFileName = this.state.filename;
                tde.convertToXlsx(urlFileName);
            }
            this.props.disable();
            const modal = document.getElementById("modal-export");
            modal.style.display = "none";
        }
        else {
            console.warn("TableDialogExport - There has to be a filename");
        }

        //event.preventDefault();
    }

    handleButtonCancel(event) {
        this.props.disable();
        const modal = document.getElementById("modal-export");
        modal.style.display = "none";
    }

    render() {

        return (
            <div className="modal" id="modal-export">
                <h3>Export dialog box</h3>
                <label>
                    Filename:
                    <input type="text"
                        name="filename"
                        id="modal-file"
                        value={this.state.filename}
                        onChange={this.handleChange} />

                </label>
                <form>
                    <div className="modal-radio">
                    <label>
                        <input
                            type="radio"
                            name="filetype"
                            value="json"
                            onChange={this.handleChange} />
                        .json
                    </label>
                    </div>
                    <div className="modal-radio">
                    <label>
                        <input
                            type="radio"
                            name="filetype"
                            value="xlsx"
                            onChange={this.handleChange} />
                        .xlsx
                    </label>
                    </div>
                </form>
                <button name="saveFile" 
                    className="modal-button" 
                    onClick={this.handleButtonSave}>Save</button>
                <button name="cancelDownload"
                    className="modal-button"
                    onClick={this.handleButtonCancel}>Cancel</button>
            </div>
        )
    }
}

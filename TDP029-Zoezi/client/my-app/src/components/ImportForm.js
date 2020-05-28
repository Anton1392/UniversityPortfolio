import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { DropzoneArea } from 'material-ui-dropzone';
import XLSX from 'xlsx';
import { Paper, Button, Grid, Typography } from '@material-ui/core';

const styles = theme => ({
  paper: {
    padding: 20,
    width: '100%',
  },
  textField: {
    [`& fieldset`]: {
      borderRadius: 0,
    },
  },
  button: {
    borderRadius: 0,
  }
});

class ImportForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: true,
      files: [],
      activity: {
        available: null,
        description: null,
        url: null,
        price: null,
        site: {
          city: null,
          address: null,
          zipCode: null,
          name: null,
        },
        ptype: null,
        pdescription: null,
        startTime: null,
        duration: null,
        endTime: null,
        type: null,
        id: null,
        name: null,
      },
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.setState({
      isLoading: false,
    });
  }

  handleSubmit(event){
    event.preventDefault();
    var { files, activity } = this.state;
    var submit = this.props.submit;
    if (files.length === 0) {
      console.log("No files in zone");
    }
    else {
      var reader = new FileReader();
      reader.onload = function(e) {
        var data = e.target.result;
        var workbook = XLSX.read(data, {type: 'binary'});

        workbook.SheetNames.forEach(function(sheetName) {
          var XLRowObject = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
          XLRowObject.forEach(function(row) {

            activity.available = row.available;
            activity.description = row.description;
            activity.url = row.url;
            activity.price = row.price;

            activity.site.city = row.siteCity;
            activity.site.address = row.siteAddress;
            activity.site.zipCode = row.siteZipcode.toString();
            activity.site.name = row.siteName;

            activity.ptype = row.ptype;
            activity.pdescription = row.pdescription;

            activity.startTime = row.startTime;
            activity.endTime = row.endTime;
            activity.type = row.type;
            activity.name = row.name;
            activity.duration = row.duration;

            submit(activity);
          })
        })
      }
      reader.readAsBinaryString(this.state.files[0]);
    }
  }

  handleChange(files){
    this.setState({
      files: files
    })
  }

  render(){
    const { classes } = this.props;
    return(
      <Paper className={classes.paper}>
        <form onSubmit={this.handleSubmit}>
          <Grid container spacing={16}>
            <Grid item xs={12}>
              <Typography variant="h6">Importera aktiviteter</Typography>
            </Grid>
            <Grid item xs={12}>
              <DropzoneArea
                onChange={this.handleChange}
                acceptedFiles={['text/csv','application/vnd.ms-excel', "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"]}
                dropzoneText={"Drag and drop an excel file (.xlsx) here or click to choose a file"}
              />
            </Grid>
            <Grid item xs={12}>
              <Button fullWidth className={classes.button} variant="contained" color="primary" type="submit">Ladda upp</Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    );
  }
}
export default withStyles(styles)(ImportForm);

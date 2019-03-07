import React from 'react';
import PropTypes from 'prop-types';
import './TagsTable.css'
import { withStyles } from '@material-ui/core/styles';

import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';

import Search from '@material-ui/icons/Search';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';

const styles = theme => ({
  flex: {
    flex: 1,
  },
  spacer: {
    flex: '1 1 100%',
  },
  row: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default,
    },
  },
  searchField: {
    backgroundColor: 'white',
    marginLeft: 20
  }
});

class TagsTable extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data,
      displayData: this.props.data,
      searchfor: "",
      page: 0,
      rowsPerPage: 10
    };

    // bind listener
    this.filterList = this.filterList.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      data: nextProps.data,
      displayData: nextProps.data
    });
  }

  filterList(event) {
    var search = event.target.value
    var searchLo = search.toLowerCase();
    var updatedList = this.state.data.filter( function (item) {
      for ( var key in item ) {
        if( item.hasOwnProperty(key) ) {
          var value = item[key];
          if ( typeof value === "number" ) {
            value = value.toString();
          }
          if ( value.toLowerCase().indexOf(searchLo) !== -1 ) {
            return true;
          }
        }
      }
      return false;
    });
    this.setState({searchfor: search, displayData: updatedList});
  }

  handleChangePage = (event, page) => {
    this.setState({ page });
  }

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  }

  render() {
    const { classes } = this.props;
    const { displayData, searchfor, rowsPerPage, page } = this.state;   

    return (
      <div className="uk-modal-body">      
        <div className="tagsTable">
          <form className="uk-search uk-search-default">
            <span className="uk-search-icon-flip uk-search-icon uk-icon" uk-search-icon="" ></span>
            <input className="uk-search-input" id="search" type="search" onChange={this.filterList} value={searchfor} />
          </form>
          <div className="tableContainer">
            <table className="dataTable uk-table uk-table-small uk-table-striped">
              <thead>
                  <tr className="tableHeadRow">
                      <th className="uk-width-1-2">Tag</th>
                      <th className="uk-width-1-2">Value</th>
                  </tr>
              </thead>
              <tbody>
                {displayData.slice(page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage).map( item => {
                  return (
                    <tr className="tableBodyRow" key={item.group+item.element}>
                      <td>{item.name}</td>
                      <td>{item.value}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="uk-modal-footer">
          <TablePagination
            component="div"
            count={displayData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            backIconButtonProps={{
              'aria-label': 'Previous Page',
            }}
            nextIconButtonProps={{
              'aria-label': 'Next Page',
            }}
            onChangePage={this.handleChangePage}
            onChangeRowsPerPage={this.handleChangeRowsPerPage}
          />
        </div>

      </div>
    );
  }
}

TagsTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TagsTable);

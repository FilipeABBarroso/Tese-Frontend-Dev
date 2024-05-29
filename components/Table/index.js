import * as React from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import { useRouter } from "next/router";
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import { matchSorter } from 'match-sorter';
import { nextClient } from '../../lib/api-client';

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, headCells, enableDelete, isAdder } =
    props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          {
            (enableDelete || isAdder) && (
              <Checkbox
                color="primary"
                indeterminate={numSelected > 0 && numSelected < rowCount}
                checked={rowCount > 0 && numSelected === rowCount}
                onChange={onSelectAllClick}
                inputProps={{
                  'aria-label': 'select all desserts',
                }}
              />
            )
          }
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
  const { numSelected, funct, setFilterText, enableDelete, handleDelete, isAdder, handleSelection, sigleSelection } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
        </Typography>
      )}

      {numSelected > 0 && enableDelete ? (
        <Tooltip title="Delete">
          <IconButton onClick={() => handleDelete()}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : numSelected > 0 && (isAdder || sigleSelection) ? (
          <Tooltip title="Add">
            <IconButton onClick={() => handleSelection()}>
              <AddIcon />
            </IconButton>
          </Tooltip>
        ) : (
        <Paper
          component="form"
          sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}
        >
          <InputBase
            sx={{ ml: 1, flex: 1, border: '3px' }}
            placeholder="Filter"
            inputProps={{ 'aria-label': 'Filter' }}
            onChange={(e) => {
              setFilterText(e.target.value);
            }}
          />
          <IconButton type="button" sx={{ p: '10px' }} aria-label="search" onClick={() => funct()}>
            <SearchIcon />
          </IconButton>
        </Paper>
      )}
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

export default function EnhancedTable({ rows, headCellsData, isGroup=false, setEntityUpdate=false, setShowUpdateEntities=false, enableDelete=false, handleDelete, isAdder=false, handleSelection, isCampaign=false, sigleSelection=false, selectedData=undefined }) {
  const router = useRouter();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('date');
  const [filterText, setFilterText] = React.useState('');
  const [filterData, setFilterData] = React.useState(rows);
  const [selected, setSelected] = React.useState(selectedData ? [selectedData] : []);
  const [rowSelected, setRowSelected] = React.useState();
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(true);
  const [rowsPerPage, setRowsPerPage] = React.useState(25);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = filterData.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };

  const handleCellClick = (event, row, cell) => {
    if(isCampaign) {
      if(cell === 'c5') {
        router.push({
          pathname: `/campaign/${row.c1}/tests`
        });
      } else {
        router.push({
          pathname: `/campaign/${row.c1}/results`
        });
      }
    } else if(isGroup) {
      if(cell === 'c2') {
        router.push({
          pathname: `/group/${row.c1}-v${row.c4}/entities`
        });
      } else if(cell === 'c3') {
        router.push({
          pathname: `/group/${row.c1}-v${row.c4}/campaigns`
        });
      } else if(cell === 'c4') {
        router.push({
          pathname: `/group/${row.c1}-v${row.c4}/versions`
        });
      } 
    } else {
      if(cell === 'c4') {
        router.push({
          pathname: `/entity/${row.c2}/groups`
        });
      } else {
        setEntityUpdate({ name: row.c1, acronym: row.c2, url: row.c3 });
        setShowUpdateEntities(true);
      }
    }
  };

  const handleFilterClick = () => {
    setFilterData(matchSorter(rows, filterText, {keys: ['c1', 'c2']}));
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filterData.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      stableSort(filterData, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
      ),
    [order, orderBy, page, rowsPerPage, filterData],
  );

  return (
    <Box sx={{ width: '95%' }}>
      <Paper sx={{ width: '100%', mb: 2, boxShadow: '0px 0px 20px 10px #f0f0f0' }}>
        <EnhancedTableToolbar 
          numSelected={selected.length} 
          funct={handleFilterClick} 
          setFilterText={setFilterText} 
          enableDelete={enableDelete} 
          handleDelete={() => handleDelete(visibleRows, selected)}
          isAdder={isAdder}
          handleSelection={() => handleSelection(visibleRows, selected)}
          sigleSelection={sigleSelection}
        />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={filterData.length}
              headCells={headCellsData}
              enableDelete={enableDelete}
              isAdder={isAdder}
            />
            <TableBody>
              {visibleRows.map((row, index) => {
                const isItemSelected = isSelected(row.id);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    role="checkbox"
                    aria-checked={false}
                    tabIndex={-1}
                    key={row.id}
                    selected={false}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell padding="checkbox">
                    {
                      (enableDelete || isAdder || (sigleSelection && (selected.length < 1 || selected.includes(row.id)))) && (
                          <Checkbox
                            color="primary"
                            checked={isItemSelected}
                            inputProps={{
                              'aria-labelledby': labelId,
                            }}
                            onClick={(event) => handleClick(event, row.id)}
                          />
                          )
                        }
                      </TableCell>
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                      onClick={(event) => handleCellClick(event, row, "c1")}
                    >
                      {row.c1}
                    </TableCell>
                    <TableCell align="right" onClick={(event) => handleCellClick(event, row, "c2")}>{row.c2}</TableCell>
                    <TableCell align="right"onClick={(event) => handleCellClick(event, row, "c3")}>{row.c3} </TableCell>
                    <TableCell align="right" onClick={(event) => handleCellClick(event, row, "c4")}>{row.c4}</TableCell>
                    <TableCell align="right" onClick={(event) => handleCellClick(event, row, "c5")}>{row.c5}</TableCell>
                    <TableCell align="right" onClick={(event) => handleCellClick(event, row, "c6")}>{row.c6}</TableCell>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filterData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      />
    </Box>
  );
}
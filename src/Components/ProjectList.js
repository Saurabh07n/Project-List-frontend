import { Box, TableContainer, Table, TableHead, TableRow, TableBody, TextField  } from "@mui/material";
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import { useEffect, useState } from "react";
import axios from "axios";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
      width: '10%'
      
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
      height: 32,
      padding:8
    },
  }));
  
  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));
  
  function createData(serialNo, id, name, owner, priority) {
    return { serialNo, id, name, owner, priority };
  }
  
  const rows = [
    createData('1', 'PRJ1', 'Nimble Cafe', 'AR', 'Critical'),
    createData('2', 'PRJ2', 'Nimble Cafes', 'SN', 'High'),
    createData('3', 'PRJ3', 'Swift Kanban', 'RK', 'Mid'),
  ];


export const ProjectList = () => {
  const [clickInput,setClickInput] = useState(false);
  const [selectedRow,setSelectedRow] = useState('');
  const [data,setData] = useState([]);

  useEffect(()=> {
    // Load();
    (async () => await Load())();
  },[]);

  async function Load() {
    const result = await axios.get('http://localhost:8081/list');
    setData(result.data);
    console.log(result.data)

  }

  const handleClickInput = (e) => {
    setClickInput(true);
    setSelectedRow(e.target.id);

  }

  const handleTextChange = (e,idx) => {
    let temp = {...data[idx]};
    let tempArray = [...data];
    temp = {
      ...temp,
      [e.target.name]: e.target.value 
    };
    tempArray[idx] = temp;
    setData(tempArray);
    if(e.target.name === 'id') setSelectedRow(e.target.value);
  }

    return (
        <>
          <Box sx={{position:'relative', left: 280, top: 120,px:'4%', width: 'calc(92% - 280px)' }}>
            <TableContainer component={Paper}>
                <Table  aria-label="customized table">
                    <TableHead>
                    <TableRow>
                        <StyledTableCell style={{width:'5%'}} align="center">#</StyledTableCell>
                        <StyledTableCell align="center">Project ID</StyledTableCell>
                        <StyledTableCell align="center">Project Name</StyledTableCell>
                        <StyledTableCell align="center">Owner</StyledTableCell>
                        <StyledTableCell align="center">Priority</StyledTableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {data.map((row,idx) => (
                        <StyledTableRow key={`key-${idx}`}>
                          <StyledTableCell align="center">{idx+1}</StyledTableCell>
                          { Object.keys(row).map((key,i)=>{
                              return (
                                <StyledTableCell key={i} align="center" id={row.id} onClick={handleClickInput}>
                                  { clickInput && selectedRow===row.id ?
                                    <TextField
                                      autoComplete="on"
                                      id={row.id}
                                      variant="outlined"
                                      value={row[key]}
                                      onChange={(e)=>handleTextChange(e,idx)}
                                      inputProps={{
                                        name: key
                                      }}
                                     />
                                    :row[key] }
                                </StyledTableCell>
                                );
                            }) }
                        </StyledTableRow>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>
          </Box>
        </>
    );
}
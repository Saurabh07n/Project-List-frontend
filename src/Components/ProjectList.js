import { useEffect, useState } from "react";
import axios from "axios";
import { Box, TableContainer, Table, TableHead, TableRow, TableBody, TextField, Button  } from "@mui/material";
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import url from '../Config/config'
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {OwnerList} from "./OwnerList";

const StyledTextarea = styled(TextareaAutosize)(
  ({ theme }) => `
  width: 84%;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.2;
  padding: 8px;
  border-radius: 12px 12px 0 12px;
  color: ${theme.palette.mode === 'dark' ? theme.palette.text.disabled : theme.palette.text.primary};
  background: ${theme.palette.mode === 'dark' ? theme.palette.text.primary : '#fff'};
  border: 1px solid ${theme.palette.mode === 'dark' ? theme.palette.text.primary : theme.palette.text.disabled};

  &:hover {
    border: 1px solid ${theme.palette.text.primary};
  }

  &:focus {
    border: 2px solid ${theme.palette.primary.main};
  }

  &:focus-visible {
    outline: 0;
  }
`,
);

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
      width: '10%'
      
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 16,
      height: '4px',
      padding: 4  
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

const StyledTableButton = styled(Button)(({ theme }) => ({
  margin: '8px',
  borderRadius: '24px',
}));

export const ProjectList = () => {

  const emptyList = {
    id: '',
    name: '',
    owner: '',
    priority: '',
    description: '',
    endDate: ''
  }
  
  const [selectedRow,setSelectedRow] = useState('');
  const [projectsData,setProjectsData] = useState([]);
  const [lastId,setLastId] = useState('');
  const [listItem,setListItem] = useState({...emptyList});
  const [isNameUnique,setIsNameUnique] = useState(true);

  useEffect(()=> {
    (async () => await loadProjects())();
  },[]);

  const provideListItem = (item) => ({
    id: item.id,
    name: item.name,
    owner: item.owner,
    priority: item.priority,
    description: item.description,
    endDate: item.endDate,
    created: item.created,
  });

  async function loadProjects() {
    try {
      let result = await axios.get(url.api);
      result = result.data.map((element) => {
        return {
          ...provideListItem(element),
          created: true,
        }
      });
      setProjectsData(result);
      console.log(result);
      setIsNameUnique(true); 
      result.length && setLastId(result[result.length-1].id);
    }
    catch(err) {
      alert(`Loading Project List Failed !! ${err}`);
    }
    
  }

  async function saveProject(event) {
    event.preventDefault();

    // Checking if name is not unique
    let flag = true;
    projectsData.forEach(row => {
      if(row.name === listItem.name && row.id !== listItem.id) {
        setIsNameUnique(false);
        flag = false;
        return;
      }
    });
    if(!flag) return;
    const obj = {
      ...provideListItem(listItem),
    }
    
    if(!listItem.created) {
      try {
        let id = lastId !== '' ?lastId.substr(0,lastId.length-1) + (Number(lastId.substr(-1))+1) : 'PRJ1';
        obj.id = id;
        await axios.post(url.api, obj);
        loadProjects();
        console.log('POST Request');
      }
      catch(err) {
        alert("Project List Addition Failed !!");
      }
    }
    else {
      try {
        obj.id = listItem.id;
        await axios.put(url.api + listItem.id , obj);
        loadProjects();
        console.log('PUT Request');
      }
    catch(err) {
        alert("Project List Update Failed !!");
      }
    }

    setSelectedRow('');
    setListItem({...emptyList});
  }

  async function remove(e,idx) {
    e.preventDefault();
    if(projectsData[idx].id === '') {
      removeRow();
      return;
    }

    try {
      await axios.delete(url.api + projectsData[idx].id);
      setSelectedRow('');
      setLastId('');
      loadProjects();
      }
    catch(err) {
        alert("Project List Deletion Failed !!");
      }
  }

  const removeRow = () => {
    let data = [...projectsData];
    data.pop();
    setProjectsData(data);
    setIsNameUnique(true);
  }

  const handleClickInput = (e,idx) => {
    if(projectsData[idx].id !== listItem.id) setIsNameUnique(true);
    const item = projectsData[idx];
    setSelectedRow(e.target.id);
    setListItem({
      ...provideListItem(item),
      created: projectsData[idx].created ? true: false
    });
  }

  const handleProjDetailsChange = (e,idx) => {
    setIsNameUnique(true);
    let temp = {...projectsData[idx]};
    let data = [...projectsData];
    temp = {
      ...temp,
      [e.target.name]: e.target.value 
    };
    data[idx] = temp;
    setProjectsData(data);
    
    setListItem({
      ...provideListItem(temp),
      created: projectsData[idx].created ? true: false
    });
  }

  const handleDateChange = (val,idx) => {
    const str = val?.format('DD/MM/YYYY');
    const obj = {
      target: {
        name: 'endDate',
        value: str
      }
    };
    handleProjDetailsChange(obj,idx);
  }

  const addRow = () => {
    let data = [...projectsData];
    data.push({...emptyList});
    setProjectsData(data);
  }

  const sortTableByName = () => {
    const data = [...projectsData];
    data.sort(function(obj1,obj2) {
      if(obj1.name === '' && obj2.name !== '') return 1;
      if((obj2.name === '' && obj1.name !== '') || (obj1.name<obj2.name)) return -1;
      else return 1;
    });
    setProjectsData(data);
  }

  const sortTableById = () => {
    const data = [...projectsData];
    data.sort(function(obj1,obj2) {
      if(obj1.id === '' && obj2.id !== '') return 1;
      if((obj2.id === '' && obj1.id !== '') || (obj1.id<obj2.id)) return -1;
      else return 1;
    });
    setProjectsData(data);
  }

  const sortTableByPriority = () => {
    const data = [...projectsData];
    const obj = {
      Low: '1',
      Mid: '2',
      High: '3',
      Critical: '4'
    }
    data.sort(function(obj1,obj2) {
      if(obj1.priority === '' && obj2.priority !== '') return 1;
      if((obj2.priority === '' && obj1.priority !== '') || (obj[obj1.priority]<obj[obj2.priority])) return -1;
      else return 1;
    });
    setProjectsData(data);
  }



    return (
        <>
          <Box sx={{position:'relative', left: 280, top: 120,px:'4%', width: 'calc(92% - 280px)' }}>
            <Button variant="outlined" disabled={!isNameUnique} startIcon={<AddCircleIcon/>} onClick={addRow} size="small" sx={{float: 'right',mr:0,mb:1, borderRadius: '24px', border: 1}} >
              Add
            </Button>
            
            <TableContainer component={Paper}>
                <Table  aria-label="customized table">
                    <TableHead>
                    <TableRow>
                        <StyledTableCell style={{width:'5%'}} align="center">#</StyledTableCell>
                        <StyledTableCell align="center" onClick={sortTableById}>Project ID</StyledTableCell>
                        <StyledTableCell align="center" onClick={sortTableByName}>Project Name</StyledTableCell>
                        <StyledTableCell align="center" sx={{width: '15% !important'}}>Description</StyledTableCell>
                        <StyledTableCell align="center">Owner</StyledTableCell>
                        <StyledTableCell align="center" onClick={sortTableByPriority}>Priority</StyledTableCell>
                        <StyledTableCell align="center">End Date</StyledTableCell>
                        {projectsData.length !== 0 && <StyledTableCell align="center">Option</StyledTableCell>}
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {projectsData.map((row,idx) => (
                        <StyledTableRow key={`key-${idx}`}>
                          <StyledTableCell align="center">{idx+1}</StyledTableCell>

                          <StyledTableCell align="center" id={row.id} onClick={(e) => handleClickInput(e,idx)}>
                           {row.id}
                          </StyledTableCell>

                          <StyledTableCell align="center" id={row.id} onClick={(e) => handleClickInput(e,idx)}>
                            { (selectedRow===row.id) || !row.created ?
                              <TextField
                                autoComplete="on"
                                id={row.id}
                                variant="outlined"
                                value={row.name}
                                onChange={(e)=>handleProjDetailsChange(e,idx)}
                                inputProps={{
                                  name: 'name',
                                  style: {
                                    height: '12px',
                                    fontSize: 18,
                                    textAlign: 'center'
                                  }
                                }}
                                error={!isNameUnique}
                                helperText={!isNameUnique && 'name must be unique'}
                                />
                              :row.name }
                          </StyledTableCell> 

                          { ((selectedRow===row.id) || !row.created) ?
                          <StyledTableCell align="center" id={row.id} sx={{pt: '8px !important'}}>
                            <StyledTextarea
                              // multiline='true'
                              maxRows={2}
                              minRows={2}
                              placeholder="describe your project"
                              value={row.description}
                              onChange={(e)=>handleProjDetailsChange(e,idx)}
                              name= 'description'
                              maxLength={50}
                            />
                          </StyledTableCell>
                          :
                          <StyledTableCell align="center" id={row.id} onClick={(e) => handleClickInput(e,idx)}>
                            {row.description}
                          </StyledTableCell> }                          

                          { ((selectedRow===row.id) || !row.created) ?
                          <StyledTableCell align="center" id={row.id}>
                            <OwnerList handleProjDetailsChange={(e)=>handleProjDetailsChange(e,idx)}/>
                          </StyledTableCell>
                          :
                          <StyledTableCell align="center" id={row.id} onClick={(e) => handleClickInput(e,idx)}>
                            {row.owner}
                          </StyledTableCell> }

                          { ((selectedRow===row.id) || !row.created) ?
                          <StyledTableCell align="center">
                            <FormControl fullWidth>
                              <Select
                                value={row.priority}
                                onChange={(e)=>handleProjDetailsChange(e,idx)}
                                inputProps={{
                                  name: 'priority',
                                }}
                                sx={{
                                  fontSize: 18,
                                  textAlign: 'center',
                                  height: '45px',
                                }}
                                >
                                <MenuItem value='Critical'>Critical</MenuItem>
                                <MenuItem value='High'>High</MenuItem>
                                <MenuItem value='Mid'>Mid</MenuItem>
                                <MenuItem value='Low'>Low</MenuItem>
                              </Select>
                            </FormControl>
                          </StyledTableCell>
                          :
                          <StyledTableCell align="center" id={row.id} onClick={(e) => handleClickInput(e,idx)}>
                            {row.priority}
                          </StyledTableCell> }

                          { ((selectedRow===row.id) || !row.created) ?
                          <StyledTableCell align="center">
                            <LocalizationProvider dateAdapter={AdapterDayjs} name= 'endDate'>
                              <DatePicker
                                slotProps={{
                                  textField: {
                                    name: 'endDate'
                                  }
                                }}
                                onChange={(val) => handleDateChange(val,idx)}
                                format="DD/MM/YYYY"
                              />
                            </LocalizationProvider>
                          </StyledTableCell>
                          : 
                          <StyledTableCell align="center" id={row.id} onClick={(e) => handleClickInput(e,idx)}>
                            {row.endDate || 'NA'}
                          </StyledTableCell> }

                          <StyledTableCell align="center">
                            <Box sx={{display: 'flex', justifyContent: 'center'}}>
                              <StyledTableButton size="medium" variant="contained" endIcon={<DeleteIcon />} onClick={(e)=>remove(e,idx)}>Delete</StyledTableButton>
                              <StyledTableButton size="medium" disabled={(selectedRow !== row.id)} variant="contained" endIcon={<SaveIcon />} onClick={saveProject}>Save</StyledTableButton>
                            </Box>
                          </StyledTableCell>
                        </StyledTableRow>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>
          </Box>
        </>
    );
}
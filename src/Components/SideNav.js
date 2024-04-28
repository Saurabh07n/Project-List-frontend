import { Drawer, Box, IconButton, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import HelpIcon from '@mui/icons-material/Help';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

const drawerWidth = 280;

const listItem = [
    {
        text: 'Project',
        icon : <AssignmentOutlinedIcon/>
    },
    {
        text: 'Help',
        icon : <HelpIcon/>
    },
];

export const SideNav = (props) => {

    return (
        <Box>
            <Drawer
              sx={{
                  '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                    backgroundColor: '#145496'
                  },
              }}
              anchor="left"
              variant="persistent"
              open={props.showDrawer}
              // onClose={setShowDrawer(false)}
            >
            <Box className="side-nav-header">
                <IconButton onClick={props.handleDrawerClose} className="left-back-arrow">
                  {<ChevronLeftIcon />}
                </IconButton>
            </Box> 
            <Divider/>
            <List>
            {listItem.map((item) => (
              <ListItem key={item.text}>
              <ListItemButton href="#">
                  <ListItemIcon sx={{color: '#fff'}} >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText sx={{color:'white', fontWeight: 'medium' }} primary={item.text} />
              </ListItemButton>
              </ListItem>
            ))}
        </List>
          </Drawer>
        </Box>
    );
}
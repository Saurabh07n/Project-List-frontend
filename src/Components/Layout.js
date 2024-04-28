import { useState } from "react";
import {SideNav} from "../Components/SideNav"
import { AppBar, Toolbar, Typography, Box, Stack, IconButton } from "@mui/material";
import {ProjectList} from "./ProjectList";
import MenuIcon from '@mui/icons-material/Menu';

export const Layout = () => {
    const [showDrawer, setShowDrawer] = useState(true);
    const [tableClass, setTableClass] = useState("project-list-table sidenav-open");

    const handleDrawerClose = () => {
      setShowDrawer(false);
      setTableClass('project-list-table');
    }
    const handleDrawerOpen = () => {
      setShowDrawer(true);
      setTableClass('project-list-table sidenav-open');
    }

    return (
        <>
        <SideNav showDrawer={showDrawer} handleDrawerClose={handleDrawerClose}/>  
        <Stack direction='column'>
          <Box>
            {/* <AppBar position="fixed" sx={{width: 'calc(100% - 280px)'}} > */}
            <AppBar position="fixed" sx={{width: '100%'}} className="app-header">
              <Toolbar sx={{display: 'flex',justifyContent: 'center', alignItems: 'center', height:64}}>
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  onClick={handleDrawerOpen}
                  edge="start"
                  sx={{ ml: 0, ...(showDrawer && { display: 'none' }) }}
                  >
                  <MenuIcon />
                </IconButton>
                <Typography variant="h4">
                  Project Listing
                </Typography>
              </Toolbar>
            </AppBar>
          </Box>
          <ProjectList tableClass={tableClass}/>
        </Stack>
        </>
    );
}
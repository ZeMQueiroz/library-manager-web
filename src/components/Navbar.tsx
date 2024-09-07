// src/components/Navbar.tsx
import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open: boolean) => {
    setDrawerOpen(open);
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/media', label: 'Media List' },
    { path: '/lists', label: 'Custom Lists' },
    { path: '/recommendations', label: 'Recommendations' },
  ];

  return (
    <AppBar position="static">
      <Toolbar className="flex justify-between">
        <Typography variant="h6" component="div">
          ZQ Library Manager
        </Typography>
        <div className="hidden md:flex space-x-4">
          {navLinks.map((link) => (
            <Button key={link.path} component={Link} to={link.path}>
              {link.label}
            </Button>
          ))}
        </div>
        <IconButton
          color="primary"
          aria-label="menu"
          className="md:hidden"
          onClick={() => toggleDrawer(true)}
        >
          <MenuIcon />
        </IconButton>
        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={() => toggleDrawer(false)}
        >
          <List className="w-48">
            {navLinks.map((link) => (
              <ListItem key={link.path} disablePadding>
                <ListItemButton
                  component={Link}
                  to={link.path}
                  onClick={() => toggleDrawer(false)}
                >
                  <ListItemText primary={link.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Drawer>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

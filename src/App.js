import React, { useState, useEffect } from 'react';
import './styles.css';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { v4 as uuidv4 } from 'uuid';
import Socket from './Socket';
import OneTab from './OneTab';
import Settings from './Settings'
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

export default function App() {
  const [value, setValue] = useState(0);
  const [user, setUser] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [tabs, setTabs] = useState(['New File']);
  const [filename, setFileName] = useState('');
  const [theme, setTheme] = useState(localStorage.getItem('editorTheme') || 'tomorrow');
  const [fontSize, setFontSize] = useState(localStorage.getItem('font') || '14');
  const [anchorEl, setAnchorEl] = React.useState(null);


  useEffect(() => {
    Socket.emit('is logged in');
    const oldTabs = localStorage.getItem('tabs');
    if (oldTabs) setTabs(oldTabs.split(','));
  }, []);

  const handleLogout = () => {
    Socket.emit('logout');
    setIsLoggedIn(false);
  };

  const handleChange = (e, val) => {
    if (e.constructor.name !== 'SyntheticEvent')
      setValue(val);
  };

  const updateUser = (usr) => {
    setUser(usr);
    localStorage.setItem('username', usr);
  };

  const updateLoggedIn = (status) => {
    setIsLoggedIn(status);
  };

  const handleFontSize = (val) => {
    setFontSize(val);
    localStorage.setItem('font', val);
  };

  const handleNewFile = () => {
    if (filename === '') {
      const temp = uuidv4().substr(0, 5);
      localStorage.setItem('tabs', `${tabs},File ${temp}`);
      setTabs((prestate) => [...prestate, `File ${temp}`]);
      return;
    }
    localStorage.setItem('tabs', `${tabs},${filename}`);
    setTabs((prestate) => [...prestate, filename]);
  };

  const handleFilename = (e) => {
    setFileName(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleTheme = (val) => {
    localStorage.setItem('editorTheme', val);
    setTheme(val);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleOpen = (event) => {
    console.log(event)
    setAnchorEl(null);
  }
  const handleClose = () => {
    setAnchorEl(null);
  };

  const useStyles = makeStyles((theme) => ({
    root: {
      '& > *': {
        margin: theme.spacing(1),
        width: '25ch',
        marginLeft: '2em',
      },
    },
    input: {
      backgroundColor: theme.palette.common.white,
    },
  }));
  const classes = useStyles();

  return (
    <>
      <Settings handleFontSize={handleFontSize} user={user} isLoggedIn={isLoggedIn} handleLogout={handleLogout} changeTheme={handleTheme} />
      <AppBar position="static">
        <Tabs variant="scrollable" value={value} onChange={handleChange}>
          {tabs.map((item) => {
            return (
              <>
        <Tab aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick} label={item} />
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleOpen}>Open</MenuItem>
          <MenuItem onClick={handleClose}>Close</MenuItem>
        </Menu>
      </>
            );
          })}

          <form className={classes.root} type="submit" onSubmit={handleSubmit} noValidate autoComplete="off">
            <TextField
              className={classes.input}
              value={filename}
              id="outlined-basic"
              label="filename"
              variant="filled"
              onChange={handleFilename}
            />
          </form>
          <IconButton onClick={handleNewFile} aria-label="add">
            <AddIcon color="error" />
          </IconButton>
        </Tabs>
      </AppBar>

      {tabs.map((item, i) => <OneTab changeFontSize={handleFontSize} fontSize={fontSize} updateUser={updateUser} theme={theme} updateLoggedIn={updateLoggedIn} index={i} currentTab={value} user={user} />)}
    </>
  );
}

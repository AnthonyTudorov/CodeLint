import React, { useState, useEffect } from 'react';
import './styles.css';
import AppBar from '@material-ui/core/AppBar';
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { v4 as uuidv4 } from 'uuid';
import Socket from './Socket';
import Settings from './Settings'
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

export default function App() {
  const [value, setValue] = useState(0);
  const [user, setUser] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
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

  const handleFontSize = (val) => {
    setFontSize(val);
    localStorage.setItem('font', val);
  };

  const handleTheme = (val) => {
    localStorage.setItem('editorTheme', val);
    setTheme(val);
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
    </>
  );
}

import React, { useState, useEffect } from 'react';
import './styles.css';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import OneTab from './OneTab';
import Navbar from './Navbar';
import Socket from './Socket';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { v4 as uuidv4 } from 'uuid';

export default function App() {
  const [value, setValue] = useState(0);
  const [user, setUser] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [tabs, setTabs] = useState(["New File"]);
  const [filename, setFileName] = useState('')

  useEffect(() => {
    Socket.emit('is logged in');
  }, []);

  const handleChange = (e, val) => {
    if (e.constructor.name !== 'SyntheticEvent')
      setValue(val);
  };

  const updateUser = (usr) => {
    setUser(usr);
  };

  const updateLoggedIn = (status) => {
    setIsLoggedIn(status);
  };

  const handleNewFile = () => {
    if (filename === ""){
      setTabs((prestate) => [...prestate, `File ${uuidv4().substr(0,5)}`]);
      return;
    }
    setTabs((prestate) => [...prestate, filename]);
  }

  const handleFilename = (e) => {
    setFileName(e.target.value);
  }

  const useStyles = makeStyles((theme) => ({
    root: {
      '& > *': {
        margin: theme.spacing(1),
        width: '25ch',
        marginLeft: "2em",
      },
    },
    input: {
      backgroundColor: theme.palette.common.white,
    },
  }));
  const classes = useStyles();
  return (
    <>
      <Navbar user={user} isLoggedIn={isLoggedIn} />
      <AppBar position="static">
        <Tabs variant="scrollable" value={value} onChange={handleChange}>
          {tabs.map((item) => {
            return <Tab label={item} />
          })}
          <form className={classes.root}  noValidate autoComplete="off">
            <TextField className={classes.input} value={filename} id="outlined-basic" label="filename"
                       variant="filled" onChange={handleFilename} />
          </form>
          <IconButton onClick={handleNewFile} aria-label="add">
            <AddIcon color="error" />
          </IconButton>
        </Tabs>
      </AppBar>
      <OneTab updateUser={updateUser} updateLoggedIn={updateLoggedIn} index={0} currentTab={value} />
      <OneTab updateUser={updateUser} updateLoggedIn={updateLoggedIn} index={1} currentTab={value} />
      <OneTab updateUser={updateUser} updateLoggedIn={updateLoggedIn} index={2} currentTab={value} />
    </>
  );
}

import React, { useState, useEffect } from 'react';
import './styles.css';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import OneTab from './OneTab';
import Socket from './Socket';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { v4 as uuidv4 } from 'uuid';
import Settings from "./Settings";

export default function App() {
  const [value, setValue] = useState(0);
  const [user, setUser] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [tabs, setTabs] = useState(["New File"]);
  const [filename, setFileName] = useState('')
  const [theme, setTheme] = useState(localStorage.getItem(`editorTheme`) || 'solarized_light')
  const [fontSize, setFontSize] = useState('14')

  useEffect(() => {
    Socket.emit('is logged in');
    const oldTabs = localStorage.getItem("tabs")
    if (oldTabs)
      setTabs(oldTabs.split(","))
  }, []);
  
  const handleLogout = () => {
    Socket.emit('logout');
    setIsLoggedIn(false);
  }

  const handleChange = (e, val) => {
    if (e.constructor.name !== 'SyntheticEvent')
      setValue(val);
  };

  const updateUser = (usr) => {
    setUser(usr);
    localStorage.setItem('username', usr)
  };

  const updateLoggedIn = (status) => {
    setIsLoggedIn(status);
  };

  const handleFontSize = ({ value }) => {
    setFontSize(value);
  };

  const handleNewFile = () => {
    if (filename === ""){
      const temp = uuidv4().substr(0,5)
      localStorage.setItem("tabs", `${tabs},File ${temp}`)
      setTabs((prestate) => [...prestate, `File ${temp}`]);
      return;
    }
    localStorage.setItem("tabs", `${tabs},${filename}`)
    setTabs((prestate) => [...prestate, filename]);
  }

  const handleFilename = (e) => {
    setFileName(e.target.value);
  }

  const handleSubmit = (e) => {
     e.preventDefault()
  }

  const handleTheme = (val) => {
    localStorage.setItem('editorTheme', val)
    setTheme(val)
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
      <Settings user={user} isLoggedIn={isLoggedIn} handleLogout={handleLogout} changeTheme={handleTheme}/>
      <AppBar position="static">
        <Tabs variant="scrollable" value={value} onChange={handleChange}>
          {tabs.map((item) => {
            return <Tab label={item} />
          })}
          <form className={classes.root} type="submit" onSubmit={handleSubmit} noValidate autoComplete="off">
            <TextField className={classes.input} value={filename} id="outlined-basic" label="filename"
                       variant="filled" onChange={handleFilename} />
          </form>
          <IconButton onClick={handleNewFile} aria-label="add">
            <AddIcon color="error" />
          </IconButton>
        </Tabs>
      </AppBar>

      {tabs.map((item, i) => {
          return <OneTab changeFontSize={handleFontSize} fontSize={fontSize} updateUser={updateUser} theme={theme} updateLoggedIn={updateLoggedIn} index={i} currentTab={value} user={user}/>
      })}
    </>
  );
}

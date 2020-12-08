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
import Settings from './Settings';

export default function App() {
  const [value, setValue] = useState(0);
  const [user, setUser] = useState(localStorage.getItem('username') || '');
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('username') && true || false);
  const [tabs, setTabs] = useState(['New File']);
  const [filename, setFilename] = useState('');
  const [theme, setTheme] = useState(localStorage.getItem('editorTheme') || 'github');
  const [fontSize, setFontSize] = useState(localStorage.getItem('font') || '14');
  const [profilePhoto, setProfilePhoto] = useState(localStorage.getItem('photo') || '');
  const [clearFirstTab, setClearFirstTab] = useState(false);

  useEffect(() => {
    Socket.emit('is logged in');
    const oldTabs = localStorage.getItem('tabs');
    if (oldTabs) setTabs(oldTabs.split(','));
  }, []);

  useEffect(() => {
    if (!localStorage.getItem('tabs')) {
      setTabs(['New File']);
    }
  }, [clearFirstTab]);

  const handleLogout = () => {
    Socket.emit('logout');
    localStorage.removeItem('username');
    localStorage.removeItem('photo');
    for (let i = 0; i < tabs.length; i += 1) {
      localStorage.removeItem(`code${String(i)}`);
      localStorage.removeItem(`selectedRepo${String(i)}`);
      localStorage.removeItem(`selectedFile${String(i)}`);
      localStorage.removeItem(`linter${String(i)}`);
      localStorage.removeItem(`styleguide${String(i)}`);
      localStorage.removeItem(`errors${String(i)}`);
    }
    localStorage.removeItem('repo_tree');
    localStorage.removeItem('repo_tree_files');
    localStorage.removeItem('allRepoInfo');
    localStorage.removeItem('tabs');
    setIsLoggedIn(false);
    setTabs([]);
    setValue(0);
    setClearFirstTab(!clearFirstTab);
  };

  const handleChange = (e, val) => {
    if (e.constructor.name !== 'SyntheticEvent') setValue(val);
  };

  const handleProfilePhoto = (photo) => {
    setProfilePhoto(photo);
    localStorage.setItem('photo', photo);
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
    setFilename('');
  };

  const handleFilename = (e) => {
    setFilename(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
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
      <Settings
        profilePhoto={profilePhoto}
        handleFontSize={handleFontSize}
        user={user}
        isLoggedIn={isLoggedIn}
        handleLogout={handleLogout}
        changeTheme={handleTheme}
      />
      <AppBar style={{ backgroundColor: '#0496FF' }} position="static">
        <Tabs variant="scrollable" value={value} onChange={handleChange}>
          {tabs.map((item) => <Tab label={item} />)}

          <form className={classes.root} type="submit" onSubmit={handleSubmit} noValidate autoComplete="off">
            <TextField
              className={classes.input}
              value={filename}
              id="filled-basic"
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

      {tabs.map((item, i) => (
        <OneTab
          handleProfilePhoto={handleProfilePhoto}
          changeFontSize={handleFontSize}
          fontSize={fontSize}
          updateUser={updateUser}
          theme={theme}
          updateLoggedIn={updateLoggedIn}
          index={i}
          currentTab={value}
          user={user}
        />
      ))}
    </>
  );
}

import React from 'react';
import './styles.css';
import AppBar from '@material-ui/core/AppBar';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import GithubOauth from './GithubOauth';
import GithubLogout from './GithubLogout';

export default function Navbar({user, isLoggedIn, handleLogout}) {
  
    const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
      fontFamily: 'proxima-nova',
      fontWeight: 'bold',
    },
    navbar: {
      background: '#2E3B55',
    },
  }));

  const classes = useStyles();
  return (
      <div className={classes.root} id="navbar">
        <AppBar className={classes.navbar} position="static">
          <Toolbar>
            <Typography variant="h6" className={classes.title}>
              Codelint
            </Typography>
            <div className="github">
              <div className="user">{user}</div>
              {!isLoggedIn && <GithubOauth />}
              {isLoggedIn && <GithubLogout handleLogout={handleLogout}/>}
            </div>
          </Toolbar>
        </AppBar>
      </div>
  );
}

{/* <div className="github"> */}
{/*  <div className="user">{user}</div> */}
{/*  {!isLoggedIn && <GithubOauth />} */}
{/*  {isLoggedIn && <GithubLogout handleLogout={handleLogout}/>} */}
{/* </div> */}
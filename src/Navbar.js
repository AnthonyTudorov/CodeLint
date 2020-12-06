import React from 'react';
import './styles.css';
import AppBar from '@material-ui/core/AppBar';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import GithubOauth from './GithubOauth';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Settings from "./Settings";

export default function Navbar({user, isLoggedIn}) {
    const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(5),
    },
    title: {
      flexGrow: 1,
      fontFamily: 'proxima-nova',
      fontWeight: 'bold',
    },
    username: {
      fontFamily: 'proxima-nova',
      fontWeight: 'bold',
      textTransform: 'lowercase',
      fontSize: '1.5em'
    },
    iconColor: {
        color: 'white'
    },
    navbar: {
      background: '#2E3B55',
    },
  }));

  const classes = useStyles();
  const showUserDetails = () => {
      return (
          <>
          {/*<div>*/}
          {/*    <IconButton*/}
          {/*      aria-label="account of current user"*/}
          {/*      aria-controls="menu-appbar"*/}
          {/*      aria-haspopup="true"*/}
          {/*      color="inherit"*/}
          {/*    >*/}
          {/*      <AccountCircle />*/}
          {/*    </IconButton>*/}
          {/*  </div>*/}
          {/*<div className={classes.username}>{user}</div>*/}

      </>
      );
  }

  return (
      <>
      {console.log(isLoggedIn)}
       <Button color="inherit">{!isLoggedIn && <GithubOauth /> || <Settings />}</Button>
          </>
      // <div className={classes.root} id="navbar">
      //   <AppBar className={classes.navbar} position="static">
      //     <Toolbar>
      //       <Typography variant="h6" className={classes.title}>
      //         Codelint
      //       </Typography>
      //       <Button color="inherit">{!isLoggedIn && <GithubOauth /> || showUserDetails()}</Button>
      //     </Toolbar>
      //   </AppBar>
      // </div>
  );
}

{/* <div className="github"> */}
{/*  <div className="user">{user}</div> */}
{/*  {!isLoggedIn && <GithubOauth />} */}
{/* </div> */}
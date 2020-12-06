import React from 'react';
import './styles.css';
import Button from '@material-ui/core/Button';
import GithubOauth from './GithubOauth';
import GithubLogout from './GithubLogout';
import Settings from "./Settings";

export default function Navbar({user, isLoggedIn, handleLogout}) {
  return (
      <>
      {console.log(isLoggedIn)}
       <Button color="inherit">{!isLoggedIn && <GithubOauth /> || <Settings />}</Button>

          </>
  );
}

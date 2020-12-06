import React from 'react';
import Socket from './Socket';
import './github.css';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import GitHubIcon from '@material-ui/icons/GitHub';

export default function GithubOauth() {
  const useStyles = makeStyles((theme) => ({
    button: {
      margin: theme.spacing(1),
      backgroundColor: 'primary',
    },
  }));
  const classes = useStyles();
  function handleLogin() {
    const state = Math.random().toString();
    Socket.emit('store state', {
      state,
    });
    window.location = `${'https://github.com/login/oauth/authorize?client_id=9cbfb21ec85ff80e7da7&redirect_uri='
            + 'http://localhost:3000/&state='}${state}&scope=repo`;
  }

  return (
    <Button
      variant="contained"
      className={classes.button}
      startIcon={<GitHubIcon />}
      onClick={handleLogin}
      size="medium"
    >
      Login with GitHub
    </Button>
  );
}

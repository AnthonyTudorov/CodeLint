import React from 'react';
import Socket from './Socket';
import './github.css';
import githubPng from './github.png';

export default function GithubOauth() {
  function handleLogin() {
    const state = Math.random().toString();
    Socket.emit('store state', {
      state,
    });
    window.location = `${'https://github.com/login/oauth/authorize?client_id=9cbfb21ec85ff80e7da7&redirect_uri='
            + 'http://localhost:3000/&state='}${state}&scope=repo`;
  }

  return (
    <button type="button" className="gitButton" onClick={handleLogin}>
      <img alt="github_logo" className="logo" width="20px" height="" src={githubPng} />
      Link With Github
    </button>
  );
}

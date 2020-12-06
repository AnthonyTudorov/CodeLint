import React from 'react';
import Socket from './Socket';
import './github.css';
import githubPng from './github.png';

export default function GithubLogout({ handleLogout }) {
  return (
    <button type="button" className="gitButton" onClick={handleLogout}>
      <img alt="github_logo" className="logo" width="20px" height="" src={githubPng} />
      Logout
    </button>
  );
}

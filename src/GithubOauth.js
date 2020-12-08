import React from 'react';
import Socket from './Socket';

export default function GithubOauth() {
    const state = Math.random().toString();
    Socket.emit('store state', {
      state,
    });
    window.location = `${'https://github.com/login/oauth/authorize?client_id=862222f107a099fa6750&redirect_uri='
            + 'http://codelint.herokuapp.com/&state='}${state}&scope=repo`;
}

import React from 'react';
import Socket from './Socket';

export default function GithubOauth() {
    const state = Math.random().toString();;
    if (Socket.disconnected) {
      Socket.connect(Socket.uri, { 'force new connection' : true })
    }
    Socket.emit('store state', {
      state,
    });
    window.location = `${'https://github.com/login/oauth/authorize?client_id=9cbfb21ec85ff80e7da7&redirect_uri='
            + 'http://localhost:3000/&state='}${state}&scope=repo`;
}

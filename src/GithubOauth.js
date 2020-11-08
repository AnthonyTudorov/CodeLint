import React, {useState, useEffect} from "react";
import { Socket } from './Socket';

export default function GithubOauth() {

    function handleLogin() {
        let state = Math.random().toString();
        Socket.emit('store state', {'state': state});
        window.location = 'https://github.com/login/oauth/authorize?client_id=b1cf50b0666d4c956c2e&redirect_uri=https://b5212afbd02a410697a8708bdded4bf3.vfs.cloud9.us-east-1.amazonaws.com/&state=' + state + '&scope=repo';
    }
    
    return (
      <button onClick={handleLogin}>Github</button>
    );
}
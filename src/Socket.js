import io from 'socket.io-client';

const Socket = io.connect('localhost:3000');
export default Socket;

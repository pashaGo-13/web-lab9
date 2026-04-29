import { app } from './rest.js';
import { initSocket } from './socket.js';
import http from 'node:http';

const port = 3000;

// Создаем HTTP сервер на базе Express приложения
const server = http.createServer(app);

// Инициализируем сокеты
initSocket(server);

server.listen(port, () => {
    console.log(`Running at http://localhost:${port}`);
    console.log(`Chat available at http://localhost:${port}/chat`);
});
import cors from 'cors';
import express, { Application } from 'express';
import { Server as SocketServer } from 'socket.io';
import path from 'path';
import http from 'http';
import { socketController } from '../sockets/controller';

class Server {
	private app: Application;
	private port: string;
	private server: http.Server;
	private io: SocketServer;

	constructor() {
		this.app = express();
		this.port = process.env.PORT || '3000';
		this.server = http.createServer(this.app);
		this.io = new SocketServer(this.server);

		// Middlewares
		this.middlewares();

		// Sockets
		this.sockets();
	}

	public listen(): void {
		this.server.listen(this.port, () => {
			console.log(`Server running on port `, this.port);
		});
	}

	private middlewares(): void {
		// CORS
		this.app.use(cors());

		this.app.use(express.static(path.join(__dirname, '../public')));
	}

	private sockets(): void {
		this.io.on('connection', socketController);
	}
}

export default Server;

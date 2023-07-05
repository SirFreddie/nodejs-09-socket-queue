import { Socket } from 'socket.io';
import { TicketControl } from '../models/ticket-control.model';

const ticketControl: TicketControl = new TicketControl();

export const socketController = (socket: Socket) => {
	// console.log('Client connected', socket.id);

	socket.emit('last-ticket', ticketControl.last);
	socket.emit('current-status', ticketControl.lastFour);
	socket.emit('pending-tickets', ticketControl.tickets.length);

	// socket.on('disconnect', () => {
	// 	console.log('Client disconnected', socket.id);
	// });

	socket.on('next-ticket', (payload, cb) => {
		const next = ticketControl.next();
		cb(next);
		socket.broadcast.emit('pending-tickets', ticketControl.tickets.length);
	});

	socket.on('attend-ticket', ({ desk }, cb) => {
		if (!desk) {
			return cb({
				ok: false,
				msg: 'Desk is required',
			});
		}

		const ticket = ticketControl.attend(desk);
		socket.broadcast.emit('current-status', ticketControl.lastFour);
		socket.emit('pending-tickets', ticketControl.tickets.length);
		socket.broadcast.emit('pending-tickets', ticketControl.tickets.length);

		if (!ticket) {
			return cb({
				ok: false,
				msg: 'There are no tickets',
			});
		} else {
			return cb({
				ok: true,
				ticket,
			});
		}
	});
};

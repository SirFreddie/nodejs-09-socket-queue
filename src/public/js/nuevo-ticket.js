// HTML References
const lblTicket = document.querySelector('#lblNuevoTicket');
const btnCreate = document.querySelector('button');

const socket = io();

socket.on('connect', () => {
	console.log('Conectado al servidor');
	btnCreate.disabled = false;
});

socket.on('disconnect', () => {
	console.log('Desconectado del servidor');
	btnCreate.disabled = true;
});

socket.on('last-ticket', lastTicket => {
	lblTicket.innerText = 'Ticket ' + lastTicket;
});

btnCreate.addEventListener('click', () => {
	const payload = {};
	socket.emit('next-ticket', payload, ticket => {
		lblTicket.innerText = ticket;
	});
});

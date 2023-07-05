// HTML References
const lblDesk = document.querySelector('h1');
const btnAttend = document.querySelector('button');
const lblTicket = document.querySelector('small');
const divAlert = document.querySelector('.alert');
const lblPendings = document.querySelector('#lblPendientes');

const searchParams = new URLSearchParams(window.location.search);

if (!searchParams.has('escritorio')) {
	window.location = 'index.html';
	throw new Error('El escritorio es obligatorio');
}

const desk = searchParams.get('escritorio');
lblDesk.innerText = desk;
divAlert.style.display = 'none';

const socket = io();

socket.on('connect', () => {
	console.log('Conectado al servidor');
	btnAttend.disabled = false;
});

socket.on('disconnect', () => {
	console.log('Desconectado del servidor');
	btnAttend.disabled = true;
});

socket.on('pending-tickets', payload => {
	if (payload === 0) {
		lblPendings.style.display = 'none';
	} else {
		lblPendings.style.display = '';
		lblPendings.innerText = payload;
	}
});

btnAttend.addEventListener('click', () => {
	const payload = { desk };
	socket.emit('attend-ticket', payload, ({ ok, ticket }) => {
		if (!ok) {
			lblTicket.innerText = 'Nadie.';
			return (divAlert.style.display = '');
		}

		lblTicket.innerText = `Ticket ${ticket.number}`;
	});
	// socket.emit('next-ticket', payload, ticket => {
	// 	lblTicket.innerText = ticket;
	// });
});

import path from 'path';
import fs from 'fs';
import { Ticket } from './ticket.mode';

export class TicketControl {
	last: number;
	today: number;
	tickets: Ticket[];
	lastFour: Ticket[];

	constructor() {
		this.last = 0;
		this.today = new Date().getDate();
		this.tickets = [];
		this.lastFour = [];

		this.init();
	}

	get toJson() {
		return {
			last: this.last,
			today: this.today,
			tickets: this.tickets,
			lastFour: this.lastFour,
		};
	}

	init(): void {
		const { today, tickets, last, lastFour } = require('../db/data.json');
		if (today === this.today) {
			this.tickets = tickets;
			this.last = last;
			this.lastFour = lastFour;
		} else {
			this.saveToDB();
		}
	}

	saveToDB(): void {
		const dbPath = path.join(__dirname, '../db/data.json');
		fs.writeFileSync(dbPath, JSON.stringify(this.toJson));
	}

	next(): string {
		this.last += 1;
		const ticket: Ticket = new Ticket(this.last, null);
		this.tickets.push(ticket);

		this.saveToDB();
		return 'Ticket ' + ticket.number;
	}

	attend(desk: number): Ticket | null {
		if (this.tickets.length === 0) {
			return null;
		}

		const ticket = this.tickets.shift();

		if (ticket) {
			ticket.desk = desk;
			this.lastFour.unshift(ticket);

			if (this.lastFour.length > 4) {
				this.lastFour.splice(-1, 1);
			}

			this.saveToDB();
			return ticket;
		}
		return null;
	}
}

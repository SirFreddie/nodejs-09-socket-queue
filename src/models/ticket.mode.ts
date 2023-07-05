export class Ticket {
	number: number;
	desk: number | null;

	constructor(aNumber: number, desk: number | null) {
		this.number = aNumber;
		this.desk = desk;
	}
}

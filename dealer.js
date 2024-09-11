export class Dealer{
    constructor() {
        this.Points = 0;
        this.Hand = [];
    }

    GetPoints() {
        return this.Points;
    }
    SetPoints(amount) {
        this.Points = amount;
    }
}
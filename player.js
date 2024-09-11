export class Player{
    constructor() {
        this.Username = "";
        this.Points = 0;
        this.Hand = [];
        this.Stand = false;
        this.Chips = 200;
    }

    Points() {
        return this.Points;
    }
}
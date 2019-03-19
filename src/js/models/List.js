import uniqid from "uniqid";

export default class List {
    constructor () {
        this.items = [];
    }

    addItem (amount, unit, ingredient) {
        const item = {
            id: uniqid(),
            amount,
            unit,
            ingredient
        }

        this.items.push(item);
        return item;
    }

    deleteItem (id) {
        const idx = this.items.findIndex(item => item.id === id);
        this.items.splice(idx, 1);
    }

    updateAmount (id, newAmount) {
        this.items.find(item => item.id === id).amount = newAmount;
    }
}
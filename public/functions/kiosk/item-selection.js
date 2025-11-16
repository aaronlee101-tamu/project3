async function menuItem(item) {
    console.log("Selected item: " + item);

    if (item == "App") {
        window.location.href = `/appetizers`;
    }
    else if (item == "Drink") {
        window.location.href = `/drinks`;
    }
    else {
        window.location.href = `/menu-items?item=${item}`;
    }
}

class MenuItem {
    constructor(name, price, category) {
        this.name = name;
        this.price = price;
        this.category = category;
    }
}
class MenuItem {
    constructor(id, name, category) {
        this.id = id;
        this.name = name;
        this.category = category;
    }
}

class Entry {
    constructor(orderId, size, menuItems, price=0.0) {
        this.orderId = orderId;
        this.size = size;
        this.menuItems = menuItems;
        this.price = price;
    }
}
    
  

const limits = window.selectionLimits;
const mealType = window.mealType;
const [sideLimit, entreeLimit] = limits[mealType];

let selectedItems  = [];
let entrees = 0;
let sides = 0;

async function selectItem(button) {
    const itemId = button.getAttribute("data-id");
    const itemCategory = button.getAttribute("data-category");
    const itemName = button.innerText;


    // Check if item is already selected
    if (button.classList.contains("selected")) {
        // Deselect the item
        button.classList.remove("selected");
        selectedItems = selectedItems.filter(item => item.id !== itemId);
        if (itemCategory === "Entree" || itemCategory == "Premium Entree") {
            entrees--;
        } else if (itemCategory === "Side") {
            sides--;
        }
    } else {

        //chek limits here

        if ((itemCategory === "Entree" || itemCategory == "Premium Entree") && entrees >= entreeLimit) {
            alert(`You can only select up to ${entreeLimit} entrees for a ${mealType}.`);
            return;
        } else if ((itemCategory === "Entree" || itemCategory == "Premium Entree") && entrees < entreeLimit) {
            entrees++;
            selectedItems.push(new MenuItem(itemId, itemName, itemCategory));
        }
        if (itemCategory === "Side" && sides >= sideLimit) {
            alert(`You can only select up to ${sideLimit} sides for a ${mealType}.`);
            return;
        } else if (itemCategory === "Side" && sides < sideLimit) {
            sides++;
            selectedItems.push(new MenuItem(itemId, itemName, itemCategory));
        }

        alert(`Selected ${selectedItems}`);
        button.classList.add("selected");
    }
}

async function calcPrice(mealType) {
    try {
        const response = await fetch(`get-price?item=${mealType}`);
        const data = await response.json();
        console.log("Calculated price:", data.price);
        return Number(data.price);
    } catch (error) {
        console.error("Error calculating price:", error);
        return 0;
    }
}

window.proceed = async function() {
    let totalPrice = await calcPrice(mealType);
    for (let item of selectedItems) {
        console.log(`Selected Item: ${item.name} (ID: ${item.id}, Category: ${item.category})`);
        if (item.category === "Premium Entree") {
            totalPrice += 1.50;
        }
    }

    alert(`Total Price: $${totalPrice.toFixed(2)}`);
    const orderId = localStorage.getItem("orderId");
    let orderEntry = new Entry(orderId, mealType, selectedItems, totalPrice);

    localStorage.setItem("orderEntry", JSON.stringify(orderEntry));
    
    fetch('/order-entry', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'}, 
        body: JSON.stringify(orderEntry)
    })
    .then(res => res.text())
    .then(html => {
        document.open();
        document.write(html);
        document.close();
    })
    .catch(err => console.error('Error posting order entry:', err));
}
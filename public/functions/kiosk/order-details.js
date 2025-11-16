class Order {
    constructor(orderId, employeeId, totalCost, timeStamp) {
        this.orderId = orderId;
        this.employeeId = employeeId;
        this.totalCost = totalCost;
        this.timeStamp = timeStamp;
    }
}

// create an order object
const entry = JSON.parse(localStorage.getItem('orderEntry'));

fetch(`/order-entry`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(entry)
})
.then(res =>res.text())
.then(html => {
    document.open();
    document.write(html);
    document.close();
})
.catch(err => console.error('Error posting order entry:', err));
currOrder = new Order(entry.orderId, 103, 0.00, new Date().toISOString());

async function confirmOrder() {
    const entry = window.entryData || JSON.parse(localStorage.getItem('orderEntry'));

    if (!entry) {
        console.error('No order entry found');
        return;
    }

    try {
        const response = await fetch('/finalize-order', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(entry)
        });

        const data = await response.json();

        if (data.success) {
            alert('Order finalized successfully!');
            localStorage.removeItem('orderEntry');
            window.location.href = '/';
        }
        else {
            alert('Failed to finalize order: ' + data.error);
        }
    } catch (error) {
        console.error('Error finalizing order:', error);
        alert('An error occurred while finalizing the order.');
    }
}
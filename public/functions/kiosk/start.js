async function startOrder() {
    const totalCost = 0.0;
    try {
        const response = await fetch('/start-order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                employee_id: 103,
                total_cost: totalCost
            }),
        });

        console.log("response:", response.status);
        const data = await response.json();
        console.log("data:", data);

        if (response.ok) {
            const orderId = data.orderId;
            console.log("Order started with ID:", orderId);
            localStorage.setItem("orderId", orderId);
            window.location.href = `/item-selection?orderId=${orderId}`;
        } else {
            console.error("Failed to start order");
        }
    } catch (error) {
        console.error("Error starting order:", error);
    }
}
    

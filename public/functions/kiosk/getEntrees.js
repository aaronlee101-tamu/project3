module.exports = (pool) => {
    async function getEntreeNames() {
        const query = `
            SELECT * from menuitem
            order by category DESC;
        `;
        
        try {
        const res = await pool.query(query);
        return res.rows;
        } catch (err) {
            console.error("Error generating sales report:", err.message);
            return [];
        }
    }

    return { getEntreeNames };
};
import db from "../config/db.js"

export const userService = {
    all: async () => {
        const result = await db.execute("SELECT * FROM users ORDER BY fullname ASC");
        return result.rows;
    },
    byId: async (id) => {
        const result = await db.execute({
            sql: "SELECT * FROM users WHERE id=?",
            args: [id]
        });
        return result.rows[0];
    }
}
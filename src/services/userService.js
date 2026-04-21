import db from "../config/db.js"

export const userService = {
    all: async () => {
        const result = await db.execute("SELECT * FROM users ORDER BY nama ASC");
        return result.rows;
    },
    byId: async (id) => {
        const result = await db.execute({
            sql: "SELECT * FROM users WHERE id=?",
            args: [id]
        });
        return result.rows[0];
    },
    byUsername: async (username, role) => {
        if(role == 'admin') {
            const result = await db.execute({
                sql: "SELECT * FROM users WHERE username=?",
                args: [username]
            });
            return result.rows[0];
        } else if( role == 'pjgt') {
            const result = await db.execute({
                sql: "SELECT * FROM pjgt WHERE username=?",
                args: [username]
            });
            return result.rows[0];
        } else if(role == 'gt') {
            const result = await db.execute({
                sql: "SELECT * FROM gt WHERE nim=?",
                args: [username]
            });
            return result.rows[0];
        } else {
            throw new Error("role yang anda masukkan tidak valid");
        }
    }
}
import db from "../config/db.js"
import { tanggal } from "../utils/tanggal.js";

const tanggalJam = tanggal.getYmdhis();

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
    },
     byIdRole: async (id, role) => {
        if(role == 'admin') {
            const result = await db.execute({
                sql: "SELECT * FROM users WHERE id=?",
                args: [id]
            });
            return result.rows[0];
        } else if( role == 'pjgt') {
            const result = await db.execute({
                sql: "SELECT * FROM pjgt WHERE id=?",
                args: [id]
            });
            return result.rows[0];
        } else if(role == 'gt') {
            const result = await db.execute({
                sql: "SELECT * FROM gt WHERE id=?",
                args: [id]
            });
            return result.rows[0];
        } else {
            throw new Error("role yang anda masukkan tidak valid");
        }
    },
    updatePassword: async (id, role, hashedNewPassword) => {
        if(role == 'admin') {
            const result = await db.execute({
                  sql: `UPDATE user SET password=?, updated_at=? WHERE id=?`,
            args: [hashedNewPassword, tanggalJam, id]
            });
            return result.rows[0];
        } else if( role == 'pjgt') {
            const result = await db.execute({
                 sql: `UPDATE pjgt SET password=?, updated_at=? WHERE id=?`,
            args: [hashedNewPassword, tanggalJam, id]
            });
            return result.rows[0];
        } else if(role == 'gt') {
            const result = await db.execute({
                  sql: `UPDATE gt SET password=?, updated_at=? WHERE id=?`,
            args: [hashedNewPassword, tanggalJam, id]
            });
            return result.rows[0];
        } else {
            throw new Error("role yang anda masukkan tidak valid");
        }
    }
}
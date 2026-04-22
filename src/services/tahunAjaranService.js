import { v4 as uuidv4 } from "uuid";
import db from "../config/db.js"

export const tahunAjaranService = {
    all: async () => {
        const result = await db.execute("SELECT * FROM tahun_ajaran ORDER BY aktif DESC, keterangan DESC");
        return result.rows;
    },
    byId: async (id) => {
        const result = await db.execute({
            sql: "SELECT * FROM tahun_ajaran WHERE id=?",
            args: [id]
        });
        return result.rows[0];
    },
    create: async (keterangan) => {
        const id = uuidv4();
        await db.execute({
            sql: "INSERT INTO tahun_ajaran (id, keterangan) VALUES (?,?)",
            args: [id, keterangan]
        });
        return { id: id, keterangan: keterangan }
    },
    update: async (keterangan, id) => {
        await db.execute({
            sql: "UPDATE tahun_ajaran SET keterangan=? WHERE id=?",
            args: [keterangan, id]
        });
        return { id: id, keterangan: keterangan }
    },
    aktif: async (id) => {
        const transaksional = [];
        transaksional.push({
            sql: "UPDATE tahun_ajaran SET aktif=0 WHERE id <> ?",
            args: [id]
        })
        transaksional.push({
            sql: "UPDATE tahun_ajaran SET aktif=1 WHERE id=?",
            args: [id]
        })
        await db.batch(transaksional)
        return { message: ` id tahun ajaran ${id} berhasil dijadikan aktif` }
    }
}
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
    
    // 1. Nonaktifkan semua selain ID ini
    transaksional.push({
        sql: "UPDATE tahun_ajaran SET aktif=0 WHERE id <> ?",
        args: [id]
    });
    
    // 2. Aktifkan ID ini
    transaksional.push({
        sql: "UPDATE tahun_ajaran SET aktif=1 WHERE id=?",
        args: [id]
    });
    
    await db.batch(transaksional);

    // 3. Ambil data terbaru untuk dikembalikan ke client
    const result = await db.execute({
        sql: "SELECT * FROM tahun_ajaran WHERE id = ?",
        args: [id]
    });

    const updatedData = result.rows[0];

    return { 
        message: `Tahun ajaran ${updatedData.keterangan} berhasil diaktifkan`,
        data: updatedData // Mengembalikan objek lengkap {id, keterangan, aktif}
    };
},
    // Tambahkan di dalam tahunAjaranService
    // hanya menghasilkan tru.data tidak terkirim untuk disimpan 

    getActive: async () => {
        // 1. Coba cari yang benar-benar aktif
        const activeResult = await db.execute("SELECT * FROM tahun_ajaran WHERE aktif = 1 ORDER BY id DESC LIMIT 1");
        return activeResult.rows[0]


        // if (activeResult.rows.length > 0) {
        //     console.log("Data Aktif Ditemukan:", activeResult.rows[0]);
        //     return activeResult.rows;
        // }

        // // 2. Fallback: Jika tidak ada yang aktif, ambil yang terakhir dibuat (ID terbaru/Keterangan terbaru)
        // console.log("Tidak ada data aktif, mencari data terbaru...");
        // const fallbackResult = await db.execute("SELECT * FROM tahun_ajaran ORDER BY keterangan DESC LIMIT 1");

        // if (fallbackResult.rows.length > 0) {
        //     return fallbackResult.rows;
        // }

        // // 3. Jika benar-benar kosong (tabel kosong)
        // return null;
    },

}
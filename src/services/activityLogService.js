import { v4 as uuidv4 } from "uuid";
import db from "../config/db.js"
import { tanggal } from "../utils/tanggal.js"

const tanggalJam = tanggal.getYmdhis();
export const activityLogService = {

    all: async () => {
        const result = await db.execute({
            sql: `SELECT 
            logs.id,
            logs.action,
            logs.module,
            logs.created_at,
            logs.role,
            logs.user_id,
            -- Mengambil nama dari tabel yang sesuai berdasarkan role
            COALESCE(u.username, p.username, g.nim) AS username,
            CASE 
            WHEN logs.user_id = u.id THEN u.username
            WHEN logs.user_id = p.id THEN p.nama
            WHEN logs.user_id = g.id THEN g.nama
            ELSE 'Unknown'
            END AS nama_pengguna,
            logs.ip_address,
            logs.user_agent,
            logs.metadata
            FROM activity_logs logs
            -- Join ke tabel user utama untuk kredensial
            LEFT JOIN users u ON logs.user_id = u.id
            -- Join ke tabel detail PJGT
            LEFT JOIN pjgt p ON logs.user_id = p.id
            -- Join ke tabel detail GT
            LEFT JOIN gt g ON logs.user_id = g.id
            ORDER BY logs.created_at DESC`,
        })

        return result.rows
    },
    byId: async (id) => {
        const result = await db.execute({
            sql: `SELECT 
                logs.id,
                logs.action,
                logs.module,
                logs.created_at,
                logs.role,
                logs.user_id,
                -- Mengambil nama dari tabel yang sesuai berdasarkan role
                COALESCE(u.username, 'System') AS username,
                CASE 
                WHEN logs.role = 'admin' THEN u.username
                WHEN logs.role = 'pjgt' THEN p.nama_lengkap
                WHEN logs.role = 'gt' THEN g.nama_lengkap
                ELSE 'Unknown'
                END AS nama_pengguna,
                logs.ip_address,
                logs.user_agent,
                logs.metadata
                FROM activity_logs logs
                -- Join ke tabel user utama untuk kredensial
                LEFT JOIN users u ON logs.user_id = u.id
                -- Join ke tabel detail PJGT
                LEFT JOIN pjgt p ON logs.user_id = p.user_id
                -- Join ke tabel detail GT
                LEFT JOIN gt g ON logs.user_id = g.user_id
                WHERE id_user=?
                ORDER BY logs.created_at DESC`,

            args: [id]
        })
        return result.rows
    },

    byTahun: async () => {
        const result = await db.execute({
            sql: `SELECT 
            logs.id,
            logs.action,
            logs.module,
            logs.created_at,
            logs.role,
            logs.user_id,
            COALESCE(u.username, 'System') AS username,
            CASE 
                WHEN logs.role = 'admin' THEN u.username
                WHEN logs.role = 'pjgt' THEN p.nama
                WHEN logs.role = 'gt' THEN g.nama
                ELSE 'Unknown'
            END AS nama_pengguna,
            logs.ip_address,
            logs.user_agent,
            logs.metadata
        FROM activity_logs logs
        LEFT JOIN users u ON logs.user_id = u.id
        LEFT JOIN pjgt p ON logs.user_id = p.username
        LEFT JOIN gt g ON logs.user_id = g.nim
        WHERE 
            -- Filter untuk bulan sekarang
            strftime('%m', logs.created_at) = strftime('%m', 'now', 'localtime')
            AND 
            -- Filter untuk tahun sekarang
            strftime('%Y', logs.created_at) = strftime('%Y', 'now', 'localtime')
        ORDER BY logs.created_at DESC`,
        });

        return result.rows;
    },
    bulanAlternatif: async (bulan, tahun) => {
        // Jika parameter tidak dikirim, default ke bulan/tahun sekarang
        const filterBulan = bulan || new Date().getMonth() + 1;
        const filterTahun = tahun || new Date().getFullYear();

        const result = await db.execute({
            sql: `SELECT ... 
              FROM activity_logs logs
              WHERE strftime('%m', logs.created_at) = ? 
                AND strftime('%Y', logs.created_at) = ?
              ORDER BY logs.created_at DESC`,
            args: [
                filterBulan.toString().padStart(2, '0'), // Pastikan formatnya "05" bukan "5"
                filterTahun.toString()
            ]
        });
        return result.rows;
    },
    create: async (data, role, userId) => { // Perhatikan default {}
        try {
            const user_id = userId || "system";
            const user_role = role || "guest";

            // Menggunakan Optional Chaining (?.) atau default value
            const action = data?.action || "UNKNOWN";
            const module = data?.module || "COMMON";
            const targetId = data?.target_id || "";
            const userAgent = data?.user_agent || "Unknown";

            // Pastikan metadata diproses dengan aman
            let metadata = "{}";
            if (data?.metadata) {
                metadata = typeof data.metadata === 'object'
                    ? JSON.stringify(data.metadata)
                    : data.metadata;
            }

            await db.execute({
                sql: `INSERT INTO activity_logs 
                  (user_id, role, action, module, target_id, metadata, user_agent) 
                  VALUES (?, ?, ?, ?, ?, ?, ?)`,
                args: [
                    user_id,
                    user_role,
                    action,
                    module,
                    targetId,
                    metadata,
                    userAgent
                ]
            });

            return { user_id, role: user_role, action, module };
        } catch (error) {
            console.error("Database Log Error:", error.message);
            throw error; // Teruskan error agar tertangkap di controller
        }
    },

    // update: async (data, id) => {
    //     const tanggalJam = tanggal.getYmdhis();
    //     await db.execute({
    //         sql: `UPDATE tugas SET id_tahun_ajaran=?, id_pjgt=?, id_gt=?, jenis_penugasan=?, updated_at=? WHERE id=?`,
    //         args: [data.idTahunAjaran, data.idPjgt, data.idGt, data.jenisPenugasan, tanggalJam, id]
    //     })
    //     return { id: id, ...data }
    // },
    delete: async () => {

        await db.execute({
            sql: `UPDATE tugas SET aktif=0, updated_at=? WHERE id=?`,
            args: [tanggalJam, id]
        })
        return { pesan: `id penugasan ${id} telah dihapus` }
    },
}
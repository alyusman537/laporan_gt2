import { pjgtService } from "../services/pjgtService.js";
import { passwordBcrypt } from "../utils/passwordBcrypt.js";
import { LibsqlError } from "@libsql/client";

export const pjgtController = {
    all: async (req, res) => {
        try {
            const hasil = await pjgtService.all();
            res.status(201).json({ success: true, data: hasil });
        } catch (error) {
            if (error instanceof LibsqlError) {
                res.status(500).json({ success: false, message: `libSQL Error: ${error.code} - ${error.message}` });
            } else {
                res.status(500).json({ success: false, message: `An unexpected error occurred: ${error}` });
            }
        }
    },
    byId: async (req, res) => {
        try {
            const { id } = req.params;
            const hasil = await pjgtService.byId(id);
            res.status(201).json({ success: true, data: hasil });
        } catch (error) {
            if (error instanceof LibsqlError) {
                res.status(500).json({ success: false, message: `libSQL Error: ${error.code} - ${error.message}` });
            } else {
                res.status(500).json({ success: false, message: `An unexpected error occurred: ${error}` });
            }
        }
    },
    create: async (req, res) => {
        try {
            const { nama, nikPjgt, hpPjgt, namaKm, hpKm, alamatMadrasah } = req.body;
            const idPjgt = await pjgtService.autoId();
            console.log("id pjgt ", idPjgt);
            
            const data = {
                username: idPjgt,
                password: passwordBcrypt.enkrip(idPjgt),
                nama: nama,
                nikPjgt: nikPjgt,
                hpPjgt: hpPjgt,
                namaKm: namaKm,
                hpKm: hpKm,
                alamatMadrasah: alamatMadrasah
            }
            const hasil = await pjgtService.create(data);
            res.status(201).json({ success: true, data: hasil });
        } catch (error) {
            if (error instanceof LibsqlError) {
                res.status(500).json({ success: false, message: `libSQL Error: ${error.code} - ${error.message}` });
            } else {
                res.status(500).json({ success: false, message: `An unexpected error occurred: ${error}` });
            }
        }
    },
    update: async (req, res) => {
        try {
            const { nama, nikPjgt, hpPjgt, namaKm, hpKm, alamatMadrasah } = req.body;
            const { id } = req.params;
            const data = {
                nama: nama,
                nikPjgt: nikPjgt,
                hpPjgt: hpPjgt,
                namaKm: namaKm,
                hpKm: hpKm,
                alamatMadrasah: alamatMadrasah
            }
            const hasil = await pjgtService.update(id, data);
            res.status(200).json({ success: true, data: hasil });
        } catch (error) {
            if (error instanceof LibsqlError) {
                res.status(500).json({ success: false, message: `libSQL Error: ${error.code} - ${error.message}` });
            } else {
                res.status(500).json({ success: false, message: `An unexpected error occurred: ${error}` });
            }
        }
    },
    delete: async (req, res) => {
        try {
            const { id } = req.params;
            const hasil = await pjgtService.delete(id);
            res.status(200).json({ success: true, data: hasil });
        } catch (error) {
            if (error instanceof LibsqlError) {
                res.status(500).json({ success: false, message: `libSQL Error: ${error.code} - ${error.message}` });
            } else {
                res.status(500).json({ success: false, message: `An unexpected error occurred: ${error}` });
            }
        }
    },
    reset: async (req, res) => {
        try {
            const { id } = req.params;
            const pjgt = await pjgtService.byId(id);
            if (!pjgt) {
                res.status(400).json({ success: false, message: "id pjgt tidak valid" });
            }
            const hasil = await pjgtService.update(id, pjgt.username);
            res.status(200).json({ success: true, data: hasil });
        } catch (error) {
            if (error instanceof LibsqlError) {
                res.status(500).json({ success: false, message: `libSQL Error: ${error.code} - ${error.message}` });
            } else {
                res.status(500).json({ success: false, message: `An unexpected error occurred: ${error}` });
            }
        }
    },
    changePassword: async (req, res) => {
        try {
            const id = req.user.id;
            const { oldPassword, newPassword, confirmPassword } = req.body;
            const pjgt = await pjgtService.byId(id);
            if (!pjgt) {
                res.status(400).json({ success: false, message: "id pjgt tidak valid" });
            }
            if (!passwordBcrypt.banding(oldPassword, pjgt.password)) {
                res.status(400).json({ success: false, message: "password lama yang anda masukkan salah." });
            }
            if (newPassword != confirmPassword) {
                res.status(400).json({ success: false, message: "password baru dan konfirmasi password harus sama" });
            }
            const hasil = await pjgtService.changePassword(id, passwordBcrypt.enkrip(newPassword));
            res.status(200).json({ success: true, data: hasil });
        } catch (error) {
            if (error instanceof LibsqlError) {
                res.status(500).json({ success: false, message: `libSQL Error: ${error.code} - ${error.message}` });
            } else {
                res.status(500).json({ success: false, message: `An unexpected error occurred: ${error}` });
            }
        }
    },
}
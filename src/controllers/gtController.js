import { gtService } from "../services/gtService.js";
import { passwordBcrypt } from "../utils/passwordBcrypt.js";
import { LibsqlError } from "@libsql/client";

export const gtController = {
    all: async (req, res) => {
        try {
            const hasil = await gtService.all();
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
            const hasil = await gtService.byId(id);
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
            const { nim, nama, nik,
            tempatLahir, tanggalLahir, alamat, hp, namaAyah,
            namaIbu, namaWali, hpWali, asalKelas, waliKelas } = req.body;
            
            const data = {
                nim: nim,
                password: passwordBcrypt.enkrip(nim),
                nama: nama,
                nik: nik,
                tempatLahir: tempatLahir,
                tanggalLahir: tanggalLahir,
                alamat: alamat,
                hp: hp,
                namaAyah: namaAyah,
                namaIbu: namaIbu,
                namaWali: namaWali,
                hpWali: hpWali,
                asalKelas: asalKelas,
                waliKelas: waliKelas
            }
            const hasil = await gtService.create(data);
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
            const { id } = req.params;
            const { nama, nik,
            tempatLahir, tanggalLahir, alamat, hp, namaAyah,
            namaIbu, namaWali, hpWali, asalKelas, waliKelas } = req.body;
            
            const data = {
                nama: nama,
                nik: nik,
                tempatLahir: tempatLahir,
                tanggalLahir: tanggalLahir,
                alamat: alamat,
                hp: hp,
                namaAyah: namaAyah,
                namaIbu: namaIbu,
                namaWali: namaWali,
                hpWali: hpWali,
                asalKelas: asalKelas,
                waliKelas: waliKelas
            }
            const hasil = await gtService.update(id, data);
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
            const hasil = await gtService.delete(id);
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
            const gt = await gtService.byId(id);
            if (!gt) {
                res.status(400).json({ success: false, message: "id gt tidak valid" });
            }
            const hasil = await gtService.update(id, gt.nim);
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
            const pjgt = await gtService.byId(id);
            if (!pjgt) {
                res.status(400).json({ success: false, message: "id gt tidak valid" });
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
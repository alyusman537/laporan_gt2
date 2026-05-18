import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js'
import { userController } from '../controllers/userController.js';
import { authController } from '../controllers/authController.js';
import { validateBody } from '../middleware/validationMiddleware.js';
import { roleMiddleware } from '../middleware/roleMiddleware.js';
import { pjgtController } from '../controllers/pjgtController.js';
import { gtController } from '../controllers/gtController.js';
import { tahunAjaranController } from '../controllers/tahunAjaranController.js';
import { tugasController } from '../controllers/tugasController.js';
import { laporanGtController } from '../controllers/laporanGtController.js';
import { laporanPjgtController } from '../controllers/laporanPjgtController.js';
import { statusPjgtController } from '../controllers/statusPjgtController.js';
import { activityLogController } from '../controllers/activityLogController.js';

export const router = express.Router();
const pjgtSchema = ["nama", "nikPjgt", "hpPjgt", "namaKm", "hpKm", "namaMadrasah", "alamatMadrasah"];
const gtSchema = ["nim", "nama", "nik", "tempatLahir", "tanggalLahir", "alamat", "hp", "namaAyah", "namaIbu", "namaWali", "hpWali", "asalKelas", "waliKelas"];
const tugasSchema = ["idTahunAjaran", "idPjgt", "idGt", "jenisPenugasan"];

// error: Field berikut wajib diisi: kedisiplinanGt, rambutGt, pelanggaranGt, hubunganMuridKelas, hubunganMuridLuarKelas, tanggapanMurid}
//const laporanGtSchema = ["bulanKe", "statusKelas", "waliKelas", "guruFak", "jkMurid", "kedisiplinanGt", "kegiatanGt", "rambutGt", "suratIzinDigunakan", "pergiGt", "pulangGt", "pelanggaranGt", "hubunganPjgt", "hubunganKm", "hubunganGuru", "hubunganMuridKelas", "hubunganMuridLuarKelas", "tanggapanMurid", "bisyaroh"]


// Payload dikirim ke backend: {bulanKe: 2, tahun: 1447, statusKelas: 0, menanganiAdministrasi: 1, waliKelas: {"Ibtidaiyah":["1","2","3"],"Tsanawiyah":["2"],"Aliyah":["1"]}, guruFak: {"Ibtidaiyah":["2","5"],"Tsanawiyah":["2"],"Aliyah":["2"]}, administrasi: {"Absensi":true,"Rapot":true,"Tabungan":false,"Lainnya":false}, kegiatanGt: {"Pembinaan Al Miftah":true,"Pengajian Kitab":true,"Pengajian Alqur'an":true,"Imam Rowatib":true,"Lainnya":false}, jkMurid: Banin, suratIzinDigunakan: 2, pergiGt: 3, pulangGt: 1, hubunganPjgt: Sering, alasan_pjgt: , hubunganKm: Sering, alasan_kepala: , hubunganGuru: Sering, alasan_guru: , bisyaroh: 500000, masalah_penyelesaian: xvxcvxcvxcvxv, tugasMendatang: cvxcvxvxvz, tugasBelumSelesai: vxvxcvxzvz, usulanLainLain: vxvxvxcvxcvxvxc,}


// const laporanGtSchema = ["bulanKe", "tahun","statusKelas", "waliKelas", "guruFak", "jkMurid", "menanganiAdministrasi",'administrasi' ,"kegiatanGt", "menanganiKegiatan", "sakitHari", "pergiHari", "pulangHari",  "hubunganPjgt","alasanPjgt", "hubunganKm", "alasanKepala", "hubunganGuru","alasanGuru", "masalahPenyelesaian", "tugasMendatang", "tugasBelumSelesai", "usulanLainLain","bisyaroh"]

router.post("/login", validateBody(["username", "role", "password"]), authController.login);
router.post("/change-password",authenticate,validateBody(["oldPassword", "newPassword", "confirmPassword"]),  authController.changePassword);
// refresh token endpoint
router.post("/refresh-token", authController.refreshToken);

//ADMIN
router.get("/users", authenticate, roleMiddleware.admin, userController.all);
router.get("/users/:id", authenticate, roleMiddleware.admin, userController.byId);

router.get("/pjgt", authenticate, roleMiddleware.admin, pjgtController.all);
router.get("/pjgt/:id", authenticate, roleMiddleware.admin, pjgtController.byId);
router.get("/pjgt-tahun/:tahun", authenticate, roleMiddleware.admin, pjgtController.byTahun);
router.post("/pjgt", authenticate, roleMiddleware.admin, validateBody(pjgtSchema), pjgtController.create);
router.put("/pjgt/:id", authenticate, roleMiddleware.admin, validateBody(pjgtSchema), pjgtController.update);
router.get("/pjgt-reset/:id", authenticate, roleMiddleware.admin, pjgtController.reset);
router.delete("/pjgt/:id", authenticate, roleMiddleware.admin, pjgtController.delete);
////
router.get("/pjgt-status/:id", authenticate, roleMiddleware.admin, statusPjgtController.getAllStatus);
router.get("/pjgt-riwayat/:id", authenticate, roleMiddleware.admin, statusPjgtController.getHistoryStatus);
router.post("/pjgt-status/:id", authenticate, roleMiddleware.admin, statusPjgtController.createStatus);
router.put("/pjgt-status/:id", authenticate, roleMiddleware.admin, statusPjgtController.updateStatus);


router.get("/gt", authenticate, roleMiddleware.admin, gtController.all);
router.get("/gt/:id", authenticate, roleMiddleware.admin, gtController.byId);
router.get("/gt-tahun/:tahun", authenticate, roleMiddleware.admin, gtController.byTahun);
router.post("/gt", authenticate, roleMiddleware.admin, validateBody(gtSchema), gtController.create);
router.put("/gt/:id", authenticate, roleMiddleware.admin, validateBody(gtSchema), gtController.update);
router.get("/gt-reset/:id", authenticate, roleMiddleware.admin, gtController.reset);
router.delete("/gt/:id", authenticate, roleMiddleware.admin, gtController.delete);

router.get("/tahun-ajaran", authenticate, roleMiddleware.admin, tahunAjaranController.all);
router.get("/tahun-ajaran/:id", authenticate, roleMiddleware.admin, tahunAjaranController.byId);
router.post("/tahun-ajaran", authenticate, validateBody(["keterangan"]), roleMiddleware.admin, tahunAjaranController.create);
router.put("/tahun-ajaran/:id", authenticate, validateBody(["keterangan"]), roleMiddleware.admin,tahunAjaranController.update);
router.get("/tahun-ajaran-aktif/:id", authenticate, roleMiddleware.admin, tahunAjaranController.aktif);
router.get("/tahun-ajaran-check-aktif", authenticate,roleMiddleware.admin, tahunAjaranController.getAktif);

router.get("/tugas", authenticate, roleMiddleware.admin, tugasController.all);
router.get("/tugas/:id", authenticate, roleMiddleware.admin, tugasController.byId);
router.get("/tugas-tahun/:tahun", authenticate, roleMiddleware.admin, tugasController.byTahun);
router.post("/tugas", authenticate, roleMiddleware.admin, validateBody(tugasSchema), tugasController.create);
router.put("/tugas/:id", authenticate, roleMiddleware.admin, validateBody(tugasSchema), tugasController.update);
router.delete("/tugas/:id", authenticate, roleMiddleware.admin, tugasController.delete);

router.get("/laporan-gt/admin/tahunan/:tahun", authenticate, roleMiddleware.admin, laporanGtController.tahun);
router.get("/laporan-gt/admin/bulanan/:tahun/:bulan", authenticate, roleMiddleware.admin, laporanGtController.bulan);
router.get("/laporan-gt/admin/by-pjgt/:id_pjgt", authenticate, roleMiddleware.admin, laporanGtController.pjgtByAdmin);
router.get("/laporan-gt/admin/by-gt/:id_gt", authenticate, roleMiddleware.admin, laporanGtController.gtByAdmin);

router.get("/laporan-pjgt/admin/tahunan/:tahun", authenticate, roleMiddleware.admin, laporanPjgtController.tahun);
router.get("/laporan-pjgt/admin/bulanan/:tahun/:bulan", authenticate, roleMiddleware.admin, laporanPjgtController.bulan);
router.get("/laporan-pjgt/admin/by-pjgt/:id_pjgt", authenticate, roleMiddleware.admin, laporanPjgtController.pjgtByAdmin);
router.get("/laporan-pjgt/admin/by-gt/:id_gt", authenticate, roleMiddleware.admin, laporanPjgtController.gtByAdmin);

//PJGT
router.get("/pjgt-profile", authenticate, roleMiddleware.pjgt, pjgtController.myProfile);
router.get("/pjgt-list-gt", authenticate, roleMiddleware.pjgt, pjgtController.listGt);
router.put("/pjgt/change-password", authenticate, roleMiddleware.pjgt, validateBody(["oldPassword", "newPassword", "confirmPassword"]), pjgtController.changePassword);
router.post("/laporan-pjgt/gt", authenticate, roleMiddleware.pjgt, laporanPjgtController.create);
// router.post("/laporan-pjgt/gt", authenticate, roleMiddleware.pjgt, validateBody(laporanGtSchema), laporanPjgtController.create);
router.get("/laporan-pjgt/gt", authenticate, roleMiddleware.pjgt, laporanPjgtController.pjgt);

//GT
router.get("/gt-profile", authenticate, roleMiddleware.gt, gtController.myProfile);
router.get("/gt-profile-tempat", authenticate, roleMiddleware.gt, gtController.myProfileTempat);
router.post("/gt/change-password", authenticate, roleMiddleware.gt, validateBody(["oldPassword", "newPassword", "confirmPassword"]), gtController.changePassword);
router.post("/laporan-gt", authenticate, roleMiddleware.gt, laporanGtController.create);
router.put("/laporan-gt", authenticate, roleMiddleware.gt, laporanGtController.update);
// router.post("/laporan-gt", authenticate, roleMiddleware.gt, validateBody(laporanGtSchema), laporanGtController.create);
router.get("/laporan-gt", authenticate, roleMiddleware.gt, laporanGtController.gt);

//LOGIN
router.get("/laporan-gt/detail/:id", authenticate, laporanGtController.detail);
router.get("/laporan-pjgt/detail/:id", authenticate, laporanGtController.detail);
//LOG ACTIVITY
router.post("/activity-logs", authenticate, activityLogController.create);
router.get("/activity-logs", authenticate, activityLogController.all);
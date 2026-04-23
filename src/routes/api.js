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

export const router = express.Router();
const pjgtSchema = ["nama", "nikPjgt", "hpPjgt", "namaKm", "hpKm", "namaMadrasah", "alamatMadrasah"];
const gtSchema = ["nim", "nama", "nik", "tempatLahir", "tanggalLahir", "alamat", "hp", "namaAyah", "namaIbu", "namaWali", "hpWali", "asalKelas", "waliKelas"];
const tugasSchema = ["idTahunAjaran", "idPjgt", "idGt", "jenisPenugasan"];
const laporanGtSchema = ["bulanKe", "statusKelas", "waliKelas", "guruFak", "jkMurid", "kedisiplinanGt", "kegiatanGt", "rambutGt", "suratIzinDigunakan", "pergiGt", "pulangGt", "pelanggaranGt", "hubunganPjgt", "hubunganKm", "hubunganGuru", "hubunganMuridKelas", "hubunganMuridLuarKelas", "tanggapanMurid", "bisyaroh"]

router.post("/login", validateBody(["username", "role", "password"]), authController.login);

//ADMIN
router.get("/users", authenticate, roleMiddleware.admin, userController.all);
router.get("/users/:id", authenticate, roleMiddleware.admin, userController.byId);

router.get("/pjgt", authenticate, roleMiddleware.admin, pjgtController.all);
router.get("/pjgt/:id", authenticate, roleMiddleware.admin, pjgtController.byId);
router.post("/pjgt", authenticate, roleMiddleware.admin, validateBody(pjgtSchema), pjgtController.create);
router.put("/pjgt/:id", authenticate, roleMiddleware.admin, validateBody(pjgtSchema), pjgtController.update);
router.get("/pjgt-reset/:id", authenticate, roleMiddleware.admin, pjgtController.reset);
router.delete("/pjgt/:id", authenticate, roleMiddleware.admin, pjgtController.delete);

router.get("/gt", authenticate, roleMiddleware.admin, gtController.all);
router.get("/gt/:id", authenticate, roleMiddleware.admin, gtController.byId);
router.post("/gt", authenticate, roleMiddleware.admin, validateBody(gtSchema), gtController.create);
router.put("/gt/:id", authenticate, roleMiddleware.admin, validateBody(gtSchema), gtController.update);
router.get("/gt-reset/:id", authenticate, roleMiddleware.admin, gtController.reset);
router.delete("/gt/:id", authenticate, roleMiddleware.admin, gtController.delete);

router.get("/tahun-ajaran", authenticate, roleMiddleware.admin, tahunAjaranController.all);
router.get("/tahun-ajaran/:id", authenticate, roleMiddleware.admin, tahunAjaranController.byId);
router.post("/tahun-ajaran", authenticate, validateBody(["keterangan"]), roleMiddleware.admin, tahunAjaranController.create);
router.put("/tahun-ajaran/:id", authenticate, validateBody(["keterangan"]), roleMiddleware.admin,tahunAjaranController.update);
router.get("/tahun-ajaran-aktif/:id", authenticate, roleMiddleware.admin, tahunAjaranController.aktif);

router.get("/tugas", authenticate, roleMiddleware.admin, tugasController.all);
router.get("/tugas/:id", authenticate, roleMiddleware.admin, tugasController.byId);
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
router.put("/pjgt/change-password", authenticate, roleMiddleware.pjgt, validateBody(["oldPassword", "newPassword", "confirmPassword"]), pjgtController.changePassword);
router.post("/laporan-pjgt/gt", authenticate, roleMiddleware.pjgt, validateBody(laporanGtSchema), laporanPjgtController.create);
router.get("/laporan-pjgt/gt", authenticate, roleMiddleware.pjgt, laporanPjgtController.pjgt);

//GT
router.post("/gt/change-password", authenticate, roleMiddleware.gt, validateBody(["oldPassword", "newPassword", "confirmPassword"]), gtController.changePassword);
router.post("/laporan-gt/gt", authenticate, roleMiddleware.gt, validateBody(laporanGtSchema), laporanGtController.create);
router.get("/laporan-gt/gt", authenticate, roleMiddleware.gt, laporanGtController.gt);

//LOGIN
router.get("/laporan-gt/detail/:id", authenticate, laporanGtController.detail);
router.get("/laporan-pjgt/detail/:id", authenticate, laporanGtController.detail);
import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js'
import { userController } from '../controllers/userController.js';
import { authController } from '../controllers/authController.js';
import { validateBody } from '../middleware/validationMiddleware.js';
import { roleMiddleware } from '../middleware/roleMiddleware.js';
import { pjgtController } from '../controllers/pjgtController.js';
import { gtController } from '../controllers/gtController.js';
import { tahunAjaranController } from '../controllers/tahunAjaranController.js';

export const router = express.Router();
const pjgtSchema = ["nama", "nikPjgt", "hpPjgt", "namaKm", "hpKm", "alamatMadrasah"];
const gtSchema = ["nim", "nama", "nik", "tempatLahir", "tanggalLahir", "alamat", "hp", "namaAyah", "namaIbu", "namaWali", "hpWali", "asalKelas", "waliKelas"];

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

//PJGT
router.put("/pjgt/change-password/:id", authenticate, roleMiddleware.pjgt, validateBody(["oldPassword", "newPassword", "confirmPassword"]), pjgtController.changePassword);

//GT
router.put("/gt/change-password/:id", authenticate, roleMiddleware.gt, validateBody(["oldPassword", "newPassword", "confirmPassword"]), gtController.changePassword);

//LOGIN
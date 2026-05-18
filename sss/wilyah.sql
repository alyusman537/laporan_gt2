SELECT 
    `desa`.`nama` AS `desa`,
   `Kecamatan`.`nama` AS `Kecamatan`,
    `kota`.`nama` AS `Kabupaten`,
   `provinsi`.`nama` AS `Provinsi`,
   `kodepos`.`kode_poss` AS `Kode_pos`

FROM `desa`
JOIN `Kecamatan`  ON `desa`.`id_kec` = `kecamatan.id`
JOIN `kota`  ON `kecamatan`.`id_kota` = `kota.id`
JOIN `provinsi` ON `kota`.`id_prov` = `provinsi.id`
JOIN `kodepos` ON `desa`.`id` = `kodepos`.`id_desa`;



SELECT 
    d.subdis_name AS Desa,
    k.dis_name AS Kecamatan,
    kb.city_name AS Kabupaten,
    p.prov_name AS Provinsi,
    kp.postal_code AS Kode_Pos
FROM desa d
JOIN kecamatan k ON d.dis_id = k.dis_id
JOIN kabupaten kb ON k.city_id = kb.city_id
JOIN provinsi p ON kb.prov_id = p.prov_id
JOIN kodepos kp ON d.subdis_id = kp.subdis_id;
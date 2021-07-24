create database nysdaq CHARACTER SET utf8 COLLATE utf8_general_ci;

-- nysdaq.TB_STOCK_M definition

CREATE TABLE `TB_STOCK_M` (
  `STOCK_CD` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `STOCK_NM` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `REG_DTTM` datetime DEFAULT NULL,
  `MOD_DTTM` datetime DEFAULT NULL,
  PRIMARY KEY (`STOCK_CD`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- nysdaq.TB_WORK_H definition

CREATE TABLE `TB_WORK_H` (
  `SEQ` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `WORK_TITLE` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `WORK_STATUS` tinyint(3) unsigned DEFAULT NULL,
  `WORK_CONTENT` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `REG_DTTM` datetime DEFAULT NULL,
  `MOD_DTTM` datetime DEFAULT NULL,
  PRIMARY KEY (`SEQ`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

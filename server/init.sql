-- 上门车接车送 数据库初始化脚本

-- 创建数据库
CREATE DATABASE IF NOT EXISTS `intercity_car` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE `intercity_car`;

-- 创建用户表
CREATE TABLE IF NOT EXISTS `users` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `openid` VARCHAR(64) NOT NULL COMMENT '微信OpenID',
  `nickname` VARCHAR(64) DEFAULT '' COMMENT '昵称',
  `avatar` VARCHAR(255) DEFAULT '' COMMENT '头像URL',
  `phone` VARCHAR(20) DEFAULT '' COMMENT '手机号',
  `name` VARCHAR(64) DEFAULT '' COMMENT '姓名',
  `role` VARCHAR(20) NOT NULL DEFAULT 'passenger' COMMENT '角色 passenger/driver',
  `status` SMALLINT NOT NULL DEFAULT 1 COMMENT '状态 1=正常',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_openid` (`openid`),
  KEY `idx_role` (`role`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- 创建订单表
CREATE TABLE IF NOT EXISTS `orders` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '订单ID',
  `order_no` VARCHAR(32) NOT NULL COMMENT '订单编号',
  `passenger_id` VARCHAR(64) NOT NULL COMMENT '乘客OpenID',
  `passenger_name` VARCHAR(64) NOT NULL COMMENT '乘客昵称',
  `passenger_phone` VARCHAR(20) NOT NULL COMMENT '乘客手机号',
  `passenger_avatar` VARCHAR(255) DEFAULT '' COMMENT '乘客头像',
  `driver_id` VARCHAR(64) DEFAULT NULL COMMENT '司机OpenID',
  `driver_name` VARCHAR(64) DEFAULT NULL COMMENT '司机昵称',
  `driver_phone` VARCHAR(20) DEFAULT NULL COMMENT '司机手机号',
  `driver_avatar` VARCHAR(255) DEFAULT NULL COMMENT '司机头像',
  `start_location_name` VARCHAR(128) NOT NULL COMMENT '出发地名称',
  `start_location_address` VARCHAR(255) DEFAULT '' COMMENT '出发地地址',
  `start_location_lat` DECIMAL(10,6) NOT NULL COMMENT '出发地纬度',
  `start_location_lng` DECIMAL(10,6) NOT NULL COMMENT '出发地经度',
  `end_location_name` VARCHAR(128) NOT NULL COMMENT '目的地名称',
  `end_location_address` VARCHAR(255) DEFAULT '' COMMENT '目的地地址',
  `end_location_lat` DECIMAL(10,6) NOT NULL COMMENT '目的地纬度',
  `end_location_lng` DECIMAL(10,6) NOT NULL COMMENT '目的地经度',
  `appointment_time` DATETIME NOT NULL COMMENT '预约时间',
  `passenger_count` TINYINT UNSIGNED NOT NULL DEFAULT 1 COMMENT '乘车人数',
  `remark` VARCHAR(255) DEFAULT '' COMMENT '备注',
  `status` VARCHAR(20) NOT NULL DEFAULT 'pending' COMMENT '订单状态',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `accept_time` DATETIME DEFAULT NULL COMMENT '接单时间',
  `complete_time` DATETIME DEFAULT NULL COMMENT '完成时间',
  `cancel_time` DATETIME DEFAULT NULL COMMENT '取消时间',
  `deleted` TINYINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '是否删除',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_order_no` (`order_no`),
  KEY `idx_passenger` (`passenger_id`, `status`),
  KEY `idx_driver` (`driver_id`, `status`),
  KEY `idx_status_time` (`status`, `appointment_time`),
  KEY `idx_create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='订单表';

CREATE TABLE `cliente` (
  `id_cliente` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_cliente` varchar(50) COLLATE utf8_bin DEFAULT NULL,
  `apellido_cliente` varchar(50) COLLATE utf8_bin DEFAULT NULL,
  `cuit` varchar(11) COLLATE utf8_bin DEFAULT NULL,
  `telefono` varchar(20) COLLATE utf8_bin DEFAULT NULL,
  `direccion` varchar(20) COLLATE utf8_bin DEFAULT NULL,
  `email` varchar(70) COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`id_cliente`),
  UNIQUE KEY `id_cliente_UNIQUE` (`id_cliente`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

CREATE TABLE `empleado` (
  `id_empleado` int(11) NOT NULL,
  `nombre_empleado` varchar(50) COLLATE utf8_bin DEFAULT NULL,
  `cuil` varchar(15) COLLATE utf8_bin DEFAULT NULL,
  `telefono` varchar(20) COLLATE utf8_bin DEFAULT NULL,
  `direccion` varchar(50) COLLATE utf8_bin DEFAULT NULL,
  `email` varchar(70) COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`id_empleado`),
  UNIQUE KEY `id_empleado_UNIQUE` (`id_empleado`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

CREATE TABLE `estado_pedido` (
  `id_estado` int(11) NOT NULL,
  `nombre_estado` varchar(50) COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`id_estado`),
  UNIQUE KEY `id_estado_UNIQUE` (`id_estado`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

CREATE TABLE `negocio` (
  `id_negocio` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_negocio` varchar(50) COLLATE utf8_bin DEFAULT NULL,
  `telefono` varchar(20) COLLATE utf8_bin DEFAULT NULL,
  `direccion` varchar(50) COLLATE utf8_bin DEFAULT NULL,
  `localidad` varchar(50) COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`id_negocio`),
  UNIQUE KEY `id_negocio_UNIQUE` (`id_negocio`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

CREATE TABLE `pedido` (
  `id_pedido` int(11) NOT NULL,
  `fecha_pedido` date DEFAULT NULL,
  `fecha_entrega_estipulada` date DEFAULT NULL,
  `detalle_pedido` varchar(1000) COLLATE utf8_bin DEFAULT NULL,
  `monto` decimal(8,2) DEFAULT NULL,
  `pago_efectuado` bit(1) DEFAULT NULL,
  `cuenta_corriente` bit(1) DEFAULT NULL,
  `seña` decimal(8,2) DEFAULT NULL,
  `id_negocio_entrega` int(11) DEFAULT NULL,
  `id_cliente` int(11) DEFAULT NULL,
  `id_prioridad` int(11) DEFAULT NULL,
  `id_estado` int(11) DEFAULT NULL,
  `id_negocio` int(11) DEFAULT NULL,
  `id_empleado` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_pedido`),
  UNIQUE KEY `id_pedido_UNIQUE` (`id_pedido`),
  KEY `id_cliente_idx` (`id_cliente`),
  KEY `id_prioridad_idx` (`id_prioridad`),
  KEY `id_estado_idx` (`id_estado`),
  KEY `id_negocio_idx` (`id_negocio`),
  KEY `id_empleado_idx` (`id_empleado`),
  KEY `id_negocio_entrega_idx` (`id_negocio_entrega`),
  CONSTRAINT `id_cliente` FOREIGN KEY (`id_cliente`) REFERENCES `cliente` (`id_cliente`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `id_empleado` FOREIGN KEY (`id_empleado`) REFERENCES `empleado` (`id_empleado`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `id_estado` FOREIGN KEY (`id_estado`) REFERENCES `estado_pedido` (`id_estado`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `id_negocio` FOREIGN KEY (`id_negocio`) REFERENCES `negocio` (`id_negocio`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `id_negocio_entrega` FOREIGN KEY (`id_negocio_entrega`) REFERENCES `negocio` (`id_negocio`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `id_prioridad` FOREIGN KEY (`id_prioridad`) REFERENCES `prioridad_pedido` (`id_prioridad`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

CREATE TABLE `prioridad_pedido` (
  `id_prioridad` int(11) NOT NULL,
  `nombre_prioridad` varchar(50) COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`id_prioridad`),
  UNIQUE KEY `id_prioridad_UNIQUE` (`id_prioridad`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

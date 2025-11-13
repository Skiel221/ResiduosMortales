-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 13-11-2025 a las 18:34:49
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `mwdb`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `email` varchar(200) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `email`, `password`) VALUES
(1, 'aaa@gmail.com', 'gareis'),
(2, 'hola@gmail.com', '1234'),
(3, 'karomi.edu@gmail.com', '$2y$10$eq9GIicTXyu1st7mUeXugu4b/xdnUvv1Asw7xu5rHRhR4BLEj/gia'),
(4, 'vava@gmail.com', '$2y$10$E0nY7oMpAn61MtMHKiI0wuHBLRQDYqPvbmzu5/NdszQDKt.V7Qike'),
(5, 'vava2@gmail.com', '$2y$10$rVLIWRuOM/45gj38sJzMPOUmS1yl33wb8Tc5j32QcM.YXhT7QOfI2'),
(6, 'vava3@gmail.com', '$2y$10$MYDNJZdzHxFNknYQucAmeeR22B5e3Loi8gZoSochla.lqVlXBuphC'),
(7, 'vava33@gmail.com', '$2y$10$ki4FHrVYa6Ql.nN1Bd7CO.wLih48FIBnijy.9hEvYsPSngE/eZjmu'),
(8, 'nose@gmail.com', '$2y$10$QnIHAsuBJkB7fR9TXAAftu32egA9YzA3gsZ1EQzxuSgkLpaV0vFMq');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1
-- Время создания: Сен 17 2017 г., 15:54
-- Версия сервера: 10.1.26-MariaDB
-- Версия PHP: 7.0.22

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `diplom`
--

-- --------------------------------------------------------

--
-- Структура таблицы `customers`
--

CREATE TABLE `customers` (
  `id` int(11) NOT NULL,
  `Phone` varchar(20) NOT NULL,
  `Telegram` varchar(20) NOT NULL,
  `Pass` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Структура таблицы `requistions`
--

CREATE TABLE `requistions` (
  `Id` int(11) NOT NULL,
  `Descript` text NOT NULL,
  `adres` varchar(200) NOT NULL,
  `Acception_Date` varchar(100) NOT NULL,
  `Acception_Time` varchar(100) NOT NULL,
  `Finish_Date` varchar(100) NOT NULL,
  `Finish_Time` varchar(100) NOT NULL,
  `MasterId` int(11) NOT NULL,
  `ClientId` int(11) DEFAULT NULL,
  `Progress` int(11) NOT NULL,
  `Remark` text NOT NULL,
  `ClientFIO` varchar(100) NOT NULL,
  `ClientPhone` varchar(20) NOT NULL,
  `ClientTelegram` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `requistions`
--

INSERT INTO `requistions` (`Id`, `Descript`, `adres`, `Acception_Date`, `Acception_Time`, `Finish_Date`, `Finish_Time`, `MasterId`, `ClientId`, `Progress`, `Remark`, `ClientFIO`, `ClientPhone`, `ClientTelegram`) VALUES
(1, 'Задача 1, Задача 3, ', 'asdfasdfasdf', '2017-09-17', '18:37', '2017-09-13', '11:11', 1, 0, 5, 'undefined', 'dfsdfs sdfsdfadf', 'asdfasdf', 'a sdfasdf');

-- --------------------------------------------------------

--
-- Структура таблицы `roles`
--

CREATE TABLE `roles` (
  `Id` int(11) NOT NULL,
  `Title` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `roles`
--

INSERT INTO `roles` (`Id`, `Title`) VALUES
(1, 'Админ'),
(2, 'Мастер'),
(3, 'Клиент');

-- --------------------------------------------------------

--
-- Структура таблицы `services`
--

CREATE TABLE `services` (
  `Id` int(11) NOT NULL,
  `Title` varchar(50) NOT NULL,
  `Price` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `services`
--

INSERT INTO `services` (`Id`, `Title`, `Price`) VALUES
(1, 'Задача 1', '10'),
(2, 'Задача 2', '20'),
(3, 'Задача 3', '30');

-- --------------------------------------------------------

--
-- Структура таблицы `status`
--

CREATE TABLE `status` (
  `Id` int(11) NOT NULL,
  `Title` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `status`
--

INSERT INTO `status` (`Id`, `Title`) VALUES
(1, 'Обработка'),
(2, 'Движение'),
(3, 'Выполнение'),
(4, 'Подтверждение'),
(5, 'Готово');

-- --------------------------------------------------------

--
-- Структура таблицы `users`
--

CREATE TABLE `users` (
  `Id` int(11) NOT NULL,
  `UserLogin` varchar(20) NOT NULL,
  `UserFIO` varchar(50) NOT NULL,
  `UserRole` int(11) NOT NULL,
  `UserTelegram` varchar(20) NOT NULL,
  `UserPassword` varchar(20) NOT NULL,
  `logged` int(11) DEFAULT NULL,
  `phone` varchar(50) NOT NULL,
  `procent` varchar(20) NOT NULL,
  `Remark` text NOT NULL,
  `Sum` varchar(20) NOT NULL,
  `Percent` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `users`
--

INSERT INTO `users` (`Id`, `UserLogin`, `UserFIO`, `UserRole`, `UserTelegram`, `UserPassword`, `logged`, `phone`, `procent`, `Remark`, `Sum`, `Percent`) VALUES
(1, 'Admin', 'Админ Админ Админович', 1, '', '123', 0, '', '', '', '', NULL);

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `requistions`
--
ALTER TABLE `requistions`
  ADD PRIMARY KEY (`Id`);

--
-- Индексы таблицы `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`Id`);

--
-- Индексы таблицы `services`
--
ALTER TABLE `services`
  ADD PRIMARY KEY (`Id`);

--
-- Индексы таблицы `status`
--
ALTER TABLE `status`
  ADD PRIMARY KEY (`Id`);

--
-- Индексы таблицы `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`Id`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `customers`
--
ALTER TABLE `customers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `requistions`
--
ALTER TABLE `requistions`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT для таблицы `roles`
--
ALTER TABLE `roles`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT для таблицы `services`
--
ALTER TABLE `services`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT для таблицы `status`
--
ALTER TABLE `status`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT для таблицы `users`
--
ALTER TABLE `users`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

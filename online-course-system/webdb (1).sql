-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: db:3306
-- Generation Time: Mar 20, 2026 at 07:35 AM
-- Server version: 8.0.45
-- PHP Version: 8.3.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `webdb`
--

-- --------------------------------------------------------

--
-- Table structure for table `courses`
--

CREATE TABLE `courses` (
  `id` int NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text,
  `instructor_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `courses`
--

INSERT INTO `courses` (`id`, `title`, `description`, `instructor_id`) VALUES
(3, 'Fullstack Website Practice', 'Basic Learning Fullstack development', 5),
(20, 'English Basic Practice', 'Practicing a basic word and sentences to be used in daily life. ', 5),
(29, 'Test', 'testtt', 35);

-- --------------------------------------------------------

--
-- Table structure for table `enrollments`
--

CREATE TABLE `enrollments` (
  `id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `course_id` int DEFAULT NULL,
  `progress` int DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `enrollments`
--

INSERT INTO `enrollments` (`id`, `user_id`, `course_id`, `progress`) VALUES
(1, 3, 3, 0),
(44, 4, 3, 0),
(45, 4, 4, 0),
(46, 3, 4, 0),
(47, 5, 3, 0),
(48, 6, 3, 0),
(49, 6, 6, 0),
(50, 7, 3, 0),
(51, 7, 4, 0),
(52, 8, 3, 0),
(67, 8, 4, 0),
(68, 8, 5, 0),
(69, 8, 6, 0),
(70, 9, 3, 0),
(71, 9, 4, 0),
(72, 9, 20, 0),
(73, 8, 20, 0),
(74, 14, 3, 0),
(75, 15, 3, 0),
(76, 16, 3, 0),
(77, 16, 20, 0),
(78, 16, 24, 0),
(79, 9, 24, 0),
(80, 17, 3, 0),
(81, 17, 20, 0),
(82, 18, 3, 0),
(83, 19, 3, 0),
(84, 19, 20, 0),
(85, 25, 3, 0),
(86, 26, 3, 0),
(87, 28, 3, 0),
(88, 30, 3, 0),
(89, 31, 28, 0),
(90, 32, 20, 0),
(91, 33, 3, 0),
(92, 33, 20, 0),
(93, 34, 3, 0),
(94, 5, 20, 0),
(95, 5, 29, 0),
(96, 39, 20, 0),
(97, 39, 3, 0),
(98, 40, 3, 0);

-- --------------------------------------------------------

--
-- Table structure for table `lessons`
--

CREATE TABLE `lessons` (
  `id` int NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `video_url` text,
  `course_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `lessons`
--

INSERT INTO `lessons` (`id`, `title`, `video_url`, `course_id`) VALUES
(1, 'Lesson 1', 'https://youtu.be/alsiVNdpm9g?si=9ZLOyGqnEYvsg3SA', 3),
(2, 'Lesson 2', 'https://youtu.be/dPMk6_HTBq8?si=GiwdhbsAsmOENDYD', 3),
(3, 'Lesson 3', 'https://youtu.be/Sxxw3qtb3_g?si=FvD8YlX4hDAThjvI', 3),
(20, 'Lesson 2', 'https://youtu.be/meg686L-nLs?si=wHKYhagVGqZsiaBK', 28),
(23, 'Lesson 1 : English in daily life.', 'https://youtu.be/ecF1y2bI2T4?si=0Xjyb5bkTr6Hhpc6', 20),
(24, 'Lesson 2: English conversation.', 'https://youtu.be/henIVlCPVIY?si=_4NWrdYHn-EBZjFf', 20);

-- --------------------------------------------------------

--
-- Table structure for table `lesson_progress`
--

CREATE TABLE `lesson_progress` (
  `id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `course_id` int DEFAULT NULL,
  `lesson_id` int DEFAULT NULL,
  `is_completed` tinyint(1) DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `lesson_progress`
--

INSERT INTO `lesson_progress` (`id`, `user_id`, `course_id`, `lesson_id`, `is_completed`) VALUES
(1, 6, 3, 1, 1),
(4, 6, 3, 2, 1),
(9, 7, 3, 1, 1),
(10, 7, 3, 2, 1),
(11, 6, 3, 3, 1),
(12, 6, 3, 4, 1),
(13, 9, 3, 1, 1),
(14, 14, 3, 1, 1),
(15, 14, 3, 2, 1),
(16, 16, 3, 1, 1),
(17, 9, 3, 2, 1),
(18, 9, 3, 3, 1),
(19, 9, 3, 4, 1),
(20, 8, 3, 1, 1),
(21, 8, 3, 2, 1),
(22, 8, 3, 3, 1),
(23, 8, 3, 4, 1),
(24, 5, 3, 1, 1),
(25, 17, 3, 1, 1),
(26, 17, 3, 2, 1),
(27, 17, 3, 3, 1),
(28, 25, 3, 1, 1),
(30, 25, 3, 2, 1),
(31, 25, 3, 3, 1),
(32, 26, 3, 1, 1),
(33, 30, 3, 1, 1),
(34, 30, 3, 2, 1),
(35, 30, 3, 3, 1),
(36, 5, 3, 2, 1),
(37, 5, 3, 3, 1),
(38, 33, 3, 1, 1),
(39, 33, 3, 2, 1),
(40, 33, 3, 3, 1),
(41, 34, 3, 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `quizzes`
--

CREATE TABLE `quizzes` (
  `id` int NOT NULL,
  `question` text,
  `option1` varchar(255) DEFAULT NULL,
  `option2` varchar(255) DEFAULT NULL,
  `option3` varchar(255) DEFAULT NULL,
  `option4` varchar(255) DEFAULT NULL,
  `answer` int DEFAULT NULL,
  `lesson_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `quizzes`
--

INSERT INTO `quizzes` (`id`, `question`, `option1`, `option2`, `option3`, `option4`, `answer`, `lesson_id`) VALUES
(1, '1 + 1 ได้เท่ากับเท่าไหร่?', '1', '2', '3', '4', 2, 3),
(2, 'What is 2 in English?', 'one', 'to', 'tee', 'two', 4, 1),
(3, 'what is ur name', 'w', 'tar', 'v', 'b', 2, 1),
(4, 'what is the first letter of 8?', 'e', 'a', 'i', 'o', 1, 1),
(5, 'dasdasda', '1', '2', '3', '4', 1, 2),
(7, 'new test', 'n', 'w', 'r', 'v', 4, 2),
(9, 'fdsfs', '1', '2', '3', '4', 2, 20),
(11, 'What is opposite meaning of the word \"True\" ?', 'Fall', 'Fasle', 'False', 'Fah', 3, 23),
(12, 'What is meaning of the word \"Ball\" ?', 'Something that is a sphere shape.', 'Something that is a square shape.', 'Something that is a triangle shape.', 'Something that is a polygon shape.', 1, 23),
(13, 'What is your name?', 'My is name Tar.', 'Tar name my is.', 'My name is Sun.', 'Name is my Sun.', 3, 24),
(14, 'How old are you?', 'I\'m fine.', 'I\'m ok.', 'I\'m good', 'I\'m 20 years old.', 4, 24);

-- --------------------------------------------------------

--
-- Table structure for table `quiz_progress`
--

CREATE TABLE `quiz_progress` (
  `id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `course_id` int DEFAULT NULL,
  `lesson_id` int DEFAULT NULL,
  `is_passed` tinyint(1) DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `quiz_progress`
--

INSERT INTO `quiz_progress` (`id`, `user_id`, `course_id`, `lesson_id`, `is_passed`) VALUES
(1, 6, 3, 3, 1),
(3, 6, 3, 1, 1),
(4, 9, 3, 1, 1),
(5, 14, 3, 1, 1),
(6, 17, 3, 1, 1),
(7, 17, 3, 3, 1),
(8, 17, 3, 2, 1),
(9, 25, 3, 1, 1),
(10, 25, 3, 3, 1),
(11, 30, 3, 1, 1),
(12, 30, 3, 2, 1),
(13, 30, 3, 3, 1),
(14, 5, 3, 1, 1),
(15, 33, 3, 1, 1),
(16, 33, 3, 2, 1),
(17, 33, 3, 3, 1),
(18, 34, 3, 1, 1),
(19, 5, 20, 23, 1),
(20, 5, 20, 24, 1);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL,
  `role` enum('student','instructor') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`) VALUES
(5, 'Pisit', 'pisit@gmail.com', '12345', 'instructor'),
(33, 'Login', 'Login@gmail.com', 'asdft123', 'instructor'),
(34, 'cer', 'cer@gmail.com', '123456', 'student'),
(35, 'Make', 'make@gmail.com', '123456', 'instructor'),
(36, 'dasda', 'dsa@gmail.coi', '123456', 'student'),
(37, 'das', 'dasdas@gmail.c', '123456', 'student'),
(38, 'dasdad', 'asdasda@hotmail.com', 'dsadad', 'student'),
(39, 'God', 'God@gmail.com', '123456', 'student'),
(40, 'Dt', 'Dt@gmail.com', '123456', 'student');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `courses`
--
ALTER TABLE `courses`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `enrollments`
--
ALTER TABLE `enrollments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `lessons`
--
ALTER TABLE `lessons`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `lesson_progress`
--
ALTER TABLE `lesson_progress`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`,`lesson_id`);

--
-- Indexes for table `quizzes`
--
ALTER TABLE `quizzes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `quiz_progress`
--
ALTER TABLE `quiz_progress`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`,`lesson_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `courses`
--
ALTER TABLE `courses`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `enrollments`
--
ALTER TABLE `enrollments`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=99;

--
-- AUTO_INCREMENT for table `lessons`
--
ALTER TABLE `lessons`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `lesson_progress`
--
ALTER TABLE `lesson_progress`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT for table `quizzes`
--
ALTER TABLE `quizzes`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `quiz_progress`
--
ALTER TABLE `quiz_progress`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

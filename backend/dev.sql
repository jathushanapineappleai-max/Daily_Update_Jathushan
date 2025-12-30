-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 24, 2025 at 12:46 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `pai_erp_dev`
--

-- --------------------------------------------------------

--
-- Table structure for table `asset`
--

CREATE TABLE `asset` (
  `id` int(11) NOT NULL,
  `asset_tag` varchar(50) NOT NULL,
  `name` varchar(150) NOT NULL,
  `category` varchar(100) DEFAULT NULL,
  `purchase_date` date DEFAULT NULL,
  `cost` decimal(12,2) DEFAULT NULL,
  `assigned_to` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `attendance_record`
--

CREATE TABLE `attendance_record` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `clock_in` datetime DEFAULT NULL,
  `clock_out` datetime DEFAULT NULL,
  `method` enum('biometric','manual','mobile') DEFAULT 'manual',
  `is_spoof_detected` tinyint(1) DEFAULT 0,
  `date` date NOT NULL,
  `break_start` datetime DEFAULT NULL,
  `total_break_duration` int(11) DEFAULT 0,
  `working_hours` float DEFAULT 0,
  `status` enum('on_time','late','early_departure','absent') DEFAULT 'absent',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `audit_log`
--

CREATE TABLE `audit_log` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `action` varchar(100) NOT NULL,
  `table_name` varchar(50) DEFAULT NULL,
  `record_id` int(11) DEFAULT NULL,
  `timestamp` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `away_log`
--

CREATE TABLE `away_log` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `month` int(11) NOT NULL,
  `year` int(11) NOT NULL,
  `gross_salary` decimal(12,2) NOT NULL,
  `net_salary` decimal(12,2) NOT NULL,
  `status` enum('generated','paid','held','cancelled') DEFAULT 'generated',
  `generated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `client`
--

CREATE TABLE `client` (
  `id` int(11) NOT NULL,
  `company_name` varchar(150) NOT NULL,
  `contact_person` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `defect`
--

CREATE TABLE `defect` (
  `id` int(11) NOT NULL,
  `title` varchar(200) NOT NULL,
  `description` text DEFAULT NULL,
  `reporter_id` int(11) NOT NULL,
  `assignee_id` int(11) DEFAULT NULL,
  `project_id` int(11) DEFAULT NULL,
  `priority` enum('low','medium','high','critical') DEFAULT 'medium',
  `status` enum('open','in_progress','resolved','closed','reopened') DEFAULT 'open',
  `reported_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `defect_comment`
--

CREATE TABLE `defect_comment` (
  `id` int(11) NOT NULL,
  `defect_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `comment` text NOT NULL,
  `attachment` varchar(255) DEFAULT NULL,
  `commented_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `department`
--

CREATE TABLE `department` (
  `id` int(11) NOT NULL,
  `dept_name` varchar(100) NOT NULL,
  `hod_user_id` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `documents`
--

CREATE TABLE `documents` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `document_type` enum('nic','birth_certificate','educational_certificate','transcript') NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `uploaded_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `documents`
--

INSERT INTO `documents` (`id`, `user_id`, `document_type`, `file_path`, `uploaded_at`) VALUES
(1, 18, 'nic', 'C:\\Users\\JATHU\\Documents\\PAI ERP\\backend\\uploads\\document-1765781433616-818880523.pdf', '2025-12-15 12:20:33'),
(2, 11, 'nic', 'C:\\Users\\JATHU\\Documents\\PAI ERP\\backend\\uploads\\document-1765860849520-215260176.pdf', '2025-12-16 10:24:09'),
(3, 11, 'birth_certificate', 'C:\\Users\\JATHU\\Documents\\PAI ERP\\backend\\uploads\\document-1765860920068-996509747.pdf', '2025-12-16 10:25:20'),
(4, 11, 'birth_certificate', 'C:\\Users\\JATHU\\Documents\\PAI ERP\\backend\\uploads\\document-1765861275350-889107128.pdf', '2025-12-16 10:31:15'),
(5, 18, 'birth_certificate', 'C:\\Users\\JATHU\\Documents\\PAI ERP\\backend\\uploads\\document-1765863536923-48706659.pdf', '2025-12-16 11:08:56'),
(6, 19, 'nic', 'C:\\Users\\nisho\\Downloads\\PAI_ERP_DEV\\Daily_Update_Jathushan\\backend\\uploads\\document-1766407542406-303521853.pdf', '2025-12-22 18:15:42'),
(7, 19, 'birth_certificate', 'C:\\Users\\nisho\\Downloads\\PAI_ERP_DEV\\Daily_Update_Jathushan\\backend\\uploads\\document-1766407542743-711193393.pdf', '2025-12-22 18:15:42'),
(8, 19, 'educational_certificate', 'C:\\Users\\nisho\\Downloads\\PAI_ERP_DEV\\Daily_Update_Jathushan\\backend\\uploads\\document-1766407542818-974680782.pdf', '2025-12-22 18:15:42'),
(9, 19, 'transcript', 'C:\\Users\\nisho\\Downloads\\PAI_ERP_DEV\\Daily_Update_Jathushan\\backend\\uploads\\document-1766407542907-121784963.pdf', '2025-12-22 18:15:42'),
(10, 19, 'nic', 'C:\\Users\\nisho\\Downloads\\PAI_ERP_DEV\\Daily_Update_Jathushan\\backend\\uploads\\document-1766407600871-575161512.pdf', '2025-12-22 18:16:40'),
(11, 19, 'birth_certificate', 'C:\\Users\\nisho\\Downloads\\PAI_ERP_DEV\\Daily_Update_Jathushan\\backend\\uploads\\document-1766407600956-360820510.pdf', '2025-12-22 18:16:40'),
(12, 19, 'educational_certificate', 'C:\\Users\\nisho\\Downloads\\PAI_ERP_DEV\\Daily_Update_Jathushan\\backend\\uploads\\document-1766407601004-794709684.pdf', '2025-12-22 18:16:41'),
(13, 19, 'transcript', 'C:\\Users\\nisho\\Downloads\\PAI_ERP_DEV\\Daily_Update_Jathushan\\backend\\uploads\\document-1766407601066-11129211.pdf', '2025-12-22 18:16:41'),
(14, 19, 'nic', 'C:\\Users\\nisho\\Downloads\\PAI_ERP_DEV\\Daily_Update_Jathushan\\backend\\uploads\\document-1766407746355-862835775.pdf', '2025-12-22 18:19:06'),
(15, 19, 'birth_certificate', 'C:\\Users\\nisho\\Downloads\\PAI_ERP_DEV\\Daily_Update_Jathushan\\backend\\uploads\\document-1766407746558-137927412.pdf', '2025-12-22 18:19:06'),
(16, 19, 'educational_certificate', 'C:\\Users\\nisho\\Downloads\\PAI_ERP_DEV\\Daily_Update_Jathushan\\backend\\uploads\\document-1766407746760-425106475.pdf', '2025-12-22 18:19:06'),
(17, 19, 'transcript', 'C:\\Users\\nisho\\Downloads\\PAI_ERP_DEV\\Daily_Update_Jathushan\\backend\\uploads\\document-1766407746796-925215082.pdf', '2025-12-22 18:19:06'),
(18, 19, 'nic', 'C:\\Users\\nisho\\Downloads\\PAI_ERP_DEV\\Daily_Update_Jathushan\\backend\\uploads\\document-1766407817818-714296009.pdf', '2025-12-22 18:20:17'),
(19, 19, 'birth_certificate', 'C:\\Users\\nisho\\Downloads\\PAI_ERP_DEV\\Daily_Update_Jathushan\\backend\\uploads\\document-1766407817971-499997633.pdf', '2025-12-22 18:20:17'),
(20, 19, 'educational_certificate', 'C:\\Users\\nisho\\Downloads\\PAI_ERP_DEV\\Daily_Update_Jathushan\\backend\\uploads\\document-1766407818021-160244331.pdf', '2025-12-22 18:20:18'),
(21, 19, 'transcript', 'C:\\Users\\nisho\\Downloads\\PAI_ERP_DEV\\Daily_Update_Jathushan\\backend\\uploads\\document-1766407818076-480683825.pdf', '2025-12-22 18:20:18'),
(22, 20, 'nic', 'C:\\Users\\nisho\\Downloads\\PAI_ERP_DEV\\Daily_Update_Jathushan\\backend\\uploads\\document-1766409695970-389806413.pdf', '2025-12-22 18:51:36'),
(23, 20, 'birth_certificate', 'C:\\Users\\nisho\\Downloads\\PAI_ERP_DEV\\Daily_Update_Jathushan\\backend\\uploads\\document-1766409696127-915963524.pdf', '2025-12-22 18:51:36'),
(24, 20, 'educational_certificate', 'C:\\Users\\nisho\\Downloads\\PAI_ERP_DEV\\Daily_Update_Jathushan\\backend\\uploads\\document-1766409696205-137004217.pdf', '2025-12-22 18:51:36'),
(25, 20, 'transcript', 'C:\\Users\\nisho\\Downloads\\PAI_ERP_DEV\\Daily_Update_Jathushan\\backend\\uploads\\document-1766409696294-667708682.pdf', '2025-12-22 18:51:36'),
(26, 21, 'nic', 'C:\\Users\\nisho\\Downloads\\PAI_ERP_DEV\\Daily_Update_Jathushan\\backend\\uploads\\document-1766417674253-772144592.pdf', '2025-12-22 21:04:34'),
(27, 21, 'birth_certificate', 'C:\\Users\\nisho\\Downloads\\PAI_ERP_DEV\\Daily_Update_Jathushan\\backend\\uploads\\document-1766417674461-794295149.pdf', '2025-12-22 21:04:34'),
(28, 21, 'educational_certificate', 'C:\\Users\\nisho\\Downloads\\PAI_ERP_DEV\\Daily_Update_Jathushan\\backend\\uploads\\document-1766417674493-657497364.pdf', '2025-12-22 21:04:34'),
(29, 21, 'transcript', 'C:\\Users\\nisho\\Downloads\\PAI_ERP_DEV\\Daily_Update_Jathushan\\backend\\uploads\\document-1766417674546-438228855.pdf', '2025-12-22 21:04:34'),
(30, 22, 'nic', 'C:\\Users\\nisho\\Downloads\\PAI_ERP_DEV\\Daily_Update_Jathushan\\backend\\uploads\\document-1766576478694-727805462.pdf', '2025-12-24 17:11:18'),
(31, 22, 'birth_certificate', 'C:\\Users\\nisho\\Downloads\\PAI_ERP_DEV\\Daily_Update_Jathushan\\backend\\uploads\\document-1766576479046-683958081.pdf', '2025-12-24 17:11:19'),
(32, 22, 'educational_certificate', 'C:\\Users\\nisho\\Downloads\\PAI_ERP_DEV\\Daily_Update_Jathushan\\backend\\uploads\\document-1766576479126-417745173.pdf', '2025-12-24 17:11:19'),
(33, 22, 'transcript', 'C:\\Users\\nisho\\Downloads\\PAI_ERP_DEV\\Daily_Update_Jathushan\\backend\\uploads\\document-1766576479201-434301456.pdf', '2025-12-24 17:11:19'),
(34, 22, 'nic', 'C:\\Users\\nisho\\Downloads\\PAI_ERP_DEV\\Daily_Update_Jathushan\\backend\\uploads\\document-1766576492850-281488216.pdf', '2025-12-24 17:11:32'),
(35, 22, 'birth_certificate', 'C:\\Users\\nisho\\Downloads\\PAI_ERP_DEV\\Daily_Update_Jathushan\\backend\\uploads\\document-1766576492958-158002026.pdf', '2025-12-24 17:11:32'),
(36, 22, 'educational_certificate', 'C:\\Users\\nisho\\Downloads\\PAI_ERP_DEV\\Daily_Update_Jathushan\\backend\\uploads\\document-1766576493020-900078955.pdf', '2025-12-24 17:11:33'),
(37, 22, 'transcript', 'C:\\Users\\nisho\\Downloads\\PAI_ERP_DEV\\Daily_Update_Jathushan\\backend\\uploads\\document-1766576493104-916588562.pdf', '2025-12-24 17:11:33'),
(38, 22, 'nic', 'C:\\Users\\nisho\\Downloads\\PAI_ERP_DEV\\Daily_Update_Jathushan\\backend\\uploads\\document-1766576518773-701967805.pdf', '2025-12-24 17:11:58'),
(39, 22, 'birth_certificate', 'C:\\Users\\nisho\\Downloads\\PAI_ERP_DEV\\Daily_Update_Jathushan\\backend\\uploads\\document-1766576518953-467978619.pdf', '2025-12-24 17:11:58'),
(40, 22, 'educational_certificate', 'C:\\Users\\nisho\\Downloads\\PAI_ERP_DEV\\Daily_Update_Jathushan\\backend\\uploads\\document-1766576519033-941266800.pdf', '2025-12-24 17:11:59'),
(41, 22, 'transcript', 'C:\\Users\\nisho\\Downloads\\PAI_ERP_DEV\\Daily_Update_Jathushan\\backend\\uploads\\document-1766576519101-453686589.pdf', '2025-12-24 17:11:59'),
(42, 22, 'nic', 'C:\\Users\\nisho\\Downloads\\PAI_ERP_DEV\\Daily_Update_Jathushan\\backend\\uploads\\document-1766576532255-293685056.pdf', '2025-12-24 17:12:12'),
(43, 22, 'birth_certificate', 'C:\\Users\\nisho\\Downloads\\PAI_ERP_DEV\\Daily_Update_Jathushan\\backend\\uploads\\document-1766576532408-99720258.pdf', '2025-12-24 17:12:12'),
(44, 22, 'educational_certificate', 'C:\\Users\\nisho\\Downloads\\PAI_ERP_DEV\\Daily_Update_Jathushan\\backend\\uploads\\document-1766576532453-734902493.pdf', '2025-12-24 17:12:12'),
(45, 22, 'transcript', 'C:\\Users\\nisho\\Downloads\\PAI_ERP_DEV\\Daily_Update_Jathushan\\backend\\uploads\\document-1766576532501-786150268.pdf', '2025-12-24 17:12:12');

-- --------------------------------------------------------

--
-- Table structure for table `employee_detail`
--

CREATE TABLE `employee_detail` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `joined_date` date DEFAULT NULL,
  `image_path` varchar(255) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `gender` enum('male','female','other') DEFAULT NULL,
  `address` text DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `employee_detail`
--

INSERT INTO `employee_detail` (`id`, `user_id`, `joined_date`, `image_path`, `dob`, `gender`, `address`, `phone`) VALUES
(1, 14, NULL, NULL, '1988-11-05', 'male', '321 Elm St, New City, Country', '+1777888999'),
(2, 15, NULL, NULL, '1990-04-18', 'female', '654 Maple St, Old City, Country', '+1333444555'),
(3, 16, NULL, NULL, '1987-09-30', 'male', '987 Cedar St, Big City, Country', '+1222333444'),
(4, 17, '2023-12-01', NULL, '1991-12-10', 'female', '147 Birch St, Small City, Country', '+1444555666'),
(5, 18, '2023-01-15', NULL, '1990-01-01', 'male', '456 New Street, City, Country', '+1234567890'),
(6, 11, NULL, 'C:\\Users\\JATHU\\Documents\\PAI ERP\\backend\\uploads\\image-1765865578692-452933384.png', NULL, NULL, NULL, NULL),
(7, 10, NULL, 'C:\\Users\\JATHU\\Documents\\PAI ERP\\backend\\uploads\\image-1765865653759-905053210.png', NULL, NULL, NULL, NULL),
(8, 19, NULL, NULL, '2025-12-03', 'male', 'no 56/20 temple lane navanthurai jaffna', '+94764108354'),
(9, 20, NULL, NULL, '2025-12-25', 'male', ' jaffna', '+94764104578'),
(10, 21, NULL, NULL, '2025-12-05', 'male', 'jaffna', '0469713594'),
(11, 22, NULL, NULL, '2002-06-05', 'male', 'jaffna', '0714589362');

-- --------------------------------------------------------

--
-- Table structure for table `employee_history`
--

CREATE TABLE `employee_history` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `type` enum('education','experience') NOT NULL,
  `qualification` varchar(100) DEFAULT NULL,
  `institution` varchar(150) DEFAULT NULL,
  `year_of_completion` int(11) DEFAULT NULL,
  `position` varchar(100) DEFAULT NULL,
  `company_name` varchar(150) DEFAULT NULL,
  `years_of_experience` decimal(4,1) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `created_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `employee_history`
--

INSERT INTO `employee_history` (`id`, `user_id`, `type`, `qualification`, `institution`, `year_of_completion`, `position`, `company_name`, `years_of_experience`, `start_date`, `end_date`, `created_at`) VALUES
(1, 14, 'education', 'Bachelor of Engineering', 'Engineering College', 2012, NULL, NULL, NULL, NULL, NULL, '2025-12-12 16:19:52'),
(2, 14, 'experience', NULL, NULL, NULL, 'Project Manager', 'Global Solutions Inc.', 10.3, NULL, NULL, '2025-12-12 16:19:52'),
(3, 15, 'education', 'Master of Arts in Marketing', 'Marketing University', 2016, NULL, NULL, NULL, NULL, NULL, '2025-12-12 16:22:11'),
(4, 15, 'experience', NULL, NULL, NULL, 'Marketing Specialist', 'Brand Solutions Co.', 7.1, NULL, NULL, '2025-12-12 16:22:11'),
(5, 16, 'education', 'PhD in Physics', 'Science University', 2014, NULL, NULL, NULL, NULL, NULL, '2025-12-12 16:30:30'),
(6, 16, 'experience', NULL, NULL, NULL, 'Research Scientist', 'Research Labs Inc.', 9.5, NULL, NULL, '2025-12-12 16:30:30'),
(7, 17, 'education', 'Bachelor of Commerce', 'Business College', 2013, NULL, NULL, NULL, NULL, NULL, '2025-12-12 16:43:40'),
(8, 17, 'experience', NULL, NULL, NULL, 'Financial Analyst', 'Finance Corp', 11.2, NULL, NULL, '2025-12-12 16:43:40'),
(9, 18, 'education', 'Bachelor of Science in Computer Science', 'University of Technology', 2015, NULL, NULL, NULL, NULL, NULL, '2025-12-15 10:52:29'),
(10, 18, 'experience', NULL, NULL, NULL, 'Software Engineer', 'Tech Solutions Inc.', 5.5, NULL, NULL, '2025-12-15 11:01:37'),
(11, 20, 'education', 'Diploma', 'esoft', 2020, NULL, NULL, NULL, NULL, NULL, '2025-12-22 18:50:51'),
(12, 22, 'education', 'Bachelor\'s Degree', 'IIT', 2024, NULL, NULL, NULL, NULL, NULL, '2025-12-24 17:09:36');

-- --------------------------------------------------------

--
-- Table structure for table `expense`
--

CREATE TABLE `expense` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `category` varchar(100) DEFAULT NULL,
  `expense_date` date NOT NULL,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `receipt_path` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `leave_balance`
--

CREATE TABLE `leave_balance` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `leave_type_id` int(11) NOT NULL,
  `year` int(11) NOT NULL,
  `leave_taken` decimal(4,1) DEFAULT 0.0,
  `leave_balance` decimal(4,1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `leave_request`
--

CREATE TABLE `leave_request` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `leave_type_id` int(11) NOT NULL,
  `leave_mode` enum('full_day','half_day','hours_permission') NOT NULL,
  `number_of_days` decimal(4,1) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date DEFAULT NULL,
  `start_time` time DEFAULT NULL,
  `end_time` time DEFAULT NULL,
  `status` enum('pending','approved','rejected','cancelled') DEFAULT 'pending',
  `approved_by` int(11) DEFAULT NULL,
  `requested_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `leave_type`
--

CREATE TABLE `leave_type` (
  `id` int(11) NOT NULL,
  `leave_name` varchar(50) NOT NULL,
  `day_count` int(11) NOT NULL DEFAULT 0,
  `requires_proof` tinyint(1) DEFAULT 0,
  `leave_type` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `leave_type`
--

INSERT INTO `leave_type` (`id`, `leave_name`, `day_count`, `requires_proof`, `leave_type`) VALUES
(1, 'Annual Leave', 14, 0, 'annual'),
(2, 'Sick Leave', 14, 1, 'sick'),
(3, 'Casual Leave', 7, 0, 'casual'),
(4, 'Maternity Leave', 90, 1, 'maternity'),
(5, 'Paternity Leave', 14, 1, 'paternity');

-- --------------------------------------------------------

--
-- Table structure for table `management_roles`
--

CREATE TABLE `management_roles` (
  `id` int(11) NOT NULL,
  `role_name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `notification`
--

CREATE TABLE `notification` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `title` varchar(150) NOT NULL,
  `message` text NOT NULL,
  `type` varchar(50) DEFAULT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `offer_letter_form`
--

CREATE TABLE `offer_letter_form` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `letter_date` date NOT NULL,
  `generated_by` int(11) NOT NULL,
  `generated_at` datetime DEFAULT NULL,
  `file_path` varchar(255) NOT NULL,
  `status` enum('draft','sent','cancelled') DEFAULT 'draft'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `offer_letter_template`
--

CREATE TABLE `offer_letter_template` (
  `id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL,
  `department_id` int(11) NOT NULL,
  `responsibilities` text DEFAULT NULL,
  `letter_date_placeholder` varchar(50) DEFAULT '{letter_date}',
  `date_of_joining_placeholder` varchar(50) DEFAULT '{date_of_joining}',
  `reporting_manager_placeholder` varchar(50) DEFAULT '{reporting_manager}',
  `reporting_manager_email_placeholder` varchar(50) DEFAULT '{reporting_manager_email}',
  `generated_by_placeholder` varchar(50) DEFAULT '{generated_by}',
  `file_path_template` varchar(255) DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payroll`
--

CREATE TABLE `payroll` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `month` int(11) NOT NULL,
  `year` int(11) NOT NULL,
  `gross_salary` decimal(12,2) NOT NULL,
  `net_salary` decimal(12,2) NOT NULL,
  `status` enum('generated','paid','held') DEFAULT 'generated',
  `generated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `permission`
--

CREATE TABLE `permission` (
  `id` int(11) NOT NULL,
  `module` varchar(50) NOT NULL,
  `action` varchar(50) NOT NULL,
  `level` enum('own','team','department','all') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `project`
--

CREATE TABLE `project` (
  `id` int(11) NOT NULL,
  `project_name` varchar(150) NOT NULL,
  `description` text DEFAULT NULL,
  `client_id` int(11) DEFAULT NULL,
  `project_type` enum('internal','client') NOT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `status` enum('planning','active','on_hold','completed','cancelled') DEFAULT 'active',
  `pm_user_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `project_allocation`
--

CREATE TABLE `project_allocation` (
  `id` int(11) NOT NULL,
  `project_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `role_in_project` varchar(100) DEFAULT NULL,
  `allocated_hours` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `role_name` varchar(50) NOT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `role_name`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Administrator', 'active', '2025-01-01 00:00:00', '2025-01-01 00:00:00'),
(2, 'Chief Executive Officer', 'active', '2025-01-01 00:00:00', '2025-01-01 00:00:00'),
(3, 'Chief Technical Officer', 'active', '2025-01-01 00:00:00', '2025-01-01 00:00:00'),
(4, 'HR Manager', 'active', '2025-01-01 00:00:00', '2025-01-01 00:00:00'),
(5, 'Intern', 'active', '2025-01-01 00:00:00', '2025-01-01 00:00:00'),
(6, 'Associate', 'active', '2025-01-01 00:00:00', '2025-01-01 00:00:00'),
(7, 'Software Engineer', 'active', '2025-01-01 00:00:00', '2025-01-01 00:00:00'),
(8, 'Senior Engineer', 'inactive', '2025-01-01 00:00:00', '2025-01-01 00:00:00'),
(9, 'Team Lead', 'active', '2025-01-01 00:00:00', '2025-01-01 00:00:00'),
(10, 'Super Administrator', 'active', '2025-01-01 00:00:00', '2025-01-01 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `role_assignment_log`
--

CREATE TABLE `role_assignment_log` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `old_role_id` int(11) DEFAULT NULL,
  `new_role_id` int(11) NOT NULL,
  `changed_by` int(11) NOT NULL,
  `changed_at` datetime DEFAULT NULL,
  `reason` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `role_department`
--

CREATE TABLE `role_department` (
  `role_id` int(11) NOT NULL,
  `department_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `role_permission`
--

CREATE TABLE `role_permission` (
  `role_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `role_rule`
--

CREATE TABLE `role_rule` (
  `role_id` int(11) NOT NULL,
  `rule_category_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `rule`
--

CREATE TABLE `rule` (
  `id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `rule_text` text NOT NULL,
  `status` enum('active','halt','inactive') DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `rule`
--

INSERT INTO `rule` (`id`, `category_id`, `rule_text`, `status`) VALUES
(1, 1, 'Employees must check in before 9:00 AM', 'active'),
(2, 1, 'Late arrivals exceeding 3 times per month will result in salary deduction', 'active'),
(3, 1, 'Employees must check out after completing 8 hours of work', 'active'),
(4, 2, 'Leave requests must be submitted at least 3 days in advance', 'active'),
(5, 2, 'Sick leave exceeding 2 days requires medical certificate', 'active'),
(6, 2, 'Annual leave cannot exceed 5 consecutive working days without manager approval', 'active'),
(7, 3, 'Employees must maintain professional behavior at all times', 'active'),
(8, 3, 'Harassment of any kind is strictly prohibited', 'active'),
(9, 4, 'Company data must not be shared with external parties without authorization', 'active'),
(10, 4, 'Personal devices must be registered with IT before accessing company network', 'active'),
(11, 5, 'Business casual attire is required on weekdays', 'active'),
(12, 5, 'Casual dress is permitted on Fridays', 'active');

-- --------------------------------------------------------

--
-- Table structure for table `rule_category`
--

CREATE TABLE `rule_category` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `rule_category`
--

INSERT INTO `rule_category` (`id`, `name`, `description`) VALUES
(1, 'Attendance Policy', 'Rules related to employee attendance and punctuality'),
(2, 'Leave Policy', 'Rules governing leave applications and approvals'),
(3, 'Code of Conduct', 'General workplace behavior and ethics guidelines'),
(4, 'IT Security Policy', 'Rules for handling company data and IT resources'),
(5, 'Dress Code', 'Guidelines for appropriate workplace attire');

-- --------------------------------------------------------

--
-- Table structure for table `salary_component`
--

CREATE TABLE `salary_component` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `type` enum('earning','deduction') NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `is_taxable` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sequelizemeta`
--

CREATE TABLE `sequelizemeta` (
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `sequelizemeta`
--

INSERT INTO `sequelizemeta` (`name`) VALUES
('20251211031300-add-role-to-users.js'),
('20251212072452-create-documents-table.js'),
('20251212072520-add-department-designation-to-users.js'),
('20251212072534-create-management-roles-table.js'),
('20251212080424-make-joined-date-nullable-in-employee-detail.js');

-- --------------------------------------------------------

--
-- Table structure for table `service_letter_form`
--

CREATE TABLE `service_letter_form` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `letter_date` date NOT NULL,
  `generated_by` int(11) NOT NULL,
  `generated_at` datetime DEFAULT NULL,
  `file_path` varchar(255) NOT NULL,
  `status` enum('draft','sent','cancelled') DEFAULT 'draft'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `service_letter_template`
--

CREATE TABLE `service_letter_template` (
  `id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL,
  `department_id` int(11) NOT NULL,
  `designation` varchar(100) DEFAULT NULL,
  `responsibilities` text DEFAULT NULL,
  `letter_date_placeholder` varchar(50) DEFAULT '{letter_date}',
  `date_of_joining_placeholder` varchar(50) DEFAULT '{date_of_joining}',
  `generated_by_placeholder` varchar(50) DEFAULT '{generated_by}',
  `file_path_template` varchar(255) DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `task`
--

CREATE TABLE `task` (
  `id` int(11) NOT NULL,
  `project_id` int(11) NOT NULL,
  `title` varchar(200) NOT NULL,
  `description` text DEFAULT NULL,
  `assigned_to` int(11) NOT NULL,
  `priority` enum('low','medium','high','critical') DEFAULT 'medium',
  `status` enum('to_do','in_progress','testing','done','blocked','pending') DEFAULT 'to_do',
  `deadline` datetime DEFAULT NULL,
  `assigner_deadline` datetime DEFAULT NULL,
  `staff_deadline` datetime DEFAULT NULL,
  `assigned_at` datetime DEFAULT NULL,
  `assigned_by` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `task_delay`
--

CREATE TABLE `task_delay` (
  `id` int(11) NOT NULL,
  `task_id` int(11) NOT NULL,
  `delay_reason` text NOT NULL,
  `expected_completion_date` datetime DEFAULT NULL,
  `approved_by` int(11) DEFAULT NULL,
  `approved_at` datetime DEFAULT NULL,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `comments` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `team_lead_staff`
--

CREATE TABLE `team_lead_staff` (
  `id` int(11) NOT NULL,
  `team_lead_user_id` int(11) NOT NULL,
  `staff_user_id` int(11) NOT NULL,
  `assigned_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ticket`
--

CREATE TABLE `ticket` (
  `id` int(11) NOT NULL,
  `ticket_type` enum('client','internal') NOT NULL,
  `client_id` int(11) DEFAULT NULL,
  `title` varchar(200) NOT NULL,
  `description` text DEFAULT NULL,
  `raised_by` int(11) NOT NULL,
  `assigned_to` int(11) DEFAULT NULL,
  `status` enum('open','in_progress','resolved','closed') DEFAULT 'open',
  `created_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `trainer_trainee`
--

CREATE TABLE `trainer_trainee` (
  `id` int(11) NOT NULL,
  `trainer_user_id` int(11) NOT NULL,
  `trainee_user_id` int(11) NOT NULL,
  `assigned_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `emp_id` varchar(20) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `status` enum('active','inactive','terminated') DEFAULT 'active',
  `report_to` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `reset_otp` varchar(10) DEFAULT NULL,
  `reset_otp_expires` datetime DEFAULT NULL,
  `role` enum('admin','employee') DEFAULT 'employee',
  `department_id` int(11) DEFAULT NULL,
  `designation` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `emp_id`, `first_name`, `last_name`, `email`, `password_hash`, `status`, `report_to`, `created_at`, `updated_at`, `reset_otp`, `reset_otp_expires`, `role`, `department_id`, `designation`) VALUES
(1, 'PAI001', 'Lakshan', 'Perera', 'lakshans01@pineappleai.cloud', '$2b$10$/hcKH9GCue6gxCsr/GNbjuRhX5fWuC9Zp2XpNM4wFWl/SenEVw1am', 'active', NULL, '2025-01-01 10:00:00', '2025-12-09 10:50:20', '303691', '2025-12-09 11:25:19', 'employee', NULL, NULL),
(2, 'PAI002', 'Aruna', 'Kumara', 'aruna02@pineappleai.cloud', '$2y$10$def456...', 'active', 1, '2025-01-02 11:00:00', '2025-01-02 11:00:00', NULL, NULL, 'employee', NULL, NULL),
(3, 'PAI003', 'Nimal', 'Silva', 'nimal03@pineappleai.cloud', '$2y$10$ghi789...', 'active', 1, '2025-01-03 12:00:00', '2025-01-03 12:00:00', NULL, NULL, 'employee', NULL, NULL),
(4, 'EMP001', 'John', 'Doe', 'john.doe@example.com', '$2b$10$AQm48yXfNrmKSFEdD2dWGevv9eQ2UxI/EqxSLVisXFkUDTL9D3Sl.', 'active', NULL, '2025-12-08 19:15:05', '2025-12-08 19:15:05', NULL, NULL, 'employee', NULL, NULL),
(5, 'EMP002', 'Jane', 'Smith', 'jane.smith@example.com', '$2b$10$YEw0ati6tHj3VPH6cZXuIe3kGKXAHvZqwbpPDvyolau2ZuVt.Ugv2', 'active', NULL, '2025-12-08 19:16:40', '2025-12-08 19:16:40', NULL, NULL, 'employee', NULL, NULL),
(6, 'EMP003', 'Alice', 'Johnson', 'alice.johnson@example.com', '$2b$10$7jwVfOkYylAZbnOf0T1heOSGS83flDe8Y0A8GD8cVmL9oFlQBiRKe', 'active', NULL, '2025-12-08 21:21:46', '2025-12-08 21:21:46', NULL, NULL, 'employee', NULL, NULL),
(7, 'EMP004', 'Bob', 'Brown', 'bob.brown@example.com', '$2b$10$WTKBz1.Pbvo20Yw5fXYGNuAoVt.FpbDjI8GNI11WQHJXGsAOCtkb6', 'active', NULL, '2025-12-08 21:22:58', '2025-12-08 21:22:58', NULL, NULL, 'employee', NULL, NULL),
(9, 'TEST001', 'Test', 'User', 'test.user@example.com', '$2b$10$zq1mW6D7NSN85JFDL3iXVODQL0Lg4b2mhgNZmo19R4zy0JSqZleTe', 'active', NULL, '2025-12-09 11:24:06', '2025-12-09 11:24:06', '982134', '2025-12-09 12:45:20', 'employee', NULL, NULL),
(10, 'ARUN001', 'Arun', 'Jathu', 'arunjathu0@gmail.com', '$2b$10$3WdUon7hsxEMafcywA0DUOxiJgqi2vpI6TN6dtDFGUsPzPnp7Tv5S', 'active', NULL, '2025-12-09 12:39:49', '2025-12-09 12:39:49', '650491', '2025-12-22 08:47:22', 'employee', NULL, NULL),
(11, 'ADMIN001', 'Admin', 'User', 'admin@pai-erp.com', '$2b$10$kHadRrWAU0D1COVyzdtuVuiFDrPZUfF6mUJQq9xDjjKx9uh/O8ZkG', 'active', NULL, '2025-12-11 09:41:54', '2025-12-11 09:41:54', '371364', '2025-12-20 17:21:52', 'admin', NULL, NULL),
(12, 'EMP005', 'Michael', 'Johnson', 'michael.johnson@example.com', '$2b$10$pcXEFbLHee9HkhPR4dESsOer/MoOvBQXa12kKu7qsvKC2iSfvqG5O', 'active', NULL, '2025-12-12 13:22:45', '2025-12-12 13:22:45', NULL, NULL, 'employee', NULL, NULL),
(13, 'EMP006', 'Sarah', 'Williams', 'sarah.williams@example.com', '$2b$10$vdgx6AfBpaLV16ZMxyYPbO6BxaitwbDoDLq3meGpiZozi9TjanBMG', 'active', NULL, '2025-12-12 13:33:00', '2025-12-12 13:33:00', NULL, NULL, 'employee', NULL, NULL),
(14, 'EMP007', 'David', 'Miller', 'david.miller@example.com', '$2b$10$XcLOj5uARPy2//h79bxzOO3Vo/h2lhVy.RW2HznPlDwkd4ug08iQO', 'active', NULL, '2025-12-12 16:19:52', '2025-12-12 16:19:52', NULL, NULL, 'employee', NULL, NULL),
(15, 'EMP008', 'Emma', 'Davis', 'emma.davis@example.com', '$2b$10$vh5LSVLZAF7fQ9VRfYnTm.XbDylAIwp82m1iG0R8fvIwvlXB9Ne4K', 'active', NULL, '2025-12-12 16:22:11', '2025-12-12 16:22:11', NULL, NULL, 'employee', NULL, NULL),
(16, 'EMP009', 'Robert', 'Wilson', 'robert.wilson@example.com', '$2b$10$/ySMo3xxY61WnF/.MrayEO.8AQq3LQ0GxlSd3ZZDI8jZZ378WGpm.', 'active', NULL, '2025-12-12 16:30:30', '2025-12-12 16:30:30', NULL, NULL, 'employee', NULL, NULL),
(17, 'EMP010', 'Jennifer', 'Taylor', 'jennifer.taylor@example.com', '$2b$10$Alc5FOd0ShZX4sisdP8ZgeZkpCY9XHKVfb9DLdZtKpvm9wdcJ1Xwa', 'active', NULL, '2025-12-12 16:43:40', '2025-12-12 16:43:40', NULL, NULL, 'employee', NULL, 'Senior Financial Analyst'),
(18, 'EMP001_UNIQUE', 'John', 'Doe-Smith', 'john.doe.unique@example.com', '$2b$10$ShhXPP27VPSp2zbuoHOCl.cqxNML67OjghGSzfIClmaLoLFFzE8X2', 'active', NULL, '2025-12-15 10:49:24', '2025-12-15 10:49:24', NULL, NULL, 'employee', NULL, 'Senior Software Engineer'),
(19, '52', 'selvarasa Nishothman', NULL, 'nishothnishan@protonmail.com', '$2b$10$m3ls/SEHHnFbaJoi42/MZu/ruehSDM/x7brNrGf4MXe0LhOwk.jwu', 'active', NULL, '2025-12-22 18:14:07', '2025-12-22 18:14:07', NULL, NULL, 'employee', NULL, NULL),
(20, '53', 'Nishan', NULL, 'nishan@protonmail.com', '$2b$10$hcVTWPLjpjErHOjDjWQ0x.jNVgN3GbUeQHd/DRKFAe24Uve741HZ6', 'active', NULL, '2025-12-22 18:50:33', '2025-12-22 18:50:33', NULL, NULL, 'employee', NULL, NULL),
(21, '54', 'ravi', NULL, 'ravi@protonmail.com', '$2b$10$SeRDbYbofTjKWe6B3.duoOmNENLuz7mUQqBakh1h9Tfd9nUrpHtBS', 'active', NULL, '2025-12-22 21:03:41', '2025-12-22 21:03:41', NULL, NULL, 'employee', NULL, NULL),
(22, '55', 'jathushan', NULL, 'jathupineappleai@gmail.com', '$2b$10$jEXjZO7DdUb4adFdcFhiieXGxx.qHs0MAGAofuTwhEn6IJSJFCqDy', 'active', NULL, '2025-12-24 17:09:16', '2025-12-24 17:09:16', NULL, NULL, 'employee', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `user_role`
--

CREATE TABLE `user_role` (
  `user_id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL,
  `assigned_at` datetime DEFAULT NULL,
  `assigned_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user_role`
--

INSERT INTO `user_role` (`user_id`, `role_id`, `assigned_at`, `assigned_by`) VALUES
(1, 1, '2025-01-01 10:00:00', 1),
(2, 2, '2025-01-02 11:00:00', 1),
(3, 3, '2025-01-03 12:00:00', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `asset`
--
ALTER TABLE `asset`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `asset_tag` (`asset_tag`),
  ADD UNIQUE KEY `asset_tag_2` (`asset_tag`),
  ADD UNIQUE KEY `asset_tag_3` (`asset_tag`),
  ADD UNIQUE KEY `asset_tag_4` (`asset_tag`),
  ADD UNIQUE KEY `asset_tag_5` (`asset_tag`),
  ADD UNIQUE KEY `asset_tag_6` (`asset_tag`),
  ADD UNIQUE KEY `asset_tag_7` (`asset_tag`),
  ADD UNIQUE KEY `asset_tag_8` (`asset_tag`),
  ADD UNIQUE KEY `asset_tag_9` (`asset_tag`),
  ADD UNIQUE KEY `asset_tag_10` (`asset_tag`),
  ADD UNIQUE KEY `asset_tag_11` (`asset_tag`),
  ADD UNIQUE KEY `asset_tag_12` (`asset_tag`),
  ADD UNIQUE KEY `asset_tag_13` (`asset_tag`),
  ADD UNIQUE KEY `asset_tag_14` (`asset_tag`),
  ADD UNIQUE KEY `asset_tag_15` (`asset_tag`),
  ADD UNIQUE KEY `asset_tag_16` (`asset_tag`),
  ADD UNIQUE KEY `asset_tag_17` (`asset_tag`),
  ADD UNIQUE KEY `asset_tag_18` (`asset_tag`),
  ADD UNIQUE KEY `asset_tag_19` (`asset_tag`),
  ADD UNIQUE KEY `asset_tag_20` (`asset_tag`),
  ADD UNIQUE KEY `asset_tag_21` (`asset_tag`),
  ADD UNIQUE KEY `asset_tag_22` (`asset_tag`),
  ADD UNIQUE KEY `asset_tag_23` (`asset_tag`),
  ADD UNIQUE KEY `asset_tag_24` (`asset_tag`),
  ADD UNIQUE KEY `asset_tag_25` (`asset_tag`),
  ADD UNIQUE KEY `asset_tag_26` (`asset_tag`),
  ADD UNIQUE KEY `asset_tag_27` (`asset_tag`),
  ADD UNIQUE KEY `asset_tag_28` (`asset_tag`),
  ADD UNIQUE KEY `asset_tag_29` (`asset_tag`),
  ADD UNIQUE KEY `asset_tag_30` (`asset_tag`),
  ADD UNIQUE KEY `asset_tag_31` (`asset_tag`),
  ADD UNIQUE KEY `asset_tag_32` (`asset_tag`),
  ADD UNIQUE KEY `asset_tag_33` (`asset_tag`),
  ADD UNIQUE KEY `asset_tag_34` (`asset_tag`),
  ADD UNIQUE KEY `asset_tag_35` (`asset_tag`),
  ADD UNIQUE KEY `asset_tag_36` (`asset_tag`),
  ADD UNIQUE KEY `asset_tag_37` (`asset_tag`),
  ADD UNIQUE KEY `asset_tag_38` (`asset_tag`),
  ADD UNIQUE KEY `asset_tag_39` (`asset_tag`),
  ADD UNIQUE KEY `asset_tag_40` (`asset_tag`),
  ADD UNIQUE KEY `asset_tag_41` (`asset_tag`),
  ADD UNIQUE KEY `asset_tag_42` (`asset_tag`),
  ADD UNIQUE KEY `asset_tag_43` (`asset_tag`),
  ADD UNIQUE KEY `asset_tag_44` (`asset_tag`),
  ADD UNIQUE KEY `asset_tag_45` (`asset_tag`),
  ADD UNIQUE KEY `asset_tag_46` (`asset_tag`),
  ADD UNIQUE KEY `asset_tag_47` (`asset_tag`),
  ADD KEY `assigned_to` (`assigned_to`);

--
-- Indexes for table `attendance_record`
--
ALTER TABLE `attendance_record`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `audit_log`
--
ALTER TABLE `audit_log`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `away_log`
--
ALTER TABLE `away_log`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_year_month` (`user_id`,`year`,`month`),
  ADD KEY `away_log_user_id_year_month` (`user_id`,`year`,`month`);

--
-- Indexes for table `client`
--
ALTER TABLE `client`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `defect`
--
ALTER TABLE `defect`
  ADD PRIMARY KEY (`id`),
  ADD KEY `reporter_id` (`reporter_id`),
  ADD KEY `assignee_id` (`assignee_id`),
  ADD KEY `project_id` (`project_id`);

--
-- Indexes for table `defect_comment`
--
ALTER TABLE `defect_comment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `defect_id` (`defect_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `department`
--
ALTER TABLE `department`
  ADD PRIMARY KEY (`id`),
  ADD KEY `hod_user_id` (`hod_user_id`);

--
-- Indexes for table `documents`
--
ALTER TABLE `documents`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `employee_detail`
--
ALTER TABLE `employee_detail`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`);

--
-- Indexes for table `employee_history`
--
ALTER TABLE `employee_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `expense`
--
ALTER TABLE `expense`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `leave_balance`
--
ALTER TABLE `leave_balance`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_balance` (`user_id`,`leave_type_id`,`year`),
  ADD UNIQUE KEY `leave_balance_user_id_leave_type_id_year` (`user_id`,`leave_type_id`,`year`),
  ADD KEY `leave_type_id` (`leave_type_id`);

--
-- Indexes for table `leave_request`
--
ALTER TABLE `leave_request`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `leave_type_id` (`leave_type_id`),
  ADD KEY `approved_by` (`approved_by`);

--
-- Indexes for table `leave_type`
--
ALTER TABLE `leave_type`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `management_roles`
--
ALTER TABLE `management_roles`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `notification`
--
ALTER TABLE `notification`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `offer_letter_form`
--
ALTER TABLE `offer_letter_form`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `generated_by` (`generated_by`);

--
-- Indexes for table `offer_letter_template`
--
ALTER TABLE `offer_letter_template`
  ADD PRIMARY KEY (`id`),
  ADD KEY `role_id` (`role_id`),
  ADD KEY `department_id` (`department_id`);

--
-- Indexes for table `payroll`
--
ALTER TABLE `payroll`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `permission`
--
ALTER TABLE `permission`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_perm` (`module`,`action`,`level`),
  ADD UNIQUE KEY `permission_module_action_level` (`module`,`action`,`level`);

--
-- Indexes for table `project`
--
ALTER TABLE `project`
  ADD PRIMARY KEY (`id`),
  ADD KEY `client_id` (`client_id`),
  ADD KEY `pm_user_id` (`pm_user_id`);

--
-- Indexes for table `project_allocation`
--
ALTER TABLE `project_allocation`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_allocation` (`project_id`,`user_id`),
  ADD UNIQUE KEY `project_allocation_project_id_user_id` (`project_id`,`user_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `role_name` (`role_name`),
  ADD UNIQUE KEY `role_name_2` (`role_name`),
  ADD UNIQUE KEY `role_name_3` (`role_name`),
  ADD UNIQUE KEY `role_name_4` (`role_name`),
  ADD UNIQUE KEY `role_name_5` (`role_name`),
  ADD UNIQUE KEY `role_name_6` (`role_name`),
  ADD UNIQUE KEY `role_name_7` (`role_name`),
  ADD UNIQUE KEY `role_name_8` (`role_name`),
  ADD UNIQUE KEY `role_name_9` (`role_name`),
  ADD UNIQUE KEY `role_name_10` (`role_name`),
  ADD UNIQUE KEY `role_name_11` (`role_name`),
  ADD UNIQUE KEY `role_name_12` (`role_name`),
  ADD UNIQUE KEY `role_name_13` (`role_name`),
  ADD UNIQUE KEY `role_name_14` (`role_name`),
  ADD UNIQUE KEY `role_name_15` (`role_name`),
  ADD UNIQUE KEY `role_name_16` (`role_name`),
  ADD UNIQUE KEY `role_name_17` (`role_name`),
  ADD UNIQUE KEY `role_name_18` (`role_name`),
  ADD UNIQUE KEY `role_name_19` (`role_name`),
  ADD UNIQUE KEY `role_name_20` (`role_name`),
  ADD UNIQUE KEY `role_name_21` (`role_name`),
  ADD UNIQUE KEY `role_name_22` (`role_name`),
  ADD UNIQUE KEY `role_name_23` (`role_name`),
  ADD UNIQUE KEY `role_name_24` (`role_name`),
  ADD UNIQUE KEY `role_name_25` (`role_name`),
  ADD UNIQUE KEY `role_name_26` (`role_name`),
  ADD UNIQUE KEY `role_name_27` (`role_name`),
  ADD UNIQUE KEY `role_name_28` (`role_name`),
  ADD UNIQUE KEY `role_name_29` (`role_name`),
  ADD UNIQUE KEY `role_name_30` (`role_name`),
  ADD UNIQUE KEY `role_name_31` (`role_name`),
  ADD UNIQUE KEY `role_name_32` (`role_name`),
  ADD UNIQUE KEY `role_name_33` (`role_name`),
  ADD UNIQUE KEY `role_name_34` (`role_name`),
  ADD UNIQUE KEY `role_name_35` (`role_name`),
  ADD UNIQUE KEY `role_name_36` (`role_name`),
  ADD UNIQUE KEY `role_name_37` (`role_name`),
  ADD UNIQUE KEY `role_name_38` (`role_name`),
  ADD UNIQUE KEY `role_name_39` (`role_name`),
  ADD UNIQUE KEY `role_name_40` (`role_name`),
  ADD UNIQUE KEY `role_name_41` (`role_name`),
  ADD UNIQUE KEY `role_name_42` (`role_name`),
  ADD UNIQUE KEY `role_name_43` (`role_name`),
  ADD UNIQUE KEY `role_name_44` (`role_name`),
  ADD UNIQUE KEY `role_name_45` (`role_name`),
  ADD UNIQUE KEY `role_name_46` (`role_name`);

--
-- Indexes for table `role_assignment_log`
--
ALTER TABLE `role_assignment_log`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `old_role_id` (`old_role_id`),
  ADD KEY `new_role_id` (`new_role_id`),
  ADD KEY `changed_by` (`changed_by`);

--
-- Indexes for table `role_department`
--
ALTER TABLE `role_department`
  ADD PRIMARY KEY (`role_id`,`department_id`),
  ADD KEY `department_id` (`department_id`);

--
-- Indexes for table `role_permission`
--
ALTER TABLE `role_permission`
  ADD PRIMARY KEY (`role_id`,`permission_id`),
  ADD KEY `permission_id` (`permission_id`);

--
-- Indexes for table `role_rule`
--
ALTER TABLE `role_rule`
  ADD PRIMARY KEY (`role_id`,`rule_category_id`),
  ADD KEY `rule_category_id` (`rule_category_id`);

--
-- Indexes for table `rule`
--
ALTER TABLE `rule`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `rule_category`
--
ALTER TABLE `rule_category`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `salary_component`
--
ALTER TABLE `salary_component`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sequelizemeta`
--
ALTER TABLE `sequelizemeta`
  ADD PRIMARY KEY (`name`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `service_letter_form`
--
ALTER TABLE `service_letter_form`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `generated_by` (`generated_by`);

--
-- Indexes for table `service_letter_template`
--
ALTER TABLE `service_letter_template`
  ADD PRIMARY KEY (`id`),
  ADD KEY `role_id` (`role_id`),
  ADD KEY `department_id` (`department_id`);

--
-- Indexes for table `task`
--
ALTER TABLE `task`
  ADD PRIMARY KEY (`id`),
  ADD KEY `project_id` (`project_id`),
  ADD KEY `assigned_to` (`assigned_to`),
  ADD KEY `assigned_by` (`assigned_by`);

--
-- Indexes for table `task_delay`
--
ALTER TABLE `task_delay`
  ADD PRIMARY KEY (`id`),
  ADD KEY `task_id` (`task_id`),
  ADD KEY `approved_by` (`approved_by`);

--
-- Indexes for table `team_lead_staff`
--
ALTER TABLE `team_lead_staff`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_lead_staff` (`team_lead_user_id`,`staff_user_id`),
  ADD UNIQUE KEY `team_lead_staff_team_lead_user_id_staff_user_id` (`team_lead_user_id`,`staff_user_id`),
  ADD KEY `staff_user_id` (`staff_user_id`);

--
-- Indexes for table `ticket`
--
ALTER TABLE `ticket`
  ADD PRIMARY KEY (`id`),
  ADD KEY `client_id` (`client_id`),
  ADD KEY `raised_by` (`raised_by`),
  ADD KEY `assigned_to` (`assigned_to`);

--
-- Indexes for table `trainer_trainee`
--
ALTER TABLE `trainer_trainee`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_trainer_trainee` (`trainer_user_id`,`trainee_user_id`),
  ADD UNIQUE KEY `trainer_trainee_trainer_user_id_trainee_user_id` (`trainer_user_id`,`trainee_user_id`),
  ADD KEY `trainee_user_id` (`trainee_user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `emp_id` (`emp_id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `emp_id_2` (`emp_id`),
  ADD UNIQUE KEY `email_2` (`email`),
  ADD UNIQUE KEY `emp_id_3` (`emp_id`),
  ADD UNIQUE KEY `email_3` (`email`),
  ADD UNIQUE KEY `emp_id_4` (`emp_id`),
  ADD UNIQUE KEY `email_4` (`email`),
  ADD UNIQUE KEY `emp_id_5` (`emp_id`),
  ADD UNIQUE KEY `email_5` (`email`),
  ADD UNIQUE KEY `emp_id_6` (`emp_id`),
  ADD UNIQUE KEY `email_6` (`email`),
  ADD UNIQUE KEY `emp_id_7` (`emp_id`),
  ADD UNIQUE KEY `email_7` (`email`),
  ADD UNIQUE KEY `emp_id_8` (`emp_id`),
  ADD UNIQUE KEY `email_8` (`email`),
  ADD UNIQUE KEY `emp_id_9` (`emp_id`),
  ADD UNIQUE KEY `email_9` (`email`),
  ADD UNIQUE KEY `emp_id_10` (`emp_id`),
  ADD UNIQUE KEY `email_10` (`email`),
  ADD UNIQUE KEY `emp_id_11` (`emp_id`),
  ADD UNIQUE KEY `email_11` (`email`),
  ADD UNIQUE KEY `emp_id_12` (`emp_id`),
  ADD UNIQUE KEY `email_12` (`email`),
  ADD UNIQUE KEY `emp_id_13` (`emp_id`),
  ADD UNIQUE KEY `email_13` (`email`),
  ADD UNIQUE KEY `emp_id_14` (`emp_id`),
  ADD UNIQUE KEY `email_14` (`email`),
  ADD UNIQUE KEY `emp_id_15` (`emp_id`),
  ADD UNIQUE KEY `email_15` (`email`),
  ADD UNIQUE KEY `emp_id_16` (`emp_id`),
  ADD UNIQUE KEY `email_16` (`email`),
  ADD UNIQUE KEY `emp_id_17` (`emp_id`),
  ADD UNIQUE KEY `email_17` (`email`),
  ADD UNIQUE KEY `emp_id_18` (`emp_id`),
  ADD UNIQUE KEY `email_18` (`email`),
  ADD UNIQUE KEY `emp_id_19` (`emp_id`),
  ADD UNIQUE KEY `email_19` (`email`),
  ADD UNIQUE KEY `emp_id_20` (`emp_id`),
  ADD UNIQUE KEY `email_20` (`email`),
  ADD UNIQUE KEY `emp_id_21` (`emp_id`),
  ADD UNIQUE KEY `email_21` (`email`),
  ADD UNIQUE KEY `emp_id_22` (`emp_id`),
  ADD UNIQUE KEY `email_22` (`email`),
  ADD UNIQUE KEY `emp_id_23` (`emp_id`),
  ADD UNIQUE KEY `email_23` (`email`),
  ADD UNIQUE KEY `emp_id_24` (`emp_id`),
  ADD UNIQUE KEY `email_24` (`email`),
  ADD UNIQUE KEY `emp_id_25` (`emp_id`),
  ADD UNIQUE KEY `email_25` (`email`),
  ADD UNIQUE KEY `emp_id_26` (`emp_id`),
  ADD UNIQUE KEY `email_26` (`email`),
  ADD UNIQUE KEY `emp_id_27` (`emp_id`),
  ADD UNIQUE KEY `email_27` (`email`),
  ADD UNIQUE KEY `emp_id_28` (`emp_id`),
  ADD UNIQUE KEY `email_28` (`email`),
  ADD UNIQUE KEY `emp_id_29` (`emp_id`),
  ADD UNIQUE KEY `email_29` (`email`),
  ADD UNIQUE KEY `emp_id_30` (`emp_id`),
  ADD UNIQUE KEY `email_30` (`email`),
  ADD UNIQUE KEY `emp_id_31` (`emp_id`),
  ADD KEY `report_to` (`report_to`),
  ADD KEY `department_id` (`department_id`);

--
-- Indexes for table `user_role`
--
ALTER TABLE `user_role`
  ADD PRIMARY KEY (`user_id`,`role_id`),
  ADD KEY `role_id` (`role_id`),
  ADD KEY `assigned_by` (`assigned_by`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `asset`
--
ALTER TABLE `asset`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `attendance_record`
--
ALTER TABLE `attendance_record`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `audit_log`
--
ALTER TABLE `audit_log`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `away_log`
--
ALTER TABLE `away_log`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `client`
--
ALTER TABLE `client`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `defect`
--
ALTER TABLE `defect`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `defect_comment`
--
ALTER TABLE `defect_comment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `department`
--
ALTER TABLE `department`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `documents`
--
ALTER TABLE `documents`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

--
-- AUTO_INCREMENT for table `employee_detail`
--
ALTER TABLE `employee_detail`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `employee_history`
--
ALTER TABLE `employee_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `expense`
--
ALTER TABLE `expense`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `leave_balance`
--
ALTER TABLE `leave_balance`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `leave_request`
--
ALTER TABLE `leave_request`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `leave_type`
--
ALTER TABLE `leave_type`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `management_roles`
--
ALTER TABLE `management_roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `notification`
--
ALTER TABLE `notification`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `offer_letter_form`
--
ALTER TABLE `offer_letter_form`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `offer_letter_template`
--
ALTER TABLE `offer_letter_template`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `payroll`
--
ALTER TABLE `payroll`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `permission`
--
ALTER TABLE `permission`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `project`
--
ALTER TABLE `project`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `project_allocation`
--
ALTER TABLE `project_allocation`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `role_assignment_log`
--
ALTER TABLE `role_assignment_log`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `rule`
--
ALTER TABLE `rule`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `rule_category`
--
ALTER TABLE `rule_category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `salary_component`
--
ALTER TABLE `salary_component`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `service_letter_form`
--
ALTER TABLE `service_letter_form`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `service_letter_template`
--
ALTER TABLE `service_letter_template`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `task`
--
ALTER TABLE `task`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `task_delay`
--
ALTER TABLE `task_delay`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `team_lead_staff`
--
ALTER TABLE `team_lead_staff`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ticket`
--
ALTER TABLE `ticket`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `trainer_trainee`
--
ALTER TABLE `trainer_trainee`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `asset`
--
ALTER TABLE `asset`
  ADD CONSTRAINT `asset_ibfk_1` FOREIGN KEY (`assigned_to`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `attendance_record`
--
ALTER TABLE `attendance_record`
  ADD CONSTRAINT `attendance_record_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `audit_log`
--
ALTER TABLE `audit_log`
  ADD CONSTRAINT `audit_log_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `away_log`
--
ALTER TABLE `away_log`
  ADD CONSTRAINT `away_log_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `defect`
--
ALTER TABLE `defect`
  ADD CONSTRAINT `defect_ibfk_136` FOREIGN KEY (`reporter_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `defect_ibfk_137` FOREIGN KEY (`assignee_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `defect_ibfk_138` FOREIGN KEY (`project_id`) REFERENCES `project` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `defect_comment`
--
ALTER TABLE `defect_comment`
  ADD CONSTRAINT `defect_comment_ibfk_91` FOREIGN KEY (`defect_id`) REFERENCES `defect` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `defect_comment_ibfk_92` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `department`
--
ALTER TABLE `department`
  ADD CONSTRAINT `department_ibfk_1` FOREIGN KEY (`hod_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `documents`
--
ALTER TABLE `documents`
  ADD CONSTRAINT `documents_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `employee_detail`
--
ALTER TABLE `employee_detail`
  ADD CONSTRAINT `employee_detail_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `employee_history`
--
ALTER TABLE `employee_history`
  ADD CONSTRAINT `employee_history_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `expense`
--
ALTER TABLE `expense`
  ADD CONSTRAINT `expense_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `leave_balance`
--
ALTER TABLE `leave_balance`
  ADD CONSTRAINT `leave_balance_ibfk_91` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `leave_balance_ibfk_92` FOREIGN KEY (`leave_type_id`) REFERENCES `leave_type` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `leave_request`
--
ALTER TABLE `leave_request`
  ADD CONSTRAINT `leave_request_ibfk_91` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `leave_request_ibfk_92` FOREIGN KEY (`leave_type_id`) REFERENCES `leave_type` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `leave_request_ibfk_93` FOREIGN KEY (`approved_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `notification`
--
ALTER TABLE `notification`
  ADD CONSTRAINT `notification_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `offer_letter_form`
--
ALTER TABLE `offer_letter_form`
  ADD CONSTRAINT `offer_letter_form_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `offer_letter_form_ibfk_2` FOREIGN KEY (`generated_by`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `offer_letter_template`
--
ALTER TABLE `offer_letter_template`
  ADD CONSTRAINT `offer_letter_template_ibfk_91` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `offer_letter_template_ibfk_92` FOREIGN KEY (`department_id`) REFERENCES `department` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `payroll`
--
ALTER TABLE `payroll`
  ADD CONSTRAINT `payroll_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `project`
--
ALTER TABLE `project`
  ADD CONSTRAINT `project_ibfk_91` FOREIGN KEY (`client_id`) REFERENCES `client` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `project_ibfk_92` FOREIGN KEY (`pm_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `project_allocation`
--
ALTER TABLE `project_allocation`
  ADD CONSTRAINT `project_allocation_ibfk_91` FOREIGN KEY (`project_id`) REFERENCES `project` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `project_allocation_ibfk_92` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `role_assignment_log`
--
ALTER TABLE `role_assignment_log`
  ADD CONSTRAINT `role_assignment_log_ibfk_136` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `role_assignment_log_ibfk_137` FOREIGN KEY (`old_role_id`) REFERENCES `roles` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `role_assignment_log_ibfk_138` FOREIGN KEY (`new_role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `role_assignment_log_ibfk_139` FOREIGN KEY (`changed_by`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `role_department`
--
ALTER TABLE `role_department`
  ADD CONSTRAINT `role_department_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `role_department_ibfk_2` FOREIGN KEY (`department_id`) REFERENCES `department` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `role_permission`
--
ALTER TABLE `role_permission`
  ADD CONSTRAINT `role_permission_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `role_permission_ibfk_2` FOREIGN KEY (`permission_id`) REFERENCES `permission` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `role_rule`
--
ALTER TABLE `role_rule`
  ADD CONSTRAINT `role_rule_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `role_rule_ibfk_2` FOREIGN KEY (`rule_category_id`) REFERENCES `rule_category` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `rule`
--
ALTER TABLE `rule`
  ADD CONSTRAINT `rule_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `rule_category` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `service_letter_form`
--
ALTER TABLE `service_letter_form`
  ADD CONSTRAINT `service_letter_form_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `service_letter_form_ibfk_2` FOREIGN KEY (`generated_by`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `service_letter_template`
--
ALTER TABLE `service_letter_template`
  ADD CONSTRAINT `service_letter_template_ibfk_91` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `service_letter_template_ibfk_92` FOREIGN KEY (`department_id`) REFERENCES `department` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `task`
--
ALTER TABLE `task`
  ADD CONSTRAINT `task_ibfk_136` FOREIGN KEY (`project_id`) REFERENCES `project` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `task_ibfk_137` FOREIGN KEY (`assigned_to`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `task_ibfk_138` FOREIGN KEY (`assigned_by`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `task_delay`
--
ALTER TABLE `task_delay`
  ADD CONSTRAINT `task_delay_ibfk_91` FOREIGN KEY (`task_id`) REFERENCES `task` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `task_delay_ibfk_92` FOREIGN KEY (`approved_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `team_lead_staff`
--
ALTER TABLE `team_lead_staff`
  ADD CONSTRAINT `team_lead_staff_ibfk_1` FOREIGN KEY (`team_lead_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `team_lead_staff_ibfk_2` FOREIGN KEY (`staff_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `ticket`
--
ALTER TABLE `ticket`
  ADD CONSTRAINT `ticket_ibfk_136` FOREIGN KEY (`client_id`) REFERENCES `client` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `ticket_ibfk_137` FOREIGN KEY (`raised_by`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ticket_ibfk_138` FOREIGN KEY (`assigned_to`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `trainer_trainee`
--
ALTER TABLE `trainer_trainee`
  ADD CONSTRAINT `trainer_trainee_ibfk_1` FOREIGN KEY (`trainer_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `trainer_trainee_ibfk_2` FOREIGN KEY (`trainee_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_51` FOREIGN KEY (`report_to`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `users_ibfk_52` FOREIGN KEY (`department_id`) REFERENCES `department` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `user_role`
--
ALTER TABLE `user_role`
  ADD CONSTRAINT `user_role_ibfk_2` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_role_ibfk_3` FOREIGN KEY (`assigned_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

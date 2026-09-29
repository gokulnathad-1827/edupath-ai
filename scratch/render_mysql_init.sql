-- ============================================================
-- EduPath AI - Production Database Initialization Script
-- Target: Render MySQL Server 8.0
-- Databases: edupath_ai, edupath_course_db, edupath_career_db
-- ============================================================

-- 1. Create Databases
CREATE DATABASE IF NOT EXISTS edupath_ai CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS edupath_course_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS edupath_career_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Note:
-- Hibernate ddl-auto=update in edupath-service, course-service, and career-service
-- will automatically create all tables, indexes, and foreign keys upon first connection.
-- Optional seed data can be imported into edupath_ai from scratch/seed_batch.sql.

import os
import subprocess
import json
import random
from datetime import datetime

MYSQL_CMD = r"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"
MONGOSH_CMD = r"C:\Users\Gokulnath\AppData\Local\Programs\mongosh\mongosh.exe"
DB_PASS = "nath@1827"
DB_NAME = "edupath_ai"

# Password hash for BCrypt 'password123'
PASSWORD_HASH = "$2a$10$i7nXwG5NWnGls0sjg9MT8.y1VthhvCPgOVxANWa8APoBIlsEwfgZi"

# 46 New Students definition
# (name, gender, dob, grade, section, teacher_id, parent_name, parent_email, parent_phone, math, sci, eng, comp, att_present_count, comp_rate, study_hrs, behavior)
new_students_data = [
    # --- Class 9-A (6 students) ---
    ("Arjun Kumar", "Male", "2012-04-15", "9", "A", 8, "Ramanathan K", "parent.arjun@edupath.com", "9843100001", 92, 95, 88, 94, 10, 95, 7.0, 92),
    ("Keerthana M", "Female", "2012-06-20", "9", "A", 8, "Murugan S", "parent.keerthana@edupath.com", "9843100002", 85, 90, 92, 89, 9, 88, 5.5, 85),
    ("Kavin Raj", "Male", "2012-02-10", "9", "A", 8, "Rajendran P", "parent.kavin@edupath.com", "9843100003", 78, 82, 75, 80, 8, 80, 4.0, 78),
    ("Harini S", "Female", "2012-08-05", "9", "A", 8, "Sundaram V", "parent.harini@edupath.com", "9843100004", 62, 68, 70, 65, 7, 72, 3.0, 70),
    ("Dharshan P", "Male", "2012-11-12", "9", "A", 8, "Paranthaman R", "parent.dharshan@edupath.com", "9843100005", 45, 50, 48, 52, 6, 58, 2.0, 55),
    ("Nandhini R", "Female", "2012-01-25", "9", "A", 8, "Ramesh Babu", "parent.nandhini@edupath.com", "9843100006", 96, 94, 95, 98, 10, 98, 7.5, 95),

    # --- Class 9-B (6 students) ---
    ("Aavani Nair", "Female", "2012-03-14", "9", "B", 11, "Unnikrishnan Nair", "parent.aavani@edupath.com", "9843100007", 88, 85, 90, 87, 9, 90, 6.0, 88),
    ("Bhavan K", "Male", "2012-05-18", "9", "B", 11, "Krishnamoorthy A", "parent.bhavan@edupath.com", "9843100008", 74, 76, 72, 75, 8, 78, 4.5, 76),
    ("Charulatha V", "Female", "2012-07-22", "9", "B", 11, "Vasudevan T", "parent.charu@edupath.com", "9843100009", 55, 60, 58, 62, 7, 65, 3.0, 64),
    ("Deepak Verma", "Male", "2012-09-09", "9", "B", 11, "Suresh Verma", "parent.deepak@edupath.com", "9843100010", 32, 38, 35, 40, 5, 45, 1.5, 48),
    ("Ezhil Maran", "Male", "2012-10-30", "9", "B", 11, "Ilango M", "parent.ezhil@edupath.com", "9843100011", 90, 92, 89, 91, 10, 92, 6.5, 90),
    ("Fiona Joseph", "Female", "2012-12-04", "9", "B", 11, "Joseph Thomas", "parent.fiona@edupath.com", "9843100012", 82, 84, 86, 83, 9, 85, 5.0, 82),

    # --- Class 10-A (4 new students -> total 6 with guna & Gokulnath) ---
    ("Gowtham S", "Male", "2011-01-15", "10", "A", 4, "Senthil Nathan", "parent.gowtham@edupath.com", "9843100013", 89, 91, 88, 93, 10, 91, 6.0, 89),
    ("Hemalatha R", "Female", "2011-04-20", "10", "A", 4, "Radhakrishnan G", "parent.hemar@edupath.com", "9843100014", 76, 79, 81, 78, 8, 82, 4.5, 80),
    ("Iniyan K", "Male", "2011-06-11", "10", "A", 4, "Karthikeyan P", "parent.iniyan@edupath.com", "58, 62, 60, 64", "parent.iniyan@edupath.com", 58, 62, 60, 64, 7, 68, 3.0, 66),
    ("Janani B", "Female", "2011-09-28", "10", "A", 4, "Balasubramanian V", "parent.janani@edupath.com", "9843100016", 94, 96, 95, 97, 10, 96, 7.0, 94),

    # --- Class 10-B (4 new students -> total 6 with Hema & sanjay) ---
    ("Karthik V", "Male", "2011-02-17", "10", "B", 5, "Vijayaraghavan S", "parent.karthik@edupath.com", "9843100017", 86, 88, 84, 87, 9, 87, 5.5, 86),
    ("Kavya Shree", "Female", "2011-05-24", "10", "B", 5, "Shanmugam K", "parent.kavya@edupath.com", "9843100018", 72, 75, 74, 76, 8, 79, 4.0, 77),
    ("Lokesh Kumar", "Male", "2011-08-03", "10", "B", 5, "Mani Kumar", "parent.lokesh@edupath.com", "9843100019", 40, 42, 38, 44, 5, 50, 1.8, 52),
    ("Madhumitha P", "Female", "2011-10-19", "10", "B", 5, "Palanisamy R", "parent.madhu@edupath.com", "9843100020", 91, 93, 90, 92, 10, 93, 6.8, 91),

    # --- Class 11-A (6 students) ---
    ("Naveen Chandran", "Male", "2010-03-12", "11", "A", 8, "Chandrasekar T", "parent.naveen@edupath.com", "9843100021", 95, 93, 91, 96, 10, 95, 7.2, 94),
    ("Nivedha R", "Female", "2010-06-08", "11", "A", 8, "Rajagopal M", "parent.nivedha@edupath.com", "9843100022", 87, 85, 89, 88, 9, 89, 5.8, 87),
    ("Omkar Sharma", "Male", "2010-07-29", "11", "A", 8, "Mahesh Sharma", "parent.omkar@edupath.com", "9843100023", 75, 78, 73, 76, 8, 80, 4.2, 79),
    ("Pavithra M", "Female", "2010-09-14", "11", "A", 8, "Manoharan K", "parent.pavi@edupath.com", "9843100024", 64, 67, 65, 68, 7, 70, 3.2, 68),
    ("Pranav V", "Male", "2010-11-05", "11", "A", 8, "Venkatraman S", "parent.pranav@edupath.com", "35, 39, 36, 41", "parent.pranav@edupath.com", 35, 39, 36, 41, 5, 48, 1.5, 46),
    ("Rithika S", "Female", "2010-12-21", "11", "A", 8, "Subramanian G", "parent.rithika@edupath.com", "9843100026", 92, 94, 93, 95, 10, 94, 7.0, 93),

    # --- Class 11-B (6 students) ---
    ("Rohit Menon", "Male", "2010-01-30", "11", "B", 11, "Narayanan Menon", "parent.rohit@edupath.com", "9843100027", 89, 87, 90, 88, 9, 88, 6.0, 89),
    ("Samyuktha G", "Female", "2010-04-16", "11", "B", 11, "Gopalakrishnan R", "parent.samyu@edupath.com", "9843100028", 79, 81, 83, 80, 8, 83, 4.8, 81),
    ("Sharvesh K", "Male", "2010-05-27", "11", "B", 11, "Kuppusamy V", "parent.sharvesh@edupath.com", "59, 63, 61, 65", "parent.sharvesh@edupath.com", 59, 63, 61, 65, 7, 67, 3.0, 65),
    ("Sneha Patel", "Female", "2010-08-10", "11", "B", 11, "Bhavesh Patel", "parent.sneha@edupath.com", "9843100030", 96, 97, 95, 98, 10, 97, 7.5, 96),
    ("Srikanth N", "Male", "2010-10-02", "11", "B", 11, "Natarajan P", "parent.srikanth@edupath.com", "28, 30, 32, 35", "parent.srikanth@edupath.com", 28, 30, 32, 35, 4, 40, 1.0, 42),
    ("Swetha B", "Female", "2010-11-18", "11", "B", 11, "Bhaskar S", "parent.swetha@edupath.com", "9843100032", 84, 86, 88, 85, 9, 86, 5.2, 84),

    # --- Class 12-A (7 students) ---
    ("Tarun Raj", "Male", "2009-02-14", "12", "A", 4, "Rajasekar M", "parent.tarun@edupath.com", "9843100033", 94, 96, 92, 95, 10, 95, 7.0, 93),
    ("Tharani M", "Female", "2009-04-25", "12", "A", 4, "Muthusamy K", "parent.tharani@edupath.com", "9843100034", 86, 88, 89, 87, 9, 88, 5.6, 86),
    ("Udaya Kumar", "Male", "2009-06-19", "12", "A", 4, "Anand Kumar", "parent.udaya@edupath.com", "77, 80, 78, 82", "parent.udaya@edupath.com", 77, 80, 78, 82, 8, 81, 4.4, 79),
    ("Vaishnavi R", "Female", "2009-08-31", "12", "A", 4, "Ramachandran V", "parent.vaishnavi@edupath.com", "65, 68, 70, 67", "parent.vaishnavi@edupath.com", 65, 68, 70, 67, 7, 72, 3.4, 71),
    ("Varun S", "Male", "2009-10-12", "12", "A", 4, "Sivaraman P", "parent.varun@edupath.com", "9843100037", 42, 45, 40, 46, 5, 52, 2.0, 50),
    ("Vidhya K", "Female", "2009-11-28", "12", "A", 4, "Kannan R", "parent.vidhya@edupath.com", "9843100038", 91, 93, 94, 92, 10, 93, 6.8, 92),
    ("Vignesh P", "Male", "2009-12-09", "12", "A", 4, "Periasamy T", "parent.vignesh@edupath.com", "9843100039", 83, 85, 82, 84, 9, 85, 5.0, 83),

    # --- Class 12-B (7 students) ---
    ("Vishnu Vardhan", "Male", "2009-01-11", "12", "B", 5, "Venkatesan R", "parent.vishnu@edupath.com", "9843100040", 97, 98, 96, 99, 10, 98, 7.8, 96),
    ("Yashwanth R", "Male", "2009-03-22", "12", "B", 5, "Ranganathan S", "parent.yashwanth@edupath.com", "88, 90, 87, 89", "parent.yashwanth@edupath.com", 88, 90, 87, 89, 9, 89, 6.0, 88),
    ("Yalini S", "Female", "2009-05-04", "12", "B", 5, "Selvaraj M", "parent.yalini@edupath.com", "9843100042", 76, 78, 80, 77, 8, 80, 4.5, 78),
    ("Yogesh K", "Male", "2009-07-16", "12", "B", 5, "Kumaresan G", "parent.yogesh@edupath.com", "9843100043", 56, 60, 58, 62, 7, 65, 3.0, 63),
    ("Zara Khan", "Female", "2009-09-08", "12", "B", 5, "Tariq Khan", "parent.zara@edupath.com", "9843100044", 30, 34, 32, 38, 4, 42, 1.2, 44),
    ("Aadhavan T", "Male", "2009-10-29", "12", "B", 5, "Thirunavukkarasu K", "parent.aadhavan@edupath.com", "9843100045", 93, 95, 92, 94, 10, 94, 7.0, 93),
    ("Abhinaya P", "Female", "2009-12-15", "12", "B", 5, "Prabakar R", "parent.abhinaya@edupath.com", "9843100046", 85, 87, 89, 86, 9, 87, 5.5, 85)
]

print(f"Total students to add: {len(new_students_data)}")

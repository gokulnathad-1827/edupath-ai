import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaRobot,
  FaUserGraduate,
  FaChartLine,
  FaBell,
  FaArrowRight,
  FaUserCheck,
  FaGraduationCap,
  FaUsers,
  FaUserShield,
  FaTrophy,
  FaShieldAlt,
  FaClock,
  FaStar,
} from "react-icons/fa";

import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import Button from "../../components/common/Button";
import heroImg from "../../assets/hero.png";
import "./Home.css";

function Home() {
  useEffect(() => {
    const handleAnchorClick = (e) => {
      const href = e.currentTarget.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const targetId = href.substring(1);
        const scrollContainer = document.querySelector('.home-scrollable');
        if (scrollContainer) {
          if (targetId === 'footer') {
            scrollContainer.scrollTo({
              top: scrollContainer.scrollHeight,
              behavior: 'smooth'
            });
            return;
          }
          const targetElement = document.getElementById(targetId);
          if (targetElement) {
            const targetOffsetTop = targetElement.offsetTop;
            scrollContainer.scrollTo({
              top: targetOffsetTop,
              behavior: 'smooth'
            });
          }
        }
      }
    };

    const timer = setTimeout(() => {
      const links = document.querySelectorAll('.navbar a[href^="#"]');
      links.forEach(link => link.addEventListener('click', handleAnchorClick));
    }, 100);

    return () => {
      clearTimeout(timer);
      const links = document.querySelectorAll('.navbar a[href^="#"]');
      links.forEach(link => link.removeEventListener('click', handleAnchorClick));
    };
  }, []);

  return (
    <div className="home animate-fade-in">
      <Navbar />

      <div className="home-scrollable">
        {/* ── 1. Hero Section ────────────────────────────── */}
        <section id="hero" className="hero container">
          <div className="hero-left">
            <h1 className="hero-brand-title">
              Empowering <span className="text-gradient">Student Success</span> Through Artificial Intelligence
            </h1>

            <p className="hero-description">
              EduPath AI helps educational institutions reduce student dropout by analyzing attendance, academic performance, and student engagement while providing personalized career guidance.
            </p>

            <div className="hero-buttons">
              <Link to="/login">
                <Button variant="primary" size="lg">Sign In</Button>
              </Link>

              <a href="#features">
                <Button variant="outline" size="lg">Explore Features</Button>
              </a>
            </div>
          </div>

          <div className="hero-right">
            <img src={heroImg} alt="EduPath AI Dashboard System Mockup" className="hero-illustration" />
          </div>
        </section>

        {/* ── 2. Statistics Section ─────────────────────────── */}
        <section className="stats-section container">
          <div className="stats-grid">
            <div className="stat-card">
              <h3>2500+</h3>
              <p>Students</p>
            </div>
            <div className="stat-card">
              <h3>120+</h3>
              <p>Teachers</p>
            </div>
            <div className="stat-card">
              <h3>98%</h3>
              <p>Prediction Accuracy</p>
            </div>
            <div className="stat-card">
              <h3>60+</h3>
              <p>School Classes</p>
            </div>
            <div className="stat-card">
              <h3>5</h3>
              <p>User Roles</p>
            </div>
          </div>
        </section>

        {/* ── 3. Key Features ─────────────────────────────── */}
        <section id="features" className="features container">
          <h2 className="section-title">Key Platform Features</h2>
          <p className="section-subtitle">
            Advanced analytics and intelligent tools built to streamline intervention and guide student outcomes.
          </p>

          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-icon-circle">
                <FaRobot />
              </div>
              <h3>AI Dropout Prediction</h3>
              <p>
                Uses early indicators like attendance declines and grade dips to alert counselors before dropouts happen.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-circle">
                <FaUserGraduate />
              </div>
              <h3>Career Recommendation</h3>
              <p>
                Provides students with automated assessments that map matching profiles to career interests.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-circle">
                <FaUserCheck />
              </div>
              <h3>Attendance Analytics</h3>
              <p>
                Real-time monitoring of attendance levels with automatic warnings when levels fall below standard margins.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-circle">
                <FaChartLine />
              </div>
              <h3>Academic Performance Tracking</h3>
              <p>
                Displays student test scores and assignment grades over time on clear graphs.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-circle">
                <FaBell />
              </div>
              <h3>Smart Notifications</h3>
              <p>
                Sends automated notices and reminders directly to students, teachers, parents, and counselors.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-circle">
                <FaUsers />
              </div>
              <h3>Role-Based Dashboards</h3>
              <p>
                Dedicated portal layouts for Admin, Teacher, Student, Parent, and Counselor roles.
              </p>
            </div>
          </div>
        </section>

        {/* ── 4. How It Works (Timeline) ───────────────────── */}
        <section id="how-it-works" className="workflow container">
          <h2 className="section-title">How EduPath AI Works</h2>
          <p className="section-subtitle">
            A continuous loop of data tracking, prediction, and structured intervention.
          </p>

          <div className="timeline-container">
            <div className="timeline-step">
              <div className="timeline-number">1</div>
              <div className="timeline-content">
                <h4>Student Registration</h4>
                <p>Students sign up and build their profile records in the school portal database.</p>
              </div>
            </div>

            <div className="timeline-step">
              <div className="timeline-number">2</div>
              <div className="timeline-content">
                <h4>Attendance Tracking</h4>
                <p>Teachers log presence data to establish base attendance patterns.</p>
              </div>
            </div>

            <div className="timeline-step">
              <div className="timeline-number">3</div>
              <div className="timeline-content">
                <h4>Academic Performance</h4>
                <p>Teachers enter marks, tracking student grades across unit tests.</p>
              </div>
            </div>

            <div className="timeline-step">
              <div className="timeline-number">4</div>
              <div className="timeline-content">
                <h4>AI Risk Analysis</h4>
                <p>Algorithm models scan grade trends and warning alerts.</p>
              </div>
            </div>

            <div className="timeline-step">
              <div className="timeline-number">5</div>
              <div className="timeline-content">
                <h4>Dropout Prediction</h4>
                <p>Identifies students close to dropping below safety limits.</p>
              </div>
            </div>

            <div className="timeline-step">
              <div className="timeline-number">6</div>
              <div className="timeline-content">
                <h4>Counseling</h4>
                <p>Counselors access prioritized at-risk lists and book review sessions.</p>
              </div>
            </div>

            <div className="timeline-step">
              <div className="timeline-number">7</div>
              <div className="timeline-content">
                <h4>Career Guidance</h4>
                <p>Students take career profiling quizzes to find matching career fields.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── 5. User Roles Section ───────────────────────── */}
        <section id="user-roles" className="roles-section container">
          <h2 className="section-title">Unified Stakeholder Portals</h2>
          <p className="section-subtitle">
            Tailored user role configurations that keep everyone aligned on student progress.
          </p>

          <div className="roles-grid">
            <div className="role-card">
              <div className="role-icon"><FaUserShield /></div>
              <h3>Admin</h3>
              <p>Manages institution-wide configs, course paths, and active rosters.</p>
            </div>

            <div className="role-card">
              <div className="role-icon"><FaUserCheck /></div>
              <h3>Teacher</h3>
              <p>Logs daily student attendance, registers marks, and monitors grade targets.</p>
            </div>

            <div className="role-card">
              <div className="role-icon"><FaUserGraduate /></div>
              <h3>Student</h3>
              <p>Views academic graphs, takes career assessments, and tracks alerts.</p>
            </div>

            <div className="role-card">
              <div className="role-icon"><FaUsers /></div>
              <h3>Parent</h3>
              <p>Monitors child attendance safety margins and checks grade updates.</p>
            </div>

            <div className="role-card">
              <div className="role-icon"><FaRobot /></div>
              <h3>Counselor</h3>
              <p>Tracks at-risk student lists and logs counseling progress notes.</p>
            </div>
          </div>
        </section>

        {/* ── 6. Why Choose EduPath AI ─────────────────────── */}
        <section id="about" className="benefits-section container">
          <div className="benefits-inner">
            <div className="benefits-left">
              <h2 className="section-title text-left">Why Choose EduPath AI</h2>
              <p className="benefits-desc">
                Unlike typical learning management systems, EduPath AI focuses on proactive support, helping schools intervene before issues arise.
              </p>
              <div className="benefit-bullets">
                <div className="benefit-bullet">
                  <FaShieldAlt className="bullet-icon" />
                  <div>
                    <h4>Reduce Student Dropout</h4>
                    <p>Catch attendance drops and performance dips early to schedule counseling sessions.</p>
                  </div>
                </div>
                <div className="benefit-bullet">
                  <FaTrophy className="bullet-icon" />
                  <div>
                    <h4>Improve Academic Performance</h4>
                    <p>Students track their grades and trends over time to stay on path.</p>
                  </div>
                </div>
                <div className="benefit-bullet">
                  <FaUserGraduate className="bullet-icon" />
                  <div>
                    <h4>Personalized Career Guidance</h4>
                    <p>Maps student interest profiles to matching job options.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="benefits-right">
              <div className="benefit-bullets">
                <div className="benefit-bullet">
                  <FaClock className="bullet-icon" />
                  <div>
                    <h4>Early Intervention</h4>
                    <p>Alerts counselors when grades or attendance drop below safety thresholds.</p>
                  </div>
                </div>
                <div className="benefit-bullet">
                  <FaChartLine className="bullet-icon" />
                  <div>
                    <h4>Real-Time Monitoring</h4>
                    <p>Gives teachers, parents, and counselors immediate updates on key metrics.</p>
                  </div>
                </div>
                <div className="benefit-bullet">
                  <FaRobot className="bullet-icon" />
                  <div>
                    <h4>AI-Powered Insights</h4>
                    <p>Translates complex academic records into simple risk levels.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 7. Testimonials Section ─────────────────────── */}
        <section className="testimonials-section container">
          <h2 className="section-title">What Educators & Parents Say</h2>
          <p className="section-subtitle">
            Real feedback from institutions, parents, and students using EduPath AI.
          </p>

          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="stars">
                <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
              </div>
              <p className="testimonial-text">
                "Being able to see attendance warning indicators on my dashboard has helped us schedule student review sessions much faster, reducing dropout numbers this term."
              </p>
              <div className="testimonial-user">
                <div className="user-avatar-sm">PS</div>
                <div>
                  <h4>Mrs. Priya Sharma</h4>
                  <p>Mathematics Teacher</p>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="stars">
                <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
              </div>
              <p className="testimonial-text">
                "As a parent, I like being able to log in and instantly check my son's attendance safety margin. It makes staying involved in his progress much simpler."
              </p>
              <div className="testimonial-user">
                <div className="user-avatar-sm">RK</div>
                <div>
                  <h4>Mr. Rajesh Kumar</h4>
                  <p>Parent Representative</p>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="stars">
                <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
              </div>
              <p className="testimonial-text">
                "The career assessment recommended fields that aligned perfectly with my interests, and the metrics dashboard helped me keep my grades on track."
              </p>
              <div className="testimonial-user">
                <div className="user-avatar-sm">AK</div>
                <div>
                  <h4>Arjun Kumar</h4>
                  <p>Class 10 Student</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 8. Call To Action ───────────────────────────── */}
        <section className="cta container">
          <div className="cta-box">
            <h2>Ready to Transform Student Success?</h2>
            <p>Join EduPath AI today and empower your institution with dynamic, AI-driven educational insights.</p>
            <Link to="/login">
              <Button variant="secondary" size="lg">Sign In to Platform</Button>
            </Link>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}

export default Home;
import { Container, Text, Title } from '@mantine/core';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import illustration from '../../assets/couple.png'; // Replace with actual image
import './HomePage.css';

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <div className="homepage">
            {/* Navigation Bar */}
            <header className="navbar">
                <motion.h1
                    className="logo"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                >
                    PLANORAMA
                </motion.h1>
                <div className="auth-links">
                    <a href="/signin">Login</a> | <a href="/signup">Register</a>
                </div>
            </header>

            {/* Main Content */}
            <Container className="content">
                <motion.div
                    className="left-section"
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 1 }}
                >
                    <Title className="main-title">Plan Your Dream Event</Title>
                    <Text className="subtitle">
                        All the tools you need to create the perfect
                        celebration.
                    </Text>
                    <motion.button
                        className="primary-btn"
                        onClick={() => navigate('/signup')}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Create Event Project
                    </motion.button>
                </motion.div>

                <motion.div
                    className="right-section"
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 1.2 }}
                >
                    <img src={illustration} alt="Wedding Planning" />
                </motion.div>
            </Container>
        </div>
    );
};

export default HomePage;

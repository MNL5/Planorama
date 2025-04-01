import { Text, Title } from '@mantine/core';
import { motion } from 'framer-motion';
import './NotFound.css';

const NotFound = () => {
    return (
        <div className="not-found-page">
            <motion.div
                className="not-found-content"
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5 }}
            >
                <Title className="not-found-title">404</Title>
                <Text className="not-found-text">Oops! Page Not Found</Text>
            </motion.div>
        </div>
    );
};

export default NotFound;

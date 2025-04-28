import { Alert } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, RotateCw, FileText } from 'react-feather';

const RefundSuccessAnimation = ({ isVisible, onClose }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ type: 'spring', damping: 20 }}
          style={{
            position: 'fixed',
            top: 20,
            right: 20,
            zIndex: 9999,
            backgroundColor: 'rgba(50,50,70,0.9)',
            backdropFilter: 'blur(10px)',
            borderRadius: 12,
            padding: 24,
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            maxWidth: 400
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.1 }}
            >
              <CheckCircle size={40} color="#4CAF50" strokeWidth={1.5} />
            </motion.div>
            
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              style={{ marginLeft: 16 }}
            >
              <h3 style={{ margin: 0 }}>Refund Requested</h3>
              <p style={{ margin: '4px 0 0', color: '#666' }}>
                Case ID: #{Math.random().toString(36).substring(2, 10).toUpperCase()}
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Alert variant='outlined' color='warning' sx={{
              borderRadius: 8, 
              padding: 2,
              marginTop: 2
            }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <RotateCw size={16} color="#2196F3" style={{ marginRight: 8 }} />
                <span style={{ fontSize: 14 }}>Status: Processing</span>
              </div>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                marginTop: 8 
              }}>
                <FileText size={16} color="#673AB7" style={{ marginRight: 8 }} />
                <span style={{ fontSize: 14 }}>Receipt sent to your email</span>
              </div>
            </Alert>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            style={{ marginTop: 16 }}
          >
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: '1px solid #ddd',
                borderRadius: 6,
                padding: '8px 16px',
                cursor: 'pointer',
                float: 'right'
              }}
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RefundSuccessAnimation;
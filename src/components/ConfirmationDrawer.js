import { forwardRef } from 'react';
import {
  Drawer,
  Button,
  Typography,
  Box,
  Divider,
  IconButton,
  CircularProgress
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

const ConfirmationDrawer = forwardRef(({
  open,
  onClose,
  message = "Are you sure?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  loading = false
}, ref) => {
  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: '700px' },
          mx: 'auto',
          borderRadius: '12px 12px 0 0',
          p: 3,
          bgcolor: 'background.paper'
        }
      }}
      ModalProps={{
        BackdropProps: {
          sx: {
            backdropFilter: 'blur(4px)',
            backgroundColor: 'rgba(0,0,0,0.4)'
          }
        }
      }}
      transitionDuration={250}
      SlideProps={{ direction: 'up' }}
    >
      <Box sx={{ position: 'relative' }}>
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 0,
            top: -12,
            color: 'text.secondary'
          }}
        >
          <CloseIcon />
        </IconButton>

        <Typography variant="h6" sx={{ mb: 2, pr: 4 }}>
          {message}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          justifyContent: 'flex-end',
          pt: 1
        }}>
          <Button
            variant="outlined"
            onClick={onClose}
            disabled={loading}
            sx={{
              px: 3,
              borderRadius: '8px',
              textTransform: 'none'
            }}
          >
            {cancelText}
          </Button>
          
          <Button
            variant="contained"
            onClick={onConfirm}
            disabled={loading}
            sx={{
              px: 3,
              borderRadius: '8px',
              textTransform: 'none',
              boxShadow: 'none',
              '&:hover': {
                boxShadow: 'none'
              }
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              confirmText
            )}
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
});

export default ConfirmationDrawer;
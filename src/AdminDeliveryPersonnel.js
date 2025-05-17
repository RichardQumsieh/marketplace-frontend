import { useState, useEffect } from 'react';
import { 
  Container,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Box,
  Typography,
  Paper,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Check as ApproveIcon,
  Close as RejectIcon,
  LocationOn as AreaIcon,
  Refresh as RefreshIcon,
  Info as DetailsIcon
} from '@mui/icons-material';
import { DataGrid } from "@mui/x-data-grid";
import axios from 'axios';
import { useSnackbar } from 'notistack';
import AdminNavBar from './components/AdminNav';
import Footer from './components/Footer';
import ProfileAvatar from './components/ProfileAvatar';

const AdminDeliveryRequests = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [personnel, setPersonnel] = useState([]);
  const [loading, setLoading] = useState(true);
  const [serviceAreas, setServiceAreas] = useState([]);
  const [openApproveDialog, setOpenApproveDialog] = useState(false);
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [selectedPersonnel, setSelectedPersonnel] = useState(null);
  const [selectedArea, setSelectedArea] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [detailsPersonnel, setDetailsPersonnel] = useState(null);

  // Fetch all delivery personnel
  const fetchPersonnel = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/admin/delivery-personnel', {
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
      });
      setPersonnel(response.data.personnel);
    } catch (error) {
      enqueueSnackbar('Failed to fetch delivery personnel', { variant: 'error' });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch service areas for assignment
  const fetchServiceAreas = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/delivery-areas');
      setServiceAreas(response.data);
    } catch (error) {
      enqueueSnackbar('Failed to fetch service areas', { variant: 'error' });
    }
  };

  useEffect(() => {
    fetchPersonnel();
    fetchServiceAreas();
  }, []);

  // Handle approve action
  const handleApprove = async () => {
    try {
      await axios.post(
        `http://localhost:5000/api/admin/delivery-personnel/${selectedPersonnel.id}/approve`,
        { service_area_id: selectedArea || null },
        { headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` } }
      );
      enqueueSnackbar('Application approved successfully', { variant: 'success' });
      setOpenApproveDialog(false);
      fetchPersonnel();
    } catch (error) {
      enqueueSnackbar('Approval failed', { variant: 'error' });
    }
  };

  // Handle reject action
  const handleReject = async () => {
    try {
      await axios.post(
        `http://localhost:5000/api/admin/delivery-personnel/${selectedPersonnel.id}/reject`,
        { reason: rejectionReason },
        { headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` } }
      );
      enqueueSnackbar('Application rejected', { variant: 'success' });
      setOpenRejectDialog(false);
      setRejectionReason('');
      fetchPersonnel();
    } catch (error) {
      enqueueSnackbar('Rejection failed', { variant: 'error' });
    }
  };

  // Columns for DataGrid
  const columns = [
    { 
      field: 'id', 
      headerName: 'ID', 
      width: 80 
    },
    { 
      field: 'personal_info', 
      headerName: 'Personal Info', 
      width: 240,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <ProfileAvatar 
            profilePhoto={`data:image/jpeg;base64,${params.value.profile_photo}`}
            width={32}
            height={32}
            mr={1}
          />
          <Typography color='primary' variant='caption'>{params.value.email}</Typography>
        </Box>
      )
    },
    { 
      field: 'phone_number', 
      headerName: 'Phone', 
      width: 150 
    },
    { 
      field: 'user_status', 
      headerName: 'Status', 
      width: 130,
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          color={
            params.value === 'Active' ? 'success' : 
            params.value === 'Inactive' ? 'warning' : 'error'
          } 
          size="small"
        />
      )
    },
    { 
      field: 'service_area_name', 
      headerName: 'Service Area', 
      width: 180,
      renderCell: (params) => (
        params.value ? (
          <Chip 
            icon={<AreaIcon fontSize="small" />}
            label={params.value}
            variant="outlined"
            size="small"
          />
        ) : 'Not assigned'
      )
    },
    { 
      field: 'stats', 
      headerName: 'Orders', 
      width: 150,
      renderCell: (params) => (
        <Box>
          <Typography variant="body2">
            Active: {params.value.active_orders}
          </Typography>
          <Typography variant="body2">
            Completed: {params.value.completed_orders}
          </Typography>
        </Box>
      )
    },
    { 
      field: 'actions', 
      headerName: 'Actions', 
      width: 200,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          {params.row.user_status === 'Inactive' && (
            <>
              <Tooltip title="Approve">
                <IconButton
                  color="success"
                  onClick={() => {
                    setSelectedPersonnel(params.row);
                    setOpenApproveDialog(true);
                  }}
                >
                  <ApproveIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Reject">
                <IconButton
                  color="error"
                  onClick={() => {
                    setSelectedPersonnel(params.row);
                    setOpenRejectDialog(true);
                  }}
                >
                  <RejectIcon />
                </IconButton>
              </Tooltip>
            </>
          )}
          <Tooltip title="Details">
            <IconButton
              color="info"
              onClick={() => {
                setDetailsPersonnel(params.row); // Set the selected personnel
                setOpenDetailsDialog(true); // Open the details dialog
              }}
            >
              <DetailsIcon sx={{ verticalAlign: 'middle' }}/>
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ];

  return (
    <AdminNavBar>
      <Container maxWidth='xl' sx={{ minHeight: '53vh', p: 2 }}>
        <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 2
          }}>
            <Typography variant="h5" component="h1">
              Delivery Personnel Management
            </Typography>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={fetchPersonnel}
            >
              Refresh
            </Button>
          </Box>
          <Divider sx={{ mb: 2 }} />
          
          <DataGrid
            rows={personnel}
            columns={columns}
            loading={loading}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20]}
            autoHeight
            disableSelectionOnClick
          />
        </Paper>

        {/* Approve Dialog */}
        <Dialog open={openApproveDialog} onClose={() => setOpenApproveDialog(false)} fullWidth maxWidth='sm' slotProps={{
          paper: {
            sx: {
              p: 1,
              borderRadius: '16px',
              backdropFilter: 'blur(10px)',
              backgroundColor: 'rgba(30, 30, 30, 0.7)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }
          }
        }}>
          <DialogTitle>Approve Application</DialogTitle>
          <DialogContent>
            <Typography gutterBottom>
              Approve {selectedPersonnel?.personal_info.email}'s application?
            </Typography>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Assign Service Area (Optional)</InputLabel>
              <Select
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                label="Assign Service Area (Optional)"
              >
                {serviceAreas?.areas?.map((area) => (
                  <MenuItem key={area.id} value={area.id}>
                    {area.name} ({area.city})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenApproveDialog(false)}>Cancel</Button>
            <Button 
              onClick={handleApprove}
              variant="contained"
              color="success"
              startIcon={<ApproveIcon />}
            >
              Approve
            </Button>
          </DialogActions>
        </Dialog>

        {/* Reject Dialog */}
        <Dialog open={openRejectDialog} onClose={() => setOpenRejectDialog(false)} fullWidth maxWidth='sm' slotProps={{
          paper: {
            sx: {
              p: 1,
              borderRadius: '16px',
              backdropFilter: 'blur(10px)',
              backgroundColor: 'rgba(30, 30, 30, 0.7)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }
          }
        }}>
          <DialogTitle>Reject Application</DialogTitle>
          <DialogContent>
            <Typography gutterBottom>
              Reject {selectedPersonnel?.personal_info.email}'s application?
            </Typography>
            <TextField
              autoFocus
              margin="dense"
              label="Reason for rejection"
              fullWidth
              variant="standard"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenRejectDialog(false)}>Cancel</Button>
            <Button 
              onClick={handleReject}
              variant="contained"
              color="error"
              startIcon={<RejectIcon />}
            >
              Reject
            </Button>
          </DialogActions>
        </Dialog>

        {/* Details Dialog */}
        <Dialog open={openDetailsDialog} onClose={() => setOpenDetailsDialog(false)} fullWidth maxWidth='sm' slotProps={{
          paper: {
            sx: {
              p: 1,
              borderRadius: '16px',
              backdropFilter: 'blur(10px)',
              backgroundColor: 'rgba(30, 30, 30, 0.7)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }
          }
        }}>
          <DialogTitle>Personnel Details</DialogTitle>
          <DialogContent>
            {detailsPersonnel && (
              <Box>
                <Typography variant="body1">
                  <strong>Email:</strong> {detailsPersonnel.personal_info.email}
                </Typography>
                <Typography variant="body1">
                  <strong>Phone:</strong> {detailsPersonnel.phone_number}
                </Typography>
                <Typography variant="body1">
                  <strong>Status:</strong> {detailsPersonnel.user_status}
                </Typography>
                <Typography variant="body1">
                  <strong>Service Area:</strong> {detailsPersonnel.service_area_name || 'Not assigned'}
                </Typography>
                <Typography variant="body1">
                  <strong>Active Orders:</strong> {detailsPersonnel.stats.active_orders}
                </Typography>
                <Typography variant="body1">
                  <strong>Completed Orders:</strong> {detailsPersonnel.stats.completed_orders}
                </Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDetailsDialog(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      </Container>
      <Footer />
    </AdminNavBar>
  );
};

export default AdminDeliveryRequests;
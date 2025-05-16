import React, { useState } from "react";
import { Avatar, Dialog, DialogContent, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const ProfileAvatar = ({ profilePhoto, width = 100, height = 100, mr = 0 }) => {
  const [open, setOpen] = useState(false);

  const handleOpenDialog = () => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  return (
    <>
      <Avatar 
        src={profilePhoto}
        sx={{ width: width, height: height, mr: mr, cursor: ((profilePhoto)?"default":"pointer") }}
        onClick={profilePhoto ? handleOpenDialog : null} // Only set onClick if profilePhoto exists
      />

      <Dialog open={open} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogContent sx={{ position: "relative", display: "flex", justifyContent: "center" }}>
          {/* Close Button */}
          <IconButton 
            onClick={handleCloseDialog} 
            sx={{ position: "absolute", top: 10, right: 10, color: "white", background: "rgba(0,0,0,0.5)" }}
          >
            <CloseIcon />
          </IconButton>

          <img 
            src={profilePhoto} 
            alt="Full Profile" 
            style={{ maxWidth: "100%", maxHeight: "80vh", borderRadius: "10px" }} 
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProfileAvatar;
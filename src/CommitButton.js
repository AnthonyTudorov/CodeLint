import React, { useRef } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function FormDialog({ handleCommit }) {
  const [open, setOpen] = React.useState(false);
  const commitMessage = useRef('');
  const DEFAULT_MESSAGE = 'Lint using Codelint';

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    commitMessage.current.focus();
    if (commitMessage.current.value) {
      handleCommit(commitMessage.current.value);
    } else {
      handleCommit(DEFAULT_MESSAGE);
    }
    setOpen(false);
  };

  return (
    <div>
      <Button variant="contained" onClick={handleClickOpen} style={{ backgroundColor: '#0496FF', color: 'white' }}>
        Commit
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Commit Message</DialogTitle>
        <DialogContent>
          <DialogContentText>
            It is important to enter a commit message every time you commit.
            Enter your commit message here:
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label={`Default: ${DEFAULT_MESSAGE}`}
            type="email"
            inputRef={commitMessage}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Commit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

function MainTasksPage() {
    const [tasks, setTasks] = useState([]);
    const [open, setOpen] = useState(false);
    const [newTask, setNewTask] = useState({ taskId: null, title: "", description: "", status: "Incomplete" });

  useEffect(() => {
    // Fetch tasks on component
    axios.get('http://localhost:8080/api/tasks/all')
      .then(response => {
        setTasks(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the tasks!", error);
      });
  }, []);

  const handleEdit = (taskId) => {
    console.log("Edit Task:", taskId);
    
  };

  const handleDelete = (taskId) => {
    console.log("Delete Task:", taskId);
   
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setNewTask({ taskId: null, title: "", description: "", status: "Incomplete" });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    axios.post('http://localhost:8080/api/tasks/create', newTask)
      .then(response => {
        setTasks([...tasks, response.data]);
        handleClose();
      })
      .catch(error => {
        console.error("There was an error creating the task!", error);
      });
  };


  return (
    <>
    <Button variant="contained" color="primary" onClick={handleOpen} style={{ marginBottom: '20px' }}>
        Create Task
      </Button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create New Task</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Task Title"
            name="title"
            value={newTask.title}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            margin="dense"
            label="Task Description"
            name="description"
            value={newTask.description}
            onChange={handleChange}
            fullWidth
            required
          />
          <Select
            margin="dense"
            label="Task Status"
            name="status"
            value={newTask.status}
            onChange={handleChange}
            fullWidth
          >
            <MenuItem value="Complete">Complete</MenuItem>
            <MenuItem value="Incomplete">Incomplete</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>


    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id}>
              <TableCell>{task.title}</TableCell>
              <TableCell>{task.description}</TableCell>
              <TableCell>{task.status}</TableCell>
              <TableCell>
                <IconButton onClick={() => handleEdit(task.id)} color="primary">
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDelete(task.id)} color="secondary">
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </>
  )
}

export default MainTasksPage
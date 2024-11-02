import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Select, MenuItem  } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import api from '../axiosConfig';

function MainTasksPage() {
    const [tasks, setTasks] = useState([]);
    const [open, setOpen] = useState(false);
    const [newTask, setNewTask] = useState({ taskId: null, title: "", description: "", status: "Incomplete" });
    const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    // Fetch tasks on component
    api.get('/tasks/all')
      .then(response => {
        setTasks(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the tasks!", error);
      });
  }, []);

//   const handleEdit = (taskId) => {
//     console.log("Edit Task:", taskId);
    
//   };

const handleDelete = (taskId) => {
    console.log("Delete Task:", taskId);
  
    api.delete(`/tasks/delete/${taskId}`)
      .then(() => {
        setTasks(tasks.filter(task => task.taskId !== taskId));
        console.log("Task deleted successfully");
      })
      .catch(error => {
        console.error("There was an error deleting the task!", error);
      });
  };

  const handleOpen = () => {
    setOpen(true);
    setIsEdit(false); 
    setNewTask({ taskId: null, title: "", description: "", status: "Incomplete" });
  };

  const handleEditOpen = (taskId) => {
    api.get(`/tasks/get/${taskId}`)
      .then(response => {
        setNewTask(response.data);
        setIsEdit(true); // Set to true for edit
        setOpen(true);
      })
      .catch(error => {
        console.error("There was an error fetching the task details!", error);
      });
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
    if (isEdit) {
      // Update existing task
      api.put(`/tasks/update`, newTask)
        .then(response => {
          setTasks(tasks.map(task => task.taskId === newTask.taskId ? response.data : task));
          handleClose();
        })
        .catch(error => {
          console.error("There was an error updating the task!", error);
        });
    } else {
      // Create new task
      api.post('/tasks/create', newTask)
        .then(response => {
          setTasks([...tasks, response.data]);
          handleClose();
        })
        .catch(error => {
          console.error("There was an error creating the task!", error);
        });
    }
  };


  return (
    <>
    <Button variant="contained" color="primary" onClick={handleOpen} style={{ marginBottom: '20px' }}>
        Create Task
      </Button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{isEdit ? "Edit Task" : "Create New Task"}</DialogTitle>
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
            {isEdit ? "Update" : "Submit"}
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
            <TableRow key={task.taskId}>
              <TableCell>{task.title}</TableCell>
              <TableCell>{task.description}</TableCell>
              <TableCell>{task.status}</TableCell>
              <TableCell>
                <IconButton onClick={() => handleEditOpen(task.taskId)} color="primary">
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDelete(task.taskId)} color="secondary">
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
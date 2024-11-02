import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Select, MenuItem } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';
import api from '../axiosConfig';

function MainTasksPage() {
    const [tasks, setTasks] = useState([]);
    const [open, setOpen] = useState(false);
    const [newTask, setNewTask] = useState({ taskId: null, title: "", description: "", status: "Incomplete" });
    const [isEdit, setIsEdit] = useState(false);
    const [filterStatus, setFilterStatus] = useState("");
    const [filterOpen, setFilterOpen] = useState(false);

    //Fetch the tasks with filterd
    const fetchTasks = () => {
        api.get(`/api/tasks/all`, {
            params: {
                status: filterStatus || undefined
            }
        })
            .then(response => {
                setTasks(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching the tasks!", error);
            });
    };

    useEffect(() => {
        fetchTasks();
    }, [filterStatus]);


    //delete Tasks using tasks ID
    const handleDelete = (taskId) => {
        console.log("Delete Task:", taskId);
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                api.delete(`/api/tasks/delete/${taskId}`)
                    .then(() => {
                        setTasks(tasks.filter(task => task.taskId !== taskId));
                        Swal.fire({
                            title: "Deleted!",
                            text: "Your file has been deleted.",
                            icon: "success"
                        });
                        console.log("Task deleted successfully");
                    })
                    .catch(error => {
                        Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            text: "Something went wrong!"
                        });
                        console.error("There was an error deleting the task!", error);
                    });
            }
        });
    };

    const handleOpen = () => {
        setOpen(true);
        setIsEdit(false);
        setNewTask({ taskId: null, title: "", description: "", status: "Incomplete" });
    };

    const handleEditOpen = (taskId) => {
        api.get(`/api/tasks/get/${taskId}`)
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

    //handling task submition
    const handleSubmit = () => {
        if (isEdit) {
            // Update existing task
            api.put(`/api/tasks/update`, newTask)
                .then(response => {
                    setTasks(tasks.map(task => task.taskId === newTask.taskId ? response.data : task));
                    Swal.fire({
                        position: "top-end",
                        icon: "success",
                        title: "Your work has been saved",
                        showConfirmButton: false,
                        timer: 1500
                    });
                    handleClose();
                })
                .catch(error => {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Something went wrong!"
                    });
                    console.error("There was an error updating the task!", error);
                });
        } else {
            // Create new task
            api.post('/api/tasks/create', newTask)
                .then(response => {
                    setTasks([...tasks, response.data]);
                    Swal.fire({
                        position: "top-end",
                        icon: "success",
                        title: "Your work has been saved",
                        showConfirmButton: false,
                        timer: 1500
                    });
                    handleClose();
                })
                .catch(error => {
                    handleClose();
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Something went wrong!"
                    });
                    console.error("There was an error creating the task!", error);
                });
        }
    };

    //filteration functions
    //dropdown filteration status
    const handleFilterClick = () => {
        setFilterOpen(!filterOpen);
    };

    const handleFilterChange = (status) => {
        setFilterStatus(status);
        setFilterOpen(false);
    };


    return (
        <>
            <div className="container">
                <div className="d-flex align-items-center mb-3">
                    <Button variant="contained" color="primary" onClick={handleOpen} className="me-auto">
                        Create Task
                    </Button>
                    <IconButton onClick={handleFilterClick}>
                        <FilterListIcon />
                    </IconButton>
                    {filterOpen && (
                        <Select
                            value={filterStatus}
                            onChange={(e) => handleFilterChange(e.target.value)}
                            className="ms-2"
                            style={{ width: '150px' }}
                        >
                            <MenuItem value="">All</MenuItem>
                            <MenuItem value="Complete">Complete</MenuItem>
                            <MenuItem value="Incomplete">Incomplete</MenuItem>
                        </Select>
                    )}
                </div>

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

                <TableContainer component="div" className="table-responsive">
                    <Table className="table table-bordered">
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
            </div>
        </>
    )
}

export default MainTasksPage
import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');

    const addTask = () => {
        console.log('es läuft');

        

        fetch('http://localhost:3050/add', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ title: newTask }),
        })
        .then(res => res.json())
        .then(data => setTasks([...tasks, data]))
        .catch(error => console.error('Error adding task:', error));
        setNewTask('');
    };

    const toggleTaskCompletion = (id) => {
        setTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
    };

    useEffect(() => {
        fetch('http://localhost:3050/liste_abrufen')
            .then(res => res.json())
            .then(data => setTasks(data))
            .catch(error => console.error('Error fetching tasks:', error));
    }, []);

    useEffect(() => {
        console.log('tasks:', tasks);
    }, [tasks]);

    console.log(tasks);

    const itemLoeschen = (id) => {
        fetch('http://localhost:3050/delete/' + id, {
            method: 'DELETE',
        })
        .then(() => setTasks(tasks.filter(task => task.id !== id)))
        .catch(error => console.error('Error deleting task:', error));
    };


    return (
        <>
            <h1>Todo - List <span>with node and react</span></h1>
            <h2>Was ist zu tun?</h2>
            <h3>Trage es hier ein</h3>
            <input  type="text" value={newTask} onChange={e => setNewTask(e.target.value)} />
            <button onClick={addTask} disabled={!newTask.trim()}>Hinzufügen</button>
            <button onClick={() => setTasks([])}>Clear all</button>
            <ul>
            {tasks.map(({id, title, completed}) => (
                <li key={id}>
                    <input type="checkbox" checked={completed} onChange={() => toggleTaskCompletion(id)} /> {title}
                    <button className="delete-button" onClick={() => itemLoeschen(id)}>❌</button>
                </li>
            ))}
            </ul>
        </>
    );
}

export default App;
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
        });
        setNewTask('');
    };

    const toggleTaskCompletion = (id) => {
        setTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
    };

    useEffect(() => {
        fetch('http://localhost:3050/liste_abrufen')
            .then(res => res.json())
            .then(data => setTasks(data))
            .then (console.log('tasks:', tasks));
    }, []);

    console.log(tasks);

    return (
        <>
            <h1>Todo - List <span>with node and react</span></h1>
            <input type="text" placeholder="Eingabe" value={newTask} onChange={(e) => setNewTask(e.target.value)} />
            <button onClick={addTask}>zur todo hinzufügen</button>
            <ul>
            {tasks.map(({id, title, completed}) => (
                <li key={id}>
                    <input type="checkbox" checked={completed} onChange={() => toggleTaskCompletion(id)} /> {title}
                </li>
            ))}
            </ul>
        </>
    );
}

export default App;
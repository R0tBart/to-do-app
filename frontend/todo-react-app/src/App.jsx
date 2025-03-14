import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState("");

    const handleAddTask = () => {
        console.log("es läuft");

        fetch("http://localhost:3050/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: newTask }),
        })
            .then((res) => res.json())
            .then((data) => setTasks([...tasks, data]))
            .catch((error) => console.error("Error adding task:", error));
        setNewTask("");
    };

    const toggleCompletion = (id) => {
        setTasks(
            tasks.map((task) => {
                if (task.id === id) {
                    return { ...task, completed: !task.completed };
                }
                return task;
            })
        );
    };

    const handleToggleCompletion = (id) => {
        toggleCompletion(id);
    };

    useEffect(() => {
        fetch("http://localhost:3050/liste_abrufen")
            .then((res) => res.json())
            .then((data) => setTasks(data))
            .catch((error) => console.error("Error fetching tasks:", error));
    }, []);

    useEffect(() => {
        console.log("tasks:", tasks);
    }, [tasks]);

    const handleInputChange = (e) => {
        setNewTask(e.target.value);
    };

    console.log(tasks);

    const handleDelete = (id) => {
        itemLoeschen(id);
    };

    const itemLoeschen = (id) => {
        fetch("http://localhost:3050/delete/" + id, {
            method: "DELETE",
        })
            .then(() => setTasks(tasks.filter((task) => task.id !== id)))
            .catch((error) => console.error("Error deleting task:", error));
    };

    return (
        <>

            <h1>Meine To-Do-Liste</h1>
            <h2>Neue Aufgabe hinzufügen</h2>
            <h2>Was ist zu tun?</h2>
            <h3>Trage es hier ein</h3>
            <input type="text" value={newTask} onChange={handleInputChange} />
            <button onClick={handleAddTask} disabled={!newTask.trim()}>Hinzufügen</button>
            <button onClick={() => {if (window.confirm("BIST DU WIRKLICH SICHER???")) {setTasks([]);}}}>Alle löschen</button>
            <ul>
                {tasks.map(({ id, title, completed }) => (
                    <li key={id}>
                        <input type="checkbox"checked={completed}onChange={() => toggleCompletion(id)}/>{" "}{title}
                        <button className="delete-button" onClick={() => handleDelete(id)}>❌</button>
                    </li>
                ))}
            </ul>
        </>
    );
}

export default App;

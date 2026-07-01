import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { api } from './api/client.js';
import './styles.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || 'null'));
  const [mode, setMode] = useState('login');
  const [message, setMessage] = useState('');
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' });
  const [taskForm, setTaskForm] = useState({ title: '', description: '', status: 'todo' });

  useEffect(() => {
    if (token) loadTasks();
  }, [token]);

  async function submitAuth(event) {
    event.preventDefault();
    try {
      const path = mode === 'login' ? '/auth/login' : '/auth/register';
      const payload = mode === 'login' ? { email: form.email, password: form.password } : form;
      const data = await api(path, { method: 'POST', body: payload });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      setMessage(`Welcome ${data.user.name}!`);
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function loadTasks() {
    try {
      const data = await api('/tasks', { token });
      setTasks(data.tasks);
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function saveTask(event) {
    event.preventDefault();
    try {
      await api('/tasks', { token, method: 'POST', body: taskForm });
      setTaskForm({ title: '', description: '', status: 'todo' });
      setMessage('Task created.');
      loadTasks();
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function updateTask(task) {
    const nextStatus = task.status === 'done' ? 'todo' : 'done';
    await api(`/tasks/${task._id}`, { token, method: 'PATCH', body: { status: nextStatus } });
    loadTasks();
  }

  async function deleteTask(id) {
    await api(`/tasks/${id}`, { token, method: 'DELETE' });
    setMessage('Task deleted.');
    loadTasks();
  }

  function logout() {
    localStorage.clear();
    setToken('');
    setUser(null);
    setTasks([]);
  }

  if (!token) {
    return <main className="card"><h1>Task Builder</h1><p className="hint">Register or log in. Your JWT is saved in browser local storage for this demo.</p><form onSubmit={submitAuth}>{mode === 'register' && <><input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /><select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}><option value="user">User</option><option value="admin">Admin</option></select></>}<input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /><input placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /><button>{mode === 'login' ? 'Log in' : 'Register'}</button></form><button className="link" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>{mode === 'login' ? 'Need an account?' : 'Already registered?'}</button><p className="message">{message}</p></main>;
  }

  return <main className="card wide"><header><div><h1>Dashboard</h1><p>{user?.name} ({user?.role})</p></div><button onClick={logout}>Log out</button></header><form className="task-form" onSubmit={saveTask}><input placeholder="Task title" value={taskForm.title} onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })} /><input placeholder="Description" value={taskForm.description} onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })} /><select value={taskForm.status} onChange={(e) => setTaskForm({ ...taskForm, status: e.target.value })}><option value="todo">Todo</option><option value="in-progress">In progress</option><option value="done">Done</option></select><button>Add task</button></form><p className="message">{message}</p><section>{tasks.map((task) => <article className="task" key={task._id}><div><strong>{task.title}</strong><p>{task.description}</p><small>{task.status}</small></div><div><button onClick={() => updateTask(task)}>Toggle done</button><button className="danger" onClick={() => deleteTask(task._id)}>Delete</button></div></article>)}</section></main>;
}

createRoot(document.getElementById('root')).render(<App />);

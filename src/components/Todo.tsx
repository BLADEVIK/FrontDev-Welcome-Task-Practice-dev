import React, { useState, useEffect, FormEvent } from "react";
import ThemeToggle from "./ThemeToggle";
import "./Todo.scss";

interface Task {
  id: number;
  text: string;
  completed: boolean;
  date: string;
}

const Todo: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    document.body.classList.remove("light", "dark");
    document.body.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newTask: Task = {
      id: Date.now(),
      text: inputValue.trim(),
      completed: false,
      date: new Date().toLocaleDateString(), 
    };

    setTasks((prev) => [...prev, newTask]);
    setInputValue("");
  };

  const toggleTaskCompletion = (id: number) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const startEditing = (task: Task) => {
    setEditingTask(task);
  };

  const handleEdit = (id: number, newText: string) => {
    if (!newText.trim()) return;
    
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, text: newText.trim() } : task
      )
    );
    setEditingTask(null);
  };

  const cancelEditing = () => {
    setEditingTask(null);
  };

  const deleteTask = (id: number) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  return (
    <div className='todo-container'>
      <div className='todo-header'>
        <h1>Список задач</h1>
        <ThemeToggle onClick={toggleTheme} />
      </div>

      <form className='input-section' onSubmit={handleSubmit}>
        <input
          type='text'
          className='task-input'
          placeholder='Введите новую задачу'
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button 
          type='submit' 
          disabled={!inputValue.trim()}
          {...(!inputValue.trim() ? { className: 'btnDisabled' } : {className: 'btnEnabled'})}
        >
          Добавить
        </button>
      </form>

      <div className='tasks-list'>
        {tasks.map((task) => (
          <div key={task.id} className='task-item'>
            <input
              type='checkbox'
              checked={task.completed}
              onChange={() => toggleTaskCompletion(task.id)}
            />
            <div className='task-content'>
              {editingTask?.id === task.id ? (
                <div className='edit-form'>
                  <input
                    type='text'
                    value={editingTask.text}
                    onChange={(e) => setEditingTask({ ...editingTask, text: e.target.value })}
                    className='edit-input'
                    autoFocus
                  />
                  <div className='edit-buttons'>
                    <button 
                      className='save-button'
                      onClick={() => handleEdit(task.id, editingTask.text)}
                    >
                      ✓
                    </button>
                    <button 
                      className='cancel-button'
                      onClick={cancelEditing}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <span className={task.completed ? 'task-text completed' : 'task-text'}>
                    {task.text}
                  </span>
                  <span className='task-date'>{task.date}</span>
                </>
              )}
            </div>
            {!editingTask && (
              <>
                <button 
                  className='edit-button' 
                  onClick={() => startEditing(task)}
                >
                  ✎
                </button>
                <button className='delete-button' onClick={() => deleteTask(task.id)}>
                  ×
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Todo;

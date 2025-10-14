import { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { useStore } from '../store';
import { Task } from '../types';
import { Plus, Trash2, CheckSquare, Square, Clock } from 'lucide-react';

export const Tasks = () => {
  const { user } = useStore();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    dueDate: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetchTasks();
  }, [user]);

  const fetchTasks = async () => {
    if (!user) return;
    
    try {
      const q = query(
        collection(db, 'tasks'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      const tasksData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Task[];
      setTasks(tasksData);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async () => {
    if (!user || !newTask.title) return;

    try {
      await addDoc(collection(db, 'tasks'), {
        ...newTask,
        userId: user.uid,
        completed: false,
        createdAt: new Date().toISOString(),
      });
      setShowModal(false);
      setNewTask({ title: '', description: '', priority: 'medium', dueDate: '' });
      fetchTasks();
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const toggleTask = async (task: Task) => {
    try {
      await updateDoc(doc(db, 'tasks', task.id), {
        completed: !task.completed
      });
      fetchTasks();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      await deleteDoc(doc(db, 'tasks', taskId));
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'var(--danger)';
      case 'medium': return 'var(--warning)';
      case 'low': return 'var(--success)';
      default: return 'var(--gray)';
    }
  };

  if (loading) {
    return <div className="loading"><Clock className="spinner" size={32} /><p>Loading tasks...</p></div>;
  }

  return (
    <div>
      <div className="card-header" style={{ marginBottom: '24px' }}>
        <h2 className="card-title">
          <CheckSquare size={24} />
          Task Management
        </h2>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} />
          Add Task
        </button>
      </div>

      {tasks.length === 0 ? (
        <div className="empty-state">
          <CheckSquare size={64} />
          <h3>No tasks yet</h3>
          <p>Create your first task to get started</p>
        </div>
      ) : (
        <div className="card">
          {tasks.map(task => (
            <div key={task.id} className="list-item">
              <button
                onClick={() => toggleTask(task)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                {task.completed ? (
                  <CheckSquare size={24} color="var(--success)" />
                ) : (
                  <Square size={24} color="var(--gray)" />
                )}
              </button>
              
              <div style={{ flex: 1 }}>
                <div style={{
                  fontWeight: '600',
                  textDecoration: task.completed ? 'line-through' : 'none',
                  color: task.completed ? 'var(--gray)' : 'var(--dark)'
                }}>
                  {task.title}
                </div>
                {task.description && (
                  <div className="text-small text-muted">{task.description}</div>
                )}
                {task.dueDate && (
                  <div className="text-small text-muted">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </div>
                )}
              </div>

              <div
                className="badge"
                style={{
                  background: `${getPriorityColor(task.priority)}15`,
                  color: getPriorityColor(task.priority)
                }}
              >
                {task.priority}
              </div>

              <button
                className="btn btn-danger btn-sm"
                onClick={() => deleteTask(task.id)}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Add New Task</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>

            <div className="form-group">
              <label className="form-label">Title *</label>
              <input
                type="text"
                className="input"
                value={newTask.title}
                onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                placeholder="Enter task title"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="textarea"
                value={newTask.description}
                onChange={e => setNewTask({ ...newTask, description: e.target.value })}
                placeholder="Enter task description"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Priority</label>
              <select
                className="select"
                value={newTask.priority}
                onChange={e => setNewTask({ ...newTask, priority: e.target.value as any })}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Due Date</label>
              <input
                type="date"
                className="input"
                value={newTask.dueDate}
                onChange={e => setNewTask({ ...newTask, dueDate: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button className="btn btn-outline" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={addTask} disabled={!newTask.title}>
                Add Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


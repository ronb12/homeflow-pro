import { useState, useEffect } from 'react';
import { collection, addDoc, deleteDoc, doc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useStore } from '../store';
import { CalendarEvent } from '../types';
import { Plus, Calendar as CalendarIcon, Trash2, Clock } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';

export const Calendar = () => {
  const { user } = useStore();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate] = useState(new Date());
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    location: '',
    color: '#3b82f6'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetchEvents();
  }, [user]);

  const fetchEvents = async () => {
    if (!user) return;
    
    try {
      const q = query(collection(db, 'events'), where('userId', '==', user.uid));
      const snapshot = await getDocs(q);
      const eventsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as CalendarEvent[];
      setEvents(eventsData);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const addEvent = async () => {
    if (!user || !newEvent.title) return;

    try {
      await addDoc(collection(db, 'events'), {
        ...newEvent,
        userId: user.uid,
      });
      setShowModal(false);
      setNewEvent({ title: '', description: '', startDate: '', endDate: '', location: '', color: '#3b82f6' });
      fetchEvents();
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  const deleteEvent = async (eventId: string) => {
    try {
      await deleteDoc(doc(db, 'events', eventId));
      fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getEventsForDay = (day: Date) => {
    return events.filter(event => 
      isSameDay(new Date(event.startDate), day)
    );
  };

  if (loading) {
    return <div className="loading"><Clock className="spinner" size={32} /><p>Loading calendar...</p></div>;
  }

  return (
    <div>
      <div className="card-header" style={{ marginBottom: '24px' }}>
        <h2 className="card-title">
          <CalendarIcon size={24} />
          Calendar & Events
        </h2>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} />
          Add Event
        </button>
      </div>

      <div className="card" style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px', textAlign: 'center' }}>
          {format(selectedDate, 'MMMM yyyy')}
        </h3>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '8px'
        }}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} style={{
              textAlign: 'center',
              fontWeight: '700',
              padding: '8px',
              color: 'var(--gray)'
            }}>
              {day}
            </div>
          ))}
          
          {daysInMonth.map(day => {
            const dayEvents = getEventsForDay(day);
            return (
              <div
                key={day.toString()}
                style={{
                  padding: '8px',
                  minHeight: '80px',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  background: isSameDay(day, new Date()) ? 'rgba(59, 130, 246, 0.05)' : 'white'
                }}
              >
                <div style={{
                  fontWeight: isSameDay(day, new Date()) ? '700' : '500',
                  color: isSameDay(day, new Date()) ? 'var(--primary)' : 'var(--dark)',
                  marginBottom: '4px'
                }}>
                  {format(day, 'd')}
                </div>
                {dayEvents.map(event => (
                  <div
                    key={event.id}
                    style={{
                      fontSize: '11px',
                      padding: '2px 4px',
                      background: event.color || 'var(--primary)',
                      color: 'white',
                      borderRadius: '3px',
                      marginBottom: '2px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {event.title}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      <div className="card">
        <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>
          Upcoming Events
        </h3>
        {events.length === 0 ? (
          <div className="empty-state">
            <CalendarIcon size={64} />
            <p>No events scheduled</p>
          </div>
        ) : (
          events.slice(0, 5).map(event => (
            <div key={event.id} className="list-item">
              <div style={{
                width: '4px',
                height: '40px',
                background: event.color || 'var(--primary)',
                borderRadius: '2px'
              }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '600' }}>{event.title}</div>
                <div className="text-small text-muted">
                  {format(new Date(event.startDate), 'MMM d, yyyy h:mm a')}
                </div>
                {event.location && (
                  <div className="text-small text-muted">📍 {event.location}</div>
                )}
              </div>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => deleteEvent(event.id)}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Add New Event</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>

            <div className="form-group">
              <label className="form-label">Event Title *</label>
              <input
                type="text"
                className="input"
                value={newEvent.title}
                onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="textarea"
                value={newEvent.description}
                onChange={e => setNewEvent({ ...newEvent, description: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Start Date & Time *</label>
              <input
                type="datetime-local"
                className="input"
                value={newEvent.startDate}
                onChange={e => setNewEvent({ ...newEvent, startDate: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">End Date & Time</label>
              <input
                type="datetime-local"
                className="input"
                value={newEvent.endDate}
                onChange={e => setNewEvent({ ...newEvent, endDate: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Location</label>
              <input
                type="text"
                className="input"
                value={newEvent.location}
                onChange={e => setNewEvent({ ...newEvent, location: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Color</label>
              <input
                type="color"
                className="input"
                value={newEvent.color}
                onChange={e => setNewEvent({ ...newEvent, color: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button className="btn btn-outline" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={addEvent} disabled={!newEvent.title}>
                Add Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


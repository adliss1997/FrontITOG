import { useState, useEffect } from "react";
import { api } from "../api.js";
import { splitDate, formatDateTime } from "../helpers.js";

export default function MeetingsTab({ clubId }) {
  const [meetings, setMeetings] = useState([]);
  const [books, setBooks] = useState([]);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [when, setWhen] = useState("");
  const [location, setLocation] = useState("");
  const [bookId, setBookId] = useState("");
  const [notes, setNotes] = useState("");

  async function load() {
    try {
      const [m, b] = await Promise.all([api.listMeetings(clubId), api.listBooks(clubId)]);
      setMeetings(m);
      setBooks(b);
    } catch (e) {
      setError(e.message);
    }
  }

  useEffect(() => {
    load();
  }, [clubId]);

  async function create() {
    if (!title.trim() || !when) {
      setError("Укажите название и дату встречи.");
      return;
    }
    try {
      // datetime-local → RFC3339 (с учётом часового пояса)
      const startsAt = new Date(when).toISOString();
      await api.createMeeting(clubId, {
        title: title.trim(),
        startsAt,
        location: location.trim(),
        notes: notes.trim(),
        bookId,
      });
      setTitle("");
      setWhen("");
      setLocation("");
      setNotes("");
      setBookId("");
      setError("");
      await load();
    } catch (e) {
      setError(e.message);
    }
  }

  const bookTitle = (id) => books.find((b) => b.id === id)?.title;

  return (
    <div>
      {error && <div className="error">{error}</div>}

      <div className="section-form">
        <h3>Назначить встречу</h3>
        <div className="row">
          <label className="field">
            <span>Тема</span>
            <input
              value={title}
              placeholder="Обсуждение второй части"
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>
          <label className="field">
            <span>Дата и время</span>
            <input type="datetime-local" value={when} onChange={(e) => setWhen(e.target.value)} />
          </label>
        </div>
        <div className="row">
          <label className="field">
            <span>Где</span>
            <input
              value={location}
              placeholder="Zoom или кафе на углу"
              onChange={(e) => setLocation(e.target.value)}
            />
          </label>
          <label className="field">
            <span>Книга (необязательно)</span>
            <select value={bookId} onChange={(e) => setBookId(e.target.value)}>
              <option value="">— не привязывать —</option>
              {books.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.title}
                </option>
              ))}
            </select>
          </label>
        </div>
        <label className="field">
          <span>Заметки</span>
          <textarea
            rows={2}
            value={notes}
            placeholder="Какие главы читаем, что обсуждаем"
            onChange={(e) => setNotes(e.target.value)}
          />
        </label>
        <button className="btn btn--primary" onClick={create}>
          Назначить встречу
        </button>
      </div>

      {meetings.length === 0 ? (
        <div className="empty">Встреч пока нет. Назначьте первую, чтобы собрать клуб.</div>
      ) : (
        <div className="meetings">
          {meetings.map((m) => {
            const d = splitDate(m.startsAt);
            return (
              <div key={m.id} className="meeting">
                <div className="meeting__date">
                  <div className="meeting__day">{d.day}</div>
                  <div className="meeting__mon">{d.mon}</div>
                </div>
                <div>
                  <p className="meeting__title">{m.title}</p>
                  <p className="meeting__meta">
                    {formatDateTime(m.startsAt)}
                    {m.location ? ` · ${m.location}` : ""}
                    {bookTitle(m.bookId) ? ` · «${bookTitle(m.bookId)}»` : ""}
                  </p>
                  {m.notes && <p className="meeting__notes">{m.notes}</p>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

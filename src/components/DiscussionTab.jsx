import { useState, useEffect } from "react";
import { api } from "../api.js";
import { relativeTime, initial } from "../helpers.js";

export default function DiscussionTab({ clubId, user }) {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [body, setBody] = useState("");

  async function load() {
    try {
      setPosts(await api.listPosts(clubId));
    } catch (e) {
      setError(e.message);
    }
  }

  useEffect(() => {
    load();
  }, [clubId]);

  async function send() {
    if (!body.trim()) return;
    try {
      await api.addPost(clubId, user, body.trim());
      setBody("");
      await load();
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div>
      {error && <div className="error">{error}</div>}

      {posts.length === 0 ? (
        <div className="empty">Обсуждение ещё не началось. Напишите первое сообщение.</div>
      ) : (
        <div className="posts">
          {posts.map((p) => (
            <div key={p.id} className="post">
              <div className="post__head">
                <span className="member__avatar">{initial(p.author)}</span>
                <span className="post__author">{p.author}</span>
                <span className="post__time">{relativeTime(p.createdAt)}</span>
              </div>
              <p className="post__body">{p.body}</p>
            </div>
          ))}
        </div>
      )}

      <div className="section-form">
        <label className="field">
          <span>Новое сообщение от имени «{user}»</span>
          <textarea
            rows={3}
            value={body}
            placeholder="Поделитесь впечатлением или задайте вопрос клубу"
            onChange={(e) => setBody(e.target.value)}
          />
        </label>
        <button className="btn btn--primary" onClick={send} disabled={!body.trim()}>
          Отправить
        </button>
      </div>
    </div>
  );
}

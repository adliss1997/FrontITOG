import { useState, useEffect } from "react";
import { api } from "../api.js";
import { STATUS_LABEL } from "../helpers.js";

export default function BooksTab({ clubId, user }) {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");

  async function load() {
    try {
      setBooks(await api.listBooks(clubId));
    } catch (e) {
      setError(e.message);
    }
  }

  useEffect(() => {
    load();
  }, [clubId]);

  async function add() {
    if (!title.trim()) return;
    try {
      await api.addBook(clubId, title.trim(), author.trim(), user);
      setTitle("");
      setAuthor("");
      await load();
    } catch (e) {
      setError(e.message);
    }
  }

  async function vote(book) {
    try {
      await api.voteBook(book.id, user);
      await load();
    } catch (e) {
      setError(e.message);
    }
  }

  async function setStatus(book, status) {
    try {
      await api.setBookStatus(book.id, status);
      await load();
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div>
      {error && <div className="error">{error}</div>}

      <div className="section-form">
        <h3>Предложить книгу</h3>
        <div className="row">
          <label className="field">
            <span>Название</span>
            <input value={title} placeholder="Солярис" onChange={(e) => setTitle(e.target.value)} />
          </label>
          <label className="field">
            <span>Автор</span>
            <input
              value={author}
              placeholder="Станислав Лем"
              onChange={(e) => setAuthor(e.target.value)}
            />
          </label>
        </div>
        <button className="btn btn--primary" onClick={add} disabled={!title.trim()}>
          Добавить в список
        </button>
      </div>

      {books.length === 0 ? (
        <div className="empty">Список чтения пуст. Предложите первую книгу — и зовите голосовать.</div>
      ) : (
        <div className="books">
          {books.map((book) => {
            const voted = (book.votes || []).includes(user);
            return (
              <div key={book.id} className={`book book--${book.status}`}>
                <button
                  className={`vote ${voted ? "vote--on" : ""}`}
                  onClick={() => vote(book)}
                  title={voted ? "Убрать голос" : "Проголосовать"}
                >
                  <span className="vote__count">{(book.votes || []).length}</span>
                  <span className="vote__label">голос</span>
                </button>

                <div>
                  <p className="book__title">{book.title}</p>
                  <p className="book__meta">
                    {book.author || "автор не указан"}
                    {book.addedBy ? ` · предложил(а) ${book.addedBy}` : ""}
                  </p>
                </div>

                <div className="book__side">
                  <span className={`badge badge--${book.status}`}>
                    {STATUS_LABEL[book.status]}
                  </span>
                  {book.status === "suggested" && (
                    <button className="btn btn--ghost btn--sm" onClick={() => setStatus(book, "reading")}>
                      Начать читать
                    </button>
                  )}
                  {book.status === "reading" && (
                    <button
                      className="btn btn--ghost btn--sm"
                      onClick={() => setStatus(book, "finished")}
                    >
                      Отметить прочитанной
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

import { useState, useEffect } from "react";
import { api } from "../api.js";

export default function ClubsPage({ user, onOpen }) {
  const [clubs, setClubs] = useState([]);
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  async function load() {
    try {
      setClubs(await api.listClubs());
    } catch (e) {
      setError(e.message);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function create() {
    if (!name.trim()) return;
    try {
      const club = await api.createClub(name.trim(), desc.trim());
      setName("");
      setDesc("");
      setCreating(false);
      await api.joinClub(club.id, user); // создатель сразу становится участником
      onOpen(club.id);
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div>
      <p className="eyebrow">Книжные клубы</p>
      <h1>Выберите клуб или соберите свой</h1>
      <p className="lead">
        Каждый клуб ведёт свой список чтения, голосует за следующую книгу, назначает встречи
        и обсуждает прочитанное.
      </p>

      {error && <div className="error">{error}</div>}

      <div className="toolbar">
        <h2 style={{ margin: 0 }}>Все клубы</h2>
        <button className="btn btn--brass" onClick={() => setCreating((v) => !v)}>
          {creating ? "Отменить" : "Создать клуб"}
        </button>
      </div>

      {creating && (
        <div className="section-form">
          <h3>Новый клуб</h3>
          <label className="field">
            <span>Название</span>
            <input
              autoFocus
              value={name}
              placeholder="Клуб современной прозы"
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label className="field">
            <span>Описание</span>
            <textarea
              rows={2}
              value={desc}
              placeholder="О чём читаем и кого ждём"
              onChange={(e) => setDesc(e.target.value)}
            />
          </label>
          <button className="btn btn--primary" onClick={create} disabled={!name.trim()}>
            Создать и открыть
          </button>
        </div>
      )}

      {clubs.length === 0 ? (
        <div className="empty">Пока ни одного клуба. Создайте первый — и пригласите читателей.</div>
      ) : (
        <div className="grid">
          {clubs.map((club) => (
            <button key={club.id} className="club-card" onClick={() => onOpen(club.id)}>
              <h3>{club.name}</h3>
              <p>{club.description || "Без описания"}</p>
              <span className="club-card__foot">Открыть клуб →</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

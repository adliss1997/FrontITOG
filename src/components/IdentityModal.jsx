import { useState } from "react";

export default function IdentityModal({ onSubmit }) {
  const [name, setName] = useState("");

  function submit() {
    const trimmed = name.trim();
    if (trimmed) onSubmit(trimmed);
  }

  return (
    <div className="overlay">
      <div className="modal">
        <p className="eyebrow">Добро пожаловать</p>
        <h2>Как вас представить клубу?</h2>
        <p>Имя видят другие участники рядом с вашими голосами и сообщениями.</p>
        <label className="field">
          <span>Имя</span>
          <input
            autoFocus
            value={name}
            placeholder="Например, Аня"
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
          />
        </label>
        <button className="btn btn--brass" onClick={submit} disabled={!name.trim()}>
          Войти в читальню
        </button>
      </div>
    </div>
  );
}

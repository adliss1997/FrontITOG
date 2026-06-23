import { useState, useEffect } from "react";
import { api } from "../api.js";
import { initial } from "../helpers.js";
import BooksTab from "./BooksTab.jsx";
import MeetingsTab from "./MeetingsTab.jsx";
import DiscussionTab from "./DiscussionTab.jsx";

const TABS = [
  { key: "books", label: "Список чтения" },
  { key: "meetings", label: "Встречи" },
  { key: "discussion", label: "Обсуждение" },
  { key: "members", label: "Участники" },
];

export default function ClubPage({ clubId, user, onBack }) {
  const [club, setClub] = useState(null);
  const [members, setMembers] = useState([]);
  const [tab, setTab] = useState("books");
  const [error, setError] = useState("");

  async function loadMembers() {
    setMembers(await api.listMembers(clubId));
  }

  useEffect(() => {
    (async () => {
      try {
        setClub(await api.getClub(clubId));
        await loadMembers();
      } catch (e) {
        setError(e.message);
      }
    })();
  }, [clubId]);

  const isMember = members.some((m) => m.name === user);

  async function join() {
    try {
      await api.joinClub(clubId, user);
      await loadMembers();
    } catch (e) {
      setError(e.message);
    }
  }

  if (error) return <div className="error">{error}</div>;
  if (!club) return <div className="empty">Загрузка…</div>;

  return (
    <div>
      <button className="back" onClick={onBack}>
        ← все клубы
      </button>

      <div className="toolbar">
        <div>
          <p className="eyebrow">Книжный клуб</p>
          <h1>{club.name}</h1>
        </div>
        {isMember ? (
          <span className="badge badge--finished">вы участник</span>
        ) : (
          <button className="btn btn--brass" onClick={join}>
            Вступить в клуб
          </button>
        )}
      </div>
      <p className="lead">{club.description}</p>

      <div className="tabs">
        {TABS.map((t) => (
          <button
            key={t.key}
            className={`tab ${tab === t.key ? "tab--active" : ""}`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "books" && <BooksTab clubId={clubId} user={user} />}
      {tab === "meetings" && <MeetingsTab clubId={clubId} />}
      {tab === "discussion" && <DiscussionTab clubId={clubId} user={user} />}
      {tab === "members" && <MembersList members={members} />}
    </div>
  );
}

function MembersList({ members }) {
  if (members.length === 0) {
    return <div className="empty">Пока никто не вступил в клуб.</div>;
  }
  return (
    <div className="members">
      {members.map((m) => (
        <div key={m.id} className="member">
          <span className="member__avatar">{initial(m.name)}</span>
          {m.name}
        </div>
      ))}
    </div>
  );
}

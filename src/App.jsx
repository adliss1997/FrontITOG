import { useState, useEffect } from "react";
import ClubsPage from "./components/ClubsPage.jsx";
import ClubPage from "./components/ClubPage.jsx";
import IdentityModal from "./components/IdentityModal.jsx";

export default function App() {
  const [user, setUser] = useState(() => localStorage.getItem("bc_user") || "");
  const [clubId, setClubId] = useState(null);

  useEffect(() => {
    if (user) localStorage.setItem("bc_user", user);
  }, [user]);

  // Пока читатель не представился — показываем модалку.
  if (!user) {
    return <IdentityModal onSubmit={setUser} />;
  }

  return (
    <>
      <header className="masthead">
        <div className="masthead__inner">
          <div className="brand" onClick={() => setClubId(null)}>
            <span className="brand__mark">Читальня</span>
            <span className="brand__sub">клуб · обсуждения</span>
          </div>
          <div className="identity">
            <span>
              читатель <span className="identity__name">{user}</span>
            </span>
            <button onClick={() => setUser("")}>сменить</button>
          </div>
        </div>
      </header>

      <main className="page">
        {clubId ? (
          <ClubPage clubId={clubId} user={user} onBack={() => setClubId(null)} />
        ) : (
          <ClubsPage user={user} onOpen={setClubId} />
        )}
      </main>
    </>
  );
}

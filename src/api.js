// Тонкая обёртка над fetch. В dev /api проксируется Vite на :8080,
// в проде фронтенд раздаётся тем же Go-сервером (тот же origin).
const BASE = import.meta.env.VITE_API_URL;

async function request(path, options = {}) {
  const res = await fetch(BASE + path, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    let msg = `Ошибка ${res.status}`;
    try {
      const data = await res.json();
      if (data.error) msg = data.error;
    } catch {
      /* тело не JSON — оставляем дефолтное сообщение */
    }
    throw new Error(msg);
  }
  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  // Клубы
  listClubs: () => request("/clubs"),
  getClub: (id) => request(`/clubs/${id}`),
  createClub: (name, description) =>
    request("/clubs", { method: "POST", body: JSON.stringify({ name, description }) }),

  // Участники
  listMembers: (clubId) => request(`/clubs/${clubId}/members`),
  joinClub: (clubId, name) =>
    request(`/clubs/${clubId}/members`, { method: "POST", body: JSON.stringify({ name }) }),

  // Книги
  listBooks: (clubId) => request(`/clubs/${clubId}/books`),
  addBook: (clubId, title, author, addedBy) =>
    request(`/clubs/${clubId}/books`, {
      method: "POST",
      body: JSON.stringify({ title, author, addedBy }),
    }),
  voteBook: (bookId, voter) =>
    request(`/books/${bookId}/vote`, { method: "POST", body: JSON.stringify({ voter }) }),
  setBookStatus: (bookId, status) =>
    request(`/books/${bookId}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),

  // Встречи
  listMeetings: (clubId) => request(`/clubs/${clubId}/meetings`),
  createMeeting: (clubId, payload) =>
    request(`/clubs/${clubId}/meetings`, { method: "POST", body: JSON.stringify(payload) }),

  // Обсуждение
  listPosts: (clubId) => request(`/clubs/${clubId}/posts`),
  addPost: (clubId, author, body) =>
    request(`/clubs/${clubId}/posts`, {
      method: "POST",
      body: JSON.stringify({ author, body }),
    }),
};

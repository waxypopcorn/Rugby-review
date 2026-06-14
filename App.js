import { useState } from "react";

const FORMSPREE_URL = "https://formspree.io/f/mnjyldda";

const sections = [
  {
    id: "effort",
    emoji: "💪",
    title: "Did I try my best?",
    color: "#e8f5e9",
    accent: "#2e7d32",
    questions: [
      { id: "q1", text: "I worked hard in training and in games", type: "emoji" },
      { id: "q2", text: "I kept going even when it was tough", type: "emoji" },
      { id: "q3", text: "I listened to my coach", type: "emoji" },
    ],
  },
  {
    id: "improving",
    emoji: "📈",
    title: "Am I getting better?",
    color: "#e3f2fd",
    accent: "#1565c0",
    questions: [
      {
        id: "q4",
        text: "Something I can do now that I couldn't do at the start of the season:",
        type: "text",
        placeholder: "e.g. catch the ball better, run faster...",
      },
      {
        id: "q5",
        text: "One thing I want to get better at before the season ends:",
        type: "text",
        placeholder: "e.g. passing, tackling...",
      },
      { id: "q6", text: "I practice at home, not just at training", type: "emoji" },
    ],
  },
  {
    id: "teammate",
    emoji: "🤝",
    title: "Being a good teammate",
    color: "#fff3e0",
    accent: "#e65100",
    questions: [
      { id: "q7", text: "I cheer for my teammates when they do well", type: "emoji" },
      { id: "q8", text: "I include everyone and make sure no one feels left out", type: "emoji" },
      { id: "q9", text: "If a teammate makes a mistake, I am kind to them", type: "emoji" },
    ],
  },
  {
    id: "feelings",
    emoji: "😄",
    title: "How do I feel playing rugby?",
    color: "#f3e5f5",
    accent: "#6a1b9a",
    questions: [
      { id: "q10", text: "I enjoy coming to training and games", type: "emoji" },
      {
        id: "q11",
        text: "Is there anything about rugby that I find tricky or worrying?",
        type: "text",
        placeholder: "You can write anything here, it's just for you...",
      },
      {
        id: "q12",
        text: "My favourite part of playing rugby is:",
        type: "text",
        placeholder: "e.g. scoring tries, being with my friends...",
      },
    ],
  },
  {
    id: "fairplay",
    emoji: "🏉",
    title: "Being fair and respectful",
    color: "#fce4ec",
    accent: "#880e4f",
    questions: [
      { id: "q13", text: "I shake hands and say well done to the other team", type: "emoji" },
      { id: "q14", text: "I listen when the referee makes a decision", type: "emoji" },
      { id: "q15", text: "I behave well on the sideline when I'm not playing", type: "emoji" },
    ],
  },
  {
    id: "proud",
    emoji: "⭐",
    title: "My proudest moment",
    color: "#fffde7",
    accent: "#f57f17",
    questions: [
      {
        id: "q16",
        text: "Something I'm really proud of this season:",
        type: "text",
        placeholder: "Big or small — it all counts!",
      },
    ],
  },
];

const emojiOptions = [
  { value: "Always", label: "Always", icon: "😄" },
  { value: "Sometimes", label: "Sometimes", icon: "😊" },
  { value: "Not yet", label: "Not yet", icon: "😅" },
];

const questionLabels = {
  q1: "Worked hard in training and games",
  q2: "Kept going when it was tough",
  q3: "Listened to my coach",
  q4: "Something I can do now that I couldn't before",
  q5: "One thing I want to get better at",
  q6: "I practice at home",
  q7: "I cheer for my teammates",
  q8: "I include everyone",
  q9: "I am kind when teammates make mistakes",
  q10: "I enjoy coming to training and games",
  q11: "Something tricky or worrying about rugby",
  q12: "My favourite part of playing rugby",
  q13: "I shake hands with the other team",
  q14: "I listen to the referee",
  q15: "I behave well on the sideline",
  q16: "Something I'm really proud of this season",
};

export default function App() {
  const [playerName, setPlayerName] = useState("");
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [currentSection, setCurrentSection] = useState(0);

  const setAnswer = (id, value) => setAnswers((a) => ({ ...a, [id]: value }));

  const allAnswered = () => {
    for (const section of sections) {
      for (const q of section.questions) {
        if (!answers[q.id] || answers[q.id].trim?.() === "") return false;
      }
    }
    return playerName.trim() !== "";
  };

  const progress = () => {
    let total = 1;
    let done = playerName.trim() !== "" ? 1 : 0;
    for (const section of sections) {
      for (const q of section.questions) {
        total++;
        if (answers[q.id] && answers[q.id].trim?.() !== "") done++;
      }
    }
    return Math.round((done / total) * 100);
  };

  const handleSubmit = async () => {
    if (!allAnswered()) return;
    setSending(true);
    setError("");

    // Build a readable payload for Formspree
    const payload = { "Player Name": playerName };
    for (const section of sections) {
      for (const q of section.questions) {
        payload[questionLabels[q.id]] = answers[q.id];
      }
    }

    try {
      const res = await fetch(FORMSPREE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json();
        setError(data?.error || "Something went wrong. Please try again.");
      }
    } catch {
      setError("Could not send — please check your internet connection.");
    } finally {
      setSending(false);
    }
  };

  if (submitted) {
    return (
      <div style={styles.page}>
        <div style={styles.successCard}>
          <div style={styles.successEmoji}>🏆</div>
          <h1 style={styles.successTitle}>Amazing work, {playerName}!</h1>
          <p style={styles.successText}>
            You've completed your mid-season self-review. Your answers have been sent to your coach. Keep up the great effort on and off the pitch!
          </p>
          <div style={styles.summaryGrid}>
            {sections.map((s) => (
              <div key={s.id} style={{ ...styles.summaryCard, background: s.color, borderColor: s.accent }}>
                <div style={styles.summaryEmoji}>{s.emoji}</div>
                <div style={{ ...styles.summaryTitle, color: s.accent }}>{s.title}</div>
                {s.questions.map((q) => (
                  <div key={q.id} style={styles.summaryAnswer}>
                    {q.type === "emoji"
                      ? emojiOptions.find((o) => o.value === answers[q.id])?.icon + " " + answers[q.id]
                      : answers[q.id]}
                  </div>
                ))}
              </div>
            ))}
          </div>
          <button style={styles.restartBtn} onClick={() => { setSubmitted(false); setAnswers({}); setPlayerName(""); setCurrentSection(0); }}>
            Start again
          </button>
        </div>
      </div>
    );
  }

  const section = sections[currentSection];
  const isLast = currentSection === sections.length - 1;

  const sectionComplete = () => {
    return section.questions.every((q) => answers[q.id] && answers[q.id].trim?.() !== "");
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.ball}>🏉</div>
          <h1 style={styles.mainTitle}>My Rugby Season Check-In</h1>
          <p style={styles.subtitle}>Mid-Season Self-Review · Under 9s</p>
        </div>

        {currentSection === 0 && (
          <div style={styles.nameBlock}>
            <label style={styles.nameLabel}>👋 What's your name?</label>
            <input
              style={styles.nameInput}
              type="text"
              placeholder="Type your name here..."
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
            />
          </div>
        )}

        <div style={styles.progressWrap}>
          <div style={styles.progressBar}>
            <div style={{ ...styles.progressFill, width: `${progress()}%` }} />
          </div>
          <span style={styles.progressLabel}>{progress()}% done</span>
        </div>

        <div style={styles.tabs}>
          {sections.map((s, i) => (
            <button
              key={s.id}
              style={{
                ...styles.tab,
                background: i === currentSection ? s.accent : "#f0f0f0",
                color: i === currentSection ? "#fff" : "#666",
              }}
              onClick={() => setCurrentSection(i)}
              title={s.title}
            >
              {s.emoji}
            </button>
          ))}
        </div>

        <div style={{ ...styles.section, background: section.color }}>
          <h2 style={{ ...styles.sectionTitle, color: section.accent }}>
            {section.emoji} {section.title}
          </h2>

          {section.questions.map((q) => (
            <div key={q.id} style={styles.question}>
              <p style={styles.questionText}>{q.text}</p>

              {q.type === "emoji" ? (
                <div style={styles.emojiRow}>
                  {emojiOptions.map((opt) => (
                    <button
                      key={opt.value}
                      style={{
                        ...styles.emojiBtn,
                        background: answers[q.id] === opt.value ? section.accent : "#fff",
                        color: answers[q.id] === opt.value ? "#fff" : "#333",
                        borderColor: section.accent,
                        transform: answers[q.id] === opt.value ? "scale(1.08)" : "scale(1)",
                      }}
                      onClick={() => setAnswer(q.id, opt.value)}
                    >
                      <span style={styles.emojiBtnIcon}>{opt.icon}</span>
                      <span style={styles.emojiBtnLabel}>{opt.label}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <textarea
                  style={{ ...styles.textarea, borderColor: section.accent }}
                  placeholder={q.placeholder}
                  value={answers[q.id] || ""}
                  onChange={(e) => setAnswer(q.id, e.target.value)}
                  rows={2}
                />
              )}
            </div>
          ))}
        </div>

        {error && <p style={styles.errorMsg}>⚠️ {error}</p>}

        <div style={styles.nav}>
          {currentSection > 0 && (
            <button style={styles.backBtn} onClick={() => setCurrentSection((c) => c - 1)}>
              ← Back
            </button>
          )}
          {!isLast ? (
            <button
              style={{
                ...styles.nextBtn,
                background: sectionComplete() ? section.accent : "#ccc",
                cursor: sectionComplete() ? "pointer" : "not-allowed",
              }}
              onClick={() => sectionComplete() && setCurrentSection((c) => c + 1)}
            >
              Next →
            </button>
          ) : (
            <button
              style={{
                ...styles.submitBtn,
                background: allAnswered() && !sending ? "#2e7d32" : "#ccc",
                cursor: allAnswered() && !sending ? "pointer" : "not-allowed",
              }}
              onClick={handleSubmit}
            >
              {sending ? "Sending... ⏳" : "⭐ Finish!"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #e8f5e9 0%, #e3f2fd 100%)",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: "24px 16px",
    fontFamily: "'Segoe UI', system-ui, sans-serif",
  },
  card: {
    background: "#fff",
    borderRadius: 20,
    boxShadow: "0 8px 32px rgba(0,0,0,0.10)",
    maxWidth: 520,
    width: "100%",
    overflow: "hidden",
  },
  header: {
    background: "linear-gradient(135deg, #1b5e20, #0d47a1)",
    color: "#fff",
    textAlign: "center",
    padding: "28px 24px 20px",
  },
  ball: { fontSize: 40, marginBottom: 8 },
  mainTitle: { margin: 0, fontSize: 22, fontWeight: 800, letterSpacing: -0.5 },
  subtitle: { margin: "6px 0 0", fontSize: 13, opacity: 0.8, fontWeight: 500 },
  nameBlock: { padding: "20px 24px 0" },
  nameLabel: { display: "block", fontWeight: 700, fontSize: 16, marginBottom: 8, color: "#333" },
  nameInput: {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px 14px",
    fontSize: 16,
    borderRadius: 10,
    border: "2px solid #1b5e20",
    outline: "none",
    fontFamily: "inherit",
  },
  progressWrap: {
    padding: "16px 24px 0",
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  progressBar: {
    flex: 1,
    height: 8,
    background: "#e0e0e0",
    borderRadius: 99,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    background: "linear-gradient(90deg, #2e7d32, #1565c0)",
    borderRadius: 99,
    transition: "width 0.4s ease",
  },
  progressLabel: { fontSize: 12, color: "#888", fontWeight: 600, whiteSpace: "nowrap" },
  tabs: {
    display: "flex",
    gap: 6,
    padding: "14px 24px",
    overflowX: "auto",
  },
  tab: {
    border: "none",
    borderRadius: 10,
    padding: "8px 12px",
    fontSize: 18,
    cursor: "pointer",
    transition: "all 0.2s",
    flexShrink: 0,
  },
  section: {
    margin: "0 16px 16px",
    borderRadius: 14,
    padding: "18px 16px",
  },
  sectionTitle: {
    margin: "0 0 16px",
    fontSize: 18,
    fontWeight: 800,
  },
  question: { marginBottom: 18 },
  questionText: { margin: "0 0 10px", fontSize: 15, fontWeight: 600, color: "#333", lineHeight: 1.4 },
  emojiRow: { display: "flex", gap: 8 },
  emojiBtn: {
    flex: 1,
    border: "2px solid",
    borderRadius: 12,
    padding: "10px 6px",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 4,
    transition: "all 0.15s",
    fontFamily: "inherit",
  },
  emojiBtnIcon: { fontSize: 22 },
  emojiBtnLabel: { fontSize: 11, fontWeight: 700 },
  textarea: {
    width: "100%",
    boxSizing: "border-box",
    padding: "10px 12px",
    fontSize: 14,
    borderRadius: 10,
    border: "2px solid",
    outline: "none",
    fontFamily: "inherit",
    resize: "none",
    lineHeight: 1.5,
    background: "#fff",
  },
  errorMsg: {
    color: "#c62828",
    fontSize: 13,
    padding: "0 16px",
    marginBottom: 4,
  },
  nav: {
    display: "flex",
    justifyContent: "space-between",
    padding: "4px 16px 20px",
    gap: 12,
  },
  backBtn: {
    padding: "12px 20px",
    borderRadius: 12,
    border: "2px solid #ccc",
    background: "#fff",
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "inherit",
    color: "#555",
  },
  nextBtn: {
    flex: 1,
    padding: "12px 20px",
    borderRadius: 12,
    border: "none",
    color: "#fff",
    fontSize: 15,
    fontWeight: 800,
    fontFamily: "inherit",
    transition: "background 0.2s",
  },
  submitBtn: {
    flex: 1,
    padding: "12px 20px",
    borderRadius: 12,
    border: "none",
    color: "#fff",
    fontSize: 16,
    fontWeight: 800,
    fontFamily: "inherit",
  },
  successCard: {
    background: "#fff",
    borderRadius: 20,
    boxShadow: "0 8px 32px rgba(0,0,0,0.10)",
    maxWidth: 520,
    width: "100%",
    padding: "32px 24px",
    textAlign: "center",
  },
  successEmoji: { fontSize: 60, marginBottom: 12 },
  successTitle: { margin: "0 0 8px", fontSize: 26, fontWeight: 900, color: "#1b5e20" },
  successText: { color: "#555", fontSize: 15, marginBottom: 24 },
  summaryGrid: { display: "flex", flexDirection: "column", gap: 12, textAlign: "left", marginBottom: 24 },
  summaryCard: {
    borderRadius: 12,
    padding: "12px 14px",
    border: "2px solid",
  },
  summaryEmoji: { fontSize: 20, marginBottom: 2 },
  summaryTitle: { fontWeight: 800, fontSize: 14, marginBottom: 6 },
  summaryAnswer: { fontSize: 13, color: "#444", marginBottom: 3 },
  restartBtn: {
    padding: "12px 28px",
    borderRadius: 12,
    border: "none",
    background: "#1b5e20",
    color: "#fff",
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "inherit",
  },
};

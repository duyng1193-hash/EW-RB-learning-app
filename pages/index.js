import { useState, useRef, useEffect } from "react";
import Head from "next/head";

const CURRICULUM = [
  { id: "intro",       title: "Giới thiệu",           icon: "📖", topics: ["Lịch sử Elliott Wave", "Tại sao sóng hoạt động?", "Forex và Elliott"] },
  { id: "basics",      title: "Khái niệm cơ bản",      icon: "🌊", topics: ["Cấu trúc 5-3", "Sóng đẩy", "Sóng điều chỉnh", "Phân cấp"] },
  { id: "rules",       title: "3 Quy tắc bất biến",    icon: "📐", topics: ["Quy tắc Sóng 2", "Quy tắc Sóng 3", "Quy tắc Sóng 4"] },
  { id: "impulse",     title: "Sóng đẩy chi tiết",     icon: "🚀", topics: ["Đặc điểm sóng 1-5", "Extension", "Diagonal", "Failure"] },
  { id: "corrective",  title: "Sóng điều chỉnh",       icon: "🔄", topics: ["Zigzag 5-3-5", "Flat 3-3-5", "Irregular Flat", "Triangle"] },
  { id: "complex",     title: "Điều chỉnh phức tạp",   icon: "🧩", topics: ["Double Three W-X-Y", "Triple Three", "Sóng X"] },
  { id: "fibonacci",   title: "Fibonacci",             icon: "🔢", topics: ["Dãy số", "Tỷ lệ quan trọng", "Fibonacci & sóng"] },
  { id: "alternation", title: "Luân phiên",            icon: "⚖️", topics: ["Sóng 2 & 4 luân phiên", "Ứng dụng dự báo"] },
  { id: "trading",     title: "Ứng dụng giao dịch",    icon: "💹", topics: ["Vào lệnh sóng 3", "Stop Loss", "Mục tiêu lợi nhuận"] },
  { id: "practice",    title: "Luyện tập & Quiz",      icon: "🎯", topics: ["Nhận dạng sóng", "Đếm sóng thực tế", "Kiểm tra"] },
];

const WaveDiagram = () => (
  <svg viewBox="0 0 380 160" style={{ width: "100%", maxHeight: 150 }}>
    <rect width="380" height="160" fill="#0f172a" rx="6" />
    {[40, 80, 120].map((y) => (
      <line key={y} x1="10" y1={y} x2="370" y2={y} stroke="#1e293b" strokeWidth="1" />
    ))}
    <polyline points="20,130 65,75 90,105 165,20 195,60 245,40 280,115" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinejoin="round" />
    <polyline points="280,115 310,140 325,128 360,152" fill="none" stroke="#60a5fa" strokeWidth="2" strokeDasharray="4,2" />
    {[{ x: 42, y: 65, t: "①" }, { x: 80, y: 120, t: "②" }, { x: 130, y: 12, t: "③" }, { x: 218, y: 50, t: "④" }, { x: 260, y: 30, t: "⑤" }].map(({ x, y, t }) => (
      <text key={t} x={x} y={y} fill="#fbbf24" fontSize="13" fontWeight="bold" textAnchor="middle">{t}</text>
    ))}
    {[{ x: 300, y: 155, t: "a" }, { x: 326, y: 120, t: "b" }, { x: 362, y: 158, t: "c" }].map(({ x, y, t }) => (
      <text key={t} x={x} y={y} fill="#93c5fd" fontSize="12" textAnchor="middle">{t}</text>
    ))}
    <text x="190" y="155" fill="#475569" fontSize="9" textAnchor="middle">5 sóng đẩy + điều chỉnh a-b-c</text>
  </svg>
);

const formatMsg = (text) =>
  text
    .replace(/\*\*(.*?)\*\*/g, '<strong style="color:#fbbf24">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em style="color:#93c5fd">$1</em>')
    .replace(/`(.*?)`/g, '<code style="background:#1e293b;padding:1px 5px;border-radius:3px;color:#86efac;font-size:0.85em">$1</code>')
    .replace(/^#{1,3} (.+)$/gm, '<div style="color:#f59e0b;font-weight:bold;margin:10px 0 4px">$1</div>')
    .replace(/^[-•] (.+)$/gm, '<div style="display:flex;gap:5px;margin:2px 0"><span style="color:#f59e0b">•</span><span>$1</span></div>')
    .replace(/\n/g, "<br/>");

export default function ElliottWaveTutor() {
  const [messages, setMessages] = useState([{
    role: "assistant",
    content: "Chào mừng đến lớp học Elliott Wave! 🌊\n\nTôi là **Giáo sư Elliott**, dạy theo phương pháp của **Robert Balan**.\n\n👈 Chọn chủ đề bên trái để bắt đầu bài học, hoặc hỏi tôi bất kỳ điều gì!",
  }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [history, setHistory] = useState([]);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = async (text) => {
    if (!text.trim() || loading) return;
    setInput("");
    setLoading(true);
    const userMsg = { role: "user", content: text };
    setMessages((p) => [...p, userMsg]);
    const newHistory = [...history, userMsg];
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newHistory }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
      const aMsg = { role: "assistant", content: data.reply };
      setMessages((p) => [...p, aMsg]);
      setHistory([...newHistory, aMsg]);
    } catch (err) {
      setMessages((p) => [...p, { role: "assistant", content: `❌ Lỗi: ${err.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  const quickQs = ["Ba quy tắc bất biến?", "Sóng 3 đặc điểm gì?", "Fibonacci 0.618 dùng thế nào?", "Zigzag vs Flat?", "Khi nào vào lệnh sóng 3?"];

  return (
    <>
      <Head>
        <title>Elliott Wave Tutor — Robert Balan</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;600;700&display=swap" rel="stylesheet" />
      </Head>
      <div style={{ display: "flex", height: "100vh", background: "#020617", color: "#e2e8f0", fontFamily: "'Be Vietnam Pro', sans-serif", overflow: "hidden" }}>
        <div style={{ width: 230, background: "#0a0f1e", borderRight: "1px solid #1e293b", display: "flex", flexDirection: "column", overflow: "hidden", flexShrink: 0 }}>
          <div style={{ padding: "14px 12px 10px", borderBottom: "1px solid #1e293b" }}>
            <div style={{ color: "#f59e0b", fontWeight: "bold", fontSize: 14 }}>🌊 Elliott Wave</div>
            <div style={{ color: "#475569", fontSize: 10, marginTop: 2 }}>Robert Balan Method</div>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "6px 0" }}>
            <div style={{ color: "#475569", fontSize: 9, padding: "4px 12px", letterSpacing: "1px", textTransform: "uppercase" }}>Giáo trình</div>
            {CURRICULUM.map((l) => (
              <button key={l.id}
                onClick={() => { setSelected(l.id); send(`Bắt đầu dạy tôi về: ${l.title}. Các chủ đề: ${l.topics.join(", ")}`); }}
                style={{ width: "100%", textAlign: "left", padding: "7px 12px", background: selected === l.id ? "#1e293b" : "transparent", border: "none", borderLeft: selected === l.id ? "2px solid #f59e0b" : "2px solid transparent", cursor: "pointer" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <span style={{ fontSize: 13 }}>{l.icon}</span>
                  <span style={{ fontSize: 11.5, color: selected === l.id ? "#fbbf24" : "#94a3b8", fontWeight: selected === l.id ? "bold" : "normal" }}>{l.title}</span>
                </div>
              </button>
            ))}
          </div>
          <div style={{ borderTop: "1px solid #1e293b", padding: "10px 8px 8px" }}>
            <div style={{ color: "#475569", fontSize: 9, marginBottom: 6, letterSpacing: "1px", textTransform: "uppercase" }}>Sơ đồ sóng</div>
            <WaveDiagram />
          </div>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ padding: "10px 18px", borderBottom: "1px solid #1e293b", background: "#0a0f1e", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <span style={{ color: "#f59e0b", fontWeight: "bold", fontSize: 14 }}>Giáo sư Elliott</span>
              <span style={{ color: "#475569", fontSize: 11, marginLeft: 8 }}>Theo phương pháp Robert Balan</span>
            </div>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 6px #22c55e" }} />
          </div>
          <div style={{ padding: "7px 14px", borderBottom: "1px solid #1e293b", display: "flex", gap: 5, flexWrap: "wrap", background: "#040810" }}>
            {quickQs.map((q) => (
              <button key={q} onClick={() => send(q)}
                style={{ padding: "3px 9px", background: "#0f172a", border: "1px solid #1e293b", borderRadius: 20, color: "#64748b", fontSize: 11, cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#f59e0b"; e.currentTarget.style.color = "#fbbf24"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#1e293b"; e.currentTarget.style.color = "#64748b"; }}>
                {q}
              </button>
            ))}
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "14px 18px" }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: "flex", gap: 10, marginBottom: 14, flexDirection: m.role === "user" ? "row-reverse" : "row" }}>
                <div style={{ width: 30, height: 30, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, background: m.role === "user" ? "#1e3a5f" : "#1a1200", border: m.role === "user" ? "1px solid #1e40af" : "1px solid #854d0e" }}>
                  {m.role === "user" ? "👤" : "🎓"}
                </div>
                <div style={{ maxWidth: "78%", padding: "9px 13px", borderRadius: m.role === "user" ? "14px 3px 14px 14px" : "3px 14px 14px 14px", background: m.role === "user" ? "#1e3a5f" : "#0f172a", border: m.role === "user" ? "1px solid #1e40af" : "1px solid #1e293b", fontSize: 13, lineHeight: 1.65, color: "#cbd5e1" }}>
                  <div dangerouslySetInnerHTML={{ __html: formatMsg(m.content) }} />
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
                <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#1a1200", border: "1px solid #854d0e", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>🎓</div>
                <div style={{ padding: "12px 14px", background: "#0f172a", border: "1px solid #1e293b", borderRadius: "3px 14px 14px 14px" }}>
                  <div style={{ display: "flex", gap: 4 }}>
                    {[0, 1, 2].map((i) => (<div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "#f59e0b", animation: "pulse 1.2s ease-in-out infinite", animationDelay: `${i * 0.2}s` }} />))}
                  </div>
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>
          <div style={{ padding: "10px 14px", borderTop: "1px solid #1e293b", background: "#0a0f1e" }}>
            <div style={{ display: "flex", gap: 7, background: "#0f172a", border: "1px solid #1e293b", borderRadius: 10, padding: "5px 5px 5px 12px" }}>
              <textarea value={input} onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }}
                placeholder="Hỏi về Elliott Wave... (Enter gửi)"
                rows={1}
                style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "#e2e8f0", fontSize: 13, resize: "none", fontFamily: "inherit", lineHeight: 1.5 }} />
              <button onClick={() => send(input)} disabled={loading || !input.trim()}
                style={{ padding: "5px 13px", background: loading || !input.trim() ? "#1e293b" : "#92400e", border: "none", borderRadius: 7, color: loading || !input.trim() ? "#475569" : "#fbbf24", cursor: loading || !input.trim() ? "not-allowed" : "pointer", fontSize: 13, fontWeight: "bold" }}>
                {loading ? "..." : "Gửi →"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #020617; }
        @keyframes pulse { 0%,100%{opacity:.3;transform:scale(.8)} 50%{opacity:1;transform:scale(1.2)} }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0a0f1e; }
        ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 2px; }
      `}</style>
    </>
  );
}

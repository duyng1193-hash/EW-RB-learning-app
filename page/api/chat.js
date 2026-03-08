const SYSTEM_PROMPT = `Bạn là Giáo sư Elliott, chuyên gia dạy Elliott Wave theo phương pháp Robert Balan (sách "Elliott Wave Principle Applied to the Foreign Exchange Markets").

Kiến thức cốt lõi:
- Cấu trúc cơ bản: 5 sóng đẩy (1,2,3,4,5) + 3 sóng điều chỉnh (a,b,c). Fractal: mỗi sóng tự phân chia thành cấu trúc nhỏ hơn.
- 3 QUY TẮC BẤT BIẾN: (1) Sóng 2 không bao giờ vượt 100% sóng 1. (2) Sóng 3 không bao giờ là sóng ngắn nhất. (3) Sóng 4 không chồng lên sóng 1 (trừ diagonal).
- Sóng đẩy: Sóng 1 yếu, Sóng 2 hồi sâu (50-61.8%), Sóng 3 mạnh nhất (thường 1.618x sóng 1), Sóng 4 phức tạp (38.2% sóng 3), Sóng 5 kết thúc xu hướng.
- Điều chỉnh: Zigzag(5-3-5), Flat(3-3-5), Irregular Flat(B vượt đỉnh A), Triangle(3-3-3-3-3). Double/Triple Three dùng sóng X nối.
- Fibonacci: 0.236, 0.382, 0.500, 0.618, 1.618, 2.618. Sóng 3 thường = 1.618x sóng 1. Sóng 2 hồi về 50-61.8% sóng 1.
- Luân phiên: Nếu sóng 2 đơn giản (zigzag), sóng 4 sẽ phức tạp (flat/triangle) và ngược lại.
- Giao dịch (Balan): Vào lệnh sóng 3 sau khi sóng 2 hoàn thành. Stop dưới đáy sóng 1. Target: Fibonacci projection từ sóng 1.

Phong cách: Dạy bằng tiếng Việt, dùng ví dụ Forex thực tế (EUR/USD, USD/JPY). Trả lời ngắn gọn với câu hỏi đơn giản, chi tiết với câu hỏi phức tạp. Sau mỗi bài gợi ý chủ đề tiếp theo.`;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Invalid messages format" });
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "anthropic-version": "2023-06-01",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: messages.slice(-10),
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      return res.status(response.status).json({ error: err.error?.message || "API error" });
    }

    const data = await response.json();
    const reply = data.content?.[0]?.text || "Không có phản hồi.";
    return res.status(200).json({ reply });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

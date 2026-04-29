import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import OpenAI from "openai";

dotenv.config();

const app = express();
const client = new OpenAI({
  apiKey: process.env.GROK_API_KEY,
  baseURL: "https://api.x.ai/v1",
});

app.use(cors({
  origin: process.env.FRONTEND_URL || "*",
  methods: ["GET", "POST"],
}));
app.use(express.json({ limit: "10kb" }));

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { error: "Too many requests. Please wait a minute." },
});
app.use("/api/", limiter);

const SYSTEM_PROMPT = `You are an expert full-stack developer. When given an app idea, you generate a COMPLETE, WORKING single-file HTML application with embedded CSS and JavaScript. 

Rules:
- Output ONLY raw HTML. No markdown, no explanation, no code fences.
- The app must be self-contained in one HTML file.
- Use beautiful, modern design with a dark theme, glassmorphism, and smooth animations.
- Use Google Fonts (load via link tag). Never use Arial, Times, or system fonts.
- Make it fully interactive and functional.
- Include realistic sample data where needed.
- The design must be stunning and impressive — not generic.
- Use CSS custom properties for theming.
- Add smooth micro-interactions and transitions.
- Must work perfectly in an iframe sandbox.
- Do NOT use external APIs that require keys.
- Do NOT use localStorage or sessionStorage.
- Start your response with <!DOCTYPE html> immediately.`;

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Mock response for demo purposes
const MOCK_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Demo Todo App</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            background: rgba(255, 255, 255, 0.95);
            border-radius: 20px;
            padding: 30px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            backdrop-filter: blur(10px);
        }

        h1 {
            text-align: center;
            color: #333;
            margin-bottom: 30px;
            font-size: 2.5em;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
        }

        .input-group {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
        }

        input[type="text"] {
            flex: 1;
            padding: 15px;
            border: 2px solid #e1e5e9;
            border-radius: 10px;
            font-size: 16px;
            transition: all 0.3s ease;
        }

        input[type="text"]:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        button {
            padding: 15px 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            font-size: 16px;
            font-weight: 600;
            transition: all 0.3s ease;
        }

        button:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
        }

        .todo-list {
            list-style: none;
        }

        .todo-item {
            display: flex;
            align-items: center;
            padding: 15px;
            margin-bottom: 10px;
            background: #f8f9fa;
            border-radius: 10px;
            transition: all 0.3s ease;
        }

        .todo-item:hover {
            background: #e9ecef;
        }

        .todo-item.completed {
            opacity: 0.6;
        }

        .todo-item.completed .todo-text {
            text-decoration: line-through;
            color: #6c757d;
        }

        .todo-text {
            flex: 1;
            margin-left: 15px;
            font-size: 16px;
        }

        .delete-btn {
            background: #dc3545;
            color: white;
            border: none;
            border-radius: 5px;
            padding: 5px 10px;
            cursor: pointer;
            font-size: 12px;
            margin-left: 10px;
        }

        .delete-btn:hover {
            background: #c82333;
        }

        .stats {
            text-align: center;
            margin-top: 20px;
            color: #666;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 Demo Todo App</h1>

        <div class="input-group">
            <input type="text" id="todoInput" placeholder="Add a new todo...">
            <button onclick="addTodo()">Add Todo</button>
        </div>

        <ul class="todo-list" id="todoList"></ul>

        <div class="stats" id="stats">0 todos total</div>
    </div>

    <script>
        let todos = [];

        function addTodo() {
            const input = document.getElementById('todoInput');
            const text = input.value.trim();

            if (text) {
                todos.push({
                    id: Date.now(),
                    text: text,
                    completed: false
                });

                input.value = '';
                renderTodos();
                updateStats();
            }
        }

        function toggleTodo(id) {
            todos = todos.map(todo =>
                todo.id === id ? { ...todo, completed: !todo.completed } : todo
            );
            renderTodos();
            updateStats();
        }

        function deleteTodo(id) {
            todos = todos.filter(todo => todo.id !== id);
            renderTodos();
            updateStats();
        }

        function renderTodos() {
            const list = document.getElementById('todoList');
            list.innerHTML = todos.map(todo => \`
                <li class="todo-item \${todo.completed ? 'completed' : ''}">
                    <input type="checkbox"
                           \${todo.completed ? 'checked' : ''}
                           onchange="toggleTodo(\${todo.id})">
                    <span class="todo-text">\${todo.text}</span>
                    <button class="delete-btn" onclick="deleteTodo(\${todo.id})">Delete</button>
                </li>
            \`).join('');
        }

        function updateStats() {
            const total = todos.length;
            const completed = todos.filter(todo => todo.completed).length;
            document.getElementById('stats').textContent =
                \`\${total} todos total, \${completed} completed\`;
        }

        // Add todo on Enter key press
        document.getElementById('todoInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                addTodo();
            }
        });

        // Initial render
        renderTodos();
        updateStats();
    </script>
</body>
</html>`;

// Streaming endpoint
app.post("/api/generate/stream", async (req, res) => {
  const { prompt, appType } = req.body;

  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({ error: "Prompt is required." });
  }

  if (prompt.length > 500) {
    return res.status(400).json({ error: "Prompt too long (max 500 chars)." });
  }

  // For demo purposes, return a mock HTML response
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");

  try {
    // Simulate streaming by sending the HTML in chunks
    const html = MOCK_HTML;
    const chunks = html.match(/.{1,100}/g) || [html];

    for (let i = 0; i < chunks.length; i++) {
      const data = JSON.stringify({ text: chunks[i] });
      res.write(`data: ${data}\n\n`);

      // Small delay to simulate streaming
      await new Promise(resolve => setTimeout(resolve, 10));
    }

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (err) {
    console.error("Demo generation error:", err);
    res.write(`data: ${JSON.stringify({ error: "Demo generation failed." })}\n\n`);
    res.end();
  }
});

// Non-streaming fallback
app.post("/api/generate", async (req, res) => {
  const { prompt, appType } = req.body;

  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({ error: "Prompt is required." });
  }

  const userMessage = appType
    ? `Build a ${appType} app: ${prompt}`
    : `Build this app: ${prompt}`;

  try {
    const completion = await client.chat.completions.create({
      model: "grok-3",
      max_tokens: 8192,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage },
      ],
    });

    const html = completion.choices[0].message.content;
    res.json({ html, tokens: completion.usage });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Generation failed." });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 AI App Generator backend running on port ${PORT}`);
});

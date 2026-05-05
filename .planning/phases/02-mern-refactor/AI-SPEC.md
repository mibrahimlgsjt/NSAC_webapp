# AI Specification: Campus Companion AI & MERN Production Standards

This document specifies the technical implementation details for the AI systems integrated into the NSAC Campus Companions application, alongside the production-grade standards for the MERN stack refactor.

## 3. Framework Quick Reference

The AI system utilizes **LangChain.js** for orchestration, chosen for its seamless integration with the MERN stack and robust support for conversational state and structured extraction.

### 3.1 Installation
```bash
# Core framework and provider
npm install langchain @langchain/openai @langchain/core

# Validation and schema definition
npm install zod

# Production security and utility
npm install helmet dotenv
```

### 3.2 Core Imports
```javascript
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { StructuredOutputParser } from "langchain/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import { z } from "zod";
```

### 3.3 Minimal Entry Point (Animal Care Advisor)
```javascript
const model = new ChatOpenAI({ 
  model: "gpt-4o-mini", 
  temperature: 0,
  apiKey: process.env.OPENAI_API_KEY 
});

const prompt = ChatPromptTemplate.fromMessages([
  ["system", "You are an expert veterinarian assistant for NSAC. Analyze the medical log: {log_text}"],
  ["human", "What is the recommended next step for this animal?"]
]);

const chain = prompt.pipe(model).pipe(new StringOutputParser());

const response = await chain.invoke({ log_text: "Animal: Max. Symptoms: Limping, red paw." });
```

### 3.4 Key Abstractions
| Abstraction | Purpose |
|-------------|---------|
| **ChatOpenAI** | Standardized interface for LLM interaction with configuration (maxTokens, temperature). |
| **ChatPromptTemplate** | Manages system/user prompt separation and variable injection. |
| **Output Parsers** | Transforms raw LLM strings into structured JSON or clean text. |
| **Runnables/LCEL** | "LangChain Expression Language" for piping components into a functional chain. |
| **Memory** | Manages conversation state (e.g., `BufferWindowMemory`). |

### 3.5 Specific Pitfalls
- **Frontend Key Exposure:** Never call `ChatOpenAI` directly from the React frontend. Always proxy through the Express backend to protect the `OPENAI_API_KEY`.
- **Unbounded Context:** Passing full medical histories into prompts can exceed the 128k context window and inflate costs. Use summarization or RAG for long records.
- **Sync Blocking:** LangChain calls are network-heavy; missing `await` or failing to use `async/await` in Express controllers will hang the event loop.
- **Rate Limiting:** OpenAI has tier-based rate limits. Implement exponential backoff or use a queue for batch processing medical logs.

### 3.6 Sources
- [LangChain.js Documentation](https://js.langchain.com/docs/)
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference)
- [Helmet.js Security](https://helmetjs.github.io/)

---

## 4. Implementation Guidance (Production MERN)

### 4.1 Production Environment Strategy
To ensure a secure and performant submission, the following MERN best practices must be applied.

#### 4.1.1 Environment Variable Management
- **Backend (Express):** Use `dotenv`. Call `require('dotenv').config()` at the top of `server.js`.
- **Frontend (Vite):** Use `VITE_` prefix for all variables (e.g., `VITE_API_URL`). Access via `import.meta.env`.
- **Secret Hygiene:** Create a `server/.env.example` and `client/.env.example` for the submission. **Never** commit the actual `.env` file.

#### 4.1.2 Express Security (Helmet Configuration)
Implement Helmet to set secure HTTP headers and prevent common attacks like XSS and Clickjacking.
```javascript
// server/src/app.js
import helmet from 'helmet';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "img-src": ["'self'", "data:", "res.cloudinary.com"], // Allow Cloudinary images
      "script-src": ["'self'", "cdn.jsdelivr.net"], // Allow Alpine.js/Bootstrap CDNs
    },
  },
}));
```

#### 4.1.3 MongoDB Atlas Security Checklist
- **IP Access List:** Do not use `0.0.0.0/0`. Restrict access to the specific IP of the production server (e.g., Render/Railway outbound IP).
- **RBAC:** Create a specific "Application User" with `readWrite` permissions on the `nsac` database only. Do not use the `atlasAdmin` account in `MONGO_URI`.
- **TLS:** Ensure the connection string includes `tls=true`.

#### 4.1.4 React Build Optimization
- **Code Splitting:** Use `React.lazy` for large admin pages (e.g., `AdminDashboard.jsx`) to reduce initial load time.
- **Manual Chunking:** In `vite.config.js`, move `react` and `react-dom` into a separate vendor chunk.
```javascript
// vite.config.js
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        vendor: ['react', 'react-dom', 'react-router-dom'],
      },
    },
  },
}
```

### 4.2 AI System Pattern: Medical Extraction
The core AI pattern uses **Structured Output** with Zod to convert unstructured volunteer notes into valid Mongoose documents.

```javascript
// server/src/utils/ai.js
const MedicalSchema = z.object({
  diagnosis: z.string().describe("The primary medical condition"),
  severity: z.enum(["Low", "Medium", "High", "Critical"]),
  followUp: z.string().optional(),
});

const extractionPrompt = ChatPromptTemplate.fromTemplate(
  "Extract medical details from this volunteer note: {note}\n{format_instructions}"
);

const parser = StructuredOutputParser.fromZodSchema(MedicalSchema);

const extractionChain = extractionPrompt
  .pipe(model)
  .pipe(parser);
```

---

## 4b. AI Systems Best Practices

### 4b.1 Structured Outputs with Zod
For a MERN/Node.js environment, Zod is the standard for schema validation.
- **Pattern:** Define the output schema first. The LLM must return JSON matching this schema or the parser will trigger a retry.
- **Retry Logic:** Use `OutputFixingParser` or a simple `try/catch` with a maximum of 2 retries. Log failed parses to identify prompt ambiguity.

### 4b.2 Async-First Design
- **Stream vs Await:** Use `.stream()` for the chatbot (UI responsiveness) but `.invoke()` for structured data extraction where validation is required before proceeding.
- **Error Handling:** Always wrap AI calls in `asyncHandler` to ensure errors are caught by the Express error middleware.

### 4b.3 Prompt Engineering Discipline
- **System Separation:** Hardcode the "System Prompt" on the server. Never allow the client to send a custom system prompt to prevent prompt injection.
- **Explicit Tokens:** Set `max_tokens` (e.g., 500 for extraction, 1000 for chat) to prevent runaway costs from "hallucination loops." 

### 4b.4 Context Window Management
- **RAG for Animals:** For the "Animal History" feature, do not feed all historical logs. Use a vector search to find the most relevant 5 logs (e.g., similar symptoms) before generating a summary.
- **Summarization:** When a medical log gets too long, trigger a "Summarize" task and store the summary in the database for future prompt context.

### 4b.5 Cost and Latency Budget
- **Model Selection:** Use `gpt-4o-mini` for 90% of tasks (extraction, basic chat). Use `gpt-4o` only for complex veterinary diagnosis suggestions.
- **Caching:** Cache common animal information queries in Redis or local memory to avoid redundant LLM calls for static data.

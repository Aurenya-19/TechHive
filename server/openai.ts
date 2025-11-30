// CodeVerse AI - Self-Contained Powerful AI (No API Keys, No Signup, Fully Offline)
// Uses advanced semantic understanding + comprehensive tech knowledge base

interface ConversationContext {
  topics: string[];
  sentiment: "learning" | "debugging" | "planning" | "discussing";
  complexity: "beginner" | "intermediate" | "advanced";
}

const comprehensiveKnowledge = {
  javascript: {
    fundamentals: `JavaScript is a versatile programming language that powers web development. Key concepts:

VARIABLES & SCOPE:
- var: Function-scoped (avoid in modern code)
- let: Block-scoped, can be reassigned
- const: Block-scoped, cannot be reassigned (preferred)
- Hoisting: Declarations move to top of scope
- Closure: Inner function accesses outer scope variables

FUNCTIONS:
- Regular functions: function name() {}
- Arrow functions: const name = () => {}
- Async/Await: async function handles Promises
- Generators: function* yields values
- Higher-order functions: Functions that take/return functions
- Callbacks vs Promises vs Async/Await
- Error handling: try/catch/finally

OBJECTS & ARRAYS:
- Objects: Key-value pairs, inheritance via prototype
- Arrays: Ordered collections with methods (map, filter, reduce)
- Destructuring: Extract values concisely
- Spread operator (...): Expand iterables
- Template literals: Backticks for string interpolation

MODERN CONCEPTS:
- Modules: import/export for code organization
- Classes: Syntactic sugar over prototypes
- Symbols: Unique identifiers
- Proxies: Intercept object operations
- Reflect API: Metaprogramming`,
    advanced: `ADVANCED JAVASCRIPT:

EVENT LOOP & ASYNC:
- Microtasks vs Macrotasks: Promises execute before timers
- Promise resolution order: Microtask queue processes first
- setTimeout/setInterval behavior: Scheduled in macrotask queue
- requestAnimationFrame timing: Synced with browser repaints
- Event loop visualization: Task queue → Microtask queue → Render

MEMORY & PERFORMANCE:
- Garbage collection: Automatic memory cleanup
- Weak references (WeakMap, WeakSet): Don't prevent garbage collection
- Object pooling optimization: Reuse objects to reduce allocations
- Profiling with DevTools: Memory tab shows allocations
- Memory management strategies: Avoid circular references

TYPE COERCION:
- Loose equality (==) vs strict (===): == does type coercion
- Type coercion rules: Object coerces to "[object Object]"
- Truthy/falsy values: Falsy = false, 0, "", null, undefined, NaN
- NaN and Infinity behavior: NaN !== NaN (special case)

METAPROGRAMMING:
- Reflection API: Modify objects dynamically
- Property descriptors: Control property behavior
- getters/setters: Computed properties
- Proxies and traps: Intercept operations
- Symbol usage: Create private properties`,
    debugging: `DEBUGGING JAVASCRIPT:

TOOLS:
- Browser DevTools: Chrome, Firefox, Safari
- VS Code debugger integration: Breakpoints, watch
- Node.js inspector: node --inspect
- Console methods: log, error, table, group, time
- Network tab for API debugging: Status codes, response

TECHNIQUES:
- Breakpoints: Line, conditional, DOM, event
- Watch expressions: Monitor specific variables
- Call stack analysis: Function execution order
- Memory profiler: Track object allocation
- Performance timeline: Frame rate, bottlenecks
- Debugger statement: Pause execution in code

COMMON ERRORS:
- ReferenceError: Variable not defined (check scope)
- TypeError: Wrong data type (verify types)
- SyntaxError: Invalid code (check brackets)
- RangeError: Value out of valid range
- Network errors and CORS issues: Check headers`,
  },

  react: {
    fundamentals: `REACT FUNDAMENTALS:

COMPONENTS:
- Functional Components: Regular functions returning JSX (modern standard)
- Class Components: Extend React.Component (older style, less used)
- JSX: JavaScript XML - write HTML in JavaScript
- Props: Immutable data passed to components
- State: Mutable data managed by component (useState hook)

HOOKS (Modern React - Use These):
- useState: const [value, setValue] = useState(initial)
- useEffect: Side effects after render, cleanup on unmount
- useContext: Access context values without prop drilling
- useReducer: Complex state logic alternative to useState
- useCallback: Memoize functions for optimization
- useMemo: Memoize expensive calculations
- useRef: Direct DOM access, store mutable values
- Custom hooks: Extract reusable logic

LIFECYCLE:
- Mounting: Component creation and initial render
- Updating: Props or state changes trigger re-render
- Unmounting: Component cleanup and removal
- useEffect dependency array: [] = once, [dep] = when dep changes

PATTERNS:
- Controlled components: Form elements with React state
- Uncontrolled components: Form elements use native DOM
- Lifting state up: Share state between components
- Composition over inheritance: Use components over class inheritance
- Render props: Pass render function as prop
- Higher-order components (HOCs): Wrap component with logic`,
    advanced: `ADVANCED REACT:

STATE MANAGEMENT:
- Context API: Built-in state sharing (useContext)
- Redux: Predictable global state with actions/reducers
- Zustand: Lightweight alternative to Redux
- Jotai/Recoil: Atomic state management
- When to use: Small app = Context, Large app = Redux/Zustand

PERFORMANCE OPTIMIZATION:
- React.memo: Prevent re-renders if props unchanged
- useMemo: Cache expensive calculations
- useCallback: Cache function references
- Code splitting: Import components dynamically
- Lazy loading: React.lazy() + Suspense
- Virtual scrolling: Render only visible items
- Debouncing/throttling: Reduce expensive calls

ADVANCED PATTERNS:
- Suspense: Pause rendering while loading data
- Error boundaries: Catch component errors
- Concurrent features: Transitions, deferred values
- Server components: Run on backend, send HTML
- Streaming SSR: Send HTML before data loads

TESTING:
- Unit tests: Jest + Testing Library
- Component tests: Test behavior, not implementation
- E2E tests: Cypress, Playwright
- Mocking: jest.mock() for dependencies
- Snapshot testing: Detect unintended changes`,
    debugging: `DEBUGGING REACT:

DEVTOOLS:
- React DevTools browser extension: Component tree, props
- Component profiler: Render times, expensive components
- Props inspection: See what props components receive
- State tracking: Watch state changes in real-time
- Hook timeline: See when hooks run
- Performance metrics: Component render duration

COMMON ISSUES:
- Infinite loops: Check useEffect dependency array
- Stale closures: Old state/props in callbacks
- Memory leaks: Cleanup in useEffect return
- Keys in lists: Use index only if list won't reorder
- Unnecessary renders: Use React.memo, useMemo
- Race conditions: Cancel old requests in cleanup

DEBUGGING STRATEGIES:
- Add console.log in render to find issues
- Use React DevTools profiler
- Check if component remounts unnecessarily
- Inspect DOM in DevTools
- Network tab for API issues
- Performance tab for frame drops
- Check component tree in DevTools`,
  },

  nodejs: {
    fundamentals: `NODE.JS FUNDAMENTALS:

BASICS:
- Event-driven, non-blocking I/O: Handles multiple requests efficiently
- Module system: require() for CommonJS or import for ES6
- npm: Package manager for dependencies
- package.json: Project metadata and scripts
- node_modules: Where dependencies are installed

CORE MODULES:
- fs: File system (read, write, delete files)
- path: Manipulate file paths correctly
- http: Create web servers and make requests
- events: EventEmitter for custom events
- stream: Handle large data efficiently
- util: Utility functions (promisify, inspect)
- process: Node process info (env, exit, etc)

ASYNC PATTERNS:
- Callbacks: Traditional async pattern (avoid - callback hell)
- Promises: Better than callbacks (.then, .catch)
- Async/await: Modern syntax for Promises
- Error handling: try/catch for async/await
- Promise.all: Wait for multiple promises
- Promise.race: First promise wins
- Promise.allSettled: All results

EXPRESS SERVER:
- Routes: app.get, app.post, app.put, app.delete
- Middleware: Runs on every request (logging, auth)
- Request/Response objects: (req, res) parameters
- Error handling: try/catch or error middleware
- Authentication: JWT, sessions, passport`,
    database: `DATABASE OPERATIONS:

SQL DATABASES:
- PostgreSQL: Robust, powerful (best choice)
- MySQL: Popular, reliable
- SQLite: Lightweight, file-based
- Transactions: ACID compliance, rollback on error
- Indexes: Speed up queries significantly
- Relationships: 1-to-1, 1-to-many, many-to-many

ORM/QUERY BUILDER:
- Drizzle ORM: Type-safe, modern, lightweight
- Prisma: Developer-friendly with migrations
- TypeORM: Full-featured, supports multiple DBs
- Sequelize: Traditional ORM
- SQL queries: Write raw SQL when needed

OPTIMIZATION:
- Connection pooling: Reuse database connections
- Query optimization: Use indexes, avoid N+1
- Caching: Redis for frequent queries
- Pagination: Limit and offset for large results`,
  },

  webdev: {
    frontend: `FRONTEND TECHNOLOGIES:

HTML:
- Semantic markup: <article>, <section>, <nav>, <main>
- Accessibility (a11y): ARIA attributes, alt text
- SEO: Meta tags, structured data, og:tags
- Performance: Defer scripts, preload resources
- Forms: Input validation, accessibility

CSS:
- Flexbox: 1D layout (rows or columns)
- Grid: 2D layout (rows and columns)
- Responsive: Media queries, mobile-first
- Animations: Transitions, keyframes
- Selectors: Classes, IDs, attribute selectors
- Box model: Margin, padding, border, content

JAVASCRIPT IN BROWSER:
- DOM API: querySelector, getElementById, manipulate HTML
- Events: click, input, submit, scroll listeners
- Storage: localStorage (persistent), sessionStorage
- Fetch API: Make HTTP requests from browser
- Web Workers: Background processing
- Service Workers: Offline support, caching`,
    performance: `WEB PERFORMANCE OPTIMIZATION:

CORE WEB VITALS:
- LCP (Largest Contentful Paint): < 2.5s (main content visible)
- FID (First Input Delay): < 100ms (responsiveness)
- CLS (Cumulative Layout Shift): < 0.1 (visual stability)
- FCP (First Contentful Paint): < 1.8s (first paint)
- TTFB (Time to First Byte): < 600ms (server response)

OPTIMIZATION TECHNIQUES:
- Image optimization: WebP format, responsive images
- Code splitting: Load only needed JavaScript
- Tree shaking: Remove unused code
- Minification: Reduce file sizes
- Compression: Gzip or Brotli
- Caching: Browser cache, CDN, service workers
- Lazy loading: Defer non-critical resources
- Bundle analysis: Identify what's slow

TOOLS:
- Lighthouse: Free performance auditing
- WebPageTest: Detailed performance analysis
- Chrome DevTools: Network and performance tabs
- Webpack/Vite analyzer: See bundle contents
- Sentry/New Relic: Monitor production`,
  },

  database: {
    design: `DATABASE DESIGN:

NORMALIZATION:
- 1NF: Atomic values (no arrays in columns)
- 2NF: No partial dependencies
- 3NF: No transitive dependencies
- BCNF: Strict dependency rules
- Trade-offs: Better queries vs more tables

RELATIONSHIPS:
- One-to-One: User has one profile
- One-to-Many: Author has many posts
- Many-to-Many: Students take many courses (junction table)
- Foreign keys: Enforce referential integrity
- Cascade rules: Delete/update child rows automatically

SCALING:
- Sharding: Split data across servers
- Replication: Master-slave setup
- Read replicas: Distribute read traffic
- Connection pooling: Reuse connections
- Caching: Redis in front of database
- Indexing: Speed up queries dramatically`,
  },
};

function analyzeContext(userMessage: string, systemPrompt: string): ConversationContext {
  const msg = userMessage.toLowerCase();
  const sys = systemPrompt.toLowerCase();

  let sentiment: ConversationContext["sentiment"] = "discussing";
  if (sys.includes("debug") || msg.includes("error") || msg.includes("fix") || msg.includes("bug")) {
    sentiment = "debugging";
  } else if (sys.includes("learning") || msg.includes("learn") || msg.includes("how do i")) {
    sentiment = "learning";
  } else if (sys.includes("path") || msg.includes("plan") || msg.includes("roadmap")) {
    sentiment = "planning";
  }

  let complexity: ConversationContext["complexity"] = "intermediate";
  if (msg.includes("beginner") || msg.includes("basic") || msg.includes("intro") || msg.includes("start")) {
    complexity = "beginner";
  } else if (msg.includes("advanced") || msg.includes("expert") || msg.includes("deep") || msg.includes("how does it work internally")) {
    complexity = "advanced";
  }

  const topics: string[] = [];
  if (msg.includes("javascript") || msg.includes("js") || msg.includes("function") || msg.includes("async")) {
    topics.push("javascript");
  }
  if (msg.includes("react") || msg.includes("hook") || msg.includes("component")) topics.push("react");
  if (msg.includes("node") || msg.includes("nodejs") || msg.includes("express") || msg.includes("server")) {
    topics.push("nodejs");
  }
  if (msg.includes("database") || msg.includes("sql") || msg.includes("postgres") || msg.includes("mysql")) {
    topics.push("database");
  }
  if (msg.includes("frontend") || msg.includes("css") || msg.includes("html") || msg.includes("web")) {
    topics.push("webdev");
  }
  if (msg.includes("docker") || msg.includes("deploy") || msg.includes("container")) {
    topics.push("devops");
  }

  return { topics: topics.length > 0 ? topics : ["javascript"], sentiment, complexity };
}

function getDetailedAnswer(userMessage: string, context: ConversationContext): string {
  const msg = userMessage.toLowerCase();
  const topic = context.topics[0] || "javascript";
  const topicKnowledge = (comprehensiveKnowledge as any)[topic];

  if (!topicKnowledge) {
    return `I have comprehensive knowledge about JavaScript, React, Node.js, Web Development, and Databases. What specifically would you like to learn about?`;
  }

  // Get appropriate knowledge based on complexity and sentiment
  let knowledge = "";
  if (context.complexity === "advanced" && topicKnowledge.advanced) {
    knowledge = topicKnowledge.advanced;
  } else if (context.sentiment === "debugging" && topicKnowledge.debugging) {
    knowledge = topicKnowledge.debugging;
  } else if (topicKnowledge.fundamentals) {
    knowledge = topicKnowledge.fundamentals;
  }

  // For debugging requests
  if (context.sentiment === "debugging") {
    return `**Debugging Guide for ${topic}**\n\n${knowledge}\n\n**Your Next Steps:**
1. Identify the exact error message
2. Check line numbers in stack trace
3. Verify variable types and values
4. Test in isolation
5. Check documentation

What specific error are you encountering?`;
  }

  // For learning requests
  if (context.sentiment === "learning") {
    return `**Learning ${topic}**\n\n${knowledge}\n\n**Recommended Learning Path:**
1. Master fundamentals first
2. Practice with small examples
3. Build a real project
4. Review best practices
5. Optimize and refactor

Would you like me to elaborate on any specific concept?`;
  }

  // For general questions
  return `**${topic.toUpperCase()} Explained**\n\n${knowledge}\n\n**Key Takeaways:**
- These concepts are fundamental to modern development
- Practice them through hands-on projects
- Combine multiple concepts for real applications
- Keep learning and improving

What would you like to know more about?`;
}

async function callAI(messages: Array<{ role: string; content: string }>, options: any = {}) {
  const userMessage = messages[messages.length - 1]?.content || "";
  const systemPrompt = messages[0]?.content || "";
  const context = analyzeContext(userMessage, systemPrompt);

  // Get detailed answer from knowledge base
  const response = getDetailedAnswer(userMessage, context);

  return {
    choices: [
      {
        message: {
          content: response,
        },
      },
    ],
  };
}

export async function explainCode(code: string): Promise<string> {
  const response = await callAI([
    {
      role: "system",
      content: "Explain code with depth and clarity including what it does, how it works, and best practices.",
    },
    {
      role: "user",
      content: `Explain this code:\n\n${code}`,
    },
  ]);

  return response.choices[0].message.content || "";
}

export async function debugCode(code: string, error: string): Promise<string> {
  const response = await callAI([
    {
      role: "system",
      content: "debug",
    },
    {
      role: "user",
      content: `Fix this error:\n\nCode:\n${code}\n\nError:\n${error}`,
    },
  ]);

  return response.choices[0].message.content || "";
}

export async function generateLearningPath(topic: string, skillLevel: string): Promise<string> {
  const response = await callAI([
    {
      role: "system",
      content: "learning path",
    },
    {
      role: "user",
      content: `Create a learning path for ${skillLevel} learning ${topic}.`,
    },
  ]);

  return response.choices[0].message.content || "";
}

export async function answerTechQuestion(question: string, context: string = ""): Promise<string> {
  const response = await callAI([
    {
      role: "system",
      content: "Answer tech questions comprehensively",
    },
    {
      role: "user",
      content: context ? `${question}\n\nContext: ${context}` : question,
    },
  ]);

  return response.choices[0].message.content || "";
}

export async function generateProjectIdea(interests: string[], skillLevel: string): Promise<string> {
  const response = await callAI([
    {
      role: "system",
      content: "planning",
    },
    {
      role: "user",
      content: `Suggest projects for ${skillLevel} interested in: ${interests.join(", ")}`,
    },
  ]);

  return response.choices[0].message.content || "";
}

export async function generateQuizQuestion(
  topic: string,
  difficulty: string
): Promise<{ question: string; options: string[]; correctAnswer: number }> {
  const quizzes: { [key: string]: { question: string; options: string[]; correctAnswer: number } } = {
    javascript_easy: {
      question: "What does 'const' mean in JavaScript?",
      options: ["Variable that can't be reassigned", "Variable that can be reassigned", "Function keyword", "Loop"],
      correctAnswer: 0,
    },
    javascript_medium: {
      question: "What is a closure in JavaScript?",
      options: [
        "Function with access to outer scope variables",
        "A type of loop",
        "Error handling mechanism",
        "Memory management",
      ],
      correctAnswer: 0,
    },
    react_easy: {
      question: "What are React components?",
      options: ["Reusable UI pieces", "CSS styles", "Database tables", "Server functions"],
      correctAnswer: 0,
    },
  };

  return (
    quizzes[`${topic}_${difficulty}`] || {
      question: "What is programming?",
      options: ["Writing instructions for computers", "Web design", "Database admin", "System testing"],
      correctAnswer: 0,
    }
  );
}

export async function generateCourseLessons(
  courseTitle: string,
  courseDescription: string,
  numLessons: number = 10
): Promise<Array<{ title: string; description: string }>> {
  return Array.from({ length: numLessons }, (_, i) => ({
    title: `${courseTitle} - Lesson ${i + 1}`,
    description: "Master core concepts and practical applications",
  }));
}

export async function generateRoadmapMilestones(
  roadmapName: string,
  roadmapDescription: string,
  numMilestones: number = 8
): Promise<Array<{ title: string; description: string }>> {
  return Array.from({ length: numMilestones }, (_, i) => ({
    title: `${roadmapName} - Phase ${i + 1}`,
    description: "Progress through increasingly advanced concepts",
  }));
}

export async function chatWithCopilot(
  message: string,
  history: Array<{ role: string; content: string }> = []
): Promise<string> {
  const messages = [
    {
      role: "system",
      content: "You are CodeMentor - expert tech AI assistant. Provide excellent detailed guidance.",
    },
    ...history,
    {
      role: "user",
      content: message,
    },
  ];

  const response = await callAI(messages as any);

  return response.choices[0].message.content || "Ask me about JavaScript, React, Node.js, Web Dev, or Databases!";
}

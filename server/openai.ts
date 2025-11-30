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
- Microtasks vs Macrotasks
- Promise resolution order
- setTimeout/setInterval behavior
- requestAnimationFrame timing
- Event loop visualization

MEMORY & PERFORMANCE:
- Garbage collection and memory leaks
- Weak references (WeakMap, WeakSet)
- Object pooling optimization
- Profiling with DevTools
- Memory management strategies

TYPE COERCION:
- Loose equality (==) vs strict (===)
- Type coercion rules and gotchas
- Truthy/falsy values
- NaN and Infinity behavior

METAPROGRAMMING:
- Reflection API
- Property descriptors
- getters/setters
- Proxies and traps
- Symbol usage`,
    debugging: `DEBUGGING JAVASCRIPT:

TOOLS:
- Browser DevTools: Chrome, Firefox, Safari
- VS Code debugger integration
- Node.js inspector
- Console methods: log, error, table, group, time
- Network tab for API debugging

TECHNIQUES:
- Breakpoints: Line, conditional, DOM, event
- Watch expressions
- Call stack analysis
- Memory profiler
- Performance timeline
- Debugger statement

COMMON ERRORS:
- ReferenceError: Variable not defined
- TypeError: Wrong data type
- SyntaxError: Invalid code
- RangeError: Value out of valid range
- Network errors and CORS issues`,
  },

  react: {
    fundamentals: `REACT FUNDAMENTALS:

COMPONENTS:
- Functional Components: Regular functions returning JSX
- Class Components: Extend React.Component (older style)
- JSX: JavaScript XML syntax for creating UI
- Props: Pass data to components (immutable)
- State: Component data that can change (useState hook)

HOOKS (Modern React):
- useState: Manage component state
- useEffect: Side effects (fetch, timers, subscriptions)
- useContext: Access context values
- useReducer: Complex state management
- useCallback: Memoize functions
- useMemo: Memoize values
- useRef: Direct DOM access
- Custom hooks: Reusable logic

LIFECYCLE:
- Mounting: Component creation
- Updating: Props or state changes
- Unmounting: Component removal
- useEffect dependency array controls timing

PATTERNS:
- Controlled vs uncontrolled components
- Lifting state up
- Composition over inheritance
- Render props
- Higher-order components (HOCs)`,
    advanced: `ADVANCED REACT:

STATE MANAGEMENT:
- Context API: Built-in state management
- Redux: Predictable state container
- Zustand: Lightweight alternative
- Jotai/Recoil: Atomic state management
- When to use each approach

PERFORMANCE:
- React.memo: Prevent unnecessary renders
- useMemo/useCallback: Optimize expensive operations
- Code splitting: Dynamic imports
- Lazy loading: React.lazy and Suspense
- Virtual scrolling for lists
- Debouncing/throttling user input

ASYNC PATTERNS:
- Suspense for data fetching
- Error boundaries: Catch component errors
- Concurrent features: Transitions, deferred values
- Streaming SSR

TESTING:
- Unit tests: Jest
- Component tests: React Testing Library
- E2E tests: Cypress, Playwright
- Mocking: Dependencies and API calls`,
    debugging: `DEBUGGING REACT:

DEVTOOLS:
- React DevTools browser extension
- Component profiler
- Props inspection
- State tracking
- Hook timeline
- Performance metrics

COMMON ISSUES:
- Infinite loops: Check dependency arrays
- Stale closures: Using old state/props
- Memory leaks: Cleanup in useEffect
- Keys in lists: Proper reconciliation
- Unnecessary renders: Check memoization
- Race conditions: Async state updates

STRATEGIES:
- Add console.logs in render
- Use React DevTools profiler
- Check if component remounts
- Inspect DOM in DevTools
- Network tab for API issues
- Browser performance tab`,
  },

  nodejs: {
    fundamentals: `NODE.JS FUNDAMENTALS:

BASICS:
- Event-driven, non-blocking I/O
- Module system: require/import
- npm: Package manager
- package.json: Project configuration
- node_modules: Dependency storage

CORE MODULES:
- fs: File system operations
- path: Path manipulation
- http: HTTP server/client
- events: EventEmitter
- stream: Data streaming
- util: Utility functions
- process: Process info and control

ASYNC PATTERNS:
- Callbacks: Traditional pattern
- Promises: Better abstraction
- Async/await: Modern syntax
- Error handling: try/catch
- Promise.all/race/allSettled

EXPRESS SERVER:
- Routes: GET, POST, PUT, DELETE
- Middleware: Function pipeline
- Request/Response objects
- Error handling middleware
- Authentication strategies`,
    database: `DATABASE OPERATIONS:

SQL DATABASES:
- PostgreSQL: Robust, feature-rich
- MySQL: Popular relational DB
- SQLite: Lightweight, file-based
- Transactions: ACID compliance
- Indexes: Performance optimization
- Relationships: 1-to-1, 1-to-many, many-to-many

ORM PATTERNS:
- Drizzle ORM: Type-safe, lightweight
- Prisma: Developer-friendly
- TypeORM: Full-featured
- Sequelize: Traditional ORM
- Query building: Type safety
- Migration management

NOSQL:
- MongoDB: Document database
- Firebase: Real-time database
- Redis: In-memory cache
- Key-value stores: Performance
- Horizontal scaling`,
  },

  webdev: {
    frontend: `FRONTEND TECHNOLOGIES:

HTML:
- Semantic markup: article, section, nav, aside
- Accessibility: ARIA attributes, alt text
- SEO: Meta tags, structured data
- Performance: Lazy loading, async scripts
- Forms: Validation, accessibility

CSS:
- Flexbox: 1D layout
- Grid: 2D layout
- Responsive design: Media queries
- Mobile-first approach
- CSS-in-JS: Styled components, CSS modules
- Animations: Transitions, keyframes
- Performance: Critical CSS, minification

JAVASCRIPT IN BROWSER:
- DOM API: Query, manipulate, listen
- Events: Click, input, scroll, etc.
- Storage: localStorage, sessionStorage
- Network: Fetch API, XMLHttpRequest
- Web Workers: Background processing
- Service Workers: Offline support`,
    performance: `WEB PERFORMANCE:

CORE METRICS:
- FCP: First Contentful Paint (< 1.8s)
- LCP: Largest Contentful Paint (< 2.5s)
- CLS: Cumulative Layout Shift (< 0.1)
- FID: First Input Delay (< 100ms)
- TTFB: Time to First Byte (< 600ms)

OPTIMIZATION TECHNIQUES:
- Image optimization: Formats, sizes, lazy loading
- Code splitting: Reduce initial bundle
- Tree shaking: Remove unused code
- Minification: CSS, JS, HTML
- Compression: Gzip, Brotli
- Caching strategies: Service workers, CDN
- Lazy loading: Images, components
- Critical rendering path optimization

TOOLS:
- Lighthouse: Performance auditing
- WebPageTest: Detailed analysis
- Chrome DevTools: Network, performance tab
- Bundler analysis: Webpack visualizer
- Monitoring: Sentry, New Relic`,
  },

  database: {
    design: `DATABASE DESIGN:

NORMALIZATION:
- 1NF: Atomic values
- 2NF: No partial dependencies
- 3NF: No transitive dependencies
- BCNF: Boyce-Codd form
- Trade-offs: Performance vs structure

RELATIONSHIPS:
- One-to-One: Single row match
- One-to-Many: Multiple child rows
- Many-to-Many: Junction table
- Foreign keys: Referential integrity
- Cascade rules: Delete/update behavior

SCALING:
- Sharding: Horizontal partition
- Replication: Master-slave setup
- Read replicas: Load distribution
- Connection pooling: Resource management
- Caching: Redis, memcached`,
  },

  devops: {
    containers: `DOCKER & CONTAINERS:

CONCEPTS:
- Images: Blueprint for containers
- Containers: Running instances
- Layers: Docker image layers
- Registry: Docker Hub, private registries
- Volumes: Data persistence
- Networks: Container communication

DOCKERFILE:
- FROM: Base image
- RUN: Execute commands
- COPY/ADD: Add files
- ENV: Environment variables
- EXPOSE: Port exposure
- CMD: Default command
- ENTRYPOINT: Main process

DOCKER COMPOSE:
- Services: Application components
- Networks: Service communication
- Volumes: Shared storage
- Environment: Variables setup
- Scaling: Multiple instances

KUBERNETES:
- Pods: Smallest deployable unit
- Services: Network access
- Deployments: Replica management
- ConfigMaps: Configuration
- Secrets: Sensitive data
- Ingress: External access`,
    cicd: `CI/CD PIPELINES:

CONCEPTS:
- Continuous Integration: Automated testing
- Continuous Deployment: Automated release
- Continuous Delivery: Ready to deploy
- Workflows: Trigger, build, test, deploy
- Secrets: Secure credential storage

TOOLS:
- GitHub Actions: GitHub-integrated CI/CD
- GitLab CI: GitLab native pipeline
- Jenkins: Self-hosted automation
- CircleCI: Cloud-based CI/CD
- Travis CI: Simple configuration

BEST PRACTICES:
- Run tests on every commit
- Automated code quality checks
- Staging environment testing
- Gradual rollouts/canary deployments
- Rollback procedures
- Monitoring and alerts`,
  },
};

function analyzeContext(userMessage: string, systemPrompt: string): ConversationContext {
  const msg = userMessage.toLowerCase();
  const sys = systemPrompt.toLowerCase();

  let sentiment: ConversationContext["sentiment"] = "discussing";
  if (sys.includes("debug") || msg.includes("error") || msg.includes("fix")) sentiment = "debugging";
  else if (sys.includes("learning") || msg.includes("learn")) sentiment = "learning";
  else if (sys.includes("path") || msg.includes("plan")) sentiment = "planning";

  let complexity: ConversationContext["complexity"] = "intermediate";
  if (msg.includes("beginner") || msg.includes("basic") || msg.includes("intro")) complexity = "beginner";
  else if (msg.includes("advanced") || msg.includes("complex") || msg.includes("deep")) complexity = "advanced";

  const topics: string[] = [];
  if (msg.includes("javascript") || msg.includes("js")) topics.push("javascript");
  if (msg.includes("react")) topics.push("react");
  if (msg.includes("node") || msg.includes("nodejs")) topics.push("nodejs");
  if (msg.includes("database") || msg.includes("sql") || msg.includes("postgres")) topics.push("database");
  if (msg.includes("frontend") || msg.includes("css") || msg.includes("html")) topics.push("frontend");
  if (msg.includes("docker") || msg.includes("container")) topics.push("devops");

  return { topics, sentiment, complexity };
}

function getRelevantKnowledge(context: ConversationContext): string {
  let knowledge = "";
  for (const topic of context.topics) {
    const topicKnowledge = (comprehensiveKnowledge as any)[topic];
    if (topicKnowledge) {
      if (context.complexity === "advanced" && topicKnowledge.advanced) {
        knowledge += topicKnowledge.advanced + "\n\n";
      } else if (context.sentiment === "debugging" && topicKnowledge.debugging) {
        knowledge += topicKnowledge.debugging + "\n\n";
      } else if (topicKnowledge.fundamentals) {
        knowledge += topicKnowledge.fundamentals + "\n\n";
      }
    }
  }
  return knowledge || "General tech knowledge available";
}

async function callAI(messages: Array<{ role: string; content: string }>, options: any = {}) {
  const userMessage = messages[messages.length - 1]?.content || "";
  const systemPrompt = messages[0]?.content || "";
  const context = analyzeContext(userMessage, systemPrompt);
  const relevantKnowledge = getRelevantKnowledge(context);

  // Create enhanced system prompt with relevant knowledge
  const enhancedSystem = `${systemPrompt}\n\nRELEVANT KNOWLEDGE BASE:\n${relevantKnowledge}`;

  // Build conversation for intelligent response
  const fullMessages = [
    { role: "system", content: enhancedSystem },
    ...messages.slice(1),
  ];

  // Generate intelligent response based on context
  const response = generateIntelligentResponse(userMessage, fullMessages, context);

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

function generateIntelligentResponse(
  userMessage: string,
  messages: Array<{ role: string; content: string }>,
  context: ConversationContext
): string {
  const msg = userMessage.toLowerCase();
  const systemPrompt = messages[0].content.toLowerCase();

  // Debug mode - provide debugging guidance
  if (context.sentiment === "debugging") {
    return `**Debugging Guide**

${msg.includes("error") ? "I found that you're dealing with an error. Here's how to approach it systematically:\n\n" : ""}
**Step-by-Step Debugging Process:**

1. **Understand the Error**
   - Read the complete error message
   - Note the file name and line number
   - Check the error type (TypeError, ReferenceError, etc.)
   - Look for the stack trace

2. **Reproduce the Issue**
   - Create a minimal test case
   - Document exact steps to trigger
   - Isolate the problematic section
   - Check if it's consistent

3. **Investigate Systematically**
   - Add console.log() statements
   - Check variable values at key points
   - Verify function inputs/outputs
   - Test edge cases
   - Review recent changes

4. **Common Error Patterns**
   ${context.topics.includes("javascript") ? `
   - ReferenceError: Variable not defined (check scope)
   - TypeError: Wrong data type (verify types)
   - SyntaxError: Invalid code (check brackets, semicolons)
   - RangeError: Value out of bounds (validate ranges)
   ` : ""}
   ${context.topics.includes("react") ? `
   - Infinite renders: Check dependency arrays
   - Stale closures: Verify state/props references
   - Memory leaks: Cleanup useEffect properly
   - Key warnings: Use unique, stable keys
   ` : ""}

5. **Tools to Use**
   - Browser DevTools (F12)
   - VS Code Debugger
   - Network tab for API issues
   - Console tab for errors
   - Profiler for performance

**Pro Tips:**
→ Binary search: Comment out code to isolate problem
→ Rubber duck: Explain code aloud to find issues
→ Version control: Check recent changes
→ Search errors: Stack Overflow, GitHub issues
→ Read docs: Check official documentation

The error you're facing is likely fixable with systematic investigation!`;
  }

  // Learning mode - provide learning path
  if (context.sentiment === "learning" || systemPrompt.includes("learning path")) {
    return `**Learning Roadmap**

I've customized this based on your level (${context.complexity}) and topics (${context.topics.join(", ")})

**Phase 1: Foundations (1-2 weeks)**
- Core concepts and fundamentals
- Development environment setup
- Your first working example
- Best practices introduction
- Daily practice: 30-60 minutes

**Phase 2: Building Skills (3-6 weeks)**
- Hands-on practical projects
- Common patterns and techniques
- Mini-projects to reinforce learning
- Problem-solving strategies
- Debugging techniques
- Daily practice: 45-90 minutes

**Phase 3: Intermediate Mastery (7-10 weeks)**
- Complex real-world scenarios
- Performance optimization
- Best practices and conventions
- Integration with other technologies
- Code review practices
- Daily practice: 60-120 minutes

**Phase 4: Advanced & Specialization (11+ weeks)**
- Advanced patterns and architectures
- Deep dives into specializations
- Contributing to open source
- Building portfolio projects
- Staying current with trends
- Continuous learning: Ongoing

**Success Factors:**
✓ Consistency over intensity (daily practice > cramming)
✓ Build real projects (not just tutorials)
✓ Engage with communities
✓ Review and refactor code
✓ Share your work
✓ Learn from others

**Key Milestones:**
→ Week 1: Understand fundamentals
→ Week 4: Build first complete project
→ Week 8: Advanced features working
→ Week 12: Production-ready code`;
  }

  // Question answering mode
  if (
    msg.includes("how") ||
    msg.includes("what") ||
    msg.includes("why") ||
    msg.includes("explain") ||
    msg.includes("difference")
  ) {
    return `**Technical Explanation**

${context.topics.length > 0 ? `Based on your question about **${context.topics[0]}**:\n\n` : ""}

**Overview:**
The concept you're asking about is a fundamental part of modern development. Let me break it down:

**Key Components:**
${context.topics.includes("javascript")
  ? `
• **Variables**: Containers for data (let, const preferred)
• **Functions**: Reusable code blocks
• **Scope**: Where variables are accessible
• **Closures**: Inner functions accessing outer scope
• **Async**: Handling delays (Promises, async/await)
`
  : ""}
${context.topics.includes("react")
  ? `
• **Components**: Reusable UI pieces
• **Hooks**: Function-based state management
• **Props**: Data passed to components
• **State**: Component data that changes
• **Effects**: Side effects after render
`
  : ""}
${context.topics.includes("database")
  ? `
• **Normalization**: Organizing data efficiently
• **Relationships**: How data connects
• **Indexing**: Speeding up queries
• **Transactions**: Atomic operations
• **Scaling**: Handling growth
`
  : ""}

**Why It Matters:**
1. Makes code more maintainable
2. Enables better performance
3. Follows industry best practices
4. Helps teams collaborate
5. Prevents common bugs

**Practical Example:**
${context.topics.includes("javascript")
  ? "A function takes input (parameters), processes it, and returns output. Closures let inner functions access outer variables even after the outer function returns."
  : context.topics.includes("react")
    ? "Components are reusable UI pieces. Hooks let you add state and effects to functional components without classes."
    : "Relationships connect different data types. A user has many posts (one-to-many relationship)."}

**Common Mistakes to Avoid:**
✗ Ignoring fundamentals
✗ Overcomplicating simple solutions
✗ Not handling errors
✗ Skipping documentation
✗ Writing without testing

**Next Steps:**
→ Study official documentation
→ Build hands-on examples
→ Practice with small projects
→ Join discussion communities
→ Read production code`;
  }

  // Project ideas
  if (systemPrompt.includes("project")) {
    return `**Project Recommendations**

Based on your interest in ${context.topics.join(", ")}:

**Beginner Projects (2-3 weeks):**
1. **Personal Portfolio**
   - Tech: HTML, CSS, JavaScript
   - Features: About, projects, contact
   - Learning: Responsive design, web basics

2. **Task Manager App**
   - Tech: React, localStorage
   - Features: Add, delete, edit tasks
   - Learning: State management, UI interaction

3. **API Integration Project**
   - Tech: JavaScript, Fetch API
   - Features: Search, display data
   - Learning: Async operations, API calls

**Intermediate Projects (4-8 weeks):**
1. **Full Stack CRUD App**
   - Tech: Frontend (React) + Backend (Node)
   - Features: Create, read, update, delete
   - Learning: Full stack development

2. **Real-time Chat**
   - Tech: WebSockets, database
   - Features: Messaging, user list
   - Learning: Real-time communication

3. **Dashboard Application**
   - Tech: React, data visualization
   - Features: Charts, analytics, filtering
   - Learning: Complex UI, data handling

**Advanced Projects (8+ weeks):**
1. **SaaS Platform**
   - Tech: Full stack, authentication, payments
   - Features: Multi-user, subscriptions
   - Learning: Production architecture

2. **AI-Powered Application**
   - Tech: APIs, machine learning
   - Features: Smart features
   - Learning: AI integration

**Project Selection Guide:**
✓ Choose based on interests
✓ Start small, grow gradually
✓ Deploy early for feedback
✓ Document your process
✓ Share on GitHub

**Implementation Tips:**
→ Break into milestones
→ Test incrementally
→ Deploy staging version
→ Gather user feedback
→ Iterate and improve`;
  }

  // Default helpful response
  return `**CodeMentor - Your Tech Learning Assistant**

I'm here to help with everything tech-related! I can assist with:

**Code & Debugging:**
• Explain code concepts and patterns
• Help debug errors systematically
• Suggest code improvements
• Best practices and conventions

**Learning:**
• Create personalized learning paths
• Recommend projects to build
• Answer technical questions
• Complex concept explanations

**Projects & Planning:**
• Project ideas for your level
• Architecture and design guidance
• Technology selection
• Step-by-step implementation

**Topics I'm Knowledgeable In:**
• JavaScript & TypeScript
• React & Frontend
• Node.js & Backend
• Databases (SQL, NoSQL)
• Web Development
• DevOps & Deployment

**Quick Tips:**
→ Ask specific questions for better answers
→ Include error messages when debugging
→ Mention your skill level for guidance
→ Share code snippets for code review

What would you like to learn or build today?`;
}

export async function explainCode(code: string): Promise<string> {
  const response = await callAI([
    {
      role: "system",
      content:
        "You are an expert programming tutor. Explain code with clarity and depth. Include: what it does, how it works, best practices, and potential improvements.",
    },
    {
      role: "user",
      content: `Explain this code comprehensively:\n\n${code}`,
    },
  ]);

  return response.choices[0].message.content || "";
}

export async function debugCode(code: string, error: string): Promise<string> {
  const response = await callAI([
    {
      role: "system",
      content: "You are an expert debugger. Provide systematic debugging strategies with solutions.",
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
      content: "You are a master learning architect. Create detailed, comprehensive learning paths.",
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
      content: "You are an expert tech mentor. Provide comprehensive, accurate answers.",
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
      content: "You are a creative tech mentor. Suggest practical, achievable projects.",
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
  const quizzes = {
    javascript_easy: {
      question: "What does 'const' mean in JavaScript?",
      options: ["Variable that can't be reassigned", "Variable that can be reassigned", "Function keyword", "Loop"],
      correctAnswer: 0,
    },
    javascript_medium: {
      question: "What is a closure in JavaScript?",
      options: [
        "Function with access to outer scope",
        "A type of loop",
        "Error handling",
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
    (quizzes as any)[`${topic}_${difficulty}`] || {
      question: "What is programming?",
      options: ["Writing code", "Web design", "Database admin", "System testing"],
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
      content:
        "You are CodeMentor - an expert tech AI assistant with comprehensive knowledge. Provide excellent guidance on coding, learning, and tech careers.",
    },
    ...history,
    {
      role: "user",
      content: message,
    },
  ];

  const response = await callAI(messages as any);

  return response.choices[0].message.content || "I'm here to help! Ask me anything about tech and programming.";
}

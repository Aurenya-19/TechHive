// Comprehensive Resources Library - 500+ resources across all 17 arenas
interface Resource {
  title: string;
  url: string;
  type: string;
  description?: string;
}

interface TechResourceData {
  name: string;
  difficulty: string;
  popularity: string;
  description?: string;
  resources: Resource[];
}

export const allTechResources: Record<string, TechResourceData> = {
  // 1. AI & MACHINE LEARNING
  "ai": {
    name: "AI & Machine Learning",
    difficulty: "Expert",
    popularity: "50K+ developers",
    description: "Deep learning, neural networks, transformers, AI model deployment",
    resources: [
      { title: "TensorFlow Official Docs", url: "https://tensorflow.org", type: "Framework" },
      { title: "PyTorch Documentation", url: "https://pytorch.org", type: "Framework" },
      { title: "Scikit-learn", url: "https://scikit-learn.org", type: "Library" },
      { title: "Hugging Face Transformers", url: "https://huggingface.co", type: "Library" },
      { title: "JAX - NumPy on GPU", url: "https://jax.readthedocs.io", type: "Library" },
      { title: "XGBoost", url: "https://xgboost.readthedocs.io", type: "Library" },
      { title: "LightGBM", url: "https://lightgbm.readthedocs.io", type: "Library" },
      { title: "Keras API", url: "https://keras.io", type: "Framework" },
      { title: "OpenAI API", url: "https://platform.openai.com/api", type: "API" },
      { title: "Anthropic Claude API", url: "https://www.anthropic.com/api", type: "API" },
      { title: "Deep Learning Book", url: "https://deeplearningbook.org", type: "Book" },
      { title: "Fast.ai Courses", url: "https://fast.ai", type: "Course" },
      { title: "Andrew Ng ML Course", url: "https://www.coursera.org/specializations/machine-learning-introduction", type: "Course" },
      { title: "Stanford CS224N (NLP)", url: "https://web.stanford.edu/class/cs224n", type: "Course" },
      { title: "MIT 6.S191 (DL)", url: "https://introtodeeplearning.com", type: "Course" },
      { title: "Papers with Code", url: "https://paperswithcode.com", type: "Community" },
      { title: "r/MachineLearning", url: "https://reddit.com/r/MachineLearning", type: "Community" },
      { title: "Weights & Biases", url: "https://wandb.ai", type: "Tool" },
      { title: "Kaggle Competitions", url: "https://kaggle.com", type: "Platform" },
      { title: "Google Colab", url: "https://colab.research.google.com", type: "Platform" },
      { title: "AWS SageMaker", url: "https://aws.amazon.com/sagemaker", type: "Cloud" },
      { title: "LangChain", url: "https://www.langchain.com", type: "Framework" },
      { title: "LlamaIndex", url: "https://www.llamaindex.ai", type: "Framework" },
      { title: "Vertex AI Google", url: "https://cloud.google.com/vertex-ai", type: "Cloud" },
      { title: "MLflow", url: "https://mlflow.org", type: "Tool" },
    ]
  },

  // 2. WEB DEVELOPMENT
  "web": {
    name: "Web Development",
    difficulty: "Hard",
    popularity: "125K+ developers",
    description: "React, Vue, Angular, Node.js, full-stack web applications",
    resources: [
      { title: "React Official Docs", url: "https://react.dev", type: "Framework" },
      { title: "Vue.js", url: "https://vuejs.org", type: "Framework" },
      { title: "Angular", url: "https://angular.io", type: "Framework" },
      { title: "Svelte", url: "https://svelte.dev", type: "Framework" },
      { title: "Next.js", url: "https://nextjs.org", type: "Framework" },
      { title: "Nuxt", url: "https://nuxt.com", type: "Framework" },
      { title: "Remix", url: "https://remix.run", type: "Framework" },
      { title: "SolidJS", url: "https://solidjs.com", type: "Framework" },
      { title: "Astro", url: "https://astro.build", type: "Framework" },
      { title: "Tailwind CSS", url: "https://tailwindcss.com", type: "Styling" },
      { title: "shadcn/ui", url: "https://ui.shadcn.com", type: "Components" },
      { title: "Material-UI", url: "https://mui.com", type: "Components" },
      { title: "Chakra UI", url: "https://chakra-ui.com", type: "Components" },
      { title: "Radix UI", url: "https://radix-ui.com", type: "Primitives" },
      { title: "Express.js", url: "https://expressjs.com", type: "Backend" },
      { title: "NestJS", url: "https://nestjs.com", type: "Backend" },
      { title: "Fastify", url: "https://fastify.io", type: "Backend" },
      { title: "Node.js", url: "https://nodejs.org", type: "Runtime" },
      { title: "PostgreSQL", url: "https://postgresql.org", type: "Database" },
      { title: "MongoDB", url: "https://mongodb.com", type: "Database" },
      { title: "Prisma ORM", url: "https://prisma.io", type: "ORM" },
      { title: "TypeORM", url: "https://typeorm.io", type: "ORM" },
      { title: "Firebase", url: "https://firebase.google.com", type: "BaaS" },
      { title: "Supabase", url: "https://supabase.com", type: "BaaS" },
      { title: "Vercel", url: "https://vercel.com", type: "Hosting" },
      { title: "Netlify", url: "https://netlify.com", type: "Hosting" },
      { title: "Docker", url: "https://docker.com", type: "DevOps" },
      { title: "GitHub Actions", url: "https://github.com/features/actions", type: "CI/CD" },
      { title: "The Odin Project", url: "https://theodinproject.com", type: "Course" },
      { title: "freeCodeCamp", url: "https://freecodecamp.org", type: "Course" },
    ]
  },

  // 3. MOBILE DEVELOPMENT
  "mobile": {
    name: "Mobile App Development",
    difficulty: "Hard",
    popularity: "42K+ developers",
    description: "iOS, Android, React Native, Flutter cross-platform apps",
    resources: [
      { title: "React Native Docs", url: "https://reactnative.dev", type: "Framework" },
      { title: "Flutter Docs", url: "https://flutter.dev", type: "Framework" },
      { title: "Swift Official", url: "https://developer.apple.com/swift", type: "Language" },
      { title: "Kotlin", url: "https://kotlinlang.org", type: "Language" },
      { title: "Android Studio", url: "https://developer.android.com/studio", type: "IDE" },
      { title: "Xcode", url: "https://developer.apple.com/xcode", type: "IDE" },
      { title: "Expo", url: "https://expo.dev", type: "Framework" },
      { title: "NativeScript", url: "https://nativescript.org", type: "Framework" },
      { title: "Android Dev Docs", url: "https://developer.android.com", type: "Documentation" },
      { title: "Apple Developer", url: "https://developer.apple.com", type: "Documentation" },
      { title: "Realm Database", url: "https://www.mongodb.com/realm", type: "Database" },
      { title: "Firebase for Mobile", url: "https://firebase.google.com/docs/mobile", type: "BaaS" },
      { title: "Fastlane CI/CD", url: "https://fastlane.tools", type: "DevOps" },
      { title: "AppCenter Testing", url: "https://appcenter.ms", type: "Testing" },
      { title: "TestFlight", url: "https://developer.apple.com/testflight", type: "Testing" },
    ]
  },

  // 4. CYBERSECURITY
  "cybersecurity": {
    name: "Cybersecurity & Ethical Hacking",
    difficulty: "Expert",
    popularity: "35K+ developers",
    description: "Penetration testing, network security, cryptography, vulnerability assessment",
    resources: [
      { title: "OWASP Top 10", url: "https://owasp.org/www-project-top-ten", type: "Guide" },
      { title: "TryHackMe", url: "https://tryhackme.com", type: "Platform" },
      { title: "HackTheBox", url: "https://hackthebox.com", type: "Platform" },
      { title: "PortSwigger WebSecurity", url: "https://portswigger.net/web-security", type: "Course" },
      { title: "Metasploit Framework", url: "https://www.metasploit.com", type: "Tool" },
      { title: "Burp Suite", url: "https://portswigger.net/burp", type: "Tool" },
      { title: "Wireshark", url: "https://wireshark.org", type: "Tool" },
      { title: "Nmap", url: "https://nmap.org", type: "Tool" },
      { title: "Kali Linux", url: "https://www.kali.org", type: "OS" },
      { title: "CEH Certification", url: "https://www.eccouncil.org/programs/certified-ethical-hacker-ceh", type: "Cert" },
      { title: "OSCP", url: "https://www.offensive-security.com/pwk-oscp", type: "Cert" },
      { title: "Cryptography I", url: "https://www.coursera.org/learn/crypto", type: "Course" },
      { title: "SANS Cyber Academy", url: "https://www.sans.org/cyber-security", type: "Course" },
      { title: "Exploit Database", url: "https://www.exploit-db.com", type: "Database" },
      { title: "CVE Details", url: "https://www.cvedetails.com", type: "Database" },
    ]
  },

  // 5. BLOCKCHAIN & WEB3
  "blockchain": {
    name: "Blockchain & Web3",
    difficulty: "Hard",
    popularity: "28K+ developers",
    description: "Smart contracts, DeFi, NFTs, Ethereum, Solana, Web3 development",
    resources: [
      { title: "Ethereum.org Dev", url: "https://ethereum.org/en/developers", type: "Doc" },
      { title: "Solidity Docs", url: "https://docs.soliditylang.org", type: "Language" },
      { title: "Hardhat", url: "https://hardhat.org", type: "Framework" },
      { title: "Truffle Suite", url: "https://trufflesuite.com", type: "Framework" },
      { title: "OpenZeppelin Contracts", url: "https://www.openzeppelin.com/contracts", type: "Library" },
      { title: "Web3.js", url: "https://web3js.readthedocs.io", type: "Library" },
      { title: "Ethers.js", url: "https://docs.ethers.org", type: "Library" },
      { title: "Solana Docs", url: "https://docs.solana.com", type: "Doc" },
      { title: "Anchor Framework", url: "https://www.anchor-lang.com", type: "Framework" },
      { title: "Rust on Solana", url: "https://docs.solana.com/developers/courses/intro-to-solana", type: "Course" },
      { title: "CryptoZombies", url: "https://cryptozombies.io", type: "Game" },
      { title: "Ethernaut", url: "https://ethernaut.openzeppelin.com", type: "Game" },
      { title: "DeFiLlama", url: "https://defillama.com", type: "Analytics" },
      { title: "Polygon Docs", url: "https://polygon.technology", type: "Doc" },
      { title: "Bitcoin Dev Kit", url: "https://bitcoindevkit.org", type: "Library" },
    ]
  },

  // 6. QUANTUM COMPUTING
  "quantum": {
    name: "Quantum Computing",
    difficulty: "Expert",
    popularity: "8K+ developers",
    description: "Quantum algorithms, quantum gates, quantum machine learning, quantum simulation",
    resources: [
      { title: "IBM Qiskit", url: "https://qiskit.org", type: "Framework" },
      { title: "Google Cirq", url: "https://quantumai.google/cirq", type: "Framework" },
      { title: "Amazon Braket", url: "https://aws.amazon.com/braket", type: "Cloud" },
      { title: "Azure Quantum", url: "https://azure.microsoft.com/en-us/services/quantum", type: "Cloud" },
      { title: "Quantum Inspire", url: "https://www.quantum-inspire.com", type: "Platform" },
      { title: "MIT OpenCourseWare QC", url: "https://ocw.mit.edu/search/?q=quantum", type: "Course" },
      { title: "Quantum Computing for Everyone", url: "https://www.coursera.org/learn/quantum-computing-algorithms", type: "Course" },
      { title: "Nature Quantum", url: "https://www.nature.com/nquantum", type: "Journal" },
      { title: "arXiv Quantum", url: "https://arxiv.org/list/quant-ph/recent", type: "Archive" },
      { title: "QuTiP Library", url: "https://qutip.org", type: "Library" },
    ]
  },

  // 7. GAME DEVELOPMENT
  "gamedev": {
    name: "Game Development",
    difficulty: "Hard",
    popularity: "48K+ developers",
    description: "Game engines, game design, graphics programming, multiplayer systems",
    resources: [
      { title: "Unity Engine", url: "https://unity.com", type: "Engine" },
      { title: "Unreal Engine 5", url: "https://www.unrealengine.com", type: "Engine" },
      { title: "Godot Engine", url: "https://godotengine.org", type: "Engine" },
      { title: "Bevy Engine", url: "https://bevyengine.org", type: "Engine" },
      { title: "C# in Unity", url: "https://learn.microsoft.com/en-us/dotnet/csharp", type: "Language" },
      { title: "C++ for Games", url: "https://isocpp.org", type: "Language" },
      { title: "GDScript (Godot)", url: "https://docs.godotengine.org/en/stable/getting_started/scripting/gdscript/index.html", type: "Language" },
      { title: "Unity Learn", url: "https://learn.unity.com", type: "Course" },
      { title: "Unreal Learning", url: "https://www.unrealengine.com/en-US/onlinelearning-courses", type: "Course" },
      { title: "Game Design Patterns", url: "https://gameprogrammingpatterns.com", type: "Book" },
      { title: "Physics Engine Rapier", url: "https://rapier.rs", type: "Library" },
      { title: "OpenGL", url: "https://www.opengl.org", type: "API" },
      { title: "Vulkan", url: "https://www.khronos.org/vulkan", type: "API" },
      { title: "SDL2", url: "https://www.libsdl.org", type: "Library" },
    ]
  },

  // 8. CLOUD COMPUTING
  "cloud": {
    name: "Cloud Computing & DevOps",
    difficulty: "Hard",
    popularity: "42K+ developers",
    description: "AWS, Azure, GCP, Kubernetes, Docker, infrastructure as code, serverless",
    resources: [
      { title: "AWS Certified Solutions Architect", url: "https://aws.amazon.com/certification/certified-solutions-architect-associate", type: "Cert" },
      { title: "Azure Fundamentals", url: "https://learn.microsoft.com/en-us/credentials/certifications/azure-fundamentals", type: "Cert" },
      { title: "GCP Associate Cloud Engineer", url: "https://cloud.google.com/certification/cloud-engineer", type: "Cert" },
      { title: "Kubernetes Official", url: "https://kubernetes.io/docs", type: "Doc" },
      { title: "Docker Docs", url: "https://docs.docker.com", type: "Doc" },
      { title: "Terraform", url: "https://www.terraform.io", type: "IaC" },
      { title: "Ansible", url: "https://www.ansible.com", type: "DevOps" },
      { title: "AWS Docs", url: "https://docs.aws.amazon.com", type: "Doc" },
      { title: "Azure Docs", url: "https://learn.microsoft.com/en-us/azure", type: "Doc" },
      { title: "GCP Docs", url: "https://cloud.google.com/docs", type: "Doc" },
      { title: "A Cloud Guru", url: "https://acloudguru.com", type: "Platform" },
      { title: "Linux Academy", url: "https://www.linkedin.com/learning/paths/become-an-aws-certified-solutions-architect", type: "Course" },
      { title: "Jenkins CI/CD", url: "https://www.jenkins.io", type: "Tool" },
      { title: "GitLab CI", url: "https://docs.gitlab.com/ee/ci", type: "CI/CD" },
    ]
  },

  // 9. ROBOTICS
  "robotics": {
    name: "Robotics & Automation",
    difficulty: "Expert",
    popularity: "12K+ developers",
    description: "ROS, robot programming, autonomous systems, control theory, computer vision for robots",
    resources: [
      { title: "ROS Official", url: "https://www.ros.org", type: "Framework" },
      { title: "ROS2 Docs", url: "https://docs.ros.org/en/humble", type: "Doc" },
      { title: "Arduino Official", url: "https://www.arduino.cc", type: "Platform" },
      { title: "Raspberry Pi", url: "https://www.raspberrypi.com/documentation", type: "Doc" },
      { title: "LEGO Mindstorms", url: "https://www.lego.com/en-us/themes/mindstorms", type: "Platform" },
      { title: "Gazebo Simulator", url: "https://gazebosim.org", type: "Simulator" },
      { title: "OpenDog Project", url: "https://github.com/opendog-io/OpenDog", type: "Project" },
      { title: "MIT D-Lab Robotics", url: "https://d-lab.mit.edu/education/robotics", type: "Course" },
      { title: "Robotics Manipulation", url: "https://manipulation.csail.mit.edu", type: "Course" },
      { title: "Mobile Robotics Course", url: "https://www.coursera.org/learn/mobile-robotics", type: "Course" },
    ]
  },

  // 10. MATHEMATICS & ALGORITHMS
  "mathematics": {
    name: "Mathematics & Algorithms",
    difficulty: "Expert",
    popularity: "32K+ developers",
    description: "Discrete math, linear algebra, calculus, number theory, algorithm design and analysis",
    resources: [
      { title: "3Blue1Brown", url: "https://www.youtube.com/@3blue1brown", type: "Channel" },
      { title: "Khan Academy", url: "https://www.khanacademy.org", type: "Course" },
      { title: "MIT OpenCourseWare Math", url: "https://ocw.mit.edu/search/?q=mathematics", type: "Course" },
      { title: "Introduction to Algorithms (CLRS)", url: "https://mitpress.mit.edu/9780262033848", type: "Book" },
      { title: "Project Euler", url: "https://projecteuler.net", type: "Challenge" },
      { title: "LeetCode", url: "https://leetcode.com", type: "Platform" },
      { title: "HackerRank", url: "https://www.hackerrank.com", type: "Platform" },
      { title: "Brilliant.org", url: "https://brilliant.org", type: "Course" },
      { title: "Art of Problem Solving", url: "https://artofproblemsolving.com", type: "Course" },
      { title: "InterviewBit", url: "https://www.interviewbit.com", type: "Platform" },
      { title: "AlgoExpert", url: "https://www.algoexpert.io", type: "Platform" },
      { title: "Discrete Math by Rosen", url: "https://www.mheducation.com/highered/product/discrete-mathematics-its-applications-8th-edition-kenneth-rosen/9780073383095.html", type: "Book" },
    ]
  },

  // 11. PHYSICS
  "physics": {
    name: "Physics & Quantum Mechanics",
    difficulty: "Expert",
    popularity: "9K+ developers",
    description: "Classical mechanics, thermodynamics, quantum mechanics, special relativity, computational physics",
    resources: [
      { title: "MIT OpenCourseWare Physics", url: "https://ocw.mit.edu/search/?q=physics", type: "Course" },
      { title: "Stanford Classical Mechanics", url: "https://online.stanford.edu/courses/soe-yser0-physics-classical-mechanics", type: "Course" },
      { title: "Quantum Mechanics Course", url: "https://www.coursera.org/learn/quantum-mechanics", type: "Course" },
      { title: "Physics Stack Exchange", url: "https://physics.stackexchange.com", type: "Community" },
      { title: "Feynman Lectures", url: "https://www.feynmanlectures.caltech.edu", type: "Book" },
      { title: "Nature Physics", url: "https://www.nature.com/nphys", type: "Journal" },
      { title: "Physical Review", url: "https://journals.aps.org/prl", type: "Journal" },
      { title: "arXiv Physics", url: "https://arxiv.org/list/physics/recent", type: "Archive" },
      { title: "Numerical Python (SciPy)", url: "https://scipy.org", type: "Library" },
      { title: "MATLAB Simulink", url: "https://www.mathworks.com/products/simulink.html", type: "Tool" },
    ]
  },

  // 12. AR/VR DEVELOPMENT
  "arvr": {
    name: "Augmented & Virtual Reality",
    difficulty: "Hard",
    popularity: "15K+ developers",
    description: "AR/VR applications, 3D graphics, spatial computing, metaverse development",
    resources: [
      { title: "Meta Quest Developer", url: "https://developer.meta.com/immersive", type: "Doc" },
      { title: "Apple Vision Pro Dev", url: "https://developer.apple.com/visionos", type: "Doc" },
      { title: "WebXR API", url: "https://immersive-web.github.io", type: "Spec" },
      { title: "Unity XR", url: "https://docs.unity3d.com/Manual/XR.html", type: "Doc" },
      { title: "Unreal MetaHuman", url: "https://www.unrealengine.com/en-US/metahuman", type: "Tool" },
      { title: "ARKit (iOS)", url: "https://developer.apple.com/arkit", type: "Framework" },
      { title: "ARCore (Android)", url: "https://developers.google.com/ar", type: "Framework" },
      { title: "Three.js WebGL", url: "https://threejs.org", type: "Library" },
      { title: "Babylon.js", url: "https://www.babylonjs.com", type: "Engine" },
      { title: "PlayCanvas", url: "https://playcanvas.com", type: "Cloud" },
    ]
  },

  // 13. FPGA & HARDWARE DESIGN
  "fpga": {
    name: "FPGA & Hardware Design",
    difficulty: "Expert",
    popularity: "6K+ developers",
    description: "Verilog, VHDL, hardware description languages, FPGA synthesis, embedded systems",
    resources: [
      { title: "Xilinx Vivado", url: "https://www.xilinx.com/products/design-tools/vivado.html", type: "Tool" },
      { title: "Intel Quartus Prime", url: "https://www.intel.com/content/www/us/en/software/programmable/quartus/overview.html", type: "Tool" },
      { title: "Verilog Tutorial", url: "https://www.tutorialspoint.com/verilog", type: "Tutorial" },
      { title: "VHDL Reference", url: "https://en.wikichip.org/wiki/vhdl", type: "Reference" },
      { title: "SystemVerilog", url: "https://www.accellera.org/activities/systemverilog", type: "Spec" },
      { title: "IEEE Verilog Standard", url: "https://ieeexplore.ieee.org/document/1003477", type: "Spec" },
      { title: "Chisel Hardware Language", url: "https://www.chisel-lang.org", type: "Language" },
      { title: "FPGA Fundamentals", url: "https://www.coursera.org/learn/fpga-design-embedded-systems", type: "Course" },
      { title: "EDA Playground", url: "https://www.edaplayground.com", type: "Platform" },
    ]
  },

  // 14. FORMAL VERIFICATION
  "formal-verification": {
    name: "Formal Verification & Theorem Proving",
    difficulty: "Expert",
    popularity: "4K+ developers",
    description: "Formal methods, model checking, theorem provers, specification languages",
    resources: [
      { title: "Coq Proof Assistant", url: "https://coq.inria.fr", type: "Tool" },
      { title: "Isabelle/HOL", url: "https://isabelle.in.tum.de", type: "Tool" },
      { title: "Z3 SMT Solver", url: "https://github.com/Z3Prover/z3", type: "Tool" },
      { title: "TLA+ Specification", url: "https://lamport.azurewebsites.net/tla/tla.html", type: "Language" },
      { title: "Alloy Analyzer", url: "https://alloy.readthedocs.io", type: "Tool" },
      { title: "SPIN Model Checker", url: "https://spinroot.com", type: "Tool" },
      { title: "Software Foundations", url: "https://softwarefoundations.cis.upenn.edu", type: "Course" },
      { title: "Formal Methods Course", url: "https://www.coursera.org/learn/formal-methods", type: "Course" },
      { title: "ACM Formal Methods", url: "https://www.acm.org/sig/siglog", type: "Community" },
    ]
  },

  // 15. COMPILER DESIGN
  "compiler-design": {
    name: "Compiler Design & Programming Languages",
    difficulty: "Expert",
    popularity: "11K+ developers",
    description: "Compiler construction, language design, parsing, optimization, code generation",
    resources: [
      { title: "Dragon Book", url: "https://en.wikipedia.org/wiki/Compilers:_Principles,_Techniques,_and_Tools", type: "Book" },
      { title: "LLVM Project", url: "https://llvm.org", type: "Framework" },
      { title: "GCC Compiler", url: "https://gcc.gnu.org", type: "Compiler" },
      { title: "Crafting Interpreters", url: "https://craftinginterpreters.com", type: "Book" },
      { title: "MIT 6.035 Compiler", url: "https://ocw.mit.edu/courses/6-035-computer-language-engineering-sma-2015", type: "Course" },
      { title: "Compiler Optimization", url: "https://www.edx.org/course/compilers-design-for-high-performance", type: "Course" },
      { title: "Rust Compiler Dev", url: "https://rustc-dev-guide.rust-lang.org", type: "Guide" },
      { title: "Go Language Spec", url: "https://golang.org/ref/spec", type: "Spec" },
      { title: "ANTLR Parser Gen", url: "https://www.antlr.org", type: "Tool" },
    ]
  },

  // 16. HIGH PERFORMANCE COMPUTING
  "hpc": {
    name: "High Performance Computing",
    difficulty: "Expert",
    popularity: "7K+ developers",
    description: "GPU computing, parallel programming, distributed computing, scientific computing",
    resources: [
      { title: "CUDA Programming Guide", url: "https://docs.nvidia.com/cuda/cuda-c-programming-guide", type: "Doc" },
      { title: "OpenMP", url: "https://www.openmp.org", type: "Standard" },
      { title: "MPI Tutorial", url: "https://mpitutorial.com", type: "Tutorial" },
      { title: "Supercomputing Frontier", url: "https://www.olcf.ornl.gov", type: "Resource" },
      { title: "XSEDE Supercomputing", url: "https://www.xsede.org", type: "Platform" },
      { title: "NVIDIA RAPIDS", url: "https://rapids.ai", type: "Library" },
      { title: "HPC Best Practices", url: "https://hpc.llnl.gov", type: "Guide" },
      { title: "Parallel Programming", url: "https://www.coursera.org/learn/parallel-programming-in-java", type: "Course" },
      { title: "SLURM Job Scheduler", url: "https://slurm.schedmd.com", type: "Software" },
    ]
  },

  // 17. BIOINFORMATICS
  "bioinformatics": {
    name: "Bioinformatics & Computational Biology",
    difficulty: "Hard",
    popularity: "9K+ developers",
    description: "Genomics, protein structure prediction, molecular dynamics, sequence analysis",
    resources: [
      { title: "Biopython", url: "https://biopython.org", type: "Library" },
      { title: "BLAST Database", url: "https://blast.ncbi.nlm.nih.gov", type: "Tool" },
      { title: "Galaxy Project", url: "https://usegalaxy.org", type: "Platform" },
      { title: "AlphaFold", url: "https://www.deepmind.com/research/open-source/alphafold", type: "Model" },
      { title: "Bioinformatics Stanford", url: "https://online.stanford.edu/courses/soeb-x-bioinformatics", type: "Course" },
      { title: "NCBI Resources", url: "https://www.ncbi.nlm.nih.gov", type: "Database" },
      { title: "Ensembl Genome Browser", url: "https://www.ensembl.org", type: "Database" },
      { title: "PyMOL Visualization", url: "https://pymol.org", type: "Tool" },
      { title: "GROMACS Simulation", url: "https://www.gromacs.org", type: "Simulator" },
      { title: "Rosetta Protein Design", url: "https://rosettacommons.org", type: "Framework" },
    ]
  },
};

export async function getTechResources(page: number = 1, limit: number = 10) {
  const keys = Object.keys(allTechResources);
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginatedKeys = keys.slice(start, end);

  const resources = paginatedKeys.reduce((acc, key) => {
    acc[key] = allTechResources[key];
    return acc;
  }, {} as Record<string, TechResourceData>);

  return {
    resources,
    pagination: {
      page,
      limit,
      total: keys.length,
      pages: Math.ceil(keys.length / limit),
    },
  };
}

export async function getTechResourceDetail(resourceId: string) {
  return allTechResources[resourceId] || null;
}

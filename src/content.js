// ---------------------------------------------------------------------------
// All site copy lives here. Consumed by both the 3D screens and the fallback
// layout. Sourced from portfolio-projects.md — edit here, nothing else needs
// to change.
//
// Per project:
//   name / role / line   — list-row + featured header copy
//   description          — array of paragraphs for the featured screen
//   tech                 — short list shown in the project-list row
//   stack                — full stack shown as tags on the featured screen
//   notes                — "Engineering notes" bullets
//   links                — [{ label, href, logo? }] — a `logo` (file in
//                          public/press/) shows the link as a press logo card
//   gallery (optional)   — [{ src, caption? }] — adds Description / Gallery
//                          tabs; drop files in public/gallery/<project>/ and
//                          reference them as '/gallery/<project>/file.jpg'
//   app                  — { label, icon, tint, image? } for the phone home
//                          screen (mobile). icon is a name from
//                          mobile/icons.js, used if `image` is missing.
//                          image: { src, bg?, pad? } — a file in
//                          public/icons/; pad (0–0.3) insets a logo on bg
// ---------------------------------------------------------------------------

export const content = {
  name: 'Aarya Raut',
  role: 'Software Engineer',

  // Resume PDF for the phone's Resume app: put the file in public/ and set
  // e.g. '/resume.pdf'. null shows "available on request" with an email link.
  resume: null,

  // Phone (mobile) experience
  phone: {
    // Lock + home screen wallpaper, e.g. '/wallpaper.jpg' (in public/).
    // null uses the built-in dark gradient.
    wallpaper: null,

    // Lock screen notifications, newest first. `open` is the app to open
    // when tapped (an app label, lowercased: 'press', 'ftc', 'halion', …).
    notifications: [
      {
        title: 'Charlotte Business Journal',
        body: 'Covered Halion Technologies, the AR smart-glasses startup I co-founded.',
        when: 'Aug 26',
        open: 'press',
      },
      {
        title: 'Yahoo Tech',
        body: 'Halion Technologies picked up by Yahoo Tech.',
        open: 'press',
      },
      {
        title: 'Carolinas Premier Event',
        body: '2nd-place Inspire Award against 34 teams with Circuit Breakers 21829.',
        when: 'Jul',
        open: 'ftc',
      },
      {
        title: 'AWE 2026',
        body: 'Demoed HalOS live: on-device tracking, a local LLM, and a see-through HUD.',
        open: 'halion',
      },
    ],

    // Messages app: the opening thread, sent from you. Write these in your
    // own voice; the visitor's reply opens their email app.
    messages: [
      "hey, I'm Aarya",
      'I build things up and down the stack: on-device AI for AR glasses at Halion, web platforms for clients, and control software for FTC robots.',
      'Got a project, a question, or a laptop that needs fixing? Send me a message here and it goes straight to my email.',
    ],

    // Quiz Clash app: a short quiz about you. `answer` is the option index.
    quiz: [
      {
        q: "Where does the AI in Halion's glasses run?",
        options: ['In the cloud', 'On the glasses', 'On a paired phone'],
        answer: 1,
        why: 'Everything runs locally on an RK3588. No phone, no cloud.',
      },
      {
        q: 'What did Version Vegaz win at the CENTERSTAGE Raleigh qualifier?',
        options: ['Inspire Award', 'Think Award', 'Control Award'],
        answer: 2,
        why: 'The Control Award goes to the best use of sensors and software.',
      },
      {
        q: "How big is FBLA Elevate's question bank?",
        options: ['~1,000', '~10,000', '~100,000'],
        answer: 1,
        why: 'A Raspberry Pi Zero 2 W scrapes and inserts them with no manual entry.',
      },
    ],
  },

  // Shared dressing for the featured screen (monitor 1, left)
  featured: {
    label: 'Featured Project',
  },

  // Monitor 2 (center) — project list. Clicking a row shows that project on
  // the featured monitor.
  projects: [
    {
      name: 'Halion Technologies',
      app: { label: 'Halion', icon: 'glasses', tint: '#8ecbdf', image: { src: '/icons/halion.png', bg: '#ffffff', pad: 0.1 } },
      role: 'Co-Founder & Lead Engineer · AR Smart Glasses',
      line: 'AR smart glasses — AI fully on-device',
      description: [
        'Halion Technologies is a startup I co-founded building AR smart ' +
          'glasses that remember things for you and answer questions, with ' +
          'everything running locally on the device. No phone, no cloud.',
        'I built HalOS, the software layer behind the glasses: on-device ' +
          'object tracking, a local LLM assistant, and a see-through HUD, all ' +
          'running in real time on an RK3588. We demoed it at AWE 2026.',
      ],
      tech: ['C++', 'Embedded Linux', 'Local LLM'],
      stack: ['C++17', 'OpenCV', 'ONNX Runtime', 'llama.cpp', 'RK3588'],
      notes: [
        'Presented the working demo at AWE 2026',
        'Covered by the Charlotte Business Journal and Yahoo Tech',
      ],
      links: [
        { label: 'Site', href: 'https://haliontech.com' },
        {
          label: 'Charlotte Business Journal',
          href: 'https://www.bizjournals.com/charlotte/news/2026/08/26/teens-ar-glasses-startup-halion-tech.html',
          logo: '/press/charlotte-business-journal.png',
        },
        {
          label: 'Yahoo Tech',
          href: 'https://tech.yahoo.com/ar-vr/articles/charlotte-teens-launch-ap-startup-103643324.html',
          logo: '/press/yahoo-tech.svg',
        },
      ],
      gallery: [
        // add a caption with { src, caption: '…' }
        { src: '/gallery/halion/halion-01.jpg' },
        { src: '/gallery/halion/halion-02.jpg' },
        { src: '/gallery/halion/halion-03.jpg' },
        { src: '/gallery/halion/halion-04.jpg' },
        { src: '/gallery/halion/halion-05.jpg' },
        { src: '/gallery/halion/halion-06.jpg' },
        { src: '/gallery/halion/halion-07.jpg' },
        { src: '/gallery/halion/halion-08.jpg' },
        { src: '/gallery/halion/halion-09.jpg' },
        { src: '/gallery/halion/halion-10.jpg' },
      ],
    },
    {
      name: 'Freelance & Tech Consulting',
      app: { label: 'Freelance', icon: 'briefcase', tint: '#d8b48a' },
      role: 'Freelance Software Developer · Tech Repair Consultant',
      line: 'Client web apps, business sites & hardware repair',
      description: [
        'I take on freelance software work for small businesses and ' +
          'organizations, keeping 2–3 projects in the pipeline at a time. That ' +
          'ranges from internal tools to public-facing sites: for an ' +
          'electronics shop I built an internal inventory app to track their ' +
          'parts and equipment, plus a storefront site for listing products ' +
          'for sale. I have also shipped a barber booking site and business ' +
          'sites for roofing, HVAC, car detailing, and esthetics clients.',
        'Currently in progress: EarlyPulse, a cost-effective way for ' +
          'underprivileged people to get their vitals reviewed by licensed ' +
          'professionals. I set up and run the backend on a self-hosted Ubuntu ' +
          'server, connected to the web app through Prisma and Cloudflare.',
        'On the hardware side, I do tech repair for individuals: laptop ' +
          'repairs, custom PC builds, phone screen replacements, cameras, and ' +
          'gaming consoles. Email me with what you need.',
      ],
      tech: ['Next.js', 'Supabase', 'Linux'],
      stack: [
        'Next.js', 'React', 'Supabase', 'Prisma', 'Ubuntu Server',
        'Cloudflare', 'Linux',
      ],
      snippet: null,
      notes: [
        'EarlyPulse (in progress) — self-hosted Ubuntu server wired to the web app through Prisma and Cloudflare, keeping hosting costs low for a service built for underserved patients',
        'Electronics shop — internal inventory system for parts and owned equipment, plus a public site for listing products for sale',
        'Business sites and booking — a barber booking site and front-end sites for roofing, HVAC, car detailing, and esthetics businesses',
        'Tech repair — laptop repair, custom PC builds, phone screen replacement, camera and gaming console repair for individual clients',
      ],
      links: [
        { label: 'EarlyPulse', href: 'https://earlypulse.org' },
        { label: 'Email', href: 'mailto:rautaarya23@gmail.com' },
      ],
    },
    {
      name: 'FTC Programming',
      app: { label: 'FTC', icon: 'robot', tint: '#8fd8b4', image: { src: '/icons/first.png', bg: '#ffffff', pad: 0.13 } },
      role: 'Lead Programmer · 4 FIRST Tech Challenge seasons · 3 teams',
      line: 'Control, localization & pathing for competition robots',
      description: [
        "I've been lead programmer for four FIRST Tech Challenge seasons " +
          'across three teams: Version Vegaz (23241) for CENTERSTAGE, Circuit ' +
          'Breakers (21829) for INTO THE DEEP, and Cybotz (21351) for DECODE. ' +
          "I rejoined Circuit Breakers to compete at the Carolinas FIRST " +
          "Premier Event and am with them for this season's BioBuzz. Every season " +
          'is a new robot and a new game, and the Java control software has ' +
          'to work the first time in a 30-second autonomous with no do-overs.',
        'Most of my work is control and localization. I tune PIDF loops ' +
          'with gravity feedforward on arms, lifts, and slides, run flywheels ' +
          'on PIDF and bang-bang velocity control, and auto-track turrets, ' +
          "all tuned live through FTC Dashboard. I've run three-wheel and " +
          'two-wheel dead-wheel odometry, goBILDA Pinpoint, and SparkFun ' +
          'OTOS, and I heavily customized Road Runner\'s internals to get our ' +
          'robot following paths extremely accurately.',
        'In the off-season after INTO THE DEEP I wrote my own pure pursuit ' +
          'path follower from the published papers, then added a Kalman ' +
          'filter to cut the noise out of the pose estimate. For DECODE the ' +
          'robot fused a Limelight camera with wheel odometry for ' +
          'vision-corrected closed-loop targeting, so it kept aiming ' +
          'accurately even when it briefly lost sight of the goal.',
      ],
      // Season cards in the phone's FTC app
      seasons: [
        { name: 'CENTERSTAGE', years: '2023–24', team: 'Version Vegaz', number: '23241', results: ['Control Award · Raleigh qualifier', 'Alliance finalist'] },
        { name: 'INTO THE DEEP', years: '2024–25', team: 'Circuit Breakers', number: '21829', results: ['Undefeated 5–0, #1 seed · Salem Academy qualifier', 'Winning alliance', 'Inspire Award · Pinnacle Classical', '5th · NC Championship', 'Top 7% of 7,600+ teams by OPR'] },
        { name: 'DECODE', years: '2025–26', team: 'Cybotz', number: '21351', results: ['Think Award · NC Championship', 'Inspire Award · TMSA qualifier', 'Alliance finalist · Southeast Guilford'] },
        { name: 'Carolinas Premier Event', years: 'July 2026', team: 'Circuit Breakers', number: '21829', results: ['2nd-place Inspire Award', 'Competed against 34 teams'] },
        { name: 'BioBuzz', years: '2026–27', team: 'Circuit Breakers', number: '21829', results: ['Season in progress'] },
      ],
      stats: [
        { value: '4', label: 'seasons' },
        { value: '3', label: 'teams' },
        { value: '8.8k', label: 'lines of Java (DECODE)' },
      ],
      tech: ['Java', 'Control Systems', 'Localization'],
      stack: [
        'Java', 'FTC SDK', 'Road Runner (customized)', 'Pedro Pathing',
        'Pure pursuit (from scratch)', 'Kalman filter', 'PIDF + feedforward',
        'goBILDA Pinpoint', 'SparkFun OTOS', 'Limelight 3A', 'FTC Dashboard',
      ],
      notes: [
        'CENTERSTAGE (Version Vegaz): Control Award, given for the best use of sensors and software, at the Raleigh qualifier, plus alliance finalist',
        'INTO THE DEEP (Circuit Breakers): undefeated 5–0 #1 seed and winning alliance at the Salem Academy qualifier, Inspire Award at Pinnacle Classical, 5th at the NC Championship, and top 7% of 7,600+ teams worldwide by OPR',
        'DECODE (Cybotz): Think Award at the NC Championship, Inspire Award at the TMSA qualifier, and alliance finalist at Southeast Guilford',
        'Carolinas Premier Event (Circuit Breakers, July 2026): qualified for and competed at a FIRST Premier Event against 34 teams, and earned the 2nd-place Inspire Award',
        'Built a dual vision-tracking strategy (SDK AprilTag pipeline vs. Limelight) and benchmarked both before standardizing on the Limelight path for its simpler onboard distance/bearing output',
        'Designed the DECODE autonomous as a state machine (not a linear script) so the robot can react to real-world timing variance mid-match — e.g. breaking off intake early if a sensor reports the sorter is full',
        'DECODE codebase: ~8,850 lines of custom Java, running entirely on a single onboard control computer with no server or backend',
        'Wrote the programming docs and built code.cb21829.org so new team members can get up to speed',
      ],
      links: [
        { label: 'Team site', href: 'https://cb21829.org' },
        { label: 'Code', href: 'https://code.cb21829.org' },
        { label: 'Docs', href: 'https://docs.cb21829.org' },
      ],
      gallery: [
        // add a caption with { src, caption: '…' }
        { src: '/gallery/ftc/ftc-01.jpg' },
        { src: '/gallery/ftc/ftc-02.jpg' },
        { src: '/gallery/ftc/ftc-03.jpg' },
        { src: '/gallery/ftc/ftc-04.jpg' },
        { src: '/gallery/ftc/ftc-05.jpg' },
        { src: '/gallery/ftc/ftc-06.jpg' },
        { src: '/gallery/ftc/ftc-07.jpg' },
        { src: '/gallery/ftc/ftc-08.jpg' },
        { src: '/gallery/ftc/ftc-09.jpg' },
        { src: '/gallery/ftc/ftc-10.jpg' },
        { src: '/gallery/ftc/ftc-11.jpg' },
        { src: '/gallery/ftc/ftc-12.jpg' },
        { src: '/gallery/ftc/ftc-13.jpg' },
        { src: '/gallery/ftc/ftc-video-01.mp4' },
        { src: '/gallery/ftc/ftc-video-02.mp4' },
        { src: '/gallery/ftc/ftc-video-03.mp4' },
        { src: '/gallery/ftc/ftc-video-04.mp4' },
        { src: '/gallery/ftc/ftc-video-05.mp4' },
      ],
    },
    {
      name: 'AKTSA Showcase Platform',
      app: { label: 'AKTSA', icon: 'trophy', tint: '#a9a3e8' },
      role: 'Full-Stack Developer',
      line: 'Conference submission & grading platform',
      description: [
        "A production platform that runs our regional TSA (Technology " +
          "Student Association) conference's project submission and grading " +
          'pipeline for hundreds of participants, replacing spreadsheets and ' +
          'email. Built on the Next.js 16 App Router with TypeScript and ' +
          'Supabase Postgres, it serves three roles: teams submit projects, ' +
          'event officers score submissions scoped to their assigned events, ' +
          'and admins manage accounts and chapter-wide configuration.',
        'Auth is custom: bcrypt-hashed credentials and signed JWTs (jose), ' +
          'with role-based authorization enforced at the API layer because ' +
          'the server talks to Postgres through a service-role client that ' +
          'bypasses row-level security. Every route is wrapped in structured ' +
          'logging, request timing, retry/timeout handling, and a circuit ' +
          'breaker, behind sliding-window rate limiting on Upstash Redis.',
        "The background is a real-time incompressible fluid solver built " +
          'directly on Three.js primitives, using BFECC (back-and-forth error ' +
          'compensation) advection to cancel the first-order error of a ' +
          'naive semi-Lagrangian step.',
      ],
      tech: ['Next.js', 'Supabase', 'Three.js'],
      stack: [
        'Next.js 16', 'React 18', 'TypeScript', 'Tailwind + shadcn/ui',
        'Supabase (PostgreSQL)', 'JWT auth (jose + bcryptjs)',
        'Upstash Redis', 'Three.js',
      ],
      notes: [
        'Built role-based authorization (teams / officers / admins) entirely at the API layer using a service-role Supabase client — bypassing RLS meant authorization had to be enforced deliberately in application code',
        'Added production-grade resilience most projects this size skip: structured logging, request timing, retry/timeout handling, and a circuit breaker across every API route',
        "Implemented sliding-window rate limiting (Upstash Redis) that degrades gracefully to open in local development when Redis isn't configured",
      ],
      links: [],
    },
    {
      name: 'FTC Quiz Clash',
      app: { label: 'Quiz Clash', icon: 'bolt', tint: '#e8c84a' },
      role: 'Full-Stack Developer · Adopted by FTC teams internationally',
      line: 'Daily ranked quiz with a chess-style ELO',
      description: [
        'A daily ranked quiz platform that helps FIRST Tech Challenge ' +
          'students master a dense competition rules manual, adopted by FTC ' +
          'teams around the world. Students compete in daily ranked matches ' +
          'on a chess-style ELO ladder or train in an untimed practice mode, ' +
          'and sign in against their real FTC team number, verified through ' +
          'the FTCScout API.',
        'The rating engine lives in the database: a pure PL/pgSQL function ' +
          'computes every ELO change with difficulty-weighted K-factors, ' +
          'diminishing returns above 1500 and 1800, and a floor that rules out ' +
          'zero-change results, so client and server can never disagree. ' +
          'Supabase Auth and Postgres row-level security guard the data, and ' +
          'the Next.js 14 front end is written in TypeScript with Framer ' +
          'Motion.',
      ],
      tech: ['Next.js', 'PostgreSQL', 'PL/pgSQL'],
      stack: [
        'Next.js 14', 'React 18', 'TypeScript',
        'Supabase (PostgreSQL + Auth + RLS)', 'PL/pgSQL', 'Framer Motion',
        'FTCScout API',
      ],
      notes: [
        'Designed the daily ranked quiz to be fair and non-repeating: the same 10 questions are lazily generated for every student on a given day and excluded from the prior 7 days, while practice mode shuffles freely',
        'Found and fixed a production data-consistency bug where a client-visible ELO rating diverged from the correctly-updated peak rating due to a multi-step write sequencing issue — diagnosed the root cause and reconciled the data',
        'Built a rate-limited team-lookup sync pipeline against the FTCScout API (single-team queries only, no bulk export) running persistently on a Raspberry Pi',
      ],
      links: [{ label: 'Live', href: 'https://challenge.cybotzrobotics.org' }],
    },
    {
      name: 'FBLA Elevate',
      app: { label: 'FBLA', icon: 'chart', tint: '#7fb2f0', image: { src: '/icons/fbla.png', bg: '#ffffff', pad: 0.1 } },
      role: 'Freelance Developer · Built for founder Shourya Bangaru',
      line: 'Competition prep platform for FBLA events',
      description: [
        'An all-in-one prep platform for Future Business Leaders of America ' +
          'competitive events, built to replace the outdated, low-quality ' +
          'study materials most students rely on. Students drill objective-' +
          'test questions with explanations and study with flashcards and ' +
          'guided practice sessions, with AI roleplay practice for the ' +
          'roleplay events in progress.',
        'The question bank holds ~10,000 questions covering every FBLA ' +
          'event, fed by an automated ingestion pipeline: a scraper running ' +
          'unattended on a Raspberry Pi Zero 2 W collects the questions, ' +
          'normalizes them, and inserts them straight into the Supabase ' +
          'Postgres database. The app itself is Next.js and TypeScript on ' +
          'Vercel, with Supabase handling auth and data.',
      ],
      tech: ['Next.js', 'Supabase', 'Raspberry Pi'],
      stack: [
        'Next.js', 'TypeScript', 'Supabase (PostgreSQL + Auth)', 'Vercel',
        'Raspberry Pi Zero 2 W',
      ],
      notes: [
        'Built a scraper-to-database pipeline on a Raspberry Pi Zero 2 W that collects questions and inserts them into Postgres automatically, growing the bank to ~10,000 questions with no manual data entry',
        'Covers every FBLA competitive event, so one platform replaces a scattered set of outdated study resources',
        'Freelance build for the founder, from the question pipeline through the student-facing app',
      ],
      links: [{ label: 'Live', href: 'https://fbla-elevate.com' }],
    },
    {
      name: 'Security & Systems',
      app: { label: 'Security', icon: 'shield', tint: '#e89a9a' },
      role: 'Home Lab · Network Security · Embedded Linux',
      line: 'Networking & security home lab',
      description: [
        "Outside of application development, I've built and maintained a home " +
          'lab focused on networking, offensive security tooling, and ' +
          'low-level Linux systems — the same interest that led into the ' +
          'robotics control-systems work.',
        "This isn't client work or a shipped product — it's evidence of " +
          'hands-on comfort below the application layer: routing, wireless ' +
          'protocols, embedded Linux images, and hardware-based ' +
          "attack/defense tooling. It's the throughline connecting the FTC " +
          'control systems and the Halion embedded/OS work — all from the ' +
          'same interest in how systems actually work at the hardware and ' +
          'network level, not just the app layer.',
      ],
      tech: ['OPNsense', 'WireGuard', 'Kali Linux'],
      stack: [
        'OPNsense', 'WireGuard', 'Raspberry Pi', 'P4wnP1 A.L.O.A.',
        'Pwnagotchi', 'Kali Linux',
      ],
      notes: [
        'OPNsense router — configured and running as the primary router for my home network, handling routing, firewall rules, and traffic monitoring in place of a stock consumer router',
        'Raspberry Pi VPN gateway — a Pi 3B+ configured as a custom access point running a WireGuard VPN, giving encrypted routing for connected devices',
        'BadUSB payload devices — built on a Raspberry Pi Pico and a Pi Zero 2W running P4wnP1 A.L.O.A., for testing HID-injection attack vectors in a controlled environment',
        'Pwnagotchi — a dedicated WiFi-handshake-capture device for passive network security research',
        'Kali Linux home lab — a maintained environment for practicing penetration-testing tools and techniques',
      ],
      links: [],
      gallery: [
        // { src: '/gallery/security/opnsense-router.jpg', caption: 'OPNsense router' },
      ],
    },
  ],

  // Monitor 3 (vertical) — about + contact terminal
  about: {
    lines: [
      { cmd: 'whoami', out: ['Aarya Raut — software engineer.'] },
      {
        cmd: 'cat about.txt',
        out: [
          'I build systems up and down the stack:',
          'on-device AI for AR smart glasses,',
          'production web platforms, FTC robot',
          'control software, and a home lab full',
          'of networking + security experiments.',
          '',
          'Co-founder @ Halion Technologies.',
        ],
      },
      { cmd: 'ls contact/', out: [] }, // links rendered after this line
    ],
    links: [
      { label: 'github', href: 'https://github.com/ftcaarya', mono: 'github.com/ftcaarya' },
      { label: 'linkedin', href: 'https://www.linkedin.com/in/aarya-raut-052b77352/', mono: 'linkedin.com/in/aarya-raut' },
      { label: 'email', href: 'mailto:rautaarya23@gmail.com', mono: 'rautaarya23@gmail.com' },
    ],
  },
}

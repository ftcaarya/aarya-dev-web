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
// ---------------------------------------------------------------------------

export const content = {
  name: 'Aarya Raut',
  role: 'Software Engineer',

  // Shared dressing for the featured screen (monitor 1, left)
  featured: {
    label: 'Featured Project',
  },

  // Monitor 2 (center) — project list. Clicking a row shows that project on
  // the featured monitor.
  projects: [
    {
      name: 'Halion Technologies',
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
        // { src: '/gallery/halion/awe-booth.jpg', caption: 'AWE 2026 demo booth' },
      ],
    },
    {
      name: 'AKTSA Showcase Platform',
      role: 'Full-Stack Developer',
      line: 'Conference submission & grading platform',
      description: [
        "A production web platform I built to run our regional TSA (Technology " +
          "Student Association) conference's project submission and grading " +
          'pipeline for hundreds of participants — replacing what had ' +
          'previously been done by hand over spreadsheets and email. Three ' +
          'user roles (competing teams, event officers, and admins) share one ' +
          'platform: teams submit project links, officers score submissions ' +
          'scoped to their assigned events, and admins manage accounts and ' +
          'chapter-wide configuration.',
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
      role: 'Full-Stack Developer · Adopted by FTC teams internationally',
      line: 'Daily ranked quiz with a chess-style ELO',
      description: [
        'A daily ranked quiz platform that helps FIRST Tech Challenge ' +
          'robotics students study a dense competition rules manual, turning ' +
          'memorization into a game with a chess-style ELO rating, daily ' +
          'ranked matches, and untimed practice mode. Teams authenticate ' +
          'against their real FTC team number (looked up via the FTCScout ' +
          'API), and the app has been adopted by FTC teams all around the world.',
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
      name: 'Cybotz Robotics — DECODE',
      role: 'Robotics Programmer · 2025–2026 FTC Season',
      line: 'Vision-corrected robot control software',
      description: [
        'I lead programming for Cybotz, a competitive FIRST Tech Challenge ' +
          'robotics team, writing the Java control software that runs the ' +
          'robot in both autonomous and driver-controlled modes. This is ' +
          'where my interest in low-level systems work is shown: ' +
          'sensor fusion, real-time control loops, and hardware that has to ' +
          'work correctly on the first try in a 30-second autonomous window ' +
          'with no do-overs.',
        'The DECODE-season robot detects a game pattern, drives a multi-stage ' +
          'scoring path, and fires game pieces into a goal using ' +
          'vision-corrected closed-loop targeting — fusing a Limelight smart ' +
          'camera with wheel odometry so the robot can still aim accurately ' +
          'even when it temporarily loses sight of the target.',
      ],
      tech: ['Java', 'Computer Vision', 'Control Systems'],
      stack: [
        'Java', 'FTC SDK', 'Pedro Pathing', 'FTCLib/SolversLib PID',
        'Limelight 3A', 'goBILDA Pinpoint odometry', 'FTC Dashboard',
      ],
      notes: [
        'Built a dual vision-tracking strategy (SDK AprilTag pipeline vs. Limelight) and benchmarked both before standardizing on the Limelight path for its simpler onboard distance/bearing output',
        'Designed the autonomous routine as a state machine (not a linear script) so the robot can react to real-world timing variance mid-match — e.g. breaking off intake early if a sensor reports the sorter is full',
        '~8,850 lines of custom Java, running entirely on a single onboard control computer with no server or backend',
      ],
      links: [],
      gallery: [
        // { src: '/gallery/cybotz/robot.jpg', caption: 'DECODE robot' },
      ],
    },
    {
      name: 'Freelance & Tech Consulting',
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
      name: 'Security & Systems',
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

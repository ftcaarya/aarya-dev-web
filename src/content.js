// ---------------------------------------------------------------------------
// All site copy lives here. Swap placeholders for real content — nothing else
// needs to change. Consumed by both the 3D screens and the fallback layout.
// ---------------------------------------------------------------------------

export const content = {
  name: 'Aarya Raut',
  role: 'Software Engineer',

  // Shared dressing for the featured screen (monitor 1, left)
  featured: {
    label: 'Featured Project',
    snippet: [
      { t: 'kw', s: 'const ' }, { t: 'var', s: 'scene' }, { t: 'p', s: ' = ' },
      { t: 'kw', s: 'new ' }, { t: 'fn', s: 'Scene' }, { t: 'p', s: '();' },
      { t: 'br' },
      { t: 'var', s: 'scene' }, { t: 'p', s: '.' }, { t: 'fn', s: 'add' },
      { t: 'p', s: '(' }, { t: 'var', s: 'ideas' }, { t: 'p', s: ', ' },
      { t: 'var', s: 'craft' }, { t: 'p', s: ');' },
      { t: 'br' },
      { t: 'fn', s: 'render' }, { t: 'p', s: '(' }, { t: 'var', s: 'scene' }, { t: 'p', s: ');' },
    ],
  },

  // Monitor 2 (center) — project list. Clicking a row shows that project on
  // the featured monitor. `line` is the one-liner for the list; `description`
  // is the longer blurb the featured screen shows.
  projects: [
    {
      name: 'Project One',
      line: 'Short one-line description.',
      description:
        'One or two sentences on what this project is, the problem it solves, ' +
        'and what makes it technically interesting.',
      tech: ['TypeScript', 'React', 'Node.js'],
      links: [
        { label: 'Live', href: '#' },
        { label: 'Source', href: '#' },
      ],
    },
    {
      name: 'Project Two',
      line: 'Short one-line description.',
      description: 'A couple of sentences about project two go here.',
      tech: ['Python', 'FastAPI'],
      links: [
        { label: 'Live', href: '#' },
        { label: 'Source', href: '#' },
      ],
    },
    {
      name: 'Project Three',
      line: 'Short one-line description.',
      description: 'A couple of sentences about project three go here.',
      tech: ['Go', 'gRPC'],
      links: [
        { label: 'Source', href: '#' },
      ],
    },
    {
      name: 'Project Four',
      line: 'Short one-line description.',
      description: 'A couple of sentences about project four go here.',
      tech: ['Three.js', 'GLSL'],
      links: [
        { label: 'Live', href: '#' },
        { label: 'Source', href: '#' },
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
          'A few lines about you: what you build,',
          'what you care about, what you are',
          'looking for.',
        ],
      },
      { cmd: 'ls contact/', out: [] }, // links rendered after this line
    ],
    links: [
      { label: 'github', href: 'https://github.com/ftcaarya', mono: 'github.com/ftcaarya' },
      { label: 'linkedin', href: 'https://linkedin.com/', mono: 'linkedin.com/in/you' },
      { label: 'email', href: 'mailto:rautaarya23@gmail.com', mono: 'rautaarya23@gmail.com' },
      { label: 'resume', href: '#', mono: 'resume.pdf' },
    ],
  },
}

# Content fill-in

Fill in every `<<...>>`. Delete blocks you don't want. Hand this back and I'll
wire it into `src/content.js` (+ `index.html` meta) — you don't touch code.

Anything marked *optional* can be left as `<<skip>>`.

---

## 0. Identity

- Name (as it should appear): `<<Aarya Raut>>`
- Role / title, 2–4 words: `<<Software Engineer>>`
  - shows under your name on the hero + fallback, and in the page `<title>`
- One-line site description for Google / link previews (~120 chars):
  `<<...>>`
- Social preview blurb, shorter + punchier (~80 chars):
  `<<...>>`

---

## 1. Projects

The center monitor lists these; clicking one shows it on the left monitor.
**4 is the sweet spot** (3 minimum, 6 max before the list gets cramped).
Order matters — #1 is what loads first and what fallback/mobile shows featured.

Copy this block once per project:

```
### Project <<n>>
- Name (≤ 28 chars, shows at 26px): <<...>>
- One-liner for the list row (≤ 60 chars, no period needed): <<...>>
- Description, 1–2 sentences (≤ 240 chars). Say what it is, the problem it
  solves, and the one technically interesting thing about it: <<...>>
- Tech, 2–4 items, in the order you want them read: <<A>>, <<B>>, <<C>>
- Links (drop the ones that don't exist):
  - Live:   <<https://...>>
  - Source: <<https://github.com/...>>
  - Other:  <<label>> → <<https://...>>
```

Repeat ↑ for each project.

**Optional for each:** one sentence on your *specific* role if it was a team
project — I'll fold it into the description rather than add a field.

---

## 2. About / contact terminal (right vertical monitor)

Rendered as a fake shell session that types itself out.

- `$ whoami` output — one line, ≤ 48 chars:
  `<<Aarya Raut — software engineer.>>`

- `$ cat about.txt` output — **3 to 5 lines, each ≤ 48 chars** (hard-wrapped by
  you, so write them as separate lines and mind the length):
  ```
  <<line 1>>
  <<line 2>>
  <<line 3>>
  <<line 4 — optional>>
  <<line 5 — optional>>
  ```
  Cover: what you build, what you care about, what you're looking for
  (internship? full-time? contract? just browsing?).

- *Optional* extra command. Anything shell-ish reads well — `ls skills/`,
  `cat now.txt`, `git log --oneline -3`, `uptime`:
  - command: `<<...>>`
  - output lines (≤ 48 chars each): `<<...>>`

### Contact links
| slot | show as | href |
|---|---|---|
| github | `<<github.com/ftcaarya>>` | `<<https://github.com/ftcaarya>>` |
| linkedin | `<<linkedin.com/in/...>>` | `<<https://linkedin.com/in/...>>` |
| email | `<<rautaarya23@gmail.com>>` | `<<mailto:...>>` |
| resume | `<<resume.pdf>>` | `<<link, or "skip">>` |
| *optional* | `<<...>>` | `<<...>>` |

> Resume: if you want it hosted here, drop the PDF in the repo and say so —
> I'll point the link at it. Currently `#` (dead).

---

## 3. Code snippet (left monitor, decorative)

A 3-line fake code block sitting under the featured project. Right now it's
generic Three.js flavor. Options:

- [ ] Keep the current one
- [ ] Use a real 3–4 line excerpt from your favorite project — paste it:
  ```
  <<...>>
  ```
- [ ] Something else: `<<describe>>`

---

## 4. Loose ends (yes/no or fill in)

- Domain you're deploying to: `<<aaryaraut.dev? / not yet>>`
- Do you want a "resume drawer" / extra section later? `<<y/n>>`
- Anything currently on the site you want *removed*: `<<...>>`
- Anything you want added that has no slot yet (experience timeline, blog,
  photo, availability banner): `<<...>>`

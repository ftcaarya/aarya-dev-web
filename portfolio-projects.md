# Projects

## Halion Technologies — AR Smart Glasses
*Co-Founder & Lead Engineer · C++ · Embedded Linux · ONNX Runtime · Local LLM*

Halion is an AR smart-glasses platform I co-founded, built around a simple idea: glasses that remember things for you and let you ask them questions, with everything running locally on the device — no phone, no cloud, no internet dependency. I built the application layer end-to-end and led the (in-progress) effort to replace its stock Linux base with a custom-built OS.

The shipping demo — built for **AWE 2026** (Augmented World Expo) and later formalized into a spec sheet for Samsung — runs entirely on an Orange Pi 5 with a hard 4GB RAM ceiling. A USB camera feeds a custom-trained YOLOv8 model (ONNX Runtime, since the board's OpenCV build can't run YOLOv8 graphs) that tracks everyday objects like a wallet and remembers where they were last seen. A local LLM (Qwen2.5-1.5B via llama.cpp) answers questions and manages a persistent to-do list and calendar, all rendered as a clear, see-through HUD directly on the framebuffer. Everything — detection, inference, rendering — runs on-device in real time on embedded hardware with no cloud fallback.

**Tech stack:** C++17, OpenCV, ONNX Runtime, llama.cpp, SQLite, libcurl, Linux framebuffer rendering, Orange Pi 5 (RK3588S)

**Standout code — LLM command-protocol parser** (`halion.cpp`)
The assistant has to parse structured commands (`ADD_TODO:`, `ADD_EVENT:`, etc.) out of free-form LLM output reliably enough to run unattended at a trade show booth. This function exists because of a real bug: a 1.5B model started emitting mixed-case tokens (`Done_TODO`) that silently broke an earlier case-sensitive parser.

```cpp
auto grab = [](const std::string& s, const char* tok) -> std::string {
    std::string ls = lower(s), lt = lower(tok);   // case-insensitive
    size_t p = ls.find(lt);
    if (p == std::string::npos) return std::string();
    size_t qq = p + lt.size();
    while (qq < s.size() && (s[qq] == ':' || s[qq] == '-' ||
                             s[qq] == '*' || s[qq] == ' ')) ++qq;
    size_t e = s.find('\n', qq);
    std::string out = s.substr(qq, e == std::string::npos
                                   ? std::string::npos : e - qq);
    out.erase(std::remove(out.begin(), out.end(), '*'), out.end());
    return trim(out);
};
```

**Engineering notes:**
- Diagnosed and worked around a hard OpenCV/ONNX Runtime incompatibility with YOLOv8 on the target board
- Designed the intent-routing system to fast-path obvious commands (add/done/delete) locally without hitting the LLM at all, keeping latency low on constrained hardware
- Debugged a custom Buildroot OS boot failure down to a specific partition-layout mismatch between Ubuntu's U-Boot and a GPT-based image — an in-progress effort to eventually replace the stock OS entirely
- Presented the working demo at AWE 2026; follow-up interest from Samsung resulted in a formal hardware/software spec document

---

## AKTSA Showcase Platform
*Full-Stack Developer · Next.js · Supabase · Three.js*

A production web platform I built to run our regional TSA (Technology Student Association) conference's project submission and grading pipeline for hundreds of participants — replacing what had previously been done by hand over spreadsheets and email. Three distinct user roles (competing teams, event officers, and admins) share one platform: teams submit project links, officers score submissions scoped to their assigned events, and admins manage accounts and chapter-wide configuration.

**Tech stack:** Next.js 16 (App Router), React 18, TypeScript, Tailwind CSS + shadcn/ui, Supabase (PostgreSQL), custom JWT auth (jose + bcryptjs), Upstash Redis rate limiting, Three.js

**Standout code — from-scratch WebGL fluid simulation**
The site's background isn't a canned particle effect — it's a real incompressible-fluid solver built directly on Three.js primitives, including BFECC (back-and-forth error compensation) advection to cancel the first-order error a naive semi-Lagrangian velocity step would introduce.

```glsl
// components/ui/LiquidEther.tsx — advection fragment shader
precision highp float;
uniform sampler2D velocity;
uniform float dt;
uniform bool isBFECC;
uniform vec2 fboSize;
uniform vec2 px;
varying vec2 uv;
void main(){
  vec2 ratio = max(fboSize.x, fboSize.y) / fboSize;
  if(isBFECC == false){
    vec2 vel = texture2D(velocity, uv).xy;
    vec2 uv2 = uv - vel * dt * ratio;
    vec2 newVel = texture2D(velocity, uv2).xy;
    gl_FragColor = vec4(newVel, 0.0, 0.0);
  } else {
    vec2 spot_new = uv;
    vec2 vel_old = texture2D(velocity, uv).xy;
    vec2 spot_old = spot_new - vel_old * dt * ratio;
    vec2 vel_new1 = texture2D(velocity, spot_old).xy;
    vec2 spot_new2 = spot_old + vel_new1 * dt * ratio;
    vec2 error = spot_new2 - spot_new;
    vec2 spot_new3 = spot_new - error / 2.0;
    vec2 vel_2 = texture2D(velocity, spot_new3).xy;
    vec2 spot_old2 = spot_new3 - vel_2 * dt * ratio;
    vec2 newVel2 = texture2D(velocity, spot_old2).xy;
    gl_FragColor = vec4(newVel2, 0.0, 0.0);
  }
}
```

**Engineering notes:**
- Built role-based authorization (teams / officers / admins) entirely at the API layer using a service-role Supabase client, since bypassing RLS meant authorization had to be enforced deliberately in application code rather than the database
- Added production-grade resilience most projects this size skip: structured logging, request timing, retry/timeout handling, and a circuit breaker across every API route
- Implemented sliding-window rate limiting (Upstash Redis) that degrades gracefully to open in local development when Redis isn't configured

---

## FTC Quiz Clash
*Full-Stack Developer · Next.js · Supabase (PostgreSQL) · Adopted by FTC teams internationally*

A daily ranked quiz platform that helps FIRST Tech Challenge robotics students study a dense competition rules manual — turning memorization into a game with a chess-style ELO rating, daily ranked matches, and untimed practice mode. Teams authenticate against their real FTC team number (looked up via the FTCScout API), and the app has been adopted by FTC teams beyond just my own.

**Tech stack:** Next.js 14 (App Router), React 18, TypeScript, Supabase (PostgreSQL + Auth + RLS), PL/pgSQL for core business logic, Framer Motion, FTCScout API integration

**Standout code — ELO rating engine, implemented as a database function**
Rather than duplicating rating logic across client and server, the entire ELO system — difficulty-weighted gains, diminishing returns at high skill, a floor to prevent dead zero-change results — lives as a pure PL/pgSQL function.

```sql
CREATE OR REPLACE FUNCTION calculate_elo_change(
  current_elo INTEGER,
  is_correct BOOLEAN,
  difficulty TEXT,
  k_factor INTEGER DEFAULT 32
) RETURNS INTEGER AS $$
DECLARE
  difficulty_multiplier DECIMAL;
  base_change INTEGER;
  final_change INTEGER;
BEGIN
  CASE difficulty
    WHEN 'easy' THEN difficulty_multiplier := 0.8;
    WHEN 'medium' THEN difficulty_multiplier := 1.0;
    WHEN 'hard' THEN difficulty_multiplier := 1.3;
    ELSE difficulty_multiplier := 1.0;
  END CASE;

  IF is_correct THEN
    base_change := ROUND(k_factor * difficulty_multiplier * 0.5);
  ELSE
    base_change := -ROUND(k_factor * (2.0 - difficulty_multiplier) * 0.5);
  END IF;

  IF current_elo > 1800 THEN
    final_change := ROUND(base_change * 0.7);
  ELSIF current_elo > 1500 THEN
    final_change := ROUND(base_change * 0.85);
  ELSE
    final_change := base_change;
  END IF;

  IF final_change = 0 AND is_correct THEN
    final_change := 1;
  ELSIF final_change = 0 AND NOT is_correct THEN
    final_change := -1;
  END IF;

  RETURN final_change;
END;
$$ LANGUAGE plpgsql;
```

**Engineering notes:**
- Designed the daily ranked quiz to be fair and non-repeating: the same 10 questions are lazily generated for every student on a given day and excluded from the prior 7 days, while practice mode shuffles freely
- Found and fixed a real production data-consistency bug where a client-visible ELO rating diverged from the correctly-updated peak rating due to a multi-step write sequencing issue — diagnosed the root cause and reconciled the data
- Built a rate-limited team-lookup sync pipeline against the FTCScout API (which only supports single-team queries, no bulk export) running persistently on a Raspberry Pi

---

## Cybotz Robotics — DECODE (2025–2026 FTC Season)
*Robotics Programmer · Java · Computer Vision · Control Systems*

I lead programming for Cybotz, our competitive FIRST Tech Challenge robotics team, writing the Java control software that runs the robot in both autonomous and driver-controlled modes. This is where my interest in low-level systems work actually started — sensor fusion, real-time control loops, and hardware that has to work correctly on the first try in a 30-second autonomous window with no do-overs.

The DECODE-season robot detects a game pattern, drives a multi-stage scoring path, and fires game pieces into a goal using vision-corrected closed-loop targeting — fusing a Limelight smart camera with wheel odometry so the robot can still aim accurately even when it temporarily loses sight of the target.

**Tech stack:** Java, FTC SDK, Pedro Pathing (Bezier-curve path following), FTCLib/SolversLib PID control, Limelight 3A vision, goBILDA Pinpoint odometry, FTC Dashboard for live tuning

**Standout code — from-scratch least-squares polynomial regression**
Rather than deriving a closed-form ballistic equation for the launcher (hard to model exactly on a real flywheel/hood system), I measured RPM and hood-angle at fixed distances on the field and built a custom numerical-methods tool to fit a curve to that data — a from-scratch least-squares polynomial fitter with Gaussian elimination and partial pivoting.

```java
private double[] fit(double[] x, double[] y, int degree) {
    int n = x.length;
    int p = degree + 1;

    double[][] X = new double[n][p];
    for (int i = 0; i < n; i++) {
        X[i][0] = 1.0;
        for (int j = 1; j < p; j++) {
            X[i][j] = Math.pow(x[i], j);
        }
    }

    double[][] XtX = matrixMultiply(transpose(X), X);

    double[] Xty = new double[p];
    for (int i = 0; i < p; i++) {
        for (int j = 0; j < n; j++) {
            Xty[i] += X[j][i] * y[j];
        }
    }

    return solveLinearSystem(XtX, Xty);
}

private double[] solveLinearSystem(double[][] A, double[] b) {
    int n = b.length;
    double[][] augmented = new double[n][n + 1];
    for (int i = 0; i < n; i++) {
        System.arraycopy(A[i], 0, augmented[i], 0, n);
        augmented[i][n] = b[i];
    }
    for (int col = 0; col < n; col++) {
        int pivotRow = col;
        for (int row = col + 1; row < n; row++) {
            if (Math.abs(augmented[row][col]) > Math.abs(augmented[pivotRow][col])) {
                pivotRow = row;
            }
        }
        double[] temp = augmented[col];
        augmented[col] = augmented[pivotRow];
        augmented[pivotRow] = temp;
        for (int row = col + 1; row < n; row++) {
            double factor = augmented[row][col] / augmented[col][col];
            for (int k = col; k <= n; k++) {
                augmented[row][k] -= factor * augmented[col][k];
            }
        }
    }
    double[] x = new double[n];
    for (int i = n - 1; i >= 0; i--) {
        x[i] = augmented[i][n];
        for (int j = i + 1; j < n; j++) {
            x[i] -= augmented[i][j] * x[j];
        }
        x[i] /= augmented[i][i];
    }
    return x;
}
```

**Engineering notes:**
- Built a dual vision-tracking strategy (SDK AprilTag pipeline vs. Limelight) and benchmarked both before standardizing on the Limelight path for its simpler onboard distance/bearing output
- Designed the autonomous routine as a state machine (not a linear script) so the robot can react to real-world timing variance mid-match — e.g., breaking off intake early if a sensor reports the sorter is full — trading code complexity for match-day robustness
- ~8,850 lines of custom Java across the codebase, running entirely on a single onboard control computer with no server or backend

---

## Security & Systems
*Home Lab · Network Security · Embedded Linux*

Outside of application development, I've built and maintained a home lab focused on networking, offensive security tooling, and low-level Linux systems — the same interest that led into the robotics control-systems work above.

- **OPNsense router** — configured and currently running as the primary router for my home network, handling routing, firewall rules, and traffic monitoring for all connected devices in place of a stock consumer router.
- **Raspberry Pi VPN gateway** — a Raspberry Pi 3B+ configured as a custom access point running a WireGuard VPN, giving encrypted routing for connected devices.
- **BadUSB payload devices** — built on both a Raspberry Pi Pico and a Pi Zero 2W running P4wnP1 A.L.O.A., for testing HID-injection-based attack vectors in a controlled environment.
- **Pwnagotchi** — a dedicated WiFi-handshake-capture device running the Pwnagotchi framework for passive network security research.
- **Kali Linux home lab** — a maintained lab environment for practicing penetration testing tools and techniques.

**Why it's here:** this section isn't client work or a shipped product — it's evidence of hands-on comfort below the application layer: routing, wireless protocols, embedded Linux images, and hardware-based attack/defense tooling. It's also the throughline connecting the FTC robotics control systems and the Halion embedded/OS work above — all three come from the same underlying interest in how systems actually work at the hardware and network level, not just the app layer.

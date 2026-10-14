PCBL HOME RUN DERBY — ALPHA 97

HOME RUN DERBY is a separate PCBL Action Game built from the VERSUS 3D hitting,
character, ballpark and networking foundation. It does not replace or modify the
normal VERSUS game mode.

FORMAT
- Select any normal VERSUS hitter and season: Auden, Jason, Jarvis, Najee or Coel.
- Josef is the permanent CPU pitcher and cannot be selected or controlled.
- Regulation is 10 swing attempts. Every home run adds 1 to the final score.
- Online players take the same attempt number concurrently. The host does not
  release the next pitch until both clients report that their current ball/play
  has completed.
- A tie after 10 starts a 3-swing swing-off for both players. If still tied,
  another 3-swing set begins. This repeats until a set breaks the tie.

JOSEF
- 6'2", 500 lb compact exaggerated muscular build.
- Big blond curly hair, hazel eyes, black tank top, black sweats and black
  AF1-style footwear.
- Coel-derived pitching motion.
- Fastball only: 72 VELO / 75 BRK / 99 CTRL.
- Every fastball targets a deterministic-random point inside the strike zone.
- Josef is never player-controlled.

HITTING
- Same player ratings, PCI/timing window, swing-type adjustments and Alpha 96
  blitzball flight/carry model used by VERSUS.
- Power: 1. Regular: 2. Contact: 3. Mouse controls the PCI.
- Foul-contact threshold from VERSUS is retained; a foul consumes the derby swing.

ONLINE
- Dedicated Derby matchmaking namespace: pcbl-home-run-derby-public-v1.
- Both players may choose different hitters/seasons.
- One shared authoritative pitch packet is used for both hitters each attempt.
- The guest advances only from the host's authoritative next-pitch packet after
  both current-attempt confirmations have arrived.
- The next pitch is therefore blocked until both players finish the current play.

PRESENTATION
- Compact bottom-right scorebug shows attempt, Josef velo, local HR total and
  opponent HR total online.
- Ballpark selection and intro presentation are retained from the VERSUS shell.

ALPHA 24 — CONTACT / FLIGHT / PITCH REBUILD

This build fixes the broken arms-out pitching animation, mirrored gameplay reticles,
visual swing/contact desynchronization, non-physical batted-ball outcomes, and the
pre-load black face texture flash. See ALPHA_24_NOTES.txt for the full change list.

ALPHA 22 — 2010s AAA SPORTS VISUAL PASS

PCBL THE SHOW — ALPHA 21 / RELEASE & CHARACTER DETAIL

RUN
Serve this folder over HTTP: python3 -m http.server 8000
Game: http://localhost:8000/index.html
Swing Studio: http://localhost:8000/model-preview.html

THIS PASS
- Rechecked hand ownership against the supplied swing clips. Auden, Jarvis and
  Jason keep a two-handed finish. Najee releases his top/left hand after
  extension (phase 0.705); Coel releases his top/right hand later (phase 0.760).
  Coel's motion remains generalized as requested.
- Corrected Jarvis's previously invented one-handed finish.
- The released hand follows a root-space curve starting at the actual release
  point with the incoming bat-grip tangent. It no longer chases the moving bat.
- Fingers and thumb open in a short staged release. The retaining hand stays
  attached, and the released palm turns with its forearm instead of folding
  toward a fixed world-down orientation.
- Cached elbow poles use monotone cubic interpolation with shared derivatives
  at sample boundaries. Fixed bone lengths, elbow hinges, hip/shoulder timing,
  planted lead heel and rear toe pivot remain in place.
- Heads widened 6–12% by player. Cheek hollowing is softer while jaw, cheekbone,
  chin and brow planes remain defined. The lower neck now fits the collar.
- Joined scalp normals eliminate the center seam; revised long-hair layering,
  tapered strand ends, smaller irregular curl clumps and darker short Coel hair.
- Jason has a separate six-panel cap crown, curved visor, seams, button, eyelets
  and edge band. Removed scalp/cap and visor/forehead intersections found in QA.
- Fitted rounded rectangular glasses have clear lenses, bridge, nose pads,
  hinges and temple arms. Jason keeps dark frames; Coel keeps metal frames.
- Studio captions show finish/release ownership. Najee's supplied clip alignment
  is corrected around contact and release. Wider default framing includes the bat.

SPEED AND SCOPE
Regular swing durations remain Auden 420 ms, Jarvis 450 ms, Najee 395 ms,
Jason 380 ms and Coel 370 ms. No gameplay rules, ratings or hit resolution changed.
Auden, Jason and Coel are right handed; Jarvis and Najee are left handed.

REVIEW
SWING_PREVIEW.mp4 shows all five players from two angles at 60 fps, first at
normal game speed and then at explicitly labeled half speed.
MODEL_PREVIEW.png contains front and side character close-ups.
SWING_CONTACT_SHEET.jpg contains actual rendered contact and release poses.
The Swing Studio retains supplied clips, phase buttons, scrubbing and orbit.

VALIDATION
validation/mechanics-results.json: 6,405 poses, including times between cached
samples, check held palm contact, bone lengths, planted feet, handedness,
continuity, finite transforms and analytic clearance proxies. All gates pass.
155 uncached poses match a fresh serialized cache in reverse seek order.
The engine source hash matches the packaged cache.
validation/release-results.json: 3,205 release checks confirm retaining-hand
contact, no release before extension, ownership, separation and wrist continuity.
All gates pass; relaxed free-wrist bend stays near 0.12 rad (6.9 degrees).
Body proxy contacts permit a 1 mm tolerance. These are not exact mesh collisions.

REMAINING QUALITY WORK
This is a bounded review checkpoint, not finished AAA production art. Likeness,
scalp/hairline transitions and garment tailoring still need art refinement.
The last part of Najee's retained-bat lowering/settle does not yet reproduce the
supplied clip closely; that is a specific next motion pass. Coel remains an
informed generalization. Motion is authored and constrained, not motion capture
or measured biomechanics. Review the rendered motion as well as numeric checks.

PUBLIC REFERENCES REVIEWED
MLB footage of Alex Rodriguez and Manny Ramirez informed body-motion review.
MLB Statcast visualizations for Soto, Bellinger, Judge, Suarez and Donaldson
informed hand/barrel-path review. The visualizations show bat paths, not player
skeletons. No public MLB clips or extracted frames are redistributed here.
https://www.mlb.com/video/a-rod-homers-for-3-000th-hit-c178541583
https://www.mlb.com/video/ramirez-homers-to-win-game-2-c9081763
https://www.mlb.com/video/visualizing-juan-soto-s-swing-using-bat-tracking-technology-x1921
https://www.mlb.com/video/visualizing-cody-bellinger-s-swing-using-bat-tracking-technology-x8934
https://www.mlb.com/video/visualizing-aaron-judge-s-swing-using-bat-tracking-technology-x6287
https://www.mlb.com/video/visualizing-eugenio-suarez-s-swing-using-bat-tracking-technology-x1650
https://www.mlb.com/video/visualizing-josh-donaldson-s-swing-using-bat-tracking-technology

No proprietary MLB The Show code/assets were accessed. Sony's public motion-
capture article informed the previous reference-led pass:
https://blog.playstation.com/2008/02/04/motion-capture-event-with-mlb-08-the-show/
See ASSET_CREDITS.txt for anatomical and material asset provenance.


The Alpha 21 studio loaded every supplied clip and single-player reached the
game screen with no JavaScript exceptions. The pre-existing external PeerJS
script was unavailable in this environment; online matchmaking was not tested.

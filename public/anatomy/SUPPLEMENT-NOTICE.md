# Lung and thyroid supplements — CC BY-SA 4.0

BodyParts3D - The Database Center for Life Science - CC-BY-SA 2.1 Japan (historical source notice).
Z-Anatomy - The open source atlas of anatomy - CC-BY-SA 4.0.

The provider currently licenses BodyParts3D under CC BY 4.0:
https://dbarchive.biosciencedbc.jp/en/bodyparts3d/lic.html
The Z-Anatomy adaptations distributed here remain CC BY-SA 4.0:
https://creativecommons.org/licenses/by-sa/4.0/

Source export: https://github.com/nqwrc/3d-anatomy/blob/8ca3b7421bcfbe88b85859eb1983d5cf79f21749/public/models/visceral.glb
Upstream atlas: https://github.com/Z-Anatomy/Models-of-human-anatomy
The complete upstream notice is preserved in Z-ANATOMY-LICENSE.txt.

Selected structures only: superior and inferior lobes of the left lung; superior, middle, and inferior lobes of the right lung; thyroid gland. No kidney, inner ear, or other separately licensed third-party structures are included in these supplement files.

Changes by onco-milver: extracted the selected organ meshes, retained their world transforms, decoded Draco, renamed nodes to stable structure IDs, and translated the source tracheal center to the target atlas tracheal center. The female version also scales the source organs to match the base female torso: X scale 0.844, Y scale 0.856, Z scale 0.751, based on liver dimensions and trachea-to-liver distance. Geometry is exported without compression in z-organs-male.glb and z-organs-female.glb. These are educational cross-atlas adaptations, not clinically validated registrations.

Both derived supplement GLBs, including their transformations and metadata, are distributed under CC BY-SA 4.0. Download the GLBs from this directory; the source revision and reproducible extraction/build scripts are documented in the project README. The base Open Anatomy 3D files remain separate and retain their CC BY 4.0 terms.

#!/usr/bin/env python3
"""
Pixel face for the corner robot "홍철" (drawn after the profile photo).

    python3 scripts/robot_face.py

Writes _includes/robot-face.svg. Edit the grid below (one character per
pixel, 24 x 23) and the overlays for the eye and mouth frames, then re-run.
assets/css/robot.css switches the frames (blink, talk, happy).
"""
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "_includes" / "robot-face.svg"

# legend: K outline, H hair, h hair shine, S skin, s skin shade, C cheek,
#         Y eyebrow, E eye, M mouth, T teeth, R inside of the mouth,
#         B side bolt, A antenna, L antenna light (course colour via CSS)
# Drawn after the profile photo: centre-parted hair that opens into curtain
# bangs and falls to the jaw, straight brows, eyes squeezed by a big smile,
# and a wide grin that shows the top teeth.
BASE = [
"...........LL...........",  # 0 antenna LED
"...........AA...........",  # 1 antenna stem
".......KKKKAAKKKK.......",  # 2
".....KKHHHHHHHHHHKK.....",  # 3
"....KHHHHHhHHhHHHHHK....",  # 4 shine either side of the part
"...KHHHHHhHHHHhHHHHHK...",  # 5
"..KHHHHHhHHHHHHhHHHHHK..",  # 6
"..KHHHHHHHHSSHHHHHHHHK..",  # 7 the part opens
".KHHHHHHHHSSSSHHHHHHHHK.",  # 8
".KHHHHHHHSSSSSSHHHHHHHK.",  # 9
".KHHHHHSSSSSSSSSSHHHHHK.",  # 10 curtain bangs swept aside
".KHHHSSYYYSSSSYYYSSHHHK.",  # 11 brows
".KHHHSSSSSSSSSSSSSSHHHK.",  # 12
"BKHHHSSSSSSSSSSSSSSHHHKB",  # 13 eyes go here
"BKHHHSSSSSSSSSSSSSSHHHKB",  # 14
".KHHHSSCCSSssSSCCSSHHHK.",  # 15 cheeks, nose shadow
".KHHHSSSSSSSSSSSSSSHHHK.",  # 16 mouth goes here
".KHHHSSSSSSSSSSSSSSHHHK.",  # 17
"..KHHsSSSSSSSSSSSSsHHK..",  # 18 hair tucks in toward the jaw
"...KHKsSSSSSSSSSSsKHK...",  # 19
"....KKKsSSSSSSSSsKKK....",  # 20
"......KKsSSSSSSsKK......",  # 21
"........KKKKKKKK........",  # 22
]
W, H = len(BASE[0]), len(BASE)
# overlays: (row, col, char)
EYES_OPEN = [(13,8,'E'),(13,9,'E'),(14,7,'E'), (13,14,'E'),(13,15,'E'),(14,16,'E')]
EYES_BLINK = [(14,7,'E'),(14,8,'E'),(14,9,'E'), (14,14,'E'),(14,15,'E'),(14,16,'E')]
EYES_HAPPY = [(13,8,'E'),(14,7,'E'),(14,9,'E'), (13,15,'E'),(14,14,'E'),(14,16,'E')]
MOUTH_SMILE = ([(16,8,'M')]+[(16,c,'T') for c in range(9,15)]+[(16,15,'M')]
               +[(17,9,'M')]+[(17,c,'R') for c in range(10,14)]+[(17,14,'M')]
               +[(18,c,'M') for c in range(10,14)])
MOUTH_TALK = ([(16,8,'M')]+[(16,c,'T') for c in range(9,15)]+[(16,15,'M')]
              +[(17,9,'M')]+[(17,c,'R') for c in range(10,14)]+[(17,14,'M')]
              +[(18,9,'M')]+[(18,c,'R') for c in range(10,14)]+[(18,14,'M')]
              +[(19,c,'M') for c in range(10,14)])
COLORS = {
 'K':'#221f1a','H':'#3a3230','h':'#6b605a','S':'#f2d2b8','s':'#dcae8e','C':'#eba596',
 'Y':'#3a2c26','E':'#221f1a','M':'#6b2b25','T':'#fffaf0','R':'#b84a42',
 'B':'#8e959c','A':'#6b6255','L':'#b0432c'
}
for r in BASE: assert len(r)==W, (r, len(r))

def runs(cells):
    """cells: dict (r,c)->ch ; merge horizontal runs of same char into rects"""
    out=[]
    for r in range(H):
        c=0
        while c<W:
            ch=cells.get((r,c))
            if ch is None or ch=='.': c+=1; continue
            c2=c
            while c2+1<W and cells.get((r,c2+1))==ch: c2+=1
            out.append((r,c,c2-c+1,ch)); c=c2+1
    return out

def rects(cells, cls_for=None):
    parts=[]
    for r,c,w,ch in runs(cells):
        cls={'L':' class="rf-led"'}.get(ch,'')
        parts.append(f'<rect x="{c}" y="{r}" width="{w}" height="1" fill="{COLORS[ch]}"{cls}/>')
    return ''.join(parts)

base={(r,c):ch for r,row in enumerate(BASE) for c,ch in enumerate(row)}
def overlay(lst): return {(r,c):ch for r,c,ch in lst}

svg=[f'<svg class="robot__face" viewBox="0 0 {W} {H}" width="{W*3}" height="{H*3}" shape-rendering="crispEdges" aria-hidden="true" focusable="false">']
svg.append('<g class="rf-base">'+rects(base)+'</g>')
svg.append('<g class="rf-eyes rf-eyes--open">'+rects(overlay(EYES_OPEN))+'</g>')
svg.append('<g class="rf-eyes rf-eyes--blink">'+rects(overlay(EYES_BLINK))+'</g>')
svg.append('<g class="rf-eyes rf-eyes--happy">'+rects(overlay(EYES_HAPPY))+'</g>')
svg.append('<g class="rf-mouth rf-mouth--smile">'+rects(overlay(MOUTH_SMILE))+'</g>')
svg.append('<g class="rf-mouth rf-mouth--talk">'+rects(overlay(MOUTH_TALK))+'</g>')
svg.append('</svg>')
OUT.write_text(''.join(svg), encoding='utf-8')

print(f"wrote {OUT.relative_to(OUT.parent.parent)}")

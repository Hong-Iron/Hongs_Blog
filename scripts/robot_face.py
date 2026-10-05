#!/usr/bin/env python3
"""
Pixel face for the corner robot "로봇 철민" (drawn after the profile photo).

    python3 scripts/robot_face.py

Writes _includes/robot-face.svg. Edit the grid below (one character per
pixel, 20 x 22) and the overlays for the eye and mouth frames, then re-run.
assets/css/robot.css switches the frames (blink, talk, happy).
"""
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "_includes" / "robot-face.svg"

# legend: K outline, H hair, h hair shine, S skin, s skin shade, C cheek,
#         E eye, W eye shine / teeth, M mouth, T teeth, R tongue,
#         B ear bolt, A antenna, L antenna light (course colour via CSS)
BASE = [
"..........L.........",  # 0 antenna LED
"..........A.........",  # 1 antenna stem
"......KKKKAKKKK.....",  # 2
"....KKHHHHHHHHHKK...",  # 3
"...KHHHHHHHhhHHHHK..",  # 4
"..KHHHHHHHhhHHHHHHK.",  # 5
".KHHHHHHHHHHHHHHHHHK",  # 6
".KHHHHHHHHHHHHHHHHHK",  # 7
"KHHHHHHHHHHHHHHHHHHK",  # 8
"KHHHHHHHHHHHHHHHHHHK",  # 9
"KHHHsHHHHssHHHHsHHHK",  # 10 fringe tips
"KHHssssssssssssssHHK",  # 11 shadow under the fringe
"BHSSSSSSSSSSSSSSSSHB",  # 12 eyes go here
"BHSSSSSSSSSSSSSSSSHB",  # 13
"BKSSSSSSSSSSSSSSSsKB",  # 14
".KSSCCSSSSSSSSCCSsK.",  # 15 cheeks
".KSSSSSSSSSSSSSSSsK.",  # 16 mouth goes here
"..KSSSSSSSSSSSSSsK..",  # 17
"..KSSSSSSSSSSSSSsK..",  # 18
"...KSSSSSSSSSSSsK...",  # 19
"....KKSSSSSSSSKK....",  # 20
"......KKKKKKKK......",  # 21
]
# overlays: (row, col, char)
EYES_OPEN = [(12,5,'E'),(12,6,'W'),(13,5,'E'),(13,6,'E'), (12,13,'E'),(12,14,'W'),(13,13,'E'),(13,14,'E')]
EYES_BLINK = [(13,5,'E'),(13,6,'E'),(13,13,'E'),(13,14,'E')]
EYES_HAPPY = [(12,5,'E'),(12,6,'E'),(13,4,'E'),(13,7,'E'), (12,13,'E'),(12,14,'E'),(13,12,'E'),(13,15,'E')]
MOUTH_SMILE = [(16,6,'M')]+[(16,c,'T') for c in range(7,13)]+[(16,13,'M'),(17,7,'M')]+[(17,c,'T') for c in range(8,12)]+[(17,12,'M')]+[(18,c,'M') for c in range(8,12)]
MOUTH_TALK = [(16,6,'M')]+[(16,c,'T') for c in range(7,13)]+[(16,13,'M'),(17,7,'M')]+[(17,c,'M') for c in range(8,12)]+[(17,12,'M'),(18,8,'M'),(18,9,'R'),(18,10,'R'),(18,11,'M'),(19,9,'M'),(19,10,'M')]
COLORS = {
 'K':'#221f1a','H':'#24201e','h':'#4d443d','S':'#f3c9a3','s':'#dba47d','C':'#eb9a86',
 'E':'#221f1a','W':'#fffaf0','M':'#6b2b25','T':'#fffaf0','R':'#c8574c',
 'B':'#8e959c','A':'#6b6255','L':'#b0432c'
}
for r in BASE: assert len(r)==20, (r, len(r))
assert len(BASE)==22

def runs(cells):
    """cells: dict (r,c)->ch ; merge horizontal runs of same char into rects"""
    out=[]
    for r in range(22):
        c=0
        while c<20:
            ch=cells.get((r,c))
            if ch is None or ch=='.': c+=1; continue
            c2=c
            while c2+1<20 and cells.get((r,c2+1))==ch: c2+=1
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

svg=['<svg class="robot__face" viewBox="0 0 20 22" width="60" height="66" shape-rendering="crispEdges" aria-hidden="true" focusable="false">']
svg.append('<g class="rf-base">'+rects(base)+'</g>')
svg.append('<g class="rf-eyes rf-eyes--open">'+rects(overlay(EYES_OPEN))+'</g>')
svg.append('<g class="rf-eyes rf-eyes--blink">'+rects(overlay(EYES_BLINK))+'</g>')
svg.append('<g class="rf-eyes rf-eyes--happy">'+rects(overlay(EYES_HAPPY))+'</g>')
svg.append('<g class="rf-mouth rf-mouth--smile">'+rects(overlay(MOUTH_SMILE))+'</g>')
svg.append('<g class="rf-mouth rf-mouth--talk">'+rects(overlay(MOUTH_TALK))+'</g>')
svg.append('</svg>')
OUT.write_text(''.join(svg), encoding='utf-8')

print(f"wrote {OUT.relative_to(OUT.parent.parent)}")

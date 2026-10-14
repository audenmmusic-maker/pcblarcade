from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageOps
from pathlib import Path

root=Path("site")
out=root/"assets"
out.mkdir(exist_ok=True)
W,H=1600,900
bg=Image.open(root/"games/versus/assets/parks/main_preview.jpg").convert("RGB")
bg=ImageOps.fit(bg,(W,H),Image.Resampling.LANCZOS,centering=(0.5,0.52)).convert("RGBA")
bg=ImageEnhance.Color(bg).enhance(1.2)
bg=ImageEnhance.Contrast(bg).enhance(1.24)
# Cinematic dark grade to foreground characters.
shade=Image.new("RGBA",(W,H),(0,0,0,0)); pen=ImageDraw.Draw(shade)
for y in range(H):
    pen.line((0,y,W,y),fill=(7,16,18,int(35+135*(y/H)**2)))
bg=Image.alpha_composite(bg,shade)
# In-game rendered character portraits taken from PCBL's own 3D model preview.
models=Image.open(root/"games/versus/model_preview.png").convert("RGB")
# Five PCBL characters from existing 3D engine output, Josef from Derby's included game asset.
front={"auden":(0,90,345,464),"jarvis":(350,90,696,464),"najee":(702,90,1046,464),"jason":(1052,90,1395,464),"coel":(1403,90,1747,464)}
portraits={k:models.crop(rect) for k,rect in front.items()}
portraits["josef"]=Image.open(root/"games/home-run-derby/assets/josef-photo.png").convert("RGB")
lineup=["josef","coel","jason","najee","auden","jarvis"]
sizes=[(96,230),(110,256),(124,286),(138,316),(152,346),(164,378)]
x=630
base_y=840
fore=Image.new("RGBA",(W,H),(0,0,0,0))
for i,name in enumerate(lineup):
    width,height=sizes[i]
    p=ImageOps.fit(portraits[name],(width,height),Image.Resampling.LANCZOS,centering=(0.5,0.35))
    p=ImageEnhance.Contrast(p).enhance(1.18)
    p=ImageEnhance.Color(p).enhance(0.87)
    plate=Image.new("RGBA",(width+8,height+8),(11,26,19,255))
    plate.paste(p,(4,4))
    ImageDraw.Draw(plate).rectangle((1,1,width+6,height+6),outline=(189,225,169,225),width=3)
    y=base_y-height
    fore.alpha_composite(plate,(x,y))
    x+=width+13
# Low-poly 3D-inspired street action — no labels, icons or emoji.
p=ImageDraw.Draw(fore)
# Street leading from Stuy oval foreground
p.polygon([(0,760),(460,600),(705,620),(520,900),(0,900)],fill=(18,27,30,195))
# Two cars and bright light flares, perspective
for x,y,s,color in [(145,693,1.2,(176,40,35,255)),(300,630,.77,(51,109,171,255))]:
    p.rounded_rectangle((x,y,x+140*s,y+44*s),radius=10,fill=color)
    p.polygon([(x+26*s,y),(x+56*s,y-24*s),(x+106*s,y-24*s),(x+126*s,y)],fill=color)
    for wheel in (x+25*s,x+112*s):
        p.ellipse((wheel,y+31*s,wheel+24*s,y+58*s),fill=(10,12,14,255))
# The approaching antagonists are silhouetted game-style characters, not real photographs.
for i in range(7):
    xx=80+i*61
    yy=552-i%3*22
    s=1.0-(i%3)*.12
    p.ellipse((xx,yy,xx+20*s,yy+21*s),fill=(25,24,24,255))
    p.polygon([(xx-8*s,yy+23*s),(xx+26*s,yy+23*s),(xx+36*s,yy+75*s),(xx-16*s,yy+75*s)],fill=(25,24,24,255))
    p.line((xx,yy+70*s,xx-8*s,yy+116*s),fill=(25,24,24,255),width=7)
    p.line((xx+18*s,yy+70*s,xx+28*s,yy+114*s),fill=(25,24,24,255),width=7)
# Murphy with ball leading the group, a stylized 3D scene stand-in.
p.ellipse((98,670,220,730),fill=(85,75,69,255))
p.ellipse((200,649,264,702),fill=(85,75,69,255))
p.polygon([(205,656),(219,630),(235,659)],fill=(85,75,69,255))
p.polygon([(236,653),(249,633),(257,658)],fill=(85,75,69,255))
for lx in (118,150,188,212):
    p.line((lx,715,lx-10,760),fill=(85,75,69,255),width=11)
p.ellipse((251,668,285,700),fill=(174,228,89,255),outline=(245,249,231,255),width=2)
# Cast props: real cards plus hand-drawn game-style gear; single integrated composition.
card=Image.open(root/"games/attax/cards/53.webp").convert("RGBA")
for offset in range(3):
    pic=card.resize((38,52),Image.Resampling.LANCZOS).rotate(-10+offset*7,expand=True)
    fore.alpha_composite(pic,(630+offset*12,772-offset*8))
p.rounded_rectangle((702,770,730,824),8,fill=(235,236,235,255)) # creatine
p.ellipse((789,777,824,812),fill=(174,223,78,255)) # blitzball
p.rounded_rectangle((763,800,815,828),8,fill=(213,177,99,255)) # sandwich
p.ellipse((924,786,978,840),fill=(221,119,55,255),outline=(64,35,24,255),width=3) # basketball
p.line((953,786,953,840),fill=(64,35,24,255),width=3)
p.rounded_rectangle((1091,759,1118,834),9,fill=(43,126,240,255),outline=(210,223,245,255),width=2) # Gatorade
p.rectangle((1097,750,1112,761),fill=(245,245,245,255))
p.ellipse((1260,776,1320,821),fill=(86,75,67,255)) # Murphy in Auden arms
p.ellipse((1311,764,1341,796),fill=(86,75,67,255))
p.ellipse((1332,782,1355,804),fill=(174,228,89,255),outline=(244,245,230,255),width=2)
p.line((1487,530,1570,491),fill=(21,24,26,255),width=9) # bat on Jarvis shoulder
bg=Image.alpha_composite(bg,fore)
# Film grade and final crop.
bg=ImageEnhance.Contrast(bg).enhance(1.07)
bg.convert("RGB").save(out/"pcbl-world-cinematic-banner.jpg",quality=90,optimize=True)
card=bg.crop((630,230,1580,880)).resize((900,620),Image.Resampling.LANCZOS)
card.convert("RGB").save(out/"pcbl-world-cinematic-card.jpg",quality=88,optimize=True)
print("Generated cinematic banners", (out/"pcbl-world-cinematic-banner.jpg").stat().st_size)

# Step 2: vectorise walls, openings, rooms, stair into build/model.json (metres).
# All pixel coordinates refer to the plan scans in source/plans. Run from the project root.
import cv2, numpy as np, json
S=75.35                      # px per metre (from 4.16/3.20/5.74/2.82 chains)
OX,OY=328,208                # ground-floor inner NW corner = origin
LDX,LDY=-60,-162             # loft px -> ground px: loft centred (confirmed by photos)
LDXS=-100                    # stair, stair hole and chimney: where the ground-floor sheet puts them
def m(x,y): return [round((x-OX)/S,3), round((y-OY)/S,3)]

def clean(t,minarea=60):
    n,lab,st,_=cv2.connectedComponentsWithStats(t,8)
    out=np.zeros_like(t)
    for i in range(1,n):
        if st[i,4]>=minarea: out[lab==i]=1
    return out

def polys(mask, off=(0,0), eps=1.2):
    cs,h=cv2.findContours(mask.astype(np.uint8),cv2.RETR_CCOMP,cv2.CHAIN_APPROX_NONE)
    out=[]
    if h is None: return out
    h=h[0]
    for i,c in enumerate(cs):
        if h[i][3]!=-1: continue
        def conv(c):
            a=cv2.approxPolyDP(c,eps,True)[:,0,:]
            return [m(x+off[0]+0.5,y+off[1]+0.5) for x,y in a]
        holes=[]; j=h[i][2]
        while j!=-1:
            holes.append(conv(cs[j])); j=h[j][0]
        if cv2.contourArea(c)<15: continue
        out.append({'outer':conv(c),'holes':holes})
    return out

t1=clean(np.load('build/t1.npy')); t2=clean(np.load('build/t2.npy'))

# ---------- openings (pixel coords, measured from the drawings) ----------
def win(axis,band,a,b,sill,head,kind='window'):
    return dict(axis=axis,band=band,a=a,b=b,sill=sill,head=head,kind=kind)
t1[270:460,313:329]=1; t1[283:367,313:329]=0; t1[378:458,313:329]=0   # Bad windows per photo
t2[358:373,569:772]=1   # close the sketch's wide north-gable window gaps; the narrower openings come from L_open
# heights from the 1993 section and plan: 1.2 m tall windows with heads at 2.10, front door and sidelights 2.08, terrace door 2.09
G_open=[win('v',(313,328),y0,y1,0.9,2.1) for y0,y1 in [(283,366),(378,457),(818,906),(954,1042)]]
G_open+=[win('v',(313,328),y0,y1,0.05,2.08) for y0,y1 in [(549,593),(675,718)]]   # glazed sidelights
G_open+=[win('v',(890,905),y0,y1,0.9,2.1) for y0,y1 in [(246,335),(375,464),(563,652),(692,780),(827,915),(955,1043)]]
G_open+=[win('h',(1089,1103),733,821,0.9,2.1),
         win('h',(1089,1103),449,583,0,2.09,'door'),   # terrace double door
         win('v',(313,328),601,667,0,2.08,'door')]     # front door
G_int=[('h',(389,398),544,595),('v',(642,648),443,501),('v',(492,498),585,635),('h',(764,771),350,410)]
# north gable windows: the sketch draws 1.18 m, but the Soverom 2 photo shows one sash of about 0.65 m, 0.2 m from the partition
# south gable and dormer windows: 1.2 m tall, at the heights the 1993 facades give (loft floor 2.63)
L_open=[win('h',(358,372),596,644,0.85,2.1),win('h',(358,372),697,745,0.85,2.1),
        win('h',(1251,1265),579,759,1.05,2.25),win('v',(374,388),729,908,0.85,2.05),
        win('v',(886,900),727,771,0,0.8,'door')]
for o in L_open[:3]: o['gable']=True
L_open[3]['ark']=True      # knee-wall hatch from Bod
L_int=[('h',(682,689),590,650),('h',(682,689),690,750),('v',(774,781),700,750),('h',(932,939),750,808)]

def op_json(ops,off,H):
    out=[]
    for o in ops:
        (b0,b1)=o['band']
        if o['axis']=='v': x0,x1,y0,y1=b0,b1+1,o['a'],o['b']+1
        else: x0,x1,y0,y1=o['a'],o['b']+1,b0,b1+1
        p0=m(x0+off[0],y0+off[1]); p1=m(x1+off[0],y1+off[1])
        out.append(dict(x0=p0[0],z0=p0[1],x1=p1[0],z1=p1[1],sill=o['sill'],head=o['head'],kind=o['kind'],axis=o['axis'],gable=o.get('gable',False),ark=o.get('ark',False)))
    return out
def lint_json(ints,off):
    out=[]
    for ax,(b0,b1),a,b in ints:
        if ax=='v': x0,x1,y0,y1=b0,b1+1,a,b+1
        else: x0,x1,y0,y1=a,b+1,b0,b1+1
        p0=m(x0+off[0],y0+off[1]); p1=m(x1+off[0],y1+off[1])
        out.append(dict(x0=p0[0],z0=p0[1],x1=p1[0],z1=p1[1]))
    return out

# ---------- rooms by flood fill on a closed mask ----------
def closed(t,ops,ints,extra=[]):
    c=t.copy()
    for o in ops:
        b0,b1=o['band']
        if o['axis']=='v': c[o['a']-1:o['b']+2,b0:b1+1]=1
        else: c[b0:b1+1,o['a']-1:o['b']+2]=1
    for ax,(b0,b1),a,b in ints:
        if ax=='v': c[a-1:b+2,b0:b1+1]=1
        else: c[b0:b1+1,a-1:b+2]=1
    for (x0,y0,x1,y1) in extra: cv2.line(c,(x0,y0),(x1,y1),1,3)
    return c
def rooms(c,seeds,off):
    out=[]
    for name,(sx,sy) in seeds:
        ff=(1-c).astype(np.uint8).copy()
        msk=np.zeros((c.shape[0]+2,c.shape[1]+2),np.uint8)
        cv2.floodFill(ff,msk,(sx,sy),2)
        r=(ff==2).astype(np.uint8)
        area=r.sum()/S/S
        ys,xs=np.nonzero(r)
        P=polys(r,off,eps=1.5)
        out.append(dict(name=name,area=round(float(area),1),cx=m(xs.mean()+off[0],ys.mean()+off[1]),poly=P))
    return out
cg=closed(t1,G_open,G_int,[(715,768,892,768)])   # kitchen/living split (open plan)
G_rooms=rooms(cg,[('Bad',(480,300)),('Soverom',(770,360)),('Entré',(400,640)),('Vaskerom',(550,700)),
                  ('Kjøkken',(790,660)),('Stue',(610,950))],(0,0))
cl=closed(t2,L_open,L_int,[(745,930,745,832)])
L_rooms=rooms(cl,[('Soverom 2',(560,520)),('Soverom 3',(780,520)),('Loftstue',(550,780)),('Bod',(830,760)),
                  ('Soverom 4',(670,1100))],(LDX,LDY))

# ---------- footprints ----------
def footprint(c):
    ff=c.copy().astype(np.uint8); msk=np.zeros((c.shape[0]+2,c.shape[1]+2),np.uint8)
    cv2.floodFill(ff,msk,(5,5),2)
    fp=(ff!=2).astype(np.uint8)
    fp=cv2.morphologyEx(fp,cv2.MORPH_OPEN,np.ones((9,9),np.uint8))
    return fp
G_fp=polys(footprint(cg),(0,0),eps=2)
lf=footprint(cl)
L_fp=polys(lf,(LDX,LDY),eps=2)

# ---------- stair (loft px, from the loft drawing) ----------
treads=[]
xs=np.linspace(515,650,9)
for i in range(8): treads.append([[xs[i],862],[xs[i+1],862],[xs[i+1],926],[xs[i],926]])
P=(650,862); R=None
import math
def ray(a):   # from P toward angle a (screen coords, 90=south, 0=east), clip to box x<=740,y<=926
    dx,dy=math.cos(math.radians(a)),math.sin(math.radians(a))
    ts=[]
    if dx>1e-6: ts.append((740-P[0])/dx)
    if dy>1e-6: ts.append((926-P[1])/dy)
    t=min(ts); return [P[0]+dx*t,P[1]+dy*t]
angs=np.linspace(90,0,6)
for i in range(5):
    a0,a1=angs[i],angs[i+1]
    pts=[list(P),ray(a0)]
    if a0>math.degrees(math.atan2(926-P[1],740-P[0]))>a1: pts.append([740,926])
    pts.append(ray(a1))
    treads.append(pts)
# the winder pivots at (650,862); last two treads go north in the 680-740 strip
treads[-1]=treads[-1]
for y0,y1 in [(862,847),(847,832)]:
    treads.append([[680,y0],[740,y0],[740,y1],[680,y1]])
stair=[[m(x+LDXS,y+LDY) for x,y in t] for t in treads]
hole=[m(x+LDXS,y+LDY) for x,y in [(515,860),(680,860),(680,830),(747,830),(747,932),(515,932)]]

terrace=[m(205,1104),m(1017,1104),m(1017,1414),m(205,1414)]
chimney=[m(697+LDXS,942+LDY),m(742+LDXS,942+LDY),m(742+LDXS,985+LDY),m(697+LDXS,985+LDY)]
# fireplace (ground-floor sheet + Stue photos): a stone-clad column (the flue square plus the stub wall east of it),
# a corner stove between that stub and the Stue's north wall, a quarter-ellipse hearth plate (the arc, semi-axes in m),
# and stone on the north wall from the stub to where the wall ends
fire=dict(column=[m(594,771),m(641,818)],corner=m(641,771),hearth=[round(73/S,3),round(51/S,3)],cladTo=m(714,0)[0])

sx0,sx1,sy0,sy1=515+LDXS,740+LDXS,862+LDY,926+LDY      # stair footprint in ground-floor px
t1w=t1.copy(); t1w[sy0:sy1,sx0:sx1+1]=0
t1s=np.zeros_like(t1); t1s[sy0:sy1,sx0:sx1+1]=t1[sy0:sy1,sx0:sx1+1]
t2w=t2.copy(); t2w[354:376,436:904]=0; t2w[1247:1269,436:904]=0
t2a=np.zeros_like(t2w); t2a[668:952,360:439]=t2w[668:952,360:439]   # dormer front and side walls, up to the knee wall
t2m=t2w.copy(); t2m[668:952,360:439]=0
ark=dict(zN=m(0,675+LDY)[1],zS=m(0,947+LDY)[1],x=m(374+LDX,0)[0])
house=dict(xW=m(313,0)[0],xE=m(906,0)[0],zN=m(0,193)[1],zS=m(0,1104)[1],xIn=m(890,0)[0],zIn=m(0,1089)[1],kneeW=m(439+LDX,0)[0],kneeE=m(901+LDX,0)[0])

# ---------- site, from the sales prospectus (2026): plot 76/231 and the detached garage ----------
# The 1:500 pipe map (source/drawings/va-kart-1-500.png) carries the UTM grid. On it the house outline is centred at
# E 581989.91 N 6645013.64 with its long side at grid bearing 21.7°, and the garage outline (roof, eaves included) is centred
# at E 581975.07 N 6645024.26. Grid north is 1.2° east of true north here, so plan-up points 22.9° east of true north.
import math
GB=math.radians(21.7); HE,HN=581989.91,6645013.64; HX,HZ=(house['xW']+house['xE'])/2,(house['zN']+house['zS'])/2
def utm(E,N):
    dE,dN=E-HE,N-HN
    return [round(HX+dE*math.cos(GB)-dN*math.sin(GB),3),round(HZ-dE*math.sin(GB)-dN*math.cos(GB),3)]
# registered boundary points 1-8 (EUREF89 UTM32, N/E); 3-4 is an arc of radius 3.00 m bulging out. Area 566.0 m².
BP=[(6645001.00,581993.34),(6645010.75,581971.11),(6645025.90,581969.46),(6645028.87,581972.92),
    (6645026.12,581979.06),(6645027.30,581981.32),(6645028.22,581981.70),(6645020.08,582001.27)]
plot=[]
for i,(N,E) in enumerate(BP):
    plot.append(utm(E,N))
    if i==2:   # arc from point 3 to 4, centre on the plot side of the chord
        (N4,E4)=BP[3]; c=math.dist((E,N),(E4,N4)); ux,uy=(E4-E)/c,(N4-N)/c; d=math.sqrt(9-c*c/4)
        mx,my=(E+E4)/2,(N+N4)/2; cE,cN=max([(mx-uy*d,my+ux*d),(mx+uy*d,my-ux*d)],key=lambda q:q[0])
        a0=math.atan2(N-cN,E-cE); da=(math.atan2(N4-cN,E4-cE)-a0+math.pi)%(2*math.pi)-math.pi
        plot+=[utm(cE+3*math.cos(a0+da*t/8),cN+3*math.sin(a0+da*t/8)) for t in range(1,8)]
# garage: 6.0 × 7.0 m inside (1994 drawing), about 6.3 × 7.3 m outside, ridge along x, doors facing the courtyard (+x)
gc=utm(581975.07,6645024.26)
garage=dict(x0=round(gc[0]-3.65,3),x1=round(gc[0]+3.65,3),z0=round(gc[1]-3.15,3),z1=round(gc[1]+3.15,3))

model=dict(scale_px_per_m=S,house=house,ark=ark,loft_offset_px=[LDX,LDY],north_bearing_of_plan_up=22.9,
  ground=dict(walls=polys(t1w),stairWalls=polys(t1s),openings=op_json(G_open,(0,0),2.4),lintels=lint_json(G_int,(0,0)),rooms=G_rooms,footprint=G_fp),
  loft=dict(walls=polys(t2m,(LDX,LDY)),arkWalls=polys(t2a,(LDX,LDY)),openings=op_json(L_open,(LDX,LDY),2.3),lintels=lint_json(L_int,(LDX,LDY)),rooms=L_rooms,footprint=L_fp,stairHole=hole),
  stair=stair,terrace=terrace,chimney=chimney,fire=fire,plot=plot,garage=garage,
  plan_px={'ground':[OX,OY],'loft':[OX-LDX,OY-LDY]})
json.dump(model,open('build/model.json','w'),separators=(',',':'))
for r in G_rooms+L_rooms: print(r['name'],r['area'],len(r['poly']))
print('walls',len(model['ground']['walls']),len(model['loft']['walls']))
import os; print(os.path.getsize('build/model.json'))
cv2.imwrite('build/cg.png',255-cg*255); cv2.imwrite('build/cl.png',255-cl*255)

# ---------- slabs / floors with the stair hole (slit trick keeps polygons simple) ----------
def with_hole(mask, rect_pts, slit_y, off):
    mm=mask.copy().astype(np.uint8)
    cv2.fillPoly(mm,[np.array(rect_pts,np.int32)],0)
    if slit_y>0: mm[slit_y-1:slit_y+1,:rect_pts[0][0]+1]=0
    return polys(mm,off,eps=1.5)
hole_px=[(x+LDXS-LDX,y) for x,y in [(513,860),(680,860),(680,830),(747,830),(747,933),(513,933)]]
model['loft']['slab']=with_hole(lf,hole_px,896,(LDX,LDY))
# Loftstue floor
ff=(1-cl).astype(np.uint8).copy(); msk=np.zeros((cl.shape[0]+2,cl.shape[1]+2),np.uint8)
cv2.floodFill(ff,msk,(550,780),2); rs=(ff==2).astype(np.uint8)
for r in model['loft']['rooms']:
    if r['name']=='Loftstue':
        r['poly']=with_hole(rs,hole_px,-5,(LDX,LDY))
        r['area_net']=round(float((rs.sum()-cv2.fillPoly(np.zeros_like(rs),[np.array(hole_px,np.int32)],1).sum())/S/S),1)
json.dump(model,open('build/model.json','w'),separators=(',',':'))
print('holes in walls:',[len(w['holes']) for w in model['ground']['walls']+model['loft']['walls'] if w['holes']])
print('slab parts',len(model['loft']['slab']),[len(p['holes']) for p in model['loft']['slab']])
print('loftstue',[ (len(p['outer']),len(p['holes'])) for r in model['loft']['rooms'] if r['name']=='Loftstue' for p in r['poly']])

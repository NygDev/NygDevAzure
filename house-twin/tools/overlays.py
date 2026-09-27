# Step 3: crop the plan scans into build/plans.json (the "Scanned plans" overlay).
import cv2, base64, json, numpy as np
S=75.35; OX,OY=328,208; LDX,LDY=-60,-162   # must match tools/build.py
def crop(path,box,off):
    g=cv2.imread(path,0); x0,y0,x1,y1=box
    q=(np.round(g[y0:y1,x0:x1]/85.0)*85).astype(np.uint8)   # 4 grey levels: line drawings stay crisp at a quarter of the JPEG size
    ok,buf=cv2.imencode('.png',q,[cv2.IMWRITE_PNG_COMPRESSION,9])
    return dict(src='data:image/png;base64,'+base64.b64encode(buf).decode(),x0=round((x0+off[0]-OX)/S,3),z0=round((y0+off[1]-OY)/S,3),x1=round((x1+off[0]-OX)/S,3),z1=round((y1+off[1]-OY)/S,3))
p=dict(ground=crop('source/plans/1ste_etg.jpg',(196,180,1030,1424),(0,0)),
       loft=crop('source/plans/loft.jpg',(366,346,912,1276),(LDX,LDY)))
json.dump(p,open('build/plans.json','w'))

# Step 1: threshold the plan scans and keep only thick strokes (walls).
# Run from the project root.
import cv2, numpy as np, json, os
os.makedirs("build/shots",exist_ok=True)   # build/ is not in git
def mask(path, box):
    g=cv2.imread(path,0)
    dark=(g<110).astype(np.uint8)
    x0,y0,x1,y1=box
    m=np.zeros_like(dark); m[y0:y1,x0:x1]=dark[y0:y1,x0:x1]
    k=np.ones((5,5),np.uint8)
    thick=cv2.morphologyEx(m,cv2.MORPH_OPEN,k)
    return dark, thick
d1,t1=mask('source/plans/1ste_etg.jpg',(300,185,915,1110))
d2,t2=mask('source/plans/loft.jpg',(365,350,910,1275))
cv2.imwrite('build/t1.png',255-t1*255); cv2.imwrite('build/t2.png',255-t2*255)
np.save('build/t1.npy',t1);np.save('build/t2.npy',t2)

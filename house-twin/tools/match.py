# Step 7: photo match. Fit a camera to each photo in source/photos/match.json (focal length scan + solvePnP),
# render the model from that camera and blend it over the photo -> build/shots/match_*.png. Run after tools/shot.py.
import asyncio, base64, json, pathlib, cv2, numpy as np
from playwright.async_api import async_playwright
T3='vendor/three.js/'
cfg=json.load(open('source/photos/match.json',encoding='utf-8'))

def fit(P,shape):
    h,w=shape[:2]; W=np.array([p[:3] for p in P],np.float64); I=np.array([p[3:] for p in P],np.float64); best=None
    for f in np.arange(400,4000,5.0):
        K=np.array([[f,0,w/2],[0,f,h/2],[0,0,1]])
        ok,rv,tv=cv2.solvePnP(W,I,K,None,flags=cv2.SOLVEPNP_ITERATIVE)
        if not ok: continue
        rv,tv=cv2.solvePnPRefineLM(W,I,K,None,rv,tv)
        e=np.sqrt(((cv2.projectPoints(W,rv,tv,K,None)[0][:,0]-I)**2).sum(1).mean())
        if best is None or e<best[0]: best=(e,f,rv,tv,K)
    return best

async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
        pg=await b.new_page(viewport={'width':800,'height':600})
        async def route(r):
            u=r.request.url
            if 'three.min.js' in u: await r.fulfill(path=T3+'build/three.min.js',content_type='text/javascript')
            elif 'OrbitControls' in u: await r.fulfill(path=T3+'examples/js/controls/OrbitControls.js',content_type='text/javascript')
            elif u.startswith('file:') or u.startswith('data:'): await r.continue_()
            else: await r.abort()
        await pg.route('**/*',route)
        await pg.goto(pathlib.Path('build/test.html').resolve().as_uri(),timeout=90000); await pg.wait_for_timeout(1500)
        for name,c in cfg.items():
            if name.startswith('_'): continue
            photo=cv2.imread('source/photos/'+c['file']); h,w=photo.shape[:2]
            e,f,rv,tv,K=fit(c['points'],photo.shape)
            R,_=cv2.Rodrigues(rv); C=(-R.T@tv).ravel()
            print(f"{name}: rms {e:.1f} px, f {f:.0f} px, camera at x {C[0]:.1f} y {C[1]:.1f} z {C[2]:.1f} m")
            png=await pg.evaluate("""([W,H,f,R,C])=>{
              const {scene,THREE}=__twin; const r=new THREE.WebGLRenderer({alpha:true,antialias:true,preserveDrawingBuffer:true});
              r.setSize(W,H,false); r.outputEncoding=THREE.sRGBEncoding; r.localClippingEnabled=true; r.shadowMap.enabled=true;
              const cam=new THREE.PerspectiveCamera(2*Math.atan(H/2/f)*180/Math.PI,W/H,0.1,500);
              const X=new THREE.Vector3(...R[0]), Y=new THREE.Vector3(...R[1]).negate(), Z=new THREE.Vector3(...R[2]).negate();
              cam.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(X,Y,Z)); cam.position.set(...C); cam.updateMatrixWorld();
              const bg=scene.background, fog=scene.fog, hid=[]; scene.background=null; scene.fog=null;
              scene.traverse(o=>{if(o.name==='Terreng'&&o.visible){o.visible=false;hid.push(o);}});
              r.render(scene,cam); const url=r.domElement.toDataURL('image/png');
              scene.background=bg; scene.fog=fog; hid.forEach(o=>o.visible=true); r.dispose(); return url;}""",[w,h,f,R.tolist(),C.tolist()])
            ren=cv2.imdecode(np.frombuffer(base64.b64decode(png.split(',')[1]),np.uint8),cv2.IMREAD_UNCHANGED)
            a=(ren[:,:,3:4].astype(np.float32)/255)*0.55
            out=(photo.astype(np.float32)*(1-a)+ren[:,:,:3].astype(np.float32)*a).astype(np.uint8)
            proj=cv2.projectPoints(np.array([p[:3] for p in c['points']],np.float64),rv,tv,K,None)[0][:,0]
            for (u,v),q in zip(proj,c['points']):
                cv2.circle(out,(int(q[3]),int(q[4])),5,(0,255,255),1); cv2.drawMarker(out,(int(u),int(v)),(255,255,0),cv2.MARKER_CROSS,8,1)
            cv2.imwrite(f'build/shots/match_{name}.png',out)
        await b.close()
asyncio.run(main())

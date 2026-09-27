# Step 6: load the exported .glb with plain GLTFLoader (no clipping) and render views to build/shots/glb_*.png.
import asyncio, base64
from playwright.async_api import async_playwright
import os, pathlib
T3=os.environ.get('THREE_DIR','vendor/three.js').rstrip('/')+'/'
ROOT=os.path.abspath('.')
glb=base64.b64encode(open('out/mallingsrudveien-30.glb','rb').read()).decode()
html='''<!doctype html><html><body style="margin:0;background:#191919"><canvas id=c width=900 height=620></canvas>
<script src="three.min.js"></script><script src="GLTFLoader.js"></script><script>
const r=new THREE.WebGLRenderer({canvas:document.getElementById('c'),antialias:true,preserveDrawingBuffer:true});
r.outputEncoding=THREE.sRGBEncoding;
const s=new THREE.Scene(); s.background=new THREE.Color(0x191919);
s.add(new THREE.HemisphereLight(0xffffff,0x444444,1.0)); const d=new THREE.DirectionalLight(0xffffff,1.0); d.position.set(-5,10,8); s.add(d);
const cam=new THREE.PerspectiveCamera(35,900/620,0.1,200);
const b=Uint8Array.from(atob("GLB"),c=>c.charCodeAt(0)).buffer;
new THREE.GLTFLoader().parse(b,"",g=>{s.add(g.scene); window.__root=g.scene; window.shot=(p,t)=>{cam.position.set(...p);cam.lookAt(...t);r.render(s,cam);}; window.ready=true;},e=>{window.err=String(e);});
</script></body></html>'''.replace('GLB',glb)
open('build/glbview.html','w',encoding='utf-8').write(html)
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
        pg=await b.new_page(viewport={'width':900,'height':620})
        async def route(r):
            u=r.request.url
            if u.endswith('three.min.js'): await r.fulfill(path=T3+'build/three.min.js',content_type='text/javascript')
            elif u.endswith('GLTFLoader.js'): await r.fulfill(path=T3+'examples/js/loaders/GLTFLoader.js',content_type='text/javascript')
            else: await r.continue_()
        await pg.route('**/*',route)
        await pg.goto(pathlib.Path('build/glbview.html').resolve().as_uri()); await pg.wait_for_function('window.ready||window.err',timeout=60000)
        print('err',await pg.evaluate('window.err'))
        views={'glb_nw':([-12,15,-9],[3.8,2.5,7]),'glb_s':([3.8,5,30],[3.8,3,8]),'glb_w':([-16,8,6],[3.8,3.5,6]),'glb_sw':([-9,11,24],[3.8,2.5,7]),'glb_zoom':([-4.5,8.5,1.5],[0.3,4.9,4.7]),'glb_nook':([3.6,1.9,16.3],[9.6,1.2,13.2]),'glb_se':([20,9,24],[7,2,10]),'glb_line':([12,9,11],[5.6,5.0,5.9])}
        for n,(pos,t) in views.items():
            await pg.evaluate(f'window.shot({pos},{t})'); await pg.wait_for_timeout(300)
            await pg.locator('#c').screenshot(path='build/shots/'+n+'.png')
        await b.close()
asyncio.run(main())

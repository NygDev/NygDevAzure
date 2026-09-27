# Step 5: render the page headlessly (screenshots in build/shots/); `python3 tools/shot.py export` also writes out/*.glb.
import asyncio, base64, sys
from playwright.async_api import async_playwright
import os, pathlib
T3=os.environ.get('THREE_DIR','vendor/three.js').rstrip('/')+'/'
ROOT=os.path.abspath('.')
body=open('out/mallingsrudveien-30.html',encoding='utf-8').read()
doc='<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><style>:root{color-scheme:light}body{margin:0}[hidden]{display:none!important}</style></head><body>'+body+'</body></html>'
open('build/test.html','w',encoding='utf-8').write(doc)
async def main(export=False):
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
        async def route(r):
            u=r.request.url
            if 'three.min.js' in u: await r.fulfill(path=T3+'build/three.min.js',content_type='text/javascript')
            elif 'OrbitControls' in u: await r.fulfill(path=T3+'examples/js/controls/OrbitControls.js',content_type='text/javascript')
            elif u.startswith('file:') or u.startswith('data:'): await r.continue_()
            else: await r.abort()
        for name,vw,vh,scheme in [('desk',1440,900,'light'),('mob',400,860,'dark')]:
            pg=await b.new_page(viewport={'width':vw,'height':vh},color_scheme=scheme)
            errs=[]; pg.on('console',lambda m: errs.append(m.text) if m.type in('error','warning') else None); pg.on('pageerror',lambda e: errs.append(str(e)))
            await pg.route('**/*',route)
            await pg.goto(pathlib.Path('build/test.html').resolve().as_uri(),timeout=90000); await pg.wait_for_timeout(2500)
            await pg.screenshot(path=f'build/shots/{name}.png',full_page=(name=='mob'))
            print(name,'errors:',errs[:8])
            if name=='desk':
                await pg.evaluate("__twin.setFloor('loft')"); await pg.click('[data-cam=plan]'); await pg.click('#tPlan'); await pg.wait_for_timeout(1500)
                await pg.screenshot(path='build/shots/desk_planoverlay.png')
                await pg.click('#tPlan'); await pg.evaluate("__twin.setFloor('ground')"); await pg.wait_for_timeout(1500)
                await pg.screenshot(path='build/shots/desk_gfplan.png')
                await pg.click('[data-cam=\"3d\"]'); await pg.click('#tCut'); await pg.evaluate("__twin.setFloor('exploded')"); await pg.wait_for_timeout(1500)
                await pg.mouse.click(900,600); await pg.wait_for_timeout(500)
                await pg.screenshot(path='build/shots/desk_cut.png')
                await pg.click('[data-cam=plan]'); await pg.wait_for_timeout(1500); await pg.screenshot(path='build/shots/desk_side.png')
                await pg.click('[data-cam="3d"]'); await pg.evaluate("__twin.setFloor('loft')"); await pg.wait_for_timeout(1500); await pg.screenshot(path='build/shots/desk_loft.png')
                await pg.click('#tCut'); await pg.evaluate("__twin.setFloor('outside')"); await pg.wait_for_timeout(1200)
                await pg.evaluate("(()=>{const t=__twin; t.controls.target.set(3.8,3.2,6); t.camera.position.set(-17,7.5,6.8); t.controls.update();})()"); await pg.wait_for_timeout(600)
                await pg.screenshot(path='build/shots/desk_west.png')
                await pg.evaluate("(()=>{const t=__twin; t.controls.target.set(9.6,1.2,13.2); t.camera.position.set(3.6,1.9,16.3); t.controls.update();})()"); await pg.wait_for_timeout(600)
                await pg.screenshot(path='build/shots/desk_nook.png')
                await pg.evaluate("__twin.setFloor('ground')"); await pg.click('#tCut'); await pg.wait_for_timeout(900)
                await pg.evaluate("(()=>{const t=__twin; t.controls.target.set(2.7,0.8,6.9); t.camera.position.set(0.6,5.2,3.6); t.controls.update();})()"); await pg.wait_for_timeout(700)
                await pg.screenshot(path='build/shots/desk_stair.png')
                await pg.evaluate("__twin.setFloor('outside')"); await pg.wait_for_timeout(900)
                await pg.evaluate("(()=>{const t=__twin; t.controls.target.set(2.7,1.0,7.0); t.camera.position.set(2.2,6.0,4.6); t.controls.update();})()"); await pg.wait_for_timeout(700)
                await pg.screenshot(path='build/shots/desk_stair2.png')
                await pg.click('#tCut')
                await pg.evaluate("__twin.setFloor('outside')"); await pg.wait_for_timeout(900)
                await pg.evaluate("(()=>{const t=__twin; t.controls.target.set(3.8,3.2,8); t.camera.position.set(3.3,7,30); t.controls.update();})()"); await pg.wait_for_timeout(600)
                await pg.screenshot(path='build/shots/desk_out2.png')
                # the whole plot: house, garage and the boundary line
                await pg.evaluate("(()=>{const t=__twin; t.controls.target.set(-4,0.5,6); t.camera.position.set(-12,27,36); t.controls.update();})()"); await pg.wait_for_timeout(600)
                await pg.screenshot(path='build/shots/desk_site.png')
                # fireplace, from about where the Stue photo was taken, then facing the stove
                await pg.evaluate("__twin.setFloor('ground')"); await pg.wait_for_timeout(900)
                await pg.evaluate("(()=>{const t=__twin; t.controls.target.set(3.4,1.1,7.6); t.camera.position.set(1.4,1.4,11.3); t.controls.update();})()"); await pg.wait_for_timeout(700)
                await pg.screenshot(path='build/shots/desk_fireplace.png')
                await pg.evaluate("(()=>{const t=__twin; t.controls.target.set(4.3,0.8,7.7); t.camera.position.set(6.0,1.5,10.4); t.controls.update();})()"); await pg.wait_for_timeout(700)
                await pg.screenshot(path='build/shots/desk_stove.png')
                await pg.evaluate("__twin.setFloor('outside')"); await pg.wait_for_timeout(900)
                if export:
                    await pg.add_script_tag(path=T3+'examples/js/exporters/GLTFExporter.js')
                    await pg.click('#tCut'); await pg.evaluate("__twin.setFloor('outside')")
                    b64=await pg.evaluate("""()=>new Promise((res,rej)=>{
                      const {scene,THREE,gf,loftRoot,stairG,site}=__twin; __twin.roof.visible=true;
                      const root=new THREE.Group(); root.name='Mallingsrudveien 30';
                      const keep=[];
                      [site,gf,loftRoot,stairG].forEach(g=>{const c=g.clone(true); root.add(c);});
                      const drop=[]; root.traverse(o=>{if(o.userData.noExport||o.isLineSegments) drop.push(o); o.visible=true;});
                      drop.forEach(o=>o.parent.remove(o));
                      new THREE.GLTFExporter().parse(root,buf=>{
                        const u=new Uint8Array(buf); let s=''; for(let i=0;i<u.length;i+=32768) s+=String.fromCharCode.apply(null,u.subarray(i,i+32768)); res(btoa(s));
                      },e=>rej(String(e)),{binary:true,onlyVisible:false});
                    })""")
                    open('out/mallingsrudveien-30.glb','wb').write(base64.b64decode(b64)); print('glb bytes',len(base64.b64decode(b64)))
            await pg.close()
        await b.close()
asyncio.run(main('export' in sys.argv))

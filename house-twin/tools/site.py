# Step 8: standalone site for public hosting. Writes <dest>/index.html (a full HTML document: head.part in <head>,
# body.part in <body>) and copies out/*.glb next to it. Other files in <dest> are left alone.
# Run after tools/shot.py export:  python3 tools/site.py   (writes ../house, the folder deploy-house.yml publishes)
import sys, shutil, pathlib
dest=pathlib.Path(sys.argv[1] if len(sys.argv)>1 else '../house'); dest.mkdir(parents=True,exist_ok=True)
head=open('web/head.part',encoding='utf-8').read()
body=open('web/body.part',encoding='utf-8').read()
body=body.replace('__MODEL__',open('build/model.json',encoding='utf-8').read()).replace('__PLANS__',open('build/plans.json',encoding='utf-8').read())
icon=("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E"
      "%3Cpath d='M4 15 16 4l12 11v13H4z' fill='%23A3312A'/%3E%3Cpath d='M2 16 16 3l14 13' fill='none' stroke='%23232527' stroke-width='3'/%3E"
      "%3Crect x='13' y='19' width='6' height='9' fill='%23EFECE5'/%3E%3C/svg%3E")
doc=('<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n'
     '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n'
     '<meta name="description" content="3D model of Mallingsrudveien 30, traced from the plan sketches and listing photos. An estimate until measured on site.">\n'
     '<meta name="robots" content="noindex">\n'
     f'<link rel="icon" href="{icon}">\n'+head+'\n</head>\n<body>\n'+body+'\n</body>\n</html>\n')
open(dest/'index.html','w',encoding='utf-8',newline='\n').write(doc)
shutil.copyfile('out/mallingsrudveien-30.glb',dest/'mallingsrudveien-30.glb')
print('wrote',dest/'index.html',len(doc)//1024,'KB and',dest/'mallingsrudveien-30.glb')

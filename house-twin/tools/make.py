# Step 4: assemble the viewer page out/mallingsrudveien-30.html from web/ + build/.
import os; os.makedirs("out",exist_ok=True)   # out/ is not in git
s=open('web/head.part',encoding='utf-8').read()+open('web/body.part',encoding='utf-8').read()
s=s.replace('__MODEL__',open('build/model.json',encoding='utf-8').read()).replace('__PLANS__',open('build/plans.json',encoding='utf-8').read())
open('out/mallingsrudveien-30.html','w',encoding='utf-8',newline='\n').write(s)
print('wrote out/mallingsrudveien-30.html',len(s)//1024,'KB')

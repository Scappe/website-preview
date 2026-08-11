import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const out = path.join(process.cwd(), 'qa-screenshots');
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
const baseURL = process.env.QA_BASE_URL;
if (!baseURL) throw new Error('QA_BASE_URL is required.');
const viewports = [[320,760],[360,800],[390,844],[430,932],[768,1024],[1024,768],[1366,768],[1440,900]];
const MOBILE_HEADER_MAX = 1024;
const browser = await chromium.launch({ headless: true });
const failures = [];
const report = [];

const reactorState = async page => page.evaluate(() => ({
  activeScenes: document.querySelectorAll('[data-reactor-scene].is-active').length,
  visibleScenes: [...document.querySelectorAll('[data-reactor-scene]')].filter(scene => scene.getAttribute('aria-hidden') === 'false').length,
  selectedTabs: document.querySelectorAll('[data-reactor-tab][aria-selected="true"]').length,
  selectedIndex: [...document.querySelectorAll('[data-reactor-tab]')].findIndex(tab => tab.getAttribute('aria-selected') === 'true'),
  activeIndex: [...document.querySelectorAll('[data-reactor-scene]')].findIndex(scene => scene.classList.contains('is-active')),
  runningAnimations: [...document.querySelectorAll('[data-reactor-scene],[data-reactor-primary],[data-reactor-detail]')].reduce((sum,node)=>sum+node.getAnimations().filter(a=>a.playState==='running').length,0)
}));
const validateReactorState = (label,state,expected) => {
  if (state.activeScenes!==1 || state.visibleScenes!==1 || state.selectedTabs!==1 || state.selectedIndex!==expected || state.activeIndex!==expected || state.runningAnimations!==0) failures.push(`${label}: Reactor state is not deterministic ${JSON.stringify(state)}, expected index ${expected}`);
};

for (const [width,height] of viewports) {
  const context = await browser.newContext({ viewport:{width,height}, deviceScaleFactor:1 });
  const page = await context.newPage();
  const consoleErrors=[];
  const resourceErrors=[];
  page.on('console',msg=>{if(msg.type()==='error')consoleErrors.push(msg.text());});
  page.on('pageerror',err=>consoleErrors.push(err.message));
  page.on('response',response=>{
    if(response.status()>=400) resourceErrors.push(`${response.status()} ${response.url()}`);
  });
  page.on('requestfailed',request=>{
    resourceErrors.push(`REQUEST_FAILED ${request.url()} ${request.failure()?.errorText||''}`.trim());
  });
  await page.goto(baseURL,{waitUntil:'networkidle'});
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.waitForTimeout(350);

  const metrics = await page.evaluate(() => {
    const doc=document.documentElement, body=document.body;
    const visible=el=>{const s=getComputedStyle(el),r=el.getBoundingClientRect();return s.display!=='none'&&s.visibility!=='hidden'&&parseFloat(s.opacity||'1')>.01&&r.width>0&&r.height>0;};
    const essential=[...document.querySelectorAll('h1,.button,.btn,.nav-cta,.menu-toggle,.reactor-stage,.reactor-controls,.reactor-tab,.cta-panel,.site-header .logo')].filter(visible);
    const clipped=essential.filter(el=>{const r=el.getBoundingClientRect();return r.right>innerWidth+2||r.left<-2;}).map(el=>({tag:el.tagName,cls:el.className,text:(el.textContent||'').trim().slice(0,80)}));
    const reactorTabs=[...document.querySelectorAll('[data-reactor-tab]')].filter(visible);
    const tabOverlaps=[];
    for(let i=0;i<reactorTabs.length;i++) for(let j=i+1;j<reactorTabs.length;j++){
      const a=reactorTabs[i].getBoundingClientRect(),b=reactorTabs[j].getBoundingClientRect();
      const x=Math.max(0,Math.min(a.right,b.right)-Math.max(a.left,b.left));
      const y=Math.max(0,Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top));
      if(x*y>4) tabOverlaps.push([i,j]);
    }
    const actionButtons=[...document.querySelectorAll('.reactor-copy .actions .btn')].filter(visible);
    const actionOverlaps=[];
    for(let i=0;i<actionButtons.length;i++) for(let j=i+1;j<actionButtons.length;j++){
      const a=actionButtons[i].getBoundingClientRect(),b=actionButtons[j].getBoundingClientRect();
      const x=Math.max(0,Math.min(a.right,b.right)-Math.max(a.left,b.left));
      const y=Math.max(0,Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top));
      if(x*y>4) actionOverlaps.push([i,j]);
    }
    const nav=document.querySelector('.site-header .nav');
    const menu=document.querySelector('.site-header .menu-toggle');
    const logo=document.querySelector('.site-header .logo');
    const navVisible=nav?visible(nav):false, menuVisible=menu?visible(menu):false;
    const logoRect=logo?.getBoundingClientRect();
    const menuRect=menu?.getBoundingClientRect();
    const reactorScenes=[...document.querySelectorAll('[data-reactor-scene]')];
    const proofPanels=[...document.querySelectorAll('[data-proof-panel]')];
    return {
      scrollWidth:Math.max(doc.scrollWidth,body.scrollWidth),clientWidth:doc.clientWidth,clipped,tabOverlaps,actionOverlaps,
      proofCount:proofPanels.length,visibleProofCount:proofPanels.filter(visible).length,reactorCount:reactorScenes.length,reactorTabs:document.querySelectorAll('[data-reactor-tab]').length,
      reactorAssets:reactorScenes.map(scene=>({primary:scene.querySelector('[data-reactor-primary]')?.getAttribute('src')||'',detail:scene.querySelector('[data-reactor-detail] img')?.getAttribute('src')||''})),
      canvasDisplay:document.querySelector('.ambient-canvas')?getComputedStyle(document.querySelector('.ambient-canvas')).display:'missing',
      navVisible,menuVisible,logoWidth:logoRect?.width||0,
      menuWidth:menuRect?.width||0,menuHeight:menuRect?.height||0,
      menuExpanded:menu?.getAttribute('aria-expanded')||null
    };
  });

  if(metrics.scrollWidth>metrics.clientWidth+2) failures.push(`${width}x${height}: horizontal overflow ${metrics.scrollWidth} > ${metrics.clientWidth}`);
  if(metrics.clipped.length) failures.push(`${width}x${height}: clipped essential elements ${JSON.stringify(metrics.clipped)}`);
  if(metrics.tabOverlaps.length) failures.push(`${width}x${height}: Reactor tabs overlap ${JSON.stringify(metrics.tabOverlaps)}`);
  if(metrics.actionOverlaps.length) failures.push(`${width}x${height}: hero actions overlap ${JSON.stringify(metrics.actionOverlaps)}`);
  if(width<=MOBILE_HEADER_MAX){
    if(metrics.navVisible || !metrics.menuVisible) failures.push(`${width}x${height}: mobile/tablet header shows desktop nav or hides menu button`);
    if(metrics.menuWidth<44 || metrics.menuHeight<44) failures.push(`${width}x${height}: menu toggle below 44x44 ${metrics.menuWidth}x${metrics.menuHeight}`);
    if(metrics.menuExpanded!=='false') failures.push(`${width}x${height}: closed header aria-expanded must be false, got ${metrics.menuExpanded}`);
  } else {
    if(!metrics.navVisible || metrics.menuVisible) failures.push(`${width}x${height}: desktop header does not expose desktop nav cleanly`);
  }
  if(width<=600 && (metrics.logoWidth<90 || metrics.logoWidth>150)) failures.push(`${width}x${height}: mobile logo width suspicious ${metrics.logoWidth}`);
  if(metrics.proofCount!==3) failures.push(`${width}x${height}: expected 3 Proof Spine panels, got ${metrics.proofCount}`);
  if(width>680 && metrics.visibleProofCount!==1) failures.push(`${width}x${height}: desktop Proof Spine must expose exactly one panel, got ${metrics.visibleProofCount}`);
  if(width<=680 && metrics.visibleProofCount!==3) failures.push(`${width}x${height}: mobile Proof Spine must expose all three cases, got ${metrics.visibleProofCount}`);
  if(metrics.reactorCount!==3||metrics.reactorTabs!==3) failures.push(`${width}x${height}: expected 3 Reactor scenes/tabs, got ${metrics.reactorCount}/${metrics.reactorTabs}`);
  for(const asset of metrics.reactorAssets){
    if(!asset.primary||!asset.detail||asset.primary===asset.detail) failures.push(`${width}x${height}: Reactor scene lacks distinct primary/detail asset ${JSON.stringify(asset)}`);
    if(/^https?:/i.test(asset.primary)||/^https?:/i.test(asset.detail)) failures.push(`${width}x${height}: Reactor runtime hotlink detected ${JSON.stringify(asset)}`);
  }
  if(width<=768&&metrics.canvasDisplay!=='none') failures.push(`${width}x${height}: ambient canvas still active on mobile/tablet`);
  if(consoleErrors.length || resourceErrors.length) failures.push(`${width}x${height}: console/resource errors ${[...consoleErrors,...resourceErrors].join(' | ')}`);

  const reactorTabs=page.locator('[data-reactor-tab]');
  if(await reactorTabs.count()===3){
    for(const index of [0,1,2,0,2,1]) await reactorTabs.nth(index).click({force:true});
    await page.waitForTimeout(width<=600?560:690);
    validateReactorState(`${width}x${height} rapid-click`,await reactorState(page),1);
    await reactorTabs.nth(0).focus();
    for(const key of ['ArrowRight','ArrowRight','Home','End','ArrowLeft']) await page.keyboard.press(key);
    await page.waitForTimeout(width<=600?560:690);
    validateReactorState(`${width}x${height} rapid-keyboard`,await reactorState(page),1);
  }

  if(width>680){
    const proofTabs=page.locator('[data-proof-tab]');
    if(await proofTabs.count()===3){
      for(const index of [1,2,0]){
        await proofTabs.nth(index).click({force:true});
        await page.waitForTimeout(40);
        const state=await page.evaluate(()=>{
          const panels=[...document.querySelectorAll('[data-proof-panel]')];
          const visible=panels.filter(panel=>{const s=getComputedStyle(panel),r=panel.getBoundingClientRect();return s.display!=='none'&&s.visibility!=='hidden'&&parseFloat(s.opacity||'1')>.01&&r.width>0&&r.height>0;});
          return {visible:visible.length,selected:document.querySelectorAll('[data-proof-tab][aria-selected="true"]').length,active:panels.findIndex(panel=>panel.classList.contains('is-active'))};
        });
        if(state.visible!==1||state.selected!==1||state.active!==index) failures.push(`${width}x${height}: Proof Spine state invalid after selecting ${index}: ${JSON.stringify(state)}`);
      }
    }
  }

  if(width<=680){
    const mobileProof=await page.evaluate(()=>[...document.querySelectorAll('[data-proof-panel]')].map(panel=>{const r=panel.getBoundingClientRect(),s=getComputedStyle(panel);return{hidden:panel.getAttribute('aria-hidden'),display:s.display,visibility:s.visibility,width:r.width};}));
    if(mobileProof.some(p=>p.hidden==='true'||p.display==='none'||p.visibility==='hidden'||p.width<=0)) failures.push(`${width}x${height}: mobile Proof Spine does not expose all cases ${JSON.stringify(mobileProof)}`);
  }

  if(width<=MOBILE_HEADER_MAX){
    const menu=page.locator('.menu-toggle');
    if(await menu.count()){
      await menu.click();
      await page.waitForTimeout(220);
      const openState=await page.evaluate(()=>{
        const nav=document.querySelector('.site-header .nav');
        const menu=document.querySelector('.site-header .menu-toggle');
        const b=nav?.getBoundingClientRect();
        const s=nav?getComputedStyle(nav):null;
        return nav?{open:nav.classList.contains('open'),display:s.display,left:b.left,right:b.right,top:b.top,bottom:b.bottom,expanded:menu?.getAttribute('aria-expanded')||null}:null;
      });
      if(!openState?.open||openState.display==='none'||openState.left<-2||openState.right>width+2||openState.top<-2||openState.bottom>height+2||openState.expanded!=='true') failures.push(`${width}x${height}: mobile menu open state invalid ${JSON.stringify(openState)}`);

      await menu.click();
      await page.waitForTimeout(120);
      const closedState=await page.evaluate(()=>{
        const nav=document.querySelector('.site-header .nav');
        const menu=document.querySelector('.site-header .menu-toggle');
        const r=nav?.getBoundingClientRect();
        const s=nav?getComputedStyle(nav):null;
        return {open:nav?.classList.contains('open')||false,visible:!!nav&&s.display!=='none'&&s.visibility!=='hidden'&&r.width>0&&r.height>0,expanded:menu?.getAttribute('aria-expanded')||null};
      });
      if(closedState.open||closedState.visible||closedState.expanded!=='false') failures.push(`${width}x${height}: mobile menu close state invalid ${JSON.stringify(closedState)}`);
    } else failures.push(`${width}x${height}: canonical menu toggle missing from DOM`);
  }

  await page.screenshot({path:path.join(out,`home-${width}x${height}.png`),fullPage:true});
  report.push({viewport:`${width}x${height}`,metrics,consoleErrors,resourceErrors});
  await context.close();
}

for(const [width,height] of [[390,844],[1366,768]]){
  const context=await browser.newContext({viewport:{width,height},reducedMotion:'reduce'});const page=await context.newPage();const errors=[];page.on('pageerror',err=>errors.push(err.message));
  await page.goto(baseURL,{waitUntil:'networkidle'});await page.waitForTimeout(200);
  const tabs=page.locator('[data-reactor-tab]');
  if(await tabs.count()===3){for(const index of [1,2,0,2])await tabs.nth(index).click({force:true});await page.waitForTimeout(40);validateReactorState(`${width}x${height} reduced-motion`,await reactorState(page),2);}
  const state=await page.evaluate(()=>{const reveals=[...document.querySelectorAll('.reveal,.clip-reveal')];return{revealsVisible:reveals.every(el=>{const s=getComputedStyle(el);return s.opacity!=='0'&&s.visibility!=='hidden';}),reactorTransitions:[...document.querySelectorAll('[data-reactor-scene]')].map(el=>getComputedStyle(el).transitionDuration)};});
  if(!state.revealsVisible)failures.push(`${width}x${height} reduced-motion: hidden reveal content detected`);
  if(state.reactorTransitions.some(value=>value.split(',').some(v=>parseFloat(v)>0)))failures.push(`${width}x${height} reduced-motion: Reactor CSS transition still active ${JSON.stringify(state.reactorTransitions)}`);
  if(errors.length)failures.push(`${width}x${height} reduced-motion: page errors ${errors.join(' | ')}`);
  await page.screenshot({path:path.join(out,`home-${width}x${height}-reduced-motion.png`),fullPage:true});await context.close();
}

await browser.close();
fs.writeFileSync(path.join(out,'report.json'),JSON.stringify({report,failures},null,2));
if(failures.length){console.error('VISUAL QA FAILED');failures.forEach(f=>console.error(`- ${f}`));process.exit(1);}
console.log(`VISUAL QA PASSED: ${viewports.length} breakpoints + canonical <=1024 header open/close contract + Reactor interaction + Proof Spine visibility/state + reduced-motion.`);

import sys, asyncio, re
from playwright.async_api import async_playwright
# usage: sections.py name WxH [lang]  -> opens the envelope, scrolls through every section, screenshots each + layout checks
async def main():
    name, size = sys.argv[1], sys.argv[2]; lang = sys.argv[3] if len(sys.argv) > 3 else 'km'
    w, h = map(int, size.split('x'))
    async with async_playwright() as p:
        b = await p.chromium.launch(args=['--autoplay-policy=no-user-gesture-required'])
        ctx = await b.new_context(viewport={'width': w, 'height': h}, device_scale_factor=1.5 if w < 800 else 1, has_touch=w < 800)
        pg = await ctx.new_page(); logs = []
        pg.on('console', lambda m: logs.append(f'{m.type}: {m.text}') if m.type == 'error' and 'TUNNEL' not in m.text else None)
        pg.on('pageerror', lambda e: logs.append('PAGEERROR ' + str(e)))
        await pg.route(re.compile(r'(googleapis|gstatic|maps.google|google.com)'), lambda r: r.abort())
        await pg.goto(f'http://localhost:8765/index.html?skip&lang={lang}', wait_until='load')
        await pg.wait_for_timeout(11500)
        ids = ['cover', 'invite', 'couple', 'count', 'programme', 'candle', 'gallery', 'venue', 'gift', 'thanks']
        for i in ids:
            await pg.evaluate(f"document.getElementById('{i}').scrollIntoView()")
            await pg.wait_for_timeout(1900)
            if i in ('invite', 'couple', 'programme', 'gallery', 'gift', 'thanks'):
                # also capture the second half of tall sections
                await pg.screenshot(path=f'shots/{name}-{i}.png')
                hgt = await pg.evaluate(f"document.getElementById('{i}').offsetHeight")
                if hgt > h * 1.3:
                    await pg.evaluate(f"window.scrollBy(0,{int(h*0.85)})"); await pg.wait_for_timeout(1700)
                    await pg.screenshot(path=f'shots/{name}-{i}-b.png')
                    if hgt > h * 2.2:
                        await pg.evaluate(f"window.scrollBy(0,{int(h*0.85)})"); await pg.wait_for_timeout(1700)
                        await pg.screenshot(path=f'shots/{name}-{i}-c.png')
            else:
                await pg.screenshot(path=f'shots/{name}-{i}.png')
        res = await pg.evaluate('''() => {
          const vw = document.documentElement.clientWidth, out = {scrollW: document.documentElement.scrollWidth, vw, wide: []};
          document.querySelectorAll('body *').forEach(e => { const r = e.getBoundingClientRect(); if (r.width && e.closest('.viewer,.marq,.env-screen,.bfly,.lantern')==null && (r.right > vw + 2) && getComputedStyle(e).position !== 'fixed') { let p=e, clipped=false; while((p=p.parentElement)){ const o=getComputedStyle(p).overflowX; if(o==='hidden'||o==='clip'||o==='auto'){clipped=true;break;} } if(!clipped) out.wide.push(e.tagName+'.'+e.className+' '+Math.round(r.right)); } });
          const c = document.getElementById('cover'); const cr = c.getBoundingClientRect(); out.cover = {h: Math.round(cr.height), vh: innerHeight};
          const cv = document.querySelector('.cv'); out.cvBottom = Math.round(cv.getBoundingClientRect().bottom); out.cvScrollH = cv.scrollHeight; out.cvClientH = cv.clientHeight;
          out.coverKids = [...document.querySelectorAll('.cv-g > *')].map(e => { const r = e.getBoundingClientRect(); return e.className.slice(0,10)+':'+Math.round(r.top)+'-'+Math.round(r.bottom) });
          return out; }''')
        print(res); print('\n'.join(logs)); await b.close()
asyncio.run(main())

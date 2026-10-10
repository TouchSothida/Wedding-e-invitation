import sys, asyncio
from playwright.async_api import async_playwright
# usage: open_seq.py name WxH  -> frames of the opening + cover + full-page section shots
async def main():
    name, size = sys.argv[1], sys.argv[2]; w, h = map(int, size.split('x'))
    async with async_playwright() as p:
        b = await p.chromium.launch(args=['--autoplay-policy=no-user-gesture-required'])
        ctx = await b.new_context(viewport={'width': w, 'height': h}, device_scale_factor=1.5 if w < 800 else 1, has_touch=w < 800)
        pg = await ctx.new_page(); logs = []
        pg.on('console', lambda m: logs.append(f'{m.type}: {m.text}') if m.type == 'error' and 'TUNNEL' not in m.text else None)
        pg.on('pageerror', lambda e: logs.append('PAGEERROR ' + str(e)))
        await pg.goto('http://localhost:8765/index.html', wait_until='networkidle'); await pg.wait_for_timeout(2300)
        await pg.screenshot(path=f'shots/{name}-f00.png')
        await pg.click('#envStage')
        t = 0
        for i, ms in enumerate([700, 700, 700, 700, 700, 700, 700, 700, 700, 700]):
            await pg.wait_for_timeout(ms); t += ms
            await pg.screenshot(path=f'shots/{name}-f{i+1:02d}.png')
        await pg.wait_for_timeout(2500)
        await pg.screenshot(path=f'shots/{name}-cover.png')
        print('\n'.join(logs)); await b.close()
asyncio.run(main())

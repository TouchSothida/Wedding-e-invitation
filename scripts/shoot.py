import sys, asyncio, json
from playwright.async_api import async_playwright
# usage: shoot.py name WxH [action]
async def main():
    name, size = sys.argv[1], sys.argv[2]; w, h = map(int, size.split('x'))
    async with async_playwright() as p:
        b = await p.chromium.launch(args=['--autoplay-policy=no-user-gesture-required'])
        ctx = await b.new_context(viewport={'width': w, 'height': h}, device_scale_factor=2 if w < 800 else 1, has_touch=w < 800)
        pg = await ctx.new_page(); logs = []
        pg.on('console', lambda m: logs.append(f'{m.type}: {m.text}') if m.type in ('error', 'warning') else None)
        pg.on('pageerror', lambda e: logs.append('PAGEERROR ' + str(e)))
        await pg.goto('http://localhost:8765/index.html', wait_until='networkidle')
        await pg.wait_for_timeout(2200)
        await pg.screenshot(path=f'shots/{name}-env.png')
        print('\n'.join(logs))
        await b.close()
asyncio.run(main())

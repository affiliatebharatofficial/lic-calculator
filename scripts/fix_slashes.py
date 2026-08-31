import os, glob, re

files = glob.glob('src/**/*.astro', recursive=True) + glob.glob('src/**/*.ts', recursive=True)
count = 0

for f in files:
    if 'node_modules' in f:
        continue
    with open(f, 'r', encoding='utf-8') as fp:
        content = fp.read()
    original = content

    # 1. getLocalizedPath('/something', ...) -> getLocalizedPath('/something/', ...)
    def repl_loc(m):
        q1, p, q2, rest = m.group(1), m.group(2), m.group(3), m.group(4)
        if p.endswith('/') or '.' in p:
            return m.group(0)
        return f'getLocalizedPath({q1}/{p}/{q2}, {rest})'

    content = re.sub(r'getLocalizedPath\(([\'\"])/([a-zA-Z0-9_\-\/]+?)([\'\"])\s*,\s*([^)]+?)\)', repl_loc, content)

    # 2. href=\"/something\" -> href=\"/something/\"
    def repl_href(m):
        q1, p, q2 = m.group(1), m.group(2), m.group(3)
        if p.endswith('/') or '.' in p or p.startswith('//'):
            return m.group(0)
        return f'href={q1}/{p}/{q2}'

    content = re.sub(r'href=([\'\"])/([a-zA-Z0-9_\-]+?)([\'\"])', repl_href, content)

    # 3. url: '/something' -> url: '/something/'
    def repl_url(m):
        q1, p, q2 = m.group(1), m.group(2), m.group(3)
        if p.endswith('/') or '.' in p or p.startswith('//'):
            return m.group(0)
        return f'url: {q1}/{p}/{q2}'

    content = re.sub(r'url:\s*([\'\"])/([a-zA-Z0-9_\-]+?)([\'\"])', repl_url, content)

    # 4. Fix ?plan= queries to /?plan=
    content = content.replace('lic-premium-calculator?plan=', 'lic-premium-calculator/?plan=')

    if content != original:
        with open(f, 'w', encoding='utf-8') as fp:
            fp.write(content)
        print('Updated:', f)
        count += 1

print(f'Done! Updated {count} files.')

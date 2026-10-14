import base64,zlib,json,urllib.request,urllib.error,urllib.parse,pathlib,concurrent.futures,hashlib,time
encoded="eNq1mFFv2zYQx79KkKcNGOVKotv0MWizpwIbuvVpKAxaoiUmEqmRlB3v04+SlcCiqDsp616CmPc/mv5ROh7/f91++vLbt8+/frn/+rC7//rp/vPD7o+HP7/9Htlne/vL7a7kLOfadP9qngvNM9t9YE0TPfb/6MwJyJ5lT1FmrkYKVnNSsbNq7Thg1ZB6YEeRKRmZY+E+dXqzYday583r7NeDGdP5jrW5sMPa/KDZvIujE9834VgCxFIgRoHYFoi9B2IfgNgdEPs4H4vfATGASwxwiQEuMcAlBrjEAJcY4BIDXGKASwJwSQAuCcAlAbgkAJcE4JIAXBKASwJwSQAuKcAlBbikAJcU4JICXFKASwpwSQEuKcAlBbhQgAsFuFCACwW4UIALBbhQgAsFuFCACwW4bAEuW4DLFuCyDXIRMufPUWnrygsYe664GU6T68CRVSJnVihJcs0OlihZCcmj7OoQ2XNmiS3dmeQioe8oRVFyTZQmlTpx7R9Ck7Ax3JrNgWXdMtqcy+ixKZbJM8Wr5epHpo/CrNEbtWIxkj1yDsoXwGqyfUWMZI0plYWwBfawVK5T0K3bO67358vidlnXbVgzOupDQsdeirrfe7MxJyELUqvu02gR4UTXS6jNvhL2nz2rKlK6zkIVxaKs/vfWXLake67WpR1dP9UactLCWi6JkP1jaSzThtztFy3iURl+II1jraJGYupunQ58e7bqJAnjWrDL4se7Hs5VOa86yMyq+oxDbZh+cllMyF2j+VHw04IvGZJa3ZTn1WmNqtSapG4LKlUsAdcIm5VE8wPXXL6+5zf9sHvSbi5P2s1PB63qmz13Y/nPUd3QtdNe3vD/Y15XCX78tH3F+PHTanfVqPmCN75x1wr3DoWqLqifll1QHqq7SMKk8IL6QOUN6h0j17MseF4v9c9/XhfsxSSxR/WGvIHZmzI7eG9IvFDEEy1/tq3uoDwZXu3MkytRUtcLsIYyTcOzNal9Eqv2PAcLj+tiGFBk+7/Q4dkNAvmhk3yswF9C/AQ/cpkrvbGl5l27lXFpwBmv9VEtoKPbtYtFRbgsuvbuSibqmmVtxSwnhRa537xNwnDzBsonVQRUB4oIovdrCCiflhBfHthyXzLbvPnCwNbXvFb67PMeRgPfPUQCM/Wr6Nt3f7arSNjnmQoSTJBiAooJtpjgPSb4gAnuMMFHROCbQlMBRjLGSMYYyRgjGWMkY4xkjJGMMZIxRjLBSCYYyQQjmWAkE4xkgpFMMJIJRjLBSCYYyRQjmWIkU4xkipFMMZIpRjLFSKYYyRQjmWIkKUaSYiQpRpJiJClGkmIkKUaSYiQpRpJiJLcYyS1GcouR3CIkid/6XQkC5+hVNHCWGsts53O5rsnyzIpj0PG6GBGA4XItWGS0eAmIwRJSA8bKrHyVoTKeZZk14uXMWiJjHWKFBMXzFkhIPmt9eOKg5eFp/qvVgUy32uJA51tnbSDTrbU0kOkCtygvY9bCCOsml46wLHDbmBP614ywbnq/GOsC1sRYsMCSQBImVgSiD1gQaIZvPSAJU8thnLDEasAzJhbDTMqctTDI/XNlGPadgmF4/pjoyx55qTa4Yjp3H3+tV4Gl/s3IsHuh6edfqsAJ+BLptm6XKWlZZnem5NyGnuaL7GVlgY1FLY2AzrcyBsnUwhgxH/2W4WQbl/iT0lVOWl112d//BX6RDyk="
names=json.loads(zlib.decompress(base64.b64decode(encoded)))
root=pathlib.Path("site")
base="https://pcblarcade.audenmmusic.workers.dev/"
def fetch(name):
    url=base+urllib.parse.quote(name,safe="/")
    for n in range(3):
        try:
            req=urllib.request.Request(url,headers={"User-Agent":"PCBL-Arcade-GitHub-Import/1.0"})
            with urllib.request.urlopen(req,timeout=40) as response:
                data=response.read()
                if response.headers.get_content_type()=="text/html" and pathlib.Path(name).suffix.lower() not in (".html",".htm"):
                    raise ValueError("unexpected HTML response")
                return (name,data,None)
        except Exception as ex:
            if n<2:time.sleep(n+1)
            else:return (name,None,str(ex))
print("Recovering",len(names),"original Arcade files from existing Cloudflare Worker.")
with concurrent.futures.ThreadPoolExecutor(max_workers=10) as pool:
    results=list(pool.map(fetch,names))
# Cloudflare Workers intentionally do not expose platform-control files.
# Restore their exact contents from the owner-provided source archive.
special={
 "_headers":b"/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n\n/index.html\n  Cache-Control: public, max-age=120\n\n/world-url.js\n  Cache-Control: no-cache\n\n/app.js\n  Cache-Control: no-cache\n",
 "_redirects":b"/index  /index.html  301\n"
}
results=[(name,special[name],None) if name in special and error else (name,data,error) for name,data,error in results]
errors=[(name,error) for name,data,error in results if error]
for name,error in errors[:30]:print("MISSING",name,error)
if errors:raise SystemExit(f"Refusing partial import: {len(errors)} of {len(names)} files missing")
for name,data,_ in results:
    path=root/name
    path.parent.mkdir(parents=True,exist_ok=True)
    if name=="index.html":
        old=b'<div class="world-feature-chips"><span>LIVE WORLD</span><span>PICKUP</span><span>BLITZBALL</span><span>AFTER HOURS HORROR</span></div>'
        new=b'<div class="world-feature-chips"><span>LIVE OPEN WORLD (STUY TOWN)</span><span>CUSTOM CAREER MODE</span><span>PCBL VERSUS</span><span>PCBA PICKUP</span><span>HORROR GAMES</span><span>RACING GAMES</span><span>AVOID MURPHY AND THE HOMELESS</span><span>COLLECT ATTAX CARDS</span><span>PLAY WITH FRIENDS</span><span>AND MORE</span></div>'
        if old in data:data=data.replace(old,new)
        if new not in data:raise SystemExit("Live Arcade homepage differs: feature chips cannot be updated safely")
    path.write_bytes(data)
print("Recovered all",len(results),"files; total",sum(len(x[1]) for x in results),"bytes")

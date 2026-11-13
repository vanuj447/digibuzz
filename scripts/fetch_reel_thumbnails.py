"""Download public Open Graph covers for the owner-supplied reel URLs."""
import concurrent.futures, html, json, pathlib, re, urllib.request
from html.parser import HTMLParser
ROOT=pathlib.Path(__file__).resolve().parents[1]
class Metadata(HTMLParser):
    def __init__(self): super().__init__(); self.values={}
    def handle_starttag(self,tag,attrs):
        attrs=dict(attrs)
        if tag=='meta' and attrs.get('property','').startswith('og:'):
            self.values[attrs['property']]=attrs.get('content','')
def fetch(url):
    request=urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0'})
    with urllib.request.urlopen(request,timeout=35) as response:
        return response.read(),response.headers.get('Content-Type','')
def cover(code):
    try:
        url=f'https://www.instagram.com/reel/{code}/'
        data,_=fetch(url); metadata=Metadata(); metadata.feed(data.decode('utf-8'))
        image=metadata.values.get('og:image')
        if not image: return {'code':code,'error':'No public thumbnail returned'}
        data,kind=fetch(image)
        if not kind.startswith('image/'): return {'code':code,'error':'Thumbnail was not an image'}
        extension='.png' if 'png' in kind else '.jpg'
        filename=f'{code}{extension}'
        (ROOT/'public/images/reels'/filename).write_bytes(data)
        return {'code':code,'source':url,'thumbnail':f'/images/reels/{filename}','title':metadata.values.get('og:title',''),'bytes':len(data)}
    except Exception as error: return {'code':code,'error':str(error)}
if __name__=='__main__':
    source=(ROOT/'src/data/site.ts').read_text()
    codes=list(dict.fromkeys(re.findall(r'instagram.com/reel/([^/]+)/',source)))
    with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
        results=list(pool.map(cover,codes))
    (ROOT/'public/images/reels/sources.json').write_text(json.dumps(results,indent=2))
    for result in results: print(result['code'],result.get('bytes',result.get('error')))

import json,subprocess,sys
p=subprocess.Popen([sys.argv[1],"mcp"],stdin=subprocess.PIPE,stdout=subprocess.PIPE,stderr=subprocess.DEVNULL,text=True,bufsize=1)
i=0
def rpc(method,params=None,notify=False):
    global i
    msg={"jsonrpc":"2.0","method":method}
    if params is not None: msg["params"]=params
    if not notify: i+=1; msg["id"]=i
    p.stdin.write(json.dumps(msg)+"\n"); p.stdin.flush()
    if notify: return
    while True:
        m=json.loads(p.stdout.readline())
        if m.get("id")==i: return m
rpc("initialize",{"protocolVersion":"2025-06-18","capabilities":{},"clientInfo":{"name":"t","version":"1"}})
rpc("notifications/initialized",notify=True)
def tool(name,args):
    r=rpc("tools/call",{"name":name,"arguments":args})
    out=[]
    for c in r.get("result",{}).get("content",[]):
        if c.get("type")=="text": out.append(c["text"][:600])
        elif c.get("type")=="image":
            import base64; open(args.get("_png","/tmp/x.png"),"wb").write(base64.b64decode(c["data"])); out.append("[png kaydedildi]")
    if "error" in r: out.append("HATA "+json.dumps(r["error"])[:300])
    print(f"## {name} {json.dumps(args,ensure_ascii=False)[:150]}\n"+"\n".join(out)+"\n")
for line in open(sys.argv[2]):
    line=line.strip()
    if line: n,a=line.split(" ",1); tool(n,json.loads(a))
p.kill()

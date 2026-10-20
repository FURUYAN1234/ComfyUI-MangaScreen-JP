"""Deterministic release payload. Run from source at a tag."""
from pathlib import Path
import hashlib,json,sys,zipfile
ROOT=Path(__file__).resolve().parent
def build(output):
    version=(ROOT/"VERSION").read_text().strip();name="MangaScreen_JP_OriginalSize_"+version
    names=["LICENSE","NOTICE.md","README.md","VERSION","requirements.txt","install.py","verify_package.py","build.py"]
    for folder in ["custom_nodes","workflows","assets","docs"]:
        names += [p.relative_to(ROOT).as_posix() for p in (ROOT/folder).rglob("*") if p.is_file() and "__pycache__" not in p.parts and p.suffix!=".pyc"]
    names=sorted(names);data={n:(ROOT/n).read_bytes() for n in names}
    data["SHA256SUMS.json"]=(json.dumps({n:hashlib.sha256(v).hexdigest() for n,v in data.items()},ensure_ascii=False,indent=2)+"\n").encode()
    output=Path(output);output.mkdir(parents=True,exist_ok=True);target=output/(name+".zip")
    with zipfile.ZipFile(target,"w",compression=zipfile.ZIP_DEFLATED,compresslevel=9) as z:
        for n,v in sorted(data.items()):
            entry=zipfile.ZipInfo(name+"/"+n,(2026,10,20,0,0,0));entry.compress_type=zipfile.ZIP_DEFLATED;entry.external_attr=0o100644<<16;z.writestr(entry,v)
    print(target);return target
if __name__=="__main__":build(sys.argv[1] if len(sys.argv)>1 else ROOT.parent/"dist")

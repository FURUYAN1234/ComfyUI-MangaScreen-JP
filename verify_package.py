"""Verify the complete extracted payload, including unexpected files."""
from pathlib import Path
import hashlib,json,sys
def files(root):
    return {p.relative_to(root).as_posix():p for p in root.rglob("*") if p.is_file() and p.relative_to(root).as_posix()!="SHA256SUMS.json"}
def verify(root):
    root=Path(root);expected=json.loads((root/"SHA256SUMS.json").read_text(encoding="utf-8"))
    actual={name:hashlib.sha256(p.read_bytes()).hexdigest() for name,p in files(root).items()}
    if expected!=actual:
        raise ValueError({"missing":sorted(expected.keys()-actual.keys()),"extra":sorted(actual.keys()-expected.keys()),"changed":sorted(k for k in expected.keys()&actual.keys() if expected[k]!=actual[k])})
    print("Verified / 検証済み:",len(actual),"files")
    return actual
if __name__=="__main__":verify(sys.argv[1] if len(sys.argv)>1 else Path(__file__).parent)

"""Install into an existing ComfyUI. Models are separate. / 既存ComfyUIへ導入。"""
from pathlib import Path
import argparse, shutil, datetime, sys
sys.dont_write_bytecode=True
from verify_package import verify
WORKFLOW = "01_静止画/02_画像_Qwen/01_通常版/20_画像編集/40_MangaScreen/MangaScreen_フル版_元画像サイズ.json"
def install(root, source, sample=False):
    root=Path(root).resolve(); source=Path(source).resolve()
    if not (root/"main.py").is_file() or not (root/"custom_nodes").is_dir():
        raise ValueError("Not an existing ComfyUI root / ComfyUIルートを指定してください")
    if (source/"SHA256SUMS.json").exists(): verify(source)
    stamp=datetime.datetime.now().strftime("%Y%m%d%H%M%S")
    backup=root/"user/default/workflows/90_バックアップ/MangaScreen"/("install_"+stamp)
    mappings=[(source/"custom_nodes/ComfyUI-MangaScreen-JP",root/"custom_nodes/ComfyUI-MangaScreen-JP"),
              (source/"workflows/MangaScreen_フル版_元画像サイズ.json",root/"user/default/workflows"/WORKFLOW)]
    if sample: mappings.append((source/"assets/original.png",root/"input/MangaScreen_JP_sample.png"))
    for index,(src,dst) in enumerate(mappings):
        if dst.exists():
            saved=backup/str(index)/dst.name; saved.parent.mkdir(parents=True,exist_ok=True)
            if dst.is_dir(): shutil.copytree(dst,saved)
            else: shutil.copy2(dst,saved)
        dst.parent.mkdir(parents=True,exist_ok=True)
        if src.is_dir(): shutil.copytree(src,dst,dirs_exist_ok=True)
        else: shutil.copy2(src,dst)
    print("Installed / 導入先:",root)
    print("Restart ComfyUI / ComfyUIを再起動してください")
    return mappings
if __name__=="__main__":
    p=argparse.ArgumentParser();p.add_argument("--comfyui",required=True);p.add_argument("--sample",action="store_true")
    a=p.parse_args();install(a.comfyui,Path(__file__).parent,a.sample)

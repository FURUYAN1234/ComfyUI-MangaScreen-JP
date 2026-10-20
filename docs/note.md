# イラストを漫画原稿風に。MangaScreenを日本語化し、入力画像のサイズで出力できるようにしました

![MangaScreen 日本語ローカライズ版](https://raw.githubusercontent.com/FURUYAN1234/ComfyUI-MangaScreen-JP/20261020174738/assets/thumbnail.png)

カラーイラストを、線画・黒ベタ・スクリーントーンを使った漫画原稿風の画像に変換するComfyUIワークフローを公開しました。

今回は、ashukae氏の「ComfyUI-MangaScreen」を土台にした非公式の日本語ローカライズ・原寸出力対応版です。原作のフル構成を引き継ぎ、日本語の説明と操作パネルを追加しています。

主な追加点は、入力画像と同じ解像度・縦横比での出力、漫画化の指示文のリセット、8項目の説明付きスライダー・数値入力と一括リセットです。

## ダウンロード

GitHub：
https://github.com/FURUYAN1234/ComfyUI-MangaScreen-JP

配布ZIP・リリース：
https://github.com/FURUYAN1234/ComfyUI-MangaScreen-JP/releases/latest

モデルの重みは同梱していません。導入手順と各モデルの入手先はREADMEにもまとめています。

## ワークフローと変換結果

![ワークフロー全体](https://raw.githubusercontent.com/FURUYAN1234/ComfyUI-MangaScreen-JP/20261020174738/assets/workflow.jpg)

処理の流れは「入力画像 → Qwen-Image 2.1 Turboで漫画風に編集 → 入力画像の幅・高さへ復元 → 線画・トーンの仕上げ → PNG保存」です。

内部のAI処理は約2MPで行い、スクリーントーンを描く前に入力画像の寸法へ戻します。最後にトーンを引き伸ばす方式を避け、原寸で網点を作る構成です。

入力画像：
![入力画像・1536×1024](https://raw.githubusercontent.com/FURUYAN1234/ComfyUI-MangaScreen-JP/20261020174738/assets/original.png)

実際の変換結果：
![変換結果・1536×1024](https://raw.githubusercontent.com/FURUYAN1234/ComfyUI-MangaScreen-JP/20261020174738/assets/result.png)

この作例の入力は、公開用に今回新しくAI生成した画像です。変換結果は配布するワークフローの実出力です。サムネイルは紹介用に構成した画像なので、画質は上の実出力PNGで確認してください。

縦769×1153・横1153×769の奇数寸法と、作例の1536×1024で、入力と保存画像の幅・高さが一致することを実生成で確認しています。

## 必要な環境と導入

確認環境はComfyUI 0.37.0、フロントエンド1.53.6、RTX 5080 16GB、WSL Ubuntuです。これは確認した環境であり、最小VRAMの保証ではありません。

1. ZIPを展開し、同梱のverify_package.pyで内容を検証します。
2. ComfyUI用のPythonでinstall.pyを実行し、ComfyUIのルートを指定します。
3. comfyui_controlnet_auxを別途導入します。
4. Qwen-Image 2.1 Turbo、対応テキストエンコーダー、VAEをREADMEの案内に沿って配置します。
5. ComfyUIを再起動します。

コマンド例：
python verify_package.py .
python install.py --comfyui /absolute/path/to/ComfyUI --sample
python -m pip install -r requirements.txt

Windowsでは実際のComfyUIフォルダを指定してください。モデルはローダーの配布元リンクから別取得します。Manga Lineartの重みは初回に自動取得されるため、通信が必要です。

## 使い方と調整

ワークフロー一覧から「MangaScreen_フル版_元画像サイズ」を開き、①に画像を入れて実行します。出力寸法の手入力は不要です。

③の指示文は、構図や人物を保ちながら漫画化する初期文を入れています。追記・変更後は「指示文を初期値に戻す」で元に戻せます。

⑥の仕上げでは、8項目それぞれに日本語の説明、スライダー、数値入力を付けました。

- 白い部分を増やす：白にする境界を下げる
- 黒ベタを増やす：黒ベタにする境界を上げる
- トーンを薄くする：薄い／濃いトーンの濃さを下げる
- 網点を粗くする：網点の細かさを下げる
- グラデーションを減らす：グラデーションの量を下げる
- 細い線を残す：線画を残すしきい値を下げる
- 黒ベタ内の白線を増やす：白抜き線を上げる

8項目は一括で初期値へ戻せます。まず初期設定で実行し、気になる部分から少しずつ調整すると扱いやすいと思います。

## 保存先と確認すること

出力はComfyUI/output/MangaScreen/full_original_*.pngです。

原寸出力を維持するときは、⑦のframe=original、border=0、margin=0を保ってください。paper=white・ink=0では純粋な白黒になります。余白やコマの形を変更すると、出力寸法が変わることがあります。

AIによる描き直しを含むため、細部や構図が変化する場合があります。「元画像サイズで出る」ことと「元の絵の内容が完全一致する」ことは別です。また、画面表示の縮小率によって網点が見えにくい場合は、PNGを等倍で確認してください。

## 原作とライセンスについて

原作：
https://github.com/ashukae/ComfyUI-MangaScreen

原作者はashukae氏です。元のコードとワークフローはMITライセンスで公開されており、この派生版にも著作権表示とライセンス全文を保持しています。追加したコード・ワークフローもMITで公開します。原作者の公式日本語版ではありません。

ただし、Qwenモデルはコードとは別のライセンスです。Qwen Research Licenseでは研究・評価用途の条件があり、商用利用には別許諾が必要です。ワークフローのコードがMITであることだけで、使用モデルを含む全用途が自由になるわけではありません。入力画像や線画抽出の重みについても、各配布元の条件を確認してください。

Qwenモデルの利用条件：
https://huggingface.co/Qwen/Qwen-Image-2.1-Turbo/blob/main/LICENSE

配布物にはモデル重み、APIキー、個人の入力画像、原作の作例画像を含めていません。詳細はREADMEとNOTICEに記載しています。

## 関連リンク

README・ワークフロー・作例：
https://github.com/FURUYAN1234/ComfyUI-MangaScreen-JP

現在の配布版：
https://github.com/FURUYAN1234/ComfyUI-MangaScreen-JP/releases/latest

原作MangaScreen：
https://github.com/ashukae/ComfyUI-MangaScreen

## 更新履歴

2026-10-20：日本語ローカライズ・原寸出力対応版を公開。指示文と仕上げ設定のリセット、スライダー、枠幅0の修正を追加しました。

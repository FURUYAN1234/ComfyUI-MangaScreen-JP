# Attribution / 原作者・派生元
Based on [ashukae/ComfyUI-MangaScreen](https://github.com/ashukae/ComfyUI-MangaScreen) at commit d0eb8dcc6c45274e3eee118ff0dabe05b56039b9. Original code/workflow copyright (c) 2026 ashukae, MIT.
原作はashukae氏のComfyUI-MangaScreenです。元コード・ワークフローのMIT全文と著作権表示をLICENSEに保持しています。

Modifications by FURUYAN1234: Japanese control help, prompt reset, eight synchronized sliders/numeric controls and reset, exact source-size restore before screening, zero-border fix, unique JP node identifiers, documentation and packaging.
FURUYAN1234による変更：日本語説明、指示文リセット、8項目のスライダー・数値入力とリセット、網点処理前の原寸復元、枠幅0の修正、JP専用識別子、説明・配布整備。非公式の派生版で、原作者の公式日本語版ではありません。

Code and workflow modifications are also released under MIT. The license does not cover separately downloaded model weights or grant rights to third-party input images.
追加コード・ワークフローもMITで公開します。別取得のモデル重みや第三者の入力画像の権利は含みません。

## Separate model terms / モデルの別条件
- [Qwen-Image-2.1-Turbo license](https://huggingface.co/Qwen/Qwen-Image-2.1-Turbo/blob/main/LICENSE): Qwen Research License, dated 2026-09-20. Non-commercial use is defined as research/evaluation only; commercial use requires a separate license. / 研究・評価用途の条件があり、商用利用は別許諾が必要です。コードのMITと混同しないでください。
- [Comfy-Org Qwen distribution](https://huggingface.co/Comfy-Org/Qwen-Image-2.1): download weights separately and review the relevant model terms. / 重みは別取得し、配布元の条件も確認してください。
- [comfyui_controlnet_aux](https://github.com/Fannovel16/comfyui_controlnet_aux/blob/main/LICENSE.txt): Apache-2.0 code; installed separately. / 線画抽出の依存コードは別途導入します。
- Manga Lineart weights are downloaded by the auxiliary node from [lllyasviel/Annotators](https://huggingface.co/lllyasviel/Annotators); that repository labels its license as “other”. See also the [original line extraction implementation](https://github.com/ljsabc/MangaLineExtraction_PyTorch/blob/main/LICENSE). Do not assume the auxiliary code license automatically covers all weights. / 補助ノードのコードと重みの条件を分けて確認してください。

No model weights, external custom-node packages, API keys, private input files or upstream example artwork are included.
モデル重み、外部依存ノード本体、APIキー、個人の入力素材、原作の作例画像は同梱していません。

## Public example artwork / 公開作例
assets/original.png was newly generated using OpenAI image generation for this release, without requesting existing characters or brands. assets/result.png is the actual ComfyUI output. PNG text metadata is stripped from public images without changing pixels.
入力作例は今回新規にAI生成しました。変換結果は本ワークフローの実出力です。公開PNGは画素を変えずテキストメタデータを除去しています。第三者の肖像・作品・商標等に関する権利を包括的に保証する表記ではありません。

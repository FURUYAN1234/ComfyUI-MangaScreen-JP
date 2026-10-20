
import { app } from "/scripts/app.js";
const GUIDES = {"screen_lines": ["網点の細かさ", "小さいほど粗い網点、大きいほど細かい網点。濃さとは別の設定です。"], "white_point": ["白にする境界", "下げるほど肌や明るい部分が白くなります。黒の境界より大きく設定します。"], "black_point": ["黒ベタにする境界", "上げるほど暗い部分が黒ベタになります。白の境界より小さく設定します。"], "light_tone": ["薄いトーンの濃さ", "中間調の明るい側。上げるほど網点が占める面積が増えて濃くなります。"], "dark_tone": ["濃いトーンの濃さ", "中間調の暗い側。上げるほど網点が占める面積が増えて濃くなります。"], "gradation": ["グラデーションの量", "0はフラットな明暗、1はなめらかな影を網点の濃淡で表します。"], "pen_threshold": ["線画を残すしきい値", "下げると細かい線まで残し、上げると強い線だけ残します。線画入力に作用します。"], "white_lines": ["黒ベタ内の白抜き線", "上げるほど服の折り目や縫い目を白線で残します。0で白抜きを無効にします。"]};
const STYLE_ID = "mangascreen-japanese-controls";
function styles() {
  if (document.getElementById(STYLE_ID)) return;
  const css=document.createElement("style"); css.id=STYLE_ID;
  css.textContent = [
    ".mangascreen-controls { box-sizing:border-box;color:#f3f4f6;background:#20252c;padding:12px;font:14px/1.45 system-ui,sans-serif;overflow-y:auto;border-radius:6px; }",
    ".mangascreen-controls * { box-sizing:border-box; }",
    ".mangascreen-controls p { margin:0 0 10px; }",
    ".mangascreen-controls .manga-row { padding:7px 0;border-bottom:1px solid #47515d; }",
    ".mangascreen-controls .manga-label { font-weight:650;color:#e2efff;display:block; }",
    ".mangascreen-controls small { font-size:11px;color:#b8c3d0;margin-left:7px; }",
    ".mangascreen-controls .manga-description { font-size:12px;line-height:1.4;color:#d1d8e0;margin:3px 0 5px; }",
    ".mangascreen-controls .manga-inputs { display:flex;align-items:center;gap:10px; }",
    ".mangascreen-controls input[type=range] { flex:1;min-width:60px;height:22px;accent-color:#8ac6ff; }",
    ".mangascreen-controls input[type=number] { width:85px;min-width:85px;padding:4px 5px;color:white;background:#111820;border:1px solid #74859a;border-radius:4px;font-size:14px; }",
    ".mangascreen-controls button { width:100%;padding:9px 10px;margin-top:10px;border-radius:5px;color:white;background:#345b80;border:1px solid #8bb9df;cursor:pointer;font:600 14px system-ui; }",
    ".mangascreen-controls button:hover { background:#436f98; }",
    ".mangascreen-controls button:focus-visible,.mangascreen-controls input:focus-visible { outline:2px solid #b6e1ff; }",
    ".mangascreen-controls .manga-status { min-height:18px;color:#cbeacd;font-size:12px;margin-top:4px; }"
  ].join("\n");
  document.head.appendChild(css);
}
function element(tag,text,className) {
  const el=document.createElement(tag);
  if(text)el.textContent=text;if(className)el.className=className;
  return el;
}
function changed(node,changes) {
  const graph=node.graph||app.graph;graph?.beforeChange?.();
  for(const [originalWidget,value] of changes) {
    const widget=node.widgets?.find(w=>w.name===originalWidget.name)||originalWidget;
    const previous=widget.value;widget.value=value;
    const input=widget.element||widget.inputEl;
    if(input && "value" in input) {
      input.value=value;
      input.dispatchEvent(new Event("input",{bubbles:true}));
      input.dispatchEvent(new Event("change",{bubbles:true}));
    }
    widget.callback?.(value,app.canvas,node);
    node.onWidgetChanged?.(widget.name,value,previous,widget);
  }
  graph?.afterChange?.();graph?.setDirtyCanvas?.(true,true);node.setDirtyCanvas?.(true,true);
}
function panel(node,name,root,height) {
  const widget=node.addDOMWidget(name,"manga_japanese_controls",root,{
    serialize:false,hideOnZoom:false,getValue:()=>"",setValue:()=>{},
    getMinHeight:()=>height,getMaxHeight:()=>height
  });
  widget.computeSize=width=>[width,height];return widget;
}
function promptGuide(node,data) {
  const value=node.widgets?.find(w=>w.name==="value");
  if(!value||node._mangaControls)return;node._mangaControls=true;
  const original=data.input.required.value[1].default;value.label="漫画化の指示文";
  const input=value.element||value.inputEl;
  if(input){input.setAttribute("aria-label","③ 漫画化の指示文");input.title=data.input.required.value[1].tooltip;}
  const root=element("div",null,"mangascreen-controls");root.dataset.mangaPanel="prompt";
  root.append(element("p","指示文：Qwenに渡す、絵の漫画化の指示です。"));
  root.append(element("p","初期文は構図・人物・表情・画風を保ち、肌は白、暗部は黒ベタ、中間調はトーンにします。日本語で追記・変更できます。"));
  const reset=element("button","③ 指示文を初期値に戻す");reset.type="button";
  reset.setAttribute("aria-label","③ 指示文を初期値に戻す");
  const status=element("div","","manga-status");status.setAttribute("role","status");
  reset.addEventListener("click",()=>{changed(node,[[value,original]]);status.textContent="元の指示文に戻しました。";});
  root.append(reset,status);panel(node,"manga_prompt_help",root,185);
}
function finishControls(node,data) {
  if(node._mangaControls)return;node._mangaControls=true;
  const root=element("div",null,"mangascreen-controls");root.dataset.mangaPanel="finish";
  const fields=new Map();
  for(const [name,[label,description]] of Object.entries(GUIDES)) {
    const widget=node.widgets?.find(w=>w.name===name);if(!widget)continue;
    const spec=data.input.required[name][1];
    widget.type="converted-widget";widget.hidden=true;widget.computeSize=()=>[0,-4];
    const row=element("div",null,"manga-row");
    const title=element("label",label,"manga-label");title.append(element("small",name));
    const help=element("div",description,"manga-description");const inputs=element("div",null,"manga-inputs");
    const range=element("input");range.type="range";const number=element("input");number.type="number";
    for(const input of [range,number]) {
      input.min=String(spec.min);input.max=String(spec.max);input.step=String(spec.step);
      input.setAttribute("aria-label","⑥ "+label+(input===range?" スライダー":" 数値"));input.title=description;
    }
    const commit=(raw,editing=false)=>{
      if(!Number.isFinite(raw)){sync();return;}
      let value=Math.max(spec.min,Math.min(spec.max,raw));
      if(name==="white_point")value=Math.max(value,Number(fields.get("black_point").widget.value)+0.01);
      if(name==="black_point")value=Math.min(value,Number(fields.get("white_point").widget.value)-0.01);
      value=Number(value.toFixed(data.input.required[name][0]==="INT"?0:2));
      changed(node,[[widget,value]]);sync(editing?number:null);
    };
    range.addEventListener("input",()=>commit(range.valueAsNumber));
    range.addEventListener("keydown",event=>{
      const key=event.key;
      if(!["ArrowLeft","ArrowDown","ArrowRight","ArrowUp","Home","End"].includes(key))return;
      event.preventDefault();event.stopPropagation();
      const direction=["ArrowLeft","ArrowDown"].includes(key)?-1:1;
      commit(key==="Home"?spec.min:key==="End"?spec.max:range.valueAsNumber+direction*spec.step);
    });
    number.addEventListener("input",()=>{
      const raw=number.valueAsNumber;
      if(Number.isFinite(raw)&&raw>=spec.min&&raw<=spec.max)commit(raw,true);
    });
    number.addEventListener("change",()=>commit(number.valueAsNumber));
    number.addEventListener("keydown",event=>{if(event.key==="Enter"){number.blur();event.stopPropagation();}});
    inputs.append(range,number);row.append(title,help,inputs);root.append(row);
    fields.set(name,{widget,range,number,defaultValue:spec.default});
  }
  const status=element("div","","manga-status");status.setAttribute("role","status");
  const reset=element("button","⑥ 8項目すべてを初期値に戻す");reset.type="button";
  reset.setAttribute("aria-label","⑥ 8項目すべてを初期値に戻す");
  reset.addEventListener("click",()=>{
    changed(node,Array.from(fields.values(),f=>[f.widget,f.defaultValue]));sync();
    status.textContent="8項目を、このワークフローの初期値に戻しました。";
  });
  root.append(reset,status);
  function sync(editingNumber=null) {
    for(const [name,f] of fields) {
      f.widget=node.widgets?.find(w=>w.name===name)||f.widget;
      f.range.value=String(f.widget.value);if(f.number!==editingNumber)f.number.value=String(f.widget.value);
      const linked=node.inputs?.some(i=>i.name===name&&i.link!=null);
      f.range.disabled=f.number.disabled=!!linked;
    }
  }
  node._mangaSync=sync;sync();panel(node,"manga_finish_controls",root,790);
}
app.registerExtension({
  name:"MangaScreen.JP.JapaneseControls",setup:styles,
  beforeRegisterNodeDef(Node,data) {
    if(!["MangaScreenJPPrompt","MangaScreenJPFinish"].includes(data.name))return;
    const created=Node.prototype.onNodeCreated;
    Node.prototype.onNodeCreated=function(...args) {
      const result=created?.apply(this,args);styles();
      if(data.name==="MangaScreenJPPrompt")promptGuide(this,data);else finishControls(this,data);
      return result;
    };
    const configured=Node.prototype.onConfigure;
    Node.prototype.onConfigure=function(...args) {
      const result=configured?.apply(this,args);this._mangaSync?.();return result;
    };
    const connection=Node.prototype.onConnectionsChange;
    Node.prototype.onConnectionsChange=function(...args) {
      const result=connection?.apply(this,args);this._mangaSync?.();return result;
    };
  }
});

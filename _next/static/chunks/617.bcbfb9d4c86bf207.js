"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[617],{5617:function(e,i,t){let l;t.r(i),t.d(i,{default:function(){return r}});var n=t(3827),d=t(4090),a=t(333);function r(){let e=(0,d.useRef)(null),{data:i}=(0,a._)(),t=(null==i?void 0:i.selectedCoin)||"ETH";return(0,d.useEffect)(()=>(e.current=function(){document.getElementById("tradingview-widget")&&"TradingView"in window&&new window.TradingView.widget({autosize:!0,symbol:"".concat(t,"USD"),interval:"D",timezone:"Europe/Istanbul",theme:"dark",style:"1",locale:"tr",toolbar_bg:"#f1f3f6",enable_publishing:!1,hide_side_toolbar:!1,allow_symbol_change:!0,container_id:"tradingview-widget",hide_volume:!0,studies_overrides:{"volume.volume.display":!1,"volume.volume ma.display":!1,"RSI.display":!1},disabled_features:["volume_force_overlay","create_volume_indicator_by_default"],enabled_features:[]})},l||(l=new Promise(e=>{let i=document.createElement("script");i.id="tradingview-widget-loading-script",i.src="https://s3.tradingview.com/tv.js",i.type="text/javascript",i.onload=e,document.head.appendChild(i)})),l.then(()=>e.current&&e.current()),()=>{e.current=null}),[t]),(0,n.jsx)("div",{className:"w-full h-full min-h-[250px] sm:min-h-[350px] md:min-h-[450px] lg:min-h-[550px] xl:min-h-[650px]",children:(0,n.jsx)("div",{id:"tradingview-widget",className:"w-full h-full"})})}}}]);
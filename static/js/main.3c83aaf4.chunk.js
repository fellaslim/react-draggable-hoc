(this["webpackJsonpreact-draggable-hoc-demo"]=this["webpackJsonpreact-draggable-hoc-demo"]||[]).push([[0],{30:function(e,t,n){e.exports=n(46)},40:function(e,t,n){},45:function(e,t,n){},46:function(e,t,n){"use strict";n.r(t);n(31);var r=n(0),l=n(15),a=n(9),o=n(22),c=n(23),i=n(28),u=n(27),s=n(7),m=n(16),d=n.n(m),p=n(24),f=n(6),g=n(29),b=n(2),E=function(e){return new Promise((function(t){setTimeout((function(){t()}),e)}))},h=function(e){var t=e.className,n=void 0===t?"":t,l=e.style,a=e.handleRef,o=e.value,c=r.useRef(null);return r.createElement("span",{style:l,className:"Cell ".concat(n)},r.createElement("div",{className:"handle",ref:a},r.createElement("div",{className:"bar",style:{backgroundColor:l.color}}),r.createElement("div",{className:"bar",style:{backgroundColor:l.color}}),r.createElement("div",{className:"bar",style:{backgroundColor:l.color}})),r.createElement("span",{ref:c},o))},v=function(e,t){return Object(g.a)({},Object(b.defaultPostProcessor)(e,t),{deltaY:t&&t.current?t.current.clientHeight:0})},y=function(e){var t=e.backgroundColor,n=e.value,l=e.draggedProps,a=r.useState(),o=Object(f.a)(a,2),c=o[0],i=o[1];return r.createElement(b.Draggable,{delay:20,dragProps:t,postProcess:v,onDragStart:function(){document.body.style.cursor="ew-resize"},onDragEnd:function(){document.body.style.cursor="initial"}},(function(e){var a=e.handleRef,o=e.isDetached;return null!=a?r.createElement(b.Droppable,{onDrop:function(){var e=Object(p.a)(d.a.mark((function e(n){var r;return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r=n.dragProps,e.next=3,E(0);case 3:r!==t&&i(r);case 4:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),method:function(e,t){var n=t.current.getBoundingClientRect(),r=e.current.x;return n.left<=r&&n.right>=r},disabled:null==a,withDragProps:!1},(function(e){var i=e.isHovered,u=e.ref;return r.createElement("div",{style:{display:"inline-block",textAlign:"left",position:"relative"},ref:u},r.createElement(h,{value:l?l===t?i?"Not here":"I'm dragged":i?"Drop here":"Hover me":n,style:{backgroundColor:t,color:o?"#fff":c,width:"100px"},className:i&&l!==t?"hovered":void 0,handleRef:a}))})):r.createElement(h,{value:n,style:{backgroundColor:t,color:c,width:"100px"}})}))},D=Array(30).fill(0).map((function(){return function(){var e=function(){return Math.floor(255*Math.random())};return"rgb("+e()+","+e()+","+e()+")"}()})),N=function(){return r.createElement(b.DragDropContainer,{className:"Ghost-container"},(function(e){var t=e.ref;return r.createElement(b.WithDragProps,null,(function(e){var n=e.dragProps;return r.createElement("div",{className:"Ghost-container",ref:t},D.map((function(e,t){return r.createElement(y,{backgroundColor:e,value:"Drag me",key:t,draggedProps:n})})))}))}))},k=function(){return r.createElement("p",null,"Scrollable container, ",r.createElement("br",null),"draggable and droppable elements ",r.createElement("br",null),"with a ghost stuck to row bottom ",r.createElement("br",null),"custom hover implementation ",r.createElement("br",null),"drag handle ",r.createElement("br",null),"delay of 20ms (scroll is still preserved) ",r.createElement("br",null),"and fixed body ",r.createElement("br",null),"ew-resize cursor on drag")},w=function(){return r.useEffect((function(){return document.body.style.position="fixed",function(){document.body.style.position="initial"}})),r.createElement(r.Fragment,null,r.createElement(k,null),r.createElement(N,null))},C=n(13),S=Array(20).fill(void 0).map((function(e,t){return t+1})),P=function(){var e=r.useState([]),t=Object(f.a)(e,2),n=t[0],l=t[1],a=r.useMemo((function(){return S.filter((function(e){return n.indexOf(e)<0}))}),[n]);return r.createElement(b.DragDropContainer,{className:"Simple-page-container"},r.createElement("div",{className:"Simple-row scrollable"},a.map((function(e){return r.createElement(b.Draggable,{key:e,dragProps:e,className:"Simple-cell"},r.createElement("div",{className:"Cell-simple"},r.createElement("span",{className:"Handle"},"::"),r.createElement("span",null,e)))}))),a.length>0?r.createElement(b.Droppable,{onDrop:function(e){var t=e.dragProps;l([].concat(Object(C.a)(n),[t]))}},(function(e){var t=e.isHovered,l=e.ref,o=e.dragProps;return r.createElement("div",{className:"Simple-bin",ref:l,style:{backgroundColor:t?"rgba(0, 130, 20, 0.2)":void 0,border:o?"1px dashed #ccc":void 0}},o?"Drop it here":"Start dragging",a.length>0&&r.createElement("div",null,"Dropped values: [",n.join(", "),"]"))})):r.createElement("div",{className:"Simple-bin"},"Congratulations, You Win!"))},j=function(){return r.createElement(r.Fragment,null,r.createElement("p",null,"Simple `Draggable` and And a single `Droppable` bin",r.createElement("br",null)),r.createElement(P,null))},O=["Plum","CornflowerBlue"],x=Array(10*O.length).fill(void 0).map((function(e,t){return t+1})),B=x.length/O.length,A=function(e){var t=e.handleDrop,n=e.color,l=e.onFill,a=r.useRef(null),o=r.useState(0),c=Object(f.a)(o,2),i=c[0],u=c[1],s=r.useCallback((function(e){return null==e||e.color===n}),[n]),m=Object(b.useDroppable)(a,{onDrop:function(e){var n=e.dragProps;s(n)&&(u(i+1),t(n))}}).isHovered,d=Object(b.useDragProps)(),p=r.useMemo((function(){return s(d)}),[d,s]),g=r.useMemo((function(){return 100*i/B}),[i]),E=r.useMemo((function(){return m?100/B:0}),[m]);return r.useEffect((function(){g&&l()}),[g,l]),r.createElement("div",{className:"Simple-bin",ref:a,style:{visibility:p?void 0:"hidden",border:d?"1px dashed #ccc":"1px dashed transparent",position:"relative"}},r.createElement("div",{style:{position:"absolute",top:0,bottom:0,left:0,right:0,display:"flex"}},r.createElement("div",{style:{width:"".concat(g,"%"),background:n,transition:"all linear 40ms"}}),r.createElement("div",{style:{width:"".concat(E,"%"),background:"linear-gradient(to right, ".concat(n,", #eee)"),transition:"all linear 40ms"}})),r.createElement("div",{style:{position:"relative"}},r.createElement("span",{style:{color:n}},n)))},M=function(){var e=r.useState(x),t=Object(f.a)(e,2),n=t[0],l=t[1],a=r.useState(),o=Object(f.a)(a,2),c=o[0],i=o[1],u=function(e){l(n.filter((function(t){return t!==e.i})))};return r.createElement(b.DragDropContainer,{className:"Simple-page-container"},r.createElement("div",{className:"Simple-row scrollable"},n.map((function(e){return r.createElement(b.Draggable,{key:e,dragProps:{color:O[e%O.length],i:e},className:"Simple-cell"},r.createElement("div",{className:"Cell-simple",style:{backgroundColor:O[e%O.length]}},r.createElement("span",{style:{color:"#fff"}},e)))}))),n.length>0?r.createElement("div",{className:"Bins-container"},Object(C.a)(Array(O.length)).map((function(e,t){return r.createElement(A,{handleDrop:u,color:O[t%O.length],onFill:function(){null==c&&i(O[t%O.length])},key:t})}))):r.createElement("div",{className:"Simple-bin"},r.createElement("span",{style:{color:c}},"Congratulations!"),r.createElement("span",null,"You win!")))},H=function(){return r.createElement(r.Fragment,null,r.createElement("p",null,"Simple `Draggable` and multiple droppable bins defined by `useDroppable`",r.createElement("br",null)),r.createElement(M,null))},R=(n(40),function(e){Object(i.a)(n,e);var t=Object(u.a)(n);function n(){return Object(o.a)(this,n),t.apply(this,arguments)}return Object(c.a)(n,[{key:"render",value:function(){return r.createElement("div",{className:"App"},r.createElement("header",{className:"App-header"},r.createElement("h1",{className:"App-title"},"react-draggable-hoc demo"),r.createElement("menu",null,r.createElement(a.b,{to:"/demo/singleBin"},"Single bin"),r.createElement(a.b,{to:"/demo/multiBin"},"Multi bin"),r.createElement(a.b,{to:"/demo/ghost"},"Complex"))),r.createElement("section",null,r.createElement(s.d,null,r.createElement(s.b,{path:"/demo/singleBin",component:j}),r.createElement(s.b,{path:"/demo/multiBin",component:H}),r.createElement(s.b,{path:"/demo/ghost",component:w}),r.createElement(s.a,{to:"/demo/singleBin"}))))}}]),n}(r.Component));n(45),Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));l.render(r.createElement(a.a,null,r.createElement(R,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()}))}},[[30,1,2]]]);
//# sourceMappingURL=main.3c83aaf4.chunk.js.map
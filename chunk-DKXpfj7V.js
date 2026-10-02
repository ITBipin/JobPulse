import{A as Fu,Ar as wI,At as Tg,B as Ii,Bn as jp,Bt as Vp,Ct as RE,D as Fn$1,Dn as gD,Dr as vo,Dt as Rp,E as FE,Fn as j,H as JE,In as jc,It as Uc,J as Kl,K,L as Hc,Ln as je,Lt as Up,Mn as hg,Mr as wh,N as Gh,Nr as wr,O as Fp,On as gE,Ot as Sp,Pt as UE,Qn as nD,R as Hp,Rt as VD,S as EI,Tn as fE,Un as km,Vn as kE,Vr as zF,Wt as XE,X as LD,Xn as mr,Xt as YF,Yt as YE,Z as LE,_r as tD,_t as Pp,a as $o,an as _g,bn as dg,cn as ah,d as BD,en as ZF,er as oD,ft as Ov,g as Cg,hn as bu,hr as si,in as _e,ir as pv,kr as w,l as Ai,mt as PE,nn as _,on as ae,p as Ba,pn as bg,pr as se,qt as Xm,rn as _D,s as A,t as $D,tn as Zp,u as Ap,ur as qp,v as Cu,vn as ch,vr as th,vt as Pu,w as Et,wn as eh,xt as Qp,yr as uE,zn as jn,zt as Vc}from"./chunk-DQRNA6qL.js";import{$ as Xr,A as Ep,E as Ct,F as Kl$1,H as Qd,M as Jd,St as y0,U as Sa,V as Oi,W as Sy,X as Vs,Z as W,_ as j$1,_t as v0,at as ew,c as Q,ct as gn$1,d as Vn$1,dt as m_,f as Wt,ft as nw,g as de,h as bn$1,i as Dn$1,it as cn,j as GS,l as Qt,lt as ir,m as Zt,o as Mn$1,ot as fn$1,pt as pn$1,q as Tt,r as $e$1,rt as _y,s as Nn$1,st as fp,tt as Ym}from"./main-U77OG7C2.js";import{a as Sn,f as xn$1,i as Ki,l as jt,n as Ht,t as Hi}from"./chunk-BVNoYbGK.js";import{a as ne,i as mt,n as dt,o as pt,r as jn$1,t as Wn$1}from"./chunk-IIsdKlQN.js";import{n as Pe,t as Be}from"./chunk-IaZy2Lv9.js";import{t as v}from"./chunk-BpUgTBJl.js";import{n as _$1,t as I}from"./chunk-CGHQ-4j_.js";var Mn=new A(`MatTabContent`);var Nn=(()=>{class n{template=w(mr);static ɵfac=function(t){return new(t||n)};static ɵdir=gE({type:n,selectors:[[``,`matTabContent`,``]],features:[LD([{provide:Mn,useExisting:n}])]})}return n})();var En=new A(`MatTabLabel`);var pn=new A(`MAT_TAB`);var Pn=(()=>{class n extends ew{_closestTab=w(pn,{optional:!0});static ɵfac=(()=>{let e;return function(a){return(e||(e=Xm(n)))(a||n)}})();static ɵdir=gE({type:n,selectors:[[``,`mat-tab-label`,``],[``,`matTabLabel`,``]],features:[LD([{provide:En,useExisting:n}]),Sp]})}return n})();var hn=new A(`MAT_TAB_GROUP`);var Qe=(()=>{class n{_viewContainerRef=w(Ai);_closestTabGroup=w(hn,{optional:!0});disabled=!1;get templateLabel(){return this._templateLabel}set templateLabel(e){this._setTemplateLabelInput(e)}_templateLabel;_explicitContent=void 0;_implicitContent;textLabel=``;ariaLabel;ariaLabelledby;labelClass;bodyClass;id=null;_contentPortal=null;get content(){return this._contentPortal}_stateChanges=new K;position=null;origin=null;isActive=!1;constructor(){w(Ct).load(Kl$1)}ngOnChanges(e){(Object.hasOwn(e,`textLabel`)||Object.hasOwn(e,`disabled`))&&this._stateChanges.next()}ngOnDestroy(){this._stateChanges.complete()}ngOnInit(){this._contentPortal=new gn$1(this._explicitContent||this._implicitContent,this._viewContainerRef)}_setTemplateLabelInput(e){e&&e._closestTab===this&&(this._templateLabel=e)}static ɵfac=function(t){return new(t||n)};static ɵcmp=(function(){let e=[`*`];function t(a,o){a&1&&XE(0)}return uE({type:n,selectors:[[`mat-tab`]],contentQueries:function(o,c,u){if(o&1&&Qp(u,Pn,5)(u,Nn,7,mr),o&2){let k;tD(k=nD())&&(c.templateLabel=k.first),tD(k=nD())&&(c._explicitContent=k.first)}},viewQuery:function(o,c){if(o&1&&Zp(mr,7),o&2){let u;tD(u=nD())&&(c._implicitContent=u.first)}},hostAttrs:[`hidden`,``],hostVars:1,hostBindings:function(o,c){o&2&&Fp(`id`,null)},inputs:{disabled:[2,`disabled`,`disabled`,ZF],textLabel:[0,`label`,`textLabel`],ariaLabel:[0,`aria-label`,`ariaLabel`],ariaLabelledby:[0,`aria-labelledby`,`ariaLabelledby`],labelClass:`labelClass`,bodyClass:`bodyClass`,id:`id`},exportAs:[`matTab`],features:[LD([{provide:pn,useExisting:n}]),km],ngContentSelectors:e,decls:1,vars:0,template:function(o,c){o&1&&(JE(),Rp(0,t,1,0,`ng-template`))},encapsulation:2,changeDetection:1})})()}return n})();var qe=`mdc-tab-indicator--active`;var ln=`mdc-tab-indicator--no-transition`;var $e=class{_items;_currentItem;constructor(s){this._items=s}hide(){this._items.forEach(s=>s.deactivateInkBar()),this._currentItem=void 0}alignToElement(s){let e=this._items.find(a=>a.elementRef.nativeElement===s),t=this._currentItem;if(e!==t&&(t?.deactivateInkBar(),e)){let a=t?.elementRef.nativeElement.getBoundingClientRect?.();e.activateInkBar(a),this._currentItem=e}}};var Rn=(()=>{class n{_elementRef=w(wr);_inkBarElement=null;_inkBarContentElement=null;_fitToContent=!1;get fitInkBarToContent(){return this._fitToContent}set fitInkBarToContent(e){this._fitToContent!==e&&(this._fitToContent=e,this._inkBarElement&&this._appendInkBarElement())}activateInkBar(e){let t=this._elementRef.nativeElement;if(!e||!t.getBoundingClientRect||!this._inkBarContentElement){t.classList.add(qe);return}let a=t.getBoundingClientRect(),o=e.width/a.width,c=e.left-a.left;t.classList.add(ln),this._inkBarContentElement.style.setProperty(`transform`,`translateX(${c}px) scaleX(${o})`),t.getBoundingClientRect(),t.classList.remove(ln),t.classList.add(qe),this._inkBarContentElement.style.setProperty(`transform`,``)}deactivateInkBar(){this._elementRef.nativeElement.classList.remove(qe)}ngOnInit(){this._createInkBarElement()}ngOnDestroy(){this._inkBarElement?.remove(),this._inkBarElement=this._inkBarContentElement=null}_createInkBarElement(){let e=this._elementRef.nativeElement.ownerDocument||document,t=this._inkBarElement=e.createElement(`span`),a=this._inkBarContentElement=e.createElement(`span`);t.className=`mdc-tab-indicator`,a.className=`mdc-tab-indicator__content mdc-tab-indicator__content--underline`,t.appendChild(this._inkBarContentElement),this._appendInkBarElement()}_appendInkBarElement(){this._inkBarElement;(this._fitToContent?this._elementRef.nativeElement.querySelector(`.mdc-tab__content`):this._elementRef.nativeElement).appendChild(this._inkBarElement)}static ɵfac=function(t){return new(t||n)};static ɵdir=gE({type:n,inputs:{fitInkBarToContent:[2,`fitInkBarToContent`,`fitInkBarToContent`,ZF]}})}return n})();var un=(()=>{class n extends Rn{elementRef=w(wr);disabled=!1;focus(){this.elementRef.nativeElement.focus()}getOffsetLeft(){return this.elementRef.nativeElement.offsetLeft}getOffsetWidth(){return this.elementRef.nativeElement.offsetWidth}static ɵfac=(()=>{let e;return function(a){return(e||(e=Xm(n)))(a||n)}})();static ɵdir=gE({type:n,selectors:[[``,`matTabLabelWrapper`,``]],hostVars:3,hostBindings:function(t,a){t&2&&(Fp(`aria-disabled`,!!a.disabled),th(`mat-mdc-tab-disabled`,a.disabled))},inputs:{disabled:[2,`disabled`,`disabled`,ZF]},features:[Sp]})}return n})();var mn={passive:!0};var Dn=650;var An=100;function Ge(n){let s=n+``;return/^[0-9]+(?:\.[0-9]+)?$/.test(s)?`${n}ms`:/^[0-9]+(?:\.[0-9]+)?(?:ms|s)$/.test(s)?s:``}var Ln=(()=>{class n{_elementRef=w(wr);_changeDetectorRef=w(zF);_viewportRuler=w(fn$1);_dir=w(cn,{optional:!0});_ngZone=w(_e);_platform=w(W);_sharedResizeObserver=w(jt);_injector=w(se);_renderer=w(Ba);_animationsDisabled=pn$1();_eventCleanups;_scrollDistance=0;_selectedIndexChanged=!1;_destroyed=new K;_showPaginationControls=!1;_disableScrollAfter=!0;_disableScrollBefore=!0;_tabLabelCount;_scrollDistanceChanged=!1;_keyManager;_currentTextContent;_stopScrolling=new K;disablePagination=!1;get selectedIndex(){return this._selectedIndex}set selectedIndex(e){let t=isNaN(e)?0:e;this._selectedIndex!=t&&(this._selectedIndexChanged=!0,this._selectedIndex=t,this._keyManager&&this._keyManager.updateActiveItem(t))}_selectedIndex=0;selectFocusedIndex=new je;indexFocused=new je;constructor(){this._eventCleanups=this._ngZone.runOutsideAngular(()=>[this._renderer.listen(this._elementRef.nativeElement,`mouseleave`,()=>this._stopInterval())])}ngAfterViewInit(){this._eventCleanups.push(this._renderer.listen(this._previousPaginator.nativeElement,`touchstart`,()=>this._handlePaginatorPress(`before`),mn),this._renderer.listen(this._nextPaginator.nativeElement,`touchstart`,()=>this._handlePaginatorPress(`after`),mn))}ngAfterContentInit(){let e=this._dir?this._dir.change:Gh(`ltr`),t=this._sharedResizeObserver.observe(this._elementRef.nativeElement).pipe(hg(32),_g(this._destroyed)),a=this._viewportRuler.change(150).pipe(_g(this._destroyed)),o=()=>{this.updatePagination(),this._alignInkBarToSelectedTab()};this._keyManager=new Sa(this._items).withHorizontalOrientation(this._getLayoutDirection()).withHomeAndEnd().withWrap().skipPredicate(()=>!1),this._keyManager.updateActiveItem(Math.max(this._selectedIndex,0)),pv(o,{injector:this._injector}),dg(e,a,t,this._items.changes,this._itemsResized()).pipe(_g(this._destroyed)).subscribe(()=>{this._ngZone.run(()=>{Promise.resolve().then(()=>{this._scrollDistance=Math.max(0,Math.min(this._getMaxScrollDistance(),this._scrollDistance)),o()})}),this._keyManager?.withHorizontalOrientation(this._getLayoutDirection())}),this._keyManager.change.subscribe(c=>{this.indexFocused.emit(c),this._setTabFocus(c)})}_itemsResized(){return typeof ResizeObserver!=`function`?Et:this._items.changes.pipe(Cg(this._items),Tg(e=>new _(t=>this._ngZone.runOutsideAngular(()=>{let a=new ResizeObserver(o=>t.next(o));return e.forEach(o=>a.observe(o.elementRef.nativeElement)),()=>{a.disconnect()}}))),bg(1),jn(e=>e.some(t=>t.contentRect.width>0&&t.contentRect.height>0)))}ngAfterContentChecked(){this._tabLabelCount!=this._items.length&&(this.updatePagination(),this._tabLabelCount=this._items.length,this._changeDetectorRef.markForCheck()),this._selectedIndexChanged&&(this._scrollToLabel(this._selectedIndex),this._checkScrollingControls(),this._alignInkBarToSelectedTab(),this._selectedIndexChanged=!1,this._changeDetectorRef.markForCheck()),this._scrollDistanceChanged&&(this._updateTabScrollPosition(),this._scrollDistanceChanged=!1,this._changeDetectorRef.markForCheck())}ngOnDestroy(){this._eventCleanups.forEach(e=>e()),this._keyManager?.destroy(),this._destroyed.next(),this._destroyed.complete(),this._stopScrolling.complete()}_handleKeydown(e){if(!Oi(e))switch(e.keyCode){case 13:case 32:if(this.focusIndex!==this.selectedIndex){let t=this._items.get(this.focusIndex);t&&!t.disabled&&(this.selectFocusedIndex.emit(this.focusIndex),this._itemSelected(e))}break;default:this._keyManager?.onKeydown(e)}}_onContentChanges(){let e=this._elementRef.nativeElement.textContent;e!==this._currentTextContent&&(this._currentTextContent=e||``,this._ngZone.run(()=>{this.updatePagination(),this._alignInkBarToSelectedTab(),this._changeDetectorRef.markForCheck()}))}updatePagination(){this._checkPaginationEnabled(),this._checkScrollingControls(),this._updateTabScrollPosition()}get focusIndex(){return this._keyManager?this._keyManager.activeItemIndex:0}set focusIndex(e){!this._isValidIndex(e)||this.focusIndex===e||!this._keyManager||this._keyManager.setActiveItem(e)}_isValidIndex(e){return this._items?!!this._items.toArray()[e]:!0}_setTabFocus(e){if(this._showPaginationControls&&this._scrollToLabel(e),this._items&&this._items.length){this._items.toArray()[e].focus();let t=this._tabListContainer.nativeElement;this._getLayoutDirection()==`ltr`?t.scrollLeft=0:t.scrollLeft=t.scrollWidth-t.offsetWidth}}_getLayoutDirection(){return this._dir&&this._dir.value===`rtl`?`rtl`:`ltr`}_updateTabScrollPosition(){if(this.disablePagination)return;let e=this.scrollDistance,t=this._getLayoutDirection()===`ltr`?-e:e;this._tabList.nativeElement.style.transform=`translateX(${Math.round(t)}px)`,(this._platform.TRIDENT||this._platform.EDGE)&&(this._tabListContainer.nativeElement.scrollLeft=0)}get scrollDistance(){return this._scrollDistance}set scrollDistance(e){this._scrollTo(e)}_scrollHeader(e){let t=this._tabListContainer.nativeElement.offsetWidth,a=(e==`before`?-1:1)*t/3;return this._scrollTo(this._scrollDistance+a)}_handlePaginatorClick(e){this._stopInterval(),this._scrollHeader(e)}_scrollToLabel(e){if(this.disablePagination)return;let t=this._items?this._items.toArray()[e]:null;if(!t)return;let a=this._tabListContainer.nativeElement.offsetWidth,{offsetLeft:o,offsetWidth:c}=t.elementRef.nativeElement,u,k;this._getLayoutDirection()==`ltr`?(u=o,k=u+c):(k=this._tabListInner.nativeElement.offsetWidth-o,u=k-c);let M=this.scrollDistance,h=this.scrollDistance+a;u<M?this.scrollDistance-=M-u:k>h&&(this.scrollDistance+=Math.min(k-h,u-M))}_checkPaginationEnabled(){if(this.disablePagination)this._showPaginationControls=!1;else{let a=this._tabListInner.nativeElement.scrollWidth-this._elementRef.nativeElement.offsetWidth>=5;a||(this.scrollDistance=0),a!==this._showPaginationControls&&(this._showPaginationControls=a,this._changeDetectorRef.markForCheck())}}_checkScrollingControls(){this.disablePagination?this._disableScrollAfter=this._disableScrollBefore=!0:(this._disableScrollBefore=this.scrollDistance==0,this._disableScrollAfter=this.scrollDistance==this._getMaxScrollDistance(),this._changeDetectorRef.markForCheck())}_getMaxScrollDistance(){return this._tabListInner.nativeElement.scrollWidth-this._tabListContainer.nativeElement.offsetWidth||0}_alignInkBarToSelectedTab(){let e=this._items&&this._items.length?this._items.toArray()[this.selectedIndex]:null,t=e?e.elementRef.nativeElement:null;t?this._inkBar.alignToElement(t):this._inkBar.hide()}_stopInterval(){this._stopScrolling.next()}_handlePaginatorPress(e,t){t&&t.button!=null&&t.button!==0||(this._stopInterval(),Fn$1(Dn,An).pipe(_g(dg(this._stopScrolling,this._destroyed))).subscribe(()=>{let{maxScrollDistance:a,distance:o}=this._scrollHeader(e);(o===0||o>=a)&&this._stopInterval()}))}_scrollTo(e){if(this.disablePagination)return{maxScrollDistance:0,distance:0};let t=this._getMaxScrollDistance();return this._scrollDistance=Math.max(0,Math.min(t,e)),this._scrollDistanceChanged=!0,this._checkScrollingControls(),{maxScrollDistance:t,distance:this._scrollDistance}}static ɵfac=function(t){return new(t||n)};static ɵdir=gE({type:n,inputs:{disablePagination:[2,`disablePagination`,`disablePagination`,ZF],selectedIndex:[2,`selectedIndex`,`selectedIndex`,YF]},outputs:{selectFocusedIndex:`selectFocusedIndex`,indexFocused:`indexFocused`}})}return n})();var Bn=(()=>{class n extends Ln{_items;_tabListContainer;_tabList;_tabListInner;_nextPaginator;_previousPaginator;_inkBar;ariaLabel;ariaLabelledby;disableRipple=!1;ngAfterContentInit(){this._inkBar=new $e(this._items),super.ngAfterContentInit()}_itemSelected(e){e.preventDefault()}static ɵfac=(()=>{let e;return function(a){return(e||(e=Xm(n)))(a||n)}})();static ɵcmp=(function(){let e=[`tabListContainer`],t=[`tabList`],a=[`tabListInner`],o=[`nextPaginator`],c=[`previousPaginator`];return uE({type:n,selectors:[[`mat-tab-header`]],contentQueries:function(M,h,p){if(M&1&&Qp(p,un,4),M&2){let _;tD(_=nD())&&(h._items=_)}},viewQuery:function(M,h){if(M&1&&Zp(e,7)(t,7)(a,7)(o,5)(c,5),M&2){let p;tD(p=nD())&&(h._tabListContainer=p.first),tD(p=nD())&&(h._tabList=p.first),tD(p=nD())&&(h._tabListInner=p.first),tD(p=nD())&&(h._nextPaginator=p.first),tD(p=nD())&&(h._previousPaginator=p.first)}},hostAttrs:[1,`mat-mdc-tab-header`],hostVars:4,hostBindings:function(M,h){M&2&&th(`mat-mdc-tab-header-pagination-controls-enabled`,h._showPaginationControls)(`mat-mdc-tab-header-rtl`,h._getLayoutDirection()==`rtl`)},inputs:{ariaLabel:[0,`aria-label`,`ariaLabel`],ariaLabelledby:[0,`aria-labelledby`,`ariaLabelledby`],disableRipple:[2,`disableRipple`,`disableRipple`,ZF]},features:[Sp],ngContentSelectors:[`*`],decls:13,vars:10,consts:[[`previousPaginator`,``],[`tabListContainer`,``],[`tabList`,``],[`tabListInner`,``],[`nextPaginator`,``],[`mat-ripple`,``,1,`mat-mdc-tab-header-pagination`,`mat-mdc-tab-header-pagination-before`,3,`click`,`mousedown`,`touchend`,`matRippleDisabled`],[1,`mat-mdc-tab-header-pagination-chevron`],[1,`mat-mdc-tab-label-container`,3,`keydown`],[`role`,`tablist`,1,`mat-mdc-tab-list`,3,`cdkObserveContent`],[1,`mat-mdc-tab-labels`],[`mat-ripple`,``,1,`mat-mdc-tab-header-pagination`,`mat-mdc-tab-header-pagination-after`,3,`mousedown`,`click`,`touchend`,`matRippleDisabled`]],template:function(M,h){M&1&&(JE(),Ii(0,`div`,5,0),qp(`click`,function(){return h._handlePaginatorClick(`before`)})(`mousedown`,function(_){return h._handlePaginatorPress(`before`,_)})(`touchend`,function(){return h._stopInterval()}),Vp(2,`div`,6),jc(),Ii(3,`div`,7,1),qp(`keydown`,function(_){return h._handleKeydown(_)}),Ii(5,`div`,8,2),qp(`cdkObserveContent`,function(){return h._onContentChanges()}),Ii(7,`div`,9,3),XE(9),jc()()(),Ii(10,`div`,10,4),qp(`mousedown`,function(_){return h._handlePaginatorPress(`after`,_)})(`click`,function(){return h._handlePaginatorClick(`after`)})(`touchend`,function(){return h._stopInterval()}),Vp(12,`div`,6),jc()),M&2&&(th(`mat-mdc-tab-header-pagination-disabled`,h._disableScrollBefore),jp(`matRippleDisabled`,h._disableScrollBefore||h.disableRipple),Ov(3),th(`_mat-animation-noopable`,h._animationsDisabled),Ov(2),Fp(`aria-label`,h.ariaLabel||null)(`aria-labelledby`,h.ariaLabelledby||null),Ov(5),th(`mat-mdc-tab-header-pagination-disabled`,h._disableScrollAfter),jp(`matRippleDisabled`,h._disableScrollAfter||h.disableRipple))},dependencies:[GS,m_],styles:[`.mat-mdc-tab-header {
  display: flex;
  overflow: hidden;
  position: relative;
  flex-shrink: 0;
}

.mdc-tab-indicator .mdc-tab-indicator__content {
  transition-duration: var(--%NS%mat-tab-header-animation-duration, 250ms);
}

.mat-mdc-tab-header-pagination {
  -webkit-user-select: none;
  user-select: none;
  position: relative;
  display: none;
  justify-content: center;
  align-items: center;
  min-width: 32px;
  cursor: pointer;
  z-index: 2;
  -webkit-tap-highlight-color: transparent;
  touch-action: none;
  box-sizing: content-box;
  outline: 0;
}
.mat-mdc-tab-header-pagination::-moz-focus-inner {
  border: 0;
}
.mat-mdc-tab-header-pagination .mat-ripple-element {
  opacity: 0.12;
  background-color: var(--%NS%mat-tab-inactive-ripple-color, var(--%NS%mat-sys-on-surface));
}
.mat-mdc-tab-header-pagination-controls-enabled .mat-mdc-tab-header-pagination {
  display: flex;
}

.mat-mdc-tab-header-pagination-before,
.mat-mdc-tab-header-rtl .mat-mdc-tab-header-pagination-after {
  padding-left: 4px;
}
.mat-mdc-tab-header-pagination-before .mat-mdc-tab-header-pagination-chevron,
.mat-mdc-tab-header-rtl .mat-mdc-tab-header-pagination-after .mat-mdc-tab-header-pagination-chevron {
  transform: rotate(-135deg);
}

.mat-mdc-tab-header-rtl .mat-mdc-tab-header-pagination-before,
.mat-mdc-tab-header-pagination-after {
  padding-right: 4px;
}
.mat-mdc-tab-header-rtl .mat-mdc-tab-header-pagination-before .mat-mdc-tab-header-pagination-chevron,
.mat-mdc-tab-header-pagination-after .mat-mdc-tab-header-pagination-chevron {
  transform: rotate(45deg);
}

.mat-mdc-tab-header-pagination-chevron {
  border-style: solid;
  border-width: 2px 2px 0 0;
  height: 8px;
  width: 8px;
  border-color: var(--%NS%mat-tab-pagination-icon-color, var(--%NS%mat-sys-on-surface));
}

.mat-mdc-tab-header-pagination-disabled {
  box-shadow: none;
  cursor: default;
  pointer-events: none;
}
.mat-mdc-tab-header-pagination-disabled .mat-mdc-tab-header-pagination-chevron {
  opacity: 0.4;
}

.mat-mdc-tab-list {
  flex-grow: 1;
  position: relative;
  transition: transform 500ms cubic-bezier(0.35, 0, 0.25, 1);
}
._mat-animation-noopable .mat-mdc-tab-list {
  transition: none;
}

.mat-mdc-tab-label-container {
  display: flex;
  flex-grow: 1;
  overflow: hidden;
  z-index: 1;
  border-bottom-style: solid;
  border-bottom-width: var(--%NS%mat-tab-divider-height, 1px);
  border-bottom-color: var(--%NS%mat-tab-divider-color, var(--%NS%mat-sys-surface-variant));
}
.mat-mdc-tab-group-inverted-header .mat-mdc-tab-label-container {
  border-bottom: none;
  border-top-style: solid;
  border-top-width: var(--%NS%mat-tab-divider-height, 1px);
  border-top-color: var(--%NS%mat-tab-divider-color, var(--%NS%mat-sys-surface-variant));
}

.mat-mdc-tab-labels {
  display: flex;
  flex: 1 0 auto;
}
[mat-align-tabs=center] > .mat-mdc-tab-header .mat-mdc-tab-labels {
  justify-content: center;
}
[mat-align-tabs=end] > .mat-mdc-tab-header .mat-mdc-tab-labels {
  justify-content: flex-end;
}
.cdk-drop-list .mat-mdc-tab-labels, .mat-mdc-tab-labels.cdk-drop-list {
  min-height: var(--%NS%mat-tab-container-height, 48px);
}

.mat-mdc-tab::before {
  margin: 5px;
}
@media (forced-colors: active) {
  .mat-mdc-tab[aria-disabled=true] {
    color: GrayText;
  }
}
`],encapsulation:2,changeDetection:1})})()}return n})();var zn=new A(`MAT_TABS_CONFIG`);var bn=(()=>{class n extends nw{_host=w(We);_ngZone=w(_e);_centeringSub=j.EMPTY;_leavingSub=j.EMPTY;ngOnInit(){super.ngOnInit(),this._centeringSub=this._host._beforeCentering.pipe(Cg(this._host._isCenterPosition())).subscribe(e=>{this._host._content&&e&&!this.hasAttached()&&this._ngZone.run(()=>{Promise.resolve().then(),this.attach(this._host._content)})}),this._leavingSub=this._host._afterLeavingCenter.subscribe(()=>{this._host.preserveContent||this._ngZone.run(()=>this.detach())})}ngOnDestroy(){super.ngOnDestroy(),this._centeringSub.unsubscribe(),this._leavingSub.unsubscribe()}static ɵfac=(()=>{let e;return function(a){return(e||(e=Xm(n)))(a||n)}})();static ɵdir=gE({type:n,selectors:[[``,`matTabBodyHost`,``]],features:[Sp]})}return n})();var We=(()=>{class n{_elementRef=w(wr);_dir=w(cn,{optional:!0});_ngZone=w(_e);_injector=w(se);_renderer=w(Ba);_diAnimationsDisabled=pn$1();_eventCleanups;_initialized=!1;_fallbackTimer;_positionIndex;_dirChangeSubscription=j.EMPTY;_position;_previousPosition;_onCentering=new je;_beforeCentering=new je;_afterLeavingCenter=new je;_onCentered=new je(!0);_portalHost;_contentElement;_content;animationDuration=`500ms`;preserveContent=!1;set position(e){this._positionIndex=e,this._computePositionAnimationState()}constructor(){if(this._dir){let e=w(zF);this._dirChangeSubscription=this._dir.change.subscribe(t=>{this._computePositionAnimationState(t),e.markForCheck()})}}ngOnInit(){this._bindTransitionEvents(),this._position===`center`&&(this._setActiveClass(!0),pv(()=>this._onCentering.emit(this._elementRef.nativeElement.clientHeight),{injector:this._injector})),this._initialized=!0}ngOnDestroy(){clearTimeout(this._fallbackTimer),this._eventCleanups?.forEach(e=>e()),this._dirChangeSubscription.unsubscribe()}_bindTransitionEvents(){this._ngZone.runOutsideAngular(()=>{let e=this._elementRef.nativeElement,t=a=>{a.target===this._contentElement?.nativeElement&&(this._elementRef.nativeElement.classList.remove(`mat-tab-body-animating`),a.type===`transitionend`&&this._transitionDone())};this._eventCleanups=[this._renderer.listen(e,`transitionstart`,a=>{a.target===this._contentElement?.nativeElement&&(this._elementRef.nativeElement.classList.add(`mat-tab-body-animating`),this._transitionStarted())}),this._renderer.listen(e,`transitionend`,t),this._renderer.listen(e,`transitioncancel`,t)]})}_transitionStarted(){clearTimeout(this._fallbackTimer);let e=this._position===`center`;this._beforeCentering.emit(e),e&&this._onCentering.emit(this._elementRef.nativeElement.clientHeight)}_transitionDone(){this._position===`center`?this._onCentered.emit():this._previousPosition===`center`&&this._afterLeavingCenter.emit()}_setActiveClass(e){this._elementRef.nativeElement.classList.toggle(`mat-mdc-tab-body-active`,e)}_getLayoutDirection(){return this._dir&&this._dir.value===`rtl`?`rtl`:`ltr`}_isCenterPosition(){return this._positionIndex===0}_computePositionAnimationState(e=this._getLayoutDirection()){this._previousPosition=this._position,this._positionIndex<0?this._position=e==`ltr`?`left`:`right`:this._positionIndex>0?this._position=e==`ltr`?`right`:`left`:this._position=`center`,this._animationsDisabled()?this._simulateTransitionEvents():this._initialized&&(this._position===`center`||this._previousPosition===`center`)&&(clearTimeout(this._fallbackTimer),this._fallbackTimer=this._ngZone.runOutsideAngular(()=>setTimeout(()=>this._simulateTransitionEvents(),100)))}_simulateTransitionEvents(){this._transitionStarted(),pv(()=>this._transitionDone(),{injector:this._injector})}_animationsDisabled(){return this._diAnimationsDisabled||this.animationDuration===`0ms`||this.animationDuration===`0s`}static ɵfac=function(t){return new(t||n)};static ɵcmp=(function(){let e=[`content`];function t(a,o){}return uE({type:n,selectors:[[`mat-tab-body`]],viewQuery:function(o,c){if(o&1&&Zp(bn,5)(e,5),o&2){let u;tD(u=nD())&&(c._portalHost=u.first),tD(u=nD())&&(c._contentElement=u.first)}},hostAttrs:[1,`mat-mdc-tab-body`],hostVars:1,hostBindings:function(o,c){o&2&&Fp(`inert`,c._position===`center`?null:``)},inputs:{_content:[0,`content`,`_content`],animationDuration:`animationDuration`,preserveContent:`preserveContent`,position:`position`},outputs:{_onCentering:`_onCentering`,_beforeCentering:`_beforeCentering`,_onCentered:`_onCentered`},decls:3,vars:6,consts:[[`content`,``],[`cdkScrollable`,``,1,`mat-mdc-tab-body-content`],[`matTabBodyHost`,``]],template:function(o,c){o&1&&(Ii(0,`div`,1,0),Ap(2,t,0,0,`ng-template`,2),jc()),o&2&&th(`mat-tab-body-content-left`,c._position===`left`)(`mat-tab-body-content-right`,c._position===`right`)(`mat-tab-body-content-can-animate`,c._position===`center`||c._previousPosition===`center`)},dependencies:[bn,Ep],styles:[`.mat-mdc-tab-body {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  display: block;
  overflow: hidden;
  outline: 0;
  flex-basis: 100%;
}
.mat-mdc-tab-body.mat-mdc-tab-body-active {
  position: relative;
  overflow-x: hidden;
  overflow-y: auto;
  z-index: 1;
  flex-grow: 1;
}
.mat-mdc-tab-group.mat-mdc-tab-group-dynamic-height .mat-mdc-tab-body.mat-mdc-tab-body-active {
  overflow-y: hidden;
}

.mat-mdc-tab-body-content {
  height: 100%;
  overflow: auto;
  transform: none;
  visibility: hidden;
}
.mat-tab-body-animating > .mat-mdc-tab-body-content, .mat-mdc-tab-body-active > .mat-mdc-tab-body-content {
  visibility: visible;
}
.mat-tab-body-animating > .mat-mdc-tab-body-content {
  min-height: 1px;
}
.mat-mdc-tab-group-dynamic-height .mat-mdc-tab-body-content {
  overflow: hidden;
}

.mat-tab-body-content-can-animate {
  transition: transform var(--%NS%mat-tab-body-animation-duration) 1ms cubic-bezier(0.35, 0, 0.25, 1);
}
.mat-mdc-tab-body-wrapper._mat-animation-noopable .mat-tab-body-content-can-animate {
  transition: none;
}

.mat-tab-body-content-left {
  transform: translate3d(-100%, 0, 0);
}

.mat-tab-body-content-right {
  transform: translate3d(100%, 0, 0);
}
`],encapsulation:2,changeDetection:1})})()}return n})();var _n=(()=>{class n{_elementRef=w(wr);_changeDetectorRef=w(zF);_ngZone=w(_e);_tabsSubscription=j.EMPTY;_tabLabelSubscription=j.EMPTY;_tabBodySubscription=j.EMPTY;_diAnimationsDisabled=pn$1();_bodyAnimationDuration;_headerAnimationDuration;_allTabs;_tabBodies;_tabBodyWrapper;_tabHeader;_tabs=new si;_indexToSelect=0;_lastFocusedTabIndex=null;_tabBodyWrapperHeight=0;color;get fitInkBarToContent(){return this._fitInkBarToContent}set fitInkBarToContent(e){this._fitInkBarToContent=e,this._changeDetectorRef.markForCheck()}_fitInkBarToContent=!1;stretchTabs=!0;alignTabs=null;dynamicHeight=!1;get selectedIndex(){return this._selectedIndex}set selectedIndex(e){this._indexToSelect=isNaN(e)?null:e}_selectedIndex=null;headerPosition=`above`;get animationDuration(){return this._animationDuration}set animationDuration(e){this._animationDuration=e,e&&typeof e==`object`?(this._bodyAnimationDuration=Ge(e.body),this._headerAnimationDuration=Ge(e.header)):this._headerAnimationDuration=this._bodyAnimationDuration=Ge(e)}_animationDuration;get contentTabIndex(){return this._contentTabIndex}set contentTabIndex(e){this._contentTabIndex=isNaN(e)?null:e}_contentTabIndex=null;disablePagination=!1;disableRipple=!1;preserveContent=!1;get backgroundColor(){return this._backgroundColor}set backgroundColor(e){let t=this._elementRef.nativeElement.classList;t.remove(`mat-tabs-with-background`,`mat-background-${this.backgroundColor}`),e&&t.add(`mat-tabs-with-background`,`mat-background-${e}`),this._backgroundColor=e}_backgroundColor;ariaLabel;ariaLabelledby;selectedIndexChange=new je;focusChange=new je;animationDone=new je;selectedTabChange=new je(!0);_groupId;_isServer=!w(W).isBrowser;constructor(){let e=w(zn,{optional:!0});this._groupId=w(ir).getId(`mat-tab-group-`),this.animationDuration=e&&e.animationDuration?e.animationDuration:`500ms`,this.disablePagination=e&&e.disablePagination!=null?e.disablePagination:!1,this.dynamicHeight=e&&e.dynamicHeight!=null?e.dynamicHeight:!1,e?.contentTabIndex!=null&&(this.contentTabIndex=e.contentTabIndex),this.preserveContent=!!e?.preserveContent,this.fitInkBarToContent=e&&e.fitInkBarToContent!=null?e.fitInkBarToContent:!1,this.stretchTabs=e&&e.stretchTabs!=null?e.stretchTabs:!0,this.alignTabs=e&&e.alignTabs!=null?e.alignTabs:null}ngAfterContentChecked(){let e=this._indexToSelect=this._clampTabIndex(this._indexToSelect);if(this._selectedIndex!=e){let t=this._selectedIndex==null;if(!t){this.selectedTabChange.emit(this._createChangeEvent(e));let a=this._tabBodyWrapper.nativeElement;a.style.minHeight=a.clientHeight+`px`}Promise.resolve().then(()=>{this._tabs.forEach((a,o)=>a.isActive=o===e),t||(this.selectedIndexChange.emit(e),this._tabBodyWrapper.nativeElement.style.minHeight=``)})}this._tabs.forEach((t,a)=>{t.position=a-e,this._selectedIndex!=null&&t.position==0&&!t.origin&&(t.origin=e-this._selectedIndex)}),this._selectedIndex!==e&&(this._selectedIndex=e,this._lastFocusedTabIndex=null,this._changeDetectorRef.markForCheck())}ngAfterContentInit(){this._subscribeToAllTabChanges(),this._subscribeToTabLabels(),this._tabsSubscription=this._tabs.changes.subscribe(()=>{let e=this._clampTabIndex(this._indexToSelect);if(e===this._selectedIndex){let t=this._tabs.toArray(),a;for(let o=0;o<t.length;o++)if(t[o].isActive){this._indexToSelect=this._selectedIndex=o,this._lastFocusedTabIndex=null,a=t[o];break}!a&&t[e]&&Promise.resolve().then(()=>{t[e].isActive=!0,this.selectedTabChange.emit(this._createChangeEvent(e))})}this._changeDetectorRef.markForCheck()})}ngAfterViewInit(){this._tabBodySubscription=this._tabBodies.changes.subscribe(()=>this._bodyCentered(!0))}_subscribeToAllTabChanges(){this._allTabs.changes.pipe(Cg(this._allTabs)).subscribe(e=>{this._tabs.reset(e.filter(t=>t._closestTabGroup===this||!t._closestTabGroup)),this._tabs.notifyOnChanges()})}ngOnDestroy(){this._tabs.destroy(),this._tabsSubscription.unsubscribe(),this._tabLabelSubscription.unsubscribe(),this._tabBodySubscription.unsubscribe()}realignInkBar(){this._tabHeader&&this._tabHeader._alignInkBarToSelectedTab()}updatePagination(){this._tabHeader&&this._tabHeader.updatePagination()}focusTab(e){let t=this._tabHeader;t&&(t.focusIndex=e)}_focusChanged(e){this._lastFocusedTabIndex=e,this.focusChange.emit(this._createChangeEvent(e))}_createChangeEvent(e){let t=new Ue;return t.index=e,this._tabs&&this._tabs.length&&(t.tab=this._tabs.toArray()[e]),t}_subscribeToTabLabels(){this._tabLabelSubscription&&this._tabLabelSubscription.unsubscribe(),this._tabLabelSubscription=dg(...this._tabs.map(e=>e._stateChanges)).subscribe(()=>this._changeDetectorRef.markForCheck())}_clampTabIndex(e){return Math.min(this._tabs.length-1,Math.max(e||0,0))}_getTabLabelId(e,t){return e.id||`${this._groupId}-label-${t}`}_getTabContentId(e){return`${this._groupId}-content-${e}`}_setTabBodyWrapperHeight(e){if(!this.dynamicHeight||!this._tabBodyWrapperHeight){this._tabBodyWrapperHeight=e;return}let t=this._tabBodyWrapper.nativeElement;t.style.height=this._tabBodyWrapperHeight+`px`,this._tabBodyWrapper.nativeElement.offsetHeight&&(t.style.height=e+`px`)}_removeTabBodyWrapperHeight(){let e=this._tabBodyWrapper.nativeElement;this._tabBodyWrapperHeight=e.clientHeight,e.style.height=``,this._ngZone.run(()=>this.animationDone.emit())}_handleClick(e,t,a){t.focusIndex=a,e.disabled||(this.selectedIndex=a)}_getTabIndex(e){return e===(this._lastFocusedTabIndex??this.selectedIndex)?0:-1}_tabFocusChanged(e,t){e&&e!==`mouse`&&e!==`touch`&&(this._tabHeader.focusIndex=t)}_bodyCentered(e){e&&this._tabBodies?.forEach((t,a)=>t._setActiveClass(a===this._selectedIndex))}_bodyAnimationsDisabled(){return this._diAnimationsDisabled||this._bodyAnimationDuration===`0`||this._bodyAnimationDuration===`0ms`}static ɵfac=function(t){return new(t||n)};static ɵcmp=(function(){let e=[`tabBodyWrapper`],t=[`tabHeader`],a=[`*`];function o(p,_){}function c(p,_){if(p&1&&Ap(0,o,0,0,`ng-template`,12),p&2){let b=YE().$implicit;jp(`cdkPortalOutlet`,b.templateLabel)}}function u(p,_){if(p&1&&_D(0),p&2){let b=YE().$implicit;ah(b.textLabel)}}function k(p,_){if(p&1){let b=UE();Ii(0,`div`,7,2),qp(`click`,function(){let g=bu(b),N=g.$implicit,Le=g.$index,Sn=YE(),Tn=oD(1);return Cu(Sn._handleClick(N,Tn,Le))})(`cdkFocusChange`,function(g){let N=bu(b).$index,Le=YE();return Cu(Le._tabFocusChanged(g,N))}),Vp(2,`span`,8)(3,`div`,9),Ii(4,`span`,10)(5,`span`,11),RE(6,c,1,1,null,12)(7,u,1,1),jc()()()}if(p&2){let b=_.$implicit,f=_.$index,g=oD(1),N=YE();gD(b.labelClass),th(`mdc-tab--active`,N.selectedIndex===f),jp(`id`,N._getTabLabelId(b,f))(`disabled`,b.disabled)(`fitInkBarToContent`,N.fitInkBarToContent),Fp(`tabIndex`,N._getTabIndex(f))(`aria-posinset`,f+1)(`aria-setsize`,N._tabs.length)(`aria-controls`,N._getTabContentId(f))(`aria-selected`,N.selectedIndex===f)(`aria-label`,b.ariaLabel||null)(`aria-labelledby`,!b.ariaLabel&&b.ariaLabelledby?b.ariaLabelledby:null),Ov(3),jp(`matRippleTrigger`,g)(`matRippleDisabled`,b.disabled||N.disableRipple),Ov(3),kE(b.templateLabel?6:7)}}function M(p,_){p&1&&XE(0)}function h(p,_){if(p&1){let b=UE();Ii(0,`mat-tab-body`,13),qp(`_onCentered`,function(){bu(b);let g=YE();return Cu(g._removeTabBodyWrapperHeight())})(`_onCentering`,function(g){bu(b);let N=YE();return Cu(N._setTabBodyWrapperHeight(g))})(`_beforeCentering`,function(g){bu(b);let N=YE();return Cu(N._bodyCentered(g))}),jc()}if(p&2){let b=_.$implicit,f=_.$index,g=YE();gD(b.bodyClass),jp(`id`,g._getTabContentId(f))(`content`,b.content)(`position`,b.position)(`animationDuration`,g._bodyAnimationDuration)(`preserveContent`,g.preserveContent),Fp(`tabindex`,g.contentTabIndex!=null&&g.selectedIndex===f?g.contentTabIndex:null)(`aria-labelledby`,g._getTabLabelId(b,f))(`aria-hidden`,g.selectedIndex!==f)}}return uE({type:n,selectors:[[`mat-tab-group`]],contentQueries:function(_,b,f){if(_&1&&Qp(f,Qe,5),_&2){let g;tD(g=nD())&&(b._allTabs=g)}},viewQuery:function(_,b){if(_&1&&Zp(e,5)(t,5)(We,5),_&2){let f;tD(f=nD())&&(b._tabBodyWrapper=f.first),tD(f=nD())&&(b._tabHeader=f.first),tD(f=nD())&&(b._tabBodies=f)}},hostAttrs:[1,`mat-mdc-tab-group`],hostVars:13,hostBindings:function(_,b){_&2&&(Fp(`mat-align-tabs`,b.alignTabs),gD(`mat-`+(b.color||`primary`)),eh(`--%NS%mat-tab-body-animation-duration`,b._bodyAnimationDuration)(`--%NS%mat-tab-header-animation-duration`,b._headerAnimationDuration),th(`mat-mdc-tab-group-dynamic-height`,b.dynamicHeight)(`mat-mdc-tab-group-inverted-header`,b.headerPosition===`below`)(`mat-mdc-tab-group-stretch-tabs`,b.stretchTabs))},inputs:{color:`color`,fitInkBarToContent:[2,`fitInkBarToContent`,`fitInkBarToContent`,ZF],stretchTabs:[2,`mat-stretch-tabs`,`stretchTabs`,ZF],alignTabs:[0,`mat-align-tabs`,`alignTabs`],dynamicHeight:[2,`dynamicHeight`,`dynamicHeight`,ZF],selectedIndex:[2,`selectedIndex`,`selectedIndex`,YF],headerPosition:`headerPosition`,animationDuration:`animationDuration`,contentTabIndex:[2,`contentTabIndex`,`contentTabIndex`,YF],disablePagination:[2,`disablePagination`,`disablePagination`,ZF],disableRipple:[2,`disableRipple`,`disableRipple`,ZF],preserveContent:[2,`preserveContent`,`preserveContent`,ZF],backgroundColor:`backgroundColor`,ariaLabel:[0,`aria-label`,`ariaLabel`],ariaLabelledby:[0,`aria-labelledby`,`ariaLabelledby`]},outputs:{selectedIndexChange:`selectedIndexChange`,focusChange:`focusChange`,animationDone:`animationDone`,selectedTabChange:`selectedTabChange`},exportAs:[`matTabGroup`],features:[LD([{provide:hn,useExisting:n}])],ngContentSelectors:a,decls:9,vars:8,consts:[[`tabHeader`,``],[`tabBodyWrapper`,``],[`tabNode`,``],[3,`indexFocused`,`selectFocusedIndex`,`selectedIndex`,`disableRipple`,`disablePagination`,`aria-label`,`aria-labelledby`],[`role`,`tab`,`matTabLabelWrapper`,``,`cdkMonitorElementFocus`,``,1,`mdc-tab`,`mat-mdc-tab`,`mat-focus-indicator`,3,`id`,`mdc-tab--active`,`class`,`disabled`,`fitInkBarToContent`],[1,`mat-mdc-tab-body-wrapper`],[`role`,`tabpanel`,3,`id`,`class`,`content`,`position`,`animationDuration`,`preserveContent`],[`role`,`tab`,`matTabLabelWrapper`,``,`cdkMonitorElementFocus`,``,1,`mdc-tab`,`mat-mdc-tab`,`mat-focus-indicator`,3,`click`,`cdkFocusChange`,`id`,`disabled`,`fitInkBarToContent`],[1,`mdc-tab__ripple`],[`mat-ripple`,``,1,`mat-mdc-tab-ripple`,3,`matRippleTrigger`,`matRippleDisabled`],[1,`mdc-tab__content`],[1,`mdc-tab__text-label`],[3,`cdkPortalOutlet`],[`role`,`tabpanel`,3,`_onCentered`,`_onCentering`,`_beforeCentering`,`id`,`content`,`position`,`animationDuration`,`preserveContent`]],template:function(_,b){_&1&&(JE(),Ii(0,`mat-tab-header`,3,0),qp(`indexFocused`,function(g){return b._focusChanged(g)})(`selectFocusedIndex`,function(g){return b.selectedIndex=g}),PE(2,k,8,17,`div`,4,LE),jc(),RE(4,M,1,0),Ii(5,`div`,5,1),PE(7,h,1,10,`mat-tab-body`,6,LE),jc()),_&2&&(jp(`selectedIndex`,b.selectedIndex||0)(`disableRipple`,b.disableRipple)(`disablePagination`,b.disablePagination),Pp(`aria-label`,b.ariaLabel)(`aria-labelledby`,b.ariaLabelledby),Ov(2),FE(b._tabs),Ov(2),kE(b._isServer?4:-1),Ov(),th(`_mat-animation-noopable`,b._bodyAnimationsDisabled()),Ov(2),FE(b._tabs))},dependencies:[Bn,un,Ym,GS,nw,We],styles:[`.mdc-tab {
  min-width: 90px;
  padding: 0 24px;
  display: flex;
  flex: 1 0 auto;
  justify-content: center;
  box-sizing: border-box;
  border: none;
  outline: none;
  text-align: center;
  white-space: nowrap;
  cursor: pointer;
  z-index: 1;
  touch-action: manipulation;
}

.mdc-tab__content {
  display: flex;
  align-items: center;
  justify-content: center;
  height: inherit;
  pointer-events: none;
}

.mdc-tab__text-label {
  transition: 150ms color linear;
  display: inline-block;
  line-height: 1;
  z-index: 2;
}

.mdc-tab--active .mdc-tab__text-label {
  transition-delay: 100ms;
}

._mat-animation-noopable .mdc-tab__text-label {
  transition: none;
}

.mdc-tab-indicator {
  display: flex;
  position: absolute;
  top: 0;
  left: 0;
  justify-content: center;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.mdc-tab-indicator__content {
  transition: var(--%NS%mat-tab-header-animation-duration, 250ms) transform cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: left;
  opacity: 0;
}

.mdc-tab-indicator__content--underline {
  align-self: flex-end;
  box-sizing: border-box;
  width: 100%;
  border-top-style: solid;
}

.mdc-tab-indicator--active .mdc-tab-indicator__content {
  opacity: 1;
}

._mat-animation-noopable .mdc-tab-indicator__content, .mdc-tab-indicator--no-transition .mdc-tab-indicator__content {
  transition: none;
}

.mat-mdc-tab-ripple.mat-mdc-tab-ripple {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  pointer-events: none;
}

.mat-mdc-tab {
  -webkit-tap-highlight-color: transparent;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-decoration: none;
  background: none;
  height: var(--%NS%mat-tab-container-height, 48px);
  font-family: var(--%NS%mat-tab-label-text-font, var(--%NS%mat-sys-title-small-font));
  font-size: var(--%NS%mat-tab-label-text-size, var(--%NS%mat-sys-title-small-size));
  letter-spacing: var(--%NS%mat-tab-label-text-tracking, var(--%NS%mat-sys-title-small-tracking));
  line-height: var(--%NS%mat-tab-label-text-line-height, var(--%NS%mat-sys-title-small-line-height));
  font-weight: var(--%NS%mat-tab-label-text-weight, var(--%NS%mat-sys-title-small-weight));
}
.mat-mdc-tab.mdc-tab {
  flex-grow: 0;
}
.mat-mdc-tab .mdc-tab-indicator__content--underline {
  border-color: var(--%NS%mat-tab-active-indicator-color, var(--%NS%mat-sys-primary));
  border-top-width: var(--%NS%mat-tab-active-indicator-height, 2px);
  border-radius: var(--%NS%mat-tab-active-indicator-shape, 0);
}
.mat-mdc-tab:hover .mdc-tab__text-label {
  color: var(--%NS%mat-tab-inactive-hover-label-text-color, var(--%NS%mat-sys-on-surface));
}
.mat-mdc-tab:focus .mdc-tab__text-label {
  color: var(--%NS%mat-tab-inactive-focus-label-text-color, var(--%NS%mat-sys-on-surface));
}
.mat-mdc-tab.mdc-tab--active .mdc-tab__text-label {
  color: var(--%NS%mat-tab-active-label-text-color, var(--%NS%mat-sys-on-surface));
}
.mat-mdc-tab.mdc-tab--active .mdc-tab__ripple::before,
.mat-mdc-tab.mdc-tab--active .mat-ripple-element {
  background-color: var(--%NS%mat-tab-active-ripple-color, var(--%NS%mat-sys-on-surface));
}
.mat-mdc-tab.mdc-tab--%NS%active:hover .mdc-tab__text-label {
  color: var(--%NS%mat-tab-active-hover-label-text-color, var(--%NS%mat-sys-on-surface));
}
.mat-mdc-tab.mdc-tab--%NS%active:hover .mdc-tab-indicator__content--underline {
  border-color: var(--%NS%mat-tab-active-hover-indicator-color, var(--%NS%mat-sys-primary));
}
.mat-mdc-tab.mdc-tab--%NS%active:focus .mdc-tab__text-label {
  color: var(--%NS%mat-tab-active-focus-label-text-color, var(--%NS%mat-sys-on-surface));
}
.mat-mdc-tab.mdc-tab--%NS%active:focus .mdc-tab-indicator__content--underline {
  border-color: var(--%NS%mat-tab-active-focus-indicator-color, var(--%NS%mat-sys-primary));
}
.mat-mdc-tab.mat-mdc-tab-disabled {
  opacity: 0.4;
  pointer-events: none;
}
.mat-mdc-tab.mat-mdc-tab-disabled .mdc-tab__content {
  pointer-events: none;
}
.mat-mdc-tab.mat-mdc-tab-disabled .mdc-tab__ripple::before,
.mat-mdc-tab.mat-mdc-tab-disabled .mat-ripple-element {
  background-color: var(--%NS%mat-tab-disabled-ripple-color, var(--%NS%mat-sys-on-surface-variant));
}
.mat-mdc-tab .mdc-tab__ripple::before {
  content: "";
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0;
  pointer-events: none;
  background-color: var(--%NS%mat-tab-inactive-ripple-color, var(--%NS%mat-sys-on-surface));
}
.mat-mdc-tab .mdc-tab__text-label {
  color: var(--%NS%mat-tab-inactive-label-text-color, var(--%NS%mat-sys-on-surface));
  display: inline-flex;
  align-items: center;
}
.mat-mdc-tab .mdc-tab__content {
  position: relative;
  pointer-events: auto;
}
.mat-mdc-tab:hover .mdc-tab__ripple::before {
  opacity: 0.04;
}
.mat-mdc-tab.cdk-program-focused .mdc-tab__ripple::before, .mat-mdc-tab.cdk-keyboard-focused .mdc-tab__ripple::before {
  opacity: 0.12;
}
.mat-mdc-tab .mat-ripple-element {
  opacity: 0.12;
  background-color: var(--%NS%mat-tab-inactive-ripple-color, var(--%NS%mat-sys-on-surface));
}
.mat-mdc-tab-group.mat-mdc-tab-group-stretch-tabs > .mat-mdc-tab-header .mat-mdc-tab {
  flex-grow: 1;
}

.mat-mdc-tab-group {
  display: flex;
  flex-direction: column;
  max-width: 100%;
}
.mat-mdc-tab-group.mat-tabs-with-background > .mat-mdc-tab-header, .mat-mdc-tab-group.mat-tabs-with-background > .mat-mdc-tab-header-pagination {
  background-color: var(--%NS%mat-tab-background-color);
}
.mat-mdc-tab-group.mat-tabs-with-background.mat-primary > .mat-mdc-tab-header .mat-mdc-tab .mdc-tab__text-label {
  color: var(--%NS%mat-tab-foreground-color);
}
.mat-mdc-tab-group.mat-tabs-with-background.mat-primary > .mat-mdc-tab-header .mdc-tab-indicator__content--underline {
  border-color: var(--%NS%mat-tab-foreground-color);
}
.mat-mdc-tab-group.mat-tabs-with-background:not(.mat-primary) > .mat-mdc-tab-header .mat-mdc-tab:not(.mdc-tab--active) .mdc-tab__text-label {
  color: var(--%NS%mat-tab-foreground-color);
}
.mat-mdc-tab-group.mat-tabs-with-background:not(.mat-primary) > .mat-mdc-tab-header .mat-mdc-tab:not(.mdc-tab--active) .mdc-tab-indicator__content--underline {
  border-color: var(--%NS%mat-tab-foreground-color);
}
.mat-mdc-tab-group.mat-tabs-with-background > .mat-mdc-tab-header .mat-mdc-tab-header-pagination-chevron,
.mat-mdc-tab-group.mat-tabs-with-background > .mat-mdc-tab-header .mat-focus-indicator::before, .mat-mdc-tab-group.mat-tabs-with-background > .mat-mdc-tab-header-pagination .mat-mdc-tab-header-pagination-chevron,
.mat-mdc-tab-group.mat-tabs-with-background > .mat-mdc-tab-header-pagination .mat-focus-indicator::before {
  border-color: var(--%NS%mat-tab-foreground-color);
}
.mat-mdc-tab-group.mat-tabs-with-background > .mat-mdc-tab-header .mat-ripple-element, .mat-mdc-tab-group.mat-tabs-with-background > .mat-mdc-tab-header .mdc-tab__ripple::before, .mat-mdc-tab-group.mat-tabs-with-background > .mat-mdc-tab-header-pagination .mat-ripple-element, .mat-mdc-tab-group.mat-tabs-with-background > .mat-mdc-tab-header-pagination .mdc-tab__ripple::before {
  background-color: var(--%NS%mat-tab-foreground-color);
}
.mat-mdc-tab-group.mat-tabs-with-background > .mat-mdc-tab-header .mat-mdc-tab-header-pagination-chevron, .mat-mdc-tab-group.mat-tabs-with-background > .mat-mdc-tab-header-pagination .mat-mdc-tab-header-pagination-chevron {
  color: var(--%NS%mat-tab-foreground-color);
}
.mat-mdc-tab-group.mat-mdc-tab-group-inverted-header {
  flex-direction: column-reverse;
}
.mat-mdc-tab-group.mat-mdc-tab-group-inverted-header .mdc-tab-indicator__content--underline {
  align-self: flex-start;
}

.mat-mdc-tab-body-wrapper {
  position: relative;
  overflow: hidden;
  display: flex;
  transition: height 500ms cubic-bezier(0.35, 0, 0.25, 1);
}
.mat-mdc-tab-body-wrapper._mat-animation-noopable {
  transition: none !important;
  animation: none !important;
}
`],encapsulation:2,changeDetection:1})})()}return n})();var Ue=class{index;tab};var gn=(()=>{class n{static ɵfac=function(t){return new(t||n)};static ɵmod=fE({type:n});static ɵinj=Kl({imports:[Tt]})}return n})();var fn=(()=>{class n{labelPosition=`after`;static ɵfac=function(t){return new(t||n)};static ɵcmp=(function(){return uE({type:n,selectors:[[``,`mat-internal-form-field`,``]],hostAttrs:[1,`mdc-form-field`,`mat-internal-form-field`],hostVars:2,hostBindings:function(a,o){a&2&&th(`mdc-form-field--align-end`,o.labelPosition===`before`)},inputs:{labelPosition:`labelPosition`},ngContentSelectors:[`*`],decls:1,vars:0,template:function(a,o){a&1&&(JE(),XE(0))},styles:[`.mat-internal-form-field {
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  display: inline-flex;
  align-items: center;
  vertical-align: middle;
}
.mat-internal-form-field > label, .mat-internal-form-field > .mat-internal-form-field-label {
  margin-left: 0;
  margin-right: auto;
  padding-left: 4px;
  padding-right: 0;
  order: 0;
}
[dir=rtl] .mat-internal-form-field > label, [dir=rtl] .mat-internal-form-field > .mat-internal-form-field-label {
  margin-left: auto;
  margin-right: 0;
  padding-left: 0;
  padding-right: 4px;
}

.mdc-form-field--align-end > label, .mdc-form-field--align-end > .mat-internal-form-field-label {
  margin-left: auto;
  margin-right: 0;
  padding-left: 0;
  padding-right: 4px;
  order: -1;
}
[dir=rtl] .mdc-form-field--align-end .mdc-form-field--align-end label, [dir=rtl] .mdc-form-field--align-end .mdc-form-field--align-end .mat-internal-form-field-label {
  margin-left: 0;
  margin-right: auto;
  padding-left: 4px;
  padding-right: 0;
}
`],encapsulation:2})})()}return n})();var Ze={color:`accent`,clickAction:`check-indeterminate`,disabledInteractive:!1};var Fn=new A(`mat-checkbox-default-options`,{providedIn:`root`,factory:()=>Ze});var R=(function(n){return n[n.Init=0]=`Init`,n[n.Checked=1]=`Checked`,n[n.Unchecked=2]=`Unchecked`,n[n.Indeterminate=3]=`Indeterminate`,n})(R||{});var Ke=class{source;checked};var Ye=(()=>{class n{_elementRef=w(wr);_changeDetectorRef=w(zF);_ngZone=w(_e);_animationsDisabled=pn$1();_options=w(Fn,{optional:!0});focus(){this._inputElement.nativeElement.focus()}_createChangeEvent(e){let t=new Ke;return t.source=this,t.checked=e,t}_getAnimationTargetElement(){return this._inputElement?.nativeElement}_animationClasses={uncheckedToChecked:`mdc-checkbox--anim-unchecked-checked`,uncheckedToIndeterminate:`mdc-checkbox--anim-unchecked-indeterminate`,checkedToUnchecked:`mdc-checkbox--anim-checked-unchecked`,checkedToIndeterminate:`mdc-checkbox--anim-checked-indeterminate`,indeterminateToChecked:`mdc-checkbox--anim-indeterminate-checked`,indeterminateToUnchecked:`mdc-checkbox--anim-indeterminate-unchecked`};ariaLabel=``;ariaLabelledby=null;ariaDescribedby;ariaExpanded;ariaControls;ariaOwns;_uniqueId;id;get inputId(){return`${this.id||this._uniqueId}-input`}required=!1;labelPosition=`after`;name=null;change=new je;indeterminateChange=new je;value;disableRipple=!1;_inputElement;tabIndex;color;disabledInteractive;_onTouched=()=>{};_currentAnimationClass=``;_currentCheckState=R.Init;_controlValueAccessorChangeFn=()=>{};_validatorChangeFn=()=>{};constructor(){w(Ct).load(Kl$1);let e=w(new wh(`tabindex`),{optional:!0});this._options=this._options||Ze,this.color=this._options.color||Ze.color,this.tabIndex=e==null?0:parseInt(e)||0,this.id=this._uniqueId=w(ir).getId(`mat-mdc-checkbox-`),this.disabledInteractive=this._options?.disabledInteractive??!1}ngOnChanges(e){e.required&&this._validatorChangeFn()}ngAfterViewInit(){this._syncIndeterminate(this.indeterminate)}get checked(){return this._checked}set checked(e){e!=this.checked&&(this._checked=e,this._changeDetectorRef.markForCheck())}_checked=!1;get disabled(){return this._disabled}set disabled(e){e!==this.disabled&&(this._disabled=e,this._changeDetectorRef.markForCheck())}_disabled=!1;get indeterminate(){return this._indeterminate()}set indeterminate(e){let t=e!=this._indeterminate();this._indeterminate.set(e),t&&(e?this._transitionCheckState(R.Indeterminate):this._transitionCheckState(this.checked?R.Checked:R.Unchecked),this.indeterminateChange.emit(e)),this._syncIndeterminate(e)}_indeterminate=$o(!1);_isRippleDisabled(){return this.disableRipple||this.disabled}_onLabelTextChange(){this._changeDetectorRef.detectChanges()}writeValue(e){this.checked=!!e}registerOnChange(e){this._controlValueAccessorChangeFn=e}registerOnTouched(e){this._onTouched=e}setDisabledState(e){this.disabled=e}validate(e){return this.required&&e.value!==!0?{required:!0}:null}registerOnValidatorChange(e){this._validatorChangeFn=e}_transitionCheckState(e){let t=this._currentCheckState,a=this._getAnimationTargetElement();if(!(t===e||!a)&&(this._currentAnimationClass&&a.classList.remove(this._currentAnimationClass),this._currentAnimationClass=this._getAnimationClassForCheckStateTransition(t,e),this._currentCheckState=e,this._currentAnimationClass.length>0)){a.classList.add(this._currentAnimationClass);let o=this._currentAnimationClass;this._ngZone.runOutsideAngular(()=>{setTimeout(()=>{a.classList.remove(o)},1e3)})}}_emitChangeEvent(){this._controlValueAccessorChangeFn(this.checked),this.change.emit(this._createChangeEvent(this.checked)),this._inputElement&&(this._inputElement.nativeElement.checked=this.checked)}toggle(){this.checked=!this.checked,this._controlValueAccessorChangeFn(this.checked)}_handleInputClick(){let e=this._options?.clickAction;!this.disabled&&e!==`noop`?(this.indeterminate&&e!==`check`&&Promise.resolve().then(()=>{this._indeterminate.set(!1),this.indeterminateChange.emit(!1)}),this._checked=!this._checked,this._transitionCheckState(this._checked?R.Checked:R.Unchecked),this._emitChangeEvent()):(this.disabled&&this.disabledInteractive||!this.disabled&&e===`noop`)&&(this._inputElement.nativeElement.checked=this.checked,this._inputElement.nativeElement.indeterminate=this.indeterminate)}_onInteractionEvent(e){e.stopPropagation()}_onBlur(){Promise.resolve().then(()=>{this._onTouched(),this._changeDetectorRef.markForCheck()})}_getAnimationClassForCheckStateTransition(e,t){if(this._animationsDisabled)return``;switch(e){case R.Init:if(t===R.Checked)return this._animationClasses.uncheckedToChecked;if(t==R.Indeterminate)return this._checked?this._animationClasses.checkedToIndeterminate:this._animationClasses.uncheckedToIndeterminate;break;case R.Unchecked:return t===R.Checked?this._animationClasses.uncheckedToChecked:this._animationClasses.uncheckedToIndeterminate;case R.Checked:return t===R.Unchecked?this._animationClasses.checkedToUnchecked:this._animationClasses.checkedToIndeterminate;case R.Indeterminate:return t===R.Checked?this._animationClasses.indeterminateToChecked:this._animationClasses.indeterminateToUnchecked}return``}_syncIndeterminate(e){let t=this._inputElement;t&&(t.nativeElement.indeterminate=e)}_onInputClick(){this._handleInputClick()}_preventBubblingFromLabel(e){e.target&&this._inputElement&&e.target!==this._inputElement.nativeElement&&e.stopPropagation()}static ɵfac=function(t){return new(t||n)};static ɵcmp=(function(){let e=[`input`];return uE({type:n,selectors:[[`mat-checkbox`]],viewQuery:function(o,c){if(o&1&&Zp(e,5),o&2){let u;tD(u=nD())&&(c._inputElement=u.first)}},hostAttrs:[1,`mat-mdc-checkbox`],hostVars:16,hostBindings:function(o,c){o&2&&(Up(`id`,c.id),Fp(`tabindex`,null)(`aria-label`,null)(`aria-labelledby`,null),gD(c.color?`mat-`+c.color:`mat-accent`),th(`_mat-animation-noopable`,c._animationsDisabled)(`mdc-checkbox--disabled`,c.disabled)(`mat-mdc-checkbox-disabled`,c.disabled)(`mat-mdc-checkbox-checked`,c.checked)(`mat-mdc-checkbox-disabled-interactive`,c.disabledInteractive))},inputs:{ariaLabel:[0,`aria-label`,`ariaLabel`],ariaLabelledby:[0,`aria-labelledby`,`ariaLabelledby`],ariaDescribedby:[0,`aria-describedby`,`ariaDescribedby`],ariaExpanded:[2,`aria-expanded`,`ariaExpanded`,ZF],ariaControls:[0,`aria-controls`,`ariaControls`],ariaOwns:[0,`aria-owns`,`ariaOwns`],id:`id`,required:[2,`required`,`required`,ZF],labelPosition:`labelPosition`,name:`name`,value:`value`,disableRipple:[2,`disableRipple`,`disableRipple`,ZF],tabIndex:[2,`tabIndex`,`tabIndex`,a=>a==null?void 0:YF(a)],color:`color`,disabledInteractive:[2,`disabledInteractive`,`disabledInteractive`,ZF],checked:[2,`checked`,`checked`,ZF],disabled:[2,`disabled`,`disabled`,ZF],indeterminate:[2,`indeterminate`,`indeterminate`,ZF]},outputs:{change:`change`,indeterminateChange:`indeterminateChange`},exportAs:[`matCheckbox`],features:[LD([{provide:Q,useExisting:vo(()=>n),multi:!0},{provide:j$1,useExisting:n,multi:!0}]),km],ngContentSelectors:[`*`],decls:15,vars:23,consts:[[`checkbox`,``],[`input`,``],[`label`,``],[`mat-internal-form-field`,``,3,`click`,`labelPosition`,`for`],[1,`mdc-checkbox`],[`aria-hidden`,`true`,1,`mat-mdc-checkbox-touch-target`],[`type`,`checkbox`,1,`mdc-checkbox__native-control`,3,`blur`,`click`,`change`,`checked`,`indeterminate`,`disabled`,`id`,`required`,`tabIndex`],[`aria-hidden`,`true`,1,`mdc-checkbox__ripple`],[`aria-hidden`,`true`,1,`mdc-checkbox__background`],[`focusable`,`false`,`viewBox`,`0 0 24 24`,1,`mdc-checkbox__checkmark`],[`fill`,`none`,`d`,`M1.73,12.91 8.1,19.28 22.79,4.59`,1,`mdc-checkbox__checkmark-path`],[1,`mdc-checkbox__mixedmark`],[`mat-ripple`,``,`aria-hidden`,`true`,1,`mat-mdc-checkbox-ripple`,`mat-focus-indicator`,3,`matRippleTrigger`,`matRippleDisabled`,`matRippleCentered`],[1,`mat-internal-form-field-label`,`mdc-label`]],template:function(o,c){if(o&1&&(JE(),Ii(0,`label`,3),qp(`click`,function(k){return c._preventBubblingFromLabel(k)}),Ii(1,`span`,4,0),Vp(3,`span`,5),Ii(4,`input`,6,1),qp(`blur`,function(){return c._onBlur()})(`click`,function(){return c._onInputClick()})(`change`,function(k){return c._onInteractionEvent(k)}),jc(),Vp(6,`span`,7),Ii(7,`span`,8),Pu(),Ii(8,`svg`,9),Vp(9,`path`,10),jc(),Fu(),Vp(10,`span`,11),jc(),Vp(11,`span`,12),jc(),Ii(12,`span`,13,2),XE(14),jc()()),o&2){let u=oD(2);jp(`labelPosition`,c.labelPosition)(`for`,c.inputId),Ov(4),th(`mdc-checkbox--selected`,c.checked),jp(`checked`,c.checked)(`indeterminate`,c.indeterminate)(`disabled`,c.disabled&&!c.disabledInteractive)(`id`,c.inputId)(`required`,c.required)(`tabIndex`,c.disabled&&!c.disabledInteractive?-1:c.tabIndex),Fp(`aria-label`,c.ariaLabel||null)(`aria-labelledby`,c.ariaLabelledby)(`aria-describedby`,c.ariaDescribedby)(`aria-checked`,c.indeterminate?`mixed`:null)(`aria-controls`,c.ariaControls)(`aria-disabled`,c.disabled&&c.disabledInteractive?!0:null)(`aria-expanded`,c.ariaExpanded)(`aria-owns`,c.ariaOwns)(`name`,c.name)(`value`,c.value),Ov(7),jp(`matRippleTrigger`,u)(`matRippleDisabled`,c.disableRipple||c.disabled)(`matRippleCentered`,!0)}},dependencies:[GS,fn],styles:[`.mdc-checkbox {
  display: inline-block;
  position: relative;
  flex: 0 0 18px;
  box-sizing: content-box;
  width: 18px;
  height: 18px;
  line-height: 0;
  white-space: nowrap;
  cursor: pointer;
  vertical-align: bottom;
  padding: calc((var(--%NS%mat-checkbox-state-layer-size, 40px) - 18px) / 2);
  margin: calc((var(--%NS%mat-checkbox-state-layer-size, 40px) - var(--%NS%mat-checkbox-state-layer-size, 40px)) / 2);
}
.mdc-checkbox:hover > .mdc-checkbox__ripple {
  opacity: var(--%NS%mat-checkbox-unselected-hover-state-layer-opacity, var(--%NS%mat-sys-hover-state-layer-opacity));
  background-color: var(--%NS%mat-checkbox-unselected-hover-state-layer-color, var(--%NS%mat-sys-on-surface));
}
.mdc-checkbox:hover > .mat-mdc-checkbox-ripple > .mat-ripple-element {
  background-color: var(--%NS%mat-checkbox-unselected-hover-state-layer-color, var(--%NS%mat-sys-on-surface));
}
.mdc-checkbox .mdc-checkbox__native-control:focus + .mdc-checkbox__ripple {
  opacity: var(--%NS%mat-checkbox-unselected-focus-state-layer-opacity, var(--%NS%mat-sys-focus-state-layer-opacity));
  background-color: var(--%NS%mat-checkbox-unselected-focus-state-layer-color, var(--%NS%mat-sys-on-surface));
}
.mdc-checkbox .mdc-checkbox__native-control:focus ~ .mat-mdc-checkbox-ripple .mat-ripple-element {
  background-color: var(--%NS%mat-checkbox-unselected-focus-state-layer-color, var(--%NS%mat-sys-on-surface));
}
.mdc-checkbox:active > .mdc-checkbox__native-control + .mdc-checkbox__ripple {
  opacity: var(--%NS%mat-checkbox-unselected-pressed-state-layer-opacity, var(--%NS%mat-sys-pressed-state-layer-opacity));
  background-color: var(--%NS%mat-checkbox-unselected-pressed-state-layer-color, var(--%NS%mat-sys-primary));
}
.mdc-checkbox:active > .mdc-checkbox__native-control ~ .mat-mdc-checkbox-ripple .mat-ripple-element {
  background-color: var(--%NS%mat-checkbox-unselected-pressed-state-layer-color, var(--%NS%mat-sys-primary));
}
.mdc-checkbox:hover > .mdc-checkbox__native-control:checked + .mdc-checkbox__ripple {
  opacity: var(--%NS%mat-checkbox-selected-hover-state-layer-opacity, var(--%NS%mat-sys-hover-state-layer-opacity));
  background-color: var(--%NS%mat-checkbox-selected-hover-state-layer-color, var(--%NS%mat-sys-primary));
}
.mdc-checkbox:hover > .mdc-checkbox__native-control:checked ~ .mat-mdc-checkbox-ripple .mat-ripple-element {
  background-color: var(--%NS%mat-checkbox-selected-hover-state-layer-color, var(--%NS%mat-sys-primary));
}
.mdc-checkbox .mdc-checkbox__native-control:focus:checked + .mdc-checkbox__ripple {
  opacity: var(--%NS%mat-checkbox-selected-focus-state-layer-opacity, var(--%NS%mat-sys-focus-state-layer-opacity));
  background-color: var(--%NS%mat-checkbox-selected-focus-state-layer-color, var(--%NS%mat-sys-primary));
}
.mdc-checkbox .mdc-checkbox__native-control:focus:checked ~ .mat-mdc-checkbox-ripple .mat-ripple-element {
  background-color: var(--%NS%mat-checkbox-selected-focus-state-layer-color, var(--%NS%mat-sys-primary));
}
.mdc-checkbox:active > .mdc-checkbox__native-control:checked + .mdc-checkbox__ripple {
  opacity: var(--%NS%mat-checkbox-selected-pressed-state-layer-opacity, var(--%NS%mat-sys-pressed-state-layer-opacity));
  background-color: var(--%NS%mat-checkbox-selected-pressed-state-layer-color, var(--%NS%mat-sys-on-surface));
}
.mdc-checkbox:active > .mdc-checkbox__native-control:checked ~ .mat-mdc-checkbox-ripple .mat-ripple-element {
  background-color: var(--%NS%mat-checkbox-selected-pressed-state-layer-color, var(--%NS%mat-sys-on-surface));
}
.mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox .mdc-checkbox__native-control ~ .mat-mdc-checkbox-ripple .mat-ripple-element,
.mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox .mdc-checkbox__native-control + .mdc-checkbox__ripple {
  background-color: var(--%NS%mat-checkbox-unselected-hover-state-layer-color, var(--%NS%mat-sys-on-surface));
}
.mdc-checkbox .mdc-checkbox__native-control {
  position: absolute;
  margin: 0;
  padding: 0;
  opacity: 0;
  cursor: inherit;
  z-index: 1;
  width: var(--%NS%mat-checkbox-state-layer-size, 40px);
  height: var(--%NS%mat-checkbox-state-layer-size, 40px);
  top: calc((var(--%NS%mat-checkbox-state-layer-size, 40px) - var(--%NS%mat-checkbox-state-layer-size, 40px)) / 2);
  right: calc((var(--%NS%mat-checkbox-state-layer-size, 40px) - var(--%NS%mat-checkbox-state-layer-size, 40px)) / 2);
  left: calc((var(--%NS%mat-checkbox-state-layer-size, 40px) - var(--%NS%mat-checkbox-state-layer-size, 40px)) / 2);
}

.mdc-checkbox--disabled {
  cursor: default;
  pointer-events: none;
}

.mdc-checkbox__background {
  display: inline-flex;
  position: absolute;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: 18px;
  height: 18px;
  border: 2px solid currentColor;
  border-radius: 2px;
  background-color: transparent;
  pointer-events: none;
  will-change: background-color, border-color;
  transition: background-color 90ms cubic-bezier(0.4, 0, 0.6, 1), border-color 90ms cubic-bezier(0.4, 0, 0.6, 1);
  -webkit-print-color-adjust: exact;
  color-adjust: exact;
  border-color: var(--%NS%mat-checkbox-unselected-icon-color, var(--%NS%mat-sys-on-surface-variant));
  top: calc((var(--%NS%mat-checkbox-state-layer-size, 40px) - 18px) / 2);
  left: calc((var(--%NS%mat-checkbox-state-layer-size, 40px) - 18px) / 2);
}

.mdc-checkbox__native-control:enabled:checked ~ .mdc-checkbox__background,
.mdc-checkbox__native-control:enabled:indeterminate ~ .mdc-checkbox__background {
  border-color: var(--%NS%mat-checkbox-selected-icon-color, var(--%NS%mat-sys-primary));
  background-color: var(--%NS%mat-checkbox-selected-icon-color, var(--%NS%mat-sys-primary));
}

.mdc-checkbox--disabled .mdc-checkbox__background {
  border-color: var(--%NS%mat-checkbox-disabled-unselected-icon-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
}
@media (forced-colors: active) {
  .mdc-checkbox--disabled .mdc-checkbox__background {
    border-color: GrayText;
  }
}

.mdc-checkbox__native-control:disabled:checked ~ .mdc-checkbox__background,
.mdc-checkbox__native-control:disabled:indeterminate ~ .mdc-checkbox__background {
  background-color: var(--%NS%mat-checkbox-disabled-selected-icon-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
  border-color: transparent;
}
@media (forced-colors: active) {
  .mdc-checkbox__native-control:disabled:checked ~ .mdc-checkbox__background,
  .mdc-checkbox__native-control:disabled:indeterminate ~ .mdc-checkbox__background {
    border-color: GrayText;
  }
}

.mdc-checkbox:hover > .mdc-checkbox__native-control:not(:checked) ~ .mdc-checkbox__background,
.mdc-checkbox:hover > .mdc-checkbox__native-control:not(:indeterminate) ~ .mdc-checkbox__background {
  border-color: var(--%NS%mat-checkbox-unselected-hover-icon-color, var(--%NS%mat-sys-on-surface));
  background-color: transparent;
}

.mdc-checkbox:hover > .mdc-checkbox__native-control:checked ~ .mdc-checkbox__background,
.mdc-checkbox:hover > .mdc-checkbox__native-control:indeterminate ~ .mdc-checkbox__background {
  border-color: var(--%NS%mat-checkbox-selected-hover-icon-color, var(--%NS%mat-sys-primary));
  background-color: var(--%NS%mat-checkbox-selected-hover-icon-color, var(--%NS%mat-sys-primary));
}

.mdc-checkbox__native-control:focus:focus:not(:checked) ~ .mdc-checkbox__background,
.mdc-checkbox__native-control:focus:focus:not(:indeterminate) ~ .mdc-checkbox__background {
  border-color: var(--%NS%mat-checkbox-unselected-focus-icon-color, var(--%NS%mat-sys-on-surface));
}

.mdc-checkbox__native-control:focus:focus:checked ~ .mdc-checkbox__background,
.mdc-checkbox__native-control:focus:focus:indeterminate ~ .mdc-checkbox__background {
  border-color: var(--%NS%mat-checkbox-selected-focus-icon-color, var(--%NS%mat-sys-primary));
  background-color: var(--%NS%mat-checkbox-selected-focus-icon-color, var(--%NS%mat-sys-primary));
}

.mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox:hover > .mdc-checkbox__native-control ~ .mdc-checkbox__background,
.mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox .mdc-checkbox__native-control:focus ~ .mdc-checkbox__background,
.mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox__background {
  border-color: var(--%NS%mat-checkbox-disabled-unselected-icon-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
}
@media (forced-colors: active) {
  .mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox:hover > .mdc-checkbox__native-control ~ .mdc-checkbox__background,
  .mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox .mdc-checkbox__native-control:focus ~ .mdc-checkbox__background,
  .mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox__background {
    border-color: GrayText;
  }
}
.mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox__native-control:checked ~ .mdc-checkbox__background,
.mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox__native-control:indeterminate ~ .mdc-checkbox__background {
  background-color: var(--%NS%mat-checkbox-disabled-selected-icon-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
  border-color: transparent;
}

.mdc-checkbox__checkmark {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  opacity: 0;
  transition: opacity 180ms cubic-bezier(0.4, 0, 0.6, 1);
  color: var(--%NS%mat-checkbox-selected-checkmark-color, var(--%NS%mat-sys-on-primary));
}
@media (forced-colors: active) {
  .mdc-checkbox__checkmark {
    color: CanvasText;
  }
}

.mdc-checkbox--disabled .mdc-checkbox__checkmark, .mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox__checkmark {
  color: var(--%NS%mat-checkbox-disabled-selected-checkmark-color, var(--%NS%mat-sys-surface));
}
@media (forced-colors: active) {
  .mdc-checkbox--disabled .mdc-checkbox__checkmark, .mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox__checkmark {
    color: GrayText;
  }
}

.mdc-checkbox__checkmark-path {
  transition: stroke-dashoffset 180ms cubic-bezier(0.4, 0, 0.6, 1);
  stroke: currentColor;
  stroke-width: 3.12px;
  stroke-dashoffset: 29.7833385;
  stroke-dasharray: 29.7833385;
}

.mdc-checkbox__mixedmark {
  width: 100%;
  height: 0;
  transform: scaleX(0) rotate(0deg);
  border-width: 1px;
  border-style: solid;
  opacity: 0;
  transition: opacity 90ms cubic-bezier(0.4, 0, 0.6, 1), transform 90ms cubic-bezier(0.4, 0, 0.6, 1);
  border-color: var(--%NS%mat-checkbox-selected-checkmark-color, var(--%NS%mat-sys-on-primary));
}
@media (forced-colors: active) {
  .mdc-checkbox__mixedmark {
    margin: 0 1px;
  }
}

.mdc-checkbox--disabled .mdc-checkbox__mixedmark, .mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox__mixedmark {
  border-color: var(--%NS%mat-checkbox-disabled-selected-checkmark-color, var(--%NS%mat-sys-surface));
}
@media (forced-colors: active) {
  .mdc-checkbox--disabled .mdc-checkbox__mixedmark, .mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox__mixedmark {
    border-color: GrayText;
  }
}

.mdc-checkbox--anim-unchecked-checked .mdc-checkbox__background,
.mdc-checkbox--anim-unchecked-indeterminate .mdc-checkbox__background,
.mdc-checkbox--anim-checked-unchecked .mdc-checkbox__background,
.mdc-checkbox--anim-indeterminate-unchecked .mdc-checkbox__background {
  animation-duration: 180ms;
  animation-timing-function: linear;
}

.mdc-checkbox--anim-unchecked-checked .mdc-checkbox__checkmark-path {
  animation: mdc-checkbox-unchecked-checked-checkmark-path 180ms linear;
  transition: none;
}

.mdc-checkbox--anim-unchecked-indeterminate .mdc-checkbox__mixedmark {
  animation: mdc-checkbox-unchecked-indeterminate-mixedmark 90ms linear;
  transition: none;
}

.mdc-checkbox--anim-checked-unchecked .mdc-checkbox__checkmark-path {
  animation: mdc-checkbox-checked-unchecked-checkmark-path 90ms linear;
  transition: none;
}

.mdc-checkbox--anim-checked-indeterminate .mdc-checkbox__checkmark {
  animation: mdc-checkbox-checked-indeterminate-checkmark 90ms linear;
  transition: none;
}
.mdc-checkbox--anim-checked-indeterminate .mdc-checkbox__mixedmark {
  animation: mdc-checkbox-checked-indeterminate-mixedmark 90ms linear;
  transition: none;
}

.mdc-checkbox--anim-indeterminate-checked .mdc-checkbox__checkmark {
  animation: mdc-checkbox-indeterminate-checked-checkmark 500ms linear;
  transition: none;
}
.mdc-checkbox--anim-indeterminate-checked .mdc-checkbox__mixedmark {
  animation: mdc-checkbox-indeterminate-checked-mixedmark 500ms linear;
  transition: none;
}

.mdc-checkbox--anim-indeterminate-unchecked .mdc-checkbox__mixedmark {
  animation: mdc-checkbox-indeterminate-unchecked-mixedmark 300ms linear;
  transition: none;
}

.mdc-checkbox__native-control:checked ~ .mdc-checkbox__background,
.mdc-checkbox__native-control:indeterminate ~ .mdc-checkbox__background {
  transition: border-color 90ms cubic-bezier(0, 0, 0.2, 1), background-color 90ms cubic-bezier(0, 0, 0.2, 1);
}
.mdc-checkbox__native-control:checked ~ .mdc-checkbox__background > .mdc-checkbox__checkmark > .mdc-checkbox__checkmark-path,
.mdc-checkbox__native-control:indeterminate ~ .mdc-checkbox__background > .mdc-checkbox__checkmark > .mdc-checkbox__checkmark-path {
  stroke-dashoffset: 0;
}

.mdc-checkbox__native-control:checked ~ .mdc-checkbox__background > .mdc-checkbox__checkmark {
  transition: opacity 180ms cubic-bezier(0, 0, 0.2, 1), transform 180ms cubic-bezier(0, 0, 0.2, 1);
  opacity: 1;
}
.mdc-checkbox__native-control:checked ~ .mdc-checkbox__background > .mdc-checkbox__mixedmark {
  transform: scaleX(1) rotate(-45deg);
}

.mdc-checkbox__native-control:indeterminate ~ .mdc-checkbox__background > .mdc-checkbox__checkmark {
  transform: rotate(45deg);
  opacity: 0;
  transition: opacity 90ms cubic-bezier(0.4, 0, 0.6, 1), transform 90ms cubic-bezier(0.4, 0, 0.6, 1);
}
.mdc-checkbox__native-control:indeterminate ~ .mdc-checkbox__background > .mdc-checkbox__mixedmark {
  transform: scaleX(1) rotate(0deg);
  opacity: 1;
}

@keyframes mdc-checkbox-unchecked-checked-checkmark-path {
  0%, 50% {
    stroke-dashoffset: 29.7833385;
  }
  50% {
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
  100% {
    stroke-dashoffset: 0;
  }
}
@keyframes mdc-checkbox-unchecked-indeterminate-mixedmark {
  0%, 68.2% {
    transform: scaleX(0);
  }
  68.2% {
    animation-timing-function: cubic-bezier(0, 0, 0, 1);
  }
  100% {
    transform: scaleX(1);
  }
}
@keyframes mdc-checkbox-checked-unchecked-checkmark-path {
  from {
    animation-timing-function: cubic-bezier(0.4, 0, 1, 1);
    opacity: 1;
    stroke-dashoffset: 0;
  }
  to {
    opacity: 0;
    stroke-dashoffset: -29.7833385;
  }
}
@keyframes mdc-checkbox-checked-indeterminate-checkmark {
  from {
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    transform: rotate(0deg);
    opacity: 1;
  }
  to {
    transform: rotate(45deg);
    opacity: 0;
  }
}
@keyframes mdc-checkbox-indeterminate-checked-checkmark {
  from {
    animation-timing-function: cubic-bezier(0.14, 0, 0, 1);
    transform: rotate(45deg);
    opacity: 0;
  }
  to {
    transform: rotate(360deg);
    opacity: 1;
  }
}
@keyframes mdc-checkbox-checked-indeterminate-mixedmark {
  from {
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    transform: rotate(-45deg);
    opacity: 0;
  }
  to {
    transform: rotate(0deg);
    opacity: 1;
  }
}
@keyframes mdc-checkbox-indeterminate-checked-mixedmark {
  from {
    animation-timing-function: cubic-bezier(0.14, 0, 0, 1);
    transform: rotate(0deg);
    opacity: 1;
  }
  to {
    transform: rotate(315deg);
    opacity: 0;
  }
}
@keyframes mdc-checkbox-indeterminate-unchecked-mixedmark {
  0% {
    animation-timing-function: linear;
    transform: scaleX(1);
    opacity: 1;
  }
  32.8%, 100% {
    transform: scaleX(0);
    opacity: 0;
  }
}
.mat-mdc-checkbox {
  display: inline-block;
  position: relative;
  -webkit-tap-highlight-color: transparent;
}
.mat-mdc-checkbox._mat-animation-noopable > .mat-internal-form-field > .mdc-checkbox > .mat-mdc-checkbox-touch-target,
.mat-mdc-checkbox._mat-animation-noopable > .mat-internal-form-field > .mdc-checkbox > .mdc-checkbox__native-control,
.mat-mdc-checkbox._mat-animation-noopable > .mat-internal-form-field > .mdc-checkbox > .mdc-checkbox__ripple,
.mat-mdc-checkbox._mat-animation-noopable > .mat-internal-form-field > .mdc-checkbox > .mat-mdc-checkbox-ripple::before,
.mat-mdc-checkbox._mat-animation-noopable > .mat-internal-form-field > .mdc-checkbox > .mdc-checkbox__background,
.mat-mdc-checkbox._mat-animation-noopable > .mat-internal-form-field > .mdc-checkbox > .mdc-checkbox__background > .mdc-checkbox__checkmark,
.mat-mdc-checkbox._mat-animation-noopable > .mat-internal-form-field > .mdc-checkbox > .mdc-checkbox__background > .mdc-checkbox__checkmark > .mdc-checkbox__checkmark-path,
.mat-mdc-checkbox._mat-animation-noopable > .mat-internal-form-field > .mdc-checkbox > .mdc-checkbox__background > .mdc-checkbox__mixedmark {
  transition: none !important;
  animation: none !important;
}
.mat-mdc-checkbox label {
  cursor: pointer;
}
.mat-mdc-checkbox .mat-internal-form-field {
  color: var(--%NS%mat-checkbox-label-text-color, var(--%NS%mat-sys-on-surface));
  font-family: var(--%NS%mat-checkbox-label-text-font, var(--%NS%mat-sys-body-medium-font));
  line-height: var(--%NS%mat-checkbox-label-text-line-height, var(--%NS%mat-sys-body-medium-line-height));
  font-size: var(--%NS%mat-checkbox-label-text-size, var(--%NS%mat-sys-body-medium-size));
  letter-spacing: var(--%NS%mat-checkbox-label-text-tracking, var(--%NS%mat-sys-body-medium-tracking));
  font-weight: var(--%NS%mat-checkbox-label-text-weight, var(--%NS%mat-sys-body-medium-weight));
}
.mat-mdc-checkbox.mat-mdc-checkbox-disabled.mat-mdc-checkbox-disabled-interactive {
  pointer-events: auto;
}
.mat-mdc-checkbox.mat-mdc-checkbox-disabled.mat-mdc-checkbox-disabled-interactive input {
  cursor: default;
}
.mat-mdc-checkbox.mat-mdc-checkbox-disabled label {
  cursor: default;
}
.mat-mdc-checkbox.mat-mdc-checkbox-disabled .mat-internal-form-field-label {
  color: var(--%NS%mat-checkbox-disabled-label-color, color-mix(in srgb, var(--%NS%mat-sys-on-surface) 38%, transparent));
}
@media (forced-colors: active) {
  .mat-mdc-checkbox.mat-mdc-checkbox-disabled .mat-internal-form-field-label {
    color: GrayText;
  }
}
.mat-mdc-checkbox .mat-internal-form-field-label:empty {
  display: none;
}
.mat-mdc-checkbox .mdc-checkbox__ripple {
  opacity: 0;
}

.mat-mdc-checkbox .mat-mdc-checkbox-ripple,
.mdc-checkbox__ripple {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
}
.mat-mdc-checkbox .mat-mdc-checkbox-ripple:not(:empty),
.mdc-checkbox__ripple:not(:empty) {
  transform: translateZ(0);
}

.mat-mdc-checkbox-ripple .mat-ripple-element {
  opacity: 0.1;
}

.mat-mdc-checkbox-touch-target {
  position: absolute;
  top: 50%;
  left: 50%;
  height: var(--%NS%mat-checkbox-touch-target-size, 48px);
  width: var(--%NS%mat-checkbox-touch-target-size, 48px);
  transform: translate(-50%, -50%);
  display: var(--%NS%mat-checkbox-touch-target-display, block);
}

.mat-mdc-checkbox .mat-mdc-checkbox-ripple::before {
  border-radius: 50%;
}

.mdc-checkbox__native-control:focus-visible ~ .mat-focus-indicator::before {
  content: "";
}
`],encapsulation:2})})()}return n})();var kn=(()=>{class n{static ɵfac=function(t){return new(t||n)};static ɵmod=fE({type:n});static ɵinj=Kl({imports:[Ye,Tt]})}return n})();var Vn=new A(`MAT_PROGRESS_BAR_DEFAULT_OPTIONS`);var xn=(()=>{class n{_elementRef=w(wr);_ngZone=w(_e);_changeDetectorRef=w(zF);_renderer=w(Ba);_cleanupTransitionEnd;constructor(){let e=fp(),t=w(Vn,{optional:!0});this._isNoopAnimation=e===`di-disabled`,e===`reduced-motion`&&this._elementRef.nativeElement.classList.add(`mat-progress-bar-reduced-motion`),t&&(t.color&&(this.color=this._defaultColor=t.color),this.mode=t.mode||this.mode)}_isNoopAnimation;get color(){return this._color||this._defaultColor}set color(e){this._color=e}_color;_defaultColor=`primary`;get value(){return this._value}set value(e){this._value=vn(e||0),this._changeDetectorRef.markForCheck()}_value=0;get bufferValue(){return this._bufferValue||0}set bufferValue(e){this._bufferValue=vn(e||0),this._changeDetectorRef.markForCheck()}_bufferValue=0;animationEnd=new je;get mode(){return this._mode}set mode(e){this._mode=e,this._changeDetectorRef.markForCheck()}_mode=`determinate`;ngAfterViewInit(){this._ngZone.runOutsideAngular(()=>{this._cleanupTransitionEnd=this._renderer.listen(this._elementRef.nativeElement,`transitionend`,this._transitionendHandler)})}ngOnDestroy(){this._cleanupTransitionEnd?.()}_getPrimaryBarTransform(){return`scaleX(${this._isIndeterminate()?1:this.value/100})`}_getBufferBarFlexBasis(){return`${this.mode===`buffer`?this.bufferValue:100}%`}_isIndeterminate(){return this.mode===`indeterminate`||this.mode===`query`}_transitionendHandler=e=>{this.animationEnd.observers.length===0||!e.target||!e.target.classList.contains(`mdc-linear-progress__primary-bar`)||(this.mode===`determinate`||this.mode===`buffer`)&&this._ngZone.run(()=>this.animationEnd.next({value:this.value}))};static ɵfac=function(t){return new(t||n)};static ɵcmp=(function(){function e(t,a){t&1&&Hp(0,`div`,2)}return uE({type:n,selectors:[[`mat-progress-bar`]],hostAttrs:[`role`,`progressbar`,`aria-valuemin`,`0`,`aria-valuemax`,`100`,`tabindex`,`-1`,1,`mat-mdc-progress-bar`,`mdc-linear-progress`],hostVars:10,hostBindings:function(a,o){a&2&&(Fp(`aria-valuenow`,o._isIndeterminate()?null:o.value)(`mode`,o.mode),gD(`mat-`+o.color),th(`_mat-animation-noopable`,o._isNoopAnimation)(`mdc-linear-progress--animation-ready`,!o._isNoopAnimation)(`mdc-linear-progress--indeterminate`,o._isIndeterminate()))},inputs:{color:`color`,value:[2,`value`,`value`,YF],bufferValue:[2,`bufferValue`,`bufferValue`,YF],mode:`mode`},outputs:{animationEnd:`animationEnd`},exportAs:[`matProgressBar`],decls:7,vars:5,consts:[[`aria-hidden`,`true`,1,`mdc-linear-progress__buffer`],[1,`mdc-linear-progress__buffer-bar`],[1,`mdc-linear-progress__buffer-dots`],[`aria-hidden`,`true`,1,`mdc-linear-progress__bar`,`mdc-linear-progress__primary-bar`],[1,`mdc-linear-progress__bar-inner`],[`aria-hidden`,`true`,1,`mdc-linear-progress__bar`,`mdc-linear-progress__secondary-bar`]],template:function(a,o){a&1&&(Vc(0,`div`,0),Hp(1,`div`,1),RE(2,e,1,0,`div`,2),Hc(),Vc(3,`div`,3),Hp(4,`span`,4),Hc(),Vc(5,`div`,5),Hp(6,`span`,4),Hc()),a&2&&(Ov(),eh(`flex-basis`,o._getBufferBarFlexBasis()),Ov(),kE(o.mode===`buffer`?2:-1),Ov(),eh(`transform`,o._getPrimaryBarTransform()))},styles:[`.mat-mdc-progress-bar {
  --%NS%mat-progress-bar-animation-multiplier: 1;
  display: block;
  text-align: start;
}
.mat-mdc-progress-bar[mode=query] {
  transform: scaleX(-1);
}
.mat-mdc-progress-bar._mat-animation-noopable .mdc-linear-progress__buffer-dots,
.mat-mdc-progress-bar._mat-animation-noopable .mdc-linear-progress__primary-bar,
.mat-mdc-progress-bar._mat-animation-noopable .mdc-linear-progress__secondary-bar,
.mat-mdc-progress-bar._mat-animation-noopable .mdc-linear-progress__bar-inner.mdc-linear-progress__bar-inner {
  animation: none;
}
.mat-mdc-progress-bar._mat-animation-noopable .mdc-linear-progress__primary-bar,
.mat-mdc-progress-bar._mat-animation-noopable .mdc-linear-progress__buffer-bar {
  transition: transform 1ms;
}

.mat-progress-bar-reduced-motion {
  --%NS%mat-progress-bar-animation-multiplier: 2;
}

.mdc-linear-progress {
  position: relative;
  width: 100%;
  transform: translateZ(0);
  outline: 1px solid transparent;
  overflow-x: hidden;
  transition: opacity 250ms 0ms cubic-bezier(0.4, 0, 0.6, 1);
  height: max(var(--%NS%mat-progress-bar-track-height, 4px), var(--%NS%mat-progress-bar-active-indicator-height, 4px));
}
@media (forced-colors: active) {
  .mdc-linear-progress {
    outline-color: CanvasText;
  }
}

.mdc-linear-progress__bar {
  position: absolute;
  top: 0;
  bottom: 0;
  margin: auto 0;
  width: 100%;
  animation: none;
  transform-origin: top left;
  transition: transform 250ms 0ms cubic-bezier(0.4, 0, 0.6, 1);
  height: var(--%NS%mat-progress-bar-active-indicator-height, 4px);
}
.mdc-linear-progress--indeterminate .mdc-linear-progress__bar {
  transition: none;
}
[dir=rtl] .mdc-linear-progress__bar {
  right: 0;
  transform-origin: center right;
}

.mdc-linear-progress__bar-inner {
  display: inline-block;
  position: absolute;
  width: 100%;
  animation: none;
  border-top-style: solid;
  border-color: var(--%NS%mat-progress-bar-active-indicator-color, var(--%NS%mat-sys-primary));
  border-top-width: var(--%NS%mat-progress-bar-active-indicator-height, 4px);
}

.mdc-linear-progress__buffer {
  display: flex;
  position: absolute;
  top: 0;
  bottom: 0;
  margin: auto 0;
  width: 100%;
  overflow: hidden;
  height: var(--%NS%mat-progress-bar-track-height, 4px);
  border-radius: var(--%NS%mat-progress-bar-track-shape, var(--%NS%mat-sys-corner-none));
}

.mdc-linear-progress__buffer-dots {
  background-image: radial-gradient(circle, var(--%NS%mat-progress-bar-track-color, var(--%NS%mat-sys-surface-variant)) calc(var(--%NS%mat-progress-bar-track-height, 4px) / 2), transparent 0);
  background-repeat: repeat-x;
  background-size: calc(calc(var(--%NS%mat-progress-bar-track-height, 4px) / 2) * 5);
  background-position: left;
  flex: auto;
  transform: rotate(180deg);
  animation: mdc-linear-progress-buffering calc(250ms * var(--%NS%mat-progress-bar-animation-multiplier)) infinite linear;
}
@media (forced-colors: active) {
  .mdc-linear-progress__buffer-dots {
    background-color: ButtonBorder;
  }
}
[dir=rtl] .mdc-linear-progress__buffer-dots {
  animation: mdc-linear-progress-buffering-reverse calc(250ms * var(--%NS%mat-progress-bar-animation-multiplier)) infinite linear;
  transform: rotate(0);
}

.mdc-linear-progress__buffer-bar {
  flex: 0 1 100%;
  transition: flex-basis 250ms 0ms cubic-bezier(0.4, 0, 0.6, 1);
  background-color: var(--%NS%mat-progress-bar-track-color, var(--%NS%mat-sys-surface-variant));
}

.mdc-linear-progress__primary-bar {
  transform: scaleX(0);
}
.mdc-linear-progress--indeterminate .mdc-linear-progress__primary-bar {
  left: -145.166611%;
}
.mdc-linear-progress--indeterminate.mdc-linear-progress--animation-ready .mdc-linear-progress__primary-bar {
  animation: mdc-linear-progress-primary-indeterminate-translate calc(2s * var(--%NS%mat-progress-bar-animation-multiplier)) infinite linear;
}
.mdc-linear-progress--indeterminate.mdc-linear-progress--animation-ready .mdc-linear-progress__primary-bar > .mdc-linear-progress__bar-inner {
  animation: mdc-linear-progress-primary-indeterminate-scale calc(2s * var(--%NS%mat-progress-bar-animation-multiplier)) infinite linear;
}
[dir=rtl] .mdc-linear-progress.mdc-linear-progress--animation-ready .mdc-linear-progress__primary-bar {
  animation-name: mdc-linear-progress-primary-indeterminate-translate-reverse;
}
[dir=rtl] .mdc-linear-progress.mdc-linear-progress--indeterminate .mdc-linear-progress__primary-bar {
  right: -145.166611%;
  left: auto;
}

.mdc-linear-progress__secondary-bar {
  display: none;
}
.mdc-linear-progress--indeterminate .mdc-linear-progress__secondary-bar {
  left: -54.888891%;
  display: block;
}
.mdc-linear-progress--indeterminate.mdc-linear-progress--animation-ready .mdc-linear-progress__secondary-bar {
  animation: mdc-linear-progress-secondary-indeterminate-translate calc(2s * var(--%NS%mat-progress-bar-animation-multiplier)) infinite linear;
}
.mdc-linear-progress--indeterminate.mdc-linear-progress--animation-ready .mdc-linear-progress__secondary-bar > .mdc-linear-progress__bar-inner {
  animation: mdc-linear-progress-secondary-indeterminate-scale calc(2s * var(--%NS%mat-progress-bar-animation-multiplier)) infinite linear;
}
[dir=rtl] .mdc-linear-progress.mdc-linear-progress--animation-ready .mdc-linear-progress__secondary-bar {
  animation-name: mdc-linear-progress-secondary-indeterminate-translate-reverse;
}
[dir=rtl] .mdc-linear-progress.mdc-linear-progress--indeterminate .mdc-linear-progress__secondary-bar {
  right: -54.888891%;
  left: auto;
}

@keyframes mdc-linear-progress-buffering {
  from {
    transform: rotate(180deg) translateX(calc(var(--%NS%mat-progress-bar-track-height, 4px) * -2.5));
  }
}
@keyframes mdc-linear-progress-primary-indeterminate-translate {
  0% {
    transform: translateX(0);
  }
  20% {
    animation-timing-function: cubic-bezier(0.5, 0, 0.701732, 0.495819);
    transform: translateX(0);
  }
  59.15% {
    animation-timing-function: cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);
    transform: translateX(83.67142%);
  }
  100% {
    transform: translateX(200.611057%);
  }
}
@keyframes mdc-linear-progress-primary-indeterminate-scale {
  0% {
    transform: scaleX(0.08);
  }
  36.65% {
    animation-timing-function: cubic-bezier(0.334731, 0.12482, 0.785844, 1);
    transform: scaleX(0.08);
  }
  69.15% {
    animation-timing-function: cubic-bezier(0.06, 0.11, 0.6, 1);
    transform: scaleX(0.661479);
  }
  100% {
    transform: scaleX(0.08);
  }
}
@keyframes mdc-linear-progress-secondary-indeterminate-translate {
  0% {
    animation-timing-function: cubic-bezier(0.15, 0, 0.515058, 0.409685);
    transform: translateX(0);
  }
  25% {
    animation-timing-function: cubic-bezier(0.31033, 0.284058, 0.8, 0.733712);
    transform: translateX(37.651913%);
  }
  48.35% {
    animation-timing-function: cubic-bezier(0.4, 0.627035, 0.6, 0.902026);
    transform: translateX(84.386165%);
  }
  100% {
    transform: translateX(160.277782%);
  }
}
@keyframes mdc-linear-progress-secondary-indeterminate-scale {
  0% {
    animation-timing-function: cubic-bezier(0.205028, 0.057051, 0.57661, 0.453971);
    transform: scaleX(0.08);
  }
  19.15% {
    animation-timing-function: cubic-bezier(0.152313, 0.196432, 0.648374, 1.004315);
    transform: scaleX(0.457104);
  }
  44.15% {
    animation-timing-function: cubic-bezier(0.257759, -0.003163, 0.211762, 1.38179);
    transform: scaleX(0.72796);
  }
  100% {
    transform: scaleX(0.08);
  }
}
@keyframes mdc-linear-progress-primary-indeterminate-translate-reverse {
  0% {
    transform: translateX(0);
  }
  20% {
    animation-timing-function: cubic-bezier(0.5, 0, 0.701732, 0.495819);
    transform: translateX(0);
  }
  59.15% {
    animation-timing-function: cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);
    transform: translateX(-83.67142%);
  }
  100% {
    transform: translateX(-200.611057%);
  }
}
@keyframes mdc-linear-progress-secondary-indeterminate-translate-reverse {
  0% {
    animation-timing-function: cubic-bezier(0.15, 0, 0.515058, 0.409685);
    transform: translateX(0);
  }
  25% {
    animation-timing-function: cubic-bezier(0.31033, 0.284058, 0.8, 0.733712);
    transform: translateX(-37.651913%);
  }
  48.35% {
    animation-timing-function: cubic-bezier(0.4, 0.627035, 0.6, 0.902026);
    transform: translateX(-84.386165%);
  }
  100% {
    transform: translateX(-160.277782%);
  }
}
@keyframes mdc-linear-progress-buffering-reverse {
  from {
    transform: translateX(-10px);
  }
}
`],encapsulation:2})})()}return n})();function vn(n,s=0,e=100){return Math.max(s,Math.min(e,n))}var yn=(()=>{class n{static ɵfac=function(t){return new(t||n)};static ɵmod=fE({type:n});static ɵinj=Kl({imports:[Tt]})}return n})();var De=class n{http=w(Xr);baseUrl=`${Sn.apiUrl}/job-seekers`;getActiveCount(){return this.http.get(`${this.baseUrl}/active-count`)}register(s){return this.http.post(`${this.baseUrl}/register`,s)}updateStatus(s){return this.http.put(`${this.baseUrl}/status`,s)}static ɵfac=function(e){return new(e||n)};static ɵprov=ae({token:n,factory:n.ɵfac,providedIn:`root`})};var Ae=class n{options=[{id:`1-3-years`,label:`1-3 years`},{id:`2-5-years`,label:`2-5 years`},{id:`4-8-years`,label:`4-8 years`},{id:`5-8-years`,label:`5-8 years`}];getExperienceRanges(){return Gh([...this.options])}setExperienceRanges(s){this.options=[...s]}static ɵfac=function(e){return new(e||n)};static ɵprov=ae({token:n,factory:n.ɵfac,providedIn:`root`})};var et=(n,s)=>s.id;function Xn(n,s){if(n&1&&(_D(0),VD(1,`number`)),n&2){let e=YE();Uc(` `,BD(1,1,e.activeCountData().count),` `)}}function qn(n,s){n&1&&(Ii(0,`span`),_D(1,`--`),jc())}function Gn(n,s){if(n&1){let e=UE();Ii(0,`div`,14)(1,`mat-icon`,31),_D(2,`check_circle`),jc(),Ii(3,`div`,32)(4,`h3`),_D(5,`Registration submitted successfully.`),jc(),Ii(6,`p`,33),_D(7,`Your voluntary submission has been recorded according to JobPulse's platform registration policy.`),jc(),Ii(8,`p`),_D(9,`Status: `),Ii(10,`strong`),_D(11),jc(),_D(12),VD(13,`date`),jc(),Ii(14,`p`,34),_D(15,`Thank you for contributing to open, transparent tech hiring intelligence in India.`),jc()(),Ii(16,`button`,35),qp(`click`,function(){bu(e);let a=YE();return Cu(a.resetRegistrationForm())}),_D(17,` Register Another `),jc()()}if(n&2){let e=YE();Ov(11),ah(e.registrationResult()?.status),Ov(),Uc(` • Recorded At: `,$D(13,2,e.registrationResult()?.registeredAtUtc,`medium`))}}function $n(n,s){n&1&&Vp(0,`mat-progress-bar`,20)}function Wn(n,s){if(n&1&&(Ii(0,`div`,21)(1,`mat-icon`),_D(2,`error_outline`),jc(),Ii(3,`span`),_D(4),jc()()),n&2){let e=YE(2);Ov(4),ah(e.submitError())}}function Un(n,s){if(n&1&&(Ii(0,`mat-option`,37),_D(1),jc()),n&2){let e=s.$implicit;jp(`value`,e.id),Ov(),ch(` `,e.city,``,e.state?`, `+e.state:``,` `)}}function Jn(n,s){n&1&&(Ii(0,`mat-error`),_D(1,`Preferred location is required`),jc())}function Qn(n,s){if(n&1&&(Ii(0,`mat-option`,37),_D(1),jc()),n&2){let e=s.$implicit;jp(`value`,e.id),Ov(),ah(e.label)}}function Zn(n,s){n&1&&(Ii(0,`mat-error`),_D(1,`Experience range is required`),jc())}function Kn(n,s){if(n&1&&(Ii(0,`mat-option`,37),_D(1),jc()),n&2){let e=s.$implicit;jp(`value`,e.id),Ov(),ah(e.name)}}function Yn(n,s){n&1&&(Ii(0,`mat-error`),_D(1,`Select at least 1 technology`),jc())}function ea(n,s){n&1&&(Ii(0,`div`,48),_D(1,`Explicit consent is required to register.`),jc())}function ta(n,s){if(n&1){let e=UE();Ii(0,`form`,19),qp(`ngSubmit`,function(){bu(e);let a=YE();return Cu(a.submitRegistration())}),RE(1,$n,1,0,`mat-progress-bar`,20),RE(2,Wn,5,1,`div`,21),Ii(3,`div`,22)(4,`mat-form-field`,23)(5,`mat-label`),_D(6,`Primary Preferred Hub (City)`),jc(),Ii(7,`mat-select`,36),EI(),PE(8,Un,2,3,`mat-option`,37,et),jc(),RE(10,Jn,2,0,`mat-error`),jc(),Ii(11,`mat-form-field`,23)(12,`mat-label`),_D(13,`Experience Range`),jc(),Ii(14,`mat-select`,38),EI(),PE(15,Qn,2,2,`mat-option`,37,et),jc(),RE(17,Zn,2,0,`mat-error`),jc()(),Ii(18,`div`,39)(19,`mat-form-field`,40)(20,`mat-label`),_D(21,`Primary Technologies / Core Skills`),jc(),Ii(22,`mat-select`,41),EI(),PE(23,Kn,2,2,`mat-option`,37,et),jc(),RE(25,Yn,2,0,`mat-error`),jc()(),Ii(26,`div`,22)(27,`mat-form-field`,23)(28,`mat-label`),_D(29,`Current Search Status`),jc(),Ii(30,`mat-select`,42),EI(),Ii(31,`mat-option`,26),_D(32,`Open to Work (Actively Seeking)`),jc(),Ii(33,`mat-option`,27),_D(34,`Not Looking (Currently Content)`),jc(),Ii(35,`mat-option`,28),_D(36,`Recently Hired`),jc()()(),Ii(37,`mat-form-field`,23)(38,`mat-label`),_D(39,`Job Search Start Date (Optional)`),jc(),Ii(40,`input`,43),EI(),jc()()(),Ii(41,`div`,22)(42,`mat-form-field`,23)(43,`mat-label`),_D(44,`Min Annual Target (₹ CTC, Optional)`),jc(),Ii(45,`input`,44),EI(),jc()(),Ii(46,`mat-form-field`,23)(47,`mat-label`),_D(48,`Max Annual Target (₹ CTC, Optional)`),jc(),Ii(49,`input`,45),EI(),jc()()(),Ii(50,`div`,46)(51,`mat-checkbox`,47),EI(),Ii(52,`span`),_D(53,`I voluntarily submit this anonymous profile to contribute to JobPulse India job market intelligence analytics.`),jc()(),RE(54,ea,2,0,`div`,48),jc(),Ii(55,`div`,29)(56,`button`,30)(57,`mat-icon`),_D(58,`check`),jc(),Ii(59,`span`),_D(60,`Submit Voluntary Registration`),jc()()()()}if(n&2){let e=YE();jp(`formGroup`,e.registerForm),Ov(),kE(e.isSubmitting()?1:-1),Ov(),kE(e.submitError()?2:-1),Ov(5),wI(),Ov(),FE(e.locations()),Ov(2),kE(e.registerForm.get(`locationId`)?.hasError(`required`)&&e.registerForm.get(`locationId`)?.touched?10:-1),Ov(4),wI(),Ov(),FE(e.experienceTiers()),Ov(2),kE(e.registerForm.get(`experienceRangeId`)?.hasError(`required`)&&e.registerForm.get(`experienceRangeId`)?.touched?17:-1),Ov(5),wI(),Ov(),FE(e.technologies()),Ov(2),kE(e.registerForm.get(`technologyIds`)?.hasError(`required`)&&e.registerForm.get(`technologyIds`)?.touched?25:-1),Ov(5),wI(),Ov(10),wI(),Ov(5),wI(),Ov(4),wI(),Ov(2),wI(),Ov(3),kE(e.registerForm.get(`consent`)?.hasError(`required`)&&e.registerForm.get(`consent`)?.touched?54:-1),Ov(2),jp(`disabled`,e.registerForm.invalid||e.isSubmitting())}}function na(n,s){if(n&1&&(Ii(0,`div`,14)(1,`mat-icon`,31),_D(2,`verified`),jc(),Ii(3,`div`,32)(4,`h3`),_D(5,`Status Updated Successfully!`),jc(),Ii(6,`p`),_D(7,`New Status: `),Ii(8,`strong`),_D(9),jc(),_D(10),VD(11,`date`),jc()()()),n&2){let e=YE();Ov(9),ah(e.statusUpdateResult()?.status),Ov(),Uc(` • Confirmed: `,$D(11,2,e.statusUpdateResult()?.lastConfirmedAt,`medium`))}}function aa(n,s){n&1&&Vp(0,`mat-progress-bar`,20)}function ia(n,s){if(n&1&&(Ii(0,`div`,21)(1,`mat-icon`),_D(2,`error_outline`),jc(),Ii(3,`span`),_D(4),jc()()),n&2){let e=YE();Ov(4),ah(e.statusError())}}function ra(n,s){n&1&&(Ii(0,`mat-error`),_D(1,`Job seeker identifier is required`),jc())}function oa(n,s){n&1&&(Ii(0,`mat-error`),_D(1,`Please enter a valid GUID (e.g. 3fa85f64-5717-4562-b3fc-2c963f66afa6)`),jc())}var Cn=class n{seekerService=w(De);techService=w(dt);locService=w(mt);expService=w(Ae);fb=w(Mn$1);experienceTiers=$o([]);technologies=$o([]);locations=$o([]);activeCountData=$o(null);isSubmitting=$o(!1);registrationSuccess=$o(!1);registrationResult=$o(null);submitError=$o(null);isUpdatingStatus=$o(!1);statusUpdateSuccess=$o(!1);statusUpdateResult=$o(null);statusError=$o(null);registerForm=this.fb.group({locationId:[``,de.required],experienceRangeId:[``,de.required],technologyIds:[[],[de.required]],jobSearchStatus:[`OpenToWork`,de.required],jobSearchStartDate:[``],salaryMin:[null],salaryMax:[null],consent:[!1,de.requiredTrue]});statusForm=this.fb.group({jobSeekerId:[``,[de.required,de.pattern(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/)]],status:[`OpenToWork`,de.required]});ngOnInit(){this.loadMetadata(),this.loadActiveCount()}loadMetadata(){this.expService.getExperienceRanges().subscribe({next:s=>this.experienceTiers.set(s),error:()=>{}}),this.techService.getTechnologies().subscribe({next:s=>this.technologies.set(s),error:()=>{}}),this.locService.getLocations().subscribe({next:s=>this.locations.set(s),error:()=>{}})}loadActiveCount(){this.seekerService.getActiveCount().subscribe({next:s=>this.activeCountData.set(s),error:()=>{}})}submitRegistration(){if(this.registerForm.invalid){this.registerForm.markAllAsTouched();return}this.isSubmitting.set(!0),this.submitError.set(null);let s=this.registerForm.value,e={locationId:s.locationId,experienceRangeId:s.experienceRangeId,technologyIds:s.technologyIds,jobSearchStatus:s.jobSearchStatus,jobSearchStartDate:s.jobSearchStartDate||null,salaryMin:s.salaryMin?Number(s.salaryMin):null,salaryMax:s.salaryMax?Number(s.salaryMax):null,consent:!!s.consent};this.seekerService.register(e).subscribe({next:t=>{this.registrationResult.set(t),this.registrationSuccess.set(!0),this.isSubmitting.set(!1),this.loadActiveCount()},error:t=>{let a=`Registration failed. Please check your selections.`;`detail`in t&&t.detail?a=t.detail:`message`in t&&t.message&&(a=t.message),this.submitError.set(a),this.isSubmitting.set(!1)}})}resetRegistrationForm(){this.registerForm.reset({locationId:``,experienceRangeId:``,technologyIds:[],jobSearchStatus:`OpenToWork`,jobSearchStartDate:``,salaryMin:null,salaryMax:null,consent:!1}),this.registrationSuccess.set(!1),this.registrationResult.set(null),this.submitError.set(null)}submitStatusUpdate(){if(this.statusForm.invalid){this.statusForm.markAllAsTouched();return}this.isUpdatingStatus.set(!0),this.statusError.set(null);let s={jobSeekerId:this.statusForm.value.jobSeekerId.trim(),status:this.statusForm.value.status};this.seekerService.updateStatus(s).subscribe({next:e=>{this.statusUpdateResult.set(e),this.statusUpdateSuccess.set(!0),this.isUpdatingStatus.set(!1),this.loadActiveCount()},error:e=>{let t=`Status update failed.`;`detail`in e&&e.detail?t=e.detail:`message`in e&&e.message&&(t=e.message),this.statusError.set(t),this.isUpdatingStatus.set(!1)}})}static ɵfac=function(e){return new(e||n)};static ɵcmp=uE({type:n,selectors:[[`app-job-seekers`]],decls:60,vars:9,consts:[[1,`job-seekers-page`],[`title`,`Voluntary Candidate Portal`,`subtitle`,`Participate anonymously in India tech supply analytics. We collect zero personally identifiable information.`,`badge`,`Privacy-Preserving`],[1,`active-count-banner`],[1,`banner-left`],[1,`stat-circle`],[1,`stat-val`],[1,`stat-label`],[1,`banner-right`],[1,`shield-icon`],[1,`privacy-text`],[1,`portal-card`],[`animationDuration`,`200ms`],[`label`,`Voluntary Registration`],[1,`tab-content`],[`role`,`status`,1,`success-banner`],[1,`form-layout`,3,`formGroup`],[`label`,`Update Candidate Status`],[1,`tab-intro`],[1,`text-muted`],[1,`form-layout`,3,`ngSubmit`,`formGroup`],[`mode`,`indeterminate`,1,`form-progress`],[`role`,`alert`,1,`error-banner`],[1,`form-grid`],[`appearance`,`outline`,1,`form-field`],[`matInput`,``,`formControlName`,`jobSeekerId`,`placeholder`,`e.g. 3fa85f64-5717-4562-b3fc-2c963f66afa6`],[`formControlName`,`status`],[`value`,`OpenToWork`],[`value`,`NotLooking`],[`value`,`Hired`],[1,`form-actions`],[`mat-flat-button`,``,`color`,`primary`,`type`,`submit`,1,`submit-btn`,3,`disabled`],[1,`success-icon`],[1,`success-text`],[1,`policy-note`],[1,`sub-msg`],[`mat-stroked-button`,``,1,`register-again-btn`,3,`click`],[`formControlName`,`locationId`,`placeholder`,`Select your location`],[3,`value`],[`formControlName`,`experienceRangeId`,`placeholder`,`Select experience range`],[1,`full-field`],[`appearance`,`outline`,1,`full-width`],[`formControlName`,`technologyIds`,`multiple`,``,`placeholder`,`Select skills in your stack`],[`formControlName`,`jobSearchStatus`],[`matInput`,``,`type`,`date`,`formControlName`,`jobSearchStartDate`],[`matInput`,``,`type`,`number`,`formControlName`,`salaryMin`,`placeholder`,`e.g. 1200000`],[`matInput`,``,`type`,`number`,`formControlName`,`salaryMax`,`placeholder`,`e.g. 1800000`],[1,`consent-box`],[`formControlName`,`consent`,`color`,`primary`],[1,`consent-error`]],template:function(e,t){e&1&&(Ii(0,`div`,0),Vp(1,`app-page-header`,1),Ii(2,`div`,2)(3,`div`,3)(4,`div`,4)(5,`mat-icon`),_D(6,`people`),jc()(),Ii(7,`div`)(8,`div`,5),RE(9,Xn,2,3)(10,qn,2,0,`span`),jc(),Ii(11,`div`,6),_D(12,`Active Registered Job Seekers`),jc()()(),Ii(13,`div`,7)(14,`mat-icon`,8),_D(15,`privacy_tip`),jc(),Ii(16,`span`,9)(17,`strong`),_D(18,`Voluntary & Anonymous:`),jc(),_D(19,` Represents JobPulse registered candidates only, not the total number of job seekers in India. No resumes, names, or contact numbers are collected. `),jc()()(),Ii(20,`mat-card`,10)(21,`mat-tab-group`,11)(22,`mat-tab`,12)(23,`div`,13),RE(24,Gn,18,5,`div`,14)(25,ta,61,8,`form`,15),jc()(),Ii(26,`mat-tab`,16)(27,`div`,13)(28,`div`,17)(29,`h3`),_D(30,`Refresh or Change Your Status`),jc(),Ii(31,`p`,18),_D(32,` Already registered? Use your existing JobPulse reference ID to update your status. `),jc()(),RE(33,na,12,5,`div`,14),Ii(34,`form`,19),qp(`ngSubmit`,function(){return t.submitStatusUpdate()}),RE(35,aa,1,0,`mat-progress-bar`,20),RE(36,ia,5,1,`div`,21),Ii(37,`div`,22)(38,`mat-form-field`,23)(39,`mat-label`),_D(40,`Job Seeker Identifier (GUID)`),jc(),Ii(41,`input`,24),EI(),jc(),RE(42,ra,2,0,`mat-error`),RE(43,oa,2,0,`mat-error`),jc(),Ii(44,`mat-form-field`,23)(45,`mat-label`),_D(46,`New Search Status`),jc(),Ii(47,`mat-select`,25),EI(),Ii(48,`mat-option`,26),_D(49,`Open to Work`),jc(),Ii(50,`mat-option`,27),_D(51,`Not Looking`),jc(),Ii(52,`mat-option`,28),_D(53,`Hired`),jc()()()(),Ii(54,`div`,29)(55,`button`,30)(56,`mat-icon`),_D(57,`sync`),jc(),Ii(58,`span`),_D(59,`Update Status`),jc()()()()()()()()()),e&2&&(Ov(9),kE(t.activeCountData()?9:10),Ov(15),kE(t.registrationSuccess()?24:25),Ov(9),kE(t.statusUpdateSuccess()?33:-1),Ov(),jp(`formGroup`,t.statusForm),Ov(),kE(t.isUpdatingStatus()?35:-1),Ov(),kE(t.statusError()?36:-1),Ov(5),wI(),Ov(),kE(t.statusForm.get(`jobSeekerId`)?.hasError(`required`)&&t.statusForm.get(`jobSeekerId`)?.touched?42:-1),Ov(),kE(t.statusForm.get(`jobSeekerId`)?.hasError(`pattern`)&&t.statusForm.get(`jobSeekerId`)?.touched?43:-1),Ov(4),wI(),Ov(8),jp(`disabled`,t.statusForm.invalid||t.isUpdatingStatus()))},dependencies:[Vs,Nn$1,bn$1,$e$1,Zt,Vn$1,Dn$1,Wt,Qt,gn,Qe,_n,_$1,I,pt,Ki,Ht,Hi,Pe,Be,jn$1,Wn$1,ne,kn,Ye,y0,v0,Sy,_y,xn$1,yn,xn,v,Qd,Jd],styles:[`.job-seekers-page[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:1.5rem}.active-count-banner[_ngcontent-%COMP%]{display:flex;justify-content:space-between;align-items:center;gap:1.5rem;padding:1.25rem 1.75rem;background:linear-gradient(135deg,var(--%NS%jp-brand-subtle) 0%,var(--%NS%jp-bg-surface) 100%);border:1px solid var(--%NS%jp-border-color);border-radius:var(--%NS%jp-radius-md);box-shadow:var(--%NS%jp-shadow-sm);flex-wrap:wrap}.active-count-banner[_ngcontent-%COMP%]   .banner-left[_ngcontent-%COMP%]{display:flex;align-items:center;gap:1rem}.active-count-banner[_ngcontent-%COMP%]   .banner-left[_ngcontent-%COMP%]   .stat-circle[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:center;width:48px;height:48px;border-radius:50%;background-color:var(--%NS%jp-brand-primary);color:#fff}.active-count-banner[_ngcontent-%COMP%]   .banner-left[_ngcontent-%COMP%]   .stat-circle[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%]{font-size:26px;width:26px;height:26px}.active-count-banner[_ngcontent-%COMP%]   .banner-left[_ngcontent-%COMP%]   .stat-val[_ngcontent-%COMP%]{font-size:1.85rem;font-weight:800;color:var(--%NS%jp-text-primary);line-height:1.1}.active-count-banner[_ngcontent-%COMP%]   .banner-left[_ngcontent-%COMP%]   .stat-label[_ngcontent-%COMP%]{font-size:.8125rem;font-weight:600;color:var(--%NS%jp-brand-text);text-transform:uppercase;letter-spacing:.05em}.active-count-banner[_ngcontent-%COMP%]   .banner-right[_ngcontent-%COMP%]{display:flex;align-items:center;gap:.625rem;max-width:540px;font-size:.8125rem;color:var(--%NS%jp-text-secondary);line-height:1.4}.active-count-banner[_ngcontent-%COMP%]   .banner-right[_ngcontent-%COMP%]   .shield-icon[_ngcontent-%COMP%]{color:var(--%NS%jp-brand-primary);font-size:22px;width:22px;height:22px;flex-shrink:0}.portal-card[_ngcontent-%COMP%]{background-color:var(--%NS%jp-bg-surface);border:1px solid var(--%NS%jp-border-color);border-radius:var(--%NS%jp-radius-md);box-shadow:var(--%NS%jp-shadow-sm);overflow:hidden}.portal-card[_ngcontent-%COMP%]   .tab-content[_ngcontent-%COMP%]{padding:2rem 1.5rem}.portal-card[_ngcontent-%COMP%]   .tab-intro[_ngcontent-%COMP%]{margin-bottom:1.5rem}.portal-card[_ngcontent-%COMP%]   .tab-intro[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]{font-size:1.15rem;font-weight:700;margin:0 0 .35rem;color:var(--%NS%jp-text-primary)}.form-layout[_ngcontent-%COMP%]{position:relative;display:flex;flex-direction:column;gap:1.25rem;max-width:800px}.form-layout[_ngcontent-%COMP%]   .form-progress[_ngcontent-%COMP%]{position:absolute;top:-2rem;left:-1.5rem;right:-1.5rem}.form-layout[_ngcontent-%COMP%]   .form-grid[_ngcontent-%COMP%]{display:grid;grid-template-columns:1fr;gap:1rem}@media(min-width:640px){.form-layout[_ngcontent-%COMP%]   .form-grid[_ngcontent-%COMP%]{grid-template-columns:1fr 1fr}}.form-layout[_ngcontent-%COMP%]   .full-width[_ngcontent-%COMP%]{width:100%}.form-layout[_ngcontent-%COMP%]   .consent-box[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:.25rem;padding:.875rem 1rem;background-color:var(--%NS%jp-bg-subtle);border-radius:var(--%NS%jp-radius-sm);border:1px solid var(--%NS%jp-border-subtle)}.form-layout[_ngcontent-%COMP%]   .consent-box[_ngcontent-%COMP%]   .consent-error[_ngcontent-%COMP%]{font-size:.75rem;color:var(--%NS%jp-danger);padding-left:28px}.form-layout[_ngcontent-%COMP%]   .form-actions[_ngcontent-%COMP%]{display:flex;justify-content:flex-start;padding-top:.5rem}.form-layout[_ngcontent-%COMP%]   .form-actions[_ngcontent-%COMP%]   .submit-btn[_ngcontent-%COMP%]{height:48px;display:inline-flex;align-items:center;gap:.5rem;padding:0 1.5rem;font-weight:600}.success-banner[_ngcontent-%COMP%]{display:flex;align-items:flex-start;gap:1rem;padding:1.5rem;background-color:var(--%NS%jp-success-bg);border-radius:var(--%NS%jp-radius-md);margin-bottom:1.5rem;flex-wrap:wrap}.success-banner[_ngcontent-%COMP%]   .success-icon[_ngcontent-%COMP%]{color:var(--%NS%jp-success);font-size:32px;width:32px;height:32px}.success-banner[_ngcontent-%COMP%]   .success-text[_ngcontent-%COMP%]{flex:1}.success-banner[_ngcontent-%COMP%]   .success-text[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]{margin:0 0 .35rem;color:var(--%NS%jp-text-primary);font-weight:700}.success-banner[_ngcontent-%COMP%]   .success-text[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{margin:0;font-size:.875rem;color:var(--%NS%jp-text-secondary)}.success-banner[_ngcontent-%COMP%]   .success-text[_ngcontent-%COMP%]   .sub-msg[_ngcontent-%COMP%]{margin-top:.5rem;font-size:.8125rem;color:var(--%NS%jp-text-muted)}.error-banner[_ngcontent-%COMP%]{display:flex;align-items:center;gap:.5rem;padding:.75rem 1rem;background-color:var(--%NS%jp-danger-bg);color:var(--%NS%jp-danger);border-radius:var(--%NS%jp-radius-sm);font-size:.84375rem}.error-banner[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%]{font-size:20px;width:20px;height:20px}`]})};export{Cn as JobSeekersComponent};
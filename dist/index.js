"use strict";var C=Object.defineProperty;var ot=Object.getOwnPropertyDescriptor;var ut=Object.getOwnPropertyNames;var ct=Object.prototype.hasOwnProperty;var lt=(n,i)=>{for(var s in i)C(n,s,{get:i[s],enumerable:!0})},mt=(n,i,s,u)=>{if(i&&typeof i=="object"||typeof i=="function")for(let r of ut(i))!ct.call(n,r)&&r!==s&&C(n,r,{get:()=>i[r],enumerable:!(u=ot(i,r))||u.enumerable});return n};var dt=n=>mt(C({},"__esModule",{value:!0}),n);var ht={};lt(ht,{default:()=>ft,makeEvasive:()=>Q});module.exports=dt(ht);var pt=["LMAOOOOOO","BRO THOUGHT HE HAD ME","I'M FAST AS FUCK BOI","L + RATIO + TOO SLOW","UR SO MADDDD","SKILL ISSUE","NICE TRY LIL BRO","I'M CRYINGGG","NOPE","TOO SLOW"];function Q(n,i={}){let s={detectionRadius:i.detectionRadius??140,escapeDistance:i.escapeDistance??280,edgePadding:i.edgePadding??60,taunts:i.taunts??pt,tauntProbability:i.tauntProbability??.75,showShadow:i.showShadow??!0,screenShake:i.screenShake??!0,onEscape:i.onEscape,onCatch:i.onCatch,caughtText:i.caughtText??"Wait... HOW?!",caughtDuration:i.caughtDuration??1100},u=document.createElement("div"),r=document.createElement("div"),f=document.createElement("div"),A=n.innerHTML,vt=n.parentElement,Tt=n.nextSibling;u.className="evasive-wrapper",r.className="evasive-shadow",f.className="evasive-taunt";let h=n.getBoundingClientRect(),v=h.left+h.width/2,T=h.top+h.height/2;n.parentElement?.insertBefore(u,n),u.appendChild(n),u.appendChild(f),document.body.appendChild(r),gt(),u.style.cssText=`
    position: fixed;
    left: ${v}px;
    top: ${T}px;
    transform: translate(-50%, -50%);
    z-index: 9999;
    pointer-events: auto;
  `,r.style.cssText=`
    position: fixed;
    left: ${v}px;
    top: ${T+h.height/2+10}px;
    width: 180px;
    height: 24px;
    background: radial-gradient(ellipse 50% 45%, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.2) 35%, rgba(0,0,0,0.05) 65%, transparent 100%);
    border-radius: 50%;
    transform: translateX(-50%) scale(1);
    pointer-events: none;
    z-index: 9998;
    opacity: 0;
    filter: blur(2px);
  `;let t={currentX:0,currentY:0,velocityX:0,velocityY:0,targetX:0,targetY:0,isReturning:!1,isJumping:!1,isCaught:!1,z:0,zVelocity:0,jumpStartX:0,jumpStartY:0,jumpTargetX:0,jumpTargetY:0,lastJumpTime:0,lastTauntTime:0},m=null,d=null,c=null,y=null,l=[...Array(s.taunts.length).keys()],L=-1;function N(){for(let e=l.length-1;e>0;e--){let a=Math.floor(Math.random()*(e+1));[l[e],l[a]]=[l[a],l[e]]}}N();function Z(){l.length===0&&(l=[...Array(s.taunts.length).keys()],N());let e=l[0];if(e===L&&l.length>1){for(let a=1;a<l.length;a++)if(l[a]!==L){[l[0],l[a]]=[l[a],l[0]],e=l[0];break}}return l.shift(),L=e,s.taunts[e]}function tt(){let e=Date.now();e-t.lastTauntTime>600&&(t.lastTauntTime=e,f.textContent=Z(),f.classList.add("visible"),y&&clearTimeout(y),y=setTimeout(()=>{f.classList.remove("visible")},1200))}function w(e,a,o,p){return Math.sqrt((o-e)**2+(p-a)**2)}function j(e,a,o){return Math.min(Math.max(e,a),o)}function P(){let e=n.getBoundingClientRect();return{x:e.left+e.width/2,y:e.top+e.height/2}}function O(){u.style.left=`${v+t.currentX}px`,u.style.top=`${T+t.currentY}px`}function et(e=0){let o=Math.max(0,Math.min(e/112.890625,1)),p=1-o*.6,g=1-o*.5;r.style.left=`${v+t.currentX}px`,r.style.top=`${T+t.currentY+n.offsetHeight/2+10}px`,r.style.transform=`translateX(-50%) scale(${p})`,r.style.opacity=String(g)}function z(){let e=t.targetX-t.currentX,a=t.targetY-t.currentY;t.velocityX+=e*120/1e3,t.velocityY+=a*120/1e3,t.velocityX*=1-28/100,t.velocityY*=1-28/100,t.currentX+=t.velocityX,t.currentY+=t.velocityY,O();let o=Math.sqrt(t.velocityX**2+t.velocityY**2),p=Math.sqrt(e**2+a**2);if(t.isReturning&&o<.1&&p<.5){t.currentX=t.targetX,t.currentY=t.targetY,t.velocityX=0,t.velocityY=0,t.isReturning=!1,O(),m=null;return}t.isReturning&&(m=requestAnimationFrame(z))}function Y(){t.targetX=0,t.targetY=0,t.isReturning=!0,r.style.transition="opacity 0.15s ease-out",r.style.opacity="0",m||(m=requestAnimationFrame(z))}function k(e){t.lastJumpTime||(t.lastJumpTime=e);let a=Math.min((e-t.lastJumpTime)/1e3,.05);t.lastJumpTime=e,t.zVelocity-=3200*a,t.z+=t.zVelocity*a;let o=t.jumpTargetX-t.currentX,p=t.jumpTargetY-t.currentY,g=Math.sqrt(o*o+p*p),X=g*.18,S=Math.max(X,Math.min(15,g));if(g>1){let R=S/g;t.currentX+=o*R,t.currentY+=p*R}else t.currentX=t.jumpTargetX,t.currentY=t.jumpTargetY;let I=t.z*.15;if(u.style.left=`${v+t.currentX}px`,u.style.top=`${T+t.currentY-I}px`,s.showShadow&&et(t.z),t.z<=0&&t.zVelocity<0){t.z=0,t.zVelocity=0,t.currentX=t.jumpTargetX,t.currentY=t.jumpTargetY,t.targetX=t.jumpTargetX,t.targetY=t.jumpTargetY,O(),s.showShadow&&(r.style.transform="translateX(-50%) scale(1)",r.style.opacity="1",setTimeout(()=>{r.style.transition="opacity 0.25s ease-out",r.style.opacity="0"},200)),s.screenShake&&(u.classList.add("landing"),setTimeout(()=>u.classList.remove("landing"),200)),t.isJumping=!1,t.lastJumpTime=0,d=null,c&&clearTimeout(c),c=setTimeout(()=>Y(),450);return}d=requestAnimationFrame(k)}function nt(e,a){t.jumpStartX=t.currentX,t.jumpStartY=t.currentY,t.jumpTargetX=e,t.jumpTargetY=a,t.z=0,t.zVelocity=850,t.lastJumpTime=0,s.showShadow&&(r.style.transition="",r.style.opacity="1"),d&&cancelAnimationFrame(d),d=requestAnimationFrame(k)}function at(e,a){if(t.isCaught||t.isJumping)return;let o=P();if(w(e,a,o.x,o.y)<s.detectionRadius){t.isReturning=!1,m&&(cancelAnimationFrame(m),m=null),c&&(clearTimeout(c),c=null),t.isJumping=!0;let g=window.innerWidth,X=window.innerHeight,H=n.getBoundingClientRect(),S=g/2-H.width/2-s.edgePadding,I=X*.25,R=-X*.55,b=o.x-e,x=o.y-a,V=Math.sqrt(b*b+x*x)||1;b/=V,x/=V;let rt=[0,.3,-.3,.6,-.6,.9,-.9,1.2,-1.2,Math.PI],G=t.currentX,_=t.currentY,q=0;for(let $ of rt){let B=Math.cos($),U=Math.sin($),st=b*B-x*U,it=b*U+x*B,E=t.currentX+st*s.escapeDistance,M=t.currentY+it*s.escapeDistance;E=j(E,-S,S),M=j(M,R,I);let W=w(t.currentX,t.currentY,E,M);W>q&&(G=E,_=M,q=W)}nt(G,_),s.onEscape?.(),Math.random()<s.tauntProbability&&tt()}}function F(e){at(e.clientX,e.clientY),c&&clearTimeout(c);let a=P();w(e.clientX,e.clientY,a.x,a.y)>s.detectionRadius*2.5&&(c=setTimeout(()=>Y(),400))}function J(){c&&clearTimeout(c),c=setTimeout(()=>Y(),200)}function D(){t.isCaught||(t.isCaught=!0,s.onCatch?.(),d&&(cancelAnimationFrame(d),d=null),m&&(cancelAnimationFrame(m),m=null),c&&(clearTimeout(c),c=null),f.classList.remove("visible"),t.z=0,t.zVelocity=0,t.isJumping=!1,n.innerHTML=s.caughtText,n.classList.add("evasive-caught"),u.classList.add("caught-shake"),setTimeout(()=>{Y(),r.style.transition="opacity 0.15s ease-out",r.style.opacity="0"},600),setTimeout(()=>{n.innerHTML=A,n.classList.remove("evasive-caught"),u.classList.remove("caught-shake"),t.isCaught=!1},s.caughtDuration))}return document.addEventListener("mousemove",F),document.addEventListener("mouseleave",J),n.addEventListener("click",D),function(){document.removeEventListener("mousemove",F),document.removeEventListener("mouseleave",J),n.removeEventListener("click",D),m&&cancelAnimationFrame(m),d&&cancelAnimationFrame(d),c&&clearTimeout(c),y&&clearTimeout(y),r.remove(),u.replaceWith(n),n.innerHTML=A,n.classList.remove("evasive-caught")}}var K=!1;function gt(){if(K)return;K=!0;let n=document.createElement("style");n.textContent=`
    .evasive-wrapper {
      pointer-events: auto;
    }

    .evasive-wrapper.landing {
      animation: evasive-squash 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    .evasive-wrapper.caught-shake {
      animation: evasive-shake 0.5s ease-out;
    }

    .evasive-taunt {
      position: absolute;
      bottom: calc(100% + 16px);
      left: 50%;
      transform: translateX(-50%);
      white-space: nowrap;
      font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Rounded', sans-serif;
      font-size: 15px;
      font-weight: 500;
      color: #000;
      background: #E9E9EB;
      padding: 10px 16px;
      border-radius: 18px;
      border-bottom-right-radius: 4px;
      opacity: 0;
      transition: opacity 0.2s ease;
      pointer-events: none;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 10000;
    }

    .evasive-taunt.visible {
      opacity: 1;
    }

    .evasive-caught {
      background: linear-gradient(180deg, #34d058 0%, #22863a 100%) !important;
    }

    @keyframes evasive-squash {
      0% { transform: translate(-50%, -50%) scale(1, 1); }
      10% { transform: translate(-50%, -50%) scale(1.15, 0.85); }
      30% { transform: translate(-50%, -50%) scale(0.9, 1.1) translateY(-8px); }
      50% { transform: translate(-50%, -50%) scale(1, 1) translateY(-12px); }
      70% { transform: translate(-50%, -50%) scale(0.95, 1.05) translateY(-6px); }
      85% { transform: translate(-50%, -50%) scale(1.1, 0.9); }
      100% { transform: translate(-50%, -50%) scale(1, 1); }
    }

    @keyframes evasive-shake {
      0%, 100% { transform: translate(-50%, -50%) translateX(0) rotate(0); }
      10% { transform: translate(-50%, -50%) translateX(-8px) rotate(-3deg); }
      20% { transform: translate(-50%, -50%) translateX(8px) rotate(3deg); }
      30% { transform: translate(-50%, -50%) translateX(-6px) rotate(-2deg); }
      40% { transform: translate(-50%, -50%) translateX(6px) rotate(2deg); }
      50% { transform: translate(-50%, -50%) translateX(-4px) rotate(-1deg); }
      60% { transform: translate(-50%, -50%) translateX(4px) rotate(1deg); }
      70% { transform: translate(-50%, -50%) translateX(-2px) rotate(0); }
      80% { transform: translate(-50%, -50%) translateX(2px) rotate(0); }
    }
  `,document.head.appendChild(n)}var ft=Q;0&&(module.exports={makeEvasive});

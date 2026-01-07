var st=["LMAOOOOOO","BRO THOUGHT HE HAD ME","I'M FAST AS FUCK BOI","L + RATIO + TOO SLOW","UR SO MADDDD","SKILL ISSUE","NICE TRY LIL BRO","I'M CRYINGGG","NOPE","TOO SLOW"];function it(a,m={}){let i={detectionRadius:m.detectionRadius??140,escapeDistance:m.escapeDistance??280,edgePadding:m.edgePadding??60,taunts:m.taunts??st,tauntProbability:m.tauntProbability??.75,showShadow:m.showShadow??!0,screenShake:m.screenShake??!0,onEscape:m.onEscape,onCatch:m.onCatch,caughtText:m.caughtText??"Wait... HOW?!",caughtDuration:m.caughtDuration??1100},c=document.createElement("div"),r=document.createElement("div"),f=document.createElement("div"),C=a.innerHTML,ut=a.parentElement,ct=a.nextSibling;c.className="evasive-wrapper",r.className="evasive-shadow",f.className="evasive-taunt";let h=a.getBoundingClientRect(),v=h.left+h.width/2,T=h.top+h.height/2;a.parentElement?.insertBefore(c,a),c.appendChild(a),c.appendChild(f),document.body.appendChild(r),ot(),c.style.cssText=`
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
  `;let t={currentX:0,currentY:0,velocityX:0,velocityY:0,targetX:0,targetY:0,isReturning:!1,isJumping:!1,isCaught:!1,z:0,zVelocity:0,jumpStartX:0,jumpStartY:0,jumpTargetX:0,jumpTargetY:0,lastJumpTime:0,lastTauntTime:0},l=null,d=null,o=null,y=null,u=[...Array(i.taunts.length).keys()],L=-1;function A(){for(let e=u.length-1;e>0;e--){let n=Math.floor(Math.random()*(e+1));[u[e],u[n]]=[u[n],u[e]]}}A();function K(){u.length===0&&(u=[...Array(i.taunts.length).keys()],A());let e=u[0];if(e===L&&u.length>1){for(let n=1;n<u.length;n++)if(u[n]!==L){[u[0],u[n]]=[u[n],u[0]],e=u[0];break}}return u.shift(),L=e,i.taunts[e]}function Q(){let e=Date.now();e-t.lastTauntTime>600&&(t.lastTauntTime=e,f.textContent=K(),f.classList.add("visible"),y&&clearTimeout(y),y=setTimeout(()=>{f.classList.remove("visible")},1200))}function w(e,n,s,p){return Math.sqrt((s-e)**2+(p-n)**2)}function N(e,n,s){return Math.min(Math.max(e,n),s)}function j(){let e=a.getBoundingClientRect();return{x:e.left+e.width/2,y:e.top+e.height/2}}function O(){c.style.left=`${v+t.currentX}px`,c.style.top=`${T+t.currentY}px`}function Z(e=0){let s=Math.max(0,Math.min(e/112.890625,1)),p=1-s*.6,g=1-s*.5;r.style.left=`${v+t.currentX}px`,r.style.top=`${T+t.currentY+a.offsetHeight/2+10}px`,r.style.transform=`translateX(-50%) scale(${p})`,r.style.opacity=String(g)}function P(){let e=t.targetX-t.currentX,n=t.targetY-t.currentY;t.velocityX+=e*120/1e3,t.velocityY+=n*120/1e3,t.velocityX*=1-28/100,t.velocityY*=1-28/100,t.currentX+=t.velocityX,t.currentY+=t.velocityY,O();let s=Math.sqrt(t.velocityX**2+t.velocityY**2),p=Math.sqrt(e**2+n**2);if(t.isReturning&&s<.1&&p<.5){t.currentX=t.targetX,t.currentY=t.targetY,t.velocityX=0,t.velocityY=0,t.isReturning=!1,O(),l=null;return}t.isReturning&&(l=requestAnimationFrame(P))}function Y(){t.targetX=0,t.targetY=0,t.isReturning=!0,r.style.transition="opacity 0.15s ease-out",r.style.opacity="0",l||(l=requestAnimationFrame(P))}function z(e){t.lastJumpTime||(t.lastJumpTime=e);let n=Math.min((e-t.lastJumpTime)/1e3,.05);t.lastJumpTime=e,t.zVelocity-=3200*n,t.z+=t.zVelocity*n;let s=t.jumpTargetX-t.currentX,p=t.jumpTargetY-t.currentY,g=Math.sqrt(s*s+p*p),X=g*.18,S=Math.max(X,Math.min(15,g));if(g>1){let R=S/g;t.currentX+=s*R,t.currentY+=p*R}else t.currentX=t.jumpTargetX,t.currentY=t.jumpTargetY;let I=t.z*.15;if(c.style.left=`${v+t.currentX}px`,c.style.top=`${T+t.currentY-I}px`,i.showShadow&&Z(t.z),t.z<=0&&t.zVelocity<0){t.z=0,t.zVelocity=0,t.currentX=t.jumpTargetX,t.currentY=t.jumpTargetY,t.targetX=t.jumpTargetX,t.targetY=t.jumpTargetY,O(),i.showShadow&&(r.style.transform="translateX(-50%) scale(1)",r.style.opacity="1",setTimeout(()=>{r.style.transition="opacity 0.25s ease-out",r.style.opacity="0"},200)),i.screenShake&&(c.classList.add("landing"),setTimeout(()=>c.classList.remove("landing"),200)),t.isJumping=!1,t.lastJumpTime=0,d=null,o&&clearTimeout(o),o=setTimeout(()=>Y(),450);return}d=requestAnimationFrame(z)}function tt(e,n){t.jumpStartX=t.currentX,t.jumpStartY=t.currentY,t.jumpTargetX=e,t.jumpTargetY=n,t.z=0,t.zVelocity=850,t.lastJumpTime=0,i.showShadow&&(r.style.transition="",r.style.opacity="1"),d&&cancelAnimationFrame(d),d=requestAnimationFrame(z)}function et(e,n){if(t.isCaught||t.isJumping)return;let s=j();if(w(e,n,s.x,s.y)<i.detectionRadius){t.isReturning=!1,l&&(cancelAnimationFrame(l),l=null),o&&(clearTimeout(o),o=null),t.isJumping=!0;let g=window.innerWidth,X=window.innerHeight,D=a.getBoundingClientRect(),S=g/2-D.width/2-i.edgePadding,I=X*.25,R=-X*.55,b=s.x-e,x=s.y-n,H=Math.sqrt(b*b+x*x)||1;b/=H,x/=H;let nt=[0,.3,-.3,.6,-.6,.9,-.9,1.2,-1.2,Math.PI],V=t.currentX,G=t.currentY,_=0;for(let q of nt){let $=Math.cos(q),B=Math.sin(q),at=b*$-x*B,rt=b*B+x*$,E=t.currentX+at*i.escapeDistance,M=t.currentY+rt*i.escapeDistance;E=N(E,-S,S),M=N(M,R,I);let U=w(t.currentX,t.currentY,E,M);U>_&&(V=E,G=M,_=U)}tt(V,G),i.onEscape?.(),Math.random()<i.tauntProbability&&Q()}}function k(e){et(e.clientX,e.clientY),o&&clearTimeout(o);let n=j();w(e.clientX,e.clientY,n.x,n.y)>i.detectionRadius*2.5&&(o=setTimeout(()=>Y(),400))}function F(){o&&clearTimeout(o),o=setTimeout(()=>Y(),200)}function J(){t.isCaught||(t.isCaught=!0,i.onCatch?.(),d&&(cancelAnimationFrame(d),d=null),l&&(cancelAnimationFrame(l),l=null),o&&(clearTimeout(o),o=null),f.classList.remove("visible"),t.z=0,t.zVelocity=0,t.isJumping=!1,a.innerHTML=i.caughtText,a.classList.add("evasive-caught"),c.classList.add("caught-shake"),setTimeout(()=>{Y(),r.style.transition="opacity 0.15s ease-out",r.style.opacity="0"},600),setTimeout(()=>{a.innerHTML=C,a.classList.remove("evasive-caught"),c.classList.remove("caught-shake"),t.isCaught=!1},i.caughtDuration))}return document.addEventListener("mousemove",k),document.addEventListener("mouseleave",F),a.addEventListener("click",J),function(){document.removeEventListener("mousemove",k),document.removeEventListener("mouseleave",F),a.removeEventListener("click",J),l&&cancelAnimationFrame(l),d&&cancelAnimationFrame(d),o&&clearTimeout(o),y&&clearTimeout(y),r.remove(),c.replaceWith(a),a.innerHTML=C,a.classList.remove("evasive-caught")}}var W=!1;function ot(){if(W)return;W=!0;let a=document.createElement("style");a.textContent=`
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
  `,document.head.appendChild(a)}var lt=it;export{lt as default,it as makeEvasive};

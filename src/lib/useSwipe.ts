'use client';
import { useRef, type TouchEvent, type MouseEvent } from 'react';
/** Leave vertical scrolling native; suppress link activation after horizontal swipes. */
export function useSwipe(onSwipe:(direction:number)=>void){
 const start=useRef<{x:number;y:number}|null>(null),suppress=useRef(false);
 return {
  onTouchStart:(event:TouchEvent<HTMLElement>)=>{suppress.current=false;if(event.touches.length!==1){start.current=null;return;}const touch=event.touches[0];start.current={x:touch.clientX,y:touch.clientY};},
  onTouchEnd:(event:TouchEvent<HTMLElement>)=>{if(!start.current)return;const touch=event.changedTouches[0],dx=touch.clientX-start.current.x,dy=touch.clientY-start.current.y;start.current=null;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.4){suppress.current=true;onSwipe(dx<0?1:-1);}},
  onTouchCancel:()=>{start.current=null;suppress.current=false;},
  onClickCapture:(event:MouseEvent<HTMLElement>)=>{if(suppress.current){event.preventDefault();event.stopPropagation();suppress.current=false;}}
 };
}

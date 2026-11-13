/** Keep chapter boundaries stable when eased scroll values approach an integer. */
export function getJourneyState(position:number){
 const progress=Number.isFinite(position)?Math.min(6.6,Math.max(0,position)):0;
 const chapter=Math.min(6,Math.floor(progress+.001));
 const fraction=Math.min(1,Math.max(0,progress-chapter));
 const processStep=Math.min(5,Math.floor(fraction/.68*6));
 return {progress,chapter,fraction,processStep};
}

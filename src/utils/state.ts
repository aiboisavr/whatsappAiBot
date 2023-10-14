let stage:{[key:string]:number} = {};

export function incrementStage(userPhoneNumber:string) {
  stage[userPhoneNumber] = stage[userPhoneNumber] ? stage[userPhoneNumber]+1 : 1
}

export function decrementStage(userPhoneNumber:string) {
  stage[userPhoneNumber] = stage[userPhoneNumber] ? stage[userPhoneNumber]-1 : 0
}
  

export function getStage(userPhoneNumber:string) {
  return stage[userPhoneNumber];
}

export function setStage(userPhoneNumber:string) {
  stage[userPhoneNumber]=0;
}
  
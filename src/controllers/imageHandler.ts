import { ParsedQs } from "qs"



export default async function ImageHandler(userId:string | string[] | ParsedQs | ParsedQs[] | undefined,Body:string) {
    
   console.log(userId)
   console.log(Body)

}
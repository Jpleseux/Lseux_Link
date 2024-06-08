/* eslint-disable @typescript-eslint/no-explicit-any */
export default interface httpClient{
    get(url:string, id?:string):Promise<any>;
    post(url:string, data:any, encoded?: boolean):Promise<any>
    delete(url:string, id:string):Promise<any>;
    patch(url:string, data:any, encoded?: boolean):Promise<any>;
}
export default interface httpClient{
    get(url:string, id?:string):Promise<unknown>;
    post(url:string, data:unknown, encoded?: boolean):Promise<unknown>
    delete(url:string, id:string):Promise<unknown>;
    patch(url:string, data:unknown, encoded?: boolean):Promise<unknown>;
}
import httpClient from "../httpClient";
export const mainRoute = "http://localhost:3000/";
export default class fetchAdapter implements httpClient{
    async post(url: string, data: unknown): Promise<unknown> {
        const response = await fetch(mainRoute + url, {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(data)
        });
        return await response.json()
    }
    async get(url: string, id?: string | undefined): Promise<unknown> {
        if(id){
            const response = await fetch(`${url}/${id}`);
            return await response.json()
        }
        else{
            const response =  await fetch(url);
            return await response.json()
        }
    }
    async delete(url: string, id: string): Promise<unknown> {
        const response = await fetch(`${url}/${id}`,{
            method:"DELETE",
            headers:{
                "Content-Type":"application/json"
            }
        });
        return await response.json()
    }
    async patch(url: string, data: unknown, id: string): Promise<unknown> {
        const response = await fetch(`${url}/${id}`, {
            method:"PATCH",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(data)
        });
        return await response.json()
    }
} 
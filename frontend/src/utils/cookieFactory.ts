import * as Cookies from "js-cookie";
export default class CookieFactory {

  public async getCookie(nameCookie: string) {
    const cookie = await Cookies.default.get(nameCookie);
    if (!cookie) {
        return;
    }
    return JSON.parse(cookie);
  }
  public async deleteCookie(nameCookie: string){
    const cookie = await Cookies.default.get(nameCookie);
    if (!cookie) {
        return;
    }
    await Cookies.default.remove(nameCookie);
  }
  public async addCookie(nameCookie: string, data: any) {
    try {
      await Cookies.default.set(nameCookie, JSON.stringify(data));
    } catch (error) {
      console.log(error);
    }
  }
  public async updateCookie(nameCookie: string, data: any) {
    await this.deleteCookie(nameCookie);
    await this.addCookie(nameCookie, data);
  }
}
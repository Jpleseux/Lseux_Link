import { useEffect } from "react";
import CookieFactory from "../../utils/cookieFactory";

function Index() {
    const factory =  new CookieFactory();
    async function getCookie() {
        console.log(await factory.getCookie("user"));
    }
    useEffect(()=> {
        getCookie();
    }, [])
    return (
        <div></div>
    )
}
export default Index;
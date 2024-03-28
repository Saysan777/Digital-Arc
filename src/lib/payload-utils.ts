import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { NextRequest } from "next/server";
import { User } from "../../payload-types";

export const $currentUser = async (cookies: NextRequest['cookies'] | ReadonlyRequestCookies) => {
    const token = cookies.get("payload-token")?.value;

    console.log('token-------------', token)

    const res = await fetch(`${ process.env.NEXT_PUBLIC_SERVER_URL }/api/users/me`, {     // this api is auto created by payload(check payload-readme.md) and the cookie token is verified.
        headers: {
            Authorization: `JWT ${ token }`,
        }
    })

    console.log('res--------', res);

    const { user } = (await res.json()) as { user: User | null }

    return user;
}
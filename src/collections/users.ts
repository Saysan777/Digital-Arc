import { CollectionConfig } from "payload/types";

export const Users: CollectionConfig = {
    slug: "users",
    auth: {
        verify: {
            generateEmailHTML: ({ token })=> {
                return `<h1>Verify Email</h1>
                <p>Click this link to verify your email: <a href="${ process.env.NEXT_PUBLIC_SERVER_URL }/verify-email?token=${ token }">Verify Email</a></p>`
            },
        }
    },
    access: {
        read: () => true,
        create: () => true,
    },  
    fields: [
        {
            name: "role",
            admin: {
                condition: ({ req }) => !!req
            },
            type: "select",
            options: [
                { label: "Admin", value: "admin" },
                { label: "User", value: "user" },
            ]
        },
    ],
}
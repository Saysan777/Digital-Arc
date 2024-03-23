import { CollectionConfig } from "payload/types";

export const Users: CollectionConfig = {
    slug: "users",
    auth: true,
    access: {
        read: () => true,
        create: () => true,
    },  
    fields: [
        {
            name: "role",
            admin: {
                condition: ({ req }) => req.user.role === "admin"
            },
            type: "select",
            options: [
                { label: "Admin", value: "admin" },
                { label: "User", value: "user" },
            ]
        },
        {
            name: "name",
            type: "text",
        },
        {
            name: "email",
            type: "text",
        },
    ],
}
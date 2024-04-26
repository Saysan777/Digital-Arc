import { Access, CollectionConfig } from "payload/types";

const personalOrder: Access = ({ req: { user } }) => {
    if(user.role === 'admin') return true;

    // TODO: Understand the logic behind this.
    return {
        user: {
            equals: user?.id
        }
    }
}

export const Orders: CollectionConfig = {
    slug: 'orders',
    admin: {
        useAsTitle: "Your Orders",
        description: 'A summary of all your order on Digital Arc'
    },
    access: {
        read: personalOrder,            // can only read/see personal/own order.
        create: ({ req })=> req.user.role ==='admin',
        update: ({ req })=> req.user.role ==='admin',
        delete: ({ req })=> req.user.role ==='admin'
    },
    fields: [
        {
            name: '_isPaid',
            type: 'checkbox' ,
            access: {
                read: ({ req }) => req.user.role === 'admin',
                create: () => false,
                update: () => false
            },
            admin: {
                hidden: true
            },
            required: true
        },

        {
            name: 'user',
            type: 'relationship',
            admin: {
                hidden: true
            },
            relationTo: 'users',
            required: true
        },

        {
            name: 'product',
            type: 'relationship',
            relationTo: 'products',
            required: true,
            hasMany: true,      // one order can have multiple products
        }
    ]
}
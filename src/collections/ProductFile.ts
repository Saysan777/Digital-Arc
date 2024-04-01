
import { User } from '../payload-types';
import { Access, CollectionConfig } from "payload/types";
import { BeforeChangeHook } from "payload/dist/collections/config/types";

const addUser: BeforeChangeHook = ({ req, data }) => {
    const user = req.user as User | null

    return { ...data, user: user?.id }
};

const PersonalOrPurchased: Access = async ({ req })=> {
    const user = req.user as User | null
    
    if(user?.role === 'admin') return true;

    if(!user) return false;

    const { docs: products } = await req.payload.find({
        collection: 'products',
        depth: 0,               // similar to project in mongodb, only fetch id
        where: {
            user: {
                equals: user.id
            }
        }
    })

    const personalProductFileIds = products.map((prod)=> prod.product_files).flat();            // personal products that was created

    const { docs: personalOrders } = await req.payload.find({           // products that were bought
        collection: 'orders',
        depth: 2,
        where: {
            id: {
                in: personalProductFileIds
            }
        }
    })

    const purchasedProductFileIds = personalOrders.map((order)=> {
        return order.product.map((product) => {
            if(typeof product === 'string') return req.payload.logger.error('Seach depth not sufficient to find purchased file IDs');
            
            return typeof product.product_files === 'string' ? product.product_files : product.product_files.id;
        })
    }).filter(Boolean).flat();

    return {
        id: {
            in: [...personalProductFileIds, ...purchasedProductFileIds]
        }
    }
}

export const Product_Files: CollectionConfig = {
    slug: 'product_files',
    hooks: {
        beforeChange: [          // accepts arrays of hooks(functions)
            addUser
        ]       
    },
    access: {
        read: PersonalOrPurchased,
        update: ({ req })=> req.user.role ==='admin',
        delete: ({ req })=> req.user.role ==='admin',
    },
    admin: {
        hidden: ({ user }) => user.role !== 'admin'
    },
    upload: {
        staticURL: '/product_files',
        staticDir: 'product_files',
        mimeTypes: [ 'image/*', 'application/postscript', 'font/*' ]
    },
    fields:[
     {
        name:'user',
        type: 'relationship',
        relationTo: 'users',
        admin: {
            condition: ()  => false
        },
        hasMany: false,
        required: true,
    }
    ]
}
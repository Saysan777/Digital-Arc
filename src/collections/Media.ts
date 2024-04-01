import { Access, CollectionConfig } from "payload/types";
import { User } from '../payload-types';

const isAdminOrHasAccessToImages = (): Access => {
    return async ({ req }) => {
        const user = req.user as User | undefined
        if (!user) return false;

        if(user.role === 'admin') return true;

        return {
            user: {
                equals: req.user.id
            }
        }
    }
}

export const Media: CollectionConfig = {
    slug: "media",
    hooks: {
        beforeChange: [             // Similar apporach to beforeInsert hook.
            ({ req, data }) => {
                return { ...data, user: req.user._id };
            }
        ]
    },
    access: {       // adding permission/access to read, update and delete media based on admin or user check.
        read: async ({ req }) => {
            const referer = req.headers.referer;        // if exists then it means it came from frontend and should be visible/readable to everyone.

            if(!req.user || referer?.includes('sell')){     // if is not user or is admin the return true as admin can see anything.
                return true;
            }

            return await isAdminOrHasAccessToImages()({ req });
         },
         update: isAdminOrHasAccessToImages(),          // short hand for above await isAdminOrHasAccessToImages.
         delete: isAdminOrHasAccessToImages()
    },
    admin: {
        hidden: ({ user }) => user.role !== 'admin'                 // If user is not admin then hide this collection. This will hide collection from admin panel.
    },
    upload: {
        staticURL: '/media',
        staticDir: 'media',
        imageSizes: [
            {
                name: 'thumbnail',
                width: 400,
                height: 300,
                position: 'centre'
            },
            {
                name: 'card',
                width: 768,
                height: 1024,
                position: 'centre'
            },
            {
                name: 'tablet',
                width: 1024,
                height: undefined,
                position: 'centre'
            },
        ],
        mimeTypes: ['image/*']  //.png .jpeg etc
    },
    fields: [
        {
            name: 'user',
            type: 'relationship',
            relationTo: 'users',        // creating relationship with user collection.
            required: true,
            hasMany: false,
            admin: {
                condition: () => false
            }
        }
    ]
}
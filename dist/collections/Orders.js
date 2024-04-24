"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Orders = void 0;
var personalOrder = function (_a) {
    var user = _a.req.user;
    if (user.role === 'admin')
        return true;
    // TODO: Understand the logic behind this.
    return {
        user: {
            equals: user === null || user === void 0 ? void 0 : user.id
        }
    };
};
exports.Orders = {
    slug: 'orders',
    admin: {
        useAsTitle: "Your Orders",
        description: 'A summary of all your order on Digital Bazaar'
    },
    access: {
        read: personalOrder, // can only read/see personal/own order.
        create: function (_a) {
            var req = _a.req;
            return req.user.role === 'admin';
        },
        update: function (_a) {
            var req = _a.req;
            return req.user.role === 'admin';
        },
        delete: function (_a) {
            var req = _a.req;
            return req.user.role === 'admin';
        }
    },
    fields: [
        {
            name: '_isPaid',
            type: 'checkbox',
            access: {
                read: function (_a) {
                    var req = _a.req;
                    return req.user.role === 'admin';
                },
                create: function () { return false; },
                update: function () { return false; }
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
            hasMany: true, // one order can have multiple products
        }
    ]
};

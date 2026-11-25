"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.users = exports.Products = void 0;
const graphql_tag_1 = __importDefault(require("graphql-tag"));
const server_1 = require("@apollo/server");
const standalone_1 = require("@apollo/server/standalone");
exports.Products = [
    {
        id: 1,
        name: "Coca-cola",
        price: 500,
        slug: "coca-cola"
    },
    {
        id: 2,
        name: "Pepsi",
        price: 500,
        slug: "pepsi"
    },
    {
        id: 3,
        name: "Fanta",
        price: 500,
        slug: "fanta"
    },
    {
        id: 4,
        name: "Sprite",
        price: 500,
        slug: "sprite"
    }
];
exports.users = [{
        name: "Jon Doe",
        id: 1,
        email: "jon@gmail.com",
        favorites: [1, 2]
    }, {
        name: "Mary",
        id: 2,
        email: "mary@gmail.com",
        favorites: [3, 4]
    }];
const typeDefs = (0, graphql_tag_1.default) `
type Product {
    id: ID!
    name: String!
    price: Int!
    slug: String!
}

type User {
    id: ID!
    name: String!
    email: String!
    favorites: [Product!]!
}

type Query {
    users: [User]!
    user(id: ID!): User!
    products: [Product]!
    product(id: ID!): Product!
}

type Mutation {
    addProduct(name: String!, price: Int!, slug: String!): Product!
    updateProduct(name: String!, price: Int!, slug: String!, id: Int!): Product!
    deleteProduct(id: ID!): Product!
}
`;
const resolvers = {
    User: {
        favorites: (parent, _) => {
            return parent.favorites.map((id) => exports.Products.find((p) => p.id === Number(id)));
        }
    },
    Query: {
        users: () => exports.users,
        user: (_, args) => {
            const { id } = args;
            const user = exports.users.find((u) => u.id === Number(id));
            if (!user)
                throw Error("No user with that ID");
            else
                return user;
        },
        products: (_, __, ctx) => {
            return exports.Products;
        },
        product: (_, args) => {
            const id = args.id;
            const product = exports.Products.find((product) => product.id === Number(id));
            if (!product)
                throw Error("No product with that ID");
            else
                return product;
        }
    },
    Mutation: {
        addProduct: (_, args) => {
            const { name, price, slug } = args;
            const product = { name, price, slug, id: exports.Products.length + 1 };
            exports.Products.push(product);
            return product;
        },
        updateProduct: (_, args) => {
            const { id, name, slug, price } = args;
            const product = exports.Products.find((p) => p.id === Number(id));
            if (!product)
                throw Error("Product not found");
            else {
                product.name = name ?? product.name;
                product.price = price ?? product.price;
                product.slug = slug ?? product.slug;
                return product;
            }
        },
        deleteProduct: (_, args) => {
            const { id } = args;
            const product = exports.Products.find((p) => p.id === Number(id));
            if (!product)
                throw Error("No product with that ID");
            exports.Products = exports.Products.filter((p) => p.id !== product.id);
            return exports.Products;
        }
    }
};
const main = async () => {
    const server = new server_1.ApolloServer({ typeDefs, resolvers });
    const { url } = await (0, standalone_1.startStandaloneServer)(server, {
        listen: { port: 3000 }
    });
    console.log(`server running on ${url}`);
};
main();

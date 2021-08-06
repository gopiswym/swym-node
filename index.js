import express from "express";
import { graphqlHTTP } from "express-graphql";
import { print } from "graphql";
import gql from 'graphql-tag';
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

var app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

app.use('/api/shopifygql', (req, res)=>{
    if(req.body){
        let { variables, query, pid, regid } = req.body;
        let environment = JSON.parse(process.env.SERVER_ENDPOINT);
        let serverEndpoint = environment[pid]; 
        if(serverEndpoint && serverEndpoint.swymAPIEndpoint){
            axios
            .post(serverEndpoint.swymAPIEndpoint, {
                query: `
                    ${query}
                `,
                variables,
            },{
                headers:{
                    "X-Shopify-Access-Token":process.env.TOKEN
                }
            }).then(({data})=>{
                console.log('server response', data);
                res.send(data);
            });
        }
    }
});
app.listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000/api/shopifygql');
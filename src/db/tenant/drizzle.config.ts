
    export default {
      schema: "./src/db/tenant/schema/index.ts",
      driver: "turso",
      dbCredentials: {
        url: "libsql://jr-x3eqr8k-oskarmichalkiewicz.turso.io",
        authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDgzODY4NTcsImlkIjoiMmVkOWU4YjAtY2Y4Mi0xMWVlLTg0Y2MtY2E4ODQ5YzIwMGFhIn0.rrP7LORfFyspn3Q1dcpOLqfpMIpOj4f76Ik92fvG1HtnehKvx3-iDdLTJWHxwNjk-CmQSmemHVhwCzi3DzcODw",
      },
      tablesFilter: ["!libsql_wasm_func_table"],
    }
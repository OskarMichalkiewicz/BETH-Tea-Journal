
    export default {
      schema: "./src/db/tenant/schema/index.ts",
      driver: "turso",
      dbCredentials: {
        url: "libsql://jr-jz49z2t-oskarmichalkiewicz.turso.io",
        authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDgzNzk3MzMsImlkIjoiOThlMzEzNjQtY2Y3MS0xMWVlLTg0Y2MtY2E4ODQ5YzIwMGFhIn0.9m9gnxS-rmf4uq8n2N2ftBX8zkfrdWKfXY76_fvvjxbOUnuNucvFmSEycYM0rVQlXFHlhfO4nLXSbzC52dduAQ",
      },
      tablesFilter: ["!libsql_wasm_func_table"],
    }

    export default {
      schema: "./src/db/tenant/schema/index.ts",
      driver: "turso",
      dbCredentials: {
        url: "libsql://jr-su6fob1-oskarmichalkiewicz.turso.io",
        authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDg0NzcwODksImlkIjoiNDYwYjlkOGUtZDA1NC0xMWVlLWE2MWYtNjJjMzgxOWQzM2RlIn0.lOAh5VYo_hlK21oE_3XwcKy_1ARWVk1b7UVEzNjP0M3aP2_WPA0k0602heBh_u41TdBelrrCndVLakFl3-xiBQ",
      },
      tablesFilter: ["!libsql_wasm_func_table"],
    }
export const mockSchema = {
  database_type: "postgresql",

  tables: [
    {
      name: "employees",
      columns: [
        {
          name: "id",
          type: "integer",
          nullable: false,
        },
        {
          name: "name",
          type: "varchar",
          nullable: false,
        },
        {
          name: "salary",
          type: "numeric",
          nullable: true,
        },
        {
          name: "department_id",
          type: "integer",
          nullable: true,
        },
      ],
    },

    {
      name: "departments",
      columns: [
        {
          name: "id",
          type: "integer",
          nullable: false,
        },
        {
          name: "name",
          type: "varchar",
          nullable: false,
        },
      ],
    },

    {
      name: "orders",
      columns: [
        {
          name: "id",
          type: "integer",
          nullable: false,
        },
        {
          name: "customer_id",
          type: "integer",
          nullable: false,
        },
        {
          name: "amount",
          type: "numeric",
          nullable: false,
        },
      ],
    },

    {
      name: "customers",
      columns: [
        {
          name: "id",
          type: "integer",
          nullable: false,
        },
        {
          name: "name",
          type: "varchar",
          nullable: false,
        },
        {
          name: "email",
          type: "varchar",
          nullable: false,
        },
      ],
    },

    {
      name: "payments",
      columns: [
        {
          name: "payment_id",
          type: "uuid",
          nullable: false,
        },
        {
          name: "amount",
          type: "numeric",
          nullable: false,
        },
      ],
    },
  ],

  relationships: [
    {
      from_table: "employees",
      from_column: "department_id",
      to_table: "departments",
      to_column: "id",
    },

    {
      from_table: "orders",
      from_column: "customer_id",
      to_table: "customers",
      to_column: "id",
    },
  ],
};
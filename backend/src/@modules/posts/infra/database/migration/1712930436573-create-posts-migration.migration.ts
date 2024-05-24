import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreatePostsMigration1712930436573 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "blog_posts",
        columns: [
          {
            name: "created_at",
            type: "timestamp",
            default: "now()",
          },
          {
            name: "updated_at",
            type: "timestamp",
            default: "now()",
          },
          {
            name: "deleted_at",
            type: "timestamp",
            isNullable: true,
            default: null,
          },
          {
            name: "uuid",
            type: "uuid",
            isPrimary: true,
            primaryKeyConstraintName: "PK_blog_posts",
          },
          {
            name: "title",
            type: "varchar",
          },
          {
            name: "text",
            type: "text",
          },
          {
            name: "user_uuid",
            type: "uuid",
          },
          {
            name: "like",
            type: "jsonb",
          },
          {
            name: "des_like",
            type: "jsonb",
          },
          {
            name: "images",
            isNullable: true,
            type: "jsonb",
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}

import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class MigrationCreateComments1715011744394 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "blog_comments",
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
            primaryKeyConstraintName: "PK_blog_comments",
          },
          {
            name: "comment",
            type: "text",
          },
          {
            name: "user_uuid",
            type: "uuid",
          },
          {
            name: "post_uuid",
            type: "uuid",
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}

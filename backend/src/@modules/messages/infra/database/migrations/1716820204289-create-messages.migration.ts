import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateMessagesMigration1716820204289 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "blog_messages",
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
            primaryKeyConstraintName: "PK_blog_messages",
          },
          {
            name: "chat_uuid",
            type: "uuid",
          },
          {
            name: "sender_uuid",
            type: "uuid",
          },
          {
            name: "message",
            type: "text",
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}

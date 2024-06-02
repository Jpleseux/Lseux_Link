import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateNotificationMigration1717004702141 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "blog_notifications",
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
            primaryKeyConstraintName: "PK_blog_notifications",
          },
          {
            name: "from",
            type: "uuid",
            isNullable: true,
          },
          {
            name: "to",
            type: "jsonb",
          },
          {
            name: "message",
            type: "text",
          },
          {
            name: "type",
            type: "varchar",
          },
          {
            name: "is_readed",
            type: "boolean",
          },
          {
            name: "is_invite",
            type: "boolean",
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}

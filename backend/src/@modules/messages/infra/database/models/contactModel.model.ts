import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity("blog_contacts")
export class MessagesContactModel {
  @PrimaryColumn("uuid")
  uuid: string;
  @CreateDateColumn()
  created_at?: Date;
  @UpdateDateColumn()
  updated_at?: Date;
  @DeleteDateColumn()
  deleted_at?: Date;

  @Column()
  first_user: string;
  @Column()
  second_user: string;
}

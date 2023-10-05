import {
  AfterInsert,
  BeforeInsert,
  AfterUpdate,
  AfterRemove,
  Entity,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm';

import * as bcrypt from 'bcrypt';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  accessToken: string;

  @Column({ nullable: true })
  refreshToken: string;

  @BeforeInsert()
  async encryptPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  @AfterInsert()
  logInsert() {
    console.log(`Inserted User ${this.id}`);
  }

  @AfterUpdate()
  logUpdate() {
    console.log(`Updated User ${this.id}`);
  }

  @AfterRemove()
  logRemove() {
    console.log(`Removed User ${this.id}`);
  }
}

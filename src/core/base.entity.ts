import { Exclude } from 'class-transformer';
import { Column, CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { ApiPropertyOptional } from '@nestjs/swagger';

export abstract class BaseEntity {
  constructor(o?: Partial<BaseEntity>) {
    Object.assign(this, o);
  }

  @ApiPropertyOptional()
  @PrimaryGeneratedColumn()
  public id: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt?: Date;

  @Column({ nullable: true, name: 'updated_at' })
  updatedAt?: Date;

  //Transient
  @Exclude({ toPlainOnly: true })
  public currentUser?: any;
}

import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "./role-entity";
import { User } from "./user-entity";

@Entity()
export class UserRole {
    @Type(() => Number)
    @ApiProperty({ description: 'Primary key', example: 1 })
    @PrimaryGeneratedColumn()
    id: Number;

    @Type(() => Number)
    @Column({ type: Number })
    roleId: number;

    @Type(() => Number)
    @Column({ type: Number })
    userId: number;

    @ManyToOne(
        () => User,
        (user) => user.userRoles,
        {
            cascade: true,
            onDelete: 'CASCADE',
        }
    )
    user: User;

    @ApiProperty({
        description: 'Роль'
    })
    @ManyToOne(
        () => Role,
        (role) => role.userRoles,
        {
            eager: true,
            cascade: true,
            onDelete: 'CASCADE',
        }
    )
    role: Role;

    @ApiProperty({ description: 'Когда эту роль присвоили' })
    @Type(() => Date)
    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    grantedAt: Date;


    @ManyToOne(
        () => User,
        (user) => user.creatures,
        {
            cascade: true,
            onDelete: 'SET NULL',
        }
    )
    grantedBy: User;  // кто доверил ему банхамер?
} 
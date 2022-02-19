import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, } from "typeorm";

@Entity()
export class Photo {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({type: "timestamp", default:() => "CURRENT_TIMESTAMP(6)"})
    createdAt: Date

    // @UpdateDateColumn({type:"timestamp", default:()=>"CURRENT_TIMESTAMP(6)", onUpdate:"CURRENT_TIMESTAMP(6)"})
    // updatedAt:Date

    @Column()
    fullPath: String


    // @Column()
    // photoIndex: String

    @Column()
    photoName: String

    @Column()
    articleId: number



}
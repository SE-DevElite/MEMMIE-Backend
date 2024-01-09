import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1704793193770 implements MigrationInterface {
    name = 'Migration1704793193770'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`follows\` (\`follow_id\` varchar(36) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`user_id\` varchar(36) NULL, \`following_id\` varchar(36) NULL, PRIMARY KEY (\`follow_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`friend_lists\` (\`friend_list_id\` varchar(36) NOT NULL, \`name\` varchar(100) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`friend_list_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_friend_lists\` (\`user_id\` varchar(255) NOT NULL, \`user_in_list\` varchar(255) NOT NULL, \`friend_list_id\` varchar(255) NOT NULL, PRIMARY KEY (\`user_id\`, \`user_in_list\`, \`friend_list_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`user_id\` varchar(36) NOT NULL, \`email\` varchar(100) NOT NULL, \`password\` varchar(100) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`user_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`follows\` ADD CONSTRAINT \`FK_941d172275662c2b9d8b9f4270c\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`user_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`follows\` ADD CONSTRAINT \`FK_c518e3988b9c057920afaf2d8c0\` FOREIGN KEY (\`following_id\`) REFERENCES \`users\`(\`user_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_friend_lists\` ADD CONSTRAINT \`FK_5d41298ad80815c926d0bf6dede\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`user_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_friend_lists\` ADD CONSTRAINT \`FK_c759be99fb9f06424f6085fd801\` FOREIGN KEY (\`user_in_list\`) REFERENCES \`users\`(\`user_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_friend_lists\` ADD CONSTRAINT \`FK_41607e6d068fd05e9ab00bb0985\` FOREIGN KEY (\`friend_list_id\`) REFERENCES \`friend_lists\`(\`friend_list_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_friend_lists\` DROP FOREIGN KEY \`FK_41607e6d068fd05e9ab00bb0985\``);
        await queryRunner.query(`ALTER TABLE \`user_friend_lists\` DROP FOREIGN KEY \`FK_c759be99fb9f06424f6085fd801\``);
        await queryRunner.query(`ALTER TABLE \`user_friend_lists\` DROP FOREIGN KEY \`FK_5d41298ad80815c926d0bf6dede\``);
        await queryRunner.query(`ALTER TABLE \`follows\` DROP FOREIGN KEY \`FK_c518e3988b9c057920afaf2d8c0\``);
        await queryRunner.query(`ALTER TABLE \`follows\` DROP FOREIGN KEY \`FK_941d172275662c2b9d8b9f4270c\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP TABLE \`user_friend_lists\``);
        await queryRunner.query(`DROP TABLE \`friend_lists\``);
        await queryRunner.query(`DROP TABLE \`follows\``);
    }

}

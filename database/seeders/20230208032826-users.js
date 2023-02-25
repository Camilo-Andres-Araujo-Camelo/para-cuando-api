'use strict';
const uuid = require('uuid');
const { Op } = require('sequelize');
const { hashPassword } = require('../../libs/bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    const usersSeeds = [
      {
        id: uuid.v4(),
        first_name: 'Camilo',
        last_name: 'Araujo',
        email: 'caac3095@hotmail.com',
        username: 'caac3095@hotmail.com',
        password: hashPassword('12345'),
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    try {
      await queryInterface.bulkInsert('users', usersSeeds, { transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    const userNames = ['caac3095@hotmail.com'];

    try {
      await queryInterface.bulkDelete(
        'users',
        {
          username: {
            [Op.or]: userNames,
          },
        },
        { transaction }
      );

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};

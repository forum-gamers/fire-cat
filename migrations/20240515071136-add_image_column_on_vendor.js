'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('Vendors', 'imageUrl', {
      type: Sequelize.STRING,
      defaultValue: '',
    });
    await queryInterface.addColumn('Vendors', 'imageId', {
      type: Sequelize.STRING,
      defaultValue: '',
    });
    await queryInterface.addColumn('Vendors', 'backgroundImageUrl', {
      type: Sequelize.STRING,
      defaultValue: '',
    });
    await queryInterface.addColumn('Vendors', 'backgroundImageId', {
      type: Sequelize.STRING,
      defaultValue: '',
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('Vendors', 'imageUrl');
    await queryInterface.removeColumn('Vendors', 'imageId');
    await queryInterface.removeColumn('Vendors', 'backgroundImageUrl');
    await queryInterface.removeColumn('Vendors', 'backgroundImageId');
  },
};

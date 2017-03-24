

module.exports = {
  up (queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('Person', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
    return queryInterface.bulkInsert('Roles', [{
      id: 1,
      title: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 2,
      title: 'regular',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    ], { returning: true });
  },

  down (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
    return queryInterface.bulkDelete('Roles',
      { title: ['admin', 'regular'] }
    );
  }
};
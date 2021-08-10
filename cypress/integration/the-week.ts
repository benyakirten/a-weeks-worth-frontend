describe('Performs /the-week functionality', () => {
  it('Finds its user\'s week\'s menu then edits it', () => {
    cy.visit('/auth');
    cy.get('input#email').type('test@test.com');
    cy.get('input#password').type('testpassword');

    cy.get('app-button').contains('Submit').click();

    cy.get('app-button app-loading').should('not.exist');

    cy.get('header a').contains('The Week').click();

    cy.url().should('include', '/the-week');
    cy.get('h1').should('contain', 'The Week');

    cy.get('h3').should('contain', 'No group has been selected yet. Please select one from the dropdown menu or look at your own week\'s plans.');

    cy.get('select').select('testuser\'s week');
    cy.url().should('include', '/my-week');

    cy.get('div.shopping-list__no-items h4').should('contain', 'It looks like there are no items on your shopping list. Click on edit to get started.');
    cy.get('div.meals__no-meals').should('contain', 'It looks like there\'s no meals planned for the week. Click on edit to get started.');

    cy.get('app-button').contains('Edit').click();
    cy.url().should('include', '/the-week/edit/my-week');

    cy.get('app-button').contains('Reset All Meals').click();

    cy.get('select#meal-recipe-0').select('Hamburger');
    cy.get('select#meal-recipe-2').select('Hamburger');
    cy.get('select#meal-recipe-4').select('Hamburger');

    cy.get('textarea#meal-text-1').type('Think about stuff');
    cy.get('textarea#meal-text-3').type('Become the best that I can');
    cy.get('textarea#meal-text-5').type('Eat what\'s still around the house');

    cy.get('app-button').contains('Add Week\'s Ingredients to Shopping List').click();
    cy.get('app-button').contains('Consolidate Shopping List').click();

    cy.get('app-button').contains('Submit').click();

    cy.get('app-button app-loading').should('not.exist');

    cy.url().should('include', '/the-week/my-week');

    cy.get('div.shopping-list ul li:nth-child(1) p').should('contain', '12 ounces of Meat');
    cy.get('div.shopping-list ul li:nth-child(2) p').should('contain', '6 buns of Bread');

    cy.get('div.day-mode ul li:nth-child(1) a').should('contain', 'Hamburger');
    cy.get('div.day-mode ul li:nth-child(2) div:nth-child(2) span').should('contain', 'Think about stuff');

    cy.get('button').contains('Tuesday').click();
    cy.get('div.day-mode ul li:nth-child(1) a').should('contain', 'Hamburger');
    cy.get('div.day-mode ul li:nth-child(2) div:nth-child(2) span').should('contain', 'Become the best that I can');

    cy.get('button').contains('Wednesday').click();
    cy.get('div.day-mode ul li:nth-child(1) a').should('contain', 'Hamburger');
    cy.get('div.day-mode ul li:nth-child(2) div:nth-child(2) span').should('contain', 'Eat what\'s still around the house');

    cy.get('app-button').contains('Whole week\'s meals').click();
    cy.get('li.meals__content__day__list--no-day-mode').should('have.length', 6);

    // Reset it so next e2e test works from a blank slate
    cy.get('app-button').contains('Edit').click();
    cy.get('app-button').contains('Delete Shopping List').click();
    cy.get('app-button').contains('Delete All Meals').click();
    cy.get('app-button').contains('Submit').click();

    cy.get('app-button app-loading').should('not.exist');
    cy.get('header span').contains('Logout').click();
  });
});

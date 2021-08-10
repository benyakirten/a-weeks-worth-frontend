describe('Performs /recipe functionality', () => {
  it('Examines the recipe list', () => {
    cy.visit('/recipes');
    cy.get('h1').contains('All Recipes');

    cy.get('div.center ul app-photo-card h3').contains('Hamburger').click();

    cy.get('app-recipe-detail').should('exist');
    cy.get('app-recipe-detail div.title h1').should('contain', 'Hamburger');
    cy.get('app-recipe-detail div.menu').should('not.exist');

    cy.get('app-recipe-detail ol.ingredients h2').should('contain', 'Ingredients:');
    cy.get('app-recipe-detail ol.steps h2').should('contain', 'Preparation:');

    cy.get('app-recipe-detail app-button').contains('Hide Photo').should('exist')
    cy.get('app-recipe-detail app-button').contains('Hide Photo').click();
    cy.get('app-recipe-detail app-button').contains('Hide Photo').should('not.exist');

    cy.get('app-recipe-detail app-button').contains('Show Photo').should('exist');
    cy.get('app-recipe-detail app-button').contains('Show Photo').click();
    cy.get('app-recipe-detail app-button').contains('Show Photo').should('not.exist');
  });

  it('Logs in and edits the Hamburger recipe', () => {
    cy.visit('/recipes/edit/3cc404c1-12ff-451f-9a80-d2a16f0f702c');

    cy.url()
      .should('include', 'auth')
      .should('include', 'returnUrl');

    cy.get('input#email').type('test@test.com');
    cy.get('input#password').type('testpassword');

    cy.get('app-button').contains('Submit').click();

    cy.get('app-button app-loading').should('not.exist');

    cy.url().should('include', '/recipes/edit/');
    cy.get('h1').contains('All Recipes').should('exist');

    cy.get('input#name').clear().type('hamburger');
    cy.get('input#name').clear().type('Hamburger');

    cy.get('app-recipe-form app-button').contains('Show Photo').should('exist');
    cy.get('app-recipe-form app-button').contains('Show Photo').click();
    cy.get('app-recipe-form app-button').contains('Show Photo').should('not.exist');

    cy.get('app-recipe-form app-button').contains('Hide Photo').should('exist')
    cy.get('app-recipe-form app-button').contains('Hide Photo').click();
    cy.get('app-recipe-form app-button').contains('Hide Photo').should('not.exist');

    cy.get('app-button').contains('Add Step').click();
    cy.get('textarea#step-text-2').type("Enjoy!");
    cy.get('li[ng-reflect-name=2] app-button').click();

    cy.get('app-button').contains('Save').click();
    cy.get('app-button app-loading').should('not.exist');

    cy.url().should('include', '/recipes/3cc404c1-12ff-451f-9a80-d2a16f0f702c');
    cy.get('span').contains('Logout').click();
  });

  it('Creates a recipe then delete it', () => {
    cy.visit('/auth');
    cy.get('input#email').type('test@test.com');
    cy.get('input#password').type('testpassword');

    cy.get('app-button').contains('Submit').click();

    cy.get('app-button app-loading').should('not.exist');

    cy.visit('/recipes');

    cy.get('app-button').contains('New Recipe').click();
    cy.url().should('include', '/recipes/new');

    cy.get('input#name').type('Mango');

    cy.get('input#ingredient-name-control').type('Mango');
    cy.get('input#ingredient-quantity-control').type('1 or more');
    cy.get('input#ingredient-unit-control').type('Whole');

    cy.get('textarea').type('Eat fruit');

    cy.get('app-button').contains('Save').click();

    cy.get('app-button app-loading').should('not.exist');

    cy.url().should('include', '/recipes/');
    cy.url().should('not.include', '/recipes/edit/');

    cy.get('div.center ul app-photo-card h3').should('contain', 'Mango');

    cy.get('div.menu').click();
    cy.get('button h3').contains('Delete Recipe').click();

    cy.get('app-button app-loading').should('not.exist');
    cy.url().should('include', '/recipes');

    cy.get('div.center ul app-photo-card h3').should('not.contain', 'Mango');
  });

  it('Translates a recipe then deletes it', () => {
    cy.visit('/auth');
    cy.get('input#email').type('test@test.com');
    cy.get('input#password').type('testpassword');

    cy.get('app-button').contains('Submit').click();

    cy.get('app-button app-loading').should('not.exist');

    cy.visit('/recipes');

    cy.get('app-button').contains('Translate Recipe').click();
    cy.url().should('contain', '/recipes/translate');

    cy.get('app-button').contains(/^Translate$/).should('be.disabled');
    cy.get('input#url').type('https://ricette.giallozafferano.it/Tagliatelle-al-limone-e-scampi.html');
    cy.get('app-button').contains(/^Translate$/).should('not.be.disabled');

    cy.get('app-button').contains(/^Translate$/).click();

    // This is the wrong translation, but it really doesn't matter
    cy.intercept('https://g-f-benyakir.herokuapp.com/api', { fixture: 'translation.json' });

    cy.get('app-button app-loading').should('not.exist');

    cy.get('div.center ul app-photo-card h3').should('contain', 'TORTA SALATA CON PROSCIUTTO E MOZZARELLA senza sporcare');
    cy.get('app-recipe-detail div.title h1').should('contain', 'TORTA SALATA CON PROSCIUTTO E MOZZARELLA senza sporcare');

    cy.get('div.menu').click();
    cy.get('button h3').contains('Delete Recipe').click();
    cy.get('app-button app-loading').should('not.exist');

    cy.get('div.center ul app-photo-card h3').should('not.contain', 'TORTA SALATA CON PROSCIUTTO E MOZZARELLA senza sporcare');
  });
});

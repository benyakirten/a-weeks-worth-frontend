describe('Checks the auth page and about page functionality', () => {
  it('Visits the about page, reads it, registers an account, finds the username taken, makes a different account, then returns to about page and finds the message me part. It finds the button disables, enters some text then sends a message', () => {
    cy.visit('/');
    cy.get('footer a').contains('About').click();


    cy.url().should('include', 'about');
    cy.get('h1').contains('About');
    cy.get('form').should('not.exist');

    cy.get('header a').contains('Login/Register').click();
    cy.url().should('include', 'auth');
    cy.get('h1 span').should('contain', 'Login or Register');

    cy.get('button').contains('Login').should('have.class', 'active');

    cy.get('input#email').should('exist')
    cy.get('input#username').should('not.exist');
    cy.get('input#password').should('exist');
    cy.get('input#password2').should('not.exist');

    cy.get('app-default-display-box').should('not.exist');

    cy.get('button').contains('Register').should('not.have.class', 'active').click();

    cy.get('button').contains('Login').should('not.have.class', 'active');
    cy.get('button').contains('Register').should('have.class', 'active');

    cy.get('input#email').should('exist')
    cy.get('input#username').should('exist');
    cy.get('input#password').should('exist');
    cy.get('input#password2').should('exist');

    cy.get('app-default-display-box').should('exist');

    // Register an account
    cy.get('input#email').type("a@a.com")
    cy.get('input#username').type('testuser');
    cy.get('input#password').type('testpassword');
    cy.get('input#password2').type('testpassword');

    cy.get('app-button').contains('Submit').click();

    cy.get('app-button app-loading').should('not.exist');

    // User already exists
    cy.get('app-error-display').should('exist');

    cy.get('input#email').clear().type("test@test.com")
    cy.get('input#username').clear().type('testuser');
    cy.get('input#password').clear().type('testpassword');
    cy.get('input#password2').clear().type('testpassword2');

    // The passwords don't match
    cy.get('app-button').contains('Submit').should('be.disabled');

    // Delete them and put in the passwords again
    cy.get('input#password').clear().type('testpassword');
    cy.get('input#password2').clear().type('testpassword');

    cy.get('app-button').contains('Submit').should('not.be.disabled').click();

    cy.get('app-button').contains('app-loading').should('not.exist');

    cy.url().then(val => {
      if (!val.includes('the-week')) {
        // Looks like that account already exists - user must be already registered
        // We weren't redirected
        cy.get('h1 span').should('contain', 'Login or Register');
        // and there must be an error display
        cy.get('app-error-display')
          .should('exist');

        cy.get('button').contains('Login').click();
        cy.get('input#email').clear().type('test@test.com');
        cy.get('input#password').clear().type('testpassword');

        cy.get('app-button').contains('Submit').click();

        cy.get('app-button').contains('app-loading').should('not.exist');
      }

      cy.get('h1').should('contain', 'The Week');
      cy.get('footer a').contains('About').click();

      cy.get('form').should('exist');

      cy.get('app-button button').should('be.disabled');

      cy.get('textarea').type('Test message');
      cy.get('app-button button').should('not.be.disabled')
      // Stop the test here to stop having it send me an email
      //   .click();

      // cy.get('app-button app-loading').should('not.exist');
      // cy.get('app-error-display').should('exist');

      cy.get('span').contains('Logout').click();
      cy.get('a').contains('Login/Register').should('exist');
    });
  });
});

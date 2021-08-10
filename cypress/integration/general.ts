// Note: This uses the real backend to make tests and assertions

describe('Visits URLs that dont\' require authentication', () => {
  it('Visits the home pagepage', () => {
    cy.visit('/');
    cy.get('h1').contains('A Week\'s Worth');
  });

  it('Visits the page-not-found page', () => {
    cy.visit(`/${Math.random().toString()}`);
    cy.get('h1').contains('The page you were looking for doesn\'t exist!');
  })

  it('Visits the privacy policy page from the home page', () => {
    cy.visit('/');
    // Click on the first link
    cy.get('footer a').contains("Privacy Policy").click();
    cy.url().should('include', 'privacy-policy');
    cy.get('h1').contains('Privacy Policy');
  });

  it('Auto-logs-in if the keys are present', () => {
    cy.visit('/');

    cy.get('header a').contains('Login/Register').click();

    cy.get('input#email').type('test@test.com');
    cy.get('input#password').type('testpassword');

    cy.get('app-button').contains('Submit').click();

    cy.get('app-button app-loading').should('not.exist');

    cy.reload();
    cy.get('header span').contains('Logout').should('exist');
    cy.get('header a').contains('Account').click();
    cy.url().should('include', '/account');
    cy.get('h1').should('contain', 'Account & Settings');

    cy.get('header span').contains('Logout').click();
    cy.get('header a').should('contain', 'Login/Register');
  });
});

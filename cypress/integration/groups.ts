describe('Performs the functionality of the /groups page', () => {
  it('Creates a group on one account, requests access on another, then accepts the request from the first', () => {
    // User a@a.com logs in
    cy.visit('/auth');
    cy.get('input#email').type('a@a.com');
    cy.get('input#password').type('testpassword');

    cy.get('app-button').contains('Submit').click();

    cy.get('app-button app-loading').should('not.exist');

    cy.get('header a').contains('Groups').click();

    cy.get('h1').should('contain', 'Groups');
    cy.url().should('include', '/groups');

    cy.get('button').contains('Other Groups').should('have.class', 'active');

    // Creates group
    cy.get('input#create').type('E2E Group');
    cy.get('button').contains('Create Group').click();

    cy.get('app-button app-loading').should('not.exist');

    // Now login as test@test.com to request access
    cy.get('span').contains('Logout').click();
    cy.get('header a').contains('Login/Register').click();

    cy.get('input#email').type('test@test.com');
    cy.get('input#password').type('testpassword');

    cy.get('app-button').contains('Submit').click();
    cy.get('app-button app-loading').should('not.exist');

    cy.get('header a').contains('Groups').click();
    cy.get('input#search').type('E2E Group');

    cy.get('app-button').eq(5).contains('Request Access').click();

    cy.get('span').contains('Logout').click();
    cy.get('header a').contains('Login/Register').click();

    // Now logs in as a@a.com to accept request
    cy.get('input#email').type('a@a.com');
    cy.get('input#password').type('testpassword');

    cy.get('app-button').contains('Submit').click();
    cy.get('app-button app-loading').should('not.exist');

    cy.get('header a').contains('Groups').click();

    cy.get('button').contains('My Groups').click();
    cy.get('app-button').contains('Accept Request').click();

    cy.get('app-button app-loading').should('not.exist');

    // Now logs in as test@test.com to delete group
    cy.get('span').contains('Logout').click();
    cy.get('header a').contains('Login/Register').click();

    cy.get('input#email').type('a@a.com');
    cy.get('input#password').type('testpassword');

    cy.get('app-button').contains('Submit').click();
    cy.get('app-button app-loading').should('not.exist');

    cy.get('header a').contains('Groups').click();

    cy.get('button').contains('My Groups').click();
    cy.get('app-button').contains('Delete Group').click();

    cy.get('app-button app-loading').should('not.exist');
    cy.get('h3').should('contain', `It looks like you're not in any groups. Click on Other Groups then make a new group or ask to join one.`);
  });
});

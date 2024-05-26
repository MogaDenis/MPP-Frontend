describe('LoginComponent', () => {
  beforeEach(() => {
    cy.visit('/'); // Adjust the URL if your routing is different
  });

  it('should display the login form', () => {
    cy.get('#login-email').should('be.visible');
    cy.get('#login-password').should('be.visible');
    cy.get('button').contains('Login').should('be.visible');
    cy.get('button').contains('Register').should('be.visible');
  });

  it('should show error message for empty email or password', () => {
    cy.get('button').contains('Login').click();
    cy.get('.toast-top-left').should('contain', 'Invalid data provided!');
  });

  it('should navigate to /register when clicking Register button', () => {
    cy.get('button').contains('Register').click();
    cy.url().should('include', '/register');
  });

  it('should navigate to /home on successful login', () => {
    cy.get('#login-email').type('valid@example.com');
    cy.get('#login-password').type('correctpassword');
    cy.get('button').contains('Login').click();

    cy.intercept('POST', '/api/Login', {
      statusCode: 200,
      body: { token: 'fake-jwt-token' },
    });

    cy.url().should('include', '/home');
  });
});
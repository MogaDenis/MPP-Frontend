describe('RegisterComponent', () => {
  beforeEach(() => {
    cy.visit('/register');
  });

  it('should display the registration form', () => {
    cy.get('#register-email').should('be.visible');
    cy.get('#register-password').should('be.visible');
    cy.get('#register-repeat-password').should('be.visible');
    cy.get('mat-select').should('be.visible');
    cy.get('button').contains('Sign up').should('be.visible');
    cy.get('button').contains('Cancel').should('be.visible');
  });

  it('should show error message for empty fields', () => {
    cy.get('button').contains('Sign up').click();
    cy.get('.toast-top-left').should('contain', 'Invalid data provided!');
  });

  it('should show error message for invalid email', () => {
    cy.get('#register-email').type('invalidemail');
    cy.get('#register-password').type('password123');
    cy.get('#register-repeat-password').type('password123');
    cy.get('button').contains('Sign up').click();
    cy.get('.toast-top-left').should('contain', 'Invalid email provided!');
  });

  it('should show error message for password mismatch', () => {
    cy.get('#register-email').type('user@example.com');
    cy.get('#register-password').type('password123');
    cy.get('#register-repeat-password').type('password321');
    cy.get('button').contains('Sign up').click();
    cy.get('.toast-top-left').should('contain', 'The two passwords must match!');
  });

  it('should navigate to login page on clicking Login button', () => {
    cy.get('button').contains('Cancel').click();
    cy.url().should('include', '/'); 
  });

  it('should register successfully with valid data', () => {
    cy.get('#register-email').type('user@example.com');
    cy.get('#register-password').type('password123');
    cy.get('#register-repeat-password').type('password123');
    cy.get('mat-select').click();
    cy.get('mat-option').contains('Regular').click(); // Select role
    cy.get('button').contains('Sign up').click();

    cy.intercept('POST', '/api/Register', {
      statusCode: 200,
      body: { message: 'Successfully signed up' },
    });

    cy.get('.toast-top-left').should('contain', 'Successfully signed up');
    cy.url().should('include', '/'); 
  });
});
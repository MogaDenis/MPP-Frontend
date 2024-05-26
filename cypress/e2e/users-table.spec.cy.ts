describe('OwnersTableComponent', () => {
  beforeEach(() => {
    cy.visit('/home');
    cy.get('button').contains('Users').click();
  });

  it('should display the users table with correct columns', () => {
    cy.get('table').should('be.visible');
    cy.get('th').contains('Email').should('be.visible');
    cy.get('th').contains('Role').should('be.visible');
    cy.get('th').contains('Actions').should('be.visible');
  });

  it('should display the add button', () => {
    cy.get('button').contains('Add user').should('be.visible');
  });

  it('should open the add user dialog when add button is clicked', () => {
    cy.get('button').contains('Add user').click();
    cy.get('mat-dialog-container').should('be.visible');
  });

  it('should sort users based on column header click', () => {
    cy.get('th').contains('Email').click();
  });

  it('should sort users based on column header click', () => {
    cy.get('th').contains('Role').click();
  });
});
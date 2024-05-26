describe('OwnersTableComponent', () => {
  beforeEach(() => {
    cy.visit('/home');
    cy.get('button').contains('Owners').click();
  });

  it('should display the owners table with correct columns', () => {
    cy.get('table').should('be.visible');
    cy.get('th').contains('First name').should('be.visible');
    cy.get('th').contains('Last name').should('be.visible');
    cy.get('th').contains('Actions').should('be.visible');
  });

  it('should display the add button', () => {
    cy.get('button').contains('Add owner').should('be.visible');
  });

  it('should open the add car dialog when add button is clicked', () => {
    cy.get('button').contains('Add owner').click();
    cy.get('mat-dialog-container').should('be.visible');
  });

  it('should sort owners based on column header click', () => {
    cy.get('th').contains('First name').click();
  });

  it('should sort owners based on column header click', () => {
    cy.get('th').contains('Last name').click();
  });
});
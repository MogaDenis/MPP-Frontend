describe('CarsTableComponent', () => {
  beforeEach(() => {
    cy.visit('/home');
  });

  it('should display the cars table with correct columns', () => {
    cy.get('table').should('be.visible');
    cy.get('th').contains('Make').should('be.visible');
    cy.get('th').contains('Model').should('be.visible');
    cy.get('th').contains('Colour').should('be.visible');
    cy.get('th').contains('Actions').should('be.visible');
  });

  it('should display the add button', () => {
    cy.get('button').contains('Add car').should('be.visible');
  });

  it('should open the add car dialog when add button is clicked', () => {
    cy.get('button').contains('Add car').click();
    cy.get('mat-dialog-container').should('be.visible');
  });

  it('should sort cars based on column header click', () => {
    cy.get('th').contains('Make').click();
  });

  it('should sort cars based on column header click', () => {
    cy.get('th').contains('Model').click();
  });

  it('should sort cars based on column header click', () => {
    cy.get('th').contains('Colour').click();
  });
});
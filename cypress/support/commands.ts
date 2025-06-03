import { SELECTORS } from './constants';

declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>;
      register(email: string, password: string, name: string): Chainable<void>;
      addIngredientToConstructor(ingredientName: string): Chainable<void>;
      createOrder(): Chainable<void>;
      checkOrderDetails(): Chainable<void>;
    }
  }
}

// Custom command for login
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.get(SELECTORS.EMAIL_INPUT).type(email, { force: true });
  cy.get(SELECTORS.PASSWORD_INPUT).type(password, { force: true });
  cy.get(SELECTORS.SUBMIT_BUTTON).click({ force: true });
});

// Custom command for registration
Cypress.Commands.add('register', (email: string, password: string, name: string) => {
  cy.get(SELECTORS.NAME_INPUT).type(name, { force: true });
  cy.get(SELECTORS.EMAIL_INPUT).type(email, { force: true });
  cy.get(SELECTORS.PASSWORD_INPUT).type(password, { force: true });
  cy.get(SELECTORS.SUBMIT_BUTTON).click({ force: true });
});

// Custom command for adding ingredient to constructor
Cypress.Commands.add('addIngredientToConstructor', (ingredientName: string) => {
  cy.get(SELECTORS.INGREDIENT_ITEM)
    .contains(ingredientName)
    .trigger('dragstart', { force: true })
    .trigger('drag', { force: true });
  
  cy.get(SELECTORS.CONSTRUCTOR_DROP_ZONE)
    .trigger('dragover', { force: true })
    .trigger('drop', { force: true });
});

// Custom command for creating order
Cypress.Commands.add('createOrder', () => {
  cy.get(SELECTORS.SUBMIT_BUTTON).click({ force: true });
  cy.get(SELECTORS.ORDER_NUMBER).should('be.visible');
});

// Custom command for checking order details
Cypress.Commands.add('checkOrderDetails', () => {
  cy.get(SELECTORS.ORDER_NUMBER).should('be.visible');
  cy.get(SELECTORS.ORDER_STATUS).should('be.visible');
}); 
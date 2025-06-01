import { SELECTORS } from '../support/constants';

describe('Authentication', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
  });

  describe('Login', () => {
    beforeEach(() => {
      cy.visit('/login');
      cy.wait('@getIngredients');
    });

    it('should display login form', () => {
      cy.get(SELECTORS.LOGIN_FORM).should('be.visible');
      cy.get(SELECTORS.EMAIL_INPUT).should('be.visible');
      cy.get(SELECTORS.PASSWORD_INPUT).should('be.visible');
      cy.get(SELECTORS.SUBMIT_BUTTON).should('be.visible');
    });

    it('should navigate to registration', () => {
      cy.get(SELECTORS.REGISTER_LINK).click({ force: true });
      cy.url().should('include', '/register');
    });

    it('should navigate to forgot password', () => {
      cy.get(SELECTORS.FORGOT_PASSWORD_LINK).click({ force: true });
      cy.url().should('include', '/forgot-password');
    });

    it('should show validation errors for empty fields', () => {
      cy.get(SELECTORS.SUBMIT_BUTTON).click({ force: true });
      cy.get(SELECTORS.EMAIL_ERROR).should('be.visible');
      cy.get(SELECTORS.PASSWORD_ERROR).should('be.visible');
    });

    it('should show validation error for invalid email', () => {
      cy.get(SELECTORS.EMAIL_INPUT).type('invalid-email', { force: true });
      cy.get(SELECTORS.SUBMIT_BUTTON).click({ force: true });
      cy.get(SELECTORS.EMAIL_ERROR).should('be.visible');
    });

    it('should show validation error for short password', () => {
      cy.get(SELECTORS.PASSWORD_INPUT).type('123', { force: true });
      cy.get(SELECTORS.SUBMIT_BUTTON).click({ force: true });
      cy.get(SELECTORS.PASSWORD_ERROR).should('be.visible');
    });

    it('should login successfully', () => {
      cy.intercept('POST', 'api/auth/login', {
        success: true,
        accessToken: 'test-access-token',
        refreshToken: 'test-refresh-token',
        user: {
          email: 'test@example.com',
          name: 'Test User'
        }
      }).as('loginRequest');

      cy.login('test@example.com', 'password123');
      cy.wait('@loginRequest');
      cy.url().should('not.include', '/login');
    });

    it('should show error on invalid login', () => {
      cy.intercept('POST', 'api/auth/login', {
        statusCode: 401,
        body: {
          success: false,
          message: 'Invalid credentials'
        }
      }).as('loginRequest');

      cy.login('invalid@example.com', 'wrongpassword');
      cy.wait('@loginRequest');
      cy.get(SELECTORS.ERROR_MESSAGE).should('be.visible');
    });
  });

  describe('Registration', () => {
    beforeEach(() => {
      cy.visit('/register');
      cy.wait('@getIngredients');
    });

    it('should display registration form', () => {
      cy.get(SELECTORS.REGISTER_FORM).should('be.visible');
      cy.get(SELECTORS.NAME_INPUT).should('be.visible');
      cy.get(SELECTORS.EMAIL_INPUT).should('be.visible');
      cy.get(SELECTORS.PASSWORD_INPUT).should('be.visible');
      cy.get(SELECTORS.SUBMIT_BUTTON).should('be.visible');
    });

    it('should register successfully', () => {
      cy.intercept('POST', 'api/auth/register', {
        success: true,
        accessToken: 'test-access-token',
        refreshToken: 'test-refresh-token',
        user: {
          email: 'new@example.com',
          name: 'New User'
        }
      }).as('registerRequest');

      cy.register('new@example.com', 'password123', 'New User');
      cy.wait('@registerRequest');
      cy.url().should('not.include', '/register');
    });

    it('should show error on existing email', () => {
      cy.intercept('POST', 'api/auth/register', {
        statusCode: 409,
        body: {
          success: false,
          message: 'User already exists'
        }
      }).as('registerRequest');

      cy.register('existing@example.com', 'password123', 'Existing User');
      cy.wait('@registerRequest');
      cy.get(SELECTORS.ERROR_MESSAGE).should('be.visible');
    });
  });
}); 
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
      cy.get('[data-testid="login-form"]').should('be.visible');
      cy.get('[data-testid="email-input"]').should('be.visible');
      cy.get('[data-testid="password-input"]').should('be.visible');
      cy.get('[data-testid="login-button"]').should('be.visible');
    });

    it('should show validation errors for empty fields', () => {
      cy.get('[data-testid="login-button"]').click();
      cy.get('[data-testid="email-error"]').should('be.visible');
      cy.get('[data-testid="password-error"]').should('be.visible');
    });

    it('should show validation error for invalid email', () => {
      cy.get('[data-testid="email-input"]').type('invalid-email');
      cy.get('[data-testid="login-button"]').click();
      cy.get('[data-testid="email-error"]').should('be.visible');
    });

    it('should show validation error for short password', () => {
      cy.get('[data-testid="password-input"]').type('123');
      cy.get('[data-testid="login-button"]').click();
      cy.get('[data-testid="password-error"]').should('be.visible');
    });

    it('should handle successful login', () => {
      cy.intercept('POST', 'api/auth/login', {
        success: true,
        accessToken: 'test-access-token',
        refreshToken: 'test-refresh-token',
        user: {
          email: 'test@example.com',
          name: 'Test User'
        }
      }).as('loginRequest');

      cy.get('[data-testid="email-input"]').type('test@example.com');
      cy.get('[data-testid="password-input"]').type('password123');
      cy.get('[data-testid="login-button"]').click();

      cy.wait('@loginRequest');
      cy.url().should('eq', Cypress.config().baseUrl + '/');
      cy.get('[data-testid="user-name"]').should('contain', 'Test User');
    });

    it('should handle login error', () => {
      cy.intercept('POST', 'api/auth/login', {
        statusCode: 401,
        body: {
          success: false,
          message: 'Invalid credentials'
        }
      }).as('loginRequest');

      cy.get('[data-testid="email-input"]').type('test@example.com');
      cy.get('[data-testid="password-input"]').type('wrong-password');
      cy.get('[data-testid="login-button"]').click();

      cy.wait('@loginRequest');
      cy.get('[data-testid="error-message"]').should('be.visible');
      cy.get('[data-testid="error-message"]').contains('Invalid credentials');
    });
  });

  describe('Registration', () => {
    beforeEach(() => {
      cy.visit('/register');
      cy.wait('@getIngredients');
    });

    it('should display registration form', () => {
      cy.get('[data-testid="register-form"]').should('be.visible');
      cy.get('[data-testid="name-input"]').should('be.visible');
      cy.get('[data-testid="email-input"]').should('be.visible');
      cy.get('[data-testid="password-input"]').should('be.visible');
      cy.get('[data-testid="register-button"]').should('be.visible');
    });

    it('should show validation errors for empty fields', () => {
      cy.get('[data-testid="register-button"]').click();
      cy.get('[data-testid="name-error"]').should('be.visible');
      cy.get('[data-testid="email-error"]').should('be.visible');
      cy.get('[data-testid="password-error"]').should('be.visible');
    });

    it('should handle successful registration', () => {
      cy.intercept('POST', 'api/auth/register', {
        success: true,
        accessToken: 'test-access-token',
        refreshToken: 'test-refresh-token',
        user: {
          email: 'new@example.com',
          name: 'New User'
        }
      }).as('registerRequest');

      cy.get('[data-testid="name-input"]').type('New User');
      cy.get('[data-testid="email-input"]').type('new@example.com');
      cy.get('[data-testid="password-input"]').type('password123');
      cy.get('[data-testid="register-button"]').click();

      cy.wait('@registerRequest');
      cy.url().should('eq', Cypress.config().baseUrl + '/');
      cy.get('[data-testid="user-name"]').should('contain', 'New User');
    });

    it('should handle registration error', () => {
      cy.intercept('POST', 'api/auth/register', {
        statusCode: 409,
        body: {
          success: false,
          message: 'User already exists'
        }
      }).as('registerRequest');

      cy.get('[data-testid="name-input"]').type('Existing User');
      cy.get('[data-testid="email-input"]').type('existing@example.com');
      cy.get('[data-testid="password-input"]').type('password123');
      cy.get('[data-testid="register-button"]').click();

      cy.wait('@registerRequest');
      cy.get('[data-testid="error-message"]').should('be.visible');
      cy.get('[data-testid="error-message"]').contains('User already exists');
    });
  });

  describe('Password Reset', () => {
    beforeEach(() => {
      cy.visit('/forgot-password');
      cy.wait('@getIngredients');
    });

    it('should display password reset form', () => {
      cy.get('[data-testid="reset-form"]').should('be.visible');
      cy.get('[data-testid="email-input"]').should('be.visible');
      cy.get('[data-testid="reset-button"]').should('be.visible');
    });

    it('should handle successful password reset request', () => {
      cy.intercept('POST', 'api/password-reset', {
        success: true,
        message: 'Reset email sent'
      }).as('resetRequest');

      cy.get('[data-testid="email-input"]').type('test@example.com');
      cy.get('[data-testid="reset-button"]').click();

      cy.wait('@resetRequest');
      cy.url().should('include', '/reset-password');
      cy.get('[data-testid="success-message"]').should('be.visible');
    });

    it('should handle password reset error', () => {
      cy.intercept('POST', 'api/password-reset', {
        statusCode: 404,
        body: {
          success: false,
          message: 'User not found'
        }
      }).as('resetRequest');

      cy.get('[data-testid="email-input"]').type('nonexistent@example.com');
      cy.get('[data-testid="reset-button"]').click();

      cy.wait('@resetRequest');
      cy.get('[data-testid="error-message"]').should('be.visible');
      cy.get('[data-testid="error-message"]').contains('User not found');
    });
  });

  describe('Logout', () => {
    beforeEach(() => {
      window.localStorage.setItem('accessToken', 'test-access-token');
      window.localStorage.setItem('refreshToken', 'test-refresh-token');
      cy.visit('/');
      cy.wait('@getIngredients');
    });

    afterEach(() => {
      window.localStorage.removeItem('accessToken');
      window.localStorage.removeItem('refreshToken');
    });

    it('should handle successful logout', () => {
      cy.intercept('POST', 'api/auth/logout', {
        success: true
      }).as('logoutRequest');

      cy.get('[data-testid="logout-button"]').click();
      cy.wait('@logoutRequest');

      cy.url().should('eq', Cypress.config().baseUrl + '/login');
      cy.get('[data-testid="user-name"]').should('not.exist');
    });

    it('should handle logout error', () => {
      cy.intercept('POST', 'api/auth/logout', {
        statusCode: 500,
        body: {
          success: false,
          message: 'Logout failed'
        }
      }).as('logoutRequest');

      cy.get('[data-testid="logout-button"]').click();
      cy.wait('@logoutRequest');

      cy.get('[data-testid="error-message"]').should('be.visible');
      cy.get('[data-testid="error-message"]').contains('Logout failed');
    });
  });
}); 
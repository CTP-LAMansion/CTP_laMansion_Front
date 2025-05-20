/// <reference types="cypress" />

describe('Login Page Tests', () => {
  beforeEach(() => {
    // Visitar la página de inicio de sesión antes de cada prueba
    cy.visit('https://ctplaman.netlify.app/login')
    // Esperar a que la página se cargue completamente
    cy.contains('Iniciar Sesión', { timeout: 10000 }).should('be.visible')
  })

  it('should display the login form with all required elements', () => {
    // Verificar que los elementos del formulario estén presentes
    cy.get('input[type="email"]').should('be.visible').and('have.attr', 'placeholder', 'nombre@empresa.com')
    cy.get('input[id="password"]').should('be.visible').and('have.attr', 'placeholder', '••••••••')
    cy.get('button[type="submit"]').should('be.visible').and('contain', 'Iniciar Sesión')
    cy.contains('¿No tienes una cuenta? Regístrate aquí').should('be.visible')
    cy.contains('¿Olvidaste tu contraseña? Restablécela aquí').should('be.visible')
  })

  it('should toggle password visibility when clicking the eye icon', () => {
    // Verificar que el password comience como tipo "password"
    cy.get('input[id="password"]').should('have.attr', 'type', 'password')
    
    // Hacer clic en el botón para mostrar la contraseña
    cy.get('button.focus\\:outline-none').click()
    
    // Verificar que el tipo del input haya cambiado a "text"
    cy.get('input[id="password"]').should('have.attr', 'type', 'text')
    
    // Hacer clic nuevamente para ocultar la contraseña
    cy.get('button.focus\\:outline-none').click()
    
    // Verificar que el tipo del input haya vuelto a "password"
    cy.get('input[id="password"]').should('have.attr', 'type', 'password')
  })

  it('should show error when submitting with empty fields', () => {
    // Enviar el formulario sin completar los campos
    cy.get('button[type="submit"]').click()
    
    // Verificar que aparezca el modal de error
    cy.contains('Error de autenticación').should('be.visible')
    cy.contains('Por favor completa todos los campos').should('be.visible')
    
    // Cerrar el modal
    cy.contains('Cerrar').click()
    cy.contains('Error de autenticación').should('not.exist')
  })

  it('should navigate to register page when clicking register link', () => {
    // Hacer clic en el enlace de registro
    cy.contains('¿No tienes una cuenta? Regístrate aquí').click()
    
    // Verificar que se redirige a la página de registro
    cy.url().should('include', '/register')
  })

  it('should navigate to password reset page when clicking forgot password link', () => {
    // Hacer clic en el enlace de olvido de contraseña
    cy.contains('¿Olvidaste tu contraseña? Restablécela aquí').click()
    
    // Verificar que se redirige a la página de restablecimiento de contraseña
    cy.url().should('include', '/request-password-reset')
  })

  it('should show error with incorrect credentials', () => {
    // Completar el formulario con credenciales incorrectas
    cy.get('input[type="email"]').type('usuario_incorrecto@example.com')
    cy.get('input[id="password"]').type('contraseña_incorrecta')
    
    // Enviar el formulario
    cy.get('button[type="submit"]').click()
    
    // Verificar que aparezca el modal de error con el mensaje correcto
    cy.contains('Error de autenticación', { timeout: 5000 }).should('be.visible')
    cy.contains('Credenciales incorrectas').should('be.visible')
    
    // Cerrar el modal
    cy.contains('Cerrar').click()
  })

  // Esta prueba está comentada porque requeriría credenciales reales
  /* 
  it('should login successfully with valid credentials and redirect to dashboard', () => {
    // Usar variables de entorno de Cypress para las credenciales
    const username = Cypress.env('TEST_USERNAME')
    const password = Cypress.env('TEST_PASSWORD')
    
    if (!username || !password) {
      throw new Error('TEST_USERNAME and TEST_PASSWORD must be set in cypress.env.json')
    }

    cy.get('input[type="email"]').type(username)
    cy.get('input[id="password"]').type(password, { log: false })
    cy.get('button[type="submit"]').click()

    // Verificar que se muestre el indicador de carga
    cy.contains('Verificando...').should('be.visible')
    
    // Verificar redirección exitosa al dashboard
    cy.url({ timeout: 10000 }).should('include', '/dashboard')
  })
  */
})
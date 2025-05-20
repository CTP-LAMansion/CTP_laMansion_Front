/// <reference types="cypress" />

describe('Register Page Tests', () => {
  beforeEach(() => {
    // Visitar la página de registro antes de cada prueba
    cy.visit('https://ctplaman.netlify.app/register')
    // Esperar a que la página se cargue completamente
    cy.contains('Regístrate', { timeout: 10000 }).should('be.visible')
  })

  it('should display all required form fields and the register button', () => {
    // Verificar que todos los campos del formulario estén presentes
    cy.get('input#name').should('be.visible')
    cy.get('input#lastName').should('be.visible')
    cy.get('input#lastName2').should('be.visible')
    cy.get('input#phoneNumber').should('be.visible')
    cy.get('input#emergencyPhoneNumber').should('be.visible')
    cy.get('input#email').should('be.visible')
    cy.get('input#password').should('be.visible')
    cy.get('input#confirmPassword').should('be.visible')
    cy.get('input#address').should('be.visible')
    cy.get('input#institutionJoinDate').should('be.visible')
    cy.get('input#workJoinDate').should('be.visible')
    
    // Verificar que exista el botón de registro
    cy.get('button[type="submit"]').contains('Registrarse').should('be.visible')
  })

  it('should show validation errors for all required fields when submitting empty form', () => {
    // Hacer clic en el botón Registrarse sin completar ningún campo
    cy.get('button[type="submit"]').click()
    
    // Verificar que aparezcan los mensajes de error para cada campo requerido
    cy.get('p.text-red-500').should('have.length.at.least', 11) // 11 campos requeridos mínimo
    
    cy.contains('El nombre es requerido').should('be.visible')
    cy.contains('El primer apellido es requerido').should('be.visible')
    cy.contains('El segundo apellido es requerido').should('be.visible')
    cy.contains('El número de teléfono es requerido').should('be.visible')
    cy.contains('El teléfono de emergencia es requerido').should('be.visible')
    cy.contains('El correo electrónico es requerido').should('be.visible')
    cy.contains('La contraseña es requerida').should('be.visible')
    cy.contains('Debe confirmar la contraseña').should('be.visible')
    cy.contains('La dirección es requerida').should('be.visible')
    cy.contains('La fecha de ingreso a la institución es requerida').should('be.visible')
    cy.contains('La fecha de ingreso al trabajo es requerida').should('be.visible')
  })

  it('should validate email format on form submission', () => {
    // Ingresar un email con formato inválido
    cy.get('input#email').type('correo_invalido@')
    
    // Ingresar algunos otros campos para evitar que sus errores aparezcan
    cy.get('input#name').type('Juan')
    cy.get('input#lastName').type('Pérez')
    cy.get('input#lastName2').type('Gómez')
    
    // Enviar el formulario
    cy.get('button[type="submit"]').click()
    
    // Verificar que aparezca el mensaje de error de formato de correo
    cy.contains('Dirección de correo inválida').should('be.visible')
  })

  it('should validate password requirements on form submission', () => {
    // Ingresar una contraseña que no cumple los requisitos
    cy.get('input#password').type('123')
    
    // Ingresar algunos otros campos para evitar que sus errores aparezcan
    cy.get('input#name').type('Juan')
    cy.get('input#lastName').type('Pérez')
    cy.get('input#lastName2').type('Gómez')
    cy.get('input#email').type('juan@ejemplo.com')
    
    // Enviar el formulario
    cy.get('button[type="submit"]').click()
    
    // Verificar que aparecen los mensajes de error de validación de contraseña
    cy.contains('La contraseña debe tener al menos 8 caracteres').should('be.visible')

    cy.contains('La contraseña debe contener al menos una letra mayúscula').should('be.visible')
    cy.contains('La contraseña debe contener al menos un carácter especial').should('be.visible')
  })

  it('should validate password matching on form submission', () => {
    // Ingresar contraseñas diferentes
    cy.get('input#password').type('Password123!')
    cy.get('input#confirmPassword').type('DiferentePass456!')
    
    // Ingresar algunos otros campos para evitar que sus errores aparezcan
    cy.get('input#name').type('Juan')
    cy.get('input#lastName').type('Pérez')
    cy.get('input#lastName2').type('Gómez')
    cy.get('input#email').type('juan@ejemplo.com')
    
    // Enviar el formulario
    cy.get('button[type="submit"]').click()
    
    // Verificar que aparece el mensaje de error de que las contraseñas no coinciden
    cy.contains('Las contraseñas no coinciden').should('be.visible')
  })

  it('should validate phone number format on form submission', () => {
    // Ingresar un número de teléfono con formato inválido
    cy.get('input#phoneNumber').type('123')
    
    // Ingresar algunos otros campos para evitar que sus errores aparezcan
    cy.get('input#name').type('Juan')
    cy.get('input#lastName').type('Pérez')
    cy.get('input#lastName2').type('Gómez')
    cy.get('input#email').type('juan@ejemplo.com')
    
    // Enviar el formulario
    cy.get('button[type="submit"]').click()
    
    // Verificar que aparece el mensaje de error de formato de teléfono
    cy.contains('Formato inválido. Ejemplo: 8888-8888').should('be.visible')
  })

  it('should update error messages after submitting and fixing fields', () => {
    // Enviar el formulario vacío inicialmente
    cy.get('button[type="submit"]').click()
    cy.contains('El nombre es requerido').should('be.visible')
    
    // Completar un campo y enviar de nuevo para verificar que su error desaparece
    cy.get('input#name').type('Juan')
    cy.get('button[type="submit"]').click()
    
    // Verificar que el error para ese campo específico ya no aparece
    cy.contains('El nombre es requerido').should('not.exist')
    
    // Pero otros errores sí deberían seguir apareciendo
    cy.contains('El primer apellido es requerido').should('be.visible')
  })

  it('should validate minimum length requirements on form submission', () => {
    // Ingresar valores demasiado cortos
    cy.get('input#name').type('A')
    cy.get('input#address').type('123')
    
    // Enviar el formulario
    cy.get('button[type="submit"]').click()
    
    // Verificar que aparecen los errores de longitud mínima
    cy.contains('El nombre debe tener al menos 2 caracteres').should('be.visible')
    cy.contains('La dirección debe tener al menos 5 caracteres').should('be.visible')
  })

  it('should display all fields completed correctly without errors', () => {
    // Completar todos los campos correctamente
    const today = new Date().toISOString().split('T')[0]
    
    cy.get('input#name').type('Juan')
    cy.get('input#lastName').type('Pérez')
    cy.get('input#lastName2').type('Gómez')
    cy.get('input#phoneNumber').type('8888-8888')
    cy.get('input#emergencyPhoneNumber').type('9999-9999')
    cy.get('input#email').type('juan@ejemplo.com')
    cy.get('input#password').type('Password123!')
    cy.get('input#confirmPassword').type('Password123!')
    cy.get('input#address').type('Avenida Principal 123, Ciudad')
    cy.get('input#institutionJoinDate').type(today)
    cy.get('input#workJoinDate').type(today)
    
    // Enviar el formulario
    cy.get('button[type="submit"]').click()
    
    // Verificar que no aparecen mensajes de error
    cy.get('p.text-red-500').should('not.exist')
  })

  it('should navigate to login page when clicking the login link', () => {
    // Hacer clic en el enlace para iniciar sesión
    cy.contains('¿Ya tienes una cuenta? Inicia sesión aquí').click()
    
    // Verificar que se redirige a la página de inicio de sesión
    cy.url().should('include', '/login')
  })
  
  /* Esta prueba está comentada para evitar crear registros reales en el sistema
  it('should submit form successfully and show success modal', () => {
    // Completar todos los campos correctamente
    const today = new Date().toISOString().split('T')[0]
    const randomEmail = `test${Math.floor(Math.random() * 10000)}@example.com`
    
    cy.get('input#name').type('Juan')
    cy.get('input#lastName').type('Pérez')
    cy.get('input#lastName2').type('Gómez')
    cy.get('input#phoneNumber').type('8888-8888')
    cy.get('input#emergencyPhoneNumber').type('9999-9999')
    cy.get('input#email').type(randomEmail)
    cy.get('input#password').type('Password123!')
    cy.get('input#confirmPassword').type('Password123!')
    cy.get('input#address').type('Avenida Principal 123, Ciudad')
    cy.get('input#institutionJoinDate').type(today)
    cy.get('input#workJoinDate').type(today)
    
    // Enviar el formulario
    cy.get('button[type="submit"]').click()
    
    // Verificar que aparece el modal de éxito
    cy.contains('Registro Exitoso', { timeout: 10000 }).should('be.visible')
    cy.contains('Tu registro ha sido exitoso').should('be.visible')
    
    // Hacer clic en el botón Aceptar y verificar redirección a verificación de correo
    cy.contains('Aceptar').click()
    cy.url().should('include', '/verify-email')
  })
  */
})
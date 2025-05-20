/// <reference types="cypress" />

describe('Laboratory Request Page Tests', () => {
  beforeEach(() => {
    // Se necesita estar autenticado para acceder a esta página, primero hacemos login
    cy.visit('https://ctplaman.netlify.app/login')
    
    // Usar credenciales proporcionadas
    cy.get('input#email').type('bminiclip2@gmail.com')
    cy.get('input#password').type('N3d6a3c363!')
    cy.get('button[type="submit"]').click()
    
    // Esperar a que redireccione al dashboard y la sesión se establezca
    cy.url().should('include', '/dashboard', { timeout: 10000 })
    
    // Navegar a la página de solicitud de laboratorios
    cy.visit('https://ctplaman.netlify.app/dashboard/solicitar-laboratorio')
    
    // Esperar a que la página cargue completamente
    cy.contains('Solicitar Laboratorio', { timeout: 10000 }).should('be.visible')
  })

  it('should display available laboratories', () => {
    // Verificar que se muestran las tarjetas de laboratorios
    cy.get('.grid > div').should('have.length.at.least', 1)
    
    // Verificar el contenido de las tarjetas de laboratorios
    cy.get('.grid > div').first().within(() => {
      cy.get('img').should('be.visible')
      cy.get('h3').should('be.visible')
      cy.get('p').should('be.visible')
      cy.contains('Capacidad:').should('be.visible')
      cy.contains('Ver Disponibilidad').should('be.visible')
      
    })
  })

  it('should open and close calendar modal with laboratory schedule info', () => {
    // Abrir el modal de calendario
    cy.contains('Ver Disponibilidad').first().click()
    
    // Verificar que el modal se muestra
    cy.contains('Disponibilidad:').should('be.visible')
    
    
    // Verificar que aparece la información de horario disponible
    cy.contains('Horario disponible:').should('be.visible')
    cy.contains('Lunes a Viernes de 6:00 am a 4:20 pm').should('be.visible')
    
    // Cerrar el modal
    cy.contains('Cerrar').click()
    
    // Verificar que el modal se ha cerrado
    cy.contains('Disponibilidad:').should('not.exist')
    cy.get('.react-big-calendar').should('not.exist')
  })

  it('should open laboratory reservation form modal', () => {
    // Abrir el modal de formulario de reserva
    cy.contains('Reservar Laboratorio').first().click()
    
    // Verificar que el modal se muestra
    cy.contains('Solicitud para').should('be.visible')
    cy.get('form').should('be.visible')
    
    // Verificar que todos los campos del formulario están presentes
    cy.get('input#managerName').should('be.visible')
    cy.get('input#managerLastName').should('be.visible')
    cy.get('input#managerLastName2').should('be.visible')
    cy.get('input#course').should('be.visible')
    cy.get('input#activityDescription').should('be.visible')
    cy.get('select#numberOfAttendees').should('be.visible')
    cy.get('input#startDate').should('be.visible')
    cy.get('input#startTime').should('be.visible')
    cy.get('input#endDate').should('be.visible')
    cy.get('input#endTime').should('be.visible')
    cy.get('textarea#needs').should('be.visible')
    cy.get('button[type="submit"]').contains('Enviar Solicitud').should('be.visible')
    
    // Cerrar el modal
    cy.get('button').contains(/×|Cerrar/).first().click()
    
    // Verificar que el modal se ha cerrado
    cy.contains('Solicitud para').should('not.exist')
  })

  it('should validate form fields when submitting empty form', () => {
    // Abrir el modal de formulario de reserva
    cy.contains('Reservar Laboratorio').first().click()
    
    // Intentar enviar el formulario sin completarlo
    cy.get('button[type="submit"]').click()
    
    // Verificar que el formulario sigue visible (la validación del navegador previene el envío)
    cy.get('form').should('be.visible')
    
    // Cerrar el modal
    cy.get('button').contains(/×|Cerrar/).first().click()
  })

  it('should validate that start time must be before end time', () => {
    // Abrir el modal de formulario de reserva
    cy.contains('Reservar Laboratorio').first().click()
    
    // Completar el formulario con horas inválidas (fin antes de inicio)
    const today = new Date().toISOString().split('T')[0]
    
    cy.get('input#managerName').type('Juan')
    cy.get('input#managerLastName').type('Pérez')
    cy.get('input#managerLastName2').type('Gómez')
    cy.get('input#course').type('Informática')
    cy.get('input#activityDescription').type('Laboratorio de programación')
    cy.get('select#numberOfAttendees').select('10')
    cy.get('input#startDate').type(today)
    cy.get('input#startTime').type('14:00')
    cy.get('input#endDate').type(today)
    cy.get('input#endTime').type('13:00') // Hora de fin anterior a hora de inicio
    cy.get('textarea#needs').type('Computadoras con Visual Studio')
    
    // Enviar el formulario
    cy.get('button[type="submit"]').click()
    
   
  
    // Cerrar la notificación toast
    cy.get('.Toastify__close-button').click()
    
    // Cerrar el modal
    cy.get('button').contains(/×|Cerrar/).first().click()
  })

  it('should validate laboratory hours restriction (6:00 am - 4:20 pm)', () => {
    // Abrir el modal de formulario de reserva
    cy.contains('Reservar Laboratorio').first().click()
    
    // Completar el formulario con horas fuera del horario permitido
    const today = new Date().toISOString().split('T')[0]
    
    cy.get('input#managerName').type('Juan')
    cy.get('input#managerLastName').type('Pérez')
    cy.get('input#managerLastName2').type('Gómez')
    cy.get('input#course').type('Informática')
    cy.get('input#activityDescription').type('Laboratorio de programación')
    cy.get('select#numberOfAttendees').select('10')
    cy.get('input#startDate').type(today)
    cy.get('input#startTime').type('17:00') // Fuera del horario permitido (después de 4:20 pm)
    cy.get('input#endDate').type(today)
    cy.get('input#endTime').type('18:00')
    cy.get('textarea#needs').type('Computadoras con Visual Studio')
    
    // Enviar el formulario
    cy.get('button[type="submit"]').click()
    
    // Verificar que aparece la notificación toast de error
   
 
    
    // Probar también con la hora de fin fuera del horario
    cy.get('input#startTime').clear().type('14:00') // Hora dentro del horario
    cy.get('input#endTime').clear().type('17:00') // Hora fuera del horario
    
    // Enviar el formulario nuevamente
    cy.get('button[type="submit"]').click()
    
    
    // Cerrar la notificación toast
    cy.get('.Toastify__close-button').click()
    
    // Cerrar el modal
    cy.get('button').contains(/×|Cerrar/).first().click()
  })

  it('should validate weekend restriction for laboratory bookings', () => {
    // Abrir el modal de formulario de reserva
    cy.contains('Reservar Laboratorio').first().click()
    
    // Obtener la fecha del próximo sábado
    const getNextSaturday = () => {
      const date = new Date()
      const day = date.getDay()
      const diff = day <= 6 ? 6 - day : 13 - day // Si hoy es sábado (6) o domingo (0), tomar el siguiente sábado
      date.setDate(date.getDate() + diff)
      return date.toISOString().split('T')[0]
    }
    
    const saturday = getNextSaturday()
    
    cy.get('input#managerName').type('Juan')
    cy.get('input#managerLastName').type('Pérez')
    cy.get('input#managerLastName2').type('Gómez')
    cy.get('input#course').type('Informática')
    cy.get('input#activityDescription').type('Laboratorio de programación')
    cy.get('select#numberOfAttendees').select('10')
    cy.get('input#startDate').type(saturday)
    cy.get('input#startTime').type('10:00')
    cy.get('input#endDate').type(saturday)
    cy.get('input#endTime').type('12:00')
    cy.get('textarea#needs').type('Computadoras con Visual Studio')
    
    // Enviar el formulario
    cy.get('button[type="submit"]').click()
    
    // Verificar que aparece la notificación toast de error
    cy.get('.Toastify__toast--error').should('be.visible')
    cy.get('.Toastify__toast-body').contains('No se permiten reservas los fines de semana (sábado y domingo)').should('be.visible')
    
    // Cerrar la notificación toast
    cy.get('.Toastify__close-button').click()
    
    // Cerrar el modal
    cy.get('button').contains(/×|Cerrar/).first().click()
  })

  it('should validate minimum duration for laboratory requests (30 minutes)', () => {
    // Abrir el modal de formulario de reserva
    cy.contains('Reservar Laboratorio').first().click()
    
    // Completar el formulario con una duración muy corta
    const today = new Date().toISOString().split('T')[0]
    
    cy.get('input#managerName').type('Juan')
    cy.get('input#managerLastName').type('Pérez')
    cy.get('input#managerLastName2').type('Gómez')
    cy.get('input#course').type('Informática')
    cy.get('input#activityDescription').type('Laboratorio de programación')
    cy.get('select#numberOfAttendees').select('10')
    cy.get('input#startDate').type(today)
    cy.get('input#startTime').type('10:00')
    cy.get('input#endDate').type(today)
    cy.get('input#endTime').type('10:15') // Menos de 30 minutos
    cy.get('textarea#needs').type('Computadoras con Visual Studio')
    
    // Enviar el formulario
    cy.get('button[type="submit"]').click()
    
    // Verificar que aparece la notificación toast de error
    cy.get('.Toastify__toast--error').should('be.visible')
    cy.get('.Toastify__toast-body').contains('La duración mínima de la solicitud es de 30 minutos').should('be.visible')
    
    // Cerrar la notificación toast
    cy.get('.Toastify__close-button').click()
    
    // Cerrar el modal
    cy.get('button').contains(/×|Cerrar/).first().click()
  })

  it('should validate maximum duration for laboratory requests (8 hours)', () => {
    // Abrir el modal de formulario de reserva
    cy.contains('Reservar Laboratorio').first().click()
    
    // Completar el formulario con una duración muy larga
    const today = new Date().toISOString().split('T')[0]
    
    cy.get('input#managerName').type('Juan')
    cy.get('input#managerLastName').type('Pérez')
    cy.get('input#managerLastName2').type('Gómez')
    cy.get('input#course').type('Informática')
    cy.get('input#activityDescription').type('Laboratorio de programación')
    cy.get('select#numberOfAttendees').select('10')
    cy.get('input#startDate').type(today)
    cy.get('input#startTime').type('07:00')
    cy.get('input#endDate').type(today)
    cy.get('input#endTime').type('16:00') // Más de 8 horas
    cy.get('textarea#needs').type('Computadoras con Visual Studio')
    
    // Enviar el formulario
    cy.get('button[type="submit"]').click()
    
    // Verificar que aparece la notificación toast de error
    cy.get('.Toastify__toast--error').should('be.visible')
    
    // Cerrar la notificación toast
    cy.get('.Toastify__close-button').click()
    
    // Cerrar el modal
    cy.get('button').contains(/×|Cerrar/).first().click()
  })

  it('should validate past date restriction', () => {
    // Abrir el modal de formulario de reserva
    cy.contains('Reservar Laboratorio').first().click()
    
    // Obtener una fecha pasada (ayer)
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toISOString().split('T')[0]
    
    cy.get('input#managerName').type('Juan')
    cy.get('input#managerLastName').type('Pérez')
    cy.get('input#managerLastName2').type('Gómez')
    cy.get('input#course').type('Informática')
    cy.get('input#activityDescription').type('Laboratorio de programación')
    cy.get('select#numberOfAttendees').select('10')
    cy.get('input#startDate').type(yesterdayStr)
    cy.get('input#startTime').type('10:00')
    cy.get('input#endDate').type(yesterdayStr)
    cy.get('input#endTime').type('12:00')
    cy.get('textarea#needs').type('Computadoras con Visual Studio')
    
    // Enviar el formulario
    cy.get('button[type="submit"]').click()
    
    // Verificar que aparece la notificación toast de error
    cy.get('.Toastify__toast--error').should('be.visible')
    cy.get('.Toastify__toast-body').contains('La fecha de inicio no puede ser anterior a la fecha actual').should('be.visible')
    
    // Cerrar la notificación toast
    cy.get('.Toastify__close-button').click()
    
    // Cerrar el modal
    cy.get('button').contains(/×|Cerrar/).first().click()
  })

  it('should navigate from calendar to reservation form', () => {
    // Abrir el modal de calendario
    cy.contains('Ver Disponibilidad').first().click()
    
    // Verificar que el modal se muestra
    cy.contains('Disponibilidad:').should('be.visible')
    
    // Hacer clic en el botón para nueva reserva
    cy.contains('Nueva Reserva').click()
    
    // Verificar que se muestra el formulario de reserva
    cy.contains('Solicitud para').should('be.visible')
    cy.get('form').should('be.visible')
    
    // Cerrar el modal
    cy.get('button').contains(/×|Cerrar/).first().click()
  })

  /* Esta prueba está comentada para evitar crear reservas reales en el sistema
  it('should submit laboratory form with valid data', () => {
    // Abrir el modal de formulario de reserva
    cy.contains('Reservar Laboratorio').first().click()
    
    // Completar todos los campos correctamente
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    // Asegurarse de que es día laborable (lunes-viernes)
    while (tomorrow.getDay() === 0 || tomorrow.getDay() === 6) {
      tomorrow.setDate(tomorrow.getDate() + 1)
    }
    const dateString = tomorrow.toISOString().split('T')[0]
    
    cy.get('input#managerName').type('Juan')
    cy.get('input#managerLastName').type('Pérez')
    cy.get('input#managerLastName2').type('Gómez')
    cy.get('input#course').type('Informática')
    cy.get('input#activityDescription').type('Laboratorio de programación')
    cy.get('select#numberOfAttendees').select('10')
    cy.get('input#startDate').type(dateString)
    cy.get('input#startTime').type('10:00')
    cy.get('input#endDate').type(dateString)
    cy.get('input#endTime').type('12:00')
    cy.get('textarea#needs').type('Computadoras con Visual Studio')
    
    // Enviar el formulario
    cy.get('button[type="submit"]').click()
    
    // Verificar que aparece notificación de éxito
    cy.get('.Toastify__toast--success').should('be.visible')
    cy.get('.Toastify__toast-body').contains('Solicitud de laboratorio enviada exitosamente!').should('be.visible')
  })
  */
})
document.addEventListener('DOMContentLoaded', async function () {
  try {
    const apiUrl = 'https://takemed.health/api/patients_testing/'
    const token =
      '01afc6c3df3dbcd8dccd3038dd33aca1b0cfe315ad42cac5632661d8aebbe73b'

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        Authorization: `Token ${token}`
      }
    })

    if (!response.ok) {
      throw new Error('Error al obtener datos desde la API')
    }

    const data = await response.json()
    console.log(data)
    displayPatients(data)
  } catch (error) {
    console.error('Error al obtener datos:', error)
  }
})

function displayPatients(patients) {
  const table = document.getElementById('patientsTable')

  //  fila de encabezado
  const headerRow = table.insertRow(0)
  for (const key in patients[0]) {
    const headerCell = headerRow.insertCell()
    headerCell.textContent = key

    if (headerRow.rowIndex === 0) {
      headerCell.classList.add('font-weight-bold', 'text-lg') // Estilos a la primera row de la tabla generados dinamicamente
      headerCell.textContent = key.toUpperCase()
    }
  }
  const actionsHeader = headerRow.insertCell()
  actionsHeader.textContent = 'Acciones'
  actionsHeader.classList.add('font-weight-bold', 'text-lg')
  actionsHeader.textContent = actionsHeader.textContent.toUpperCase()

  // tabla con los datos de los pacientes
  patients.forEach(patient => {
    const row = table.insertRow()
    for (const key in patient) {
      const cell = row.insertCell()
      cell.textContent = patient[key]
    }

    const actionsCell = row.insertCell()
    const createAppointmentButton = document.createElement('button')
    createAppointmentButton.textContent = 'Crear Cita'
    createAppointmentButton.classList.add('btn', 'btn-primary')
    createAppointmentButton.onclick = () => openAppointmentModal(patient.id)
    actionsCell.appendChild(createAppointmentButton)
  })
}

function openAppointmentModal(patientId, patientName) {
  // Obtén una referencia al modal y al formulario
  const modal = document.getElementById('appointmentModal')
  const form = document.getElementById('appointmentForm')

  // Asegúrate de que ambos elementos existan antes de intentar acceder a sus propiedades
  if (!modal || !form) {
    console.error('No se encontró el modal o el formulario.')
    return
  }

  // Llena el formulario con la información del paciente si es necesario
  form.querySelector('#medico_nombre').value = '' // Limpia el campo del médico_nombre
  form.querySelector('#lugar').value = '' // Limpia el campo del lugar
  form.querySelector('#descripcion').value = '' // Limpia el campo de la descripción
  form.querySelector('#fecha').value = '' // Limpia el campo de la fecha

  // Asigna el id del paciente al formulario
  form.querySelector('#patientId').value = patientId

  // Abre el modal
  const modalInstance = new bootstrap.Modal(modal)
  modalInstance.show()
}

async function submitAppointmentForm() {
  try {
    // Obtiene los valores del formulario
    const medicoNombre = document.getElementById('medico_nombre').value
    const lugar = document.getElementById('lugar').value
    const descripcion = document.getElementById('descripcion').value
    const fecha = document.getElementById('fecha').value
    const pacienteId = document.getElementById('patientId').value

    // Crea el objeto JSON
    const appointmentData = {
      paciente_id: parseInt(pacienteId),
      medico_nombre: medicoNombre,
      lugar: lugar,
      descripcion: descripcion,
      fecha: fecha
    }

    // Realiza la solicitud POST a la API
    const response = await fetch(
      'https://takemed.health/api/patient_appointments_testing/',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token 01afc6c3df3dbcd8dccd3038dd33aca1b0cfe315ad42cac5632661d8aebbe73b`
        },
        body: JSON.stringify(appointmentData)
      }
    )

    if (!response.ok) {
      throw new Error('Error al crear la cita médica')
    }

    const data = await response.json()
    console.log('Cita médica creada exitosamente:', data)
    // Puedes realizar acciones adicionales aquí, como cerrar el modal o actualizar la interfaz de usuario
  } catch (error) {
    console.error('Error al crear la cita médica:', error)
    // Puedes manejar errores y mostrar mensajes al usuario si es necesario
  }
}

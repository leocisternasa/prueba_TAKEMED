document.addEventListener('DOMContentLoaded', async function () {
  document.addEventListener('submit', submitAppointmentForm)
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

  const headerRow = table.insertRow(0)
  for (const key in patients[0]) {
    const headerCell = headerRow.insertCell()
    headerCell.textContent = key

    if (headerRow.rowIndex === 0) {
      headerCell.classList.add('font-weight-bold', 'text-lg')
      headerCell.textContent = key.toUpperCase()
      headerCell.setAttribute('scope', 'col')
    }
  }
  const appointemntsHeader = headerRow.insertCell()
  appointemntsHeader.textContent = 'Agendar Cita'
  appointemntsHeader.classList.add('font-weight-bold', 'text-lg')
  appointemntsHeader.textContent = appointemntsHeader.textContent.toUpperCase()

  patients.forEach(patient => {
    const row = table.insertRow()
    for (const key in patient) {
      const cell = row.insertCell()
      cell.textContent = patient[key]
    }

    const appointmentCell = row.insertCell()
    const createAppointmentButton = document.createElement('button')
    createAppointmentButton.textContent = 'Crear Cita'
    createAppointmentButton.classList.add('btn', 'btn-primary')
    createAppointmentButton.onclick = () => openAppointmentModal(patient.id)
    appointmentCell.appendChild(createAppointmentButton)
  })
}

function openAppointmentModal(patientId, patientName) {
  const modal = document.getElementById('appointmentModal')
  const form = document.getElementById('appointmentForm')

  if (!modal || !form) {
    console.error('No se encontró el modal o el formulario.')
    return
  }

  form.querySelector('#medico_nombre').value = ''
  form.querySelector('#lugar').value = ''
  form.querySelector('#descripcion').value = ''
  form.querySelector('#fecha').value = ''

  form.querySelector('#patientId').value = patientId

  const modalInstance = new bootstrap.Modal(modal)
  modalInstance.show()
}

function closeAppointmentModal() {
  const modal = document.getElementById('appointmentModal')

  if (!modal) {
    console.error('No se encontró el modal o el formulario.')
    return
  }

  const modalInstance = bootstrap.Modal.getInstance(modal)
  modalInstance.hide()
}

function openSuccessModal() {
  const modal = document.getElementById('successModal')

  if (!modal) {
    console.error('No se encontró el modal o el formulario.')
    return
  }

  const modalInstance = new bootstrap.Modal(modal)
  modalInstance.show()
}

function openErrorModal() {
  const modal = document.getElementById('errorModal')

  if (!modal) {
    console.error('No se encontró el modal o el formulario.')
    return
  }

  const modalInstance = new bootstrap.Modal(modal)
  modalInstance.show()
}

async function submitAppointmentForm(e) {
  e.preventDefault()
  try {
    const medicoNombre = document.getElementById('medico_nombre').value
    const lugar = document.getElementById('lugar').value
    const descripcion = document.getElementById('descripcion').value
    const fecha = document.getElementById('fecha').value
    const pacienteId = document.getElementById('patientId').value

    const appointmentData = {
      paciente_id: parseInt(pacienteId),
      medico_nombre: medicoNombre,
      lugar: lugar,
      descripcion: descripcion,
      fecha: fecha
    }

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
    closeAppointmentModal()
    openSuccessModal()
  } catch (error) {
    console.error('Error al crear la cita médica:', error)
    openErrorModal()
  }
}
async function inicializarMapa() {
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

    const newData = data.map(paciente => {
      const coordenadasArray = paciente.ubicacion.split(',')
      return {
        ...paciente,
        ubicacion: {
          lat: parseFloat(coordenadasArray[0]),
          long: parseFloat(coordenadasArray[1])
        }
      }
    })

    if (
      data.length > 0 &&
      typeof newData[0].ubicacion.lat === 'number' &&
      typeof newData[0].ubicacion.long === 'number'
    ) {
      const primeraUbicacion = newData[0].ubicacion
      const mapa = new google.maps.Map(document.getElementById('mapa'), {
        center: { lat: primeraUbicacion.lat, lng: primeraUbicacion.long },
        zoom: 5
      })

      for (const paciente of newData) {
        const ubicacion = paciente.ubicacion

        if (
          typeof ubicacion.lat === 'number' &&
          typeof ubicacion.long === 'number'
        ) {
          new google.maps.Marker({
            position: { lat: ubicacion.lat, lng: ubicacion.long },
            map: mapa,
            title: `${paciente.nombre} ${paciente.apellido}`
          })

          console.log('llego aqui')
        }
      }
    } else {
      console.error('Datos de ubicación no válidos o no disponibles.')
    }
  } catch (error) {
    console.error('Error al obtener datos de ubicación:', error)
  }
}

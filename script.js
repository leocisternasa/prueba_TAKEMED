const API_URL = 'https://takemed.health/api/patients_testing/'
const TOKEN = '01afc6c3df3dbcd8dccd3038dd33aca1b0cfe315ad42cac5632661d8aebbe73b'
const CREATE_APPOINTMENT_URL =
  ' https://takemed.health/api/patient_appointments_testing/'

document.addEventListener('DOMContentLoaded', async function () {
  document.addEventListener('submit', submitAppointmentForm)
  try {
    const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
        Authorization: `Token ${TOKEN}`
      }
    })

    if (!response.ok) {
      throw new Error('Error al obtener datos desde la API')
    }
    const patients = await response.json()
    displayPatients(patients)
  } catch (error) {
    console.error('Error al obtener datos:', error)
  }
})

function displayPatients(patients) {
  const table = document.getElementById('patientsTable')
  patients.forEach(patient => {
    const row = table.insertRow()
    for (const patientAttribute in patient) {
      const cell = row.insertCell()
      if (patientAttribute === 'genero') {
        cell.textContent =
          patient[patientAttribute] === 'MAL' ? 'Masculino' : 'Femenino'
      } else {
        cell.textContent = patient[patientAttribute]
      }
    }
    const appointmentCell = row.insertCell()
    const createAppointmentButton = document.createElement('button')
    createAppointmentButton.textContent = 'Crear Cita'
    createAppointmentButton.classList.add('btn', 'btn-primary')
    createAppointmentButton.onclick = () => openAppointmentModal(patient.id)
    appointmentCell.appendChild(createAppointmentButton)
  })

  const headerThead = document.getElementById('patientsTableHeader')
  const headerRow = document.createElement('tr')
  for (const key in patients[0]) {
    const headerCell = document.createElement('th')
    headerCell.innerHTML = key.replace('_', ' ').toUpperCase()
    headerRow.appendChild(headerCell)
  }
  const headerCell = document.createElement('th')
  headerCell.innerHTML = 'Agendar Cita'.toUpperCase()
  headerRow.appendChild(headerCell)
  headerThead.appendChild(headerRow)
}

function openAppointmentModal(patientId) {
  const modal = document.getElementById('appointmentModal')
  const form = document.getElementById('appointmentForm')

  if (!modal || !form) {
    console.error('No se encontró el modal o el formulario.')
    return
  }

  form.querySelector('#practicionerName').value = ''
  form.querySelector('#place').value = ''
  form.querySelector('#description').value = ''
  form.querySelector('#date').value = ''

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
    const practicionerName = document.getElementById('practicionerName').value
    const place = document.getElementById('place').value
    const description = document.getElementById('description').value
    const date = document.getElementById('date').value
    const patientId = document.getElementById('patientId').value

    const appointmentData = {
      paciente_id: parseInt(patientId),
      medico_nombre: practicionerName,
      lugar: place,
      descripcion: description,
      fecha: date
    }

    const response = await fetch(CREATE_APPOINTMENT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${TOKEN}`
      },
      body: JSON.stringify(appointmentData)
    })

    if (!response.ok) {
      throw new Error('Error al crear la cita médica')
    }

    const data = await response.json()
    closeAppointmentModal()
    openSuccessModal()
  } catch (error) {
    console.error('Error al crear la cita médica:', error)
    openErrorModal()
  }
}
async function initializeMap() {
  try {
    const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
        Authorization: `Token ${TOKEN}`
      }
    })

    if (!response.ok) {
      throw new Error('Error al obtener datos desde la API')
    }

    const data = await response.json()

    const patients = data.map(patient => {
      const coordinatesArray = patient.ubicacion.split(',')
      return {
        ...patient,
        location: {
          lat: parseFloat(coordinatesArray[0]),
          long: parseFloat(coordinatesArray[1])
        }
      }
    })

    if (
      data.length > 0 &&
      typeof patients[3].location.lat === 'number' &&
      typeof patients[3].location.long === 'number'
    ) {
      const coordinates = patients[3].location
      const mapa = new google.maps.Map(document.getElementById('map'), {
        center: { lat: coordinates.lat, lng: coordinates.long },
        zoom: 5
      })

      for (const patient of patients) {
        const location = patient.location

        if (
          typeof location.lat === 'number' &&
          typeof location.long === 'number'
        ) {
          new google.maps.Marker({
            position: { lat: location.lat, lng: location.long },
            map: mapa,
            title: `${patient.nombre} ${patient.apellido}`
          })
        }
      }
    } else {
      console.error('Datos de ubicación no válidos o no disponibles.')
    }
  } catch (error) {
    console.error('Error al obtener datos de ubicación:', error)
  }
}

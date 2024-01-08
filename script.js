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

  // Crea la fila de encabezado
  const headerRow = table.insertRow(0)
  for (const key in patients[0]) {
    const headerCell = headerRow.insertCell()
    headerCell.textContent = key
  }

  // Llena la tabla con los datos de los pacientes
  patients.forEach(patient => {
    const row = table.insertRow()
    for (const key in patient) {
      const cell = row.insertCell()
      cell.textContent = patient[key]
    }
  })
}
